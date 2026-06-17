
import apiClient from '@/api/axiosConfig';
export default {
    async getEstadosDashboard(){
        try {
            const response = await apiClient.get('/estadosDashboard');
            // ver respuesta de la api
            // console.log(response.data)
            return response.data;
        } catch(error){
            console.error('Error en dashboardService: ',
                error.response?.data || error.message
            );
            throw error;
        }
    },

    async getTramitesDashboard(){
        try {
            const response = await apiClient.get('/tramitesDashboard');
            // console.log(response.data);        
            return response.data;
        } catch(error){
            console.error(
                "Error en tramiteDashboardService: ",
                error.response?.data || error.message
            );
            throw error;
        }
    }
}