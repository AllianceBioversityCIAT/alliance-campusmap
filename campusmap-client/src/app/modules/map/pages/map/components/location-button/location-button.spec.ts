import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationButton } from './location-button';

describe('LocationButton', () => {
  let component: LocationButton;
  let fixture: ComponentFixture<LocationButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationButton]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
