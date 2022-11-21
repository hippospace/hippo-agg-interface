import {Command} from "commander";
import * as fs from "fs";
import * as yaml from "yaml";
import {AptosAccount, AptosClient, HexString, TxnBuilderTypes, Types} from "aptos";
import {App, CONFIGS, TradeAggregator, AggregatorTypes} from "@manahippo/hippo-sdk";
import {getSimulationKeys, sendPayloadTx, simulatePayloadTx} from "@manahippo/move-to-ts";
import { sample } from './src';

export const readConfig = (program:Command) => {
    const { config, profile } = program.opts();
    const ymlContent = fs.readFileSync(config, { encoding: 'utf-8' });
    const result = yaml.parse(ymlContent);
    //console.log(result);
    if (!result.profiles) {
        throw new Error('Expect a profiles to be present in yaml config');
    }
    if (!result.profiles[profile]) {
        throw new Error(`Expect a ${profile} profile to be present in yaml config`);
    }
    const url = result.profiles[profile].rest_url;
    const privateKeyStr = result.profiles[profile].private_key;
    if (!url) {
        throw new Error(`Expect rest_url to be present in ${profile} profile`);
    }
    if (!privateKeyStr) {
        throw new Error(`Expect private_key to be present in ${profile} profile`);
    }
    const privateKey = new HexString(privateKeyStr);

    const netConf = (url as string).includes('mainnet')
        ? CONFIGS.mainnet
        : (url as string).includes('testnet')
            ? CONFIGS.testnet
            : CONFIGS.localhost;
    const coinListAddress = netConf.coinListAddress;
    const client = new AptosClient(result.profiles[profile].rest_url);
    const app = new App(client);
    const account = new AptosAccount(privateKey.toUint8Array());
    console.log(`Using address ${account.address().hex()} on ${netConf.name}`);
    return { app, client, account, coinListAddress, netConf };
};

const program = new Command();

program
    .name('yarn cli')
    .description('')
    .requiredOption('-c, --config <path>', 'path to your aptos config.yml (generated with "aptos init")')
    .option('-p, --profile <PROFILE>', 'aptos config profile to use', 'default')

const makePayload = (
    route: AggregatorTypes.TradeRoute,
    inputUiAmt: number,
    toAddress: HexString,
    isJSONPayload = false
): TxnBuilderTypes.TransactionPayloadEntryFunction | Types.TransactionPayload_EntryFunctionPayload => {
    const params = route.getSwapParams(inputUiAmt, 0);
    return sample.Sample.buildPayload_swap_and_transfer(
        params.numSteps,
        // first
        params.firstDexType,
        params.firstPoolType,
        params.firstIsReversed,
        // second
        params.secondDexType,
        params.secondPoolType,
        params.secondIsReversed,
        // third
        params.thirdDexType,
        params.thirdPoolType,
        params.thirdIsReversed,
        // sizes
        params.inAmt,
        toAddress,
        params.types,
        isJSONPayload
    );
}

const swapAndTransfer = async (
    fromSymbol: string,
    toSymbol: string,
    inputUiAmt: string,
    toAddress: string,
    simulation: string,
    routeIdx: string,
    maxGas: string
)=>{
    const { netConf, account, client } = readConfig(program);
    const agg = await TradeAggregator.create(client, netConf);
    const xCoinInfos = agg.coinListClient.getCoinInfoBySymbol(fromSymbol);
    const yCoinInfos = agg.coinListClient.getCoinInfoBySymbol(toSymbol);
    const inputAmt = parseFloat(inputUiAmt);
    const toAddressHex = new HexString(toAddress)

    const quotes = await agg.getQuotes(inputAmt, xCoinInfos[0], yCoinInfos[0]);
    if (quotes.length === 0) {
        console.log('No route available');
        return;
    }
    const payload = makePayload(quotes[parseInt(routeIdx)].route,inputAmt, toAddressHex);
    if (simulation === "true") {
        const simResult = await simulatePayloadTx(
            client,
            getSimulationKeys(account),
            payload as TxnBuilderTypes.TransactionPayloadEntryFunction,
            { maxGasAmount: parseInt(maxGas) }
        );
        console.log(JSON.stringify(simResult, null, 2));
    } else {
        await sendPayloadTx(client, account, payload as TxnBuilderTypes.TransactionPayloadEntryFunction, {
            maxGasAmount: parseInt(maxGas)
        });
    }
}

program
    .command("swap-and-transfer")
    .argument('<fromSymbol>')
    .argument('<toSymbol>')
    .argument('<inputUiAmt>')
    .argument('<toAddress>')
    .argument('[simulation]','', "true")
    .argument('[routeIdx]', '', '0')
    .argument('[maxGas]', '', '40000')
    .action(swapAndTransfer);

program.parse();