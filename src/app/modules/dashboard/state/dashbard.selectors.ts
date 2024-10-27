import {createFeatureSelector, createSelector, DefaultProjectorFn, MemoizedSelector} from "@ngrx/store";
import {dashboardFeatureKey, DashboardState} from "./dashboard.reducer";

export type SelectorType<T> = MemoizedSelector<object, T, DefaultProjectorFn<T>>;
export type SelectorFeatureType<T> = MemoizedSelector<object, T>;

const selectQueueListFeature: SelectorFeatureType<DashboardState> =
    createFeatureSelector<DashboardState>(dashboardFeatureKey);

export const selectIsLoading: SelectorType<boolean> = createSelector(
    selectQueueListFeature,
    (state: DashboardState) => state.loading
);

