import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import { useState, useEffect } from "react";

export default function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();


    const [isLoggedIn, setIsLoggedIn] = useState(true)


    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/")
        }
    }, [isLoggedIn, navigate])

    const toManageStudent = () => {
        navigate('/admin-manage-students', { state: {} })
    }

    const toManageApprover = () => {
        navigate('/admin-manage-approver', { state: {} })
    }

    const toClearanceApplication = () => {
        navigate('/admin-clearance-application', { state: {} })
    }

    const toHomePage = () => {
        navigate('/admin-homepage', { state: {} });
    }

    const toLoginPage = () => {
        navigate('/', { state: {} });
    }

    

    function logout() {
        const cookies = new Cookies();
        cookies.remove("authToken");
        localStorage.removeItem("user");
        setIsLoggedIn(false)
      }

    const user = JSON.parse(localStorage.getItem("user"))?.user;

    

    return (
        <nav className="navbar navbar-expand-sm bg-primary navbar-dark">
            <div className="container-fluid">
                <div className="nav-item" onClick={toHomePage}>
                    <h5><a className="nav-link active logo" href="/">UPLB Clearance System</a></h5>
                </div>

                {location.pathname == "/" || location.pathname == "/signup" || location.pathname == "/student" ?
                    <>
                        <div className="nav-item">
                        </div>
                    </>
                    :
                    <>
                        <div className="nav-item">
                            <div className="row user">
                                <div className="col-3 std-prof">
                                    <img src="./profile.png" alt="profile" className="student-profile" />
                                </div>
                                <div className="col-9 username">
                                    <div className="dropdown">
                                        <button type="button" className="btn btn-primary dropdown-toggle nav-drp"
                                            data-bs-toggle="dropdown">
                                            {user && user.user_type == "approver" ? "Approver Account" : "Admin Account"}
                                        </button>
                                        <ul className="dropdown-menu">
                                            {user && user.user_type == "approver" 
                                                ?
                                                <li ><a className="dropdown-item"  onClick={logout}>Log Out</a></li>
                                                :
                                                <>
                                                    <li ><a className="dropdown-item" onClick={toManageStudent}>Manage Student Accounts</a></li>
                                                    <li ><a className="dropdown-item"  onClick={toManageApprover}>Manage Approver Accounts</a></li>
                                                    <li ><a className="dropdown-item"  onClick={toClearanceApplication}>Clearance Application</a></li>
                                                    <li><a className="dropdown-item"  onClick={logout}>Log Out</a></li>
                                                </>

                                            }

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>

                }


            </div>
        </nav>
    );
}