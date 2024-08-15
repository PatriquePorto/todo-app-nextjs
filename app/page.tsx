'use client'

import React, { useState, useEffect } from 'react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState<number | null>(null);

  useEffect(() => {
    // Load tasks from local storage when the component mounts
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        } else {
          console.error('Invalid tasks data in local storage:', storedTasks);
        }
      } catch (error) {
        console.error('Error parsing tasks from local storage:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save tasks to local storage whenever tasks change
    const tasksToSave = JSON.stringify(tasks);
    try {
      localStorage.setItem('tasks', tasksToSave);
    } catch (error) {
      console.error('Error saving tasks to local storage:', error);
    }
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleComplete = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTaskIdToDelete(id);
    setShowDeleteConfirm(true);
  };
  
  const handleDeleteConfirm = () => {
    if (taskIdToDelete !== null) {
      setTasks(tasks.filter(task => task.id !== taskIdToDelete));
    }
    setShowDeleteConfirm(false);
  };
  
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };



  const startEditing = (id: number, text: string) => {
    setEditingTask(id);
    setEditText(text);
  };

  const saveEdit = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: editText } : task
    ));
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-extrabold text-center">TODO App NextJs</h1>
               
                <div className="flex mt-4">
                  
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="flex-grow px-4 py-2 text-base border rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Add a new task"
                  />
                  
                  <button
                    onClick={addTask}
                    className="ml-2 px-4 py-2 text-base font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Add
                  </button>
                </div>
                
                <ul className="mt-4 space-y-2">
                  
                  {tasks.map((task, index) => (   
                     <React.Fragment key={task.id}>  
                     {index > 0 && <hr className='border-gray-300 ' />}              
                    <li  className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id)}
                        className="h-5 w-5 text-blue-600"
                      />
                      
                      {editingTask === task.id ? (
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-grow px-2 py-1 text-base border rounded focus:outline-none focus:border-blue-500"
                        />
                      ) : (
                        <span className={`flex-grow ${task.completed ? 'line-through text-gray-400' : ''}`}>
                          {task.text}
                        </span>
                      )}
                       
                      {editingTask === task.id ? (
                        <button
                          onClick={() => saveEdit(task.id)}
                          className="px-2 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => startEditing(task.id, task.text)}
                          className="px-2 py-1 text-sm text-white bg-yellow-500 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                        >
                          Edit
                        </button>
                      )}
                     <button
                          onClick={() => deleteTask(task.id)}
                          className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        >
                          Delete
                        </button>
                        {showDeleteConfirm && (
                          <div className="fixed top-20 left-56 right-56 bottom-80 bg-gray-500 rounded-lg bg-opacity-75 flex justify-center items-center">
                            <div className="bg-white p-4 mb-52 rounded shadow-md">
                              <p>Are you sure you want to delete this task?</p>
                              <button
                                onClick={handleDeleteConfirm}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                              >
                                Yes
                              </button>
                              <button
                                onClick={handleDeleteCancel}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                              >
                                No
                        </button>
                       
                      </div>
                     
                  </div>
              )}
                    </li>
                    </React.Fragment>     
                  ))}
                 
                </ul>
              </div>
            </div>
          </div>      
        </div>
      </div>
    </div>
  );
}