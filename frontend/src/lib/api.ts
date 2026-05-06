import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1`;

export const apiLogin = async (username: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    
    try {
        const response = await axios.post(`${API_URL}/auth/login`, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.detail || "Lỗi đăng nhập";
    }
};

export const apiRegister = async (email: string, username: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            email, username, password
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.detail || "Lỗi đăng ký";
    }
};

export const getTemplates = async () => {
    const response = await axios.get(`${API_URL}/templates/`);
    return response.data;
};
