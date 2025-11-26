import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationPermissionPopup } from './location-permission-popup';
import { TranslateModule } from '@ngx-translate/core';

describe('LocationPermissionPopup', () => {
  let component: LocationPermissionPopup;
  let fixture: ComponentFixture<LocationPermissionPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationPermissionPopup, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationPermissionPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit accepted event when accept button is clicked', () => {
    let emitted = false;
    component.accepted.subscribe(() => {
      emitted = true;
    });

    component.onAccept();
    expect(emitted).toBe(true);
  });

  it('should emit declined event when decline button is clicked', () => {
    let emitted = false;
    component.declined.subscribe(() => {
      emitted = true;
    });

    component.onDecline();
    expect(emitted).toBe(true);
  });
});
