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

      return {
        loading,
        solicitudes,
        fetchSolicitudes
      }
   }
);