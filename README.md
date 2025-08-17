# Employee Scheduler SaaS

A comprehensive multi-tenant employee scheduling SaaS application built with .NET Core and React.

## 🏗️ Architecture

This project follows Clean Architecture principles with Domain-Driven Design:

- **Frontend**: React.js with TypeScript, Material-UI
- **Backend**: .NET Core 8 Web API
- **Database**: PostgreSQL
- **Authentication**: JWT with multi-tenant support
- **Containerization**: Docker & Docker Compose

## 🚀 Features

### MVP Features
- ✅ Multi-tenant authentication & authorization
- ✅ JWT-based authentication
- ✅ User management (Admin, Manager, Employee roles)
- ✅ Tenant registration and management
- 🔄 Employee management (CRUD)
- 🔄 Schedule creation and management
- 🔄 Shift assignment and tracking
- 🔄 Email notifications
- 🔄 Dashboard with analytics
- 🔄 Responsive web interface

### Tech Stack
- **Backend**: .NET Core 8, Entity Framework Core, PostgreSQL
- **Frontend**: React 18, TypeScript, Material-UI, React Query
- **Security**: JWT, BCrypt password hashing
- **DevOps**: Docker, Docker Compose
- **Architecture**: Clean Architecture, Repository Pattern, CQRS

## 🛠️ Getting Started

### Prerequisites
- .NET Core 8 SDK
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (if running locally)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EmployeeScheduler
   ```

2. **Copy environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Update .env file with your settings** (especially JWT secret and email credentials)

4. **Start the application**
   ```bash
   docker-compose up --build
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Swagger UI: http://localhost:5000/swagger

### Local Development

#### Backend Setup
```bash
cd src/backend
dotnet restore
dotnet build
cd EmployeeScheduler.Api
dotnet run
```

#### Frontend Setup
```bash
cd src/frontend/employee-scheduler-web
npm install
npm start
```

#### Database Setup
```bash
# Run PostgreSQL with Docker
docker run --name employee-scheduler-db -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres:15

# Or use the provided docker-compose
docker-compose up postgres -d
```

## 📁 Project Structure

```
EmployeeScheduler/
├── src/
│   ├── backend/
│   │   ├── EmployeeScheduler.Api/          # Web API layer
│   │   ├── EmployeeScheduler.Core/         # Domain entities & interfaces
│   │   ├── EmployeeScheduler.Infrastructure/# Data access & external services
│   │   └── EmployeeScheduler.Application/  # Business logic & DTOs
│   └── frontend/
│       └── employee-scheduler-web/         # React application
├── database/                               # Database scripts & migrations
├── docs/                                   # Documentation
├── deployment/                             # Deployment configurations
├── docker-compose.yml                      # Container orchestration
├── .env.example                            # Environment template
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | localhost connection |
| `JWT_SECRET` | Secret key for JWT tokens | (required for production) |
| `JWT_EXPIRY_MINUTES` | Token expiration time | 60 |
| `SMTP_HOST` | Email server host | smtp.gmail.com |
| `SMTP_PORT` | Email server port | 587 |
| `SMTP_USERNAME` | Email username | (required) |
| `SMTP_PASSWORD` | Email password/app password | (required) |

### Database Configuration

The application uses Entity Framework Core with PostgreSQL. The database is automatically created on first run.

## 🧪 Testing

```bash
# Backend tests
cd src/backend
dotnet test

# Frontend tests
cd src/frontend/employee-scheduler-web
npm test
```

## 🚀 Deployment

### Docker Deployment
```bash
# Production build
docker-compose up -d --build

# Scale services
docker-compose up -d --scale backend=2
```

### Manual Deployment
1. Build backend: `dotnet publish -c Release`
2. Build frontend: `npm run build`
3. Deploy to your hosting provider
4. Set up PostgreSQL database
5. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

API documentation is available via Swagger UI at `/swagger` when running in development mode.

### Key Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register-tenant` - New tenant registration
- `GET /api/employees` - List employees (requires auth)
- `POST /api/schedules` - Create schedule (requires auth)

## 🔒 Security

- JWT-based authentication with secure token generation
- Password hashing using BCrypt
- Multi-tenant data isolation
- CORS configuration for secure cross-origin requests
- Input validation and sanitization

## 📊 Monitoring

- Application logging via .NET Core logging
- Database connection monitoring
- Performance metrics (to be implemented)

## 🗺️ Roadmap

### Phase 1: MVP (Completed)
- [x] Basic authentication and tenant management
- [x] Core architecture setup
- [x] Docker containerization

### Phase 2: Core Features (In Progress)
- [ ] Employee management
- [ ] Schedule creation and management
- [ ] Shift assignment
- [ ] Email notifications
- [ ] Basic reporting

### Phase 3: Advanced Features (Planned)
- [ ] Mobile responsive design
- [ ] Advanced analytics
- [ ] Integration APIs
- [ ] Advanced reporting
- [ ] Mobile app

## 📞 Support

For support, email your-email@example.com or create an issue in the GitHub repository.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.