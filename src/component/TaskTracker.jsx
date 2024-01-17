import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Load tasks from local storage on initial render
const getLocalItems = () => {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

const TaskTracker = () => {
  const [tasks, setTasks] = useState(getLocalItems());
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'completed', or 'incomplete'

  // Save tasks to local storage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() !== '') {
      const newTaskObj = {
        id: new Date().getTime(),
        name: newTask,
        dateAdded: new Date().toLocaleString(),
        completed: false,
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask('');
    }
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const markAsCompleted = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') {
      return true;
    } else if (filter === 'completed') {
      return task.completed;
    } else {
      return !task.completed;
    }
  });

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const updatedTasks = Array.from(tasks);
    const [reorderedTask] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, reorderedTask);

    setTasks(updatedTasks);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6 text-center text-indigo-600">Task Tracker</h1>
      <div className="mb-6 flex flex-col sm:flex-row items-center">
        <input
          type="text"
          placeholder="New Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border border-gray-300 p-3 mb-3 sm:mb-0 sm:mr-3 w-full sm:w-3/4 rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white py-3 px-6 rounded-md w-full sm:w-auto hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring focus:border-blue-500"
        >
          Add Task
        </button>
      </div>
      <div className="mb-6">
        <label className="mr-3 text-sm">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 p-2 text-sm rounded-md focus:outline-none focus:ring focus:border-blue-500"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="border border-gray-300 rounded p-4 bg-gray-100"
            >
              {filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`flex items-center justify-between p-3 mb-3 ${task.completed
                          ? 'bg-green-200'
                          : 'bg-white shadow-md hover:shadow-lg transition duration-300'
                        } border border-gray-300 rounded-md ${snapshot.isDragging ? 'scale-105' : ''
                        }`}
                    >
                      <span className={`text-lg ${task.completed ? 'line-through' : ''}`}>
                        {task.name}
                      </span>
                      <div>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="bg-red-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-red-600 transition duration-300 focus:outline-none focus:ring focus:border-red-500"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => markAsCompleted(task.id)}
                          className={`${task.completed
                              ? 'bg-gray-400 text-gray-800'
                              : 'bg-blue-500 text-white'
                            } py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring focus:border-blue-500`}
                        >
                          {task.completed ? 'Undo' : 'Complete'}
                        </button>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TaskTracker;

