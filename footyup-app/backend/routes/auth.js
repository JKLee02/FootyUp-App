import express from "express";
import jwt from "jsonwebtoken";
import { db } from "./database.js";

const router = express.Router();

//JWT secret key
const jwtSecret = "your_jwt_secret_key";

// Refresh token endpoint
router.post("/refresh", (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  // Verify the refresh token (assuming it's stored in your backend somewhere)
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    // If valid, generate a new access token
    const newAccessToken = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: "1h",
    });
    res.json({ accessToken: newAccessToken });
  });
});

// POST Signup Route
router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  db.query("SELECT * FROM user WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.error("Error during user lookup:", err);
      return res.status(500).json({ message: "Error checking user existence" });
    }
    if (result.length > 0) {
      console.warn("User already exists with this email:", email);
      return res.status(400).json({ message: "Email already exists" });
    }

    // Insert user into the database (plain text password)
    db.query(
      "INSERT INTO user (`user_firstname`, `user_lastname`, `email`, `password`) VALUES (?, ?, ?, ?)",
      [firstName, lastName, email, password],
      (err, result) => {
        if (err) {
          console.error("Error inserting new user:", err);
          return res.status(500).json({ message: "Error creating user" });
        }
        res.status(201).json({ message: "User registered successfully" });
      },
    );
  });
});

// POST Login Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM user WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0)
        return res.status(401).json({ message: "User not found" });

      const user = result[0];

      if (password !== user.password) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const accessToken = jwt.sign({ id: user.user_id }, jwtSecret, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign({ id: user.user_id }, jwtSecret, {
        expiresIn: "7d",
      });

      res.json({
        message: "Login successful",
        accessToken,
        refreshToken,
        user_firstname: user.user_firstname,
        user_id: user.user_id,
      });
    },
  );
});

// Fetch User Profile Details Route
router.get("/userprofile", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization header" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, jwtSecret);

    db.query(
      "SELECT user_firstname, user_lastname, email, password, user_gender FROM user WHERE user_id = ?",
      [decoded.id],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Database error" });
        }
        if (result.length === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        const user = result[0];
        res.json({
          firstName: user.user_firstname,
          lastName: user.user_lastname,
          email: user.email,
          password: user.password,
          gender: user.user_gender,
        });
      },
    );
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
});

// Update user details
router.put("/userprofile", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = jwt.verify(token, jwtSecret);
  const { firstName, lastName, email, password, gender } = req.body;

  const updates = [];
  const values = [];

  if (firstName) {
    updates.push("user_firstname = ?");
    values.push(firstName);
  }
  if (lastName) {
    updates.push("user_lastname = ?");
    values.push(lastName);
  }
  if (email) {
    updates.push("email = ?");
    values.push(email);
  }
  if (password) {
    updates.push("password = ?");
    values.push(password);
  }
  if (gender) {
    updates.push("user_gender = ?");
    values.push(gender);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  values.push(decoded.id);

  const query = `UPDATE user SET ${updates.join(", ")} WHERE user_id = ?`;
  db.query(query, values, (err) => {
    if (err)
      return res.status(500).json({ message: "Error updating user details" });
    res.json({ message: "User details updated successfully" });
  });
});

// Admin
// Admin Login Route
router.post("/adminlogin", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM admin WHERE admin_email = ?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.length === 0)
        return res.status(401).json({ message: "Admin not found" });

      const admin = result[0];

      if (password !== admin.admin_password) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const accessToken = jwt.sign({ id: admin.admin_id }, jwtSecret, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign({ id: admin.admin_id }, jwtSecret, {
        expiresIn: "7d",
      });

      res.json({
        message: "Admin login successful",
        accessToken,
        refreshToken,
        admin_name: admin.admin_name,
      });
    },
  );
});

export default router;
