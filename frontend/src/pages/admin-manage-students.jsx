import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import NavBar from "../components/navbar";


export default function AdminManageStudents() {
    const navigate = useNavigate();


    const [listApprovedStudents, setListApprovedStudents] = useState();

    const toClearanceApplication = () => {
        navigate('/admin-clearance-application', { state: {} });
    }

    const [seed, setSeed] = useState(1);
    const reset = () => {
        setSeed(Math.random());
    }

    useEffect(() => {
        reset();
    }, [listApprovedStudents])

    useEffect(() => {
        fetch("http://localhost:3001/view-approved-accounts")
            .then(res => res.json())
            .then(data => {
                setListApprovedStudents(data);
                console.log(data);
            })
    }, []);


    const sortByNameAsc = () => {
        let sorted = [...listApprovedStudents];
        sorted.sort((a, b) => {
          return a.last_name.localeCompare(b.last_name);
        });
        setListApprovedStudents(sorted);
      }

    const sortByStudNumeAsc = () => {
    let sorted = [...listApprovedStudents];
    sorted.sort((a, b) => {
        return a.student_number.localeCompare(b.student_number);
    });
    setListApprovedStudents(sorted);
    }

    const searchByNameOrStudentNumber = (input) => {
        let sorted = [];
        fetch(`http://localhost:3001/view-approved-accounts`)
        .then((response) => response.json())
        .then((body) => {
          sorted = body;
          sorted = sorted.filter((a) => {
            return `${a.last_name} ${a.first_name} ${a.middle_name} ${a.student_number}`.toLowerCase().includes(input.toLowerCase());
          });
          setListApprovedStudents(sorted);
    
        })
    };



    

    return (
        <>
            <NavBar />
            <div className="container mt-4">
                <h2>Active Student Account</h2>
                <p>This is the overview of student active accounts</p>
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
                                    let input = document.getElementsByName("student")[0].value
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
                    </div>
                    <br />

                    {
                        listApprovedStudents?.map(stud => (
                            <>
                         {console.log(stud)}
                                <div className="row student-data">
                                    <div className="col-2">
                                        <p>{stud.student_number}</p>
                                    </div>
                                    <div className="col-3">
                                        <p>{stud.last_name}, {stud.first_name}, {stud.middle_name}</p>
                                    </div>
                                    <div className="col-3">
                                        <p>{stud.email}</p>
                                    </div>
                                    <AdviserDropDown key={seed} stud={stud} />
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
                <button type="button" className="btn btn-primary student-btn-manage" onClick={toClearanceApplication}>View Clearance Applications</button>
            </div>
        </>
    );
}

function AdviserDropDown(stud) {
    const [selectedAdviser, setSelectedAdviser] = useState(null);
    const [listApprovers, setListApprovers] = useState();
    const [isAssigned, setAssigned] = useState(false);
    const [isChangeAdviser, setChangeAdviser] = useState(false);

    console.log(stud)
    console.log(stud.stud.adviser);


    useEffect(() => {
        fetch("http://localhost:3001/list-approvers")
            .then(res => res.json())
            .then(data => {
                setListApprovers(data);
               
                for (var approver in data) {
                    if (stud.stud.adviser == data[approver]._id) {
                        setSelectedAdviser(data[approver])
                        setAssigned(true)
                    }
                }
            })
    }, [stud.stud]);


    console.log(selectedAdviser, stud.stud.adviser)


    return (
        <>
            <div className="col-2">
                <div className="dropdown">
                    {
                        isAssigned ?
                            <button type="button" className="btn btn-outline student-btn">
                                {
                                    selectedAdviser == null || selectedAdviser == NaN ?
                                        "None" :
                                        selectedAdviser?.first_name[0].toUpperCase() +
                                        selectedAdviser?.middle_name[0].toUpperCase() +
                                        selectedAdviser?.last_name
                                }
                            </button>
                            :
                            <button type="button" className="btn btn-outline dropdown-toggle student-btn"
                                data-bs-toggle="dropdown">
                                {
                                    selectedAdviser == null || selectedAdviser == NaN ?
                                        "None" :
                                        selectedAdviser?.first_name[0].toUpperCase() +
                                        selectedAdviser?.middle_name[0].toUpperCase() +
                                        selectedAdviser?.last_name
                                }
                            </button>
                    }

                    <ul className="dropdown-menu">
                        <li><button className="dropdown-item" onClick={() => (setSelectedAdviser(null))}>None</button></li>

                        {
                            listApprovers?.map((approver) => (
                                <li><button className="dropdown-item" onClick={() => (setSelectedAdviser(approver))}> 
                                    {
                                    approver?.first_name[0].toUpperCase() +
                                    approver?.middle_name[0].toUpperCase() +
                                    approver?.last_name
                                    }

                                    </button></li>
                            )
                            )
                        }
                    </ul>
                </div>
            </div>
            <div className="col-2">
                {
                    selectedAdviser == null ?
                        <>
                            <button type="button" className="btn btn-secondary" data-bs-toggle="modal"
                                data-bs-target="#warning-modal" onClick={() => { }}>Assign</button>

                            <div className="modal fade" id="warning-modal">
                                <div className="modal-dialog">
                                    <div className="modal-content">

                                        <div className="modal-header modalAssign">
                                            <h4 className="modal-title" id="modal-title">Error: Cannot Assign Adviser</h4>
                                        </div>

                                        <div className="container modalDetails">
                                            <p className="mt-2">You must assign an adviser to the student</p>


                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-danger exit" data-bs-dismiss="modal">Exit</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>

                        : stud.stud.adviser == "" || stud.stud.adviser == null || isChangeAdviser ?
                            <button className="btn btn-success" onClick={() => {
                                // console.log(stud.stud.first_name);

                                fetch("http://localhost:3001/assign-adviser",
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            employee_number: selectedAdviser?.employee_number,
                                            student_number: stud.stud.student_number
                                        })
                                    })
                                    .then(response => response.json())
                                    .then(body => {
                                        setAssigned(true)
                                        setChangeAdviser(false);
                                        window.location.reload(true);
                                    }
                                    );

                            }}>
                                Assign
                            </button>
                            :
                            <button type="button" className="btn btn-light" onClick={() => {
                                setAssigned(false)
                                setSelectedAdviser(null)
                                setChangeAdviser(true)
                            }}>
                                Change Adviser
                            </button>

                }
            </div >

        </>
    );
}