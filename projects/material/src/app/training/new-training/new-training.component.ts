import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { TranslateModule } from '@ngx-translate/core';

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

  ngOnInit(): void {
    
  }

  onStartTraining() {
    this.trainingStart.emit();
  }
}
