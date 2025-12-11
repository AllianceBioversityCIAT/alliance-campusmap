import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { InformationPopUpTimer } from './information-pop-up-timer';

describe('InformationPopUpTimer', () => {
  let component: InformationPopUpTimer;
  let fixture: ComponentFixture<InformationPopUpTimer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationPopUpTimer, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InformationPopUpTimer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
