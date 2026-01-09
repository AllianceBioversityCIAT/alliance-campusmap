import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { InformationPopUp } from './information-pop-up';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTranslation(lang: string) {
    return of({});
  }
}

describe('InformationPopUp', () => {
  let component: InformationPopUp;
  let fixture: ComponentFixture<InformationPopUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InformationPopUp,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader }
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InformationPopUp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
