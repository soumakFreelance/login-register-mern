// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const authRoutes = require("./routes/authRoutes");

// const app = express();
// const PORT = process.env.PORT || 8080;

// app.get('/api/home', (req, res) => {
//     res.json({ msg: 'Welcome to the Home page!' });
//   });

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);

// app.get("/", (req, res) => {
//   res.send("Welcome to the Auth System backend!");
// });

// // DB Connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected");
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch(err => console.error("MongoDB connection failed:", err));


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken"); // for optional token auth check

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ CORS Middleware — allow frontend (React) to access this backend
app.use(cors({ origin: "http://localhost:3000" })); // only allow your frontend origin
// OR for development: app.use(cors());

app.use(express.json());

// 👇 Optional: Protected Route with JWT token check
app.get("/api/home", (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify JWT
    console.log(decoded)
    return res.json({ msg: `Welcome, ${decoded.email}` }); // or any info from token
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
});

// Auth Routes
app.use("/api/auth", authRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the Auth System backend!");
});

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection failed:", err));
