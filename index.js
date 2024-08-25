const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = 2501;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// controllers
const UserController = require("./controllers/userController");
const ComplaintController = require("./controllers/complaintController");
const InformationController = require("./controllers/informationController");
const InterestController = require("./controllers/interestController");
const NoteController = require("./controllers/noteController");
const VictimController = require("./controllers/victimController");

// middlewares
const middlewares = require("./middlewares/authMiddleware");

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Successfully",
  });
});

// API routes
// user / admin
app.post("/api/v1/register/user", UserController.registerUser);
app.post("/api/v1/register/admin", UserController.registerAdmin);
app.post("/api/v1/login", UserController.login);
app.put(
  "/api/v1/update/user/:id",
  middlewares.authenticate,
  UserController.updateUser
);
app.get(
  "/api/v1/current/user",
  middlewares.authenticate,
  UserController.currentUser
);

// complaints
app.post(
  "/api/v2/complaint/create/:id",
  middlewares.authenticate,
  ComplaintController.createComplaint
);
app.put(
  "/api/v2/complaint/update/process/:id",
  middlewares.authenticate,
  ComplaintController.updateComplaintIsProcess
);
app.put(
  "/api/v2/complaint/update/done/:id",
  middlewares.authenticate,
  ComplaintController.updateComplaintIsDone
);
app.delete(
  "/api/v2/complaint/delete/:id",
  middlewares.authenticate,
  ComplaintController.deleteComplaint
);
app.get(
  "/api/v2/complaints",
  middlewares.authenticate,
  ComplaintController.getAllComplaints
);
app.get(
  "/api/v2/complaints/waiting",
  middlewares.authenticate,
  ComplaintController.getComplaintIsWaiting
);
app.get(
  "/api/v2/complaints/process",
  middlewares.authenticate,
  ComplaintController.getComplaintIsProcess
);
app.get(
  "/api/v2/complaints/done",
  middlewares.authenticate,
  ComplaintController.getComplaintIsDone
);
app.get(
  "/api/v2/complaints/violence",
  middlewares.authenticate,
  ComplaintController.getComplaintByViolence
);
app.get(
  "/api/v2/complaint/:id",
  middlewares.authenticate,
  ComplaintController.getComplaintById
);
app.put(
  "/api/v2/complaint/opened/:id",
  middlewares.authenticate,
  ComplaintController.updateIsOpened
);

// victim routes
app.get(
  "/api/v3/victims/count",
  middlewares.authenticate,
  VictimController.getVictimByCount
);

// notes
app.post(
  "/api/v4/notes/create/:id",
  middlewares.authenticate,
  // middlewares.isSuperAdmin,
  NoteController.createNote
);
app.delete(
  "/api/v4/notes/delete/:id",
  middlewares.authenticate,
  NoteController.deleteNote
);
app.get(
  "/api/v4/notes/read/:id",
  middlewares.authenticate,
  NoteController.getAllNotesByComplaint
);

// interest
app.post(
  "/api/v5/interest/create/:id",
  middlewares.authenticate,
  InterestController.createInterest
);
app.get(
  "/api/v5/interest/read",
  middlewares.authenticate,
  InterestController.getAllInterest
);
app.get(
  "/api/v5/interest/read/:id",
  middlewares.authenticate,
  InterestController.getInterestByComplaintId
);

// information
app.post(
  "/api/v6/information/create",
  middlewares.authenticate,
  InformationController.createInformation
);
app.delete(
  "/api/v5/interest/delete/:id",
  middlewares.authenticate,
  InformationController.deleteInformation
);
app.get("/api/v5/information/read", InformationController.getAllInformation);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`listening on http://localhost:${PORT}`);
});
