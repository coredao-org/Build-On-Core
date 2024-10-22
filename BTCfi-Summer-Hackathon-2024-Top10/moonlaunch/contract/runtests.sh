#!/bin/bash
source .env
echo "Running tests on forked core mainnet..."
forge test --match-path test/Test.t.sol --match-contract MainnetForkTest --gas-report --fork-url $MAINNET_RPC_URL -vvvv
