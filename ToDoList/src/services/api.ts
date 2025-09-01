import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000'
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
    }
};
