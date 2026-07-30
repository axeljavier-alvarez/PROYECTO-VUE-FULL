import axios from '@/api/axiosConfig';

export default {
    async consultar(data) {
        const response = await axios.post(
            '/solicitudes/consultar',
            data
        );

        return response.data;
    }
}