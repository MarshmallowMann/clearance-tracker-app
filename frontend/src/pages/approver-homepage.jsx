import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../components/navbar";
import { useEffect, useState } from "react";

export default function ApproverHomePage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [listApplications, setListApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [listApprovers, setListApprovers] = useState(null)

    const toStudentApplication = () => {
        console.log(selectedApplication);
        navigate('/clearance-application', { state: {selectedApplication} })
    }

    const approver = JSON.parse(localStorage.getItem('user'))
    // console.log(approver.user.first_name)

    useEffect(() => {
        fetch("http://localhost:3001/list-approvers")
            .then(res => res.json())
            .then(data => {
                setListApprovers(data);
                // console.log(listApprovers);
            })
    }, []);

    useEffect(() => {
        fetch("http://localhost:3001/approver/view-pending-applications",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    approver_id: approver.user._id
                })
            })
            .then(response => response.json())
            .then(body => {
                setListApplications(body)
            }
            )
    }, []);

    const searchByNameOrStudentNumber = (input, type) => {
        let sorted = [];
        fetch(`http://localhost:3001/approver/view-pending-applications`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                approver_id: approver.user._id
            })
        })
        .then((response) => response.json())
        .then((body) => {
          sorted = body;
          if(type == "student_name"){
            sorted = sorted.filter((a) => {
                return `${a.last_name} ${a.first_name} ${a.middle_name} ${a.student_number}`.toLowerCase().includes(input.toLowerCase());
              });
          }else{
            sorted = sorted.filter((a) => {
                return `${a.student_number}`.toLowerCase().includes(input.toLowerCase());
              });
          }
          setListApplications(sorted);
        })
    };

    const filterSearch = (input, type) => {
        let sorted = [];
        fetch(`http://localhost:3001/approver/view-pending-applications`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                approver_id: approver.user._id
            })
        })
        .then((response) => response.json())
        .then((body) => {
          sorted = body;
          if(type == "date"){
            sorted = sorted.filter((a) => {
                return `${new Date(a.applications[a.applications.length-1]?.student_submission.date).toLocaleDateString()}`.toLowerCase().includes(input.toLowerCase());
              });
          }else if(type == "adviser"){
            var adviserSort = [...listApprovers]
            var adviserSort = adviserSort.filter((a) =>{
                return `${a.last_name} ${a.first_name} ${a.middle_name}`.toLowerCase().includes(input.toLowerCase());
            })

            var referenceAdviser = [];

            for(var i in adviserSort){
                referenceAdviser.push(adviserSort[i]._id)
            }

            var sortedRef = [];

            for(var j = 0; j < sorted.length; j++){
                for(var k = 0; k < referenceAdviser.length; k++){
                    if(referenceAdviser[k] == sorted[j].adviser){
                        sortedRef.push(sorted[j]);
                    }
                }
            }

            sorted = sortedRef;
          }else if(type == "step"){
            sorted = sorted.filter((a) => {
                return `${a.applications[0]?.step}`.toLowerCase().includes(input.toLowerCase());
              });
          }else if(type == "status"){
            sorted = sorted.filter((a) => {
                return `${a.applications[0]?.status}`.toLowerCase().includes(input.toLowerCase());
              });
          }

          setListApplications(sorted);
        })
    };

    const sortByNameAsc = () => {
        let sorted = [...listApplications];
        sorted.sort((a, b) => {
          return a.last_name.localeCompare(b.last_name);
        });
        setListApplications(sorted);
      }

      const sortByNameDesc = () => {
        let sorted = [...listApplications];
        sorted.sort((a, b) => {
          return a.last_name.localeCompare(b.last_name);
        });
        setListApplications(sorted.reverse());
      }

      const sortByDateAsc = () => {
        let sorted = [...listApplications];
       
        // console.log(listApplications[0].applications[0].student_submission.date);

        sorted.sort((a, b) => {
          return (
            new Date(a.applications[0]?.student_submission.date) -
            new Date(b.applications[0]?.student_submission.date)
          );

        });
        console.log(sorted);
        setListApplications(sorted);
      }

      const sortByDateDesc = () => {
        let sorted = [...listApplications];
        
        sorted.sort((a, b) => {
          return (
            new Date(b.applications[0]?.student_submission.date) -
            new Date(a.applications[0]?.student_submission.date)
          );
        });
        setListApplications(sorted);
      }
    

    return (
        <>
            <NavBar />
            <div className="container mt-4">
                <h2>Welcome to the Approver Page!</h2>
                <p>Below are the clearance applications for your approval.</p>
                <form>
                    <div className="row">
                        <div className="col-6">
                            <input type="text" className="form-control student-input" placeholder="Enter Query"
                                name="student" id="student" />
                        </div>
                        <div className="col-2">
                            <div className="dropdown">
                                <button type="button" className="btn btn-warning dropdown-toggle student-btn"
                                    data-bs-toggle="dropdown">
                                    Search by
                                </button>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#" onClick={() => {
                                        searchByNameOrStudentNumber(document.getElementById('student').value, "student_name")
                                    }}>Student Name</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={() => {
                                        searchByNameOrStudentNumber(document.getElementById('student').value, "student_number")
                                    }}>Student Number</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="dropdown">
                                <button type="button" className="btn btn-warning dropdown-toggle student-btn"
                                    data-bs-toggle="dropdown">
                                    Sort by
                                </button>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#" onClick={sortByNameAsc}>Ascending Student Name</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={sortByNameDesc}>Descending Student Name</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={sortByDateAsc}>Ascending Date</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={sortByDateDesc}>Descending Date</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="dropdown">
                                <button type="button" className="btn btn-warning dropdown-toggle student-btn"
                                    data-bs-toggle="dropdown">
                                    Filter by
                                </button>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#" onClick={() => {filterSearch(
                                        document.getElementById('student').value, "date"
                                    )}}>Date</a></li>

                                    <li><a className="dropdown-item" href="#" onClick={() => {filterSearch(
                                        document.getElementById('student').value, "adviser"
                                    )}}>Adviser</a></li>

                                    <li><a className="dropdown-item" href="#" onClick={() => {filterSearch(
                                        document.getElementById('student').value, "step"
                                    )}}>Step</a></li>

                                    <li><a className="dropdown-item" href="#" onClick={() => {filterSearch(
                                        document.getElementById('student').value, "status"
                                    )}}>Status</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </form>

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
                            <h6>Date</h6>
                        </div>
                        <div className="col-1">
                            <h6>Step</h6>
                        </div>
                        <div className="col-1">
                            <h6>Details</h6>
                        </div>
                    </div>
                    <br />

                    {
                        listApplications?.map((app) => (
                            // console.log(app.applications[app.applications.length-1]),
                            app.applications.length > 0 && app.applications[app.applications.length-1].status == "Pending" ?
                            <>
                                <div className="row student-data">
                                    <div className="col-2">
                                        <p>{app.student_number}</p>
                                    </div>
                                    <div className="col-3">
                                        <p>{app.last_name}, {app.first_name} {app.middle_name}</p>
                                    </div>
                                    <div className="col-3">
                                        <p>{app.email}</p>
                                    </div>
                                    <div className="col-2">
                                        <p>{new Date(app.applications[app.applications.length-1]?.student_submission.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="col-1">
                                        <p>{app.applications[app.applications.length-1]?.step}</p>
                                    </div>
                                    <div className="col-1">
                                        <button className="btn btn-secondary" onClick={() => (navigate('/clearance-application', { state: `${app.applications[app.applications.length-1]._id}` }))}>View</button>
                                    </div>
                                </div>
                            </>
                            :
                            <></>
                        ))
                    }



                    <ul className="pagination student-pagination">
                        <li className="page-item"><a className="page-link" href="/">Previous</a></li>
                        <li className="page-item active"><a className="page-link veh" href="/">1</a></li>
                        <li className="page-item"><a className="page-link" href="/">2</a></li>
                        <li className="page-item"><a className="page-link" href="/">3</a></li>
                        <li className="page-item"><a className="page-link" href="/">Next</a></li>
                    </ul>
                </div>

            </div>
        </>
    );
}