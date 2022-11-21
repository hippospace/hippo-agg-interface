import * as $ from "@manahippo/move-to-ts";
import {AptosDataCache, AptosParserRepo, DummyCache, AptosLocalCache} from "@manahippo/move-to-ts";
import {U8, U64, U128} from "@manahippo/move-to-ts";
import {u8, u64, u128} from "@manahippo/move-to-ts";
import {TypeParamDeclType, FieldDeclType} from "@manahippo/move-to-ts";
import {AtomicTypeTag, StructTag, TypeTag, VectorTag, SimpleStructTag} from "@manahippo/move-to-ts";
import {OptionTransaction} from "@manahippo/move-to-ts";
import {HexString, AptosClient, AptosAccount, TxnBuilderTypes, Types} from "aptos";
import * as Stdlib from "../stdlib";
export const packageName = "HippoAggregator";
export const moduleAddress = new HexString("0x89576037b3cc0b89645ea393a47787bb348272c76d6941c574b053672b848039");
export const moduleName = "aggregator";

export const AUX_TYPE_AMM : U64 = u64("0");
export const AUX_TYPE_MARKET : U64 = u64("1");
export const DEX_ANIMESWAP : U8 = u8("9");
export const DEX_APTOSWAP : U8 = u8("7");
export const DEX_AUX : U8 = u8("8");
export const DEX_CETUS : U8 = u8("10");
export const DEX_DITTO : U8 = u8("5");
export const DEX_OBRIC : U8 = u8("12");
export const DEX_PANCAKE : U8 = u8("11");
export const DEX_PONTEM : U8 = u8("3");
export const DEX_TORTUGA : U8 = u8("6");
export const E_COIN_STORE_NOT_EXITES : U64 = u64("8");
export const E_FEE_BIPS_TOO_LARGE : U64 = u64("13");
export const E_INVALID_PAIR_OF_DITTO : U64 = u64("5");
export const E_INVALID_PAIR_OF_TORTUGA : U64 = u64("6");
export const E_NOT_ADMIN : U64 = u64("4");
export const E_OUTPUT_LESS_THAN_MINIMUM : U64 = u64("2");
export const E_OUTPUT_NOT_EQAULS_REQUEST : U64 = u64("12");
export const E_TYPE_NOT_EQUAL : U64 = u64("7");
export const E_UNKNOWN_DEX : U64 = u64("3");
export const E_UNKNOWN_POOL_TYPE : U64 = u64("1");
export const E_UNSUPPORTED : U64 = u64("10");
export const E_UNSUPPORTED_FIXEDOUT_SWAP : U64 = u64("11");
export const E_UNSUPPORTED_NUM_STEPS : U64 = u64("9");
export const MAX_U64 : U64 = u64("18446744073709551615");

export function one_step_direct_ (
  _dex_type: U8,
  _pool_type: U64,
  _is_x_to_y: boolean,
  x_in: Stdlib.Coin.Coin,
  $c: AptosDataCache,
  $p: TypeTag[], /* <X, Y, E>*/
): [Stdlib.Option.Option, Stdlib.Coin.Coin] {
  return [Stdlib.Option.some_(x_in, $c, [new StructTag(new HexString("0x1"), "coin", "Coin", [$p[0]])]), Stdlib.Coin.zero_($c, [$p[1]])];
}

export function one_step_route_ (
  _sender: HexString,
  _first_dex_type: U8,
  _first_pool_type: U64,
  _first_is_x_to_y: boolean,
  _x_in: U64,
  _y_min_out: U64,
  $c: AptosDataCache,
  $p: TypeTag[], /* <X, Y, E>*/
): void {
  return;
}


export function buildPayload_one_step_route (
  _first_dex_type: U8,
  _first_pool_type: U64,
  _first_is_x_to_y: boolean,
  _x_in: U64,
  _y_min_out: U64,
  $p: TypeTag[], /* <X, Y, E>*/
  isJSON = false,
): TxnBuilderTypes.TransactionPayloadEntryFunction
   | Types.TransactionPayload_EntryFunctionPayload {
  const typeParamStrings = $p.map(t=>$.getTypeTagFullname(t));
  return $.buildPayload(
    new HexString("0x89576037b3cc0b89645ea393a47787bb348272c76d6941c574b053672b848039"),
    "aggregator",
    "one_step_route",
    typeParamStrings,
    [
      _first_dex_type,
      _first_pool_type,
      _first_is_x_to_y,
      _x_in,
      _y_min_out,
    ],
    isJSON,
  );

}

