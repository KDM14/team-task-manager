Team Task Manager

Live Application URL: [To be filled by the user after deployment]
GitHub Repository Link: [To be filled by the user after deployment]
Demo Video: [To be filled by the user]

## Features
- Authentication (Signup/Login) with Role-Based Access Control (Admin/Member)
- Project & team management
- Task creation, assignment & status tracking
- Dashboard with task overview (my tasks, overdue tasks)

## Technology Stack
- Frontend: React (Vite), React Router, Vanilla CSS
- Backend: Node.js, Express
- Database: SQLite (via Prisma ORM)
- Authentication: JWT

## Role Capabilities
- Admin: Can create/edit/delete projects, manage team members, assign tasks, and change any task status.
- Member: Can view projects, view assigned tasks, and update the status of their assigned tasks.

## Local Setup
1. Clone the repository
2. Run `npm install` in the root directory
3. To start local development:
   - Terminal 1: `cd backend && npx prisma migrate dev && npm run dev`
   - Terminal 2: `cd frontend && npm run dev`

## Deployment on Railway
1. Create a new project on Railway.
2. Link your GitHub repository.
3. Add a persistent volume to your Railway service. Mount the volume at `/app/backend`. 
   (This ensures the SQLite database is persisted across deployments).
4. Railway will automatically detect the root package.json and run the build/start scripts.
5. Set a `JWT_SECRET` environment variable in Railway (e.g. to a strong random string).
