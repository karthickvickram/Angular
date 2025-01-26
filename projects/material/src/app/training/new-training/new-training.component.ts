import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { TranslateModule } from '@ngx-translate/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';

@Component({
  selector: 'app-new-training',
  standalone: true,
  imports: [
    MaterialModule,
    TranslateModule
  ],
  templateUrl: './new-training.component.html',
  styleUrl: './new-training.component.scss'
})
export class NewTrainingComponent implements OnInit{

  @Output() trainingStart = new EventEmitter<void>();
  trainings: Exercise[] = [];

  constructor(public trainingService: TrainingService) {

  }

  ngOnInit(): void {
    this.trainings = this.trainingService.getAvailableServices();
  }

  onStartTraining() {
    this.trainingStart.emit();
  }
}
