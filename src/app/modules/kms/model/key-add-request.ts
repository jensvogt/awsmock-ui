export interface KmsKeyAddRequest {
    keyUsage: string;
    keySpec: string;
    description: string;
    origin: string;
}
