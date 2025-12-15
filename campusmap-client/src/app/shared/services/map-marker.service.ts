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
    // Skip specific parkings requested to be removed
    const name = (feature.properties?.name || '').toString().trim();
    if (name === 'Parqueadero Portería A' || name === 'Parqueadero Portería B') {
      return null;
    }

    const coordinates = this.getFeatureCoordinates(feature);
    if (!coordinates) return null;

    const [lng, lat] = coordinates;
    const properties = feature.properties;
    const iconPath = this.getIconPath(properties);
    const colorHex = this.getColor(properties);
    const rawType = (properties.typeCode || properties.type || '').toString().toLowerCase();
    const isCombinedIcon = iconPath.includes('building_combinate.svg');
    const recolorSvg = rawType !== 'parking' && !isCombinedIcon;

    const container = this.createMarkerContainer();
    const icon = this.createMarkerIcon(iconPath, colorHex, recolorSvg);
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
    // Specific icon override for Ed. Admón 3-4
    const rawName = (properties.name || '').toString().trim();
    const normalizedName = rawName
      .normalize('NFD')
      .replaceAll(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    if (normalizedName === 'ed. admon 3-4') {
      return '/assets/icons/mapPage/building_combinate.svg';
    }

    if (properties.type === 'assembly_point') {
      return '/assets/icons/mapPage/assembly_point.svg';
    }

    if (properties.icon) {
      let iconPath = properties.icon;

      // Clean up backend paths: remove 'public/icon/' or 'public/icons/' prefix if present
      if (iconPath.includes('public/icon/')) {
        iconPath = iconPath.split('public/icon/')[1];
      } else if (iconPath.includes('public/icons/')) {
        iconPath = iconPath.split('public/icons/')[1];
      }

      // Ensure it uses mapPage subdirectory if not already specified
      if (!iconPath.includes('mapPage/')) {
        iconPath = `mapPage/${iconPath}`;
      }

      return `/assets/icons/${iconPath}`;
    }
    return '/assets/icons/mapPage/building.svg';
  }

  private getColor(properties: PlaceFeature['properties']): string {
    // Prefer explicit color from API if provided
    const raw = (properties.color ?? '').toString().trim();
    if (raw) {
      const lower = raw.toLowerCase();
      if (lower.startsWith('#')) {
        return lower;
      }
      if (this.colorMap[lower]) {
        return this.colorMap[lower];
      }
    }

    // Domain rule: cafeterias default to yellow when no explicit color
    const typeCode = (properties.typeCode || '').toLowerCase();
    if (typeCode === 'cafetienda' || typeCode === 'cafeterias') {
      return this.colorMap['yellow'];
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

  private createMarkerIcon(iconPath: string, colorHex: string, recolorSvg = true): HTMLDivElement {
    const icon = document.createElement('div');

    // Tamaño base y override para parkings
    const baseSize = 27;
    const parkingSize = 28;

    const isParking = iconPath.toLowerCase().includes('parking');
    const size = isParking ? parkingSize : baseSize;

    icon.style.width = `${size}px`;
    icon.style.height = `${size}px`;

    if (recolorSvg && colorHex && /\.svg(\?|$)/i.test(iconPath)) {
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
        let svg = svgText;

        // If icon used class-based coloring previously, inject a style into the <svg> root
        if (/class="st1"/i.test(svg)) {
          svg = svg.replace(
            /<svg([^>]*)>/i,
            `<svg$1><style>.st1{fill:${colorHex}!important;}</style>`
          );
        }

        // Replace common base color fills/strokes across our palette
        const palette = Object.values(this.colorMap);
        const fallbackBases = [
          '#173f6f',
          '#1689ca',
          '#219ed4',
          '#3da93d',
          '#fa7921',
          '#f6c644',
          '#231f20'
        ];
        const baseColors = Array.from(new Set([...palette, ...fallbackBases]));
        let replacedAny = false;
        for (const base of baseColors) {
          const before = svg;
          const fillAttr = new RegExp(`fill=["']${base}["']`, 'gi');
          const fillCss = new RegExp(`fill:${base}`, 'gi');
          const strokeAttr = new RegExp(`stroke=["']${base}["']`, 'gi');
          const strokeCss = new RegExp(`stroke:${base}`, 'gi');
          svg = svg
            .replaceAll(fillAttr, `fill="${colorHex}"`)
            .replaceAll(fillCss, `fill:${colorHex}`)
            .replaceAll(strokeAttr, `stroke="${colorHex}"`)
            .replaceAll(strokeCss, `stroke:${colorHex}`);
          if (svg !== before) replacedAny = true;
        }

        // If no known base color found, as a fallback inject a style to recolor common shapes
        if (!replacedAny) {
          svg = svg.replace(
            /<svg([^>]*)>/i,
            `<svg$1><style>path[fill]:not([fill='none']),circle[fill]:not([fill='none']),rect[fill]:not([fill='none']){fill:${colorHex}!important;}path[stroke],circle[stroke],rect[stroke]{stroke:${colorHex}!important;}</style>`
          );
        }

        const blob = new Blob([svg], { type: 'image/svg+xml' });
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

    let labelColor = '#000000';
    if (isSpecialType) {
      labelColor =
        (properties.type || '').toLowerCase() === 'assembly-point' ? '#358540' : colorHex;
    }
    label.style.color = labelColor;

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
