<script setup>
import { ref } from 'vue';

const open = ref(false);

const toggleDropdown = () => {
    open.value = !open.value;
};
</script>

<template>
    <div class="relative">

        <!-- TRIGGER -->
        <div @click="toggleDropdown">
            <slot name="trigger"></slot>
        </div>

        <!-- DROPDOWN -->
        <div
            v-show="open"
            class="absolute z-50 end-0 mt-2 w-48"
        >
            <div class="bg-white shadow-lg rounded-md py-1 border border-gray-200">
                <slot></slot>
            </div>
        </div>

    </div>
</template>