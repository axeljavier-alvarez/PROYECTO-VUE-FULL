import { defineStore } from 'pinia';
import { ref } from 'vue';
import solicitudService from '../services/solicitudService';
export const useSolicitudStore = defineStore('solicitud', () => {
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
        tramite_id: '',
        tiene_dependientes: '',
        tipo_persona_penal: '',
        dependientes: [
            {
                nombres: '',
                apellidos: '',
                archivo: null
            }
        ]
    });
    const archivos = ref({});
    function agregarDependiente() {
        if (form.value.dependientes.length >= 4) return;
        form.value.dependientes.push({
            nombres: '',
            apellidos: '',
            archivo: null
        });
    }
    function eliminarDependiente(index) {
        if (form.value.dependientes.length === 1) return;
        form.value.dependientes.splice(index, 1);
    }
    function cambiarTramite(nuevoTramiteId){
        form.value.tramite_id = nuevoTramiteId;
        form.value.razon = '';
        form.value.tiene_dependientes = '';
        form.value.tipo_persona_penal = '';
        form.value.dependientes = [
            {
                nombres: '',
                apellidos: '',
                archivo: null
            }
        ];
        
    }
    async function fetchTramites() {
        try {
            const response = await solicitudService.getAll();
            // Si Laravel mandó la colección envuelta, se toma response.data, si no, la response directa
            tramites.value = response.data || response;
        } catch (error) {
            console.error('Error al cargar trámites en el store:', error);
        }
    }
    async function createSolicitud() {
        loading.value = true;
        errors.value = {};
        try {
            const formData = new FormData();
            Object.keys(form.value).forEach(key => {
                const valor = form.value[key];
                if (key === 'dependientes' &&
                    form.value.tiene_dependientes !== '1') {
                    return;
                }
                // Si es un array (dependientes)
                if (Array.isArray(valor)) {

                    valor.forEach((item, index) => {

                        Object.keys(item).forEach(campo => {

                            const valorCampo = item[campo];

                            if (valorCampo instanceof File) {

                                formData.append(
                                    `${key}[${index}][${campo}]`,
                                    valorCampo
                                );

                            } else {

                                formData.append(
                                    `${key}[${index}][${campo}]`,
                                    valorCampo
                                );

                            }

                        });

                    });
                } else {
                    if (valor !== '' && valor !== null && valor !== undefined) {

                        formData.append(key, valor);
                    }

                }

            });


            // Archivos
            const mapeoArchivos = archivos.value;

            Object.keys(mapeoArchivos).forEach(campo => {

                const archivo = mapeoArchivos[campo];

                if (archivo instanceof File) {

                    formData.append(campo, archivo);

                }

            });


            return await solicitudService.create(formData);

        } catch (error) {

            if (error.response?.status === 422) {

                errors.value = error.response.data.errors;

            }

            throw error;

        } finally {

            loading.value = false;

        }
    }

    async function validarPaso(step) {
        loading.value = true;
        errors.value = {}; // limpiar errores paso anterior
        try {
            // enviar campos de texto que tengan contenido real
            const formData = new FormData();
            formData.append('step', step)
            Object.keys(form.value).forEach(key => {
                const valor = form.value[key];
                // enviar el arreglo dependientes solo cuando selecciona 1
                if (key === 'dependientes' &&
                    form.value.tiene_dependientes !== '1') {
                    return;
                }
                if (Array.isArray(valor)) {
                    valor.forEach((item, index) => {
                        Object.keys(item).forEach(campo => {
                            const valorCampo = item[campo];
                            if (valorCampo instanceof File) {
                                formData.append(
                                    `${key}[${index}][${campo}]`,
                                    valorCampo
                                );
                            } else {
                                formData.append(
                                    `${key}[${index}][${campo}]`,
                                    valorCampo
                                );
                            }
                        });
                    });
                } else {
                    if (valor !== '' && valor !== null && valor !== undefined) {
                        formData.append(key, valor);
                    }
                }
            });
            // archivos asegurando que no se mezcle con cosas externas
            const mapeoArchivos = archivos.value;
            Object.keys(mapeoArchivos).forEach(campo => {
                const archivo = mapeoArchivos[campo];
                if (archivo instanceof File) {
                    formData.append(campo, archivo);
                }
            });
            // unir numero paso con datos actuales form
            // const data = { step, ...form.value };
            await solicitudService.validarPaso(formData);
            return true;
        } catch (error) {
            if (error.response?.status === 422) {
                errors.value = error.response.data.errors;
            }
            return false;
        } finally {
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
        archivos,
        agregarDependiente,
        eliminarDependiente
    }
});