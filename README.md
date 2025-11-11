Before running the project, follow these steps:

Make sure Docker Desktop is installed and running on your computer.

Open the folder "backend" in terminal, then run the command below to build and start Kafka server:
docker compose up --build

Open SQL Server and create a new database:
CREATE DATABASE ExamOnline;

Open the backend project in IntelliJ IDEA, then open the file pom.xml in the root project to automatically download dependencies.

Open the folder "frontend" in VSCode, run the following commands to install and start the frontend:
npm install
npm run dev

After setup, the backend (Spring Boot) will connect to the ExamOnline database, and the frontend (Next.js) will start at http://localhost:3000

Note: The backend will throw errors if Kafka server is not running. Make sure Docker is started and Kafka is running before launching the backend.
