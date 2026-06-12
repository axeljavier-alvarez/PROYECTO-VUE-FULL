import { defineStore } from 'pinia';
import { ref } from 'vue';
import solicitudService from '../services/solicitudService';
export const useSolicitudStore = defineStore('solicitud', ()=> {
    const loading = ref(false);
    const errors = ref({});
    const tramites = ref([]);
    const form = ref({
        nombres: '',
        apellidos: '',
        email: '',
        telefono: '',
        cui: '',
        domicilio: '',
        observaciones: '',
        razon: '',
        zona: '',
        tramite_id: ''
    });
    const archivos = ref({})
    async function fetchTramites(){
        try {
            const response = await solicitudService.getAll();
            // Si Laravel mandó la colección envuelta, se toma response.data, si no, la response directa
            tramites.value = response.data || response;
        } catch(error){
            console.error('Error al cargar trámites en el store:', error);
        }
    }
    async function createSolicitud(){
        loading.value = true;
        errors.value = {};
        try {
            const formData = new FormData();
            Object.keys(form.value).forEach(key => {
                const valor = form.value[key];
                if (valor !== '' && valor !== null && valor !== undefined) {
                    formData.append(key, valor);
                }
            });
            // meter archivos adjuntos en paso 2
            const mapeoArchivos = archivos.value;
            Object.keys(mapeoArchivos).forEach(campo => {
                const archivo = mapeoArchivos[campo];
                if(archivo instanceof File){
                    formData.append(campo, archivo); 
                }
            });
            
            return await solicitudService.create(formData)
        } catch(error) {

            if (error.response?.status === 422){
                errors.value = error.response.data.errors;
            }
            throw error
        } finally {
            loading.value = false;
        }
    }

    async function validarPaso(step){
        loading.value = true;
        errors.value = {}; // limpiar errores paso anterior
        try {
            // enviar campos de texto que tengan contenido real
            const formData = new FormData();
            formData.append('step', step)
            Object.keys(form.value).forEach(key => {
                const valor = form.value[key];
                if(valor !== '' && valor !== null && valor !== undefined){
                    formData.append(key, valor);
                }
            });
            // archivos asegurando que no se mezcle con cosas externas
            const mapeoArchivos = archivos.value;
            Object.keys(mapeoArchivos).forEach(campo => {
                const archivo = mapeoArchivos[campo];
                if(archivo instanceof File){
                    formData.append(campo, archivo);
                }
            });
            // unir numero paso con datos actuales form
            // const data = { step, ...form.value };
            await solicitudService.validarPaso(formData);
            return true;
        }catch(error){
            if(error.response?.status === 422){
                errors.value = error.response.data.errors;
            }
            return false;
        }finally {
            loading.value = false;
        }
    }

    return {
        form, 
        loading,
        createSolicitud,
        errors,
        tramites, 
        fetchTramites,
        validarPaso,
        archivos
    }
});