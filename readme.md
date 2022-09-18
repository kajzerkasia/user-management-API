###  User Management API

- Data is downloaded and saved in the database

###  Available functionalities:
- adding a user to the database
- removing the user from the database
- editing user data
- displaying only users with selected role

###  How to start a project?
- make a git clone
- run npm i

1. create SQL database named "usersapi"
2. create one table named "users" with the following schema:

"id"        INTEGER NOT NULL,

"firstName" TEXT,

"lastName"  TEXT,

"email"     TEXT NOT NULL UNIQUE,

"role"      TEXT NOT NULL,

3. create file .env with defined properties like in .env.example
4. run script "start" in package.json or type in your IDE terminal command "node index.js";
5. type http://localhost:3000 in your browser or click link displaying
   in your terminal: "Listening on http://localhost:3000"
7. write in login panel APP_SECRET password.
6. now you can use User Management API, try the available functionalities.

