# 📁 Project Structure and File Overview

## Complete Folder Structure

```
eCommerce-Dashboard/
│
├── 📂 src/                          # Source code directory
│   │
│   ├── 📂 adminjs/                  # AdminJS configuration
│   │   ├── 📂 components/           # Custom React components
│   │   │   └── dashboard.jsx        # Custom dashboard component
│   │   ├── componentLoader.js       # Loads custom components
│   │   ├── dashboardHandler.js      # Dashboard data logic
│   │   ├── index.js                 # Main AdminJS setup
│   │   └── resources.js             # Resource configurations
│   │
│   ├── 📂 config/                   # Configuration files
│   │   └── database.js              # Database connection config
│   │
│   ├── 📂 controllers/              # Request handlers
│   │   └── authController.js        # Authentication logic
│   │
│   ├── 📂 middleware/               # Express middleware
│   │   └── auth.js                  # JWT authentication middleware
│   │
│   ├── 📂 models/                   # Database models
│   │   ├── Category.js              # Category model
│   │   ├── Order.js                 # Order model
│   │   ├── OrderItem.js             # Order item model
│   │   ├── Product.js               # Product model
│   │   ├── Setting.js               # Setting model
│   │   ├── User.js                  # User model
│   │   └── index.js                 # Model relationships
│   │
│   ├── 📂 routes/                   # API routes
│   │   └── authRoutes.js            # Authentication routes
│   │
│   ├── 📂 scripts/                  # Utility scripts
│   │   ├── migrate.js               # Database migration
│   │   └── seed.js                  # Database seeding
│   │
│   └── server.js                    # Main application entry point
│
├── 📂 docs/                         # Documentation
│   ├── API.md                       # API documentation
│   ├── DEPLOYMENT.md                # Deployment guide
│   ├── QUICKSTART.md                # Quick start guide
│   └── SETUP.md                     # Complete setup instructions
│
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── CONTRIBUTING.md                  # Contributing guidelines
├── LICENSE                          # MIT License
├── package.json                     # Project dependencies
└── README.md                        # Main documentation
```

## 📄 File Descriptions

### Root Level Files

#### package.json
- **Purpose**: Defines project metadata and dependencies
- **Key Scripts**:
  - `npm start`: Start production server
  - `npm run dev`: Start development server with auto-reload
  - `npm run db:migrate`: Run database migrations
  - `npm run db:seed`: Seed database with sample data
- **Dependencies**: Express, Sequelize, AdminJS, bcrypt, JWT, PostgreSQL

#### .env.example
- **Purpose**: Template for environment variables
- **Contains**: Database config, JWT secrets, admin credentials
- **Note**: Copy to `.env` and update with your values

#### .gitignore
- **Purpose**: Specifies files Git should ignore
- **Ignores**: node_modules, .env, logs, build files

#### README.md
- **Purpose**: Main project documentation
- **Contains**: Overview, features, installation, usage, API docs

#### LICENSE
- **Purpose**: MIT License for the project
- **Allows**: Free use, modification, distribution

#### CONTRIBUTING.md
- **Purpose**: Guidelines for contributors
- **Contains**: Code style, commit conventions, PR process

### Source Code Files (src/)

#### server.js
- **Purpose**: Main application entry point
- **Responsibilities**:
  - Initialize Express app
  - Connect to database
  - Setup middleware
  - Register routes
  - Start HTTP server
  - Handle graceful shutdown

#### config/database.js
- **Purpose**: Database connection configuration
- **Features**:
  - Sequelize instance creation
  - Connection pooling
  - Test connection function
  - Environment-based logging

### Models (src/models/)

#### User.js
- **Fields**: id, name, email, password, role, isActive
- **Features**:
  - Password hashing with bcrypt
  - Password validation method
  - Hide password in JSON responses
- **Relationships**: Has many Orders

#### Category.js
- **Fields**: id, name, description, slug, isActive
- **Features**: Auto-generate slug from name
- **Relationships**: Has many Products

#### Product.js
- **Fields**: id, name, description, price, stock, sku, imageUrl, categoryId, isActive
- **Features**: Stock tracking, unique SKU
- **Relationships**: 
  - Belongs to Category
  - Has many OrderItems

#### Order.js
- **Fields**: id, orderNumber, userId, totalAmount, status, shippingAddress, paymentMethod, paymentStatus, notes
- **Features**: Auto-generate order number
- **Relationships**:
  - Belongs to User
  - Has many OrderItems

#### OrderItem.js
- **Fields**: id, orderId, productId, quantity, price, subtotal
- **Features**: Auto-calculate subtotal
- **Relationships**:
  - Belongs to Order
  - Belongs to Product

#### Setting.js
- **Fields**: id, key, value, description, type
- **Features**: Type validation (string, number, boolean, json)
- **Purpose**: Store system configuration

#### models/index.js
- **Purpose**: Define model relationships
- **Relationships**:
  - User ↔ Order (one-to-many)
  - Category ↔ Product (one-to-many)
  - Order ↔ OrderItem (one-to-many)
  - Product ↔ OrderItem (one-to-many)

### Controllers (src/controllers/)

#### authController.js
- **login**: Authenticate user, return JWT token
- **getCurrentUser**: Get authenticated user info
- **Features**:
  - Password validation
  - JWT token generation
  - Error handling

### Middleware (src/middleware/)

#### auth.js
- **authMiddleware**: Verify JWT token
- **isAdmin**: Check if user has admin role
- **Features**:
  - Token extraction from headers
  - Token verification
  - User attachment to request

### Routes (src/routes/)

