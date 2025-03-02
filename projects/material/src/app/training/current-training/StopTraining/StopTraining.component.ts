import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-StopTraining',
    templateUrl: './StopTraining.component.html',
    styleUrls: ['./StopTraining.component.css'],
    imports: [
        MaterialModule,
        TranslateModule
    ]
})
export class StopTrainingComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) { }

  ngOnInit() {
  }

}
