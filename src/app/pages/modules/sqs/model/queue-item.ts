export interface QueueItem {
  queueUrl: string | undefined;
  queueName: string | undefined;
  messagesAvailable: number | undefined;
  messagesInFlight: number | undefined;
}
