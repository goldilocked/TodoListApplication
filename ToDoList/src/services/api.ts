import axios from 'axios';

const getApiUrl = () => {
    // In test environment, use a mock URL
    if (import.meta.env.VITEST) {
        return 'http://test-api-url';
    }
    
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
        throw new Error('VITE_API_URL environment variable is not set');
    }
    return apiUrl;
};

const api = axios.create({
    baseURL: getApiUrl()
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
