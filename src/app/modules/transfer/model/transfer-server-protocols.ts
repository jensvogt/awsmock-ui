export interface TransferServerProtocol {
    Protocol: string;
    Port: number;
}

//{ "ProtocolCounters" : [ { "Protocol" : "FTP", "Port" : 2121 }, { "Protocol" : "SFTP", "Port" : 2222 } ], "Total" : 2 }
export interface TransferServerProtocolsResponse {
    ProtocolCounters: TransferServerProtocol[];
    Total: number;
}