export function swap_ (
  _sender: HexString,
  _num_steps: U8,
  _first_dex_type: U8,
  _first_pool_type: U64,
  _first_is_x_to_y: boolean,
  _second_dex_type: U8,
  _second_pool_type: U64,
  _second_is_x_to_y: boolean,
  _third_dex_type: U8,
  _third_pool_type: U64,
  _third_is_x_to_y: boolean,
  _x_in: U64,
  _m_min_out: U64,
  $c: AptosDataCache,
  $p: TypeTag[], /* <X, Y, Z, OutCoin, E1, E2, E3>*/
): void {
  return;
}


export function buildPayload_swap (
  _num_steps: U8,
  _first_dex_type: U8,
  _first_pool_type: U64,
  _first_is_x_to_y: boolean,
  _second_dex_type: U8,
  _second_pool_type: U64,
  _second_is_x_to_y: boolean,
  _third_dex_type: U8,
  _third_pool_type: U64,
  _third_is_x_to_y: boolean,
  _x_in: U64,
  _m_min_out: U64,
  $p: TypeTag[], /* <X, Y, Z, OutCoin, E1, E2, E3>*/
  isJSON = false,
): TxnBuilderTypes.TransactionPayloadEntryFunction
   | Types.TransactionPayload_EntryFunctionPayload {
  const typeParamStrings = $p.map(t=>$.getTypeTagFullname(t));
  return $.buildPayload(
    new HexString("0x89576037b3cc0b89645ea393a47787bb348272c76d6941c574b053672b848039"),
    "aggregator",
    "swap",
    typeParamStrings,
    [
      _num_steps,
      _first_dex_type,
      _first_pool_type,
      _first_is_x_to_y,
      _second_dex_type,
      _second_pool_type,
      _second_is_x_to_y,
      _third_dex_type,
      _third_pool_type,
      _third_is_x_to_y,
      _x_in,
      _m_min_out,
    ],
    isJSON,
  );

}

export function swap_direct_ (
  _num_steps: U8,
  _first_dex_type: U8,
  _first_pool_type: U64,
  _first_is_x_to_y: boolean,
  _second_dex_type: U8,
  _second_pool_type: U64,
  _second_is_x_to_y: boolean,
  _third_dex_type: U8,
  _third_pool_type: U64,
  _third_is_x_to_y: boolean,
  x_in: Stdlib.Coin.Coin,
  $c: AptosDataCache,
  $p: TypeTag[], /* <X, Y, Z, OutCoin, E1, E2, E3>*/
): [Stdlib.Option.Option, Stdlib.Option.Option, Stdlib.Option.Option, Stdlib.Coin.Coin] {
  return [Stdlib.Option.some_(x_in, $c, [new StructTag(new HexString("0x1"), "coin", "Coin", [$p[0]])]), Stdlib.Option.none_($c, [new StructTag(new HexString("0x1"), "coin", "Coin", [$p[1]])]), Stdlib.Option.none_($c, [new StructTag(new HexString("0x1"), "coin", "Coin", [$p[2]])]), Stdlib.Coin.zero_($c, [$p[3]])];
}

export function swap_with_fees_ (
  _sender: HexString,
  _num_steps: U8,
  _first_dex_type: U8,
  _first_pool_type: U64,
  _first_is_x_to_y: boolean,
  _second_dex_type: U8,
  _second_pool_type: U64,
  _second_is_x_to_y: boolean,
  _third_dex_type: U8,
  _third_pool_type: U64,
  _third_is_x_to_y: boolean,
  _x_in: U64,
  _m_min_out: U64,
  _fee_to: HexString,
  _fee_bips: U8,
  $c: AptosDataCache,
  $p: TypeTag[], /* <X, Y, Z, OutCoin, E1, E2, E3>*/
): void {
  return;
}


