export type IPPrompt = { ip: string, type: 'domain' | 'ip' };

export interface MyPingResponse {
    alive: boolean;
    output: string;
}

export interface MyLookupResponse {
    address: string;
    family: number;
}

export type TraceResponse = Array<Record<string, Array<number>>>