import React, { useState } from 'react';
import { Task } from '../types';
import { Plus, MoreVertical, Trash2, CheckCircle, Circle, Edit2 } from 'lucide-react';

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
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-primary">Tasks</h2>
        <div className="bg-input px-3 py-1 rounded-full text-sm font-bold text-secondary">
           {tasks.filter(t => t.completed).length}/{tasks.length}
        </div>
      </div>

      {activeTaskId && tasks.find(t => t.id === activeTaskId) && (
        <div className="mb-6 p-4 bg-card rounded-xl shadow-sm border-2 border-pomo text-center">
            <span className="text-xs uppercase tracking-wider text-muted font-semibold mb-1 block">Current Focus</span>
            <h3 className="text-lg font-bold text-primary truncate">{tasks.find(t => t.id === activeTaskId)?.title}</h3>
        </div>
      )}

      <div className="space-y-3">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`
              relative group p-4 rounded-lg bg-card shadow-sm border-l-4 transition-all duration-200 cursor-pointer
              ${activeTaskId === task.id ? 'border-pomo ring-2 ring-pomo/20' : 'border-transparent hover:border-border'}
              ${task.completed ? 'opacity-60' : ''}
            `}
            onClick={() => onSelectTask(task.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleTask(task.id); }}
                  className="text-muted hover:text-pomo transition-colors"
                >
                  {task.completed ? <CheckCircle className="w-6 h-6 text-pomo" /> : <Circle className="w-6 h-6" />}
                </button>
                
                {editingId === task.id ? (
                    <input 
                        type="text" 
                        className="bg-transparent border-b border-muted focus:outline-none w-full text-primary"
                        defaultValue={task.title}
                        autoFocus
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
                 <span className="text-sm font-bold text-muted">
                  {task.actPomodoros}/{task.estPomodoros}
                 </span>
                 <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setEditingId(task.id); }}
                        className="p-1 hover:bg-input rounded text-muted"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
                        className="p-1 hover:bg-input rounded text-red-500"
                    >
                        <Trash2 size={14} />
                    </button>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isAdding ? (
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-border flex items-center justify-center gap-2 text-muted font-bold hover:bg-card hover:border-muted transition-all"
        >
          <Plus size={20} /> Add Task
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 p-4 bg-card rounded-xl shadow-lg animate-fade-in-up">
           <input
             type="text"
             placeholder="What are you working on?"
             className="w-full text-lg font-medium bg-transparent placeholder-muted border-none outline-none mb-4 text-primary"
             value={newTaskTitle}
             onChange={(e) => setNewTaskTitle(e.target.value)}
             autoFocus
           />
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <span className="text-sm font-bold text-muted">Est Pomodoros</span>
                 <input 
                    type="number"
                    min="1"
                    max="10"
                    value={estPomodoros}
                    onChange={(e) => setEstPomodoros(parseInt(e.target.value))}
                    className="w-16 p-2 bg-input rounded-lg font-bold text-center text-primary"
                 />
              </div>
              <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 text-muted font-medium hover:text-primary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-primary text-main rounded-lg font-bold hover:opacity-90 transition-colors shadow-lg"
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