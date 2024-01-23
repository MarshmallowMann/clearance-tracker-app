import { useNavigate } from "react-router-dom";
import NavBar from "../components/navbar";
import { useEffect, useState } from "react";
import Students from "../components/clearance-students";

export default function AdminClearanceApplication() {
  const navigate = useNavigate();

  const toManageStudents = () => {
    navigate("/admin-manage-students", { state: {} });
  };

  const toClearance = () => {
    navigate("/clearance-application", { state: {} });
  };

  const [student_applications, setStudent_applications] = useState([]);
  const [pending_applications, setPending_applications] = useState([]);

  // subject to change
  useEffect(() => {
    fetch(`http://localhost:3001/view-pending-accounts`)
      .then((response) => response.json())
      .then((body) => {
        setStudent_applications(body);
      });
  }, [student_applications.length]);

  // call http://localhost:3001/list-applications
  useEffect(() => {
    fetch(`http://localhost:3001/list-applications`)
      .then((response) => response.json())
      .then((body) => {
        setPending_applications(body);
        console.log(body);
      });
  }, []);  // If glitching try: pending_applications.length

  const sortByDateDesc = () => {
    let sorted = [...pending_applications];
    sorted.sort((a, b) => {
      return (
        new Date(b.applicationContent[0].student_submission.date) -
        new Date(a.applicationContent[0].student_submission.date)
      );
    });
    setPending_applications(sorted);
  }

  const sortByDateAsc = () => {
    let sorted = [...pending_applications];
   
    sorted.sort((a, b) => {
      return (
        new Date(a.applicationContent[0].student_submission.date) -
        new Date(b.applicationContent[0].student_submission.date)
      );
    });
    console.log(sorted);
    setPending_applications(sorted);
  }

  const sortByNameAsc = () => {
    let sorted = [...pending_applications];
    sorted.sort((a, b) => {
      return a.student.last_name.localeCompare(b.student.last_name);
    });
    setPending_applications(sorted);
  }

  const sortByNameDesc = () => {
    let sorted = [...pending_applications];
    sorted.sort((a, b) => {
      return b.student.last_name.localeCompare(a.student.last_name);
    });
    setPending_applications(sorted);
  }

  const searchByName = (input) => {
    let sorted = [];
    fetch(`http://localhost:3001/list-applications`)
    .then((response) => response.json())
    .then((body) => {
      sorted = body;
      sorted = sorted.filter((a) => {
        return `${a.student.last_name} ${a.student.first_name} ${a.student.middle_name}`.toLowerCase().includes(input.toLowerCase());
      });
      setPending_applications(sorted);

    })
    
  };


  const searchByStudentNumber = (input) => {
    let sorted = [];
    fetch(`http://localhost:3001/list-applications`)
    .then((response) => response.json())
    .then((body) => {
      sorted = body;
      sorted = sorted.filter((a) => {
        return `${a.student.student_number}`.toLowerCase().includes(input.toLowerCase());
      });
      setPending_applications(sorted);

    })
  };  

  return (
    <>
      <NavBar />
      <div className="container mt-4">
        <h2>Clearance Applications</h2>
        <p>Here are the details for the clearance applications.</p>
        <form>
          <div className="row">
            <div className="col-8">
              <input
                type="text"
                className="form-control student-input"
                placeholder="Enter Name or Student Number"
                name="student"
              />
            </div>
            <div className="col-2">
              <div className="dropdown">
                <button
                  type="button"
                  className="btn btn-warning dropdown-toggle student-btn"
                  data-bs-toggle="dropdown"
                >
                  Search by
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#" onClick={
                      // Onlick get value of input and pass to searchByName
                      () => {
                        let input = document.getElementsByName("student")[0].value;
                        searchByName(input);
                      }
                    }>
                      Student Name
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#" onClick={
                      // Onlick get value of input and pass to searchByStudentNumber
                      () => {
                        let input = document.getElementsByName("student")[0].value;
                        searchByStudentNumber(input);
                      }
                    }>
                      Student Number
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-2">
              <div className="dropdown">
                <button
                  type="button"
                  className="btn btn-warning dropdown-toggle student-btn"
                  data-bs-toggle="dropdown"
                >
                  Sort by
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#" onClick={sortByNameAsc}>
                      Ascending Student Name
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#" onClick={sortByNameDesc}>
                      Descending Student Name
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#" onClick={sortByDateDesc}>
                      Latest Date
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#" onClick={sortByDateAsc}>
                      Oldest Date
                    </a>
                  </li>
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
            <div className="col-2">
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
            <div className="col-1">
              <h6>Details</h6>
            </div>
          </div>
          <br />
          {pending_applications.map((stud_appli) => {
            return (
              (
                <Students
                  studNo={stud_appli.student.student_number}
                  fname={stud_appli.student.first_name}
                  mname={stud_appli.student.middle_name}
                  lname={stud_appli.student.last_name}
                  email={stud_appli.student.email}
                  adviser={stud_appli.adviser}
                  applicationid= {stud_appli.applicationContent[0]._id}
                  date={stud_appli.applicationContent[0].student_submission.date}
                  step={stud_appli.applicationContent[0].step}
                />
              )
            );
          })}
          {/* <br />
                    <div className="row student-data">
                        <div className="col-2">
                            <p>2020-02667</p>
                        </div>
                        <div className="col-3">
                            <p>Octavo, John Rommel Belleza</p>
                        </div>
                        <div className="col-2">
                            <p>jboctavo@up.edu.ph</p>
                        </div>
                        <div className="col-2">
                            <p>JPabico</p>
                        </div>
                        <div className="col-1">
                            <p>06/22/23</p>
                        </div>
                        <div className="col-1">
                            <p>1</p>
                        </div>
                        <div className="col-1">
                            <button onClick={toClearance} className="btn btn-secondary">View</button>
                        </div>
                    </div> */}

          <ul className="pagination student-pagination">
            <li className="page-item">
              <a className="page-link" href="#">
                Previous
              </a>
            </li>
            <li className="page-item active">
              <a className="page-link veh" href="#">
                1
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                2
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                Next
              </a>
            </li>
          </ul>
        </div>
        <button
          type="button"
          className="btn btn-primary student-btn-manage"
          onClick={toManageStudents}
        >
          Manage Student Accounts
        </button>
      </div>
    </>
  );
}
