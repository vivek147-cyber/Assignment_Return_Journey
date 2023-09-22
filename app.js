import express from "express";
import dotenv from "dotenv";
import ipinfo from "ipinfo";
import allroute from "./routes/allroute.js";
import cors from "cors";

const app = express();

dotenv.config({
    path: "./config/config.env",
})

app.use(express.json())


app.use( async(req, res, next) => {
    const ipAddress = req.ip; // Assuming the IP address is available in req.ip
  
    ipinfo(ipAddress, (err, cLoc) => {
      if (err) {
        console.error('IP Info Error:', err);
        return res.status(500).json({ error: 'IP validation failed' });
      }
  
      req.ipInfo = cLoc;
      next();
    });
  });


app.use("/users",allroute);

app.use(
    cors({
      origin: [process.env.FRONTEND_URL],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

app.get("/", (req, res) => {
    res.send("Nice working");
  });

export default app;