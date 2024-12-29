'use client';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Circle, BarChart } from 'lucide-react';
import { Task, TaskList } from '@/types/task';

interface DashboardProps {
  lists: TaskList[];
  tasks: Task[];
}

export default function Dashboard({ lists, tasks }: DashboardProps) {
  const getListProgress = (listId: string) => {
    const listTasks = tasks.filter(task => task.listId === listId);
    if (listTasks.length === 0) return { completed: 0, inProgress: 0, total: 0 };
    
    const completed = listTasks.filter(task => task.status === 'completed').length;
    const inProgress = listTasks.filter(task => task.status === 'in-progress').length;
    
    return {
      completed,
      inProgress,
      total: listTasks.length,
      completedPercentage: Math.round((completed / listTasks.length) * 100),
      inProgressPercentage: Math.round((inProgress / listTasks.length) * 100)
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {lists.map(list => {
        const progress = getListProgress(list.id);
        
        return (
          <motion.div
            key={list.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{list.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <BarChart className="w-4 h-4" />
                {progress.completedPercentage}% Complete
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-2 mb-6">
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${progress.completedPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {progress.completed} Complete
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  {progress.inProgress} In Progress
                </div>
                <div className="flex items-center gap-2">
                  <Circle className="w-4 h-4" />
                  {progress.total - progress.completed - progress.inProgress} Pending
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {tasks
                .filter(task => task.listId === list.id)
                .map(task => (
                  <motion.div
                    key={task.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {task.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {task.status === 'in-progress' && <Clock className="w-4 h-4 text-yellow-500" />}
                    {task.status === 'pending' && <Circle className="w-4 h-4 text-gray-400" />}
                    <span className={task.status === 'completed' ? 'line-through text-gray-400' : ''}>
                      {task.text}
                    </span>
                  </motion.div>
                ))
              }
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}