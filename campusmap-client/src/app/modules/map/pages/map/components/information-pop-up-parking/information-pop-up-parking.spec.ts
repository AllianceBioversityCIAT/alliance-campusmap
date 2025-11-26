import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { InformationPopUpParking } from './information-pop-up-parking';

describe('InformationPopUpParking', () => {
  let component: InformationPopUpParking;
  let fixture: ComponentFixture<InformationPopUpParking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationPopUpParking, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InformationPopUpParking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
