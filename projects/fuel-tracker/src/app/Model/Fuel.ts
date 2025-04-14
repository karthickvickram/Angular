export interface FuelEntry {
    id?: string;
    date: Date;
    odometer: number;
    amount: number;
    liter: number;
}

export interface FuelDisplay extends FuelEntry {
    costPerLiter: number;
    costPerKm: number;
    mileage: number;
    distanceTraveled: number;
}