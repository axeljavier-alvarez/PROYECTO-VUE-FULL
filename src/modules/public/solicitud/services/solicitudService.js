import apiClient from '@/api/axiosConfig';

export default {
    async create(data){
        try {
            const response = await apiClient.post('/solicitudes', data);
            return response.data;
        } catch(error) {
            console.log(error.response.data);
            throw error;
        }
    },

    async getById(id) {
        const response = await apiClient.get(`/solicitudes/${id}`);
        return response.data;
    }
}