import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportButtonSelector } from './transport-button-selector';

describe('TransportButtonSelector', () => {
  let component: TransportButtonSelector;
  let fixture: ComponentFixture<TransportButtonSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportButtonSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportButtonSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
