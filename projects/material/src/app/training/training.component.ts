import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../material.module';
import { NewTrainingComponent } from './new-training/new-training.component';
import { PastTrainingComponent } from './past-training/past-training.component';
import { TranslateModule } from '@ngx-translate/core';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { TrainingService } from './training.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-training',
    imports: [
        MaterialModule,
        TranslateModule,
        NewTrainingComponent,
        PastTrainingComponent,
        CurrentTrainingComponent
    ],
    templateUrl: './training.component.html',
    styleUrl: './training.component.scss'
})
export class TrainingComponent implements OnInit, OnDestroy {

  public ongoingTraining = false;
  private destroyed$ = new Subject<boolean>();

  constructor(private trainingService: TrainingService) {

  }

  ngOnInit(): void {
    this.trainingService.exerciseChanged
      .pipe(takeUntil(this.destroyed$))
      .subscribe((exercise => {
        if (exercise) {
          this.ongoingTraining = true;
        } else {
          this.ongoingTraining = false;
        }
      }))
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
