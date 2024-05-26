import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import useData from "../../Hooks/useData";
import { useEffect } from "react";



function Navbar({setRole}) {

    const navigate = useNavigate();
    const { token, setToken } = useData();
    const handleLogout = async () => {
        try {
            const response = await axios.delete('/logout', { withCredentials: true });
            setToken({});
            if (response.status == 200) {
                navigate('/');
            }
            console.log(response);
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleisLoggedIn = async () => {
        try {
            const response = await axios.get('/isLoggedIn', { withCredentials: true });
            console.log('ddd');
            console.log("role1",response.data.role);
            setRole(response.data.role);
            if (response.status == 401) {
                navigate('/unauthorized');
            }
        }
        catch (error) {
            navigate('/unauthorized');
        }
    }
    useEffect(() => {
        handleisLoggedIn();
    }, [])

    return (
        <>
            <div className="Nav">
                <nav className="navbar navbar-expand-lg navcolor">
                    <div class="container-fluid" >
                        <a class="navbar-brand" onClick={() => { navigate('/allquestions') }}>Online_Judge</a>
                        {/* <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button> */}
                        {/* <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Dropdown
                                    </a>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="#">Action</a></li>
                                        <li><a class="dropdown-item" href="#">Another action</a></li>
                                        <li><hr class="dropdown-divider" /></li>
                                        <li><a class="dropdown-item" href="#">Something else here</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div> */}
                        <form class="d-flex justify-content-start" role="search">
                            {/* <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button class="btn btn-outline-success" type="submit">Search</button> */}
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle username" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        P
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-end">
                                        <li><a class="dropdown-item" onClick={handleLogout}>Logout</a></li>
                                       
                                    </ul>
                                </li>
                            </ul>
                        </form>
                        {/* <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        ̧                                P
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-start">
                                        <li><a className="dropdown-item" onClick={handleLogout}>Logout</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div> */}
                    </div>
                </nav>
            </div>
        </>
    )
}

export default Navbar;