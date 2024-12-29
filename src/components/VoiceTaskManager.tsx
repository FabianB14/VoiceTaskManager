'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Circle, Trash2, List, Plus } from 'lucide-react';
import { Task, TaskList } from '@/types/task';
import Dashboard from '@/components/Dashboard';

export default function VoiceTaskManager() {
  const [isListening, setIsListening] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<TaskList[]>([]);
  const [activeListId, setActiveListId] = useState<string>('');
  const [error, setError] = useState('');
  const [lastAction, setLastAction] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  const [newListName, setNewListName] = useState('');
  const [newTaskText, setNewTaskText] = useState('');

  // Load data from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedLists = localStorage.getItem('taskLists');
    const savedActiveList = localStorage.getItem('activeListId');
    

    if (savedLists) {
      setLists(JSON.parse(savedLists));
    }
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    if (savedActiveList) {
      setActiveListId(savedActiveList);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('taskLists', JSON.stringify(lists));
    localStorage.setItem('activeListId', activeListId);
  }, [tasks, lists, activeListId]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const processCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    console.log('Processing command:', lowerCommand);
  
    // List commands
    if (lowerCommand.includes('create list')) {
      const listName = lowerCommand.replace('create list', '').trim();
      if (listName) {
        setNewListName(listName); // Update input field
        // Optional: Auto-create after brief delay
        setTimeout(() => {
          createList(listName);
          setNewListName('');
          speak(`Created list: ${listName}`);
        }, 500);
      }
    }
    else if (lowerCommand.includes('open list') || lowerCommand.includes('show list')) {
      const listName = lowerCommand.replace(/(open list|show list)/, '').trim();
      const list = lists.find(l => l.name.toLowerCase() === listName.toLowerCase());
      if (list) {
        setActiveListId(list.id);
        speak(`Opened list: ${list.name}`);
      } else {
        speak(`Could not find list named ${listName}`);
      }
    }
    // Task commands
    else if (lowerCommand.includes('add task')) {
      if (!activeListId) {
        speak('Please select a list first');
        return;
      }
      const taskText = lowerCommand.replace('add task', '').trim();
      if (taskText) {
        setNewTaskText(taskText); // Update input field
        // Optional: Auto-add after brief delay
        setTimeout(() => {
          addTask(taskText);
          setNewTaskText('');
          speak(`Added task: ${taskText}`);
          setLastAction('added');
        }, 500);
      }
    }
    else if (lowerCommand.includes('start')) {
      // Handle both "start task buy milk" and "start buy milk"
      const taskText = lowerCommand.replace(/(start task|start)/, '').trim();
      const task = findTaskByText(taskText);
      if (task) {
        const index = tasks.findIndex(t => t.id === task.id);
        startTask(index);
        speak(`Started task: ${task.text}`);
        setLastAction('started');
      } else {
        speak(`Could not find task: ${taskText}`);
      }
    }
    else if (lowerCommand.includes('complete') || lowerCommand.includes('finish')) {
      const taskText = lowerCommand.replace(/(complete task|complete|finish task|finish)/, '').trim();
      const task = findTaskByText(taskText);
      if (task) {
        const index = tasks.findIndex(t => t.id === task.id);
        completeTask(index);
        speak(`Completed task: ${task.text}`);
        setLastAction('completed');
      } else {
        speak(`Could not find task: ${taskText}`);
      }
    }
    else if (lowerCommand.includes('delete') || lowerCommand.includes('remove')) {
      const taskText = lowerCommand.replace(/(delete task|delete|remove task|remove)/, '').trim();
      const task = findTaskByText(taskText);
      if (task) {
        const index = tasks.findIndex(t => t.id === task.id);
        deleteTask(index);
        speak(`Deleted task: ${task.text}`);
        setLastAction('deleted');
      } else {
        speak(`Could not find task: ${taskText}`);
      }
    }
    // List management commands
    else if (lowerCommand.includes('list tasks in')) {
      const listName = lowerCommand.replace('list tasks in', '').trim();
      const list = lists.find(l => l.name.toLowerCase() === listName.toLowerCase());
      if (list) {
        const listTasks = tasks.filter(task => task.listId === list.id);
        if (listTasks.length === 0) {
          speak(`No tasks in list ${list.name}`);
        } else {
          const taskList = listTasks.map(task => task.text).join(', ');
          speak(`Tasks in ${list.name}: ${taskList}`);
        }
      } else {
        speak(`Could not find list named ${listName}`);
      }
    }
    else if (lowerCommand === 'list all tasks') {
      const activeTasks = tasks.filter(task => task.listId === activeListId);
      if (activeTasks.length === 0) {
        speak('No tasks in current list');
      } else {
        const taskList = activeTasks.map(task => `${task.text}, status: ${task.status}`).join('. ');
        speak(taskList);
      }
    }
  };

  // Task management functions
  // Add these functions in your VoiceTaskManager component
