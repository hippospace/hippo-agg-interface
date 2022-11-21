
import { AptosClient } from "aptos";
import { AptosParserRepo, AptosLocalCache, AptosSyncedCache, u8, u64, u128 } from "@manahippo/move-to-ts";
import * as hippo_aggregator from './hippo_aggregator';
import * as sample from './sample';
import * as stdlib from './stdlib';

export * as hippo_aggregator from './hippo_aggregator';
export * as sample from './sample';
export * as stdlib from './stdlib';

export { u8, u64, u128 };

export function getProjectRepo(): AptosParserRepo {
  const repo = new AptosParserRepo();
  hippo_aggregator.loadParsers(repo);
  sample.loadParsers(repo);
  stdlib.loadParsers(repo);
  repo.addDefaultParsers();
  return repo;
}

export class App {
  parserRepo: AptosParserRepo;
  cache: AptosLocalCache;
  hippo_aggregator : hippo_aggregator.App
  sample : sample.App
  stdlib : stdlib.App
  constructor(
    public client: AptosClient,
  ) {
    this.parserRepo = getProjectRepo();
    this.cache = new AptosLocalCache();
    this.hippo_aggregator = new hippo_aggregator.App(client, this.parserRepo, this.cache);
    this.sample = new sample.App(client, this.parserRepo, this.cache);
    this.stdlib = new stdlib.App(client, this.parserRepo, this.cache);
  }
}
