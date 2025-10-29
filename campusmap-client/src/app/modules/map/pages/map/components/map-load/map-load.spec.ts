import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MapLoad } from './map-load';
import { Api } from '../../../../../../core/service/api';

describe('MapLoad', () => {
  let component: MapLoad;
  let fixture: ComponentFixture<MapLoad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MapLoad], // ← agregado
      providers: [Api]
    }).compileComponents();

    fixture = TestBed.createComponent(MapLoad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
