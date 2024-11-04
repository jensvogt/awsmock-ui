export interface SnsSubscriptionItem {
    id: string | undefined;
    subscriptionArn: string | undefined;
    endpoint: string | undefined;
    owner: string | undefined;
    protocol: string | undefined;
}

export interface SnsSubscriptionCountersResponse {
    Total: number;
    SubscriptionCounters: SnsSubscriptionItem[];
}