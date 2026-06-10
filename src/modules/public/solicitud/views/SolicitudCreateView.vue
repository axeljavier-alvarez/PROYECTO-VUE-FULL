<script setup>
import { ref, onMounted } from 'vue'
import { useSolicitudStore } from '../stores/solicitudStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
// nuevo paso
const currentStep = ref(1)
// DISPARAMOS EL LLAMADO A LA API AL MONTAR EL COMPONENTE
onMounted(async () => {
    await store.fetchTramites()
})
const openConfirm = ref(false)
const openSuccess = ref(false)
const numeroSolicitud = ref('')
const zonasGuate = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 24, 25
]
const irAlSiguientePaso = async () => {
    const pasoValido = await store.validarPaso(currentStep.value)
    if (pasoValido) {
        currentStep.value++
    }
}
const regresarPaso = () => {
    if (currentStep.value > 1) {
        store.errors = {}
        currentStep.value--
    }
}
const confirmarEnvio = async () => {
    openConfirm.value = false
    try {
        const response = await store.createSolicitud()
        numeroSolicitud.value = response.data.no_solicitud
        // openConfirm.value = false
        openSuccess.value = true

        currentStep.value = 1
        // Limpiar formulario
        store.form.nombres = ''
        store.form.apellidos = ''
        store.form.email = ''
        store.form.telefono = ''
        store.form.cui = ''
        store.form.domicilio = ''
        store.form.razon = ''
        store.form.zona = ''
        store.form.tramite_id = ''
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
                <div class="flex justify-between items-center mb-6 max-w-xs mx-auto">
                    <span v-for="step in 3" :key="step" :class="[
                        'h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors duration-200',
                        currentStep === step ? 'bg-[#032C8F] text-white border-[#032C8F]' : currentStep > step ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-400 border-gray-200'
                    ]">
                        {{ step }}
                    </span>
                </div>

                <CardTitle class="text-3xl text-center font-bold text-[#032C8F]">
                    Constancia de Residencia
                </CardTitle>
                <CardDescription class="text-center text-base mt-2">
                    Paso {{ currentStep }} de 3:
                    <span v-if="currentStep === 1" class="font-medium">Datos Personales</span>
                    <span v-if="currentStep === 2" class="font-medium">Detalles de la Solicitud</span>
                    <span v-if="currentStep === 3" class="font-medium">Notas finales</span>
                </CardDescription>
                <CardDescription class="text-center text-base mt-2">
                    Complete la información requerida para registrar su solicitud
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form class="grid gap-6" @submit.prevent>
                    <!-- VALIDACION PASO 1 -->
                    <div v-if="currentStep === 1" class="grid gap-6">

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
                                <Label for="apellidos" class="font-semibold text-gray-700">
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
                                    <Input v-model="store.form.telefono" placeholder="Ingrese su número"
                                        class="pl-12" />
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
                            <p v-if="store.errors?.cui" class="text-sm text-red-500 mt-1">
                                {{ store.errors.cui[0] }}
                            </p>
                        </div>
                        <div class="grid gap-2">
                            <Label>
                                Domicilio
                            </Label>
                            <Textarea v-model="store.form.domicilio"
                                placeholder="Ingrese la dirección de su domicilio" />
                            <p v-if="store.errors?.domicilio" class="text-sm text-red-500 mt-1">
                                {{ store.errors.domicilio[0] }}
                            </p>
                        </div>


                        <div class="grid gap-2">
                            <Label for="zona" class="font-semibold text-gray-700">
                                Zona
                            </Label>
                            <Select v-model="store.form.zona">
                                <SelectTrigger class="w-full">
                                    <SelectValue placeholder="Seleccione una zona" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem v-for="z in zonasGuate" :key="z" :value="String(z)">
                                            {{ z }}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <p v-if="store.errors?.zona" class="text-sm text-red-500 mt-1">
                                {{ store.errors.zona[0] }}
                            </p>
                        </div>

                    </div>
                    <!-- VALIDACION PASO 2 -->
                    <div v-if="currentStep === 2" class="grid gap-6">
                        <div class="grid md:grid-cols-2 gap-4">
                            <div class="grid gap-2">
                                <Label>
                                    Razón
                                </Label>
                                <Textarea v-model="store.form.razon" placeholder="Razón de la solicitud" />
                                <p v-if="store.errors?.razon" class="text-sm text-red-500 mt-1">
                                    {{ store.errors.razon[0] }}
                                </p>
                            </div>
                            <div class="grid gap-2">
                                <Label for="tramite_id" class="font-semibold text-gray-700">
                                    Tipo de Trámite
                                </Label>
                                <Select v-model="store.form.tramite_id">
                                    <SelectTrigger class="w-full">
                                        <SelectValue placeholder="Seleccione el trámite" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem v-for="tramite in store.tramites" :key="tramite.id"
                                                :value="String(tramite.id)">
                                                {{ tramite.nombre }}
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <p v-if="store.errors?.tramite_id" class="text-sm text-red-500 mt-1">
                                    {{ store.errors.tramite_id[0] }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div v-if="currentStep === 3" class="grid gap-6">
                        <div class="grid gap-2">
                            <Label>
                                Observaciones
                            </Label>
                            <Textarea v-model="store.form.observaciones" placeholder="Ingrese las observaciones" />
                        </div>
                    </div>

                    <div class="flex justify-between items-center mt-4 pt-4 border-t">
                        <Button type="button" variant="outline" @click="regresarPaso" :disabled="currentStep === 1 || store.loading">
                            Anterior
                        </Button>
                        <Button v-if="currentStep < 3" type="button" @click="irAlSiguientePaso" :disabled="store.loading" class="bg-[#032C8F] hover:bg-[#021F66]">
                            {{ store.loading ? 'Validando...' : 'Siguiente' }}
                        </Button>
                        <Button v-else type="button" @click="openConfirm = true" :disabled="store.loading" class="bg-green-600 hover:bg-green-700">
                            Enviar Solicitud
                        </Button>
                    </div>
                    <!-- botones del formulario para navegar -->


                    <!-- <Button type="button" @click="openConfirm = true" :disabled="store.loading">
                        {{
                            store.loading
                                ? 'Enviando...'
                                : 'Enviar Solicitud'
                        }}
                    </Button> -->
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