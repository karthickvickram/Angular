import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { TranslateModule } from '@ngx-translate/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-training',
  standalone: true,
  imports: [
    MaterialModule,
    TranslateModule,
    FormsModule
  ],
  templateUrl: './new-training.component.html',
  styleUrl: './new-training.component.scss'
})
export class NewTrainingComponent implements OnInit{

  trainings: Exercise[] = [];

  constructor(public trainingService: TrainingService) {

  }

  ngOnInit(): void {
    this.trainings = this.trainingService.getAvailableServices();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
