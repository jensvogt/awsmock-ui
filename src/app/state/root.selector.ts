import {SelectorFeatureType} from '../../../../libri/Libri.ONE/PIM/frontend/src/app/state/model';
import {createFeatureSelector} from '@ngrx/store';
import {rootFeatureName, RootState} from './root.reducer';

const selectRootState: SelectorFeatureType<RootState> = createFeatureSelector<RootState>(rootFeatureName);
