export interface SnsSubscriptionItem {
    id: string | undefined;
    topicArn: string | undefined;
    subscriptionArn: string | undefined;
    endpoint: string | undefined;
    protocol: string | undefined;
    owner: string | undefined;
}

export interface SnsSubscriptionCountersResponse {
    Total: number;
    SubscriptionCounters: SnsSubscriptionItem[];
}

export interface SnsTagItem {
    name: string | undefined;
    value: string | undefined;
}

export interface SnsTagCountersResponse {
    Total: number;
    TagCounters: SnsTagItem[];
}