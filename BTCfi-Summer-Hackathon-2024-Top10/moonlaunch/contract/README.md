# MoonLaunch Contracts

This repository contains the core smart contracts for [MoonLaunch](https://moon-launch.netlify.app/), a decentralized application designed to facilitate fair and transparent token launches on the Core Chain chain.

## MoonLaunch Bonding Curve

This is the main [contract](/src/Curve.sol) that powers token launches, trading and liquidity migration.

### Deployment Addresses

|  Blockchain  |                                                            Address                                                            |
| :----------: | :---------------------------------------------------------------------------------------------------------------------------: |
| CoreDao Mainnet | [0xD62BfbF2050e8fEAD90e32558329D43A6efce4C8](https://scan.coredao.org/address/0xd62bfbf2050e8fead90e32558329d43a6efce4c8#transactions) |
| CoreDao Testnet  | [0xFcA69B9033C414cBCfa24b30228376fd040b70B2](https://scan.test.btcs.network/address/0xFcA69B9033C414cBCfa24b30228376fd040b70B2#transactions) |

## MoonLaunch Token
This is the [token contract](/src/Token.sol) code for all tokens launched on [MoonLaunch](https://moon-launch.netlify.app/).

## Development

### Installation

- Clone the repository
- `cd moonlaunch-contracts`
- Install foundry: `curl -L https://foundry.paradigm.xyz | bash`
- Set up .env according to [.env.example](/.env.example)

### Testing
The smart contract tests can be found in [CurveTest.t.sol](/test/CurveTest.t.sol)
Run Foundry Tests:
- Modify test [script](/runtests.sh) permissions
```bash
chmod 700 ./runtests.sh
```
- Run test on CoreDao mainnet fork
```bash
./runtests.sh mainnet
```

Built with love ❤️ from 🇳🇬🚀.
