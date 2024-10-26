import {TopicItem} from "./topic-item";

export interface TopicList {
    lastUpdate: Date,
    length: number,
    nextToken: string,
    items: TopicItem[]
}
