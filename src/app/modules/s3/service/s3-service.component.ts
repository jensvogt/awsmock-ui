import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {CreateBucketCommand, DeleteBucketCommand, DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {SortColumn} from "../../../shared/sorting/sorting.component";
import {HttpClient, HttpHeaders} from "@angular/common/http";


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

    constructor(private http: HttpClient) {
    }

    createBucket(bucketName: string) {
        const input = {
            Bucket: bucketName
        };
        return this.client.send(new CreateBucketCommand(input));
    }

    async putObject(bucketName: string, key: string, content: Blob) {
        const command = {
            Bucket: bucketName,
            Key: key,
            Body: content,
        };
        return this.client.send(new PutObjectCommand(command));
    }


    async getObject(bucketName: string, key: string) {
        const command = {
            Bucket: bucketName,
            Key: key
        };
        return this.client.send(new GetObjectCommand(command));
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
}