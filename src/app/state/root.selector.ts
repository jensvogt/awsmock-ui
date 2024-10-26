import {SelectorFeatureType, SelectorType} from '../../../../libri/Libri.ONE/PIM/frontend/src/app/state/model';
import {SimplifiedDatenlieferant} from '../../../../libri/Libri.ONE/PIM/frontend/src/app/modules/datenlieferanten/model/SimplifiedDatenlieferant';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {rootFeatureName, RootState} from './root.reducer';

const selectRootState: SelectorFeatureType<RootState> = createFeatureSelector<RootState>(rootFeatureName);

export const selectDatenlieferantList: SelectorType<SimplifiedDatenlieferant[]> = createSelector(
    selectRootState,
    (state: RootState) => state.simplifiedDatenlieferanten
);
