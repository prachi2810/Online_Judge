import UseRefreshToken from "./UseRefreshToken"
import { useAuth } from "./useAuth";
import { useEffect } from "react";

const UseAxiosPrivate=(axios)=>{
      const refresh=UseRefreshToken();
      const {token}=useAuth();

      useEffect(()=>{
        // console.log("tokenn",token.token);
        const requestIntercept = axios.interceptors.request.use(
            config => {
                // console.log("config",config);
                if (!config.headers['token']) {
                    config.headers['token'] = token.token;
                }
                // console.log("config1",config);
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axios.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['token'] = newAccessToken;
                    return axios(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestIntercept);
            axios.interceptors.response.eject(responseIntercept);
        }
        

      },[token,refresh,axios]);

      return axios;
}

export default UseAxiosPrivate;