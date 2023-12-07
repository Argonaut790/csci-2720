import express, { Request, Response } from "express";

const router = express.Router();
const Account = require("../model/account");

var multer = require("multer");
var upload = multer();

// Login
router.post("/login", upload.array(), async (req: Request, res: Response) => {
  const user = await Account.findOne({ email: req.body.email });

  if (!user) {
    res.status(400);
    res.send("Wrong email / password");
  } else {
    if (req.body.password === user.password) {
      // Password is correct
      // if (!user.isConfirmed) {
      //   // account is not yet confirmed
      //   res
      //     .status(401)
      //     .send(
      //       "Your account is not verified, Please check your email / spambox."
      //     );
      // // } else if (!user.isActivated) {
      // //   // account deactivated
      // //   res
      // //     .status(401)
      // //     .send(
      // //       "Your account is deactivated. Please contact the site administrator in admin@rettiwt.com"
      // //     );
      // } else {
      // Login successfully
      res.status(200).json({
        userId: user.userId,
        username: user.username,
        isAdmin: user.isAdmin,
      });
      // }
    } else {
      res.status(404).send("Wrong password");
    }
  }
});

// Sign up
router.post("/signup", upload.array(), async (req, res) => {
  // Server-side validation
  const emailRegEx =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!req.body || !req.body.email || !req.body.email.match(emailRegEx)) {
    return res.status(401).json("Invalud email");
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
  });

  try {
    const saveduser = await account.save();
    res.status(200).json(saveduser);
  } catch (err) {
    res
      .status(401)
      .json("Unknown error, please try again or sign up with another method.");
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
