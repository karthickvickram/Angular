import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-past-training',
  standalone: true,
  imports: [
    MaterialModule,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './past-training.component.html',
  styleUrl: './past-training.component.scss'
})
export class PastTrainingComponent implements OnInit, AfterViewInit{

  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private trainingService: TrainingService) {

  }

  ngOnInit(): void {
    this.dataSource.data = this.trainingService.getCompletedOrCancelledExercises();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
