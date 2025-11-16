import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSSequelize from '@adminjs/sequelize';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import sequelize from '../config/database.js';
import { User } from '../models/index.js';
import bcrypt from 'bcrypt';
import {
  userResource,
  categoryResource,
  productResource,
  orderResource,
  orderItemResource,
  settingResource
} from './resources.js';
import { getDashboardData } from './dashboardHandler.js';
import { componentLoader, Components } from './componentLoader.js';

// Register the Sequelize adapter
AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database
});

// AdminJS configuration
const adminOptions = {
  componentLoader,
  resources: [
    userResource,
    categoryResource,
    productResource,
    orderResource,
    orderItemResource,
    settingResource
  ],
  rootPath: '/admin',
  branding: {
    companyName: 'eCommerce',
    logo: false,
    theme: {
      colors: {
        primary100: '#4285f4'
      }
    }
  },
  dashboard: {
    component: Components.Dashboard,
    handler: async (request, response, context) => {
      const currentAdmin = context.currentAdmin;
      
      if (!currentAdmin) {
        return { message: 'Please log in' };
      }

      const data = await getDashboardData(currentAdmin);
      return data;
    }
  },
  pages: {
    Dashboard: {
      component: Components.Dashboard,
      icon: 'Dashboard',
      handler: async (request, response, context) => {
        const currentAdmin = context.currentAdmin;
        
        if (!currentAdmin) {
          return { message: 'Please log in' };
        }

        const data = await getDashboardData(currentAdmin);
        return data;
      }
    }
  }
};

const adminJs = new AdminJS(adminOptions);

// Session store
const PgSession = connectPgSimple(session);
const sessionStore = new PgSession({
  conObject: {
    connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },
  tableName: 'session',
  createTableIfMissing: true
});

// Authentication
const authenticate = async (email, password) => {
  try {
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'name', 'email', 'password', 'role', 'isActive']
    });

    if (!user || !user.isActive) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (isValidPassword) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };
    }

    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

// Create AdminJS router
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate,
    cookieName: 'adminjs',
    cookiePassword: process.env.SESSION_SECRET
  },
  null,
  {
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    },
    name: 'adminjs'
  }
);

export { adminJs, adminRouter };
