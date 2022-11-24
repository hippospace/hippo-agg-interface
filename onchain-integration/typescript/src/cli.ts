import {Command} from "commander";
import * as fs from "fs";
import * as yaml from "yaml";
import {AptosAccount, AptosClient, HexString, TxnBuilderTypes, Types} from "aptos";
import {App, CONFIGS, TradeAggregator, AggregatorTypes, MAINNET_CONFIG} from "@manahippo/hippo-sdk";
import {getSimulationKeys, sendPayloadTx, simulatePayloadTx} from "@manahippo/move-to-ts";
import { sample } from './src';
import {RouteAndQuote} from "@manahippo/hippo-sdk/dist/aggregator/types";

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

const sendPayloadTxLocal = async (
    simulation:boolean,
    client: AptosClient,
    account: AptosAccount,
    payload: TxnBuilderTypes.TransactionPayloadEntryFunction | Types.TransactionPayload_EntryFunctionPayload,
    maxGas: string
)=>{
    if (simulation) {
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

const printQuote = (quote:RouteAndQuote) => {
    console.log('\n############################################');
    quote.route.debugPrint();
    console.log(`Input: ${quote.quote.inputUiAmt}`);
    console.log(`Output: ${quote.quote.outputUiAmt}`);
    console.log(`Price Impact: ${quote.quote.priceImpact}`);
}

const program = new Command();

program
    .name('yarn cli')
    .description('')
    .requiredOption('-c, --config <path>', 'path to your aptos config.yml (generated with "aptos init")')
    .option('-p, --profile <PROFILE>', 'aptos config profile to use', 'default')

const makeSwapAndTransferPayload = (
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
    maxGas: string
)=>{

    const { netConf, account, client } = readConfig(program);
    const inputAmt = parseFloat(inputUiAmt);
    const toAddressHex = new HexString(toAddress)
    const isSimulation = simulation === "true"
    // use hardcoded default pools
    const agg = new TradeAggregator(client, netConf);

    const xInfo = agg.coinListClient.getCoinInfoBySymbol(fromSymbol)[0];
    const yInfo = agg.coinListClient.getCoinInfoBySymbol(toSymbol)[0];

    console.log("Getting best quote local...");
    const quote = await agg.getBestQuote(inputAmt, xInfo, yInfo);
    if (!quote) {
        console.log(`No quote from ${fromSymbol} to ${toSymbol}`);
        return;
    }
    printQuote(quote)
    console.log("Make swapAndTransfer Payload...")
    const payload = makeSwapAndTransferPayload(quote.route, inputAmt, toAddressHex);
    console.log("Sending tx...");
    await sendPayloadTxLocal(isSimulation, client, account, payload, maxGas)
}

program
    .command("swap-and-transfer")
    .argument('<fromSymbol>')
    .argument('<toSymbol>')
    .argument('<inputUiAmt>')
    .argument('<toAddress>')
    .argument('[simulation]','', "true")
    .argument('[maxGas]', '', '40000')
    .action(swapAndTransfer);

const swapLocalRoute = async (
    fromSymbol: string,
    toSymbol: string,
    inputUiAmt: string,
    simulation: string,
    routeIdx: string,
    maxGas: string
) => {
    const { client, account, netConf } = readConfig(program);
    const inputAmt = parseFloat(inputUiAmt);
    const isSimulation = simulation === "true"
    const routeIdxNumber = parseInt(routeIdx)

    // use pools load from onchain
    const agg = await TradeAggregator.create(client, netConf)

    const xInfo = agg.coinListClient.getCoinInfoBySymbol(fromSymbol)[0];
    const yInfo = agg.coinListClient.getCoinInfoBySymbol(toSymbol)[0];

    console.log("Getting quotes local...");
    const quotes = await agg.getQuotes(inputAmt, xInfo, yInfo);
    if (quotes.length === 0) {
        console.log(`No quote from ${fromSymbol} to ${toSymbol}`);
        return;
    }
    const routeSelected = quotes[routeIdxNumber];
    printQuote(routeSelected)
    console.log("Make swap payload...")
    const payload = routeSelected.route.makeSwapPayload(inputAmt,0);
    console.log("Sending tx...");
    await sendPayloadTxLocal(isSimulation, client, account, payload, maxGas)
};

program
    .command("swap-local-route")
    .argument('<fromSymbol>')
    .argument('<toSymbol>')
    .argument('<inputUiAmt>')
    .argument('[simulation]','', "true")
    .argument('[routeIdx]','', "0")
    .argument('[maxGas]', '', '40000')
    .action(swapLocalRoute);

const swapApiRoute = async (
    fromSymbol: string,
    toSymbol: string,
    inputUiAmt: string,
    simulation: string,
    routeIdx: string,
    maxGas: string
) => {
    const { client, account } = readConfig(program);
    const inputAmt = parseFloat(inputUiAmt);
    const isSimulation = simulation == "true"
    const routeIdxNumber = parseInt(routeIdx)

    // use pools load from onchain
    const agg = await TradeAggregator.create(client, MAINNET_CONFIG)

    const xInfo = agg.coinListClient.getCoinInfoBySymbol(fromSymbol)[0];
    const yInfo = agg.coinListClient.getCoinInfoBySymbol(toSymbol)[0];

    console.log("Fetching quotes from api...");
    const result = await agg.requestQuotesViaAPI(inputAmt, xInfo, yInfo);
    if (result.allRoutesCount === 0) {
        console.log(`No quote from ${fromSymbol} to ${toSymbol}`);
        return;
    }
    console.log(`Fetched ${result.allRoutesCount} quotes`);

    const routeSelected = result.routes[routeIdxNumber];
    const payload = routeSelected.route.makePayload(inputAmt, 0)

    console.log("Sending tx...");
    await sendPayloadTxLocal(isSimulation, client, account, payload, maxGas)
};

program
    .command("swap-api-route")
    .argument('<fromSymbol>')
    .argument('<toSymbol>')
    .argument('<inputUiAmt>')
    .argument('[simulation]','', "true")
    .argument('[routeIdx]','', "0")
    .argument('[maxGas]', '', '40000')
    .action(swapApiRoute);

/**
 *
 * @param fromSymbol
 * @param toSymbol
 * @param inputUiAmt
 * @param feeTo your account that get swap fees,
 *              should have coin store of output coin,
 *              you can create coin store use https://github.com/hippospace/aptos-coin-list
 * @param feeBips
 *              1. You will get half of this fee bips, and another half is to hippo account
 *              2. You can not set it more than 0.003 (0.3 %)
 * @param simulation
 * @param maxGas
 */
const swapWithFees= async (
    fromSymbol: string,
    toSymbol: string,
    inputUiAmt: string,
    feeTo: string,
    feeBips: string,
    simulation: string,
    maxGas: string
) => {
    const { client, account } = readConfig(program);
    const inputAmt = parseFloat(inputUiAmt);
    const feeToHex = new HexString(feeTo)
    const feeBipsNumber = parseFloat(feeBips) // 0.1 %
    const isSimulation = simulation == "true"

    // use pools load from onchain
    const agg = await TradeAggregator.create(client, MAINNET_CONFIG)

    const xInfo = agg.coinListClient.getCoinInfoBySymbol(fromSymbol)[0];
    const yInfo = agg.coinListClient.getCoinInfoBySymbol(toSymbol)[0];

    console.log("Fetching quotes api...");
    const quote = await agg.getBestQuote(inputAmt, xInfo, yInfo);
    if (!quote) {
        console.log(`No quote from ${fromSymbol} to ${toSymbol}`);
        return;
    }
    printQuote(quote)
    const payload = quote.route.makeSwapWithFeesPayload(inputAmt, 0, feeToHex, feeBipsNumber)

    console.log("Sending tx...");
    await sendPayloadTxLocal(isSimulation, client, account, payload, maxGas)
};

program
    .command("swap-with-fees")
    .argument('<fromSymbol>')
    .argument('<toSymbol>')
    .argument('<inputUiAmt>')
    .argument('<feeTo>')
    .argument('[feeBips]','', "0.002")
    .argument('[simulation]','', "true")
    .argument('[maxGas]', '', '40000')
    .action(swapWithFees);

const swapWithFixedOutput= async (
    fromSymbol: string,
    toSymbol: string,
    outputUiAmt: string,
    simulation: string,
    maxGas: string
) => {
    const { client, account } = readConfig(program);
    const outputAmt = parseFloat(outputUiAmt);
    const isSimulation = simulation == "true"

    // use pools load from onchain
    const agg = await TradeAggregator.create(client, MAINNET_CONFIG)

    const xInfo = agg.coinListClient.getCoinInfoBySymbol(fromSymbol)[0];
    const yInfo = agg.coinListClient.getCoinInfoBySymbol(toSymbol)[0];

    console.log("Getting best quote with fixed output local...");
    const quote = await agg.getBestQuoteWithFixedOutput(outputAmt, xInfo, yInfo);
    if (!quote) {
        console.log(`No quote from ${fromSymbol} to ${toSymbol}`);
        return;
    }
    printQuote(quote)
    const maxInputAmt = quote.quote.inputUiAmt * 1.05; // float up according to you
    const payload = quote.route.makeFixedOutputPayload(outputAmt, maxInputAmt)

    console.log("Sending tx...");
    await sendPayloadTxLocal(isSimulation, client, account, payload, maxGas)
};

program
    .command("swap-with-fixed-output")
    .argument('<fromSymbol>')
    .argument('<toSymbol>')
    .argument('<outputUiAmt>')
    .argument('[simulation]','', "true")
    .argument('[maxGas]', '', '40000')
    .action(swapWithFixedOutput);



program.parse();