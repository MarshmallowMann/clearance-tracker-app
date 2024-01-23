import { Navigate, useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/navbar";
import { useEffect, useState } from "react";


export default function ClearanceApplication(props) {
    const location = useLocation();
    const navigate = useNavigate();

    const [appId, setAppId] = useState(location.state)
    const [application, setApplication] = useState(null)
    const [adviser, setAdviser] = useState(null)
    const [student, setStudent] = useState(null)
    const [didChange, setDidChange] = useState(false)


    useEffect(() => {
        fetch("http://localhost:3001/student/view-single-application",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    application_id: appId
                })
            })
            .then(response => response.json())
            .then(body => {
                //console.log(body)

                setApplication(body.application)
                setAdviser(body.adviser)
                setStudent(body.student[0])

            })
    }, [appId, didChange])

    const printApp = () => {
        fetch("http://localhost:3001/student/print-application",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    application_id: appId
                })
            })
            .then(async response => {
                const blob = await response.blob();
                const file = new Blob([blob], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            })
            .then(body => {
                console.log(body)
            })
    }

    if (!location.state) {
        return <Navigate replace to="/" />;
    }

    function resubmit() {
        fetch("http://localhost:3001/student/resubmit-at-curr-step",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    application_id: appId,
                    step: application.step == 2 ? 1
                    : 3,
                    remark: application.step == 2 ? document.getElementById('adviser-remark').value
                        : document.getElementById('clearance-officer-remark').value,
                    commenter: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).user._id : adviser
                })
            })
            .then(response => response.json())
            .then(body => {
                console.log(body);
                window.location.reload(true);
            }
            )
    }

    return (
        <>
            <NavBar />

            <div className="container mt-4">
                <h2>Clearance Applications</h2>
                <p><span className="fw-bold">Status: </span>Pending</p>

                <div className="card student-table">
                    <div className="row">
                        <div className="col-2">
                            <h6>Student Number</h6>
                        </div>
                        <div className="col-3">
                            <h6>Name</h6>
                        </div>
                        <div className="col-3">
                            <h6>UP Mail</h6>
                        </div>
                        <div className="col-2">
                            <h6>Adviser</h6>
                        </div>
                        <div className="col-1">
                            <h6>Date</h6>
                        </div>
                        <div className="col-1">
                            <h6>Step</h6>
                        </div>
                    </div>
                    <br />

                    {(application && student) ?
                        <div className="row student-data">
                            <div className="col-2">
                                <p>{student.student_number}</p>
                            </div>
                            <div className="col-3">
                                <p> {`${student.last_name}, ${student.first_name} ${student.middle_name}`}</p>
                            </div>
                            <div className="col-3">
                                <p>{student.email}</p>
                            </div>
                            <div className="col-2">
                                <p>{adviser ? `${adviser.first_name.charAt(0)}${adviser.middle_name.charAt(0)}${adviser.last_name}`.toUpperCase() : "N/A"}</p>
                            </div>
                            <div className="col-1">
                                <p>{new Date(application.student_submission.date).toLocaleDateString()}</p>
                            </div>
                            <div className="col-1">
                                <p>{application.step}</p>
                            </div>
                        </div>
                        : <></>}


                </div>
                <div>
                    <h3 className="mt-5">Application Steps</h3>
                </div>


                {(application && application.step >= 1) ?
                    <div className="card mt-4 clearance-app">
                        <div className="row">
                            <div className="col-10 step-title">
                                <h5>Step 1: Pre-Submission to Adviser</h5>
                            </div>
                            <div className="col-2">
                                <button type="button" className="btn btn-secondary" data-bs-toggle="collapse"
                                    data-bs-target="#s1-details">View Details</button>
                            </div>
                        </div>
                        <div id="s1-details" className="collapse s-details">
                            <hr />
                            <div className="input-group mb-3">
                                <span className="input-group-text fw-bold">Link Submission:</span>
                                <input type="text" className="form-control" placeholder="GitHub Link" name="githubLink" disabled defaultValue={application.student_submission.link} />
                            </div>
                            <p className="text-center mt-4"><span className="fw-bold">Submitted To: </span>{adviser ? `${adviser.first_name.charAt(0)}${adviser.middle_name.charAt(0)}${adviser.last_name}`.toUpperCase() : "N/A"}</p>
                        </div>
                    </div>
                    :
                    <></>}

                {(application && application.step >= 2) ?
                    <div className="card mt-4 clearance-app">
                        <div className="row">
                            <div className="col-10 step-title">
                                <h5>Step 2: Adviser Review</h5>
                            </div>
                            <div className="col-2">
                                <button type="button" className="btn btn-secondary" data-bs-toggle="collapse"
                                    data-bs-target="#s2-details">View Details</button>
                            </div>
                        </div>
                        <div id="s2-details" className="collapse s-details">
                            <hr />
                            <div className="card app-status">
                                <p className="text-center"><span className="fw-bold">Status: </span>  {(application.step === 2) ? "Pending" : "Approved"}  </p>
                            </div>
                            <p><span className="fw-bold">Link Submitted: </span>{application.student_submission.link}</p>
                            <p><span className="fw-bold">Evaluated by: </span>{adviser ? `${adviser.first_name.charAt(0)}${adviser.middle_name.charAt(0)}${adviser.last_name}`.toUpperCase() : "N/A"}</p>
                            {
                                application.step == 2 && JSON.parse(localStorage.getItem('user'))?.user.user_type == "approver" ?
                                    <>
                                        <div className="text-center">
                                            <button className="btn btn-success me-2" onClick={
                                                () => {
                                                    // Call API to update application status to cleared
                                                    // http://localhost:3001/student/clear-application
                                                    fetch("http://localhost:3001/approver/approve-application",
                                                        {
                                                            method: "POST",
                                                            headers: {
                                                                "Content-Type": "application/json"
                                                            },
                                                            body: JSON.stringify({
                                                                application_id: appId
                                                            })
                                                        }).then(response => response.json())
                                                        .then(body => {
                                                            if (body.success) {
                                                                setDidChange(!didChange)
                                                            }
                                                        })
                                                }
                                            }   >Approve</button>
                                            <button type="button" className="btn btn-danger" data-bs-toggle="modal"
                                                data-bs-target="#clearance-modal1" onClick={() => { }}>Reject</button>
                                        </div>
                                        <div className="modal fade" id="clearance-modal1">
                                            <div className="modal-dialog">
                                                <div className="modal-content">

                                                    <div className="modal-header modalDetails">
                                                        <h4 className="modal-title" id="modal-title">Reject Submission</h4>
                                                    </div>

                                                    <div className="container modalDetails">
                                                    <p className="mt-2">You are about to disapprove student clearance application.</p>
                                                        <p>Please enter a remark.</p>
                                                        <div class="input-group">
                                                            {/* <span htmlFor="adviser-remark" class="input-group-addon">Remarks</span> */}
                                                            <input id="adviser-remark" type="text" class="form-control" name="adviser-remark" placeholder="Adviser Remarks" />
                                                        </div>
                                                        <p className="fw-bold mt-3">Are you sure about this?</p>


                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-danger yes" data-bs-dismiss="modal" onClick={() => {
                                                                resubmit()
                                                            }}>Yes</button>
                                                            <button type="button" className="btn btn-success exit" data-bs-dismiss="modal">Exit</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                        </>


                                        :
                                        <></>
                            }
                                    </div>
                        </div>
                        :
                        <></>
                }


                        {(application && application.step >= 3) ?
                            <div className="card mt-4 clearance-app">
                                <div className="row">
                                    <div className="col-10 step-title">
                                        <h5>Step 3: Pre-Submission to Clearance Officer</h5>
                                    </div>
                                    <div className="col-2">
                                        <button type="button" className="btn btn-secondary" data-bs-toggle="collapse"
                                            data-bs-target="#s3-details">View Details</button>
                                    </div>
                                </div>
                                <div id="s3-details" className="collapse s-details">
                                    <hr />
                                    <p><span className="fw-bold">Link Submitted: </span>{application.student_submission.link}</p>
                                    <p><span className="fw-bold">Evaluated by: </span>{adviser ? `${adviser.first_name.charAt(0)}${adviser.middle_name.charAt(0)}${adviser.last_name}`.toUpperCase() : "N/A"}</p>
                                    <p><span className="fw-bold ">Status: </span>{application.step > 3 ? `Submitted to Clearance Officer` : `Waiting Submission to Clearance Officer`}</p>
                                </div>
                            </div>
                            :
                            <></>
                        }


                        {
                            (application && application.step >= 4) ?
                                <div className="card mt-4 clearance-app">
                                    <div className="row">
                                        <div className="col-10 step-title">
                                            <h5>Step 4: Clearance Officer Review</h5>
                                        </div>
                                        <div className="col-2">
                                            <button type="button" className="btn btn-secondary" data-bs-toggle="collapse"
                                                data-bs-target="#s4-details">View Details</button>
                                        </div>
                                    </div>
                                    <div id="s4-details" className="collapse s-details">
                                        <hr />
                                        <div className="card app-status">
                                            <p className="text-center"><span className="fw-bold">Status: </span> {application.step > 4 ? "Cleared" : "Pending Approval"}</p>
                                        </div>
                                        <p><span className="fw-bold">Link Submitted: </span>{application.student_submission.link}</p>
                                        <p><span className="fw-bold">Evaluated by: </span>ICS Registration Committee</p>
                                        {
                                            application.step == 4 && JSON.parse(localStorage.getItem('user'))?.user.user_type == "Clearance Officer" ?
                                                <>
                                                    <div className="text-center">
                                                        <button className="btn btn-success me-2" onClick={
                                                            () => {
                                                                // Call API to update application status to cleared
                                                                // http://localhost:3001/student/clear-application
                                                                fetch("http://localhost:3001/student/clear-application",
                                                                    {
                                                                        method: "POST",
                                                                        headers: {
                                                                            "Content-Type": "application/json"
                                                                        },
                                                                        body: JSON.stringify({
                                                                            application_id: appId
                                                                        })
                                                                    }).then(response => response.json())
                                                                    .then(body => {
                                                                        if (body._id) {
                                                                            setDidChange(!didChange)
                                                                        }
                                                                    })
                                                            }
                                                        }   >Approve</button>
                                                        <button type="button" className="btn btn-danger" data-bs-toggle="modal"
                                                            data-bs-target="#clearance-modal" onClick={() => { }}>Reject</button>
                                                    </div>
                                                    <div className="modal fade" id="clearance-modal">
                                            <div className="modal-dialog">
                                                <div className="modal-content">

                                                    <div className="modal-header modalDetails">
                                                        <h4 className="modal-title" id="modal-title">Reject Submission</h4>
                                                    </div>

                                                    <div className="container modalDetails">
                                                        <p className="mt-2">You are about to disapprove student clearance application.</p>
                                                        <p>Please enter a remark.</p>
                                                        <div class="input-group">
                                                            {/* <span htmlFor="adviser-remark" class="input-group-addon">Remarks</span> */}
                                                            <input id="clearance-officer-remark" type="text" class="form-control" name="clearance-officer-remark" placeholder="Adviser Remarks" />
                                                        </div>
                                                        <p className="fw-bold mt-3">Are you sure about this?</p>


                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-danger yes" data-bs-dismiss="modal" onClick={() => {
                                                                resubmit()
                                                            }}>Yes</button>
                                                            <button type="button" className="btn btn-success exit" data-bs-dismiss="modal">Exit</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                                </>
                                                :


                                                <></>
                                        }

                                    </div>
                                </div>
                                :
                                <></>
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







                        {application && application.remarks.length > 0 ?
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

                                    {(application && application.remarks.length > 0) ?
                                        [...application.remarks].reverse().map((remark, index) => {
                                            return (
                                                <div className="row student-data">
                                                    <div className="col-2">
                                                        <p>{remark.commenter ? `${remark.commenter.first_name.charAt(0)}${remark.commenter.middle_name.charAt(0)}${remark.commenter.last_name}`.toUpperCase() : "Resigned"}</p>
                                                    </div>
                                                    <div className="col-4">
                                                        <p>{remark.remark}</p>
                                                    </div>
                                                    <div className="col-2">
                                                        <p className=""> {remark.commenter ? remark.commenter.email : "N/A"} </p>
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
            );
}