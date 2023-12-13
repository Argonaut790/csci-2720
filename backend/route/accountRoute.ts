import express, { Request, Response } from "express";

const router = express.Router();
import Account from "../model/account";

var multer = require("multer");
var upload = multer();

// Login
router.post("/login", upload.array(), async (req: Request, res: Response) => {
  try {
    const user = await Account.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).send("Incorrect email and password");
    } else if (user && user.password && req.body.password === user.password) {
      const userToken = {
        userId: user.userId,
        username: user.username,
        isAdmin: user.isAdmin,
        email: user.email,
        favourite: user.favourite,
      };
      res.status(200).json(userToken);
    } else {
      res.status(401).send("Wrong password");
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Sign up
router.post("/signup", upload.array(), async (req, res) => {
  try {
    // Server-side validation
    const emailRegEx =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!req.body || !req.body.email || !req.body.email.match(emailRegEx)) {
      return res.status(401).send("Invalud email");
    }

    const registeredUser = await Account.find({ email: req.body.email });

    // Email Registered
    if (registeredUser.length) {
      return res
        .status(400)
        .send(
          "This email has been registered. Please click 'Forgot Password' if you cannot login."
        );
    }

    const account = new Account({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      isAdmin: false,
      favourite: [],
    });
    const saveduser = await account.save();
    res.status(200).json(saveduser);
  } catch (err) {
    res.send("Unknown error, please try again or sign up with another method.");
  }
});

// Get all user info
router.get("/", async (req, res) => {
  try {
    const list = await Account.find();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).send("Failed get all user info");
  }
});

// Get one user info
router.get("/:userId", async (req, res) => {
  try {
    const user = await Account.findOne({ userId: req.params.userId });
    console.log(user);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Failed get one user info");
  }
});

// Update user info
router.patch("/:userId", async (req, res) => {
  try {
    const updatedUser = await Account.updateOne(
      { userId: req.params.userId },
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
        },
      }
    );
    console.log(updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).send("Failed update user info");
  }
});

// Delete user
router.delete("/:userId", async (req, res) => {
  try {
    const removedUser = await Account.deleteOne({ userId: req.params.userId });
    console.log(removedUser);
    res.status(200).json(removedUser);
  } catch (err) {
    res.status(500).send("Failed delete user");
  }
});

// Admin Add user
router.post("/", async (req, res) => {
  try {
    console.log("Adding user");
    const account = new Account({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      isAdmin: req.body.isAdmin,
      favourite: [],
    });
    const saveduser = await account.save();
    res.status(200).json(saveduser);
  } catch (err) {
    res.status(500).send("Failed add new admin user");
  }
});

// // Forgot Password
// router.patch("/password", async (req, res) => {
//   // Get user by email
//   const user = await Account.findOne({ email: req.body.email });
//   if (!user) {
//     return res.status(404).send("No user found with that email address.");
//   }
//   try {
//     // Generate confirmation code
//     const token = getConfirmationCode();
//     await Account.updateOne(
//       { email: req.body.email },
//       { $set: { confirmationCode: token, isConfirmed: false } }
//     );
//     sendPasswordResetEmail(user.username, req.body.email, token);
//     res
//       .status(200)
//       .send("A password reset email has been sent to your email address.");
//   } catch (err) {
//     res
//       .status(500)
//       .send("Internal server error. Please try again or contact admin.");
//   }
// });

// // Get all the users info
// router.get("/", async (req, res) => {
//   try {
//     const list = await Account.find();
//     res.json(list);
//   } catch (err) {
//     res.json({ message: err });
//   }
// });

// // Delete user
// router.delete("/admin/delete/:userId", async (req, res) => {
//   await Account.deleteOne({
//     userId: req.params.userId,
//   })
//     .then(() => {
//       res.json("deleted successfully");
//     })
//     .catch((err) => {
//       res.status(401).json(err);
//     });
// });

module.exports = router;
