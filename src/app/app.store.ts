import {Action, ActionReducer} from "@ngrx/store";
import {QueueListEffects} from "./pages/modules/sqs/queues-list/state/queue-list.effects";
import {queueListReducer, SQSQueueListState} from "./pages/modules/sqs/queues-list/state/queue-list.reducer";

export interface AppState {
    queueList: SQSQueueListState
}

export interface AppStore {
    queueList: ActionReducer<SQSQueueListState, Action>;
}

export const appStore: AppStore = {
    queueList: queueListReducer
}

export const appEffects = [QueueListEffects];
