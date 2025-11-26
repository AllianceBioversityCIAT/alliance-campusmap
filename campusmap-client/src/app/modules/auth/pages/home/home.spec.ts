import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { Map } from '../../../map/pages/map/map';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

class FakeLoader implements TranslateLoader {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTranslation(lang: string) {
    return of({});
  }
}

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Home,
        Map,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader }
        })
      ],
      providers: [provideHttpClient(), provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
