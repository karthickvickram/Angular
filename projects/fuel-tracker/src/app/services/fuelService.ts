import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, DocumentReference, collectionData, query, orderBy, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { FuelEntry } from '../Model/Fuel';
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

  public updateFuelEntry(entry: FuelEntry) {
    if (!entry.id) {
      return throwError(() => new Error('Entry ID is required'));
    }

    const docRef = doc(this.firestore, `fuelEntries/${entry.id}`);
    const updatedData = {
      date: entry.date.toISOString(),
      odometer: entry.odometer,
      amount: entry.amount,
      liter: entry.liter
    };
    return from(
      updateDoc(docRef, updatedData)
    ).pipe(
      tap(() => console.log('Fuel Entry ${entry.id} updated successfully')),
      catchError((error) => {
        console.log('Error updating fuel entry:', error);
        return throwError(() => error);
      })
    )
  }

  public deleteFuelEntry(id: string): Observable<void> {
    const docRef = doc(this.firestore, `fuelEntries/${id}`);
    return from(deleteDoc(docRef));
  }

  getFuelEntries(): Observable<FuelEntry[]> {
    const fuelQuery = query(this.fuelCollection, orderBy('date', 'desc'));
    return collectionData(fuelQuery, { idField: 'id' }) as Observable<FuelEntry[]>;
  }
}
