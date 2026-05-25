<script setup>
const props = defineProps({
    color: {
        type: String,
        default: 'primary'
    }
})

const buttonClasses = {
    primary:
        'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',

    secondary:
        'bg-gray-600 hover:bg-gray-700 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800',
    
    success:
        'bg-green-600 hover:bg-green-700 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800',

    danger:
        'bg-red-600 hover:bg-red-700 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800',


}[props.color]
</script>

<template>
    <button
        type="submit"
        class="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        :class="buttonClasses"
    >
        <slot></slot>
    </button>
</template>