export interface NotificationEvents {
    name: string,
}

export interface LambdaConfiguration {
    id: string,
    lambdaArn: string,
    events: NotificationEvents[],
}

export interface BucketItem {
    id: string | undefined;
    region: string | undefined;
    name: string | undefined;
    keys: number | undefined;
    size: number | undefined;
    arn: string | undefined;
    owner: string | undefined;
    created: string | undefined;
    modified: string | undefined;
    lambdaConfigurations: LambdaConfiguration[] | undefined;
}
