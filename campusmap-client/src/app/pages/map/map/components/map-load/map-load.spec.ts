import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MapLoad } from './map-load';
import { Api } from '@shared/services/api';

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
});
