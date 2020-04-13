Here are the instructions to get the development environment up and running.

Once you have cloned the repository to your pc you should have three folders,
auth-server, client and sql. Auth-server folder has all the back-end code, client 
folder holds all the front-end code and sql folder holds commands used to create 
the database.

Start development back-end server:

1. Install or update dependencies if necessary. You can do it by running command
npm install or npm update inside the auth-server folder.

2. Navigate to ../auth-server/src and start the server by running server.ts,
you can use command npm start to do that.

3. You should get text saying, "Server started listening on port: 3003".

Start the front-end development server:

1. Install or update Angular if necessary. You can do it by running command
npm install Angular or npm update Angular inside the client folder.

2. Navigate to ../client/src/app and start the server using command ng serve.

3. You should get text saying 
"Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/".

Building the front-end for production:

1. Navigate to ../client/src

2. Run command ng build --prod

3. You should get message telling you the date and a hash for the build so you can identify it.

4. You can now find static files from client/dist/hoods-login . You can deploy these in your back-end server.

