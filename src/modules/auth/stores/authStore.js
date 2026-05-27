import { defineStore } from "pinia";
import authService from "../services/authServices";
import { ref, computed } from "vue";

export const useAuthStore = defineStore('auth', () => {
    const _user = ref(null);
    const token = ref(localStorage.getItem('access_token') || null);
    const isAuthenticated = computed(() => !!token.value);
    const user = computed(() => _user.value);

    async function login(credentials){
        
        try {
            const response = await authService.login(credentials);
            localStorage.setItem('access_token', response.access_token);
            token.value = response.access_token;
            await fetchUser();

            return response;
        } catch (error){
            throw error; 
        }
    }

    async function logout(){
        try {
            await authService.logout();
            
        } catch(error){
            throw error;
        } finally {
            localStorage.removeItem('access_token');
            token.value = null;
        }
    }

    async function fetchUser(){
        if (isAuthenticated.value){
            try {
                _user.value = await authService.me();
            } catch (error){
                logout();
                throw error;
            }
        }
    }

    return {
        isAuthenticated, 
        login,
        logout,
        user,
        token,
        fetchUser
    };
});