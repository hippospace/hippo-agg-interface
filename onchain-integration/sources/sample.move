module sample::sample {
    use aptos_framework::coin;
    use std::option;
    use hippo_aggregator::aggregator::swap_direct;

    #[cmd]
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

    fun check_and_deposit_opt<X>(sender: &signer, coin_opt: option::Option<coin::Coin<X>>) {
        if (option::is_some(&coin_opt)) {
            let coin = option::extract(&mut coin_opt);
            let sender_addr = std::signer::address_of(sender);
            if (!coin::is_account_registered<X>(sender_addr)) {
                coin::register<X>(sender);
            };
            coin::deposit(sender_addr, coin);
        };
        option::destroy_none(coin_opt)
    }
}
