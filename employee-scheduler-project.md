# Employee Scheduler SaaS

## Tổng quan dự án

Hệ thống quản lý chia lịch cho nhân viên (Employee Scheduler) là một ứng dụng SaaS cho phép các công ty quản lý lịch làm việc của nhân viên một cách hiệu quả. Hệ thống được thiết kế theo mô hình modular, có thể mở rộng và thương mại hóa theo mô hình multi-tenant.

## Kiến trúc hệ thống

### Tech Stack
- **Frontend**: React.js + TypeScript
- **Backend**: .NET Core 8 Web API
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose
- **Authentication**: JWT Token
- **Architecture**: Clean Architecture + Domain-Driven Design

### Mô hình kinh doanh
- **B2B SaaS**: Bán theo tenant (công ty/tổ chức)
- **Pricing**: Theo số lượng user/tenant
- **Multi-tenancy**: Database per tenant hoặc shared database với tenant isolation

## Cấu trúc thư mục dự án

```
employee-scheduler/
├── README.md
├── docker-compose.yml
├── .env.example
├── .gitignore
├── docs/
│   ├── api-docs/
│   ├── deployment/
│   └── user-guide/
├── src/
│   ├── frontend/
│   │   ├── employee-scheduler-web/
│   │   │   ├── public/
│   │   │   ├── src/
│   │   │   │   ├── components/
│   │   │   │   │   ├── common/
│   │   │   │   │   ├── layout/
│   │   │   │   │   ├── auth/
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── schedule/
│   │   │   │   │   ├── employee/
│   │   │   │   │   └── tenant/
│   │   │   │   ├── pages/
│   │   │   │   ├── services/
│   │   │   │   ├── hooks/
│   │   │   │   ├── utils/
│   │   │   │   ├── types/
│   │   │   │   └── constants/
│   │   │   ├── package.json
│   │   │   └── Dockerfile
│   └── backend/
│       ├── EmployeeScheduler.sln
│       ├── src/
│       │   ├── EmployeeScheduler.Api/
│       │   │   ├── Controllers/
│       │   │   ├── Middleware/
│       │   │   ├── Program.cs
│       │   │   ├── appsettings.json
│       │   │   └── Dockerfile
│       │   ├── EmployeeScheduler.Core/
│       │   │   ├── Entities/
│       │   │   ├── Interfaces/
│       │   │   ├── Services/
│       │   │   └── ValueObjects/
│       │   ├── EmployeeScheduler.Infrastructure/
│       │   │   ├── Data/
│       │   │   ├── Repositories/
│       │   │   ├── Services/
│       │   │   └── Configuration/
│       │   └── EmployeeScheduler.Application/
│       │       ├── DTOs/
│       │       ├── Services/
│       │       ├── Validators/
│       │       └── Mappings/
│       └── tests/
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── scripts/
└── deployment/
    ├── docker/
    ├── kubernetes/
    └── scripts/
```

## Chức năng chính (MVP Features)

### 1. Authentication & Authorization
- [x] Đăng nhập/Đăng xuất
- [x] Quản lý session và JWT token
- [x] Role-based access control (Admin, Manager, Employee)
- [x] Multi-tenant authentication

### 2. Tenant Management
- [x] Đăng ký tenant mới
- [x] Quản lý thông tin công ty
- [x] Cài đặt tenant (múi giờ, ngôn ngữ, etc.)
- [x] Billing và subscription management

### 3. Employee Management
- [x] CRUD nhân viên
- [x] Phân quyền vai trò
- [x] Quản lý thông tin cá nhân
- [x] Import/Export danh sách nhân viên

### 4. Schedule Management
- [x] Tạo và chỉnh sửa lịch làm việc
- [x] Gán ca làm việc cho nhân viên
- [x] Xem lịch theo tuần/tháng
- [x] Copy lịch từ tuần/tháng trước
- [x] Template lịch làm việc

### 5. Shift Management
- [x] Quản lý ca làm việc (sáng, chiều, tối)
- [x] Cài đặt giờ làm việc
- [x] Quản lý overtime
- [x] Shift swapping (đổi ca)

