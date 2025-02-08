export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  partiallyCompleted: boolean;
  createdAt: Date;
  userId: string;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}