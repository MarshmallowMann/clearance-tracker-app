import React, { useState, useEffect } from "react";
import NavBar from "../components/navbar-student";
import { redirect, useLocation } from "react-router-dom";

export default function ViewDetails() {
    const { state } = useLocation();
    if (!state.applicationData) {
        redirect("/student")
    }

    const [application, setApplication] = useState()
    const [adviser, setAdviser] = useState(null)
    const [student, setStudent] = useState(null)
    const [didChange, setDidChange] = useState(false)
    const [isPending, setIsPending] = useState()

    // useEffect(() => {
    //     fetch("http://localhost:3001/student/resubmit-at-curr-step",
    //         {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify({
    //                 application_id: state.applicationData,
    //                 step: state.applicationData.step,
    //                 remark: state.applicationData.remarks.remark,
    //                 commenter: state.applicationData.remarks.commenter
    //             })
    //         })
    //         .then(response => response.json())
    //         .then(body => {
    //             console.log(body)
    //         })
    // }, [])

    // useEffect(() => {
    //     fetch("http://localhost:3001/student/clear-application",
    //         {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify({
    //                 application_id: state.applicationData
    //             })
    //         })
    //         .then(response => response.json())
    //         .then(body => {
    //             console.log(body)
    //             //setApplication(body)

    //         })
    // }, [])

    useEffect(() => {
        fetch("http://localhost:3001/student/view-single-application",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    application_id: state.applicationData
                })
            })
            .then(response => response.json())
            .then(body => {
                //console.log(body)

                setApplication(body.application)
                setAdviser(body.adviser)
                setStudent(body.student)

            })
    }, [isPending, didChange])

    const printApp = () => {
        fetch("http://localhost:3001/student/print-application",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    application_id: state.applicationData
                })
            })
            .then(async response => {
                // check if blob or json
                const contentType = response.headers.get('content-type');
                
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    response.json();
                } else {
                const blob = await response.blob();
                const file = new Blob([blob], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                }
            })
            .then(body => {
                console.log(body)
            })
    }

    const closeApp = () => {
        fetch("http://localhost:3001/student/close-application",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    application_id: state.applicationData
                })
            })
            .then(response => response.json())
            .then(body => {
                console.log(body)
                if (application.status == "Pending") {
                    setIsPending(true);
                }
                else {
                    setIsPending(false);
                }
            }, [])
    }

    const submitOfficer = () => {
        fetch("http://localhost:3001/student/submit-officer",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    application_id: state.applicationData
                })
            })
            .then(response => response.json())
            .then(() => {
                setDidChange(!didChange)
            })
    }

    const submitAdviser = (githubLink) => {
        // call 


        fetch("http://localhost:3001/student/submit-adviser",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    application_id: state.applicationData,
                    link: githubLink
                })
            })
            .then(response => response.json())
            .then(body => {
                setDidChange(!didChange)
            })
    }


    if (application) {
        console.log(new Date(application.student_submission.date).toLocaleDateString())
    }
    return (
        <div>
            <>
                <NavBar />

                <div className="container mt-4">
                    <h2>Clearance Applications</h2>
                    <div className="card student-table">
                        <div className="row">
                            <div className="col-1">
                                <h6></h6>
                            </div>
                            <div className="col-2">
                                <h6>Application Number</h6>
                            </div>
                            <div className="col-2">
                                <h6>Date</h6>
                            </div>
                            <div className="col-1">
                                <h6>Step</h6>
                            </div>
                            <div className="col-2">
                                <h6>Adviser</h6>
                            </div>
                            <div className="col-4">
                                <h6>Remarks</h6>
                            </div>
                        </div>
                        <br />
                        {(application) ?
                            (
                                <div className="row student-data" id="application">
                                    <div className="col-1">{
                                        application.status == "Pending" ?
                                            <h6><button type="button" className="close btn-close" aria-label="Close" onClick={closeApp}></button></h6> :
                                            <h6><button type="button" className="close btn-close" aria-label="Close" disabled></button></h6>

                                    }
                                    </div>
                                    <div className="col-2">
                                        <p className="small">{application._id}</p>
                                    </div>
                                    <div className="col-2">
                                        <p>{new Date(application.student_submission.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="col-1">
                                        <p>{application.step}</p>
                                    </div>
                                    <div className="col-2">
                                        {console.log("adviser")}
                                        {console.log(adviser)}
                                        <p>{adviser ? `${adviser?.first_name.charAt(0)}${adviser?.middle_name.charAt(0)}${adviser?.last_name}`.toUpperCase() : "N/A"}</p>
                                    </div>
                                    <div className="col-4">
                                        <p>{application.student_submission.remark}</p>
                                    </div>
                                </div>
                            ) :
                            (<></>
                            )

                        }



                    </div>
                    <div>
                        <h3 className="mt-5">Application Steps</h3>
                    </div>

                    {(application && application.step === 1) ?
                        (
                            <div className="step 1 card mt-4 clearance-app">
                                <div className="row">
                                    <div className="col-10 step-title">
                                        <h5>Step 1: Pre-Submission to Adviser</h5>
                                    </div>
                                    <div className="col-2">
                                        <button type="button" className="btn btn-primary" data-bs-toggle="collapse"
                                            data-bs-target="#s1-details">View Details</button>
                                    </div>
                                </div>
                                <div id="s1-details" className="collapse s-details">
                                    <hr />
                                    <div className="input-group mb-3">
                                        <span className="input-group-text fw-bold">Link Submission:</span>
                                        <input type="text" className="form-control mx-1" placeholder="GitHub Link" name="githubLink" defaultValue={application.student_submission.link} />
                                        <button type="button" className="btn btn-primary btn-sm" id="submit-adviser" onClick={() => {
                                            // pass the githublink as parameter to submitAdviser
                                            submitAdviser(document.getElementsByName("githubLink")[0].value) 
                                    
                                            }}>Submit</button>
                                    </div>
                                </div>
                            </div>
                        ) :
                        (<></>
                        )

                    }

                    {(application && application.step === 2) ?
                        (
                            <div className="step 2 card mt-4 clearance-app">
                                <div className="row">
                                    <div className="col-10 step-title">
                                        <h5>Step 2: Adviser Review</h5>
                                    </div>
                                    <div className="col-2">
                                        <button type="button" className="btn btn-primary" data-bs-toggle="collapse"
                                            data-bs-target="#s2-details">View Details</button>
                                    </div>
                                </div>
                                <div id="s2-details" className="collapse s-details">
                                    <hr />
                                    <div className="card app-status">
                                        <p className="text-center"><span className="fw-bold">Status: </span>{application.status}</p>
                                    </div>
                                    <p><span className="fw-bold">Link Submitted: </span>{application.student_submission.link}</p>
                                    <p><span className="fw-bold">Evaluated by: </span>{state.adviser ? `${state.adviser.first_name.charAt(0)}${state.adviser.middle_name.charAt(0)}${state.adviser.last_name}`.toUpperCase() : "N/A"}</p>
                                </div>
                            </div>
                        ) :
                        (<></>
                        )

                    }

                    {(application && application.step === 3) ?
                        (
                            <div className="step 3 card mt-4 clearance-app">
                                <div className="row">
                                    <div className="col-10 step-title">
                                        <h5>Step 3: Pre-Submission to Clearance Officer</h5>
                                    </div>
                                    <div className="col-2">
                                        <button type="button" className="btn btn-primary" data-bs-toggle="collapse"
                                            data-bs-target="#s3-details">View Details</button>
                                    </div>
                                </div>
                                <div id="s3-details" className="collapse s-details">
                                    <hr />
                                    <p><span className="fw-bold">Link Submitted: </span>{application.student_submission.link}</p>
                                    <p><span className="fw-bold">Evaluated by: </span>{state.adviser ? `${state.adviser.first_name.charAt(0)}${state.adviser.middle_name.charAt(0)}${state.adviser.last_name}`.toUpperCase() : "N/A"}</p>
                                    <button type="button" className="btn btn-secondary" onClick={submitOfficer}>Submit to Clearance Officer</button>
                                </div>
                            </div>
                        ) :
                        (<></>
                        )

                    }

                    {(application && application.step === 4) ?
                        (
                            <div className="step 4 card mt-4 clearance-app">
                                <div className="row">
                                    <div className="col-10 step-title">
                                        <h5>Step 4: Clearance Officer Review</h5>
                                    </div>
                                    <div className="col-2">
                                        <button type="button" className="btn btn-primary" data-bs-toggle="collapse"
                                            data-bs-target="#s4-details">View Details</button>
                                    </div>
                                </div>
                                <div id="s4-details" className="collapse s-details">
                                    <hr />
                                    <div className="card app-status">
                                        <p className="text-center"><span className="fw-bold">Status: </span>{application.status}</p>
                                    </div>
                                    <p><span className="fw-bold">Link Submitted: </span>{application.student_submission.link}</p>
                                    <p><span className="fw-bold">Evaluated by: </span>ICS Registration Committee</p>
                                </div>
                            </div>
                        ) :
                        (<></>
                        )

                    }

                    {(application && application.step === 5) ?
                        (
                            <div className="step 5 card mt-4 clearance-app">
                                <div className="row">
                                    <div className="col-10 step-title">
                                        <h5>Step 5: Clearance Approved</h5>
                                    </div>
                                    <div className="col-2">
                                        <button type="button" className="btn btn-primary" data-bs-toggle="collapse"
                                            data-bs-target="#s5-details">View Details</button>
                                    </div>
                                </div>
                                <div id="s5-details" className="collapse s-details">
                                    <hr />
                                    <div className="card app-status">
                                        <p className="text-center"><span className="fw-bold">Status: </span>Cleared</p>
                                    </div>
                                    <p><a className="btn btn-primary" role="button" onClick={printApp}>Print PDF</a></p>
                                    <p><span className="fw-bold">Evaluated by: </span>ICS Registration Committee</p>
                                </div>
                            </div>

                        ) :
                        (<></>
                        )

                    }

{ application && application.remarks.length > 0 ? 
    <>
    <div>
        <h3 className="mt-5">Application Remarks</h3>
    </div>
<div className="card student-table mb-5">
<div className="row">
    <div className="col-2">
        <h6>Commenter</h6>
    </div>
    <div className="col-4">
        <h6>Remarks</h6>
    </div>
    <div className="col-2">
        <h6>Email</h6>
    </div>
    <div className="col-2">
        <h6>Position</h6>
    </div>
    <div className="col-1">
        <h6>Date</h6>
    </div>
    <div className="col-1">
        <h6>Step Given</h6>
    </div>
</div>

<br />

{ (application && application.remarks.length > 0) ?
    [...application.remarks].reverse().map((remark, index) => {
        return (
            <div className="row student-data">
            <div className="col-2">
                <p>{remark.commenter ? `${remark.commenter.first_name.charAt(0)}${remark.commenter.middle_name.charAt(0)}${remark.commenter.last_name}`.toUpperCase() : `Resigned`}</p>
            </div>
            <div className="col-4">
                <p>{remark.remark}</p>
            </div>
            <div className="col-2">
                <p className="small"> {remark.commenter ? remark.commenter.email : `icsregcom.uplb@up.edu.ph`} </p>
            </div>
            <div className="col-2">
                <p>{remark.step_given == 1 ? "Adviser" : "Clearance Officer"}</p>
            </div>
            <div className="col-1">
                <p>{new Date(remark.date).toLocaleDateString()}</p>
            </div>
            <div className="col-1">
                <p>{remark.step_given}</p>
            </div>
        </div>
        )
    })
     :
    <></>
}



</div>
</>
:
<></>

                        }


                </div>

               

            </>
        </div>
    )
}