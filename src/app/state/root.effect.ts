import {Injectable} from '@angular/core';
import {Actions} from '@ngrx/effects';

@Injectable()
export class RootEffect {

    constructor(private readonly actions$: Actions) {
    }
}
