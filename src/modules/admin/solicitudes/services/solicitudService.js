import apiClient from '@/api/axiosConfig';

export default {

    /**
     * Obtiene el listado de solicitudes desde la API.
     *
     * @param {Object} params
     * Parámetros opcionales para filtros, búsqueda o paginación.
     *
     * @returns {Promise<Object>}
     * Respuesta de la API.
     */
    async getSolicitudes(params = {}) {

        try {

            const response = await apiClient.get(
                '/solicitudesDashboard',
                {
                    params
                }
            );

            return response.data;

        } catch (error) {

            console.error(
                'Error en solicitudService:',
                error.response?.data || error.message
            );

            throw error;
        }
    }
}