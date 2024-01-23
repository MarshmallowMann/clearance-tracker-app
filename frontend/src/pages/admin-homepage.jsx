import NavBar from "../components/navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AdminHomepage() {
    const navigate = useNavigate();
    
    const [counts, setCounts] = useState({});


    const toManageStudent = () => {
        navigate('/admin-manage-students', {state: {}});
    }

    const toManageStudentApplications = () => {
        navigate('/admin-manage-students-application', {state: {}});
    }

    const toManageApprover = () => {
        navigate('/admin-manage-approver', {state: {}});
    }

    const toClearanceApplication = () => {
        navigate('/admin-clearance-application', {state: {}});
    }


    // Get Counts
    useEffect(() => {
        fetch("http://localhost:3001/get-counts")
        .then(res => res.json())
        .then(data => {
            setCounts(data);
        })

    }, [])


    const handleUpload = (e) => {
        e.preventDefault();
        // Get csv file from form input
        const csvFile = document.querySelector('input[name="csvFile"]').files[0];
        // Console log

        if (!csvFile) {
            alert("No file uploaded!");
            return;
        }
        console.log(csvFile);

        const fileReader = new FileReader();
        
        // Read each line of the csv file
        fileReader.readAsText(csvFile);
        fileReader.onload = (e) => {
            const file = e.target.result;
            const allLines = file.split(/\r\n|\n/);

            const data = [];
            for (let i = 0; i < allLines.length; i++) {
                data.push(allLines[i].split(','));
            }
            fetch("http://localhost:3001/upload-csv",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: data
                })
            }
            ).then(res => res.json())
            .then(body => {
                if (body.success) {
                    alert("Upload successful!");
                    window.location.reload(true);
                } else {
                    alert("Error uploading file!");
                }
            })
            };
    }


    return (
        <>
        <NavBar />
        <div className="container mt-4">
            <h2>Welcome Administrator!</h2>
            <p>This is the overview of pending applications, active accounts, and clearance requests.</p>
            <div className="row admin-row">
                <div className="col-6 info">
                    <div className="card admin-card">
                        <div className="card-body">
                            <h1>{counts.pendingStudents}</h1>
                            <p>Pending Student Accounts</p>
                            <button className="btn btn-warning admin-btn" onClick={toManageStudentApplications}>Manage</button>
                        </div>
                    </div>
                </div>
                <div className="col-6 info">
                    <div className="card admin-card">
                        <div className="card-body">
                            <h1>{counts.students}</h1>
                            <p>Approved Student Accounts</p>
                            <button className="btn btn-warning admin-btn" onClick={toManageStudent}>Manage</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row admin-row">
                <div className="col-6 info">
                    <div className="card admin-card">
                        <div className="card-body">
                            <h1>{counts.applications}</h1>
                            <p>Clearance Requests</p>
                            <button className="btn btn-warning admin-btn" onClick={toClearanceApplication}>Manage</button>
                        </div>
                    </div>
                </div>
                <div className="col-6 info">
                    <div className="card admin-card">
                        <div className="card-body">
                            <h1>{counts.advisers}</h1>
                            <p>Active Approver Accounts</p>
                            <button className="btn btn-warning admin-btn" onClick={toManageApprover}>Manage</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="container">
    <h3 className="text-center">Upload CSV</h3>
    <div className="d-flex justify-content-center">
        <input type="file" name="csvFile" className="form-control mb-2 m-1" accept=".csv"/>
        <button name="csvUpload" className="btn btn-primary p-2" onClick={handleUpload}>Upload</button>
    </div>
    </div>
        </>
    );
}