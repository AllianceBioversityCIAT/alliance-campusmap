import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationPopUpTimer } from './information-pop-up-timer';

describe('InformationPopUpTimer', () => {
  let component: InformationPopUpTimer;
  let fixture: ComponentFixture<InformationPopUpTimer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationPopUpTimer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformationPopUpTimer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
