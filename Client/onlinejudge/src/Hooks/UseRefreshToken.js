
import {useAuth} from './useAuth';
import axios from 'axios';

const UseRefreshToken = () => {
    const { setToken } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/', {
            withCredentials: true
        });
        setToken(prev => {
            return { 
                ...prev,
                token: response.data.token 
            }

        });
        return response.data.token;
    }
    
    return refresh;
};

export default UseRefreshToken;