import apiClient from "@/api/axiosConfig";

export default {
    async login(credentials){
        try {
            const response = await apiClient.post('/auth/login', credentials);
            return response.data;
        } catch(error){
            throw error.response.data;
            
        }
    },
    async logout(){
        try {
            const response = await apiClient.post('/auth/logout');
            return response.data;
        } catch(error){
            return error.response.data;
        }
    },
    async refresh(){
        try {
            const response = await apiClient.post('/auth/refresh');
            return response.data;
        } catch(error){
            return error.response.data;
        }

    },
    async me(){
        try {
            const response = await apiClient.post('/auth/me');
            return response.data
        } catch(error){
            return error.response.data;
        }
    }
}