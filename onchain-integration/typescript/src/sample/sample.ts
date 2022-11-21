import * as $ from "@manahippo/move-to-ts";
import {AptosDataCache, AptosParserRepo, DummyCache, AptosLocalCache} from "@manahippo/move-to-ts";
import {U8, U64, U128} from "@manahippo/move-to-ts";
import {u8, u64, u128} from "@manahippo/move-to-ts";
import {TypeParamDeclType, FieldDeclType} from "@manahippo/move-to-ts";
import {AtomicTypeTag, StructTag, TypeTag, VectorTag, SimpleStructTag} from "@manahippo/move-to-ts";
import {OptionTransaction} from "@manahippo/move-to-ts";
import {HexString, AptosClient, AptosAccount, TxnBuilderTypes, Types} from "aptos";
import * as Hippo_aggregator from "../hippo_aggregator";
import * as Stdlib from "../stdlib";
export const packageName = "hippo-agg-integration";
export const moduleAddress = new HexString("0xa6b693f810898d238d68a05084f478ddb5e75d79209b99edad285ac80eb5cab8");
export const moduleName = "sample";


export function check_and_deposit_opt_ (
  sender: HexString,
  coin_opt: Stdlib.Option.Option,
  $c: AptosDataCache,
  $p: TypeTag[], /* <X>*/
): void {
  let coin, sender_addr;
  if (Stdlib.Option.is_some_(coin_opt, $c, [new StructTag(new HexString("0x1"), "coin", "Coin", [$p[0]])])) {
    coin = Stdlib.Option.extract_(coin_opt, $c, [new StructTag(new HexString("0x1"), "coin", "Coin", [$p[0]])]);
    sender_addr = Stdlib.Signer.address_of_(sender, $c);
    if (!Stdlib.Coin.is_account_registered_($.copy(sender_addr), $c, [$p[0]])) {
      Stdlib.Coin.register_(sender, $c, [$p[0]]);
    }
    else{
    }
    Stdlib.Coin.deposit_($.copy(sender_addr), coin, $c, [$p[0]]);
  }
  else{
  }
  return Stdlib.Option.destroy_none_(coin_opt, $c, [new StructTag(new HexString("0x1"), "coin", "Coin", [$p[0]])]);
}

export function swap_and_transfer_ (
  sender: HexString,
  num_steps: U8,
  first_dex_type: U8,
  first_pool_type: U64,
  first_is_x_to_y: boolean,
  second_dex_type: U8,
  second_pool_type: U64,
  second_is_x_to_y: boolean,
  third_dex_type: U8,
  third_pool_type: U64,
  third_is_x_to_y: boolean,
  x_in: U64,
  target_address: HexString,
  $c: AptosDataCache,
  $p: TypeTag[], /* <X, Y, Z, OutCoin, E1, E2, E3>*/
): void {
  let coin_out, coin_x, x_remain, y_remain, z_remain;
  coin_x = Stdlib.Coin.withdraw_(sender, $.copy(x_in), $c, [$p[0]]);
  [x_remain, y_remain, z_remain, coin_out] = Hippo_aggregator.Aggregator.swap_direct_($.copy(num_steps), $.copy(first_dex_type), $.copy(first_pool_type), first_is_x_to_y, $.copy(second_dex_type), $.copy(second_pool_type), second_is_x_to_y, $.copy(third_dex_type), $.copy(third_pool_type), third_is_x_to_y, coin_x, $c, [$p[0], $p[1], $p[2], $p[3], $p[4], $p[5], $p[6]]);
  check_and_deposit_opt_(sender, x_remain, $c, [$p[0]]);
  check_and_deposit_opt_(sender, y_remain, $c, [$p[1]]);
  check_and_deposit_opt_(sender, z_remain, $c, [$p[2]]);
  Stdlib.Coin.deposit_($.copy(target_address), coin_out, $c, [$p[3]]);
  return;
}


export function buildPayload_swap_and_transfer (
  num_steps: U8,
  first_dex_type: U8,
  first_pool_type: U64,
  first_is_x_to_y: boolean,
  second_dex_type: U8,
  second_pool_type: U64,
  second_is_x_to_y: boolean,
  third_dex_type: U8,
  third_pool_type: U64,
  third_is_x_to_y: boolean,
  x_in: U64,
  target_address: HexString,
  $p: TypeTag[], /* <X, Y, Z, OutCoin, E1, E2, E3>*/
  isJSON = false,
): TxnBuilderTypes.TransactionPayloadEntryFunction
   | Types.TransactionPayload_EntryFunctionPayload {
  const typeParamStrings = $p.map(t=>$.getTypeTagFullname(t));
  return $.buildPayload(
    new HexString("0xa6b693f810898d238d68a05084f478ddb5e75d79209b99edad285ac80eb5cab8"),
    "sample",
    "swap_and_transfer",
    typeParamStrings,
    [
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
      x_in,
      target_address,
    ],
    isJSON,
  );

}

export function loadParsers(repo: AptosParserRepo) {
}
export class App {
  constructor(
    public client: AptosClient,
    public repo: AptosParserRepo,
    public cache: AptosLocalCache,
  ) {
  }
  get moduleAddress() {{ return moduleAddress; }}
  get moduleName() {{ return moduleName; }}
  payload_swap_and_transfer(
    num_steps: U8,
    first_dex_type: U8,
    first_pool_type: U64,
    first_is_x_to_y: boolean,
    second_dex_type: U8,
    second_pool_type: U64,
    second_is_x_to_y: boolean,
    third_dex_type: U8,
    third_pool_type: U64,
    third_is_x_to_y: boolean,
    x_in: U64,
    target_address: HexString,
    $p: TypeTag[], /* <X, Y, Z, OutCoin, E1, E2, E3>*/
    isJSON = false,
  ): TxnBuilderTypes.TransactionPayloadEntryFunction
        | Types.TransactionPayload_EntryFunctionPayload {
    return buildPayload_swap_and_transfer(num_steps, first_dex_type, first_pool_type, first_is_x_to_y, second_dex_type, second_pool_type, second_is_x_to_y, third_dex_type, third_pool_type, third_is_x_to_y, x_in, target_address, $p, isJSON);
  }
  async swap_and_transfer(
    _account: AptosAccount,
    num_steps: U8,
    first_dex_type: U8,
    first_pool_type: U64,
    first_is_x_to_y: boolean,
    second_dex_type: U8,
    second_pool_type: U64,
    second_is_x_to_y: boolean,
    third_dex_type: U8,
    third_pool_type: U64,
    third_is_x_to_y: boolean,
    x_in: U64,
    target_address: HexString,
    $p: TypeTag[], /* <X, Y, Z, OutCoin, E1, E2, E3>*/
    option?: OptionTransaction,
    _isJSON = false
  ) {
    const payload__ = buildPayload_swap_and_transfer(num_steps, first_dex_type, first_pool_type, first_is_x_to_y, second_dex_type, second_pool_type, second_is_x_to_y, third_dex_type, third_pool_type, third_is_x_to_y, x_in, target_address, $p, _isJSON);
    return $.sendPayloadTx(this.client, _account, payload__, option);
  }
}

