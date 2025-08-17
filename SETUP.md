# Employee Scheduler Setup Guide

## Quick Start

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd src/backend
   ```

2. **Install dependencies and build:**
   ```bash
   dotnet restore
   dotnet build
   ```

3. **Run the backend API:**
   ```bash
   cd EmployeeScheduler.Api
   dotnet run
   ```
   
   The backend API will start on `https://localhost:7269` (or check console output for exact port)

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd src/frontend/employee-scheduler-web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   
   The frontend will start on `http://localhost:3000`

## Application Features

✅ **All Core Features Implemented:**

- **Employee Management**: Create, read, update, delete employees
- **Schedule Management**: Create weekly schedules and publish them
- **Shift Management**: Add shifts to schedules with full CRUD operations
- **Dashboard**: Real-time overview with metrics and upcoming shifts
- **Authentication**: JWT-based authentication system
- **Multi-tenant**: Support for multiple organizations

## API Endpoints

### Authentication
- `POST /api/auth/register-tenant` - Register new tenant
- `POST /api/auth/login` - User login

### Employees
- `GET /api/employees` - List all employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

### Schedules
- `GET /api/schedules` - List all schedules
- `POST /api/schedules` - Create schedule
- `PUT /api/schedules/{id}` - Update schedule
- `PUT /api/schedules/{id}/publish` - Publish schedule
- `DELETE /api/schedules/{id}` - Delete schedule

### Shifts
- `GET /api/shifts` - List shifts (with optional scheduleId filter)
- `POST /api/shifts` - Create shift
- `PUT /api/shifts/{id}` - Update shift
- `PUT /api/shifts/{id}/status` - Update shift status
- `DELETE /api/shifts/{id}` - Delete shift

## Application Flow

1. **Register/Login**: Create a tenant account or login
2. **Add Employees**: Create employee profiles with contact details
3. **Create Schedule**: Set up weekly schedules
4. **Add Shifts**: Assign employees to shifts within schedules
5. **Manage**: Track shift statuses, publish schedules, view dashboard

## Database

The application uses PostgreSQL with Entity Framework Core. The database will be created automatically when first running the backend.

## Technology Stack

**Backend:**
- ASP.NET Core 9.0
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- AutoMapper

**Frontend:**
- React 19
- TypeScript
- Material-UI v7
- React Router
- Axios
- Formik + Yup

## Testing the Application

1. Start both backend and frontend
2. Navigate to `http://localhost:3000`
3. Register a new tenant account
4. Add some employees
5. Create a schedule
6. Add shifts to the schedule
7. View dashboard for overview

All features are now fully functional and integrated!