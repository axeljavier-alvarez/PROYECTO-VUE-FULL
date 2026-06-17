import { defineStore } from 'pinia';
//pinia devuelve los datos
import { ref } from 'vue';
import dashboardService from '../services/dashboardService';

export const useDashboardStore = defineStore(

    'dashboard', () => {
        const loading = ref(false);
        const estados = ref([]);
        const tramites = ref([]);
        async function fetchEstadosDashboard(){
           const response =
                await dashboardService.getEstadosDashboard();
                // console.log(response)
            estados.value =
            response.data || response;
        }
        async function fetchTramitesDashboard(){
            const response =
            await dashboardService.getTramitesDashboard();
            // console.log(response)
            tramites.value =
                response.data || response;
        }

        return {
            loading, 
            estados, 
            fetchEstadosDashboard,
            fetchTramitesDashboard,
            tramites
        };

    }
    
        

    
   
);