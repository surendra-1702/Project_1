import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";

const app = express();

// CORS — must be first middleware so OPTIONS preflight always succeeds
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type,Authorization,X-Requested-With,Accept'
  );
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      console.log(logLine);
    }
  });

  next();
});

let serverReady: Promise<void> | null = null;

function getServerReady(): Promise<void> {
  if (!serverReady) {
    serverReady = (async () => {
      console.log('[Vercel] Starting registerRoutes...');
      await registerRoutes(app);
      console.log('[Vercel] registerRoutes completed');

      app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        console.error(`[Error] ${status} - ${message}`);
        if (!res.headersSent) {
          res.status(status).json({ message });
        }
      });
    })();
  }
  return serverReady;
}

export default async function handler(req: Request, res: Response) {
  console.log(`[Vercel] ${req.method} ${req.url}`);
  try {
    await getServerReady();
    app(req, res);
  } catch (err: any) {
    console.error('[Vercel] Startup error:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server failed to initialize', error: err.message });
    }
  }
}
