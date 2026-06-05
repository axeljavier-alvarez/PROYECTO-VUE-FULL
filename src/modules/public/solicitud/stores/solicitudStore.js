import { defineStore } from 'pinia';
import { ref } from 'vue';
import solicitudService from '../services/solicitudService';

export const useSolicitudStore = defineStore('solicitud', ()=> {
    const loading = ref(false);
    const errors = ref({})
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
        errors.value = {}
        try {
            return await solicitudService.create(form.value)
        } catch(error) {

            if (error.response?.status === 422){
                errors.value = error.response.data.errors;
            }
            throw error
        } finally {
            loading.value = false;
        }
    }

    return {
        form, 
        loading,
        createSolicitud,
        errors
    }

});