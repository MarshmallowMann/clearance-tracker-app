import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import { viewSingleApplication } from "../../../Backend-API/student_controller";
// import { useNavigate } from "react-router-dom";

export default function Students(props) {
  const navigate = useNavigate();
  const toClearance = () => {
    navigate("/clearance-application", { state: props.applicationid });
  };
  // viewSingleApplication
  // getAdviser
  return (
    <>
      {/* <br /> */}
      <div className="row student-data">
        <div className="col-2">
          <p>{props.studNo}</p>
        </div>
        <div className="col-3">
          <p>
            {props.lname}, {props.fname} {props.mname}
          </p>
        </div>
        <div className="col-2">
          <p>{props.email}</p>
        </div>
        <div className="col-2">
          <p>
            {props.adviser
              ? props.adviser.last_name +
                ", " +
                props.adviser.first_name +
                " " +
                props.adviser.middle_name
              : "No Adviser"}
          </p>
        </div>
        <div className="col-1">
          <p>{new Date(props.date).toLocaleDateString()} </p> 
        </div>
        <div className="col-1">
          <p>{props.step}</p>
        </div>
        <div className="col-1">
          <button onClick={toClearance} className="btn btn-secondary">
            View
          </button>
        </div>
      </div>
    </>
  );
}
