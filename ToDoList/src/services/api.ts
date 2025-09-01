import axios from 'axios';

if (!import.meta.env.VITE_API_URL) {
    throw new Error('VITE_API_URL environment variable is not set');
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export const TodoService = {
    async getAllTodos() {
        const response = await api.get('/todos');
        return response.data;
    },

    async createTodo(todo: { name: string; description: string; status: string }) {
        const response = await api.post('/todos', todo);
        return response.data;
    },

    async deleteTodo(id: string) {
        const response = await api.delete(`/todos/${id}`);
        return response.data;
    },

    async updateTodo(id: string, todo: { name: string; description: string; status: string }) {
        const response = await api.put(`/todos/${id}`, todo);
        return response.data;
    }
};
