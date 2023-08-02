# Travel Agent Appointments - Travel Consultation Booking Web App

Travel Consultation
Booking Web App that enables users to schedule appointments
with travel agents for personalized consultations.Implemented
a user login system, allowing users to securely book appoint‐
ments and manage their scheduled time slots. Designed a com‐
prehensive notification system that sends email notifications to
both users and travel agents to keep them updated on appoint‐
ment details and changes.



## Web App Link

https://travelnex.onrender.com/
## Run Locally

Clone the project

```bash
  git clone https://github.com/debasish2011/TravelNEX.git
```

Go to the project directory

```bash
  cd TravelNEX
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`mongoLink = 'mongodb://127.0.0.1:27017/travel-agency'`

`jwt = 'your-jwt-secret'`

`user = 'your-email@gmail.com'`

`pass = 'your-email-password'`

`host = http://localhost:{port}/`

## Tech Stack

**Client:** EJS, Bootstrap

**Server:** Node, Express, Passport, JWT, Mongoose, Nodemailer, Randomstring, Passport-local, Express-session, Express-ejs-layouts, Bcryptjs, Dotenv