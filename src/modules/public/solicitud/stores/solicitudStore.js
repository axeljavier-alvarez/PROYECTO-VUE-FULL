import { defineStore } from 'pinia';
import { ref } from 'vue';
import solicitudService from '../services/solicitudService';

export const useSolicitudStore = defineStore('solicitud', ()=> {
    const loading = ref(false);
    const form = ref({
        nombres: '',
        apellidos: '',
        email: '',
        telefono: '',
        cui: '',
        domicilio: '',
        observaciones: '',
        razon: ''
    });

    async function createSolicitud(){
        loading.value = true;
        try {
            const response = await solicitudService.create(form.value);
            return response;
        } finally {
            loading.value = false;
        }
    }

    return {
        form, 
        loading,
        createSolicitud
    }

});