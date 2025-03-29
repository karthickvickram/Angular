import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, DocumentReference } from '@angular/fire/firestore';
import { FuelEntry } from '../Model/fuelEntry';
import { catchError, from, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FuelService {
  
  private fuelCollection;
  
  constructor(private firestore: Firestore) {
    this.fuelCollection = collection(this.firestore, 'fuelEntries');
  }

  public addFuelEntry(entry: FuelEntry): Observable<DocumentReference> {
    return from(
      addDoc(this.fuelCollection, {
        ...entry,
        date: entry.date.toISOString()
      })
    ).pipe(
      tap(() => console.log('Fuel Entry saved in firestore')),
      catchError((error) => {
        console.log('Error adding fuel entry', error);
        return throwError(() => error);
      })
    )
  }

  public updateFuelEntry() {

  }

  public deleteFuelEntry() {

  }

  async getFuelEntries() {
  }
}
