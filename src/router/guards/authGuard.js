import { useAuthStore } from "@/modules/auth/stores/authStore";

export const authGuard = (to, from, next) => {

    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'login' });

    } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
        next({ name: 'home' });

    } else {
        next();
    }
}