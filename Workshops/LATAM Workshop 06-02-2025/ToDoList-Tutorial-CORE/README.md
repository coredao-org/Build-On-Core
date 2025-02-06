# TodoList dApp on Core

## What can you do in this tutorial?

## Software Prerequisites
* [Git](https://git-scm.com/) v2.44.0
* [Node.js](https://nodejs.org/en) v20.11.1
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) v10.2.4
* [Hardhat](https://hardhat.org/hardhat-runner/docs/getting-started#installation) v10.2.4
* [MetaMask Web Wallet Extension](https://metamask.io/download/)

## Setting up the development environment

1. Download this repository

## Setting up Frontend

1. In the root folder, install all the dependencies.

```bash
npm install
```

2. In the path src/contractABI we must copy the abi of our smart contract in the case of making modifications, this information will be obtained from contract/artifacts/contracts/TodoList.json.

3. Once the smart contract is deployed, it is necessary to copy the address and replace it in each of the components where we make calls to the contract, in this case in ...

4. To test if things are working fine, run the application by using the following command. This will serve applciation with hot reload feature at [http://localhost:5173](http://localhost:5173/)

```bash
npm run dev
```

## Add New Task

 1. To add a new task, you must first enter the text or description of the task.
 2. Once this is done, click on the Add Task button and accept the transaction in metamask.

<img src="https://github.com/open-web-academy/ToDoList-Tutorial-CORE/blob/master/src/public/NewTask.gif?raw=true" width="50%">

## Complete Task

 1. To mark a task as complete, you must first go to the "Task List" option in the menu.
 2. You must locate the task you want to mark as complete and then click on the "Complete" button.
 3. Finally, you will only have to accept the transaction in metamask and the task will be marked as complete.

<img src="https://raw.githubusercontent.com/open-web-academy/ToDoList-Tutorial-CORE/master/src/public/CompleteTask.gif" width="50%">

## Delete Taks

 1. To remove a task from the task list, you must first go to the “Task List” option in the menu.
 2. You must locate the task you want to remove and then click on the “Remove” button.
 3. Finally, you will only have to accept the transaction in metamask and the task will be removed from the list.

<img src="https://raw.githubusercontent.com/open-web-academy/ToDoList-Tutorial-CORE/master/src/public/RemoveTask.gif" width="50%">

