import '../App.css';
import NavBar from '../components/navbar';
import Cookies from "universal-cookie";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState();

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/student", {state: {userData}})
        }
    }, [isLoggedIn, navigate])

    function logIn() {

        fetch("http://localhost:3001/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: document.getElementById("upmail").value,
                    password: document.getElementById("passw").value
                })
            })
            .then(response => response.json())
            .then(body => {
                if (body.success) {
                    console.log(body);
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
                    localStorage.setItem("user", JSON.stringify(body))
                }

                else { alert("Log in failed") }
            })
    }

    function signUp(e) {
        e.preventDefault();

        fetch("http://localhost:3001/sign-up",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    first_name: document.getElementById("fname").value,
                    middle_name: document.getElementById("mname").value,
                    last_name: document.getElementById("lname").value,
                    student_number: document.getElementById("studnum").value,
                    email: document.getElementById("upmail").value,
                    password: document.getElementById("passw").value,
                    user_type: "student",
                    user_status: "pending"
                })
            })
            .then(response => response.json())
            .then(body => {
                if (body._id) {
                    //alert("Successfully signed up!")
                    logIn();
                }
                else { alert("Sign up failed") }
            })
    }

    return (
        <>
            <NavBar />
            <div className="d-flex justify-content-center align-items-center" style={{ height: "90vh" }}>

                <div className="card align-center">
                    <div className="card-header">
                        Sign Up
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="fname" className="form-label">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="fname"
                                    aria-describedby="emailHelp"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="mname" className="form-label">
                                    Middle Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="mname"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="lname" className="form-label">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lname"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="studnum" className="form-label">
                                    Student Number
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="studnum"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="upmail" className="form-label">
                                    UP mail
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="upmail"
                                    aria-describedby="emailHelp"
                                />
                                <div id="emailHelp" className="form-text">
                                    We'll never share your email with anyone else.
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="passw" className="form-label">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="passw"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary me-2" onClick={signUp}>
                                Sign Up
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </>
    );
}