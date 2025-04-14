import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelListComponent } from './fuel-list.component';

describe('FuelListComponent', () => {
  let component: FuelListComponent;
  let fixture: ComponentFixture<FuelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
