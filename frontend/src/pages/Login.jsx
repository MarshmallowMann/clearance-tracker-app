import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import NavBar from "../components/navbar";

export default function Login(props) {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState();

    const ToSignup = (data) => {
        navigate("/signup", { state: { data } });
    }

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/student", {state: {userData}})
        }
    }, [isLoggedIn, navigate])

    function logIn(e) {
        e.preventDefault();

        fetch("http://localhost:3001/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: document.getElementById("login-email").value,
                    password: document.getElementById("login-passw").value
                })
            })
            .then(response => response.json())
            .then(body => {
                if (body.success) {
                    
                    setIsLoggedIn(true)

                    const cookies = new Cookies()
                    cookies.set(
                        "authToken",
                        body.token,
                        {
                            path: "localhost:3001/",
                            age: 60 * 60,
                            sameSite: false
                        });
                    console.log(body)
                    setUserData(body)
                    console.log(body)
                    localStorage.setItem("user", JSON.stringify(body))
                }

                else { alert("Log in failed") }
            })
    }

    return (
        <>
            <NavBar />
            <div className="d-flex justify-content-center align-items-center" style={{ height: "90vh" }}>

                <div className="card align-center">
                    <div className="card-header">
                        Log In
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="login-email" className="form-label">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="login-email"
                                    aria-describedby="emailHelp"
                                />
                                <div id="emailHelp" className="form-text">
                                    We'll never share your email with anyone else.
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="login-passw" className="form-label">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="login-passw"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary me-2 mt-2" onClick={logIn}>
                                Log In
                            </button>
                            <button type="submit" className="btn btn-primary mt-2" onClick={() => { ToSignup("") }}>
                                Sign Up
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </>
    );
}
