# LinkedIn-Clone
An assignment for the Web Application Technologies course where we were asked to implement a web app like LinkedIn.

The app was developed using [Angular](https://angular.io/) for the Front-End, [NestJs](https://nestjs.com/) for the BackEnd and [PostgreSQL](https://www.postgresql.org/) for the database. 

## Installation Instructions

To install you just need to do the following:
- Install [NodeJs and npm](https://nodejs.org/en/), and PostgreSQL 
- Navigate to the api folder which contains the backend and install the node-modules by running `npm install`
- Navigate to the frontend folder and install the node-modules by running `npm install`
- Navigate to the `api/ormconfig.json` file and configure the database connectivity options.
- Navigate to the `ssl` and install the certificate which is for localhost or you can create your own and replace the corresponding files.

## Execution Instructions

To run the application you just need to:
- Run the backend by going to the `api` folder and then run the command `npm run start`
- Run the frontend by going to the `frontend` folder and then run the command `npm start`
- Navigate to https://localhost:4200 .
- The first time you use the app with a clean database, an admin user will be created with email `admin@admin.com` and password `linkedin123`. Login and change the password.
- Use the app!!!
