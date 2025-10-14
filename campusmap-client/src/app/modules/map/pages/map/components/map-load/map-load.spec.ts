import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLoad } from './map-load';

describe('MapLoad', () => {
  let component: MapLoad;
  let fixture: ComponentFixture<MapLoad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapLoad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapLoad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