#### authRoutes.js
- **POST /api/login**: User login
- **GET /api/me**: Get current user (protected)
- **Features**: JWT authentication integration

### AdminJS (src/adminjs/)

#### index.js
- **Purpose**: Main AdminJS configuration
- **Features**:
  - Resource registration
  - Authentication setup
  - Session management
  - Custom branding

#### resources.js
- **Purpose**: Configure AdminJS resources
- **Features**:
  - Role-based access control
  - Property visibility rules
  - Action permissions
  - Navigation grouping

#### dashboardHandler.js
- **Purpose**: Generate dashboard data
- **Features**:
  - Admin statistics (all data)
  - User statistics (personal data)
  - Recent orders
  - Revenue calculations

#### componentLoader.js
- **Purpose**: Load custom React components
- **Usage**: Register custom components for AdminJS

#### components/dashboard.jsx
- **Purpose**: Custom dashboard UI
- **Features**:
  - Role-based rendering
  - Statistics cards
  - Recent orders table
  - Responsive design

### Scripts (src/scripts/)

#### migrate.js
- **Purpose**: Create/update database tables
- **Usage**: `npm run db:migrate`
- **Action**: Runs Sequelize sync with alter mode

#### seed.js
- **Purpose**: Populate database with sample data
- **Usage**: `npm run db:seed`
- **Creates**:
  - 3 users (1 admin, 2 regular)
  - 4 categories
  - 6 products
  - 3 orders with items
  - 5 settings

### Documentation (docs/)

#### API.md
- **Purpose**: API endpoint documentation
- **Contains**:
  - Endpoint descriptions
  - Request/response examples
  - Error codes
  - Authentication details

#### DEPLOYMENT.md
- **Purpose**: Production deployment guide
- **Platforms**: Heroku, Railway, DigitalOcean, AWS
- **Topics**: Security, monitoring, scaling

#### QUICKSTART.md
- **Purpose**: Get started in 5 minutes
- **Contains**: Quick setup steps, common issues

#### SETUP.md
- **Purpose**: Complete setup instructions
- **Contains**: Prerequisites, installation, verification

## 🔑 Key Features by File

### Authentication & Security
- `User.js`: Password hashing
- `authController.js`: Login logic, JWT generation
- `auth.js`: JWT verification, role checking
- `authRoutes.js`: Auth endpoints

### Database
- `database.js`: Connection management
- `models/*.js`: Data models
- `models/index.js`: Relationships
- `migrate.js`: Schema updates
- `seed.js`: Sample data

### Admin Interface
- `adminjs/index.js`: AdminJS setup
- `adminjs/resources.js`: Resource config
- `adminjs/dashboardHandler.js`: Dashboard logic
- `adminjs/components/dashboard.jsx`: Dashboard UI

### API
- `server.js`: Express app
- `routes/*.js`: API endpoints
- `controllers/*.js`: Business logic

## 🚀 Data Flow

### Login Flow
```
User → authRoutes.js → authController.js → User.js → JWT Token
```

### AdminJS Access Flow
```
User → AdminJS Login → resources.js (check role) → Dashboard/Resources
```

### API Request Flow
```
Request → auth.js (verify JWT) → routes → controller → model → response
```

## 📊 Database Relationships

```
User (1) ──── (Many) Order
Category (1) ──── (Many) Product
Order (1) ──── (Many) OrderItem
Product (1) ──── (Many) OrderItem
```

## 🎯 Role-Based Access

### Admin Can Access:
- ✅ All Users
- ✅ All Products (CRUD)
- ✅ All Orders (CRUD)
- ✅ All Categories (CRUD)
- ✅ Settings (CRUD)
- ✅ Full Dashboard

### User Can Access:
- ✅ Own Profile
- ✅ Own Orders (Read)
- ✅ Products (Read)
- ❌ Other Users
- ❌ Settings

## 🔧 Configuration Points

### Environment Variables (.env)
- Server: PORT, NODE_ENV
- Database: Host, port, name, credentials
- Auth: JWT_SECRET, SESSION_SECRET
- Admin: Default email/password

### Database (database.js)
- Connection pooling
- SSL settings
- Logging level

### AdminJS (adminjs/resources.js)
- Resource visibility
- Action permissions
- Property display rules

## 📝 Naming Conventions

### Files
- Models: PascalCase (User.js)
- Controllers: camelCase (authController.js)
- Routes: camelCase (authRoutes.js)

### Code
- Variables/Functions: camelCase
- Classes: PascalCase
- Constants: UPPER_SNAKE_CASE

### Database
- Tables: snake_case (order_items)
- Fields: camelCase in models, snake_case in DB

## 🔄 Development Workflow

1. **Make Changes**: Edit files in `src/`
2. **Test Locally**: `npm run dev`
3. **Migrate DB**: `npm run db:migrate` (if models changed)
4. **Commit**: Follow conventional commits
5. **Push**: Create PR on GitHub

## 📦 Dependencies Overview

### Production Dependencies
- **express**: Web framework
- **sequelize**: ORM
- **pg**: PostgreSQL client
- **adminjs**: Admin panel
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT auth
- **express-session**: Session management
- **dotenv**: Environment variables

### Dev Dependencies
- **nodemon**: Auto-reload server

## 🎓 Learning Path

1. Start with `server.js` (entry point)
2. Understand `models/` (data structure)
3. Review `controllers/` (business logic)
4. Explore `adminjs/` (admin interface)
5. Read documentation in `docs/`

---

This structure follows industry best practices with clear separation of concerns, modular design, and comprehensive documentation.
