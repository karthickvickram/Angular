import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { AuthService } from './auth/auth.service';
import { TrainingService } from './training/training.service';

export function translateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json')
}

//FireBase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDrxJ9ow_fhtOHP9i1P1oXX8ArZR7Cw6XQ",
  authDomain: "ng-fitness-tracker-ff01d.firebaseapp.com",
  projectId: "ng-fitness-tracker-ff01d",
  storageBucket: "ng-fitness-tracker-ff01d.firebasestorage.app",
  messagingSenderId: "163204165570",
  appId: "1:163204165570:web:1b1752f58210dfd6df305b",
  measurementId: "G-V14FE9DE85"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    importProvidersFrom([
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: translateLoaderFactory,
          deps: [HttpClient]
        }
      })
    ]),
    AuthService,
    TrainingService
  ]
};
