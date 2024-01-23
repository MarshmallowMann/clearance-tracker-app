import './App.css';
import { Navigate, RouterProvider, createBrowserRouter, redirect, useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/signup';
import AdminHomepage from './pages/admin-homepage';
import AdminManageStudents from './pages/admin-manage-students';
import AdminManageApprover from './pages/admin-manage-approver';
import Login from './pages/Login';
import Student from './pages/student';
import AdminClearanceApplication from './pages/admin-clearance-application';
import ApproverHomePage from './pages/approver-homepage';
import ClearanceApplication from './pages/clearance-application';
import ViewDetails from './pages/student-application-details';
import AdminManageStudentApplication from './pages/admin-manage-student-app';
// import ApproverSpecificApplication from './pages/approver-specific-application';

function App() {
  


    const checkIfLoggedInOnStudent = async () => {

        const res = await fetch('http://localhost:3001/check-if-logged-in',
        {
          method: 'POST',
          credentials: 'include',
        });
       
      
        const payload = await res.json();
        // console.log(payload)
          if (payload.isLoggedIn) {
            return JSON.parse(localStorage.getItem('user')).user.user_type === 'student' ? JSON.parse(localStorage.getItem('user')) : redirect('/admin-homepage')
          } else {
            return redirect('/')
          }
    }

    const checkIfLoggedInOnLogIn = async () => {
        const res = await fetch('http://localhost:3001/check-if-logged-in',
        {
            method: 'POST',
            credentials: 'include',
        });

        const payload = await res.json();

        

        if (payload.isLoggedIn) {
          const user = JSON.parse(localStorage.getItem('user')) 
          // console.log(user)    
          

          if (user) {
            if (user.user.user_type === 'Clearance Officer') {
              return router.navigate('/admin-homepage', {state: JSON.parse(localStorage.getItem('user'))})
            } else if (user.user.user_type === 'approver') {
              return router.navigate('/approver-homepage', {state: JSON.parse(localStorage.getItem('user'))})
            } else if (user.user.user_type === 'student') {
                return router.navigate('/student', {state: JSON.parse(localStorage.getItem('user'))})
              }
          } 

        }
        return 0;

    }

    const checkIfLoggedInOnStudentApp = async () => {
    
        const res = await fetch('http://localhost:3001/check-if-logged-in',
        {
          method: 'POST',
          credentials: 'include',
        });
      
        const payload = await res.json();
          if (payload.isLoggedIn) {
            return true
          } else {
            return redirect('/');
          }
      }


      const checkIfLoggedInOnAdmin = async () => {

        const res = await fetch('http://localhost:3001/check-if-logged-in',
        {
          method: 'POST',
          credentials: 'include',
        });
       
      
        const payload = await res.json();
        // console.log(payload)
          if (payload.isLoggedIn) {
            const user = JSON.parse(localStorage.getItem('user')) 
            // console.log(user)    
            
  
            if (user.user.user_type === 'Clearance Officer') {
              return JSON.parse(localStorage.getItem('user'))
            } else {
              return redirect('/')
            }
          } else {
            return redirect('/')
          }
    }


    const checkIfLoggedInOnApprover = async () => {

      const res = await fetch('http://localhost:3001/check-if-logged-in',
      {
        method: 'POST',
        credentials: 'include',
      });
     
    
      const payload = await res.json();
      // console.log(payload)
        if (payload.isLoggedIn) {
          const user = JSON.parse(localStorage.getItem('user')) 
          // console.log(user)    
          

          if (user.user.user_type === 'approver') {
            return JSON.parse(localStorage.getItem('user'))
          } else {
            return redirect('/')
          }
        } else {
          return redirect('/')
        }
  }

      const router = createBrowserRouter(
        [
            { path: '/signup', element: <Signup /> },
            { path: '/admin-homepage', element: <AdminHomepage />, loader: checkIfLoggedInOnAdmin },
            { path: '/admin-manage-students', element: <AdminManageStudents /> , loader: checkIfLoggedInOnAdmin},
            { path: '/admin-manage-students-application', element: <AdminManageStudentApplication />, loader: checkIfLoggedInOnAdmin },
            { path: '/admin-manage-approver', element: <AdminManageApprover />, loader: checkIfLoggedInOnAdmin },
            { path: '/admin-clearance-application', element: <AdminClearanceApplication /> , loader: checkIfLoggedInOnAdmin},
            { path: '/approver-homepage', element: <ApproverHomePage />, loader: checkIfLoggedInOnApprover },
            { path: '/student', element: <Student />, loader: checkIfLoggedInOnStudent},
            { path: '/clearance-application', element: <ClearanceApplication /> },
            { path: '/', element: <Login />, loader: checkIfLoggedInOnLogIn },
            { path: '/student-application-details', element: <ViewDetails />, loader: checkIfLoggedInOnStudentApp},
        ]
      )


      

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;