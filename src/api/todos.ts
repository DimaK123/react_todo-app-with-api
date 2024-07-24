import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 9925;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const patchTodo = (id: number, data: Partial<Todo>) => {
  return client.patch(`/todos/${id}`, data);
};

// Add more methods here