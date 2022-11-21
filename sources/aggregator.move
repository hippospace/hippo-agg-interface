module hippo_aggregator::aggregator {
    use aptos_framework::coin;
    use std::option;
    use std::option::Option;
    use aptos_framework::coin::Coin;

    const MAX_U64: u64 = 0xffffffffffffffff;

    // const DEX_HIPPO: u8 = 1;
    // const DEX_ECONIA: u8 = 2;
    const DEX_PONTEM: u8 = 3;
    // const DEX_BASIQ: u8 = 4;
    const DEX_DITTO: u8 = 5;
    const DEX_TORTUGA: u8 = 6;
    const DEX_APTOSWAP: u8 = 7;
    const DEX_AUX: u8 = 8;
    const DEX_ANIMESWAP: u8 = 9;
    const DEX_CETUS: u8 = 10;
    const DEX_PANCAKE: u8 = 11;
    const DEX_OBRIC: u8 = 12;

    const AUX_TYPE_AMM:u64 = 0;
    const AUX_TYPE_MARKET:u64 = 1;

    const E_UNKNOWN_POOL_TYPE: u64 = 1;
    const E_OUTPUT_LESS_THAN_MINIMUM: u64 = 2;
    const E_UNKNOWN_DEX: u64 = 3;
    const E_NOT_ADMIN: u64 = 4;
    const E_INVALID_PAIR_OF_DITTO: u64 = 5;
    const E_INVALID_PAIR_OF_TORTUGA: u64 = 6;
    const E_TYPE_NOT_EQUAL: u64 = 7;
    const E_COIN_STORE_NOT_EXITES: u64 = 8;
    const E_UNSUPPORTED_NUM_STEPS: u64 = 9;
    const E_UNSUPPORTED: u64 = 10;
    const E_UNSUPPORTED_FIXEDOUT_SWAP: u64 = 11;
    const E_OUTPUT_NOT_EQAULS_REQUEST: u64 = 12;
    const E_FEE_BIPS_TOO_LARGE: u64 = 13;


    #[cmd]
    public entry fun swap_with_fees<X, Y, Z, OutCoin, E1, E2, E3>(
        _sender: &signer,
        _num_steps: u8,
        _first_dex_type: u8,
        _first_pool_type: u64,
        _first_is_x_to_y: bool, // first trade uses normal order
        _second_dex_type: u8,
        _second_pool_type: u64,
        _second_is_x_to_y: bool, // second trade uses normal order
        _third_dex_type: u8,
        _third_pool_type: u64,
        _third_is_x_to_y: bool, // second trade uses normal order
        _x_in: u64,
        _m_min_out: u64,
        _fee_to: address,
        _fee_bips: u8
    ) {

    }

    #[cmd]
    public entry fun swap<
        X, Y, Z, OutCoin, E1, E2, E3
    >(
        _sender: &signer,
        _num_steps: u8,
        _first_dex_type: u8,
        _first_pool_type: u64,
        _first_is_x_to_y: bool, // first trade uses normal order
        _second_dex_type: u8,
        _second_pool_type: u64,
        _second_is_x_to_y: bool, // second trade uses normal order
        _third_dex_type: u8,
        _third_pool_type: u64,
        _third_is_x_to_y: bool, // second trade uses normal order
        _x_in: u64,
        _m_min_out: u64,
    ) {

    }

    public fun swap_direct<
        X, Y, Z, OutCoin, E1, E2, E3
    >(
        _num_steps: u8,
        _first_dex_type: u8,
        _first_pool_type: u64,
        _first_is_x_to_y: bool, // first trade uses normal order
        _second_dex_type: u8,
        _second_pool_type: u64,
        _second_is_x_to_y: bool, // second trade uses normal order
        _third_dex_type: u8,
        _third_pool_type: u64,
        _third_is_x_to_y: bool, // second trade uses normal order
        x_in: coin::Coin<X>
    ):(Option<coin::Coin<X>>, Option<coin::Coin<Y>>, Option<coin::Coin<Z>>, coin::Coin<OutCoin>){
        (option::some(x_in),option::none(),option::none(),coin::zero<OutCoin>())
    }

    #[cmd]
    public entry fun swap_with_fixed_output<InputCoin, OutputCoin, E>(
        _sender: &signer,
        _dex_type: u8,
        _pool_type: u64,
        _is_x_to_y: bool,
        _max_in: u64,
        _amount_out: u64,
    ) {

    }

    public fun swap_with_fixed_output_direct<InputCoin, OutputCoin, E>(
        _dex_type: u8,
        _pool_type: u64,
        _is_x_to_y: bool,
        _max_in: u64,
        _amount_out: u64,
        coin_in: Coin<InputCoin>,
    ):(Coin<InputCoin>,Coin<OutputCoin>) {
        (coin_in, coin::zero<OutputCoin>())
    }

    #[cmd]
    public entry fun one_step_route<X, Y, E>(
        _sender: &signer,
        _first_dex_type: u8,
        _first_pool_type: u64,
        _first_is_x_to_y: bool, // first trade uses normal order
        _x_in: u64,
        _y_min_out: u64,
    ) {

    }

    public fun one_step_direct<X, Y, E>(
        _dex_type: u8,
        _pool_type: u64,
        _is_x_to_y: bool,
        x_in: coin::Coin<X>
    ):(Option<coin::Coin<X>>, coin::Coin<Y>) {
        (option::some(x_in), coin::zero<Y>())
    }

    #[cmd]
    public entry fun two_step_route<
        X, Y, Z, E1, E2,
    >(
        _sender: &signer,
        _first_dex_type: u8,
        _first_pool_type: u64,
        _first_is_x_to_y: bool, // first trade uses normal order
        _second_dex_type: u8,
        _second_pool_type: u64,
        _second_is_x_to_y: bool, // second trade uses normal order
        _x_in: u64,
        _z_min_out: u64,
    ) {
    }

    public fun two_step_direct<
        X, Y, Z, E1, E2,
    >(
        _first_dex_type: u8,
        _first_pool_type: u64,
        _first_is_x_to_y: bool, // first trade uses normal order
        _second_dex_type: u8,
        _second_pool_type: u64,
        _second_is_x_to_y: bool, // second trade uses normal order
        x_in: coin::Coin<X>
    ):(Option<coin::Coin<X>>, Option<coin::Coin<Y>>, coin::Coin<Z>) {
        (option::some(x_in), option::none(), coin::zero<Z>())
    }

    #[cmd]
    public entry fun three_step_route<
        X, Y, Z, M, E1, E2, E3
    >(
        _sender: &signer,
        _first_dex_type: u8,
        _first_pool_type: u64,
        _first_is_x_to_y: bool, // first trade uses normal order
        _second_dex_type: u8,
        _second_pool_type: u64,
        _second_is_x_to_y: bool, // second trade uses normal order
        _third_dex_type: u8,
        _third_pool_type: u64,
        _third_is_x_to_y: bool, // second trade uses normal order
        _x_in: u64,
        _m_min_out: u64,
    ) {

    }

    public fun three_step_direct<
        X, Y, Z, M, E1, E2, E3
    >(
        _first_dex_type: u8,
        _first_pool_type: u64,
        _first_is_x_to_y: bool, // first trade uses normal order
        _second_dex_type: u8,
        _second_pool_type: u64,
        _second_is_x_to_y: bool, // second trade uses normal order
        _third_dex_type: u8,
        _third_pool_type: u64,
        _third_is_x_to_y: bool, // second trade uses normal order
        x_in: coin::Coin<X>
    ):(Option<coin::Coin<X>>, Option<coin::Coin<Y>>, Option<coin::Coin<Z>>, coin::Coin<M>) {
        (option::some(x_in),option::none(),option::none(),coin::zero<M>())
    }

}
