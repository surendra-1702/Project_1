import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { pool } from '../db';
import { storage } from '../storage';
import type { Express } from 'express';

const PgSession = connectPgSimple(session);

export function setupGoogleAuth(app: Express) {
  // Session configuration
  app.use(session({
    store: new PgSession({
      pool: pool,
      tableName: 'sessions',
      createTableIfMissing: false,
    }),
    secret: process.env.SESSION_SECRET || 'your-session-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const googleId = profile.id;
      const email = profile.emails?.[0]?.value;
      const firstName = profile.name?.givenName;
      const lastName = profile.name?.familyName;
      const profileImageUrl = profile.photos?.[0]?.value;

      if (!email) {
        return done(new Error('No email found in Google profile'), null);
      }

      // Check if user exists, if not create them
      let user = await storage.getUser(googleId);
      
      if (!user) {
        user = await storage.upsertUser({
          id: googleId,
          email,
          firstName,
          lastName,
          profileImageUrl,
          lastLoginAt: new Date(),
        });
      } else {
        // Update last login
        user = await storage.updateUser(googleId, {
          lastLoginAt: new Date(),
        });
      }

      return done(null, user);
    } catch (error) {
      console.error('Google Auth Error:', error);
      return done(error, null);
    }
  }));

  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Auth routes
  app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login-failed' }),
    (req, res) => {
      // Successful authentication
      res.redirect('/');
    }
  );

  app.get('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/auth/me', (req, res) => {
    if (req.isAuthenticated() && req.user) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  });
}

// Middleware to check if user is authenticated
export function requireAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ message: 'Authentication required' });
  }
}