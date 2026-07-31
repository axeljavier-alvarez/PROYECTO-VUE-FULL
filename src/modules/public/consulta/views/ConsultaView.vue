<script setup>
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import iconoMunicipalidad from '@/assets/images/icono_municipalidad.png'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ref } from 'vue';
import { useConsultaStore } from '../stores/consultaStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
            <DialogContent class="max-w-3xl">
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
                    <!-- ESTADO ACTUAL -->
                    <div class="border rounded-lg p-4">
                        <h3 class="font-bold text-lg mb-2">
                            Estado Actual
                        </h3>
                        <span class="px-3 py-1 rounded bg-blue-100
                        text-blue-800">
                            {{ consultaStore.solicitud.estado.nombre }}
                        </span>
                    </div>
                    <!-- PROGRESO -->
                    <div class="border rounded-lg p-4">
                        <h3 class="font-bold text-lg mb-4">
                            Progreso de la solicitud
                        </h3>
                        <div class="flex justify-between items-center">

                            <div class="text-center">
                                <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    1
                                </div>
                                <span class="text-sm">
                                    Pendiente
                                </span>
                            </div>
                            <div class="text-center">
                                <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    2
                                </div>
                                <span class="text-sm">
                                    Análisis
                                </span>
                            </div>
                            <div class="text-center">
                                <div
                                    class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                    {{ consultaStore.solicitud.estado_id }}
                                </div>

                                <span class="text-sm">
                                    Actual
                                </span>
                            </div>
                            <div class="text-center">
                                <div class="w-10 h-10 rounded-full bg-gray-200
                                flex items-center justify-center">
                                    5
                                </div>
                                <span class="text-sm">
                                    Autorizado
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="bg-green-50 border border-green-200
                    rounded-lg p-4">
                        <p>
                            La solicitud se encuentra actualmente en:
                            <strong>
                                {{ consultaStore.solicitud.estado.nombre }}
                            </strong>
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>