Online Learning System
1. Project Overview

The Online Learning System is a comprehensive platform designed to deliver a seamless and efficient learning experience by connecting multiple user roles through a centralized system.
The platform supports both learning and administrative functions, integrating assessment, content management, and support services.

Key Features

Guests: Can request information and register for access to the platform.

Members: Participate in exams, practice tests, and ranking activities, with access levels determined by their membership type.

Administrators: Manage user accounts, permissions, and feedback.

Payment Gateway: Handles all financial transactions related to subscriptions and course enrollments.

Quiz Manager: Uploads, updates, and manages exam questions and test content.

Content Manager: Oversees exam rankings, reporting, and educational materials.

Support Manager: Responds to user inquiries and manages the support request system.

This interconnected framework ensures a smooth experience for learners, administrators, and support staff, providing transparency, efficiency, and scalability.

2. System Architecture

Frontend: Built with Next.js (React), responsible for user interface and user interactions.

Backend: Developed using Spring Boot, providing RESTful APIs, business logic, and database operations.

Database: MySQL, used for managing users, exams, results, feedback, and payment data.

Integration: Connected to a Payment Gateway for secure transactions.

Ports

Backend: 8080

Frontend: 3000

3. Team Members
No.	Student ID	Username	Full Name	UUID	Email	Role
1	HE181478	chinhcdhe181478	Cao Doanh Chính	83aff6a9-1560-47ca-85a7-694c716941e2	chinhcdhe181478@fpt.edu.vn
	Team Leader / Backend Dev
2	HE182023	duclmhe182023	Lê Minh Đức	dfc91390-5fa9-4b61-b520-5803a90ae165	duclmhe182023@fpt.edu.vn
	Fullstack Developer
3	HE182112	longnthe182112	Nguyễn Thành Long	7aa093d3-f103-44bf-b088-e9d7c6bad58f	longnthe182112@fpt.edu.vn
	Frontend Developer / UI-UX
4. Objectives

Provide a unified online learning platform for different user types.

Offer flexible exam and ranking systems for learners.

Simplify user and content management for administrators.

Enable seamless payment and membership management.

Ensure a responsive, secure, and user-friendly interface.

5. Technologies Used

Backend

Spring Boot 3.3.x

Spring Web, Spring Data JPA

MySQL Database

Lombok, DevTools

Frontend

Next.js 14 (React 18)

TypeScript, TailwindCSS

Other Tools

Maven, npm

IntelliJ IDEA, Visual Studio Code

Git / GitHub for version control

6. How to Run
Backend (Spring Boot)
cd backend
./mvnw spring-boot:run
# The server will run on http://localhost:8080

Frontend (Next.js)
cd frontend
npm install
npm run dev
# The web app will run on http://localhost:3000