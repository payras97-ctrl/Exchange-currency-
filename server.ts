import express from "express";
import path from "path";
import axios from "axios";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add JSON parsing middleware
  app.use(express.json());

  // API Proxy Route for Frankfurter
  app.get('/api/frankfurter/*', async (req, res) => {
    try {
      // Get the path after /api/frankfurter/
      const apiPath = req.originalUrl.replace('/api/frankfurter', '');
      const backendUrl = `https://api.frankfurter.dev/v1${apiPath}`;
      
      const response = await axios.get(backendUrl, {
        timeout: 10000
      });
      
      res.json(response.data);
    } catch (error: any) {
      console.error('Frankfurter API Error:', error.message);
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ message: 'Error communicating with currency API', error: error.message });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
