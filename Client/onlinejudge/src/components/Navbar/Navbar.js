import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import useData from "../../Hooks/useData";
import { useEffect, useState } from "react"; // Import useState

function Navbar({ setRole,role }) {
    const navigate = useNavigate();
    const { token, setToken } = useData();
    const [userName, setUserName] = useState(''); // Initialize userName state with useState

    const handleLogout = async () => {
        try {
            const response = await axios.delete('/logout', { withCredentials: true });
            setToken({});
            if (response.status === 200) {
                navigate('/');
            }
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    const handleisLoggedIn = async () => {
        try {
            const response = await axios.get('/isLoggedIn', { withCredentials: true });
            console.log('ddd');
            setRole(response.data.role);
            setUserName(response.data.email); // Set userName state
            console.log("uuuu", userName);
            if (response.status === 401) {
                navigate('/unauthorized');
            }
        } catch (error) {
            // Handle error
        }
    }

    useEffect(() => {
        handleisLoggedIn();
    }, [])

    return (
        <>
            <div className="Nav">
                <nav className="navbar navbar-expand-lg navcolor">
                    <div className="container-fluid">
                        <a className="navbar-brand" onClick={() => { navigate('/allquestions') }}>Online_Judge</a>
                        <form className="d-flex justify-content-start" role="search">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle username" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {userName.charAt(0).toUpperCase()}
                                        
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        {role==='admin' && (
                                         <li><a className="dropdown-item" onClick={()=>{navigate('/dashboard')}}>Dashboard</a></li>

                                        )}
                                        <li><a className="dropdown-item" onClick={handleLogout}>Logout</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </form>
                    </div>
                </nav>
            </div>
        </>
    )
}

export default Navbar;
