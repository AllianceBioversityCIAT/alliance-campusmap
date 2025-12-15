import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MapLoad } from './map-load';
import { Api } from '@shared/services/api';
import { PlaceProperties } from '@shared/types/place.model';

describe('MapLoad', () => {
  let component: MapLoad;
  let fixture: ComponentFixture<MapLoad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapLoad, TranslateModule.forRoot()],
      providers: [Api, provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(MapLoad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits building popup for cafeteria type', () => {
    const spy = jest.spyOn(component.placeSelected, 'emit');
    const props: PlaceProperties = {
      id: 25,
      name: 'Cafeteria Central',
      type: 'cafeteria',
      imageUrl: '',
      images: [],
      centroid: { type: 'Point', coordinates: [0, 0] }
    };
    (
      component as unknown as { handleMarkerClick: (properties: PlaceProperties) => void }
    ).handleMarkerClick(props);
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ id: 25, name: 'Cafeteria Central', type: 'building' })
    );
  });

  it('emits parking popup for parking type', () => {
    const spy = jest.spyOn(component.placeSelected, 'emit');
    const props: PlaceProperties = {
      id: 99,
      name: 'Parking A',
      type: 'parking',
      imageUrl: '',
      centroid: { type: 'Point', coordinates: [0, 0] }
    };
    (
      component as unknown as { handleMarkerClick: (properties: PlaceProperties) => void }
    ).handleMarkerClick(props);
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ id: 99, name: 'Parking A', type: 'parking' })
    );
  });
});
