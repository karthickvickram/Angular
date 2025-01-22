import { Component } from '@angular/core';
import { MaterialModule } from '../material.module';
import { NewTrainingComponent } from './new-training/new-training.component';
import { PastTrainingComponent } from './past-training/past-training.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-training',
  standalone: true,
  imports: [
    MaterialModule,
    TranslateModule,
    NewTrainingComponent,
    PastTrainingComponent
  ],
  templateUrl: './training.component.html',
  styleUrl: './training.component.scss'
})
export class TrainingComponent {

}
