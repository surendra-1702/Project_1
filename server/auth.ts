import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage-local';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 12;

interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string, username: string, email: string, role: string): string => {
  return jwt.sign({ userId, username, email, role }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Get fresh user data
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role || 'user'
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export { AuthRequest };