import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppMaterialComponent } from './app/app.component';

bootstrapApplication(AppMaterialComponent, appConfig)
  .catch((err) => console.error(err));
