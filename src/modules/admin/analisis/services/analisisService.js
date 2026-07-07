import apiClient from '@/api/axiosConfig';
export default {
    async getSolicitudes(params = {}) {
        try {
            const response = await apiClient.get(
                '/solicitudesAnalisis',
                {
                    params
                }
            );
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.log(
                'Error en solicitudService:',
                error.response?.data || error.message
            )
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
            )
            throw error;
        }
    }
}