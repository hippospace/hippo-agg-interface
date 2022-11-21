# Onchain integration example

This sample here demonstrates how to integrate with hippo-aggregator on-chain

Sample code at end of `typescript/src/cli.ts`:

```typescript
const testSwap = async (
  symbolX: string,
  symbolY: string,
  xInAmt: string,
  targetAddress: string
) => {
  const { client, account } = readConfig(program);
  const agg = new TradeAggregator(client);
  await agg.coinListClient.update(client); // update additional tokens
  const xInfo = agg.coinListClient.getCoinInfoBySymbol(symbolX)[0];
  const yInfo = agg.coinListClient.getCoinInfoBySymbol(symbolY)[0];
  const quote = await agg.getBestQuote(parseFloat(xInAmt), xInfo, yInfo);
  if (!quote) {
    console.log(`No quote from ${symbolX} to ${symbolY}`);
    return;
  }
  const params = quote.route.getSwapParams(parseFloat(xInAmt), 0);
  const payload = buildPayload_swap_and_transfer(
    params.numSteps,
    params.firstDexType,
    params.firstPoolType,
    params.firstIsReversed,
    params.secondDexType,
    params.secondPoolType,
    params.secondIsReversed,
    params.thirdDexType,
    params.thirdPoolType,
    params.thirdIsReversed,
    params.inAmt,
    new HexString(targetAddress),
    params.types
  );

  await sendPayloadTxAndLog(client, account, payload);
};

const testSwapApi = async (
  symbolX: string,
  symbolY: string,
  xInAmt: string,
  targetAddress: string,
  isReloadPools: boolean,
  slipTolerance: number,
  options = {}
) => {
  const { client, account } = readConfig(program);
  const agg = new TradeAggregator(client);
  await agg.coinListClient.update(client);
  const xInfo = agg.coinListClient.getCoinInfoBySymbol(symbolX)[0];
  const yInfo = agg.coinListClient.getCoinInfoBySymbol(symbolY)[0];
  const inputAmt = parseFloat(xInAmt);
  const result = await agg.requestQuotesViaAPI(
    inputAmt,
    xInfo,
    yInfo,
    isReloadPools
  );
  if (result.allRoutesCount === 0) {
    console.log(`No quote from ${symbolX} to ${symbolY}`);
    return;
  }

  const routeSelected = result.routes[0];
  // For wallets submitting transactions
  const input = routeSelected.quote.inputUiAmt;
  const minOut = routeSelected.quote.outputUiAmt * (1 - slipTolerance / 100);

  const payload = quoteSelected.route.makePayload(input, minOut, true);

  const result = await signAndSubmitTransaction(
    payload as Types.TransactionPayload_EntryFunctionPayload,
    options
  );

  // ...
};
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

# Frontend intergration

- [Frontend intergration demo](React-guide.md)
