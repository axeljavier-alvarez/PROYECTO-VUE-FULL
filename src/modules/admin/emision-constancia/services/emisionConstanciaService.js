import apiClient from '@/api/axiosConfig';

export default {
    async getSolicitudes(params = {}){
        try {
            const response = await apiClient.get(
                '/solicitudesPorAutorizar',
                {
                    params
                }
            );
                    
            console.log(response.data)
            return response.data;
        } catch(error) {
            console.log('Error al SolicitudService: ',
                error.response?.data || error.message
            );
            throw error;
        }
    },

    async emitirConstancia(id) {
        return await apiClient.get(`/solicitudes/${id}/pdf`, {
            responseType: 'blob'
        });
    }
    
}