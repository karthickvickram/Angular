import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

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
export class PastTrainingComponent implements OnInit{

  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();

  constructor(private trainingService: TrainingService) {

  }

  ngOnInit(): void {
    this.dataSource.data = this.trainingService.getCompletedOrCancelledExercises();
  }
}
