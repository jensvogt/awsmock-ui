import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {CreateBucketCommand, DeleteBucketCommand, DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {S3ObjectMetadata} from "../model/s3-object-item";
//
// const s3: S3 = new S3();
// const options: any = {
//     maxPartSize: 10 * 1024 * 1024,
//     maxConcurrency: 5
// };

@Injectable({providedIn: 'root'})
export class S3Service {

    // S3 client for AWS calls
    client = new S3Client({
        region: environment.awsmockRegion,
        endpoint: environment.gatewayEndpoint,
        forcePathStyle: true,
        credentials: {
            accessKeyId: 'none',
            secretAccessKey: 'none',
        },
        requestHandler: {
            requestTimeout: 30000,
            httpsAgent: {maxSockets: 25, keepAlive: false},
        },
    });

    // Default headers for AwsMock HTTP requests
    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'AWS4-HMAC-SHA256 Credential=none/20240928/eu-central-1/s3/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-security-token;x-amz-target, Signature=01316d694335ec0e0bf68b08570490f1b0bae0b130ecbe13ebad511b3ece8a41'
    });
    url: string = environment.gatewayEndpoint + '/';

//    private managedDownloader: any;

    constructor(private http: HttpClient) {
        // @ts-ignore
        //   this.managedDownloader = new ManagedDownloader(s3, options);
    }

    createBucket(bucketName: string) {
        const input = {
            Bucket: bucketName
        };
        return this.client.send(new CreateBucketCommand(input));
    }

    async putObject(bucketName: string, key: string, content: Blob, metadata: S3ObjectMetadata[]) {
        //const meta: any = {};
        const meta: { [k: string]: any } = {};
        metadata.forEach((m) => {
            if (m.key !== undefined) {
                meta[m["key"]] = m.value;
            }
        });
        const command = {
            Bucket: bucketName,
            Key: key,
            Body: content,
            Metadata: meta
        };
        return this.client.send(new PutObjectCommand(command));
    }


    async getObject(bucketName: string, key: string) {
        const s3command = {
            Bucket: bucketName,
            Key: key
        };
        return this.client.send(new GetObjectCommand(s3command));
    }

    deleteObject(bucketName: string, key: string) {
        const input = {
            Bucket: bucketName,
            Key: key
        };
        return this.client.send(new DeleteObjectCommand(input));
    }

    deleteBucket(bucketName: string) {
        const input = {
            Bucket: bucketName
        };
        return this.client.send(new DeleteBucketCommand(input));
    }

    /**
     * @brief List all bucket counters
     *
     * @param prefix bucket name prefix
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listBucketCounters(prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 's3').set('x-awsmock-action', 'ListBucketCounters');
        const body = {
            region: environment.awsmockRegion,
            prefix: prefix,
            pageSize: pageSize,
            pageIndex: pageIndex,
            sortColumns: sortColumns
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    /**
     * @brief List all object counters
     *
     * @param bucket bucket name
     * @param prefix object name prefix
     * @param pageSize page size
     * @param pageIndex page index
     * @param sortColumns sorting columns
     */
    public listObjectsCounters(bucket: string, prefix: string, pageSize: number, pageIndex: number, sortColumns: SortColumn[]) {
        let headers = this.headers.set('x-awsmock-target', 's3').set('x-awsmock-action', 'ListObjectCounters');
        const body = {
            region: environment.awsmockRegion,
            bucket: bucket,
            prefix: prefix,
            pageSize: pageSize,
            pageIndex: pageIndex,
            sortColumns: sortColumns
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    /**
     * @brief Get a bucket details
     *
     * @param bucketName bucket name
     */
    public getBucket(bucketName: string) {
        let headers = this.headers.set('x-awsmock-target', 's3').set('x-awsmock-action', 'GetBucket');
        const body = {
            region: environment.awsmockRegion,
            bucketName: bucketName
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    /**
     * @brief Get a bucket details
     *
     * @param id object OID
     */
    public getObjectCounter(id: string) {
        let headers = this.headers.set('x-awsmock-target', 's3').set('x-awsmock-action', 'GetObjectCounter');
        const body = {
            region: environment.awsmockRegion,
            id: id
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    /**
     * @brief Deletes a S3 bucket. This will delete all objects of that bucket.
     *
     * @param bucketName bucket name
     */
    public purgeBucket(bucketName: string) {
        let headers = this.headers.set('x-awsmock-target', 's3').set('x-awsmock-action', 'PurgeBucket');
        const body = {
            region: environment.awsmockRegion,
            bucketName: bucketName
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    /**
     * @brief Touched a S3 bucket.
     *
     * @param bucket name of the bucket
     * @param key object key
     */
    public touchObject(bucket: string, key: string) {
        let headers = this.headers.set('x-awsmock-target', 's3').set('x-awsmock-action', 'TouchObject');
        const body = {region: environment.awsmockRegion, bucket: bucket, key: key}
        return this.http.post(this.url, body, {headers: headers});
    }

    /**
     * @brief Update an object in a bucket
     *
     * @param bucket name of the bucket
     * @param key object key
     * @param metadata list of object metadata
     */
    public updateObject(bucket: string, key: string, metadata: S3ObjectMetadata[]) {
        let headers = this.headers.set('x-awsmock-target', 's3').set('x-awsmock-action', 'UpdateObject');
        const body = {region: environment.awsmockRegion, bucket: bucket, key: key, metadata: metadata}
        return this.http.post(this.url, body, {headers: headers});
    }

    /**
     * @brief Deletes a S3 bucket. This will delete all objects of that bucket.
     *
     * @param bucketName bucket name
     */
    public deleteObjects(bucketName: string) {
        let headers = this.headers.set('x-awsmock-target', 's3').set('x-awsmock-action', 'DeleteObjects');
        const body = {
            region: environment.awsmockRegion,
            bucketName: bucketName
        }
        return this.http.post(this.url, body, {headers: headers});
    }

    /*
        public download(): string {
            // create a write stream for a file
            const params: GetObjectStreamInput = {
                Bucket: 'file-delivery',
                Key: 'ftpuser1/Onix21_13042025141953185.xml'
            };
            const chunks: any[] = [];
            this.managedDownloader.getObjectStream(params)
                .then(async (stream: any) => {
                    for await (const chunk of stream) {
                        chunks.push(Buffer.from(chunk));
                    }
                }, (err: any) => {
                    console.error(err);
                });
            return Buffer.concat(chunks).toString("utf-8");
        }*/
}