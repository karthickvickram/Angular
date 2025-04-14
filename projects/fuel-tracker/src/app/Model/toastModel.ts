export interface ToastModel {
    severity: 'success' | 'info' | 'warn' | 'error';
    summary: string;
    detail: string;
    key?: string;
    life?: number;
}