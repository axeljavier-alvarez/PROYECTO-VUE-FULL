<script setup>
import { useSolicitudStore } from '../stores/solicitudStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const store = useSolicitudStore();

const guardar = async () => {
    try {
        const response = await store.createSolicitud();
        console.log(response);
        alert('Solicitud enviada');
    } catch (error) {
        console.error(error);
    }
}
</script>
<template>
    <div class="container max-w-4xl mx-auto py-10 px-4">
        <Card>
            <CardHeader>
                <CardTitle>
                    Solicitud
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form @submit.prevent="guardar" class="grid gap-6">
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <Input v-model="store.form.nombres" placeholder="Nombres" />
                            <p v-if="store.errors.nombres" class="text-sm text-red-500 mt-1">
                                {{ store.errors.nombres[0] }}
                            </p>
                        </div>

                        <div>
                            <Input v-model="store.form.apellidos" placeholder="Apellidos" />
                            <p v-if="store.errors.apellidos" class="text-sm text-red-500 mt-1">
                                {{ store.errors.apellidos[0] }}
                            </p>
                        </div>
                    </div>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <Input v-model="store.form.email" type="email" placeholder="Correo electrónico" />
                            <p v-if="store.errors.email" class="text-sm text-red-500 mt-1">
                                {{ store.errors.email[0] }}
                            </p>
                        </div>
                        <div>
                            <Input v-model="store.form.telefono" placeholder="Teléfono" />

                            <p v-if="store.errors.telefono" class="text-sm text-red-500 mt-1">
                                {{ store.errors.telefono[0] }}
                            </p>
                        </div>

                    </div>
                    <Input v-model="store.form.cui" placeholder="CUI" />

                    <Textarea v-model="store.form.domicilio" placeholder="Domicilio" />

                    <Textarea v-model="store.form.razon" placeholder="Razón de la solicitud" />

                    <Button type="submit" :disabled="store.loading">
                        {{
                            store.loading
                                ? 'Enviando...'
                                : 'Enviar Solicitud'
                        }}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </div>
</template>
<!-- <template>
    <form @submit.prevent="guardar">
        <input
        v-model="store.form.nombres"
        placeholder="Nombres">

        <input
        v-model="store.form.apellidos"
        placeholder="Apellidos">
        <input
        v-model="store.form.email"
        placeholder="Email">
        <input
        v-model="store.form.telefono"
        placeholder="Teléfono">
        <input
        v-model="store.form.cui"
        placeholder="CUI"
        >
        <textarea 
        v-model="store.form.domicilio"
        placeholder="Domicilio"
        />
        <textarea
        v-model="store.form.razon"
        placeholder="Razón"
        />
        <button
        type="submit"
        :disabled="store.loading">
        Guardar
        </button>

    </form>
</template> -->
<style></style>
