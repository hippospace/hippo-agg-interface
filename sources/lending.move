module hippo_aggregator::lending {

    use aptos_framework::coin::{Self, Coin};
    use aptos_std::type_info;
    use std::string::String;
    use aptos_std::simple_map::{Self, SimpleMap};
    use aptos_framework::account::{Self, SignerCapability};
    use std::signer::address_of;

    struct InternalCoinStore<phantom CoinType> has key {
        coin: Coin<CoinType>,
    }

    struct Deposit has store {
        amount: u64,
    }

    struct Borrow has store {
        base_borrow_amount: u64,
        borrow_index_billionth: u64,
        // actual_borrow_amount = base_amount * borrow_index_billionth / 10^9;
    }

    struct MarginAccount has key {
        protocol_id: u64,
        signer_cap: SignerCapability, // used for organizing CoinStore
        deposits: SimpleMap<type_info::TypeInfo, Deposit>,
        borrows: SimpleMap<type_info::TypeInfo, Borrow>,
    }

    // public fun get_num_deposits()
    // public fun get_ith_deposit_amount()
    // public fun get_num_borrows()
    // public fun get_ith_borrow_base_amount()
    // public fun get_ith_borrow_index_billionth()

    public fun create_account(user: &signer, protocol_id: u64) {
        let (signer, signer_cap) = account::create_resource_account(user, b"");
        let account = MarginAccount {
            protocol_id,
            signer_cap,
            deposits: simple_map::create<type_info::TypeInfo, Deposit>(),
            borrows: simple_map::create<type_info::TypeInfo, Borrow>(),
        };
        move_to(&signer, account);
    }

    fun get_account_internal(address: &address): MarginAccount acquires MarginAccount {
        let account_address = account::create_resource_address(address, b"");
        let account = move_from<MarginAccount>(account_address);
        account
    }

    public fun get_account(user: &signer): MarginAccount acquires MarginAccount {
        let account = get_account_internal(&address_of(user));
        check_before_action(&account);
        account
    }

    fun return_account_internal(account: MarginAccount) {
        let signer = account::create_signer_with_capability(&account.signer_cap);
        move_to(&signer, account)
    }

    public fun return_account(account: MarginAccount) {
        check_after_action(&account);
        return_account_internal(account)
    }

    public fun check_before_action(account: &MarginAccount) {
        // call check function specific to account.protocol_id
    }
    public fun check_after_action(account: &MarginAccount) {
        // call check function specific to account.protocol_id
    }

    public fun check_before_liquidation(account: &MarginAccount) {
        // call check function specific to account.protocol_id
    }
    public fun check_after_liquidation(account: &MarginAccount) {
        // call check function specific to account.protocol_id
    }

    struct PoolInfo has store, drop {
        coin_type: type_info::TypeInfo,
        deposit_amount: u64,
        borrow_amount: u64,
        deposit_rate_millionth: u64,
        borrow_rate_millionth: u64,
        ltv_millionth: u64,
        liquidation_threshold_millionth: u64,
        usd_price_times_million: u64,
        borrow_index_billionth: u64,
    }

    public fun new_pool_info(
        coin_type: type_info::TypeInfo,
        deposit_amount: u64,
        borrow_amount: u64,
        deposit_rate_millionth: u64,
        borrow_rate_millionth: u64,
        ltv_millionth: u64,
        liquidation_threshold_millionth: u64,
        usd_price_times_million: u64,
        borrow_index_billionth: u64,
    ): PoolInfo {
        PoolInfo {
            coin_type,
            deposit_amount,
            borrow_amount,
            deposit_rate_millionth,
            borrow_rate_millionth,
            ltv_millionth,
            liquidation_threshold_millionth,
            usd_price_times_million,
            borrow_index_billionth,
        }
    }

    struct LendingProtocolInfo {
        name: String,
        pools: vector<PoolInfo>,
    }

    public fun new_lending_protocol_info(
        name: String,
        pools: vector<PoolInfo>,
    ): LendingProtocolInfo {
        LendingProtocolInfo {
            name,
            pools,
        }
    }

    /*
    Trader actions
    - deposit
    - withdraw
    - borrow
    - repay
    - swap

    Liquidator actions:
    - liquidate
      - transfer collateral to liquidator
      - transfer repaid token to protocol
    */

    public entry fun deposit<CoinType>(account: MarginAccount, coin: Coin<CoinType>): MarginAccount {
        // deposit to InternalCoinStore<CoinType>
        // update Deposit in MarginAccount

        account
    }

    public entry fun withdraw<CoinType>(account: MarginAccount, amount: u64): (MarginAccount, Coin<CoinType>) {
        // withdraw from InternalCoinStore<CoinType>
        // update Deposit in MarginAccount

        (account, coin::zero<CoinType>())
    }

    public entry fun borrow<CoinType>(account: MarginAccount, amount: u64): (MarginAccount, Coin<CoinType>) {
        // use MarginAccount.protocol_id to figure out who to borrow from
        // update Borrow in MarginAccount

        (account, coin::zero<CoinType>())
    }

    public entry fun repay<CoinType>(account: MarginAccount, coin: Coin<CoinType>): MarginAccount {
        // use MarginAccount.protocol_id to figure out who to repay to
        // update Borrow in MarginAccount

        account
    }

    public entry fun liquidate<PayCoin, ReceiveCoin>(
        user: address,
        pay_coin: Coin<PayCoin>,
        receive_amount: u64
    ): Coin<ReceiveCoin> acquires MarginAccount {
        let account = get_account_internal(&user);
        check_before_liquidation(&account);
        let account = repay(account, pay_coin);
        let (account, coin) = withdraw<ReceiveCoin>(account, receive_amount);
        check_after_liquidation(&account);
        return_account_internal(account);
        coin
    }
}
