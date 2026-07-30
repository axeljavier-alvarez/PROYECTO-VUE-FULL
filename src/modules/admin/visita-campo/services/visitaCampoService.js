import apiClient from '@/api/axiosConfig';
export default {
    async getSolicitudes(params = {}) {
        try {
            const response = await apiClient.get(
                '/solicitudesVisitas',
                { params }
            );
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.log(
                'Error en solicitudService:',
                error.response?.data || error.message
            );
            throw error;
        }
    },

    async guardarVisita(id, formData) {
        return apiClient.post(
            `/solicitudes/${id}/visita`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
    },
    async descargarFoto(id){
        try {
            const response = await apiClient.get(
                `/solicitudes/documentos/${id}/download`,
                {
                    responseType: 'blob'
                }
            );
            return response;
        } catch(error){
            console.log('Error al descargar la fotografía: ',
                error.response?.data || error.message
            );
            throw error;
        }
    }
}