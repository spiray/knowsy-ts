import ping from 'ping';
import { isV4Format } from 'ip';
import util from 'util';
import dns from 'dns';
// @ts-ignore
import TraceRoute from 'traceroute'
import { MyLookupResponse, MyPingResponse, TraceResponse } from './types';

const lookup = util.promisify(dns.lookup);
const reverse = util.promisify(dns.reverse);
const trace = util.promisify(TraceRoute.trace);


export function validateIp(ip: string) {
    // Check's if the IP is valid.
    if (isV4Format(ip)) {
        return console.log(`${ip} is a valid IP address.`)
    }
    return console.log(`${ip} is not a valid IP address.`)
}

export async function pingCheck(address: string): Promise<MyPingResponse> {
    // Performs a ping check against the IP
    const { alive, output } = await ping.promise.probe(address);
    return { alive, output };
}

export async function dnsLookup(host: string): Promise<MyLookupResponse> {
    const [{ address, family }] = await lookup(host, { all: true })
    return { address, family };
}

export async function dnsReverse(ip: string): Promise<string> {
    const [host] = await reverse(ip);
    return host;
}

export async function traceRoute(address: string): Promise<Array<TraceResponse>> {
    console.log('Tracing...')
    const result = await trace(address);
    return result.filter((line: boolean | Record<string, string>) => typeof line !== 'boolean');
}