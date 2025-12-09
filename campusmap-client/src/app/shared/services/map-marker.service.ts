import { Injectable, inject } from '@angular/core';
import maplibregl from 'maplibre-gl';
import { PlaceFeature } from '@shared/types/place.model';
import { TranslateService } from '@ngx-translate/core';

interface MarkerWithMetadata extends maplibregl.Marker {
  updateLabelVisibility: () => void;
  labelElement: HTMLDivElement;
  buildingName: string;
}

@Injectable({ providedIn: 'root' })
export class MapMarkerService {
  private readonly translate = inject(TranslateService);
  private markers: MarkerWithMetadata[] = [];

  private readonly colorMap: Record<string, string> = {
    blue: '#219ed4',
    orange: '#fa7921',
    yellow: '#f6c644',
    green: '#3da93d'
  };

  createPlaceMarker(
    map: maplibregl.Map,
    feature: PlaceFeature,
    onClick: (properties: PlaceFeature['properties']) => void
  ): MarkerWithMetadata | null {
    const coordinates = this.getFeatureCoordinates(feature);
    if (!coordinates) return null;

    const [lng, lat] = coordinates;
    const properties = feature.properties;
    const iconPath = this.getIconPath(properties);
    const colorHex = this.getColor(properties);

    const container = this.createMarkerContainer();
    const icon = this.createMarkerIcon(iconPath, colorHex);
    const label = this.createMarkerLabel(properties, colorHex);

    container.appendChild(icon);
    container.appendChild(label);

    const updateLabelVisibility = () => {
      const zoom = map.getZoom();
      label.style.display = zoom >= 18 ? 'block' : 'none';
    };
    updateLabelVisibility();

    container.addEventListener('click', e => {
      e.stopPropagation();
      onClick(properties);
    });

    const marker = new maplibregl.Marker({ element: container })
      .setLngLat([lng, lat])
      .addTo(map) as MarkerWithMetadata;

    marker.updateLabelVisibility = updateLabelVisibility;
    marker.labelElement = label;
    marker.buildingName = properties.name;

    this.markers.push(marker);
    return marker;
  }

  updateAllLabelVisibility(): void {
    for (const marker of this.markers) {
      marker.updateLabelVisibility();
    }
  }

  updateAllLabelTranslations(): void {
    for (const marker of this.markers) {
      if (marker.labelElement && marker.buildingName) {
        marker.labelElement.textContent = this.getTranslatedName(marker.buildingName);
      }
    }
  }

  clearMarkers(): void {
    for (const marker of this.markers) {
      marker.remove();
    }
    this.markers = [];
  }

  private getFeatureCoordinates(feature: PlaceFeature): number[] | undefined {
    const properties = feature.properties;
    if (
      (properties.type || '').toLowerCase() === 'assembly-point' &&
      feature.geometry?.coordinates
    ) {
      return feature.geometry.coordinates as number[];
    }
    if (properties?.centroid?.coordinates && Array.isArray(properties.centroid.coordinates)) {
      return properties.centroid.coordinates as number[];
    }
    return undefined;
  }

  private getIconPath(properties: PlaceFeature['properties']): string {
    if (properties.type === 'assembly_point') {
      return 'https://1hz14f3vx1.execute-api.us-east-1.amazonaws.com/public/icons/assembly_point.svg';
    }

    if (properties.icon) {
      const iconPath = properties.icon;
      if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) {
        return iconPath;
      }
      const cleanPath = iconPath.startsWith('/') ? iconPath.substring(1) : iconPath;
      const correctedPath = cleanPath.replace('/icon/', '/icons/');
      return `https://campusmap-file-storage.s3.us-east-1.amazonaws.com/${correctedPath}`;
    }
    return 'assets/icons/building.svg';
  }

  private getColor(properties: PlaceFeature['properties']): string {
    if (properties.color) {
      return this.colorMap[properties.color] ?? this.colorMap['blue'];
    }
    return this.colorMap['blue'];
  }

  private getTranslatedName(name: string): string {
    const translationKey = `Buildings.${name}`;
    const translated = this.translate.instant(translationKey);
    return translated === translationKey ? name : translated;
  }

  private createMarkerContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.cursor = 'pointer';
    return container;
  }

  private createMarkerIcon(iconPath: string, colorHex: string): HTMLDivElement {
    const icon = document.createElement('div');
    icon.style.width = '24px';
    icon.style.height = '24px';

    if (colorHex && iconPath.includes('.svg')) {
      this.applyColorToSvg(icon, iconPath, colorHex);
    } else {
      this.applyBackgroundImage(icon, iconPath);
    }

    return icon;
  }

  private applyColorToSvg(element: HTMLDivElement, iconPath: string, colorHex: string): void {
    fetch(iconPath)
      .then(response => response.text())
      .then(svgText => {
        const modifiedSvg = svgText.replace(
          /(class="st1"[^>]*>)/,
          `$1<style>.st1{fill:${colorHex}!important;}</style>`
        );
        const blob = new Blob([modifiedSvg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        this.applyBackgroundImage(element, url);
      })
      .catch(() => {
        this.applyBackgroundImage(element, iconPath);
      });
  }

  private applyBackgroundImage(element: HTMLDivElement, url: string): void {
    element.style.backgroundImage = `url(${url})`;
    element.style.backgroundSize = 'contain';
    element.style.backgroundRepeat = 'no-repeat';
    element.style.backgroundPosition = 'center';
  }

  private createMarkerLabel(
    properties: PlaceFeature['properties'],
    colorHex: string
  ): HTMLDivElement {
    const label = document.createElement('div');
    label.textContent = this.getTranslatedName(properties.name);
    label.style.fontSize = '16px';
    label.style.fontWeight = '400';
    label.style.letterSpacing = '1px';

    const isSpecialType =
      properties.type === 'parking' || (properties.type || '').toLowerCase() === 'assembly-point';

    label.style.color = isSpecialType
      ? (properties.type || '').toLowerCase() === 'assembly-point'
        ? '#358540'
        : colorHex
      : '#000000';

    label.style.textShadow =
      '-1px -1px 1px #ffffffff, 1px 1px 1px #ffffffff, -1px 1px 1px #ffffffff, 1px -1px 1px #ffffffff';
    label.style.textAlign = 'center';
    label.style.marginTop = '4px';
    label.style.whiteSpace = 'nowrap';
    label.style.pointerEvents = 'none';
    label.style.display = 'none';

    return label;
  }
}