export function buildPayload_swap_with_fees (
  _num_steps: U8,
  _first_dex_type: U8,
  _first_pool_type: U64,
  _first_is_x_to_y: boolean,
  _second_dex_type: U8,
  _second_pool_type: U64,
  _second_is_x_to_y: boolean,
  _third_dex_type: U8,
  _third_pool_type: U64,
  _third_is_x_to_y: boolean,
  _x_in: U64,
  _m_min_out: U64,
  _fee_to: HexString,
  _fee_bips: U8,
  $p: TypeTag[], /* <X, Y, Z, OutCoin, E1, E2, E3>*/
  isJSON = false,
): TxnBuilderTypes.TransactionPayloadEntryFunction
   | Types.TransactionPayload_EntryFunctionPayload {
  const typeParamStrings = $p.map(t=>$.getTypeTagFullname(t));
  return $.buildPayload(
    new HexString("0x89576037b3cc0b89645ea393a47787bb348272c76d6941c574b053672b848039"),
    "aggregator",
    "swap_with_fees",
    typeParamStrings,
    [
      _num_steps,
      _first_dex_type,
      _first_pool_type,
      _first_is_x_to_y,
      _second_dex_type,
      _second_pool_type,
      _second_is_x_to_y,
      _third_dex_type,
      _third_pool_type,
      _third_is_x_to_y,
      _x_in,
      _m_min_out,
      _fee_to,
      _fee_bips,
    ],
    isJSON,
  );

}

export function swap_with_fixed_output_ (
  _sender: HexString,
  _dex_type: U8,
  _pool_type: U64,
  _is_x_to_y: boolean,
  _max_in: U64,
  _amount_out: U64,
  $c: AptosDataCache,
  $p: TypeTag[], /* <InputCoin, OutputCoin, E>*/
): void {
  return;
}


export function buildPayload_swap_with_fixed_output (
  _dex_type: U8,
  _pool_type: U64,
  _is_x_to_y: boolean,
  _max_in: U64,
  _amount_out: U64,
  $p: TypeTag[], /* <InputCoin, OutputCoin, E>*/
  isJSON = false,
): TxnBuilderTypes.TransactionPayloadEntryFunction
   | Types.TransactionPayload_EntryFunctionPayload {
  const typeParamStrings = $p.map(t=>$.getTypeTagFullname(t));
  return $.buildPayload(
    new HexString("0x89576037b3cc0b89645ea393a47787bb348272c76d6941c574b053672b848039"),
    "aggregator",
    "swap_with_fixed_output",
    typeParamStrings,
    [
      _dex_type,
      _pool_type,
      _is_x_to_y,
      _max_in,
      _amount_out,
    ],
    isJSON,
  );

}

export function swap_with_fixed_output_direct_ (
  _dex_type: U8,
  _pool_type: U64,
  _is_x_to_y: boolean,
  _max_in: U64,
  _amount_out: U64,
  coin_in: Stdlib.Coin.Coin,
  $c: AptosDataCache,
  $p: TypeTag[], /* <InputCoin, OutputCoin, E>*/
): [Stdlib.Coin.Coin, Stdlib.Coin.Coin] {
  return [coin_in, Stdlib.Coin.zero_($c, [$p[1]])];
}

export function three_step_direct_ (
  _first_dex_type: U8,
  _first_pool_type: U64,
  _first_is_x_to_y: boolean,
  _second_dex_type: U8,
  _second_pool_type: U64,
  _second_is_x_to_y: boolean,
  _third_dex_type: U8,
  _third_pool_type: U64,
  _third_is_x_to_y: boolean,
  x_in: Stdlib.Coin.Coin,
  $c: AptosDataCache,
  $p: TypeTag[], /* <X, Y, Z, M, E1, E2, E3>*/
): [Stdlib.Option.Option, Stdlib.Option.Option, Stdlib.Option.Option, Stdlib.Coin.Coin] {
  return [Stdlib.Option.some_(x_in, $c, [new StructTag(new HexString("0x1"), "coin", "Coin", [$p[0]])]), Stdlib.Option.none_($c, [new StructTag(new HexString("0x1"), "coin", "Coin", [$p[1]])]), Stdlib.Option.none_($c, [new StructTag(new HexString("0x1"), "coin", "Coin", [$p[2]])]), Stdlib.Coin.zero_($c, [$p[3]])];
}

export function three_step_route_ (
  _sender: HexString,
  _first_dex_type: U8,
  _first_pool_type: U64,
  _first_is_x_to_y: boolean,
  _second_dex_type: U8,
  _second_pool_type: U64,
  _second_is_x_to_y: boolean,
  _third_dex_type: U8,
  _third_pool_type: U64,
  _third_is_x_to_y: boolean,
  _x_in: U64,
  _m_min_out: U64,
  $c: AptosDataCache,
  $p: TypeTag[], /* <X, Y, Z, M, E1, E2, E3>*/
): void {
  return;
}


