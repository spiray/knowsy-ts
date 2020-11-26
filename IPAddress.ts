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

export default class IpAddress {
    // Represents an IP address
    private address: string;
    constructor(address: string) {
        // Initialize an ip address
        this.address = address
        this.validateIp()
    }

    validateIp() {
        // Check's if the IP is valid.
        if (isV4Format(this.address)) {
            return console.log(`${this.address} is a valid IP address.`)
        }
        return console.log(`${this.address} is not a valid IP address.`)
    }

    get getAddress() {
        return this.address
    }

    setIpAddress(inputIp: string) {
        this.address = inputIp
        this.validateIp()
    }

    async pingCheck(): Promise<MyPingResponse> {
        // Performs a ping check against the IP
        const { alive, output } = await ping.promise.probe(this.address);
        return { alive, output };
    }

    async dnsLookup(): Promise<MyLookupResponse> {
        const [{ address, family }] = await lookup(this.address, { all: true })
        return { address, family };
    }

    async dnsReverse() {
        const [host] = await reverse(this.address);
        return host;
    }

    async traceRoute(): Promise<Array<TraceResponse>> {
        console.log('Tracing...')
        const result = await trace(this.address);
        return result.filter((line: boolean | Record<string, string>) => typeof line !== 'boolean');
    }
}