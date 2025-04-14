import { Component, effect } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToastService } from '../services/toastService';


@Component({
  selector: 'app-fuel-toast-message',
  imports: [ToastModule],
  providers: [MessageService],
  template: `<p-toast />`,
  styleUrl: './toast-message.component.scss'
})
export class ToastMessageComponent {

  constructor(
    private messageService: MessageService,
    private toastService: ToastService
  ) {
    effect(() => {
      const toasts = this.toastService.toast$();

      toasts.forEach(toast => {
        this.messageService.add(toast);
      })

    })
  }

}