export function buildPayload_three_step_route (
  _first_dex_type: U8,
  _first_pool_type: U64,
  _first_is_x_to_y: boolean,
  _second_dex_type: U8,
  _second_pool_type: U64,
  _second_is_x_to_y: boolean,
  _third_dex_type: U8,
  _third_pool_type: U64,
  _third_is_x_to_y: boolean,
  _x_in: U64,
  _m_min_out: U64,
  $p: TypeTag[], /* <X, Y, Z, M, E1, E2, E3>*/
  isJSON = false,
): TxnBuilderTypes.TransactionPayloadEntryFunction
   | Types.TransactionPayload_EntryFunctionPayload {
  const typeParamStrings = $p.map(t=>$.getTypeTagFullname(t));
  return $.buildPayload(
    new HexString("0x89576037b3cc0b89645ea393a47787bb348272c76d6941c574b053672b848039"),
    "aggregator",
    "three_step_route",
    typeParamStrings,
    [
      _first_dex_type,
      _first_pool_type,
      _first_is_x_to_y,
      _second_dex_type,
      _second_pool_type,
      _second_is_x_to_y,
      _third_dex_type,
      _third_pool_type,
      _third_is_x_to_y,
      _x_in,
      _m_min_out,
    ],
    isJSON,
  );

}

export function two_step_direct_ (
  _first_dex_type: U8,
  _first_pool_type: U64,
  _first_is_x_to_y: boolean,
  _second_dex_type: U8,
  _second_pool_type: U64,
  _second_is_x_to_y: boolean,
  x_in: Stdlib.Coin.Coin,
  $c: AptosDataCache,
  $p: TypeTag[], /* <X, Y, Z, E1, E2>*/
): [Stdlib.Option.Option, Stdlib.Option.Option, Stdlib.Coin.Coin] {
  return [Stdlib.Option.some_(x_in, $c, [new StructTag(new HexString("0x1"), "coin", "Coin", [$p[0]])]), Stdlib.Option.none_($c, [new StructTag(new HexString("0x1"), "coin", "Coin", [$p[1]])]), Stdlib.Coin.zero_($c, [$p[2]])];
}

export function two_step_route_ (
  _sender: HexString,
  _first_dex_type: U8,
  _first_pool_type: U64,
  _first_is_x_to_y: boolean,
  _second_dex_type: U8,
  _second_pool_type: U64,
  _second_is_x_to_y: boolean,
  _x_in: U64,
  _z_min_out: U64,
  $c: AptosDataCache,
  $p: TypeTag[], /* <X, Y, Z, E1, E2>*/
): void {
  return;
}


