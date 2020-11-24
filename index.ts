import { prompt } from 'inquirer'
import IpAddress from './IPAddress'
import { IPPrompt } from './types';

async function main() {
    console.log('Welcome to Knowsy!  I know everything about IP addresses and Domains(coming soon).');

    const ipInput = await prompt<IPPrompt>([{ type: 'input', name: 'ip', message: 'What IP address do you want to know about? ' }]);
    const ip = new IpAddress(ipInput.ip);
    const { alive } = await ip.pingCheck();
    console.log(`${ip.getAddress} is ${alive ? 'alive' : 'not alive'}.`)
    const { address, family } = await ip.dnsLookup();
    console.log({ address, family });
    const traceRes = await ip.traceRoute();
    for (const line of traceRes) {
        console.log(line);
    }
}

main();