<script setup>
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import iconoMunicipalidad from '@/assets/images/icono_municipalidad.png'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ref } from 'vue';
import { useConsultaStore } from '../stores/consultaStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Check } from 'lucide-vue-next';
const consultaStore = useConsultaStore();
const cui = ref('');
const noSolicitud = ref('');
const mostrarModal = ref(false);
// mostrar errores
const errores = ref({});
const mensaje = ref('');
async function consultar() {
    errores.value = {};
    mensaje.value = '';
    try {
        const correcto = await consultaStore.consultar({
            cui: cui.value,
            no_solicitud: noSolicitud.value
        });
        if (correcto) {
            mostrarModal.value = true;
        }
    } catch (error) {
        if (error.response?.status === 422) {
            errores.value = error.response.data.errors;
        }
        if (error.response?.status === 404) {
            mensaje.value = error.response.data.message;
        }
    }
}
const limitarCui = () => {
    cui.value = cui.value
        .replace(/\D/g, '')
        .slice(0, 13);
}
const estados = [
    {
        id: 1,
        nombre: 'Pendiente'
    },
    {
        id: 2,
        nombre: 'Analisis'
    },
    {
        id: 5,
        nombre: 'Por autorizar'
    },
    {
        id: 6,
        nombre: 'Emitido'
    },
    {
        id: 7,
        nombre: 'Autorizado'
    }
];
function estadoCompletado(id){
    const estado = consultaStore.solicitud?.estado;
    if(!estado) return false;
    // Si está en visita asignada o visita realizada el progreso se queda en análisis
    if (
        estado.nombre === 'Visita asignada' ||
        estado.nombre === 'Visita realizada'
    ) {
        return id <= 2;
    }
    return estado.id >= id;
}
function mensajeVisita() {
    const nombre = consultaStore.solicitud?.estado?.nombre;

    switch (nombre) {
        case 'Visita asignada':
            return 'La visita de campo ha sido asignada.';

        case 'Visita realizada':
            return 'La visita de campo ha sido completada satisfactoriamente.';

        default:
            return null;
    }
}
</script>
<template>
    <div>
        <Card class="max-w-4xl mx-auto mt-5">
            <CardHeader>
                <img :src="iconoMunicipalidad" class="mx-auto h-30 w-auto mb-4">
                <CardTitle class="text-3xl text-center font-bold text-[#032C8F]">
                    Consulta de Estado
                </CardTitle>
            </CardHeader>
            <CardDescription class="mt-2 mx-6 rounded-md bg-[#FEF9C3] text-[#DD3426] text-base py-2 px-4
            text-center">
                Debe ingresar los datos exactos que colocó en su solicitud
            </CardDescription>
            <CardContent>
                <form class="grid gap-6" @submit.prevent>
                    <div class="grid gap-2">
                        <Label>
                            Número de dpi/cui
                        </Label>
                        <Input v-model="cui" @input="limitarCui" placeholder="0000 00000 0000" />
                        <p v-if="errores.cui" class="text-sm text-red-600">
                            {{ errores.cui[0] }}
                        </p>
                    </div>
                    <div class="grid gap-2">
                        <Label>
                            Número de solicitud
                        </Label>
                        <Input v-model="noSolicitud" placeholder="Ej: 1-2025" />
                        <p v-if="errores.no_solicitud" class="text-sm text-red-600">
                            {{ errores.no_solicitud[0] }}
                        </p>
                    </div>

                    <p
                    v-if="mensaje"
                    class="text-center text-red-600 font-medium">
                        {{ mensaje }}
                    </p>
                    <div class="grid md:grid-cols-2 gap-4">
                        <Button type="button" @click="consultar">
                            Consultar ahora
                        </Button>
                        <Button type="button">
                            Limpiar
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
        <Dialog v-model:open="mostrarModal">
            <DialogContent class="max-w-3xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle class="text-2xl text-[#032C8F]">
                        Detalles de Consulta
                    </DialogTitle>
                    <DialogDescription>
                        Información actualizada en tiempo real
                    </DialogDescription>
                </DialogHeader>
                <div v-if="consultaStore.solicitud" class="space-y-6">
                    <!-- SOLICITANTE -->
                    <div class="border rounded-lg p-4">
                        <h3 class="font-bold text-lg mb-2">
                            Solicitante
                        </h3>
                        <p>
                            {{ consultaStore.solicitud.nombres }}
                            {{ consultaStore.solicitud.apellidos }}
                        </p>
                    </div>                   
                    <!-- PROGRESO -->
                    <div class="border rounded-lg p-4">
                        <h3 class="font-bold text-lg mb-6">
                            Progreso de la solicitud
                        </h3>
                        <div class="flex flex-wrap justify-center gap-6">
                            <div 
                                v-for="(estado,index) in estados"
                                :key="estado.id"
                                class="flex flex-col items-center relative"
                            >
                            <!-- linea -->
                             <div 
                             v-if="index < estados.length -1"
                             class="hidden md:block absolute top-5 left-12 
                             w-14 h-1" 
                             :class="estadoCompletado(estados[index+1].id)
                             ? 'bg-green-500'
                             : 'bg-gray-200'">
                             </div>
                             <!-- circulo -->
                              <div
                              class="w-10 h-10 rounded-full flex items-center
                              justify-center z-10"
                              :class="estadoCompletado(estado.id)
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-500'
                              ">
                                <Check v-if="estadoCompletado(estado.id)" class="w-5 h-5"/>
                                <span v-else>
                                    {{ index + 1 }}
                                </span>
                             </div>
                             <span
                             class="text-xs mt-2 text-center"
                             :class="
                             estadoCompletado(estado.id)
                             ? 'text-green-600 font-semibold'
                             : 'text-gray-500'
                             ">
                             {{ estado.nombre }}
                             </span>
                            </div>
                        </div>
                    </div>
                    <div class="bg-green-50 border border-green-200
                    rounded-lg p-4">
                        <p>
                            Estado actual de su solicitud:
                            <strong>
                                {{ consultaStore.solicitud.estado.nombre }}
                            </strong>
                        </p>
                    </div>
                    <div
                    v-if="mensajeVisita()"
                    class="mt-4 rounded-lg border border-blue-200
                    bg-blue-50 p-4"
                    >
                    <p class="font-semibold text-blue-800">
                        {{ consultaStore.solicitud.estado.nombre }}
                    </p>
                    <p class="text-sm text-blue-700 mt-1">
                        {{ mensajeVisita() }}
                    </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>