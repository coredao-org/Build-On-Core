import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import TodoList from '../contractABI/TodoList.json';
import {
  ItemBackground,
  ItemContainer,
  ItemHeader,
  ItemTitle,
  ItemBody,
  ItemAddButton,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  CompleteButton,
  RemoveButton
} from "../style/TasksPageStyle";

const contractAddress = '0x11100092310F13687981098de5800Ee82da0D4D6';
const abi = TodoList.abi;

export default function Todo() {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const tasksPerPage = 10;

  const fetchTasks = useCallback(async (startIndex:any, limit:any) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const todoListContract = new ethers.Contract(contractAddress, abi, signer);

        const tasks = await todoListContract.getTasks(startIndex, limit);
        setTasks(tasks);
      } else {
        console.log('Ethereum object does not exist');
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const fetchTotalTasks = useCallback(async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const todoListContract = new ethers.Contract(contractAddress, abi, signer);

        const tasks = await todoListContract.getTasks(0, 1000); // Fetch a large number to count
        setTotalTasks(tasks.length);
        fetchTasks(0, tasksPerPage); // Load first page
      } else {
        console.log('Ethereum object does not exist');
      }
    } catch (err) {
      console.log(err);
    }
  }, [fetchTasks]);

  useEffect(() => {
    fetchTotalTasks();
  }, [fetchTotalTasks]);

  const handleNextPage = () => {
    if ((currentPage + 1) * tasksPerPage < totalTasks) {
      setCurrentPage(currentPage + 1);
      fetchTasks((currentPage + 1) * tasksPerPage, tasksPerPage);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      fetchTasks((currentPage - 1) * tasksPerPage, tasksPerPage);
    }
  };

  const handleCompleteTask = async (taskId:any) => {
    try {
      console.log("taskId: "+taskId)
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const todoListContract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await todoListContract.completeTask(taskId);
        await tx.wait();

        // Refresh tasks after completion
        fetchTotalTasks();
      } else {
        console.log('Ethereum object does not exist');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveTask = async (taskId:any) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const todoListContract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await todoListContract.removeTask(taskId);
        await tx.wait();

        // Refresh tasks after removal
        fetchTotalTasks();
      } else {
        console.log('Ethereum object does not exist');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <ItemBackground>
        <ItemContainer>
          <ItemHeader>
            <ItemTitle>
              <label
                style={{
                  textShadow:
                    "1px 0px 0px black, 0px 1px 0px black, -1px 0px 0px black, 0px -1px 0px black",
                }}
              >
                Tasks List
              </label>
            </ItemTitle>
          </ItemHeader>
          <ItemBody>
            <div className="container text-center">
              {totalTasks > 0 ? (
                <div>
                  <Table>
                    <thead>
                      <tr>
                        <TableHeader>Content</TableHeader>
                        <TableHeader>Completed</TableHeader>
                        <TableHeader>Actions</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task:any, index) => (
                        <TableRow key={index}>
                          <TableCell>{task.content}</TableCell>
                          <TableCell>{task.completed ? "Yes" : "No"}</TableCell>
                          <TableCell>
                            <CompleteButton onClick={() => handleCompleteTask(task.id)} disabled={task.completed}>
                              Complete
                            </CompleteButton>
                            <RemoveButton onClick={() => handleRemoveTask(task.id)}>
                              Remove
                            </RemoveButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                  <br />
                  <div>
                    <ItemAddButton onClick={handlePrevPage} disabled={currentPage === 0}>
                      Prev
                    </ItemAddButton>
                    <span><b>Page {currentPage + 1}/{Math.ceil(totalTasks / tasksPerPage)}</b></span>
                    <ItemAddButton onClick={handleNextPage} disabled={(currentPage + 1) * tasksPerPage >= totalTasks}>
                      Next
                    </ItemAddButton>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", justifyContent: "center" }}>
                  <br />
                  <label style={{ fontSize: "20px", fontWeight: "400" }}>
                    There are no tasks
                  </label>
                </div>
              )}
              <br />
            </div>
          </ItemBody>
        </ItemContainer>
      </ItemBackground>
    </div>
  );
}
