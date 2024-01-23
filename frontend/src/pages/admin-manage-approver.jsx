import { useEffect, useState } from "react";
import NavBar from "../components/navbar";

export default function AdminManageApprover() {
    const [modalTitle, setModalTitle] = useState("");
    const [listApprovers, setListApprovers] = useState([]);
    const [selectedApprover, setSelectedApprover] = useState();


    useEffect(() => {
        fetch("http://localhost:3001/list-approvers")
            .then(res => res.json())
            .then(data => {
                setListApprovers(data);
                console.log(listApprovers);
            })
    }, []);


    function createApprover(e) {
        e.preventDefault();

        fetch("http://localhost:3001/create-approver",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    first_name: document.getElementById("fname").value,
                    middle_name: document.getElementById("mname").value,
                    last_name: document.getElementById("lname").value,
                    employee_number: document.getElementById("emp_num").value,
                    email: document.getElementById("email").value,
                    password: document.getElementById("pwd").value,
                    user_type: "approver",
                })
            })
            .then(response => response.json())
            .then(body => {
                if (body._id) {
                    clearApproverInput();
                    window.location.reload(true);
                    // alert("Successfully added approver account!");
                }
                else { alert("Account Creation Failed") }
            })
    }

    function clearApproverInput() {
        document.getElementById("fname").value = null;
        document.getElementById("mname").value = null;
        document.getElementById("lname").value = null;
        document.getElementById("emp_num").value = null;
        document.getElementById("email").value = null;
        document.getElementById("pwd").value = null;
    }

    function fillInput() {
        document.getElementById("emp_num").value = selectedApprover?.employee_number;
    }

    function deleteApprover() {
        fetch("http://localhost:3001/delete-approver",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    employee_number: selectedApprover.employee_number,
                })
            })
            .then(response => response.json())
            .then(window.location.reload(true))
    }

    function editApprover() {
        fetch("http://localhost:3001/edit-approver",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    employee_number: selectedApprover.employee_number,
                    newPassword: document.getElementById('pwd').value,
                })
            })
            .then(response => response.json())
            .then(window.location.reload(true))
    }

    // sort by name ascending
    const sortByNameAsc = () => {
        const sorted = [...listApprovers].sort((a, b) => { 
            return a.last_name.localeCompare(b.last_name) 
            });
        
        setListApprovers(sorted);
        }

    // sort by name ascending
    const sortByNameDesc = () => {
        const sorted = [...listApprovers].sort((a, b) => { 
            return b.last_name.localeCompare(a.last_name) 
            });
        
        setListApprovers(sorted);
        }

    const searchByName = (input) => {
        let sorted = [];
        fetch("http://localhost:3001/list-approvers")
            .then(res => res.json())
            .then(data => {
                sorted = data.filter((approver) => {
                    return `${approver.last_name}, ${approver.first_name} ${approver.middle_name}`.toLowerCase().includes(input.toLowerCase());
                    
                });
                setListApprovers(sorted);
            })
    }

        
        
    return (
        <>
            <NavBar />
            <div className="container mt-4">
                <h2>Approver Accounts</h2>
                <p>This is the list of details of approver accounts.</p>
                <form>
                    <div className="row">
                        <div className="col-8">
                            <input type="text" className="form-control student-input" placeholder="Enter Approver Name"
                                name="student" />
                        </div>
                        <div className="col-2">
                            <div className="dropdown">
                                <button type="button" className="btn btn-warning dropdown-toggle student-btn"
                                    data-bs-toggle="dropdown">
                                    Sort by
                                </button>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#" onClick={sortByNameAsc}>Ascending Order</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={sortByNameDesc}>Descending Order</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-2">
                            <button type="button" className="btn btn-primary student-btn" onClick={
                                ()=>{
                                let doc = document.getElementsByName("student")[0].value;
                                searchByName(doc);
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
                            <h6>Employee Number</h6>
                        </div>
                        <div className="col-3">
                            <h6>Name</h6>
                        </div>
                        <div className="col-3">
                            <h6>UP Mail</h6>
                        </div>
                        <div className="col-3">
                            <h6>Action</h6>
                        </div>
                    </div>
                    <br />

                    {
                        listApprovers?.map((approver) => (
                            <>
                                <div className="row student-data">
                                    <div className="col-3">
                                        <p>{approver.employee_number}</p>
                                    </div>
                                    <div className="col-3">
                                        <p>{approver.last_name}, {approver.first_name} {approver.middle_name}</p>
                                    </div>
                                    <div className="col-3">
                                        <p>{approver.email}</p>
                                    </div>
                                    <div className="col-3">
                                        <button type="button" className="btn btn-success edit" title="Edit"
                                            data-bs-toggle="modal" data-bs-target="#approver-modal"
                                            onClick={() => { setModalTitle("Update Approver Account"); setSelectedApprover(approver); fillInput() }}>Edit</button>

                                        <button type="button" className="btn btn-danger delete" title="Delete"
                                            data-bs-toggle="modal" data-bs-target="#approver-modal"
                                            onClick={() => { setModalTitle("Confirm Account Deletion"); setSelectedApprover(approver) }}>Delete</button>
                                    </div>
                                </div>
                            </>
                        ))
                    }


                    <ul className="pagination student-pagination">
                        <li className="page-item"><a className="page-link" >Previous</a></li>
                        <li className="page-item active"><a className="page-link veh" >1</a></li>
                        <li className="page-item"><a className="page-link" href="/" >2</a></li>
                        <li className="page-item"><a className="page-link" >3</a></li>
                        <li className="page-item"><a className="page-link">Next</a></li>
                    </ul>
                </div>

                <button type="button" className="btn btn-primary student-btn-manage" data-bs-toggle="modal"
                    data-bs-target="#approver-modal" onClick={() => { setModalTitle("Create Approver Account") }}>Create Approver Account</button>
            </div>

            <div className={modalTitle != "Confirm Account Deletion" ? "modal fade" : "modal fade approver-modal-delete"} id="approver-modal">
                <div className="modal-dialog">
                    <div className="modal-content">


                        <div className="modal-header">
                            <h4 className="modal-title" id="modal-title">{modalTitle}</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>

                        {
                            modalTitle != "Confirm Account Deletion" && modalTitle != "Update Approver Account" ?
                                <>
                                    <div className="container">
                                        <form>
                                            <div className="mb-3 mt-3">
                                                <label htmlFor="lname" className="label">Last Name:</label>
                                                <input type="text" id="lname" className="form-control" placeholder="Lastname"
                                                    name="lname" />
                                            </div>
                                            <div className="mb-3 mt-3">
                                                <label htmlFor="fname" className="label">First Name:</label>
                                                <input type="text" id="fname" className="form-control" placeholder="Firstname Name"
                                                    name="fname" />
                                            </div>
                                            <div className="mb-3 mt-3">
                                                <label htmlFor="mname" className="label">Middle Name:</label>
                                                <input type="text" id="mname" className="form-control" placeholder="Middle Name"
                                                    name="mname" />
                                            </div>
                                            <div className="mb-3 mt-3">
                                                <label htmlFor="emp_num" className="label">Employee Number:</label>
                                                <input type="email" id="emp_num" className="form-control" placeholder="Enter Employee Number" name="emp_num" />
                                            </div>
                                            <div className="mb-3 mt-3">
                                                <label htmlFor="email" className="label">UP Mail:</label>
                                                <input type="email" id="email" className="form-control" placeholder="Enter email" name="email" />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="pwd" className="label">Default Password:</label>
                                                <input type="password" id="pwd" className="form-control" placeholder="Enter password" name="pwd" />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-danger decline" data-bs-dismiss="modal">Decline</button>
                                        <button onClick={createApprover} type="button" className="btn btn-success save" data-bs-dismiss="modal">Save</button>
                                    </div>
                                </>
                                : modalTitle == "Update Approver Account" ?
                                    <>
                                        <div className="container">
                                            <form>
                                                <div className="mb-3 mt-3">
                                                    <label htmlFor="emp_num" className="label">Employee Number:</label>
                                                    <input type="email" id="emp_num" className="form-control" placeholder="Enter Employee Number" name="emp_num" disabled />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="pwd" className="label">Enter New Password:</label>
                                                    <input type="password" id="pwd" className="form-control" placeholder="Enter New Password" name="pwd" />
                                                </div>
                                            </form>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-danger decline" data-bs-dismiss="modal">Decline</button>
                                            <button onClick={editApprover} type="button" className="btn btn-success save" data-bs-dismiss="modal">Update</button>
                                        </div>
                                    </>


                                    :
                                    <>
                                        <div className="container">
                                            <p className="mt-2">You are about to delete an approver account.</p>
                                            <p className="fw-bold">Are you sure about this?</p>
                                        </div>

                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-danger yes" data-bs-dismiss="modal" onClick={deleteApprover}>Yes</button>
                                            <button type="button" className="btn btn-success exit" data-bs-dismiss="modal">Exit</button>
                                        </div>
                                    </>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}