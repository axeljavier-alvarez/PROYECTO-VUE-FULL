
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
    },
    async cambiarEstado(id, estado_id) {
        try {
            const response = await apiClient.post(
                `/solicitudes/${id}/cambiar-estado`,
                {
                    estado_id
                }
            );
            return response.data;
        } catch (error) {
            console.log(
                'Error al cambiar estado: ',
                error.response?.data || error.message
            );
            throw error;
        }
    },
    async noAutorizar(id, data) {
        try {
             const response = await apiClient.put(
                `/solicitudes/${id}/rechazar`,
                data
             );
            return response.data;
        } catch (error) {
            console.log(
                'Error al no autorizar la solicitud: ',
                error.response?.data || error.message
            );
            throw error;
        }
    }
}