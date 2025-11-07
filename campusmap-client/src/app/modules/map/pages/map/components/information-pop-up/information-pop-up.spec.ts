import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationPopUp } from './information-pop-up';

describe('InformationPopUp', () => {
  let component: InformationPopUp;
  let fixture: ComponentFixture<InformationPopUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationPopUp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformationPopUp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
