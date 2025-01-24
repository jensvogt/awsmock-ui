import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from '@ngrx/store';
import {rootFeatureName, RootState} from './root.reducer';

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectRootFeature: SelectorFeatureType<RootState> = createFeatureSelector<RootState>(rootFeatureName);

export const selectBackendServer: SelectorType<string> = createSelector(
    selectRootFeature,
    (state: RootState) => state?.backendServer
);
