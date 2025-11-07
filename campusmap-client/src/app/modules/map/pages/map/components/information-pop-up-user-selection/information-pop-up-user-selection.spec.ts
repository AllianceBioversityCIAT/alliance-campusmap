import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationPopUpUserSelection } from './information-pop-up-user-selection';

describe('InformationPopUpUserSelection', () => {
  let component: InformationPopUpUserSelection;
  let fixture: ComponentFixture<InformationPopUpUserSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationPopUpUserSelection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformationPopUpUserSelection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
