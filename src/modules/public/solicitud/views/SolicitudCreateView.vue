<script setup>
import { ref } from 'vue'
import { useSolicitudStore } from '../stores/solicitudStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

import iconoMunicipalidad from '@/assets/images/icono_municipalidad.png'
import banderaGuatemala from '@/assets/images/guatemala_flag.png'

const store = useSolicitudStore()

const openConfirm = ref(false)
const openSuccess = ref(false)
const numeroSolicitud = ref('')

const confirmarEnvio = async () => {
    try {

        const response = await store.createSolicitud()

        numeroSolicitud.value = response.data.no_solicitud

        openConfirm.value = false
        openSuccess.value = true

        // Limpiar formulario
        store.form.nombres = ''
        store.form.apellidos = ''
        store.form.email = ''
        store.form.telefono = ''
        store.form.cui = ''
        store.form.domicilio = ''
        store.form.razon = ''
        store.form.observaciones = ''

    } catch (error) {
        console.error(error)
    }
}
</script>
<template>
    <div class="container max-w-4xl mx-auto py-10 px-4">
        <Card>
            <CardHeader>
                <img :src="iconoMunicipalidad" class="mx-auto h-30 w-auto mb-4">
                <CardTitle class="text-3xl text-center font-bold text-[#032C8F]">
                    Constancia de Residencia
                </CardTitle>
                <CardDescription class="text-center text-base mt-2">
                    Complete la información requerida para registrar su solicitud
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form class="grid gap-6">
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="grid gap-2">
                            <Label for="nombres" class="font-semibold text-gray-700">
                                Nombres
                            </Label>
                            <Input v-model="store.form.nombres" placeholder="Ingrese sus nombres" />
                            <p v-if="store.errors?.nombres" class="text-sm text-red-500 mt-1">
                                {{ store.errors.nombres[0] }}
                            </p>
                        </div>
                        <div class="grid gap-2">
                            <Label for="nombres" class="font-semibold text-gray-700">
                                Apellidos
                            </Label>
                            <Input v-model="store.form.apellidos" placeholder="Ingrese sus apellidos" />

                            <p v-if="store.errors?.apellidos" class="text-sm text-red-500 mt-1">
                                {{ store.errors.apellidos[0] }}
                            </p>
                        </div>
                    </div>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="grid gap-2">
                            <Label for="email" class="font-semibold text-gray-700">
                                Email
                            </Label>
                            <Input v-model="store.form.email" type="email" placeholder="Ingrese su email" />
                            <p v-if="store.errors?.email" class="text-sm text-red-500 mt-1">
                                {{ store.errors.email[0] }}
                            </p>
                        </div>

                        <div class="grid gap-2">
                            <Label for="telefono" class="font-semibold text-gray-700">
                                Télefono
                            </Label>
                            <div class="relative">
                                <img :src="banderaGuatemala" alt="Guatemala"
                                    class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-auto z-10">
                                <Input v-model="store.form.telefono" placeholder="Ingrese su número" class="pl-12" />
                            </div>
                            <p v-if="store.errors?.telefono" class="text-sm text-red-500 mt-1">
                                {{ store.errors.telefono[0] }}
                            </p>
                        </div>
                    </div>
                    <div class="grid gap-2">
                        <Label>
                            DPI
                        </Label>
                        <Input v-model="store.form.cui" placeholder="Ingrese su dpi" />
                    </div>
                    <div class="grid gap-2">
                        <Label>
                            Domicilio
                        </Label>
                    <Textarea v-model="store.form.domicilio" placeholder="Ingrese la dirección de su domicilio" />
                    </div>
                    <div class="grid gap-2">
                        <Label>
                            Razón
                        </Label>
                    <Textarea v-model="store.form.razon" placeholder="Razón de la solicitud" />
                    </div>
                    <div class="grid gap-2">
                        <Label>
                            Observaciones
                        </Label>
                    <Textarea v-model="store.form.observaciones" placeholder="Ingrese las observaciones" />
                    </div>
                    <Button type="button" @click="openConfirm = true" :disabled="store.loading">
                        {{
                            store.loading
                                ? 'Enviando...'
                                : 'Enviar Solicitud'
                        }}
                    </Button>
                </form>
            </CardContent>
        </Card>
        <!-- Confirmación -->
        <AlertDialog :open="openConfirm">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Confirmar envío
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Está seguro que desea enviar esta solicitud?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel @click="openConfirm = false">
                        No
                    </AlertDialogCancel>
                    <AlertDialogAction @click="confirmarEnvio">
                        Sí
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        <!-- Éxito -->
        <Dialog :open="openSuccess">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Solicitud enviada correctamente
                    </DialogTitle>
                    <DialogDescription>
                        Su número de solicitud es:
                        <span class="font-bold text-[#032C8F]">
                            {{ numeroSolicitud }}
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <div class="flex justify-end">
                    <Button @click="openSuccess = false">
                        Aceptar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>