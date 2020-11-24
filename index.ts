import { prompt } from 'inquirer'
import IpAddress from './IPAddress'

type IPPrompt = Record<'ip', string>;

async function main() {
    console.log('Welcome to Knowsy!  I know everything about IP addresses and Domains(coming soon).');

    const ipInput = await prompt<IPPrompt>([{ type: 'input', name: 'ip', message: 'What IP address do you want to know about? ' }]);
    const ip = new IpAddress(ipInput.ip);
    ip.pingCheck()
    ip.dnsLookup();
}

main();