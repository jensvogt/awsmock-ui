export interface KmsKeyDetails {
    Region: string | undefined;
    User: string | undefined;
    RequestId: string | undefined;
    KeyId: string | undefined;
    KeyArn: string | undefined;
    KeyUsage: string | undefined;
    KeySpec: string | undefined;
    KeyState: string | undefined;
    Origin: string | undefined;
    CreationDate: Date | undefined;
    DeletionDate: Date | undefined;
}

export interface KeyDetailsResponse {
    Key: KmsKeyDetails | undefined;
}
