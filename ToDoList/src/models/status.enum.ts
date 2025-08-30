export const ToDoStatus = {
  Created: "Created",
  InProgress: "InProgress",
  Completed: "Completed"
} as const;

export type ToDoStatus = typeof ToDoStatus[keyof typeof ToDoStatus];

// implemented as an object literal to allow calling ToDoStatus.Created, etc.