const createList = (name: string) => {
  const newList: TaskList = {
    id: Date.now().toString(),
    name,
    createdAt: new Date()
  };
  setLists(prev => [...prev, newList]);
  if (!activeListId) {
    setActiveListId(newList.id);
  }
};

const startTask = (index: number) => {
  setTasks(prev => prev.map((task, i) => 
    i === index ? { ...task, status: 'in-progress' } : task
  ));
};

const completeTask = (index: number) => {
  setTasks(prev => prev.map((task, i) => 
    i === index ? { ...task, status: 'completed' } : task
  ));
};

const deleteTask = (index: number) => {
  setTasks(prev => prev.filter((_, i) => i !== index));
};

const addTask = (text: string) => {
  setTasks(prev => [...prev, {
    id: Date.now().toString(),
    text,
    status: 'pending',
    createdAt: new Date(),
    listId: activeListId
  }]);
};

// Add this for voice feedback
const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
};
  
  // Add this helper function to find tasks by text
  const findTaskByText = (searchText: string): Task | undefined => {
    const normalizedSearch = searchText.toLowerCase();
    return tasks.find(task => 
      task.listId === activeListId && 
      task.text.toLowerCase().includes(normalizedSearch)
    );
  };

  // Filter tasks by active list
  const filteredTasks = tasks.filter(task => task.listId === activeListId);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
    {/* Lists Section */}
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Lists</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New list name"
            className="px-3 py-2 border rounded-lg"
          />
          <button
            onClick={() => {
              if (newListName.trim()) {
                createList(newListName.trim());
                setNewListName('');
              }
            }}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {lists.map(list => (
            <button
              key={list.id}
              onClick={() => setActiveListId(list.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                activeListId === list.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800'
              }`}
            >
              <List className="w-4 h-4 inline-block mr-2" />
              {list.name}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Control Section */}
      <div className="space-y-4">
      <h2 className="text-2xl font-bold">Voice Control</h2>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`px-4 py-2 rounded-lg ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
          {isListening && (
            <span className="text-sm text-gray-500">
              🎤 {transcript || 'Listening...'}
            </span>
          )}
        </div>
      </div>
    </div>

      {/* Tasks Section */}
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-bold">
      {activeListId 
        ? `Tasks - ${lists.find(l => l.id === activeListId)?.name}`
        : 'Select a List'
      }
    </h2>
    {activeListId && (
      <div className="flex gap-2">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="New task"
          className="px-3 py-2 border rounded-lg"
        />
        <button
          onClick={() => {
            if (newTaskText.trim()) {
              addTask(newTaskText.trim());
              setNewTaskText('');
            }
          }}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    )}
  </div>
  
  {!activeListId ? (
    <p className="text-gray-500 text-center">Please select or create a list first</p>
  ) : filteredTasks.length === 0 ? (
    <p className="text-gray-500 text-center">No tasks yet. Try saying "Add task [your task]"</p>
  ) : (
    <motion.div className="space-y-3">
      {filteredTasks.map((task, index) => (
        <div 
          key={task.id} 
          className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg shadow"
        >
          <div className="flex items-center">
            <button 
              className="mr-3"
              onClick={() => completeTask(index)}
            >
              {task.status === 'completed' ? (
                <CheckCircle className="text-green-500" />
              ) : (
                <Circle className="text-gray-400" />
              )}
            </button>
            <span className={`text-lg ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
              {task.text}
            </span>
          </div>
          <button 
            className="text-red-500 hover:text-red-700" 
            onClick={() => deleteTask(index)}
          >
            <Trash2 />
          </button>
        </div>
      ))}
    </motion.div>
  )}
</div>
    </div>
  );
}