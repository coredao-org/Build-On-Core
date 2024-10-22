import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import TodoList from '../contractABI/TodoList.json';
import {
  ItemBackground,
  ItemContainer,
  ItemHeader,
  ItemTitle,
  ItemBody,
  ItemAddButton
} from "../style/TasksPageStyle";

const contractAddress = '0x11100092310F13687981098de5800Ee82da0D4D6';
const abi = TodoList.abi;

export default function Tasks() {
  const [taskContent, setTaskContent] = useState("");
  const [registering, setRegistering] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const tasksPerPage = 10;

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have Metamask installed!');
      return;
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }
  };

  const addTask = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const todoListContract = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );

        const tx = await todoListContract.createTask(taskContent);
        setRegistering(true);

        await tx.wait();

        setRegistering(false);
        setTaskContent("");

        fetchTasks(); // Refresh tasks list after adding a new task
      } else {
        console.log('Ethereum object does not exist');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTasks = useCallback(async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const todoListContract = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );

        const total = await todoListContract.getTasks(0, 100); // Fetch all tasks for pagination
        setTotalTasks(total.length);
        setTasks(total.slice(currentPage * tasksPerPage, (currentPage + 1) * tasksPerPage));
      } else {
        console.log('Ethereum object does not exist');
      }
    } catch (err) {
      console.log(err);
    }
  }, [currentPage]);

  const handleNextPage = () => {
    if ((currentPage + 1) * tasksPerPage < totalTasks) {
      setCurrentPage(currentPage + 1);
      fetchTasks();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      fetchTasks();
    }
  };

  useEffect(() => {
    checkWalletIsConnected();
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div>
      <ItemBackground>
        <ItemContainer>
          <ItemHeader>
            <ItemTitle>
              <label
                style={{
                  textShadow: "1px 0px 0px black, 0px 1px 0px black, -1px 0px 0px black, 0px -1px 0px black",
                }}
              >
                New Task
              </label>
            </ItemTitle>
          </ItemHeader>
          <ItemBody>
            {currentAccount ? (
              <div className="container text-center">
                {!registering ? (
                  <div>
                    <div>
                      <input
                        style={{ background: "white" }}
                        placeholder="New Task"
                        value={taskContent}
                        onChange={(e) => setTaskContent(e.target.value)}
                      />
                    </div>
                    <br />
                    <div>
                      <ItemAddButton onClick={addTask}>
                        Add Task
                      </ItemAddButton>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "grid", justifyContent: "center" }}>
                    <br />
                    <label style={{ fontSize: "20px", fontWeight: "400" }}>
                      Adding Task...
                    </label>
                  </div>
                )}
                <br />
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <span>Please login to add new tasks</span>
              </div>
            )}
          </ItemBody>
        </ItemContainer>
      </ItemBackground>
    </div>
  );
}