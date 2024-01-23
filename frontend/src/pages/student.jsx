import React, { useEffect, useState } from "react";
import NavBar from "../components/navbar-student";
import { useLocation, useNavigate, useLoaderData } from "react-router-dom";

export default function Student(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const loader = useLoaderData();
    
    // console.log(location.state)s

    const [listApplications, setListApplications] = useState([]);

    const [hasPending, setHasPending] = useState(false)
    const [adviser, setAdviser] = useState(null)

    

    const submitApp = () => {
        fetch("http://localhost:3001/student/open-application",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: loader.user._id,
                    remark: document.getElementById("github_link").value,
                    link: document.getElementById("git_remark").value
                })
            })
            .then(response => response.json())
            .then(body => {
                fetch("http://localhost:3001/student/view-all-applications",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            user_id: loader.user._id
                        })
                    })
                    .then(response => response.json())
                    .then(body => {
                        console.log(body)
                        setListApplications(body)
                    })
                console.log(body)
            })
    }


    const viewApp = (app_id) => {
        fetch("http://localhost:3001/student/view-single-application",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    application_id: app_id,
                })
            })
            .then(response => response.json())
    }



    useEffect(() => {
        fetch("http://localhost:3001/student/view-all-applications",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: loader.user._id
                })
            })
            .then(response => response.json())
            .then(body => {
                //console.log(body)

                setListApplications(body.reverse())

                // Loop through the list of applications and check if there is a pending application
                for (let i = 0; i < listApplications.length; i++) {
                    if (listApplications[i].status === "Pending") {
                        setHasPending(true);
                        break;
                    }
                    else {
                        setHasPending(false);
                    }
                }
                console.log(loader.user.adviser)
                if (loader.user.adviser) {
                    fetch(`http://localhost:3001/get-adviser?adviser_id=${loader.user.adviser}`)
                    .then(response =>  {
                        const contentType = response.headers.get("content-type");
                        if (contentType && contentType.indexOf("application/json") !== -1) {
                            return response.json().then(data => {
                            // The response was a JSON object
                            // Process your data as a JavaScript object
                            console.log(data)
                                setAdviser(data) 
                            });
                        } else {
                            return response.text().then(text => {
                            // The response wasn't a JSON object
                            // Process your text as a String
                            return;
                            });
                        }
                     }// response.body ? response.json() : null
                    )

                }
                // console.log(hasPending)
                //console.log(listApplications[listApplications.length-1])
            })
    }, [listApplications.length, loader.user.adviser])
    if (loader.user.user_status === `approved`) {
        return (
            <>
                <NavBar data={""}/>
                
    
                <div className="container mt-4">
                    <h2>Clearance Application</h2>
    
                    <p>{
                        hasPending ||!loader.user.adviser ?
                        <>
                        <button className="open btn btn-primary mb-2" type="button" data-bs-toggle="collapse" data-bs-target="#newapp" aria-expanded="false" aria-controls="collapseExample" disabled>
                            Open a New Application
                        </button>
                        <br></br>
                        {!loader.user.adviser ? <span className="badge bg-warning text-dark">You have a no adviser</span> : <></>}
                        {hasPending ? <span className="badge bg-warning text-dark ms-2 ">You have a pending application</span> : <></>}
                        </>
                        :
                        <button className="open btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#newapp" aria-expanded="false" aria-controls="collapseExample">
                        Open a New Application
                        </button>
                        }
                    </p>
                    <div className="collapse" id="newapp">
                        <div className="card card-body">
                            <div className="mb-3">
                                <div className="input-group">
                                    <span className="input-group-text" id="basic-addon3">Enter you Github Link</span>
                                    <input type="text" className="form-control" id="git_remark" aria-describedby="basic-addon3 basic-addon4"/>
                                    <span className="input-group-text" id="basic-addon3">Remarks</span>
                                    <input type="text" className="form-control" id="github_link" aria-describedby="basic-addon3 basic-addon4"/>
                                    {
                                        hasPending?
                                        <button type="button" className="btn btn-primary btn-sm" id="submit-app" onClick={submitApp} disabled>Submit</button>:
                                        <button type="button" className="btn btn-primary btn-sm" id="submit-app" onClick={submitApp}>Submit</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div className="card student-table">
                        <div className="row">
                            <div className="col-3">
                                <h6>Application Number</h6>
                            </div>
                            <div className="col-3">
                                <h6>Adviser</h6>
                            </div>
                            <div className="col-2">
                                <h6>Date</h6>
                            </div>
                            <div className="col-1">
                                <h6>Step</h6>
                            </div>
                            <div className="col-2">
                                <h6>Status</h6>
                            </div>
                            <div className="col-1">
                                <h6>Details</h6>
                            </div>
                        </div>
                        <br />
                        {
                            listApplications?.reverse().map((e) => {
                                return (
                                    <div className="row student-data">
                                        <div className="col-3">
                                            <p>{e._id}</p>
                                        </div>
                                        <div className="col-3">
                                            <p>{adviser ? `${adviser.first_name.charAt(0)}${adviser.middle_name.charAt(0)}${adviser.last_name}`.toUpperCase() : "N/A"}</p>
                                        </div>
                                        <div className="col-2">
                                            <p>{new Date(e.student_submission.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="col-1">
                                            <p>{e.step}</p>
                                        </div>
                                        <div className="col-2">
                                            <p><span className= {
                                                e.status === "Closed"?
                                                "status badge bg-danger":
                                                e.status === "Pending"?
                                                "status badge bg-warning":
                                                "status badge bg-info"
                                            }>{e.status}</span></p>
                                        </div>
                                        <div className="col-1">
                                            <p><button type="button" className="btn btn-link" onClick={ async () => {
                                                let a = await  viewApp(e._id);
                                                navigate("/student-application-details", { state: { userData: loader.user, applicationData: e._id, adviser: adviser } })}}>View</button></p>
                                        </div>
                                    </div>
                                ) 
                            })
                        }
                        {/* <div className="row student-data">
                            <div className="col-3">
                                <p>0333</p>
                            </div>
                            <div className="col-3">
                                <p>KMTAN</p>
                            </div>
                            <div className="col-2">
                                <p>06/04/23</p>
                            </div>
                            <div className="col-1">
                                <p>1</p>
                            </div>
                            <div className="col-2">
                                <p><span className="status badge bg-warning">Pending</span></p>
                            </div>
                            <div className="col-1">
                                <p><button type="button" className="btn btn-link" onClick={() => { ToView("") }}>View</button></p>
                            </div>
                        </div>
                        <div className="row student-data">
                            <div className="col-3">
                                <p>0244</p>
                            </div>
                            <div className="col-3">
                                <p>KMTAN</p>
                            </div>
                            <div className="col-2">
                                <p>02/14/23</p>
                            </div>
                            <div className="col-1">
                                <p>5</p>
                            </div>
                            <div className="col-2">
                                <p><span className="status badge bg-info">Cleared</span></p>
                            </div>
                            <div className="col-1">
                                <p><button type="button" className="btn btn-link" onClick={() => { ToView("") }}>View</button></p>
                            </div>
                        </div>
                        <div className="row student-data">
                            <div className="col-3">
                                <p>0212</p>
                            </div>
                            <div className="col-3">
                                <p>KMTAN</p>
                            </div>
                            <div className="col-2">
                                <p>09/15/21</p>
                            </div>
                            <div className="col-1">
                                <p>3</p>
                            </div>
                            <div className="col-2">
                                <p><span className="status badge bg-danger">Closed</span></p>
                            </div>
                            <div className="col-1">
                                <p><button type="button" class="btn btn-link" onClick={() => { ToView("") }}>View</button></p>
                            </div>
                        </div> */}
                    </div>
                </div>
    
            </>
        )
    } else {
        return (
        <>
        <NavBar />
        {/* Display error text in red */}
        <h1 className="mt-5 text-danger">Error</h1>
        <h2 className="text-danger">Account Not Approved</h2>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <p className="mt-2">Your account is not yet approved or may have been rejected. Please contact admin.</p>
        </>
        )
        
    }

   
}
