import { defineStore } from 'pinia';
//pinia devuelve los datos
import { ref } from 'vue';
import autorizacionesService from '../services/autorizacionesService';

export const useSolicitudStore = defineStore(

  'autorizaciones',
  () => {
    const loading = ref(false);
    const solicitudes = ref([]);
    const currentPage = ref(1);
    const lastPage = ref(1);
    const total = ref(0);

    async function fetchSolicitudes(page = 1) {
      loading.value = true;
      try {
        const response =
        await autorizacionesService.getSolicitudes({
            page
        });
        solicitudes.value =
          response.data;
        currentPage.value = response.meta.current_page;
        lastPage.value = response.meta.last_page;
        total.value = response.meta.total;
      } finally {
        loading.value = false;
      }
    }
    async function cambiarEstado(id, estado_id) {
      const response = await autorizacionesService.cambiarEstado(
        id, estado_id
      );
      await fetchSolicitudes();
      return response;
    }

    async function noAutorizar(id, data) {
      const response = await autorizacionesService.noAutorizar(
        id, data
      );
      await fetchSolicitudes();
      return response;
    }

    return {
      loading,
      solicitudes,
      currentPage,
      lastPage,
      total,
      fetchSolicitudes,
      cambiarEstado,
      noAutorizar
    }
  }
);