# CMSC 100 Project Group 4

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
        <a href="#about-the-project">About the Project</a>
        <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#usage">Usage</a></li>
        <ul>
            <li>
            <a href="#student-module">Student Module</a>
            <ul>
            <li><a href="#description">Description</a></li>
            <li><a href="#main-features">Main Features</a></li>
            </ul>
            </li>
            <li>
            <a href="#admin-module">Admin Module</a>
            <ul>
            <li><a href="#description">Description</a></li>
            <li><a href="#main-features">Main Features</a></li>
            </ul>
            </li>
            <li>
            <a href="#approver-module">Approver Module</a>
            <ul>
            <li><a href="#description">Description</a></li>
            <li><a href="#main-features">Main Features</a></li>
            </ul>
            </li>
      </ul>
      </ul>
    <li><a href="#credits">Credits</a></li>
  </ol>
</details>

## About the Project

![First Page Screenshot][login-screenshot]

This project creates a system approval in the Institute of Computer Science. It provides different modules for students, administrators, and approvers. Various features like opening and closing applications, and managing student applications are implemented in this system.

### Built With

[![React][React.js]][React-url]
[![MongoDB][MongoDB]][MongoDB-url]
[![Bootstrap][Bootstrap.com]][Bootstrap-url]
[![Node][Node.js]][Nodejs-url]

## Getting Started
Stated below are the steps and requirements to execute the system.

### Installation
1. Clone the repository
   ```sh
   git clone https://github.com/CMSC100/project-labteam-4-333.git
   ```
2. Start a MongoDB Server containing an ICS Database. Create a users and applications collection and insert the following in users.
    ```sh
      {
        "_id":{
            "$oid": "647a10d98719327582622ace"
        },
        "email": "pharagones@up.edu.ph",
        "password": "$2b$10$jtsxMFRfBtnHlrV.J2Z22esAAJ1j1N51NxhG61v4K9XkklxMcrWPu",
        "first_name": "Prince",
        "middle_name": "Hari",
        "last_name": "Aragones",
        "employee_number": "2018-28653",
        "user_type": "Clearance Officer",
        "applications": [],
        "user_status": "pending",
        "__v": 0
      }
   ```
   
3. Install NPM packages on the root
   ```sh
   npm install
   ```
4. Go to Backend-API
    ```sh
   cd Backend-API
   ```
5. Install NPM packages on Backend-API
   ```sh
   npm install
   ```
6. Go to frontend-development
   ```sh
   cd frontend-development
   ```
7. Install NPM packages on frontend-development
   ```sh
   npm install
   ```
8. Run React JS on frontend-development
    ```sh
   npm start
   ```
9. Go to Backend-API
   ```sh
   cd frontend-development
   ```
1. Run Nodemon on Backend-API
    ```sh
   npm start
   ```
## Usage

### Student Module

- Log In/Sign Up

    Like any other clearance system, the UPLB Clearance System also requires you to log in to an account.
    
    ![log_in][login-page]

    For first-time users, you can sign up and wait for your account to be approved.

    ![sign-up][signup-page]
  
    The system shows this error message when an unapproved account is logged in.

    ![unapproved][error-page]

    An approved account, however, shows the Student Clearance Application page.

  #### **Description**

    The Student Module shows all the applications made by the student and some details, namely the application number, adviser, date, step, status, and a View button to see all its details and remarks.

  #### **Main Features**

  - On this page, Students can see and manage their applications.
    ![all apps][student-page]
    - Open a New Application

        ![new app][open-new-app]
        - Clicking the Open New Application button will ask the student to enter their Github link and remark. Clicking the Submit button will disable the Open New Application button as only one application can be opened at a time.

        **Note:** Adding remarks is optional

    - Viewing all the details of an application
        ![view details][app-details]
       - The View button redirects the student to another page where all details about an application are shown.

    - View Current Step Details
        ![step details][view-details]
      - A View Details button provides the student with the necessary information on the current step they are in. 

    - Close an Application
        ![close app][closed-app]
      - A Close button at the left-most part of the page allows the student to cancel a pending application

    - No adviser

        ![no adviser][no-adv]
      - An account with no adviser will simply have the adviser section tagged as 'N/A'

        **Tip:** Clicking the UPLB Clearance System at the navigation bar will redirect the student to the clearance application page
    
- Log Out
        
    ![logout][logout-page]

    - At the right-most part of the student's navigation bar, the Log Out button is shown when the Student Account is clicked. When a Student user logs out, they are immediately redirected to the log in page. 


### Admin Module

  - Log In/Sign Up

  ![adminlogin][admin-login]

  - Like any other clearance system, the UPLB Clearance System also requires you to log in to an account. For logging in simply use the admin account and password provided. Also, logging in using the admin module does not need any sort of approval.

