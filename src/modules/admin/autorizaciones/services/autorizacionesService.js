
import apiClient from '@/api/axiosConfig';

export default {
    async getSolicitudes(params = {}) {
        try {
            const response = await apiClient.get(
                '/solicitudesAutorizadas',
                {
                    params
                }
            );
            console.log(response.data)
            return response.data
        } catch (error) {
            console.log('Error al SolicitudService: ',
                error.response?.data || error.message
            );
            throw error;
        }
    }
}