### 6. Reporting & Analytics
- [x] Báo cáo giờ làm việc
- [x] Thống kê attendance
- [x] Export báo cáo (PDF, Excel)
- [x] Dashboard analytics

### 7. Notifications
- [x] Email notifications
- [x] In-app notifications
- [x] Reminder cho ca làm việc
- [x] Thông báo thay đổi lịch

## Hướng dẫn cài đặt từ đầu

### Bước 1: Clone và chuẩn bị project

```bash
# Tạo thư mục project
mkdir employee-scheduler
cd employee-scheduler

# Tạo cấu trúc thư mục cơ bản
mkdir -p src/frontend src/backend database docs deployment
```

### Bước 2: Setup Backend (.NET Core)

```bash
# Di chuyển vào thư mục backend
cd src/backend

# Tạo solution
dotnet new sln -n EmployeeScheduler

# Tạo các projects
dotnet new webapi -n EmployeeScheduler.Api
dotnet new classlib -n EmployeeScheduler.Core
dotnet new classlib -n EmployeeScheduler.Infrastructure
dotnet new classlib -n EmployeeScheduler.Application

# Thêm projects vào solution
dotnet sln add EmployeeScheduler.Api/EmployeeScheduler.Api.csproj
dotnet sln add EmployeeScheduler.Core/EmployeeScheduler.Core.csproj
dotnet sln add EmployeeScheduler.Infrastructure/EmployeeScheduler.Infrastructure.csproj
dotnet sln add EmployeeScheduler.Application/EmployeeScheduler.Application.csproj

# Thêm project references
cd EmployeeScheduler.Api
dotnet add reference ../EmployeeScheduler.Application/EmployeeScheduler.Application.csproj
dotnet add reference ../EmployeeScheduler.Infrastructure/EmployeeScheduler.Infrastructure.csproj

cd ../EmployeeScheduler.Application
dotnet add reference ../EmployeeScheduler.Core/EmployeeScheduler.Core.csproj

cd ../EmployeeScheduler.Infrastructure
dotnet add reference ../EmployeeScheduler.Core/EmployeeScheduler.Core.csproj
```

### Bước 3: Cài đặt NuGet Packages

```bash
# Trong EmployeeScheduler.Api
cd EmployeeScheduler.Api
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Swashbuckle.AspNetCore
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
dotnet add package FluentValidation.AspNetCore

# Trong EmployeeScheduler.Infrastructure
cd ../EmployeeScheduler.Infrastructure
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.EntityFrameworkCore.Tools

# Trong EmployeeScheduler.Application
cd ../EmployeeScheduler.Application
dotnet add package AutoMapper
dotnet add package FluentValidation
dotnet add package MediatR
```

### Bước 4: Setup Frontend (React)

```bash
# Di chuyển vào thư mục frontend
cd ../../frontend

# Tạo React app với TypeScript
npx create-react-app employee-scheduler-web --template typescript
cd employee-scheduler-web

# Cài đặt các packages cần thiết
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/x-date-pickers
npm install axios react-router-dom
npm install @types/react-router-dom
npm install react-query
npm install formik yup
npm install @types/yup
```

### Bước 5: Setup Database

```bash
# Tạo thư mục database
cd ../../../database

# Tạo file migration script
touch init.sql
touch seed-data.sql
```

### Bước 6: Setup Docker

Tạo file `docker-compose.yml` trong thư mục root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: employee-scheduler-db
    environment:
      POSTGRES_DB: employee_scheduler
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: yourpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database:/docker-entrypoint-initdb.d
    networks:
      - employee-scheduler-network

  backend:
    build:
      context: ./src/backend
      dockerfile: EmployeeScheduler.Api/Dockerfile
    container_name: employee-scheduler-api
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Server=postgres;Database=employee_scheduler;User Id=postgres;Password=yourpassword;
    ports:
      - "5000:80"
    depends_on:
      - postgres
    networks:
      - employee-scheduler-network

  frontend:
    build:
      context: ./src/frontend/employee-scheduler-web
      dockerfile: Dockerfile
    container_name: employee-scheduler-web
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - employee-scheduler-network

