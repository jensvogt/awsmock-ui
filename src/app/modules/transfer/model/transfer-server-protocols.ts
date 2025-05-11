export interface TransferServerProtocol {
    protocol: string;
    port: number;
}

//{ "ProtocolCounters" : [ { "Protocol" : "FTP", "Port" : 2121 }, { "Protocol" : "SFTP", "Port" : 2222 } ], "Total" : 2 }
export interface TransferServerProtocolsResponse {
    protocolCounters: TransferServerProtocol[];
    total: number;
}