export function buildPayload_two_step_route (
  _first_dex_type: U8,
  _first_pool_type: U64,
  _first_is_x_to_y: boolean,
  _second_dex_type: U8,
  _second_pool_type: U64,
  _second_is_x_to_y: boolean,
  _x_in: U64,
  _z_min_out: U64,
  $p: TypeTag[], /* <X, Y, Z, E1, E2>*/
  isJSON = false,
): TxnBuilderTypes.TransactionPayloadEntryFunction
   | Types.TransactionPayload_EntryFunctionPayload {
  const typeParamStrings = $p.map(t=>$.getTypeTagFullname(t));
  return $.buildPayload(
    new HexString("0x89576037b3cc0b89645ea393a47787bb348272c76d6941c574b053672b848039"),
    "aggregator",
    "two_step_route",
    typeParamStrings,
    [
      _first_dex_type,
      _first_pool_type,
      _first_is_x_to_y,
      _second_dex_type,
      _second_pool_type,
      _second_is_x_to_y,
      _x_in,
      _z_min_out,
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
  payload_one_step_route(
    _first_dex_type: U8,
    _first_pool_type: U64,
    _first_is_x_to_y: boolean,
    _x_in: U64,
    _y_min_out: U64,
    $p: TypeTag[], /* <X, Y, E>*/
    isJSON = false,
  ): TxnBuilderTypes.TransactionPayloadEntryFunction
        | Types.TransactionPayload_EntryFunctionPayload {
    return buildPayload_one_step_route(_first_dex_type, _first_pool_type, _first_is_x_to_y, _x_in, _y_min_out, $p, isJSON);
  }
  async one_step_route(
    _account: AptosAccount,
    _first_dex_type: U8,
    _first_pool_type: U64,
    _first_is_x_to_y: boolean,
    _x_in: U64,
    _y_min_out: U64,
    $p: TypeTag[], /* <X, Y, E>*/
    option?: OptionTransaction,
    _isJSON = false
  ) {
    const payload__ = buildPayload_one_step_route(_first_dex_type, _first_pool_type, _first_is_x_to_y, _x_in, _y_min_out, $p, _isJSON);
    return $.sendPayloadTx(this.client, _account, payload__, option);
  }
  payload_swap(
    _num_steps: U8,
    _first_dex_type: U8,
    _first_pool_type: U64,
    _first_is_x_to_y: boolean,
    _second_dex_type: U8,
    _second_pool_type: U64,
    _second_is_x_to_y: boolean,
    _third_dex_type: U8,
    _third_pool_type: U64,
    _third_is_x_to_y: boolean,
    _x_in: U64,
    _m_min_out: U64,
    $p: TypeTag[], /* <X, Y, Z, OutCoin, E1, E2, E3>*/
    isJSON = false,
  ): TxnBuilderTypes.TransactionPayloadEntryFunction
        | Types.TransactionPayload_EntryFunctionPayload {
    return buildPayload_swap(_num_steps, _first_dex_type, _first_pool_type, _first_is_x_to_y, _second_dex_type, _second_pool_type, _second_is_x_to_y, _third_dex_type, _third_pool_type, _third_is_x_to_y, _x_in, _m_min_out, $p, isJSON);
  }
  async swap(
    _account: AptosAccount,
    _num_steps: U8,
    _first_dex_type: U8,
    _first_pool_type: U64,
    _first_is_x_to_y: boolean,
    _second_dex_type: U8,
    _second_pool_type: U64,
    _second_is_x_to_y: boolean,
    _third_dex_type: U8,
    _third_pool_type: U64,
    _third_is_x_to_y: boolean,
    _x_in: U64,
    _m_min_out: U64,
    $p: TypeTag[], /* <X, Y, Z, OutCoin, E1, E2, E3>*/
    option?: OptionTransaction,
    _isJSON = false
  ) {
    const payload__ = buildPayload_swap(_num_steps, _first_dex_type, _first_pool_type, _first_is_x_to_y, _second_dex_type, _second_pool_type, _second_is_x_to_y, _third_dex_type, _third_pool_type, _third_is_x_to_y, _x_in, _m_min_out, $p, _isJSON);
    return $.sendPayloadTx(this.client, _account, payload__, option);
  }
  payload_swap_with_fees(
    _num_steps: U8,
    _first_dex_type: U8,
    _first_pool_type: U64,
    _first_is_x_to_y: boolean,
    _second_dex_type: U8,
    _second_pool_type: U64,
    _second_is_x_to_y: boolean,
    _third_dex_type: U8,
    _third_pool_type: U64,
    _third_is_x_to_y: boolean,
    _x_in: U64,
    _m_min_out: U64,
    _fee_to: HexString,
    _fee_bips: U8,
    $p: TypeTag[], /* <X, Y, Z, OutCoin, E1, E2, E3>*/
    isJSON = false,
  ): TxnBuilderTypes.TransactionPayloadEntryFunction
        | Types.TransactionPayload_EntryFunctionPayload {
    return buildPayload_swap_with_fees(_num_steps, _first_dex_type, _first_pool_type, _first_is_x_to_y, _second_dex_type, _second_pool_type, _second_is_x_to_y, _third_dex_type, _third_pool_type, _third_is_x_to_y, _x_in, _m_min_out, _fee_to, _fee_bips, $p, isJSON);
  }
  async swap_with_fees(
    _account: AptosAccount,
    _num_steps: U8,
    _first_dex_type: U8,
    _first_pool_type: U64,
    _first_is_x_to_y: boolean,
    _second_dex_type: U8,
    _second_pool_type: U64,
    _second_is_x_to_y: boolean,
    _third_dex_type: U8,
    _third_pool_type: U64,
    _third_is_x_to_y: boolean,
    _x_in: U64,
    _m_min_out: U64,
    _fee_to: HexString,
    _fee_bips: U8,
    $p: TypeTag[], /* <X, Y, Z, OutCoin, E1, E2, E3>*/
    option?: OptionTransaction,
    _isJSON = false
  ) {
    const payload__ = buildPayload_swap_with_fees(_num_steps, _first_dex_type, _first_pool_type, _first_is_x_to_y, _second_dex_type, _second_pool_type, _second_is_x_to_y, _third_dex_type, _third_pool_type, _third_is_x_to_y, _x_in, _m_min_out, _fee_to, _fee_bips, $p, _isJSON);
    return $.sendPayloadTx(this.client, _account, payload__, option);
  }
  payload_swap_with_fixed_output(
    _dex_type: U8,
    _pool_type: U64,
    _is_x_to_y: boolean,
    _max_in: U64,
    _amount_out: U64,
    $p: TypeTag[], /* <InputCoin, OutputCoin, E>*/
    isJSON = false,
  ): TxnBuilderTypes.TransactionPayloadEntryFunction
        | Types.TransactionPayload_EntryFunctionPayload {
    return buildPayload_swap_with_fixed_output(_dex_type, _pool_type, _is_x_to_y, _max_in, _amount_out, $p, isJSON);
  }
  async swap_with_fixed_output(
    _account: AptosAccount,
    _dex_type: U8,
    _pool_type: U64,
    _is_x_to_y: boolean,
    _max_in: U64,
    _amount_out: U64,
    $p: TypeTag[], /* <InputCoin, OutputCoin, E>*/
    option?: OptionTransaction,
    _isJSON = false
  ) {
    const payload__ = buildPayload_swap_with_fixed_output(_dex_type, _pool_type, _is_x_to_y, _max_in, _amount_out, $p, _isJSON);
    return $.sendPayloadTx(this.client, _account, payload__, option);
  }
  payload_three_step_route(
    _first_dex_type: U8,
    _first_pool_type: U64,
    _first_is_x_to_y: boolean,
    _second_dex_type: U8,
    _second_pool_type: U64,
    _second_is_x_to_y: boolean,
    _third_dex_type: U8,
    _third_pool_type: U64,
    _third_is_x_to_y: boolean,
    _x_in: U64,
    _m_min_out: U64,
    $p: TypeTag[], /* <X, Y, Z, M, E1, E2, E3>*/
    isJSON = false,
  ): TxnBuilderTypes.TransactionPayloadEntryFunction
        | Types.TransactionPayload_EntryFunctionPayload {
    return buildPayload_three_step_route(_first_dex_type, _first_pool_type, _first_is_x_to_y, _second_dex_type, _second_pool_type, _second_is_x_to_y, _third_dex_type, _third_pool_type, _third_is_x_to_y, _x_in, _m_min_out, $p, isJSON);
  }
  async three_step_route(
    _account: AptosAccount,
    _first_dex_type: U8,
    _first_pool_type: U64,
    _first_is_x_to_y: boolean,
    _second_dex_type: U8,
    _second_pool_type: U64,
    _second_is_x_to_y: boolean,
    _third_dex_type: U8,
    _third_pool_type: U64,
    _third_is_x_to_y: boolean,
    _x_in: U64,
    _m_min_out: U64,
    $p: TypeTag[], /* <X, Y, Z, M, E1, E2, E3>*/
    option?: OptionTransaction,
    _isJSON = false
  ) {
    const payload__ = buildPayload_three_step_route(_first_dex_type, _first_pool_type, _first_is_x_to_y, _second_dex_type, _second_pool_type, _second_is_x_to_y, _third_dex_type, _third_pool_type, _third_is_x_to_y, _x_in, _m_min_out, $p, _isJSON);
    return $.sendPayloadTx(this.client, _account, payload__, option);
  }
  payload_two_step_route(
    _first_dex_type: U8,
    _first_pool_type: U64,
    _first_is_x_to_y: boolean,
    _second_dex_type: U8,
    _second_pool_type: U64,
    _second_is_x_to_y: boolean,
    _x_in: U64,
    _z_min_out: U64,
    $p: TypeTag[], /* <X, Y, Z, E1, E2>*/
    isJSON = false,
  ): TxnBuilderTypes.TransactionPayloadEntryFunction
        | Types.TransactionPayload_EntryFunctionPayload {
    return buildPayload_two_step_route(_first_dex_type, _first_pool_type, _first_is_x_to_y, _second_dex_type, _second_pool_type, _second_is_x_to_y, _x_in, _z_min_out, $p, isJSON);
  }
  async two_step_route(
    _account: AptosAccount,
    _first_dex_type: U8,
    _first_pool_type: U64,
    _first_is_x_to_y: boolean,
    _second_dex_type: U8,
    _second_pool_type: U64,
    _second_is_x_to_y: boolean,
    _x_in: U64,
    _z_min_out: U64,
    $p: TypeTag[], /* <X, Y, Z, E1, E2>*/
    option?: OptionTransaction,
    _isJSON = false
  ) {
    const payload__ = buildPayload_two_step_route(_first_dex_type, _first_pool_type, _first_is_x_to_y, _second_dex_type, _second_pool_type, _second_is_x_to_y, _x_in, _z_min_out, $p, _isJSON);
    return $.sendPayloadTx(this.client, _account, payload__, option);
  }
}

