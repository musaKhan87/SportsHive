require("dotenv").config();
const express = require("express");
const connectDb = require("./utils/db");
const cors = require("cors");
const path = require("path");

const authRouter = require("./routes/auth");
const contactRouter = require("./routes/contacts");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/users");
const eventRouter = require("./routes/events");
const categoriesRouter = require("./routes/categories");
const citiesRouter = require("./routes/cities");
const areaRouter = require("./routes/areas");
const dashboardRouter = require("./routes/dashboard");
const statsRouter = require("./routes/stats");
const searchRouter = require("./routes/search");

const app = express();
const PORT = process.env.PORT || 5000;

connectDb();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Development
      "https://your-frontend-domain.com", // Production frontend URL
    ],
    credentials: true,
  })
);


// Routes
app.use("/api/auth", authRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/admin", adminRouter);
app.use("/api/users", userRouter);
app.use("/api/events", eventRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/cities", citiesRouter);
app.use("/api/areas", areaRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/stats", statsRouter);
app.use("/api/search", searchRouter);



// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});  

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
});


// ---------------------Deployment----------------
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("Api is Running");
  });
}

app.listen(PORT, console.log("Server is running on port ", PORT));