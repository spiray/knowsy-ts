import { prompt } from 'inquirer'
import { dnsLookup, dnsReverse, pingCheck, traceRoute } from './helpers'
import { IPPrompt } from './types';
import { writeToString } from '@fast-csv/format';
import { resolve } from 'path';
import { writeFile } from 'fs/promises'

async function main() {
    console.log('Welcome to Knowsy!  I know everything about IP addresses and Domains(coming soon).');
    const ipInput = await prompt<IPPrompt>([{ type: 'input', name: 'ip', message: 'What IP address do you want to know about? ' }, { type: 'list', name: 'type', message: 'Would you like to know about a domain name or an IP address?', choices: ['ip', 'domain'] }]);
    const { ip } = ipInput;
    const { alive } = await pingCheck(ip);
    console.log(`${ip} is ${alive ? 'alive' : 'not alive'}.`)

    // TODO: based on input type either do a reverse or a lookup...
    // TODO: Allow for multiple IPs/Domains
    const { address, family } = await dnsLookup();
    console.log({ address, family });
    const traceRes = await traceRoute();
    const traceResOut = traceRes.reduce((out, result, i) => out + `${Object.keys(result)[0]}${traceRes.length - 1 !== i ? '\n' : ' END'}`, '');
    const host = await dnsReverse(ip);
    const csvPath = resolve(__dirname, Date.now().toString() + '.csv');
    const file = await writeToString([
        ['IP', 'Domain Name', 'Pingable', 'Route'],
        [ip, host, alive ? 'Yes' : 'No', traceResOut]
    ]);
    await writeFile(csvPath, file);

}

main();