#### **Description** 

The project has a built-in Administrative User. The admin module is only available to faculty in charge of assigning an adviser to a student, verifying accounts, and creating accounts for approvers.

  #### **Main Features**
  - Managing Student account applications

    - View pending student account application requests

        ![admin manage][admin-view]
        - To use this function, press the Manage button in the admin home page.

    - Approve or Reject an application for student accounts

        - This function is done by clicking the check or cross button on the student application page.

    - Assign adviser to a student account

        ![assign-adviser][assign-adv]

        - Assigning an adviser to a student account requires the admin to choose an adviser from the drop down menu of advisers the clicking 'Assign'.

- Managing Approver accounts

    - Create an account for an  approver

        ![create approver][create-app]
      - Creating a new approver is done through the Create ApproverAccount of Approver Accounts Page.

    - Edit an account for an  approver

        ![edit account][create-app2]
      - This function changes the password of an approver account. Press  the Edit button on the row of the account you want to edit.

    - Delete an account for an  approver
      - Deleting an approver account deletes an approver account of your choosing. To delete, just click the Delete button beside the Edit button.

- Log Out
        
    ![logout][logout-admin]

    - At the right-most part of the admin's navigation bar, the Log Out button is shown when the Admin Account is clicked. When a Student user logs out, they are immediately redirected to the log in page. 

### Approver Module

#### **Description** 

The approver module is available to a faculty member from the institute. It is responsible for acting upon all applications.

  #### **Main Features**

- See the list of pending applications that require his/her attention

    - This feature allows an approver to view all applications that he/she is responsible for. Also, this feature has sub-functionalities, namely:

      - Searching by student number, or specific Student name
        ![approver search][app-search]
          - To search, click on the Search dropdown button to specify what input you are going to use, then type your input on the textbox, and then press the Search button.

      - Filtering by date, adviser, step, or status
        ![approver filter][app-filter]
          - To filter the applications click the Filter by the drop down button beside the button for search then click on the mode of filtering you want to carry out.

      - Sorting by date, or name
        ![approver sort][app-sort]
          - To sort the applications, press the Sort by dropdown button and click on the mode you want to sort with. 
   
    - See links/info submitted by the student at any step
    ![approver page][app-page]
        - To see all the details of an application. Click the View button on the row of the account you want to see the details of.
    
    - See remarks given to the student at any step
    ![approver details][app-details]
        - To view the remarks of a student application. Click the View Details button on the Clearance Applications page


    - Approve application at current step
    ![approver approve][app-approve]
        - The approve button on the collapsible tab will approve the specific application at the current step

    - Return application at current step with remarks
    ![approver reject][app-reject]
        - The returning of an application at current step with remarks is done using the Reject button. A window will pop up to ask for the remarks for the application.
- Log Out
        
    ![logout][logout-approver]

    - At the right-most part of the approver's navigation bar, the Log Out button is shown when the Approver Account is clicked. When a Student user logs out, they are immediately redirected to the log in page. 

## Credits

**Arjohn P. Comia**

apcomia@up.edu.ph

**John Robertson C. Despi**

jcdespi@up.edu.ph

**John Rommel B. Octavo**

jboctavo@up.edu.ph

**Jirah Hope P. Palma**

jppalma@up.edu.ph


[login-screenshot]: images/project-whole.gif
[login-page]: images/ss-log-in.png
[signup-page]: images/ss-signup.png
[error-page]: images/ss-unapproved.png
[open-new-app]: images/ss-opennew.png
[student-page]: images/ss-listapp.png
[app-details]: images/ss-viewapp.png
[view-details]: images/ss-viewdetail.png
[closed-app]: images/ss-closed.png
[no-adv]: images/null%20adviser.png
[logout-page]: images/logout.gif
[admin-login]: images/admin-login.gif
[admin-view]: images/admin-AoRAcc.gif
[assign-adv]: images/admin-assignAdviser.gif
[logout-admin]: images/admin-logout.gif
[create-app]: images/admin-createApprover.png
[create-app2]: images/admin-clearanceApplication2.png
[app-search]: images/approver-search%20by.png
[app-filter]: images/approver-filter.png
[app-sort]: images/approver-sort.png
[app-page]: images/approver-page.png
[app-details]: images/approver-applicationDetails.png
[app-approve]: images/approver-approveApplication.png
[app-reject]: images/approver-rejectApplication.png
[logout-approver]: images/approver-logout.gif

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]:
https://getbootstrap.com
[MongoDB]:
https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[Express.js]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[Node.js]:https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[Nodejs-url]: https://nodejs.org/en



