<script setup>
import { RouterLink } from 'vue-router';
</script>
<template>
    <RouterLink 
        active-class="bg-gray-100 text-gray-900"
        class="flex items-center px-2 py-1.5 rounded-base hover:bg-gray-100 transition-colors">
        <slot>

        </slot>
    </RouterLink>
</template>