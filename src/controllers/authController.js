import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// Login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Please provide email and password' 
      });
    }

    // Find user (need to get password for validation)
    const user = await User.findOne({ 
      where: { email },
      attributes: ['id', 'name', 'email', 'password', 'role', 'isActive']
    });

    console.log('Login attempt for email:', email);
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('User account is inactive');
      return res.status(401).json({ 
        error: 'Account is inactive' 
      });
    }

    // Validate password
    console.log('Validating password...');
    console.log('Stored password hash:', user.password);
    const isValidPassword = await user.validatePassword(password);
    console.log('Password validation result:', isValidPassword);
    console.log('Password validation result:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Password validation failed');
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    console.log('Login successful for user:', email);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return user data (without password) and token
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Server error during login' 
    });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      error: 'Server error' 
    });
  }
};

export {
  login,
  getCurrentUser
};
