// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    struct Task {
        uint id;
        string content;
        bool completed;
    }

    mapping(address => Task[]) private userTasks;
    mapping(address => mapping(uint => uint)) private userTaskIndex; // Mapping from task ID to array index
    mapping(address => uint) private taskCounts;

    event TaskCreated(address indexed user, uint id, string content);
    event TaskCompleted(address indexed user, uint id);
    event TaskRemoved(address indexed user, uint id);
    event TaskUpdated(address indexed user, uint id, string newContent);

    function createTask(string calldata _content) external {
        uint taskId = taskCounts[msg.sender]++;
        userTasks[msg.sender].push(Task(taskId, _content, false));
        userTaskIndex[msg.sender][taskId] = userTasks[msg.sender].length - 1; // Map task ID to its index
        emit TaskCreated(msg.sender, taskId, _content);
    }

    function getTasks(uint _startIndex, uint _limit) external view returns (Task[] memory) {
        Task[] memory allTasks = userTasks[msg.sender];
        uint totalTasks = allTasks.length;

        require(_startIndex < totalTasks, "Start index out of bounds");

        uint endIndex = _startIndex + _limit > totalTasks ? totalTasks : _startIndex + _limit;
        uint taskCount = endIndex - _startIndex;

        Task[] memory paginatedTasks = new Task[](taskCount);

        for (uint i = 0; i < taskCount; i++) {
            paginatedTasks[i] = allTasks[totalTasks - 1 - (_startIndex + i)];
        }

        return paginatedTasks;
    }

    function completeTask(uint _taskId) external {
        uint index = userTaskIndex[msg.sender][_taskId];
        require(index < userTasks[msg.sender].length, "Task does not exist");

        Task storage task = userTasks[msg.sender][index];
        require(!task.completed, "Task already completed");

        task.completed = true;
        emit TaskCompleted(msg.sender, _taskId);
    }

    function removeTask(uint _taskId) external {
        uint index = userTaskIndex[msg.sender][_taskId];
        Task[] storage tasks = userTasks[msg.sender];
        require(index < tasks.length, "Task does not exist");

        // Remove the task by replacing it with the last one
        tasks[index] = tasks[tasks.length - 1];
        userTaskIndex[msg.sender][tasks[index].id] = index; // Update the index mapping for the moved task
        tasks.pop();

        // Remove the mapping for the deleted task
        delete userTaskIndex[msg.sender][_taskId];

        emit TaskRemoved(msg.sender, _taskId);
    }

    function updateTask(uint _taskId, string calldata _newContent) external {
        uint index = userTaskIndex[msg.sender][_taskId];
        Task[] storage tasks = userTasks[msg.sender];
        require(index < tasks.length, "Task does not exist");

        Task storage task = tasks[index];
        task.content = _newContent;

        emit TaskUpdated(msg.sender, _taskId, _newContent);
    }
}
