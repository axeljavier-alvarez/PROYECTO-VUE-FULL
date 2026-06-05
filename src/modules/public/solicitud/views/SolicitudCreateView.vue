<script setup>
import { ref } from 'vue'
import { useSolicitudStore } from '../stores/solicitudStore'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

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
                <img
                    :src="iconoMunicipalidad"
                    class="mx-auto h-30 w-auto mb-4"
                >

                <CardTitle
                    class="text-3xl text-center font-bold text-[#032C8F]"
                >
                    Constancias de Residencia
                </CardTitle>
            </CardHeader>

            <CardContent>

                <form class="grid gap-6">

                    <div class="grid md:grid-cols-2 gap-4">

                        <div>
                            <Input
                                v-model="store.form.nombres"
                                placeholder="Nombres"
                            />

                            <p
                                v-if="store.errors?.nombres"
                                class="text-sm text-red-500 mt-1"
                            >
                                {{ store.errors.nombres[0] }}
                            </p>
                        </div>

                        <div>
                            <Input
                                v-model="store.form.apellidos"
                                placeholder="Apellidos"
                            />

                            <p
                                v-if="store.errors?.apellidos"
                                class="text-sm text-red-500 mt-1"
                            >
                                {{ store.errors.apellidos[0] }}
                            </p>
                        </div>

                    </div>

                    <div class="grid md:grid-cols-2 gap-4">

                        <div>
                            <Input
                                v-model="store.form.email"
                                type="email"
                                placeholder="Correo electrónico"
                            />

                            <p
                                v-if="store.errors?.email"
                                class="text-sm text-red-500 mt-1"
                            >
                                {{ store.errors.email[0] }}
                            </p>
                        </div>

                        <div>

                            <div class="relative">

                                <img
                                    :src="banderaGuatemala"
                                    alt="Guatemala"
                                    class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-auto z-10"
                                >

                                <Input
                                    v-model="store.form.telefono"
                                    placeholder="Teléfono"
                                    class="pl-12"
                                />

                            </div>

                            <p
                                v-if="store.errors?.telefono"
                                class="text-sm text-red-500 mt-1"
                            >
                                {{ store.errors.telefono[0] }}
                            </p>

                        </div>

                    </div>

                    <Input
                        v-model="store.form.cui"
                        placeholder="CUI"
                    />

                    <Textarea
                        v-model="store.form.domicilio"
                        placeholder="Domicilio"
                    />

                    <Textarea
                        v-model="store.form.razon"
                        placeholder="Razón de la solicitud"
                    />

                    <Textarea
                        v-model="store.form.observaciones"
                        placeholder="Ingrese las observaciones"
                    />

                    <Button
                        type="button"
                        @click="openConfirm = true"
                        :disabled="store.loading"
                    >
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

                    <AlertDialogCancel
                        @click="openConfirm = false"
                    >
                        No
                    </AlertDialogCancel>

                    <AlertDialogAction
                        @click="confirmarEnvio"
                    >
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

                        <span
                            class="font-bold text-[#032C8F]"
                        >
                            {{ numeroSolicitud }}
                        </span>
                    </DialogDescription>

                </DialogHeader>

                <div class="flex justify-end">

                    <Button
                        @click="openSuccess = false"
                    >
                        Aceptar
                    </Button>

                </div>

            </DialogContent>

        </Dialog>

    </div>
</template>