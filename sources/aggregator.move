module hippo_aggregator::aggregator {
    use aptos_framework::coin;
    use std::option;
    use std::option::Option;
    use std::signer;
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
        // implementation not shown
    }

    #[cmd]
    public entry fun swap<
        X, Y, Z, OutCoin, E1, E2, E3
    >(
        sender: &signer,
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
        m_min_out: u64,
    ) {
        let coin_x = coin::withdraw<X>(sender, x_in);
        let (x_remain, y_remain, z_remain, coin_m) = swap_direct<X, Y, Z, OutCoin, E1, E2, E3>(
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

        assert!(coin::value(&coin_m) >= m_min_out, E_OUTPUT_LESS_THAN_MINIMUM);

        check_and_deposit_opt(sender, x_remain);
        check_and_deposit_opt(sender, y_remain);
        check_and_deposit_opt(sender, z_remain);
        check_and_deposit(sender, coin_m);
    }

    public fun swap_direct<
        X, Y, Z, OutCoin, E1, E2, E3
    >(
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
        x_in: coin::Coin<X>
    ):(Option<coin::Coin<X>>, Option<coin::Coin<Y>>, Option<coin::Coin<Z>>, coin::Coin<OutCoin>){
        if (num_steps == 1) {
            let (coin_x_remain, coin_m) = get_intermediate_output<X, OutCoin, E1>(first_dex_type, first_pool_type, first_is_x_to_y, x_in);
            (coin_x_remain, option::some(coin::zero<Y>()), option::some(coin::zero<Z>()), coin_m)
        }
        else if (num_steps == 2) {
            let (coin_x_remain, coin_y) = get_intermediate_output<X, Y, E1>(first_dex_type, first_pool_type, first_is_x_to_y, x_in);
            let (coin_y_remain, coin_m) = get_intermediate_output<Y, OutCoin, E2>(second_dex_type, second_pool_type, second_is_x_to_y, coin_y);
            (coin_x_remain, coin_y_remain, option::some(coin::zero<Z>()), coin_m)
        }
        else if (num_steps == 3) {
            let (coin_x_remain, coin_y) = get_intermediate_output<X, Y, E1>(first_dex_type, first_pool_type, first_is_x_to_y, x_in);
            let (coin_y_remain, coin_z) = get_intermediate_output<Y, Z, E2>(second_dex_type, second_pool_type, second_is_x_to_y, coin_y);
            let (coin_z_remain, coin_m) = get_intermediate_output<Z, OutCoin, E3>(third_dex_type, third_pool_type, third_is_x_to_y, coin_z);
            (coin_x_remain, coin_y_remain, coin_z_remain, coin_m)
        }
        else {
            abort E_UNSUPPORTED_NUM_STEPS
        }
    }

    #[cmd]
    public entry fun swap_with_fixed_output<InputCoin, OutputCoin, E>(
        sender: &signer,
        dex_type: u8,
        pool_type: u64,
        is_x_to_y: bool,
        max_in: u64,
        amount_out: u64,
    ) {
        let coin_in = coin::withdraw<InputCoin>(sender, max_in);
        let (coin_in, coin_out) = swap_with_fixed_output_direct<InputCoin,OutputCoin,E>(dex_type,pool_type,is_x_to_y,max_in,amount_out,coin_in);
        assert!(coin::value(&coin_out) == amount_out, E_OUTPUT_NOT_EQAULS_REQUEST);
        check_and_deposit(sender, coin_in);
        check_and_deposit(sender, coin_out);
    }

    public fun swap_with_fixed_output_direct<InputCoin, OutputCoin, E>(
        _dex_type: u8,
        _pool_type: u64,
        _is_x_to_y: bool,
        _max_in: u64,
        _amount_out: u64,
        _coin_in: Coin<InputCoin>,
    ): (Coin<InputCoin>,Coin<OutputCoin>) {
        abort 0
    }

    public fun swap_exact_out_with_change_direct<
        X, Y, Z, OutCoin, E1, E2, E3
    >(
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
        x_in: Coin<X>,
        exact_out: u64,
    ): (Option<Coin<X>>, Option<Coin<Y>>, Option<Coin<Z>>, Option<Coin<OutCoin>>, Coin<X>, Coin<OutCoin>) {
        let (x_remain, y_remain, z_remain, coin_m) = swap_direct<X, Y, Z, OutCoin, E1, E2, E3>(
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
            x_in
        );

        let m_value = coin::value(&coin_m);

        if (m_value == exact_out) {
            (x_remain, y_remain, z_remain, option::none(), coin::zero(), coin_m)
        }
        else if (m_value > exact_out) {
            let m_exact = coin::extract(&mut coin_m, exact_out);
            // swap extra coin in coin_m back to X
            let (m_remain2, z_remain2, y_remain2, x_change) =
                if (num_steps == 1) {
                    // just step 1
                    let (m__remain, z__remain, y__remain, x__change) = swap_direct<OutCoin, Z, Y, X, E1, E2, E3>(
                        1,
                        first_dex_type,
                        first_pool_type,
                        !first_is_x_to_y,
                        second_dex_type,
                        second_pool_type,
                        second_is_x_to_y,
                        third_dex_type,
                        third_pool_type,
                        third_is_x_to_y,
                        coin_m
                    );
                    (m__remain, z__remain, y__remain, x__change)
                }
                else if (num_steps == 2) {
                    // step 2, step 1
                    let (m__remain, y__remain, z__remain, x__change) = swap_direct<OutCoin, Y, Z, X, E2, E1, E3>(
                        2,
                        second_dex_type,
                        second_pool_type,
                        !second_is_x_to_y,
                        first_dex_type,
                        first_pool_type,
                        !first_is_x_to_y,
                        third_dex_type,
                        third_pool_type,
                        third_is_x_to_y,
                        coin_m
                    );
                    (m__remain, z__remain, y__remain, x__change)
                }
                else if (num_steps == 3) {
                    // step 3, step 2, step 1
                    swap_direct<OutCoin, Z, Y, X, E3, E2, E1>(
                        3,
                        third_dex_type,
                        third_pool_type,
                        !third_is_x_to_y,
                        second_dex_type,
                        second_pool_type,
                        !second_is_x_to_y,
                        first_dex_type,
                        first_pool_type,
                        !first_is_x_to_y,
                        coin_m
                    )
                }
                else {
                    abort E_UNSUPPORTED_NUM_STEPS
                };
            // merge
            (
                x_remain,
                merge_options(y_remain, y_remain2),
                merge_options(z_remain, z_remain2),
                m_remain2,
                x_change,
                m_exact,
            )
        }
        else {
            abort E_OUTPUT_LESS_THAN_MINIMUM
        }
    }

    public entry fun swap_exact_out_with_change<
        X, Y, Z, OutCoin, E1, E2, E3
    >(
        sender: &signer,
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
        exact_out: u64,
    ) {
        let coin_x = coin::withdraw<X>(sender, x_in);
        let (x_remain, y_remain, z_remain, m_remain, x_change, m_out) = swap_exact_out_with_change_direct<
            X, Y, Z, OutCoin, E1, E2, E3>(
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
            coin_x,
            exact_out
        );

        check_and_deposit_opt(sender, x_remain);
        check_and_deposit_opt(sender, y_remain);
        check_and_deposit_opt(sender, z_remain);
        check_and_deposit_opt(sender, m_remain);
        check_and_deposit(sender, x_change);
        check_and_deposit(sender, m_out);
    }

    #[cmd]
    public entry fun one_step_route<X, Y, E>(
        sender: &signer,
        first_dex_type: u8,
        first_pool_type: u64,
        first_is_x_to_y: bool, // first trade uses normal order
        x_in: u64,
        y_min_out: u64,
    ) {
        let coin_in = coin::withdraw<X>(sender, x_in);
        let (coin_remain_opt, coin_out) = one_step_direct<X, Y, E>(first_dex_type, first_pool_type, first_is_x_to_y, coin_in);
        assert!(coin::value(&coin_out) >= y_min_out, E_OUTPUT_LESS_THAN_MINIMUM);
        check_and_deposit_opt(sender, coin_remain_opt);
        check_and_deposit(sender, coin_out);
    }

    public fun one_step_direct<X, Y, E>(
        dex_type: u8,
        pool_type: u64,
        is_x_to_y: bool,
        x_in: coin::Coin<X>
    ):(Option<coin::Coin<X>>, coin::Coin<Y>) {
        get_intermediate_output<X, Y, E>(dex_type, pool_type, is_x_to_y, x_in)
    }

    #[cmd]
    public entry fun two_step_route<
        X, Y, Z, E1, E2,
    >(
        sender: &signer,
        first_dex_type: u8,
        first_pool_type: u64,
        first_is_x_to_y: bool, // first trade uses normal order
        second_dex_type: u8,
        second_pool_type: u64,
        second_is_x_to_y: bool, // second trade uses normal order
        x_in: u64,
        z_min_out: u64,
    ) {
        let coin_x = coin::withdraw<X>(sender, x_in);
        let (
            coin_x_remain,
            coin_y_remain,
            coin_z
        ) = two_step_direct<X, Y, Z, E1, E2>(
            first_dex_type,
            first_pool_type,
            first_is_x_to_y,
            second_dex_type,
            second_pool_type,
            second_is_x_to_y,
            coin_x
        );
        assert!(coin::value(&coin_z) >= z_min_out, E_OUTPUT_LESS_THAN_MINIMUM);
        check_and_deposit_opt(sender, coin_x_remain);
        check_and_deposit_opt(sender, coin_y_remain);
        check_and_deposit(sender, coin_z);
    }

    public fun two_step_direct<
        X, Y, Z, E1, E2,
    >(
        first_dex_type: u8,
        first_pool_type: u64,
        first_is_x_to_y: bool, // first trade uses normal order
        second_dex_type: u8,
        second_pool_type: u64,
        second_is_x_to_y: bool, // second trade uses normal order
        x_in: coin::Coin<X>
    ):(Option<coin::Coin<X>>, Option<coin::Coin<Y>>, coin::Coin<Z>) {
        let (coin_x_remain, coin_y) = get_intermediate_output<X, Y, E1>(first_dex_type, first_pool_type, first_is_x_to_y, x_in);
        let (coin_y_remain, coin_z) = get_intermediate_output<Y, Z, E2>(second_dex_type, second_pool_type, second_is_x_to_y, coin_y);
        (coin_x_remain, coin_y_remain, coin_z)
    }

    #[cmd]
    public entry fun three_step_route<
        X, Y, Z, M, E1, E2, E3
    >(
        sender: &signer,
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
        m_min_out: u64,
    ) {
        let coin_x = coin::withdraw<X>(sender, x_in);
        let (
            coin_x_remain,
            coin_y_remain,
            coin_z_remain ,
            coin_m
        ) = three_step_direct<X, Y, Z, M, E1, E2, E3>(
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
        assert!(coin::value(&coin_m) >= m_min_out, E_OUTPUT_LESS_THAN_MINIMUM);
        check_and_deposit_opt(sender, coin_x_remain);
        check_and_deposit_opt(sender, coin_y_remain);
        check_and_deposit_opt(sender, coin_z_remain);
        check_and_deposit(sender, coin_m);
    }

    public fun three_step_direct<
        X, Y, Z, M, E1, E2, E3
    >(
        first_dex_type: u8,
        first_pool_type: u64,
        first_is_x_to_y: bool, // first trade uses normal order
        second_dex_type: u8,
        second_pool_type: u64,
        second_is_x_to_y: bool, // second trade uses normal order
        third_dex_type: u8,
        third_pool_type: u64,
        third_is_x_to_y: bool, // second trade uses normal order
        x_in: coin::Coin<X>
    ):(Option<coin::Coin<X>>, Option<coin::Coin<Y>>, Option<coin::Coin<Z>>, coin::Coin<M>) {
        let (coin_x_remain, coin_y) = get_intermediate_output<X, Y, E1>(first_dex_type, first_pool_type, first_is_x_to_y, x_in);
        let (coin_y_remain, coin_z) = get_intermediate_output<Y, Z, E2>(second_dex_type, second_pool_type, second_is_x_to_y, coin_y);
        let (coin_z_remain, coin_m) = get_intermediate_output<Z, M, E3>(third_dex_type, third_pool_type, third_is_x_to_y, coin_z);
        (coin_x_remain, coin_y_remain, coin_z_remain, coin_m)
    }

    public fun get_intermediate_output<In, Out, E>(
        _dex_type: u8,
        _pool_type: u64,
        _is_x_to_y: bool,
        _x_in: coin::Coin<In>
    ): (Option<coin::Coin<In>>, coin::Coin<Out>) {
        /*
        Converts _x_in: coin::Coin<In> to coin::Coin<Out>

        Some DEXs do not guarantee to consume all input coins (CLOBs), so we also return an Option<coin::Coin<In>>
        */
        // implementation not shown
        abort 0
    }

    fun check_and_deposit_opt<X>(sender: &signer, coin_opt: Option<coin::Coin<X>>) {
        if (option::is_some(&coin_opt)) {
            let coin = option::extract(&mut coin_opt);
            let sender_addr = signer::address_of(sender);
            if (!coin::is_account_registered<X>(sender_addr)) {
                coin::register<X>(sender);
            };
            coin::deposit(sender_addr, coin);
        };
        option::destroy_none(coin_opt)
    }

    fun check_and_deposit<X>(sender: &signer, coin: coin::Coin<X>) {
        let sender_addr = signer::address_of(sender);
        if (!coin::is_account_registered<X>(sender_addr)) {
            coin::register<X>(sender);
        };
        coin::deposit(sender_addr, coin);
    }

    fun merge_options<X>(opt1: Option<Coin<X>>, opt2: Option<Coin<X>>): Option<Coin<X>> {
        let output = coin::zero<X>();
        if (option::is_some(&opt1)) {
            let inner = option::extract(&mut opt1);
            coin::merge(&mut output, inner);
        };
        if (option::is_some(&opt2)) {
            let inner = option::extract(&mut opt2);
            coin::merge(&mut output, inner);
        };

        option::destroy_none(opt1);
        option::destroy_none(opt2);

        if (coin::value(&output) == 0) {
            coin::destroy_zero(output);
            option::none()
        }
        else {
            option::some(output)
        }
    }
}
