module hippo_aggregator::lending_use_sample {
    use hippo_aggregator::lending::{get_account, return_account, borrow, deposit};

    public entry fun some_example_leveraged_action(
        user: &signer,
    ) {
        // get account
        let account = get_account(user);

        // borrow
        let (account, coin) = borrow<u8>(account, 100);
        // do stuff with borrowed coin, swap, LP, whatever
        let account = deposit(account, coin);

        return_account(account);
    }
}
