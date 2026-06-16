import { useAuthStore } from "@/modules/auth/stores/authStore";

export const authGuard = (to, from) => {

    const authStore = useAuthStore();
    // ruta requiere ser admin y no esta autenticado
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return { name: 'auth' };
    } 
    // ruta invitados (login) yt el usuario esta autenticado
    if (to.meta.requiresGuest && authStore.isAuthenticated){
        return { name: 'admin.dashboard' }
    }
    // si no cumple se deja pasar libremente
    return true;
}