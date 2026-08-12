import apiClient from '@/api/axiosConfig';
export default {
    async getAll(){
        try {
            const response = await apiClient.get('/tramites');
            return response.data;
        } catch(error){
            console.error('Error en tramiteService:', error.response?.data || error.message);
            throw error;
        }
    },
    async create(data){
        try {
            // const response = await apiClient.post('/solicitudes', data);
            const response = await apiClient.post('/solicitudes', data, {
                headers: {
                     'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch(error) {
            console.log("Errores del Backend al Guardar:", error.response?.data);
            throw error;
        }
    },

    async getById(id) {
        const response = await apiClient.get(`/solicitudes/${id}`);
        return response.data;
    },

    async validarPaso(data){
        try {
            const response = await apiClient.post(
                '/solicitudes/validar-paso',
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data;
        } catch(error){
            console.error('Error en validarPaso:', error.response?.data || error.message)
            throw error;
        }
    }
}