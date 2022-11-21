# Swap best practice by API for frontend

### Install

```shell
npm i @manahippo/hippo-sdk
npm i @manahippo/coin-list
```

### Setup

```typescript
import { CONFIGS } from "@manahippo/hippo-sdk";

const networkCfg = CONFIGS.main;

const aptosClient = useMemo(
  () =>
    new AptosClient(fullNodeUrl, {
      CREDENTIALS: "same-origin",
      WITH_CREDENTIALS: false,
    }),
  [fullNodeUrl]
);

// Create the CoinListClient instance explicitly
const coinListCli = useMemo(
  () => new CoinListClient(networkCfg.name as NetworkType),
  [networkCfg.name]
);
useEffect(() => {
  (async () => {
    // Load additonal coins besides the default coins
    await coinListCli.update(aptosClient);
  })();
}, [aptosClient, coinListCli]);

const hippoAgg = useMemo(
  () => new TradeAggregator(aptosClient, networkCfg, coinListCli),
  [aptosClient, coinListCli, networkCfg]
);
```

### Request routes

1. call method `TradeAggregator.RestApi.checkRoutesAndWarmUp` periodically when only trade pairs are selected but with empty base amount to check if there're routes for current trading pair and also prompt the server to warm-up.
2. call method `TradeAggregator.RestApi.requestQuotes` periodically when base amount not empty to get the latest availabe routes and quote data.

```typescript
const refreshRoutes = useCallback(
  () => {
    const isReload = true;
    const maxSteps = 3;
    if (baseAmount) {
      const { routes, allRoutesCount } = await hippoAgg.api.requestQuotes(
        baseAmount,
        fromToken,
        toToken,
        maxSteps,
        isReload
      );
      // ...
    } else {
      const { hasRoutes } = await hippoAgg.api.checkRoutesAndWarmUp(
        fromToken,
        toToken,
        maxSteps
      );
      // ...
    }
  },
  [
    /* ... */
  ]
);

// Refresh routes when users input
useEffect(() => {
  refreshRoutes();
}, [fromToken, toToken, baseAmount]);

// Refresh routes periodically
useInterval(() => {
  refreshRoutes();
  // A period of 15 to 40 seconds is recommended.
}, [20_000]);
```

### Make transactions

Get transaction payload via `IApiRouteAndQuote.ApiTradeRoute.makePayload`.

```Typescript
const { signAndSubmitTransaction } = useWallet();

// ...

// Choose the first route as the best and selected
const routeSelected = routes[0];

const input = routeSelected.quote.inputUiAmt;
const minOut = routeSelected.quote.outputUiAmt * (1 - slipTolerance / 100);

const payload = quoteSelected.route.makePayload(input, minOut, true);

const result = await signAndSubmitTransaction(
  payload as Types.TransactionPayload_EntryFunctionPayload,
  options
);

// ...

```
