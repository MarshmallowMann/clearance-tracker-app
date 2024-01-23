import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import NavBar from "../components/navbar";


export default function AdminManageStudentApplication() {
    const navigate = useNavigate();

    const [listPendingStudents, setListPendingStudents] = useState([]);
    const [listAdvisers, setListAdvisers] = useState({});

    const toManageStudents = () => {
        navigate('/admin-manage-students', { state: {} });
    }

    useEffect(() => {
        fetch("http://localhost:3001/view-pending-accounts")
            .then(res => res.json())
            .then(data => {
                setListPendingStudents(data);
            })
    }, []);

    useEffect(() => {
        fetch("http://localhost:3001/list-approvers")
            .then(res => res.json())
            .then(data => {
                setListAdvisers(data);
            })
    }, []);

    function approveStudentApp(std_num) {

        fetch("http://localhost:3001/approve-student",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    student_number: std_num
                })
            })
            .then(response => response.json())
            .then(body => {
                window.location.reload(true);
            })
    }

    function rejectStudentApp(std_num) {
        fetch("http://localhost:3001/reject-student",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    student_number: std_num
                })
            })
            .then(response => response.json())
            .then(body => {
                window.location.reload(true);
            })
    }


    const sortByNameAsc = () => {
        let sorted = [...listPendingStudents];
        sorted.sort((a, b) => {
          return a.last_name.localeCompare(b.last_name);
        });
        setListPendingStudents(sorted);
      }

    const sortByStudNumeAsc = () => {
    let sorted = [...listPendingStudents];
    sorted.sort((a, b) => {
        return a.student_number.localeCompare(b.student_number);
    });
    setListPendingStudents(sorted);
    }

    const searchByNameOrStudentNumber = (input) => {
        let sorted = [];
        fetch(`http://localhost:3001/view-pending-accounts`)
        .then((response) => response.json())
        .then((body) => {
          sorted = body;
          sorted = sorted.filter((a) => {
            return `${a.last_name} ${a.first_name} ${a.middle_name} ${a.student_number}`.toLowerCase().includes(input.toLowerCase());
          });
          setListPendingStudents(sorted);
    
        })
    };


    return (
        <>
            <NavBar />
            <div className="container mt-4">
                <h2>Student Account Applications</h2>
                <p>This is the overview of pending applications for student accounts.</p>
                <form>
                    <div className="row">
                        <div className="col-8">
                            <input type="text" className="form-control student-input" placeholder="Enter Name or Student Number"
                                name="student" />
                        </div>

                        <div className="col-2">
                            <div className="dropdown">
                                <button type="button" className="btn btn-warning dropdown-toggle student-btn"
                                    data-bs-toggle="dropdown">
                                    Sort by
                                </button>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#" onClick={sortByNameAsc}>Student Name</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={sortByStudNumeAsc}>Student Number</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-2">
                            <button type="button" className="btn btn-primary student-btn" onClick={
                                () => {
                                    const input = document.querySelector(".student-input").value;
                                    searchByNameOrStudentNumber(input);
                                }
                            }>
                                Search
                            </button>
                        </div>
                    </div>
                </form>
                <div className="card student-table">
                    <div className="row">
                        <div className="col-3">
                            <h6>Student Number</h6>
                        </div>
                        <div className="col-3">
                            <h6>Name</h6>
                        </div>
                        <div className="col-3">
                            <h6>UP Mail</h6>
                        </div>
                        <div className="col-3">
                            <h6>Accept / Reject</h6>
                        </div>
                    </div>
                    <br />

                    {
                        listPendingStudents?.map(stud => (
                            <>
                                <div className="row student-data">
                                    <div className="col-3">
                                        <p>{stud.student_number}</p>
                                    </div>
                                    <div className="col-3">
                                        <p>{stud.last_name}, {stud.first_name}, {stud.middle_name}</p>
                                    </div>
                                    <div className="col-3">
                                        <p>{stud.email}</p>
                                    </div>
                                    {
                                        stud.user_status == "pending" ?
                                            <div className="col-3">
                                                <button type="button" onClick={() => {
                                                    approveStudentApp(stud.student_number);
                                                }
                                                } className="btn btn-success" data-bs-toggle="tooltip" title="Approve">✓</button>
                                                <button type="button" onClick={() => {
                                                    rejectStudentApp(stud.student_number);
                                                }
                                                } className="btn btn-danger m-2" data-bs-toggle="tooltip" title="Disapprove">X</button>
                                            </div>
                                            : stud.user_status == "approved" ?
                                                <div className="col-3">
                                                    <div className="card student-status approved">Approved</div>
                                                </div>
                                                :
                                                <div className="col-3">
                                                    <div className="card student-status disproved">Disapproved</div>
                                                </div>
                                    }

                                </div>

                            </>
                        ))
                    }

                    <ul className="pagination student-pagination">
                        <li className="page-item"><a className="page-link" href="#">Previous</a></li>
                        <li className="page-item active"><a className="page-link veh" href="#">1</a></li>
                        <li className="page-item"><a className="page-link" href="#">2</a></li>
                        <li className="page-item"><a className="page-link" href="#">3</a></li>
                        <li className="page-item"><a className="page-link" href="#">Next</a></li>
                    </ul>
                </div>
                <button type="button" className="btn btn-primary student-btn-manage" onClick={toManageStudents}>Manage Active Student Accounts</button>
            </div>
        </>
    );
}