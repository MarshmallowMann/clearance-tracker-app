import Cookies from "universal-cookie";
import { useState, useEffect } from "react";
import { useNavigate, useLoaderData, redirect, NavLink } from 'react-router-dom';

export default function NavBar(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    
    const navigate = useNavigate();
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/")
        }
    }, [isLoggedIn, navigate])

    function logOut() {
        const cookies = new Cookies()
        cookies.remove("authToken")
        localStorage.removeItem("user")
        setIsLoggedIn(false)
    }

    return (
        <nav className="navbar navbar-expand-sm bg-primary navbar-dark">
            <div className="container-fluid">
                <div className="nav-item">
                    <h5><a className="nav-link active logo" href="/">UPLB Clearance System</a></h5>
                </div>

                
                    <>
                        <div className="nav-item">
                        </div>
                    </>

                    <>
                        <div className="nav-item">
                            <div className="row user">
                                <div className="col-3 std-prof">
                                    <img src="./profile.png" alt="profile" className="student-profile" />
                                </div>
                                <div className="col-9 username">
                                    <div className="dropdown">
                                        <button type="button" className="btn btn-primary dropdown-toggle nav-drp"
                                            data-bs-toggle="dropdown">Student Account</button>
                                        <ul className="dropdown-menu">
                                            {
                                                
                                                <li><a className="dropdown-item" href="#" onClick={logOut}>Log Out</a></li>

                                            }

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>

                


            </div>
        </nav>
    )
}
