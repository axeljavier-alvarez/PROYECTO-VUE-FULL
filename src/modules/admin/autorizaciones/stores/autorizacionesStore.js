import { defineStore } from 'pinia';
//pinia devuelve los datos
import { ref } from 'vue';
import autorizacionesService from '../services/autorizacionesService';

export const useSolicitudStore = defineStore(

   'autorizaciones',
   () => {
      const loading = ref(false);
      const solicitudes = ref([]);
      async function fetchSolicitudes(filters = {}){
        loading.value = true;
        try {
            const response =
            await autorizacionesService.getSolicitudes(
                filters
            );
            solicitudes.value =
                    response.data || response;
        } finally {
            loading.value = false;
        }
      }
      async function cambiarEstado(id, estado_id){
        const response = await autorizacionesService.cambiarEstado(
          id, estado_id
        );
        await fetchSolicitudes();
        return response;
      }
      
      async function noAutorizar(id, data){
        const response = await autorizacionesService.noAutorizar(
          id, data
        );
        await fetchSolicitudes();
        return response;
      }
      
      return {
        loading,
        solicitudes,
        fetchSolicitudes,
        cambiarEstado,
        noAutorizar
      }
   }
);