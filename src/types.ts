export interface Todo {
  id: string;
  title: string;
  description: string;
  status: "not_started" | "in_progress" | "completed";
  createdAt: Date;
  userId: string;
  reminderAt?: Date; // optional
}



export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}