import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, DocumentReference, collectionData, query, orderBy, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { FuelEntry } from '../Model/Fuel';
import { BehaviorSubject, catchError, from, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FuelService {
  
  private fuelCollection;

  private fuelEntries = new BehaviorSubject<FuelEntry[]>([]);
  public fuelEntries$ = this.fuelEntries.asObservable();
  
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
      tap(() => console.log(`Fuel Entry ${entry.id} updated successfully`)),
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

  public getFuelEntries(): Observable<FuelEntry[]> {
    const fuelQuery = query(this.fuelCollection, orderBy('date', 'desc'));
    return collectionData(fuelQuery, { idField: 'id' }) as Observable<FuelEntry[]>
  }

  public storeFuelEntries(entries: FuelEntry[]) {
    this.fuelEntries.next(entries);
  }

  public calculateDistance(currentEntry: FuelEntry, lastEntry: FuelEntry): number {
    if (!currentEntry || !lastEntry) {
      return 0;
    }
    return currentEntry.odometer - lastEntry.odometer;
  }
  
  public calculateMileage(currentEntry: FuelEntry, lastEntry: FuelEntry): number {
    if (!lastEntry || !currentEntry) {
      return 0;
    }
    return this.calculateDistance(currentEntry, lastEntry) / currentEntry.liter;
  }

  public calculateCostPerLiter(entry: FuelEntry): number {
    if (!entry || entry.liter === 0) {
      return 0;
    }
    return entry.amount / entry.liter;
  }
  
  public calculateCostPerKm(currentEntry: FuelEntry, lastEntry: FuelEntry): number {
    if (!lastEntry || !currentEntry) {
      return 0;
    }
    return currentEntry.amount / this.calculateDistance(currentEntry, lastEntry);
  }

  public calculateOverallMileage(entries: FuelEntry[]): number {
    if (entries.length < 2) {
      return 0;
    }
    const totalDistance = entries.reduce((sum, entry, index) => {
      if (index === 0) return sum;
      return sum + this.calculateDistance(entry, entries[index - 1]);
    }, 0);
    const totalLiters = entries.reduce((sum, entry) => sum + entry.liter, 0);
    return totalDistance / totalLiters;
  }
}
