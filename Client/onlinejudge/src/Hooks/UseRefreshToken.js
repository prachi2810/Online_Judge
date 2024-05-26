import axios from '../api/axios';
import useData from './useData';

const useRefreshToken = () => {
    const { setToken } = useData();

    const refresh = async () => {
        const response = await axios.get('/refresh-token', {
            withCredentials: true
        });
        // console.log("refresh resp",response);
        setToken(prev => {
            return { 
                ...prev,
                accessToken: response.data.AccessToken,
                role:response.data.role 
            }

        });
        return response.data.AccessToken;
    }
    
    return refresh;
};

export default useRefreshToken;