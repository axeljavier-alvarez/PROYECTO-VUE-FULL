import { defineStore } from "pinia";
import authService from "../services/authServices";
import { ref, computed } from "vue";
export const useAuthStore = defineStore('auth', () => {


    const token = ref(localStorage.getItem('access_token') || null);
    const isAuthenticated = computed(() => !!token.value);


    async function login(credentials){
        
        try {
            const response = await authService.login(credentials);
            localStorage.setItem('access_token', response.access_token);
            token.value = response.access_token;
        } catch (error){
            throw error; 
        }
    }

    async function logout(){
        try {
            await authService.logout();
            localStorage.removeItem('access_token');
            token.value = null;
        } catch(error){
            throw error;
        }
    }

    return {
        isAuthenticated, 
        login,
        logout
    };
});