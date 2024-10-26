import {createFeatureSelector, createSelector, MemoizedSelector} from '@ngrx/store';
import {getRouterSelectors, RouterReducerState, SerializedRouterStateSnapshot} from '@ngrx/router-store';
import {DefaultProjectorFn} from '@ngrx/store/src/selector';
import {RouterStateSelectors} from '@ngrx/router-store/src/models';
import {ActivatedRouteSnapshot, Params} from '@angular/router';
import {SelectorType} from '../../../../libri/Libri.ONE/PIM/frontend/src/app/state/model';
import {utcTimestampRegex} from '../../../../libri/Libri.ONE/PIM/frontend/src/app/_core/date/date-utils';

// `router` is used as the default feature name. You can use the feature name
// of your choice by creating a feature selector and pass it to the `getSelectors` function
export const selectRouter: MemoizedSelector<object, RouterReducerState> = createFeatureSelector<RouterReducerState>('router');

export const {
    selectCurrentRoute, // select the current route
    selectFragment, // select the current route fragment
    selectQueryParams, // select the current route query params
    selectQueryParam, // factory function to select a query param
    selectRouteParams, // select the current route params
    selectRouteParam, // factory function to select a route param
    selectRouteData, // select the current route data
    selectUrl // select the current url
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
RouterStateSelectors<Record<string, any>> = getRouterSelectors();

export const selectFeatureRoute: MemoizedSelector<object, string | undefined, DefaultProjectorFn<string | undefined>> = createSelector(
    selectRouter,
    (navigation: RouterReducerState<SerializedRouterStateSnapshot>) => getFirstRoute(navigation)?.routeConfig?.path
);

export const selectFeatureSubRoute: MemoizedSelector<object, string | undefined, DefaultProjectorFn<string | undefined>> = createSelector(
    selectRouter,
    (navigation: RouterReducerState<SerializedRouterStateSnapshot>) => getFirstRoute(navigation)?.firstChild?.routeConfig?.path
);

export const selectQueryParamsWithDates: SelectorType<Params> = createSelector(selectQueryParams, (params: Params) => {
    let updatedParams: Params = params;
    Object.keys(params)
        .filter((key: string) => new RegExp(utcTimestampRegex).exec(params[key] as string))
        .forEach((key: string) => {
            updatedParams = {...updatedParams, [key]: new Date(params[key])};
        });
    return updatedParams;
});

const getFirstRoute: (navigation: RouterReducerState) => ActivatedRouteSnapshot | null | undefined = (
    navigation: RouterReducerState
): ActivatedRouteSnapshot | null | undefined => {
    // Initially, state will be set after first navigation action,
    // firstChild after all guard have passed.
    return navigation?.state.root.firstChild?.firstChild;
};
