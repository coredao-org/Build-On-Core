
# RuneBridge Frontend

## Overview

The RuneBridge frontend is a React TypeScript application built using Vite. It interacts with the RuneBridge smart contract deployed on the blockchain, providing users with an interface to view their wallet balances, wrap and unwrap Runes, see transaction details 

## Environment Setup

To configure the frontend, you'll need to set up environment variable in a `.env` file. Below is the required variable:

### Environment Variable

-   **`VITE_CONTRACT_ADDRESS`**: The deployed address of the RuneBridge smart contract.

## Available Scripts

Here are the available commands for building and running the frontend:

### Development

To start the development server with hot-reloading:

`yarn dev` 

### Build

To build the application for production:

`yarn build` 

This command compiles the TypeScript code and bundles the application using Vite.

### Lint

To lint the codebase using ESLint:

`yarn lint` 

This command checks the code for linting errors and enforces coding standards.

### Preview

To preview the production build locally:

bash

Copy code

`yarn preview` 

This command serves the production build locally to test it before deploying