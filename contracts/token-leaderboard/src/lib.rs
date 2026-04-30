#![no_std]

use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, Symbol, Vec};

const LEADERBOARD: Symbol = symbol_short!("board");
const HOLDER_BALANCE: Symbol = symbol_short!("balance");

fn holder_exists(board: &Vec<Address>, holder: &Address) -> bool {
    for existing in board.iter() {
        if existing == *holder {
            return true;
        }
    }
    false
}

#[contract]
pub struct TokenLeaderboard;

#[contractimpl]
impl TokenLeaderboard {
    pub fn init(env: Env) {
        let empty_board: Vec<Address> = Vec::new(&env);
        env.storage().instance().set(&LEADERBOARD, &empty_board);
    }

    pub fn add_holder(env: Env, holder: Address) {
        holder.require_auth();

        let mut board = env
            .storage()
            .instance()
            .get::<Symbol, Vec<Address>>(&LEADERBOARD)
            .unwrap_or(Vec::new(&env));

        if !holder_exists(&board, &holder) {
            board.push_back(holder);
            env.storage().instance().set(&LEADERBOARD, &board);
        }
    }

    pub fn update_balance(env: Env, holder: Address, balance: u128) {
        holder.require_auth();

        let mut board = env
            .storage()
            .instance()
            .get::<Symbol, Vec<Address>>(&LEADERBOARD)
            .unwrap_or(Vec::new(&env));

        if !holder_exists(&board, &holder) {
            board.push_back(holder.clone());
            env.storage().instance().set(&LEADERBOARD, &board);
        }

        let key = (HOLDER_BALANCE, holder.clone());
        env.storage().instance().set(&key, &balance);

        env.events()
            .publish((symbol_short!("updated"), holder), balance);
    }

    pub fn get_balance(env: Env, holder: Address) -> u128 {
        let key = (HOLDER_BALANCE, holder);
        env.storage()
            .instance()
            .get::<(Symbol, Address), u128>(&key)
            .unwrap_or(0)
    }

    pub fn top_holders(env: Env) -> Vec<(Address, u128)> {
        let board = env
            .storage()
            .instance()
            .get::<Symbol, Vec<Address>>(&LEADERBOARD)
            .unwrap_or(Vec::new(&env));

        let mut holders: Vec<(Address, u128)> = Vec::new(&env);

        for holder in board.iter() {
            let key = (HOLDER_BALANCE, holder.clone());
            let balance = env
                .storage()
                .instance()
                .get::<(Symbol, Address), u128>(&key)
                .unwrap_or(0);

            holders.push_back((holder, balance));
        }

        holders
    }
}
