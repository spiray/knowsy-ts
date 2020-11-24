import ping from 'ping';
import { isV4Format } from 'ip';
import util from 'util';
import dns from 'dns';
import TraceRoute from 'nodejs-traceroute'

const lookup = util.promisify(dns.lookup);
interface MyPingResponse {
    alive: boolean;
    output: string;
}

interface MyLookupResponse {
    address: string;
    family: number;
}

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

    async traceRoute() {
        const tracer = new TraceRoute();
        tracer.on('pid', (pid:string) => {
                console.log(`pid: ${pid}`);
            })
            .on('destination', (destination:string) => {
                console.log(`destination: ${destination}`);
            })
            .on('hop', (hop:Record<string,string>) => {
                console.log(`hop: ${JSON.stringify(hop)}`);
            })
            .on('close', (code:string) => {
                console.log(`close: code ${code}`);
            });

        tracer.trace('github.com');
    }
}