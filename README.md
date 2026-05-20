#                      TEAM TASK MANAGER


### Author: Dhanush



## PROJECT OVERVIEW

Team Task Manager is a full-stack web application designed to help teams 
organize their workflow. It allows users to create projects, assign tasks, 
and track progress efficiently. The application features strict Role-Based 
Access Control (RBAC) to distinguish between Admin and Member permissions, 
ensuring a secure and structured environment for team collaboration.

## CORE FEATURES

1. Secure Authentication & Authorization:
   - User Signup and Login via JWT (JSON Web Tokens).
   - Password encryption using bcryptjs.

2. Role-Based Access Control (RBAC):
   - Admin: Has full access. Can create, edit, and delete projects, 
     assign tasks to any member, and change any task status.
   - Member: Has restricted access. Can only view projects they are 
     part of and update the status of tasks specifically assigned to them.

3. Project Management:
   - Create comprehensive projects with titles and descriptions.
   - View project details and track the number of associated tasks.

4. Task Management & Tracking:
   - Create detailed tasks within specific projects.
   - Assign due dates and assign tasks to specific team members.
   - Dynamic Dashboard highlighting total tasks, tasks assigned to 
     the current user, and tasks that are overdue.
   - Status tracking: TODO -> IN_PROGRESS -> REVIEW -> DONE.

5. Modern & Premium UI/UX:
   - Fully responsive and visually striking frontend built with React.
   - Custom CSS featuring glassmorphism, dynamic gradients, and 
     smooth micro-animations.

### TECHNOLOGY STACK

Frontend:
- React (via Vite)
- React Router (for SPA navigation)
- Vanilla CSS (for custom, premium styling without generic libraries)
- Axios (for API communication)
- Lucide React (for modern iconography)

Backend:
- Node.js & Express.js (REST API architecture)
- Prisma ORM (for robust database modeling and migrations)
- SQLite (for reliable local & volume-backed cloud storage)
- JSON Web Token (JWT) & bcryptjs (for authentication/security)

## DATABASE SCHEMA

The application utilizes a relational database structure consisting 
of three primary models:

1. User
   - id (UUID), name, email, password, role (ADMIN/MEMBER)
   - One-to-Many relationship with Tasks

2. Project
   - id (UUID), name, description, createdAt
   - One-to-Many relationship with Tasks

3. Task
   - id (UUID), title, description, status, dueDate
   - Foreign Keys: projectId, assignedToId

## LOCAL SETUP & INSTALLATION

Prerequisites: Node.js (v18+) installed on your machine.

1. Extract the project folder and open a terminal inside it.
2. Install all dependencies across both frontend and backend:
   npm run postinstall

3. Start the application locally:
   - Terminal 1 (Backend): 
     cd backend
     npx prisma migrate dev --name init
     npm run dev
   
   - Terminal 2 (Frontend): 
     cd frontend
     npm run dev

4. Open http://localhost:5173 in your web browser.
#<img width="1710" height="1036" alt="Screenshot 2026-05-20 at 11 36 37 PM" src="https://github.com/user-attachments/assets/77bb1115-8aeb-499e-b345-6169d27e3a2d" />
# DEPLOYMENT (RAILWAY)

This application is fully optimized for monorepo deployment on Railway:
1. Connect the GitHub repository to Railway.
2. Railway automatically detects the root package.json and executes 
   the build ("npm run build") and start ("npm run start") scripts.
3. Express is configured to serve the built React frontend files statically, 
   allowing both frontend and backend to operate securely on a single service.
4. A persistent volume is mounted at `/app/backend` to ensure the SQLite 
   database is preserved across redeployments.
<img width="1710" height="1036" alt="Screenshot 2026-05-20 at 11 36 26 PM" src="https://github.com/user-attachments/assets/8a75142e-99dc-4de4-9687-2525ee5442da" />
