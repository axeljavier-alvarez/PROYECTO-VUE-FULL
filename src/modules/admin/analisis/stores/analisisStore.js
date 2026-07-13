import { defineStore } from 'pinia';
import { ref } from 'vue';
import analisisService from '../services/analisisService';
export const useAnalisisStore = defineStore(
    'analisis',
    () => {
        // indicador de carga para peticiones backend
        const loading = ref(false);
        // listado reactivo de solicitudes obtenidas desde la API
        const solicitudes = ref([]);
        /* Consulta las solicitudes pendientes de análisis
        Flujo: 
        1. Activa indicador carga. 2.  Solicita la información al service
        3. Guarda las solicitudes en el estado reactivo
        4. Desactiva el indicador de carga
        */
        async function fetchSolicitudes(filters = {}) {
            loading.value = true;
            try {
                const response =
                    await analisisService.getSolicitudes(
                        filters
                    );

                solicitudes.value =
                    response.data.data ?? response.data ?? response;
            } finally {

                loading.value = false;

            }
        }
        /* Cambiar estado de solicitud 
        Flujo: 1.Envía el nuevo estado al backend
        2. recarga listado de solicitudes
        3. retorna la respuesta del servidor 
        */
        async function cambiarEstado(id, estado_id){
            const response = await analisisService.cambiarEstado(
                id, estado_id
            ); 
            await fetchSolicitudes(); 
            return response;
        }
        
        return {
            loading,
            solicitudes,
            fetchSolicitudes,
            cambiarEstado
        };
    }
);