export const S3NotificationEvents = [
    's3:ReducedRedundancyLostObject',
    's3:ObjectCreated:*',
    's3:ObjectCreated:Put',
    's3:ObjectCreated:Post',
    's3:ObjectCreated:Copy',
    's3:ObjectCreated:CompleteMultipartUpload',
    's3:ObjectRemoved:*',
    's3:ObjectRemoved:Delete',
    's3:ObjectRemoved:DeleteMarkerCreated',
    's3:ObjectRestore:*',
    's3:ObjectRestore:Post',
    's3:ObjectRestore:Completed',
    's3:Replication:*',
    's3:Replication:OperationFailedReplication',
    's3:Replication:OperationNotTracked',
    's3:Replication:OperationMissedThreshold',
    's3:Replication:OperationReplicatedAfterThreshold',
    's3:ObjectRestore:Delete',
    's3:LifecycleTransition',
    's3:IntelligentTiering',
    's3:ObjectAcl:Put',
    's3:LifecycleExpiration:*',
    's3:LifecycleExpiration:Delete',
    's3:LifecycleExpiration:DeleteMarkerCreated',
    's3:ObjectTagging:*',
    's3:ObjectTagging:Put',
    's3:ObjectTagging:Delete'
];

export const S3FilterRuleTypes = [
    'prefix',
    'postfix',
];
