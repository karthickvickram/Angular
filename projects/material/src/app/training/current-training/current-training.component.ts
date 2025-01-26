import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MaterialModule } from '../../material.module';
import {
  MatDialog,
} from '@angular/material/dialog';

import { StopTrainingComponent } from './StopTraining/StopTraining.component';
import { TranslateModule } from '@ngx-translate/core';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-current-training',
  standalone: true,
  imports: [
    MaterialModule,
    TranslateModule
  ],
  templateUrl: './current-training.component.html',
  styleUrl: './current-training.component.scss'
})
export class CurrentTrainingComponent implements OnInit {

  public progress = 0;
  public timer!: number;
  @Output() trainingExit = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private trainingService: TrainingService
  ) {

  }

  ngOnInit(): void {
    this.startOrResumeTimer();
  }

  startOrResumeTimer() {
    const runningExercise = this.trainingService.getRunningExercise();
    var step = 100;
    if (runningExercise && runningExercise.duration) {
      step = runningExercise.duration / 100 * 1000; 
    }
    this.timer = setInterval(() => {
      this.progress += 1;
      if (this.progress >= 100) {
        clearInterval(this.timer);
      }
    }, step);
  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.trainingExit.emit();
      } else {
        this.startOrResumeTimer();
      }
    });
  }
}
