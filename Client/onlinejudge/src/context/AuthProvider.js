import { createContext,useState,useContext } from "react";

const AuthContext=createContext({});

export const AuthProvider=({children})=>{
   const [token,setToken]=useState({});
//    const [refreshToken, setRefreshToken] = useState('');

   return(
    <AuthContext.Provider value={{token,setToken}}>
        {children}
    </AuthContext.Provider>
   )
};

export default AuthContext;
