import { Injectable, signal } from "@angular/core";
import { ToastModel } from "../Model/toastModel";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

    private toastSignal = signal<ToastModel[]>([]);

    readonly toast$ = this.toastSignal.asReadonly();
    
    show(severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail: string, life?: number) {
        const toast: ToastModel = {
            severity,
            summary,
            detail,
            life
        };
        this.toastSignal.update(msgs => [...msgs, toast]);
    }

    remove(toast: ToastModel) {
        this.toastSignal.update(msgs => msgs.filter(msg => msg !== toast));
    }
}