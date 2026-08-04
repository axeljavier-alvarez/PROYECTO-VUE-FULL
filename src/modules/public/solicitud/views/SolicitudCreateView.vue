<script setup>
import { ref, onMounted, computed, watch } from 'vue'
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
const tituloRazon = computed(() => {
    switch (store.form.tramite_id) {
        case '1':
            return 'Título'
        case '2':
            return 'Razón'
        default:
            return 'Razón'
    }
})
const placeholderRazon = computed(() => {
    switch (store.form.tramite_id) {
        case '1':
            return 'Licenciatura en Administración'
        default:
            return 'Solicitud de actualización de datos'
    }
})
const store = useSolicitudStore();
const guardarArchivo = (event, requisitoId) => {
    const archivo = event.target.files[0]
    console.log('archivo seleccionado', archivo)
    store.archivos[`requisito_${requisitoId}`] = archivo
    console.log('store.archivos', store.archivos)

}
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
    if (await store.validarPaso(currentStep.value)) {
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
        // Limpiar campos, reset automatico
        Object.keys(store.form).forEach(key => store.form[key] = '')
    } catch (error) {
        console.error(error)
    }
}
// computed que obtiene automaticamente el tramite seleccionado
// cada vez que cambia store.form.tramite_id
const tramiteSeleccionado = computed(() => {
    // busca adentro del arreglo store.tramites
    // el trámite cuyo id coincida con el seleccionado en el formulario
    return store.tramites.find(
        tramite => String(tramite.id) === String(store.form.tramite_id)
    )
})
// observa cambios en tramite_id
watch(
    // propiedad que se va a observar
    () => store.form.tramite_id,
    // se ejecuta cada vez que cambia el trámite seleccionado
    (nuevoValor) => {
        // busca trámite completo dentro del arreglo
        const tramite = store.tramites.find(
            t => String(t.id) === String(nuevoValor)
        )
        // muestra consola objeto completo de tramite
        console.log('Tramite seleccionado: ', tramite)
        // muestra arreglo de requisitos asociados
        console.log('Requisitos: ', tramite?.requisitos)
    }
)
</script>
<template>
    <div>
        <Card class="max-w-4xl mx-auto mt-5">
            <CardHeader>
                <img :src="iconoMunicipalidad" class="mx-auto h-30 w-auto mb-4">

                <CardTitle class="text-3xl text-center font-bold text-[#032C8F]">
                    Constancia de Residencia
                </CardTitle>
                <CardDescription class="text-center text-base mt-2">
                    Complete la información requerida para registrar su solicitud
                </CardDescription>
                <div class="flex justify-center gap-3 mt-2 items-center mx-auto"> <span v-for="step in 3" :key="step"
                        :class="[
                            'h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors duration-200',
                            currentStep === step ? 'bg-[#83BD3F] text-white border-[#FFFFFF]' : currentStep > step ? 'bg-white text-gray-400 border-gray-200' : 'bg-white text-gray-400 border-gray-200'
                        ]">
                        {{ step }}
                    </span>
                </div>
                <!-- <CardDescription class="text-center text-base mt-2">
                    Paso {{ currentStep }} de 3:
                    <span v-if="currentStep === 1" class="font-medium">Datos Personales</span>
                    <span v-if="currentStep === 2" class="font-medium">Detalles de la Solicitud</span>
                    <span v-if="currentStep === 3" class="font-medium">Notas finales</span>
                </CardDescription> -->
            </CardHeader>
            <CardDescription v-if="currentStep === 1"
                class="mx-6 rounded-md bg-[#FEF9C3] text-[#DD3426] text-base py-2 px-4 text-center">
                Ingrese los nombres y apellidos tal como aparecen en el DPI
            </CardDescription>
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
                        <div>
                            <div class="grid gap-2">
                                <Label for="tramite_id" class="font-semibold text-gray-700">
                                    Tipo de Trámite
                                </Label>
                                <Select v-model="store.form.tramite_id" @update:model-value="store.form.razon = ''">
                                    <SelectTrigger class="w-full overflow-hidden">
                                        <SelectValue placeholder="Seleccione un trámite" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="0">
                                                Seleccione un trámite
                                            </SelectItem>
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
                            <div v-if="store.form.tramite_id && store.form.tramite_id !== '0'" class="grid gap-2 mt-4">
                                <Label>
                                    {{ tituloRazon }}
                                </Label>

                                <Textarea v-model="store.form.razon" :placeholder="placeholderRazon" />
                                <p v-if="store.errors?.razon" class="text-sm text-red-500 mt-1">
                                    {{ store.errors.razon[0] }}
                                </p>
                            </div>
                            <div v-if="store.form.tramite_id && store.form.tramite_id !== '0'">
                                <Label class="mt-5 mb-2 flex justify-center text-2xl font-bold text-[#0D057F]">
                                    REQUISITOS
                                </Label>
                                <CardDescription v-if="currentStep === 1"
                                    class="mx-6 rounded-md bg-[#EFF6FF] text-[#030EA7] text-base py-2 px-4 text-center">
                                    Recuerde que puede subir únicamente documentos PDF o JPG
                                </CardDescription>
                                <!-- Se muestra cuando existe trámite seleccionado y el trámite tiene un requisito -->
                                <div
                                v-if="tramiteSeleccionado?.requisitos?.length"
                                class="mt-4 space-y-2">
                                <!-- Recorre arreglo de requisito de trámite seleccionado y genera bloque por cada requisito -->
                                <div
                                v-for="requisito in tramiteSeleccionado.requisitos.filter(r => r.nombre.toLowerCase() !== 'cargas familiares')"                                
                                :key="requisito.id"
                                class="p-3 border rounded-md bg-gray-50">
                                    <Label>
                                        {{ requisito.nombre }}
                                        <span v-if="requisito.id === 1"
                                        class="font-bold">
                                        (opcional)
                                        </span>
                                    </Label>
                                    <!-- nombre de requisito -->
                                    <Input 
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    @change="guardarArchivo($event, requisito.id)"/>
                                    <p
                                    v-if="store.errors?.[`requisito_${requisito.id}`]"
                                    class="text-sm text-red-500 mt-1">
                                    {{ store.errors[`requisito_${requisito.id}`][0] }}
                                    </p>
                                </div>
                                <!-- CARGAS FAMILIARES -->
                                    <div v-for="requisito in
                                    tramiteSeleccionado.requisitos.filter(r =>
                                        r.nombre.toLowerCase() === 'cargas familiares'
                                    )"
                                    :key="requisito.id"
                                        class="p-3 border rounded-md bg-gray-50"
                                    >
                                        <Label>
                                            {{ requisito.nombre }}
                                        </Label>
                                        <Label class="mt-3">
                                            ¿Tiene dependientes?
                                        </Label>                                
                                        <Select v-model="store.form.tiene_dependientes">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione una opción"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="1">Sí</SelectItem>
                                                    <SelectItem value="0">No</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <p
                                            v-if="store.errors?.tiene_dependientes"
                                            class="text-sm text-red-500 mt-1"
                                        >
                                            {{ store.errors.tiene_dependientes[0] }}
                                        </p>
                                    </div>
                                    <!-- DATOS DEL DEPENDIENTE -->
                                    <div
                                    v-if="store.form.tiene_dependientes === '1'"
                                    class="mt-4 space-y-3">
                                        <label>
                                            Datos del dependiente
                                        </label>
                                        <Input 
                                        v-model="store.form.dependientes[0].nombres"
                                        placeholder="Nombres" />
                                        <p
                                        v-if="store.errors?.['dependientes.0.nombres']"
                                        class="text-sm text-red-500 mt-1"
                                        >
                                            {{ store.errors[`dependientes.0.nombres`][0] }}
                                        </p>
                                        <Input 
                                        v-model="store.form.dependientes[0].apellidos"
                                        placeholder="Apellidos" />   
             
                                        <p
                                        v-if="store.errors?.['dependientes.0.apellidos']"
                                        class="text-sm text-red-500 mt-1"
                                        >
                                            {{ store.errors[`dependientes.0.apellidos`][0] }}
                                        </p>

                                    </div>
                                </div>
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
                        <Button type="button" variant="outline" @click="regresarPaso"
                            :disabled="currentStep === 1 || store.loading">
                            Anterior
                        </Button>
                        <Button v-if="currentStep < 3" type="button" @click="irAlSiguientePaso"
                            :disabled="store.loading" class="bg-[#000000] hover:bg-[#252525]">
                            {{ store.loading ? 'Validando...' : 'Siguiente' }}
                        </Button>
                        <Button v-else type="button" @click="openConfirm = true" :disabled="store.loading"
                            class="bg-[#000000] hover:bg-[#252525]">
                            Enviar Solicitud
                        </Button>
                    </div>
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