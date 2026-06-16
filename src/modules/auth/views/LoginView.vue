<script setup>

import FormInput from '@/modules/shared/components/FormInput.vue';
import FormLabel from '@/modules/shared/components/FormLabel.vue';
import MyButton from '@/modules/shared/components/MyButton.vue';
import TextLink from '@/modules/shared/components/TextLink.vue';
import { reactive } from 'vue';
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router';
import { ref } from 'vue';
const authStore = useAuthStore();

const router = useRouter();

const credentials = reactive({
    email: '',
    password: ''
});

const errors = ref([
]);

const isLoading = ref(false); 

// async function handleLogin() {

//     errors.value = [];
//     try {
//         isLoading.value = true;
//         await authStore.login(credentials);
//         router.push('/');
//     } catch (error) {

//         const responseErrors = error.errors;
//         // console.log(responseErrors);
//         for (const field in responseErrors) {
//             // console.log(field);
//             errors.value.push(
//                 responseErrors[field][0]
//             );
//         }

//         // console.log(errors.value)
//     } finally {
//         isLoading.value = false;
//     }
// }
async function handleLogin(){
    errors.value = [];
    try {
        isLoading.value = true;
        await authStore.login(credentials);
        router.push({ name: 'admin.dashboard' })
    } catch (error) {
        const responseErrors = error.errors;
        for(const field in responseErrors){
            errors.value.push(responseErrors[field][0]);
        }
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>

    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        Inicia sesión en tu cuenta
    </h1>

    <!-- flowbite mensaje -->
    <div v-if="errors.length" class="flex p-4 mb-4 text-sm text-fg-danger-strong rounded-base bg-danger-soft border border-danger-subtle"
        role="alert">
        <svg class="w-4 h-4 me-2 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <span class="sr-only">Danger</span>
        <div>
            <span class="font-medium">
                ¡Ups! ha ocurrido un error
            </span>
            <ul class="mt-2 list-disc list-outside space-y-1 ps-2.5">
             <li v-for="error in errors">
                {{ error }}
             </li>
            </ul>
        </div>
    </div>

    <form class="space-y-4 md:space-y-6" @submit.prevent="handleLogin">
        <div>
            <FormLabel for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                email</FormLabel>


            <FormInput v-model="credentials.email" type="email" name="email" id="email" placeholder="name@company.com" />
        </div>
        <div>
            <FormLabel for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password
            </FormLabel>
            <FormInput v-model="credentials.password" type="password" name="password" id="password" placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
        <div class="flex items-center justify-between">
            <div class="flex items-start">
                <div class="flex items-center h-5">
                    <input id="remember" aria-describedby="remember" type="checkbox"
                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800">
                </div>
                <div class="ml-3 text-sm">
                    <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                </div>
            </div>
            <TextLink href="#">
                Forgot
                password?
            </TextLink>
        </div>
        <MyButton 
        type="submit" 
        :disabled="isLoading"
         >
            Sign
            in</MyButton>
        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
            Don’t have an account yet?
            <TextLink href="#">
                Sign up
            </TextLink>

        </p>
    </form>

</template>