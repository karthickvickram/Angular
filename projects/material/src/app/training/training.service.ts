import { Injectable } from "@angular/core";
import { Exercise } from "./exercise.model";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TrainingService {
    public exerciseChanged = new Subject<Exercise | null>();
    private availableExercise: Exercise[] = [
        { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
        { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
        { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
        { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
    ];

    private runningExercise: Exercise | null = null;
    private exercise: Exercise[] = [];

    constructor() {

    }

    public getAvailableServices() {
        return this.availableExercise.slice();
    }

    public startExercise(selectedId: string) {
        this.runningExercise = this.availableExercise.find(x => x.id == selectedId) || null;
        if (this.runningExercise) {
            this.exerciseChanged.next({ ...this.runningExercise });
        }
    }

    public completeExercise() {
        if (this.runningExercise) {
            this.exercise.push(
                {
                    ...this.runningExercise,
                    date: new Date(),
                    state: 'completed'
                }
            );
            this.runningExercise = null;
            this.exerciseChanged.next(null);
        }
    }

    public cancelExercise(progress: number) {
        if (this.runningExercise) {
            this.exercise.push(
                {
                    ...this.runningExercise,
                    duration: this.runningExercise.duration * (progress / 100),
                    calories: this.runningExercise.duration * (progress / 100),
                    date: new Date(),
                    state: 'cancelled'
                }
            );
            this.runningExercise = null;
            this.exerciseChanged.next(null);
        }
    }

    public getRunningExercise() {
        return { ...this.runningExercise };
    }
}