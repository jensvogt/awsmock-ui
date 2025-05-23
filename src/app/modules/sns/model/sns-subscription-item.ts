export interface SnsSubscriptionItem {
    id: string | undefined;
    topicArn: string | undefined;
    subscriptionArn: string | undefined;
    endpoint: string | undefined;
    protocol: string | undefined;
    owner: string | undefined;
}

export interface SnsSubscriptionCountersResponse {
    total: number;
    subscriptionCounters: SnsSubscriptionItem[];
}
