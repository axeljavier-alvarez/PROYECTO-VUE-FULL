<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <RouterLink class="block w-full px-4 py-2 leading-5 text-gray-700 hover:bg-gray-100">
        <slot></slot>
    </RouterLink>
</template>