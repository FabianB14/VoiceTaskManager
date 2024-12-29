export interface Task {
    id: string;
    text: string;
    status: 'pending' | 'in-progress' | 'completed';
    createdAt: Date;
    listId: string;
  }
  
  export interface TaskList {
    id: string;
    name: string;
    createdAt: Date;
  }