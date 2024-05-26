import axios from "axios";
import { useAuth } from '../context/AuthProvider';

export default axios.create({
    baseURL: 'http://localhost:5137/api'
});


export const axiosUserPrivate = axios.create({
    baseURL: 'http://localhost:5137/api',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true

});

// axiosUsePrivate.interceptors.response.use(
//     (response)=>{
//         return response;
//     },
//     async (error)=>{
//         if(error.response.status === 401){
//             await axios.get('/refresh-token',{
//                 withCredentials:true,
//             })
//             .catch((refreshTokenAPIError)=>{
//                 // Cookies.clear('token')
//                 return Promise.reject(refreshTokenAPIError)
//             });
//             return axios(error.config);
//         }
//     }

// )
