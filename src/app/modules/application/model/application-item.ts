export interface ApplicationItem {
    name: string | undefined;
    runtime: string | undefined;
    archive: string | undefined;
    version: string | undefined;
    containerId: string | undefined;
    status: string | undefined;
    enabled: boolean | undefined;
    created: Date | undefined;
    modified: Date | undefined;
}

export interface ListApplicationCountersResponse {
    total: number;
    applicationCounters: ApplicationItem[];
}
