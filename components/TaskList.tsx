import React, { useState } from 'react';
import { Task } from '../types';
import { Plus, Trash2, CheckCircle, Circle, Edit2, ListTodo } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  activeTaskId: string | null;
  onAddTask: (title: string, est: number) => void;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  onSelectTask: (id: string) => void;
  onUpdateTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, activeTaskId, onAddTask, onDeleteTask, onToggleTask, onSelectTask, onUpdateTask 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [estPomodoros, setEstPomodoros] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle, estPomodoros);
      setNewTaskTitle('');
      setEstPomodoros(1);
      setIsAdding(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <ListTodo className="w-6 h-6 text-pomo" aria-hidden="true"/>
            Tasks
        </h2>
        <div 
          className="bg-input px-3 py-1 rounded-full text-xs font-bold text-secondary uppercase tracking-wider"
          aria-label={`${tasks.filter(t => t.completed).length} out of ${tasks.length} tasks completed`}
        >
           {tasks.filter(t => t.completed).length} / {tasks.length} Done
        </div>
      </div>

      {activeTaskId && tasks.find(t => t.id === activeTaskId) && (
        <div className="mb-6 p-4 bg-pomo/5 rounded-xl border-2 border-pomo text-center">
            <span className="text-xs uppercase tracking-wider text-pomo font-bold mb-1 block">Current Focus</span>
            <h3 className="text-lg font-bold text-primary truncate">{tasks.find(t => t.id === activeTaskId)?.title}</h3>
        </div>
      )}

      <ul className="space-y-3">
        {tasks.map(task => (
          <li 
            key={task.id} 
            className={`
              relative group p-4 rounded-xl transition-all duration-200 cursor-pointer border-l-4
              ${activeTaskId === task.id ? 'bg-pomo/5 border-pomo ring-1 ring-pomo/20' : 'bg-input/50 hover:bg-input border-transparent'}
              ${task.completed ? 'opacity-60' : ''}
            `}
            onClick={() => onSelectTask(task.id)}
            role="button"
            tabIndex={0}
            aria-selected={activeTaskId === task.id}
            onKeyDown={(e) => {
                if(e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTask(task.id);
                }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleTask(task.id); }}
                  className="text-muted hover:text-pomo transition-colors focus:outline-none focus:ring-2 focus:ring-pomo rounded-full p-1"
                  aria-label={task.completed ? "Mark task as incomplete" : "Mark task as complete"}
                >
                  {task.completed ? <CheckCircle className="w-6 h-6 text-pomo" /> : <Circle className="w-6 h-6" />}
                </button>
                
                {editingId === task.id ? (
                    <input 
                        type="text" 
                        className="bg-transparent border-b border-muted focus:outline-none w-full text-primary"
                        defaultValue={task.title}
                        autoFocus
                        aria-label="Edit task title"
                        onBlur={(e) => {
                             onUpdateTask({...task, title: e.target.value});
                             setEditingId(null);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onUpdateTask({...task, title: e.currentTarget.value});
                                setEditingId(null);
                            }
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span className={`font-medium truncate text-primary ${task.completed ? 'line-through text-muted' : ''}`}>
                    {task.title}
                    </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                 <span className="text-sm font-bold text-muted" aria-label={`${task.actPomodoros} of ${task.estPomodoros} pomodoros completed`}>
                  {task.actPomodoros}/{task.estPomodoros}
                 </span>
                 <div className="opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 flex items-center gap-1 transition-opacity">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setEditingId(task.id); }}
                        className="p-1 hover:bg-input rounded text-muted focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-pomo"
                        aria-label={`Edit task: ${task.title}`}
                    >
                        <Edit2 size={14} />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
                        className="p-1 hover:bg-input rounded text-red-500 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`Delete task: ${task.title}`}
                    >
                        <Trash2 size={14} />
                    </button>
                 </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {!isAdding ? (
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full mt-6 py-4 rounded-xl border-2 border-dashed border-muted/30 flex items-center justify-center gap-2 text-muted font-bold hover:bg-input/50 hover:border-muted transition-all focus:outline-none focus:ring-2 focus:ring-pomo focus:ring-offset-2"
        >
          <Plus size={20} /> Add Task
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 p-4 bg-input/50 rounded-xl animate-fade-in-up border border-border">
           <label htmlFor="newTaskTitle" className="sr-only">Task Title</label>
           <input
             id="newTaskTitle"
             type="text"
             placeholder="What are you working on?"
             className="w-full text-lg font-medium bg-transparent placeholder-muted border-none outline-none mb-4 text-primary"
             value={newTaskTitle}
             onChange={(e) => setNewTaskTitle(e.target.value)}
             autoFocus
           />
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <label htmlFor="estPomodoros" className="text-sm font-bold text-muted">Est Pomodoros</label>
                 <input 
                    id="estPomodoros"
                    type="number" 
                    min="1"
                    max="10"
                    value={estPomodoros}
                    onChange={(e) => setEstPomodoros(parseInt(e.target.value))}
                    className="w-16 p-2 bg-card rounded-lg font-bold text-center text-primary shadow-sm"
                 />
              </div>
              <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 text-muted font-medium hover:text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-muted"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-primary text-main rounded-lg font-bold hover:opacity-90 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Save
                  </button>
              </div>
           </div>
        </form>
      )}
    </div>
  );
};

export default TaskList;