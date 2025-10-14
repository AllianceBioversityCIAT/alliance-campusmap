import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterControls } from './filter-controls';

describe('FilterControls', () => {
  let component: FilterControls;
  let fixture: ComponentFixture<FilterControls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterControls]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterControls);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