volumes:
  postgres_data:

networks:
  employee-scheduler-network:
    driver: bridge
```

### Bước 7: Environment Configuration

Tạo file `.env.example`:

```env
# Database
DATABASE_URL=Server=localhost;Database=employee_scheduler;User Id=postgres;Password=yourpassword;

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRY_MINUTES=60

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# API URL
API_URL=http://localhost:5000
```

## Domain Models chính

### 1. Tenant
- TenantId, Name, Domain, SubscriptionType
- TimeZone, Locale, Settings

### 2. User
- UserId, Email, FirstName, LastName, Role
- TenantId, IsActive, CreatedAt

### 3. Employee
- EmployeeId, UserId, EmployeeCode
- Department, Position, HireDate

### 4. Schedule
- ScheduleId, TenantId, WeekStart, WeekEnd
- CreatedBy, Status

### 5. Shift
- ShiftId, ScheduleId, EmployeeId
- Date, StartTime, EndTime, ShiftType
- Status, Notes

### 6. ShiftTemplate
- TemplateId, TenantId, Name
- DefaultShifts, IsActive

## API Endpoints chính

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `POST /api/auth/register-tenant`

### Employee Management
- `GET /api/employees`
- `POST /api/employees`
- `PUT /api/employees/{id}`
- `DELETE /api/employees/{id}`

### Schedule Management
- `GET /api/schedules`
- `POST /api/schedules`
- `PUT /api/schedules/{id}`
- `GET /api/schedules/{id}/shifts`
- `POST /api/schedules/{id}/copy`

### Shift Management
- `GET /api/shifts`
- `POST /api/shifts`
- `PUT /api/shifts/{id}`
- `DELETE /api/shifts/{id}`
- `POST /api/shifts/swap`

## Commands để chạy project

### Development
```bash
# Chạy database
docker-compose up postgres -d

# Chạy backend
cd src/backend
dotnet run --project EmployeeScheduler.Api

# Chạy frontend
cd src/frontend/employee-scheduler-web
npm start
```

### Production
```bash
# Build và chạy tất cả services
docker-compose up --build

# Hoặc chạy in background
docker-compose up -d --build
```

### Database Migration
```bash
# Tạo migration mới
cd src/backend/EmployeeScheduler.Api
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update
```

## Testing Strategy

- **Unit Tests**: Core business logic
- **Integration Tests**: API endpoints
- **E2E Tests**: Critical user flows
- **Performance Tests**: Load testing cho multi-tenant

## Deployment Considerations

- **Container Registry**: Docker Hub hoặc AWS ECR
- **Orchestration**: Kubernetes hoặc Docker Swarm
- **Database**: Managed PostgreSQL (AWS RDS, Azure Database)
- **Monitoring**: Application insights, logging
- **Backup**: Automated database backups
- **SSL**: HTTPS với Let's Encrypt

## Roadmap & Scaling

### Phase 1: MVP (3-4 tháng)
- Basic scheduling features
- Single tenant support
- Web interface

### Phase 2: Multi-tenant (2-3 tháng)
- Complete multi-tenant architecture
- Billing integration
- Advanced reporting

### Phase 3: Enterprise (3-4 tháng)
- Mobile app
- Advanced analytics
- Integration APIs
- White-label solution

## Contribution Guidelines

1. Fork project
2. Create feature branch
3. Follow coding standards
4. Write tests
5. Submit pull request
6. Code review process

---

## Notes for Claude Code

Khi sử dụng Claude Code để implement project này:

1. **Bắt đầu với backend**: Tạo domain models và database schema trước
2. **Clean Architecture**: Tuân thủ nguyên tắc dependency inversion
3. **API First**: Thiết kế API trước khi implement frontend
4. **Modular**: Mỗi feature nên độc lập với nhau
5. **Testing**: Viết test song song với code
6. **Documentation**: Comment code và update README khi cần

Project này được thiết kế để có thể scale từ MVP đến enterprise solution với architecture rõ ràng và maintainable code.