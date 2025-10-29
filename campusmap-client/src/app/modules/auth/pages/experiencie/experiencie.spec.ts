import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Experiencie } from './experiencie';

describe('Experiencie', () => {
  let component: Experiencie;
  let fixture: ComponentFixture<Experiencie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Experiencie]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Experiencie);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
