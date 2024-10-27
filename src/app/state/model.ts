import {TypedAction} from "@ngrx/store/src/models";
import {DefaultProjectorFn, MemoizedSelector, NotAllowedCheck} from '@ngrx/store';

export type SelectorFeatureType<T> = MemoizedSelector<object, T>;
export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type ActionType = (() => TypedAction<string>) & TypedAction<string>;
export type ActionTypeWithProps<T extends object> = ((props: T & NotAllowedCheck<T>) => T & TypedAction<string>) & TypedAction<string>;
