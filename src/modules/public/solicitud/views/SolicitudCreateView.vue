<script setup>
import { useSolicitudStore } from '../stores/solicitudStore';
const store = useSolicitudStore();
const guardar = async () => {
    try {
        const response = await store.createSolicitud();
        console.log(response);
        alert('Solicitud enviada');
    } catch(error) {
        console.error(error);
    }
}
</script>
<template>
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
</template>
<style>

</style>
