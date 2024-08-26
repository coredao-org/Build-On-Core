## Introduction
This is a frontend project that provides a user interface for interacting with a delegate platform. The application allows users to view and manage their delegate activities, including delegating to validators and tracking delegate rewards.

## Setup
Before running the project, you need to set up a MongoDB connection. This requires setting the `MONGODB_URI` environment variable. This database is used to save transaction history when generating a mock delegatedBtc event.

1. Create a `.env.local` file in the root of the project.
2. Add the following line to the `.env.local` file:
    ```env.local
    MONGODB_URI=your_mongodb_connection_string
    ```
3. Save the file.

## Run
```yarn dev```


## Features
- **Dashboard Page**: Lists all available validators and allows users to select a validator to delegate their tokens.
- **Validator Page**: Displays delegate history, account per share charts for the last 14 days, total CORE and BTC stake, and provides options to delegate and claim rewards.
- **My Staking Page**: Allows users to view their total staked amount, reward history.

## Pages

### Dashboard Page
The Dashboard page provides an overview of all available validators. Users can:
- See a list of validators.
- Select a validator to delegate their tokens.

### Validator Page
The Validator page provides detailed information about a selected validator. Users can:
- View the delegate history.
- See reward per BTC charts for the last 14 days.
- Check the total CORE and BTC stake.
- Delegate tokens to the validator.
- Claim rewards.

### My Staking Page
The My Staking page allows users to manage their staking activities. Users can:
- View the total amount they have staked.
- See their reward history.

