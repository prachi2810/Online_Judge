import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../Hooks/useRefreshToken";
import useAuth from "../Hooks/useData";

const PersistLogin=()=>{
    const [isLoading,setIsLoading]=useState(true);
    const refresh=useRefreshToken();
    const {token}=useAuth();

    useEffect(()=>{
        const verifyRefreshToken=async()=>{
            try {
                await refresh();
            } catch (error) {
                console.log(error);
            }finally{
                setIsLoading(false);
            }
        }

        !token?.token ? verifyRefreshToken() : setIsLoading(false)
    },[])

    // useEffect(()=>{
    //     console.log(`isLoading ${isLoading}`);
    //     console.log(`aT: ${JSON.stringify(token?.token)}`);
    // },[isLoading])

    return (
        <>
            {
                isLoading
                ? <p style={{textAlign:'center',color:'blue'}}>Loading...</p> 
                : <Outlet/>
            }
        </>    
    )
}


export default PersistLogin;