# Onchain integration example

This sample here demonstrates how to integrate with hippo-aggregator on-chain

#Steps

1.Create Aggregator 
```typescript
    const netConf = MAINNET_CONFIG
    // use another fullNode yours
    // MAINNET_CONFIG.fullNodeUrl = ""
    const client = new AptosClient(netconf.fullNodeUrl);
    // use hardcoded default pools
    const agg = new TradeAggregator(client, netConf);
    
    // or use pools load from onchain
    const agg = await TradeAggregator.create(client, netConf)
```

2.Get a quote
```typescript
    console.log("Getting best quote local...");
    const quote = await agg.getBestQuote(inputAmt, xInfo, yInfo);
    if (!quote) {
        console.log(`No quote from ${fromSymbol} to ${toSymbol}`);
        return;
    }    
    
    // Or
    console.log("Getting quotes local...");
    // better price up front
    const quotes = await agg.getQuotes(inputAmt, xInfo, yInfo);
    if (quotes.length === 0) {
        console.log(`No quote from ${fromSymbol} to ${toSymbol}`);
        return;
    }
    const routeSelected = quotes[routeIdxNumber];
    
    // Or
    console.log("Getting best quote with fixed output local...");
    const quote = await agg.getBestQuoteWithFixedOutput(outputAmt, xInfo, yInfo);
    if (!quote) {
        console.log(`No quote from ${fromSymbol} to ${toSymbol}`);
        return;
    }

    // Or
    console.log("Fetching quotes from api...");
    const result = await agg.requestQuotesViaAPI(inputAmt, xInfo, yInfo);
    if (result.allRoutesCount === 0) {
        console.log(`No quote from ${fromSymbol} to ${toSymbol}`);
        return;
    }
    const routeSelected = result.routes[routeIdxNumber];
```

3. Make payload
```typescript

    // Make swap payload 
    const payload = quote.route.makeSwapPayload(inputAmt,0);
    
    // Or make swap with fixed output payload
    const maxInputAmt = quote.quote.inputUiAmt * 1.05; // float up according to you
    const payload = quote.route.makeFixedOutputPayload(outputAmt, maxInputAmt)
    
    // Or make swap with fees payload, must get quote by getBestQuoteWithFixedOutput or getQuoteWithFixedOutput
    const payload = quote.route.makeSwapWithFeesPayload(inputAmt, 0, feeToHex, feeBipsNumber)

```

#Onchain integration sample code at `typescript/src/cli.ts`:

```typescript

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
```

The sample TS code invokes an onchain function, which uses the aggregator to perform a swap, and then deposit the output
coin to a separate address.

```move
public entry fun swap_and_transfer<
    X, Y, Z, OutCoin, E1, E2, E3
>(
    sender: &signer,
    // parameters for aggregator swap
    num_steps: u8,
    first_dex_type: u8,
    first_pool_type: u64,
    first_is_x_to_y: bool, // first trade uses normal order
    second_dex_type: u8,
    second_pool_type: u64,
    second_is_x_to_y: bool, // second trade uses normal order
    third_dex_type: u8,
    third_pool_type: u64,
    third_is_x_to_y: bool, // second trade uses normal order
    x_in: u64,
    // address to send output to
    target_address: address,
) {
    let coin_x = coin::withdraw<X>(sender, x_in);
    // invoke aggregator
    let (x_remain, y_remain, z_remain, coin_out) = swap_direct<X, Y, Z, OutCoin, E1, E2, E3>(
        num_steps,
        first_dex_type,
        first_pool_type,
        first_is_x_to_y,
        second_dex_type,
        second_pool_type,
        second_is_x_to_y,
        third_dex_type,
        third_pool_type,
        third_is_x_to_y,
        coin_x
    );

    // deal with output
    check_and_deposit_opt(sender, x_remain);
    check_and_deposit_opt(sender, y_remain);
    check_and_deposit_opt(sender, z_remain);
    coin::deposit(target_address, coin_out);
}
```

#Other samples code at `typescript/src/cli.ts` 

```typescript
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
    feeToAddress: string,
    feeBips: string,
    simulation: string,
    maxGas: string
) => {
    const { client, account } = readConfig(program);
    const inputAmt = parseFloat(inputUiAmt);
    const feeToAddressHex = new HexString(feeToAddress)
    const feeBipsNumber = parseFloat(feeBips)
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
    const payload = quote.route.makeSwapWithFeesPayload(inputAmt, 0, feeToAddressHex, feeBipsNumber)

    console.log("Sending tx...");
    await sendPayloadTxLocal(isSimulation, client, account, payload, maxGas)
};

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
```

#Test
```shell
yarn

yarn build

yarn cli swap-and-transfer APT USDC 0.1 0xa6a3ebdf06e519b5fd6bb4d3c3cb5c45e5590c9351f03ad6265a107f532adce6 -c [your-aptos-path] -p [profile]

yarn cli swap-local-route APT USDC 0.1 -c [your-aptos-path] -p [profile]

yarn cli swap-api-route APT USDC 0.1 -c [your-aptos-path] -p [profile]

yarn cli swap-with-fees APT USDC 0.1 0xa6a3ebdf06e519b5fd6bb4d3c3cb5c45e5590c9351f03ad6265a107f532adce6 -c [your-aptos-path] -p [profile]

yarn cli swap-with-fixed-output APT USDC 0.1 -c [your-aptos-path] -p [profile]

```



# Frontend integration

- [Frontend integration demo](React-guide.md)
