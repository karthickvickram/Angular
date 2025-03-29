import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// PrimeNG
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

// FireStore
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyAvUOO0NnnNrmHQeBeqtMKJ1-hdvZzFa6M",
  authDomain: "fueltracker-6567f.firebaseapp.com",
  projectId: "fueltracker-6567f",
  storageBucket: "fueltracker-6567f.firebasestorage.app",
  messagingSenderId: "639722339182",
  appId: "1:639722339182:web:8c185034a26f47cf5a5f7f",
  measurementId: "G-V39QZ4R8T8"
};


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: Aura,
            options: {
              prefix: 'p'
            }
        },
        ripple: true
    }),
    // FireBase
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
    
  ]
};
