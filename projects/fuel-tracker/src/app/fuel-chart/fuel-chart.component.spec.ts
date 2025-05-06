/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FuelChartComponent } from './fuel-chart.component';

describe('FuelChartComponent', () => {
  let component: FuelChartComponent;
  let fixture: ComponentFixture<FuelChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
