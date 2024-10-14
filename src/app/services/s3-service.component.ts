import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {
    CreateBucketCommand,
    DeleteBucketCommand,
    DeleteObjectCommand,
    DeleteObjectsCommand,
    ListBucketsCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client
} from "@aws-sdk/client-s3";

@Injectable({providedIn: 'root'})
export class S3Service {

    client = new S3Client({
        region: environment.awsmockRegion,
        endpoint: environment.gatewayEndpoint,
        forcePathStyle: true,
        credentials: {
            accessKeyId: 'none',
            secretAccessKey: 'none',
        },
        requestHandler: {
            requestTimeout: 3_000,
            httpsAgent: {maxSockets: 25},
        },
    });

    listBuckets(pageIndex: number, pageSize: number): any {
        const input = {
            MaxBuckets: pageSize,
            ContinuationToken: pageIndex.toString(),
        };
        return this.client.send(new ListBucketsCommand(input));
    }

    createBucket(bucketName: string) {
        const input = {
            Bucket: bucketName
        };
        return this.client.send(new CreateBucketCommand(input));
    }

    listObjects(bucketName: string, pageSize: number, pageIndex: number) {
        const command = new ListObjectsV2Command({
            Bucket: bucketName,
            MaxKeys: pageSize * pageIndex,
        });
        return this.client.send(command);
    }

    putObjects(bucketName: string, key: string, fileName: string) {
        const command = new PutObjectCommand({
            Body: fileName,
            Bucket: bucketName,
            Key: key,
        });
        return this.client.send(command);
    }

    deleteObject(bucketName: string, key: string) {
        const input = {
            Bucket: bucketName,
            Key: key
        };
        return this.client.send(new DeleteObjectCommand(input));
    }

    deleteObjects(bucketName: string) {
        const input = {
            Bucket: bucketName,
            Delete: {
                Objects: [
                    {
                        Key: "objectkey1"
                    },
                    {
                        Key: "objectkey2"
                    }
                ],
                Quiet: true
            }
        };
        return this.client.send(new DeleteObjectsCommand(input));
    }

    deleteBucket(bucketName: string) {
        const input = {
            Bucket: bucketName
        };
        return this.client.send(new DeleteBucketCommand(input));
    }

    cleanup() {
        this.client.destroy();
    }
}