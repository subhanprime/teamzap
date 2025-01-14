const express = require("express");
const router = express.Router();
const updateSkillsRoute = require("./updateSkills");
const updateSportsRoute = require("./updateSports");
const getUsersBySkills = require("./getUsersBySkills");
const getOngoingProjectsRoute = require("./getOngoingProjects");
const refreshToken = require("./refreshToken");
const signup = require("./auth/signup");
const login = require("./auth/login");
const createProject = require("./createProject");
const getExploreProjects = require("./getExploreProjects");
const getPendingProjects = require("./getPendingProjects");
const addSkill = require("./addSkill");
const addSport = require("./addSport");
const getAllSkills = require("./getAllSkills");
const getAllSports = require("./getAllSports");
const getProject = require("./getProject");
const testRouter = require("./test.routes.js")
const searchRouter = require('./search.routes.js');
const acceptProject = require('./acceptProject.js');
const rejectProject = require('./rejectProject.js');
const refreshRoutes = require('./auth/refresh.routes.js');
const userRelativeCreatives = require('./userRelativeCreatives.js');
const creativePendingProjects = require('./creativePendingProjects.js');
const creativeInProgressProject = require('./creativeInProgressProjects.js');
const athleteFavoriteList = require('./athleteFavoriteList.js');
const searchCreative = require('./searchCreatives.js');
const conversation = require('./conversations.js');
const messages = require('./messages.js');
const allAthleteProjects = require('./allAthleteProjects.js');
const proposals = require('./proposal.js');
const logout = require('./auth/logout.js');
const updateBio = require('./updateBio.js');
const getUser = require('./getUser.js');
const forgotPassword = require('./forgotPassword.js');
const athleteAcceptProposalOfCreative = require('./athleteAcceptProposal.js');
const averagePriceForSameProject = require('./averagePriceForSameProject.js');
const handleUser = require('./handleUser.js');
const calculateEarnings = require('./calculateEarnings.js');
const proofAddForProject = require("./proofAddForProject.js");
const accountVerify = require('./accountVerify.js');
const uploadFinalProject = require('./uploadFinalProject');
const handleRating = require('./handleRating.js');
const handleStripe = require('./handleStripe.js');
const projects = require('./projects.js');
const athleteFavoriteCreative = require('./AthleteFavoriteCreative.js')

router.use('/athlete', athleteFavoriteCreative);
router.use('/project', projects);
router.use('/stripe', handleStripe);
router.use('/review', handleRating);
router.use('/finalProject', uploadFinalProject);
router.use("/VerifyAccount", accountVerify);
router.use("/user", handleUser);
router.use("/proofAddForProject", proofAddForProject);
router.use("/allAthleteProjects", allAthleteProjects);
router.use("/password", forgotPassword);
router.use("/signup", signup);
router.use("/getUser", getUser);
router.use("/updateBio", updateBio);
router.use("/logout", logout);
router.use("/proposal", proposals);
router.use("/login", login);
router.use("/test", testRouter);
router.use("/addSport", addSport);
router.use("/addSkill", addSkill);
router.use("/search", searchRouter);
router.use("/getProject", getProject);
router.use("/refresh", refreshRoutes);
router.use("/messages", messages);
router.use("/earning", calculateEarnings);
router.use("/getAllSkills", getAllSkills);
router.use("/getAllSports", getAllSports);
router.use("/refreshToken", refreshToken);
router.use("/createProject", createProject);
router.use("/conversations", conversation);
router.use('/searchCreatives', searchCreative);
router.use("/updateSkills", updateSkillsRoute);
router.use("/updateSports", updateSportsRoute);
router.use("/getUsersBySkills", getUsersBySkills);
router.use("/getExploreProjects", getExploreProjects);
router.use("/getPendingProjects", getPendingProjects);
router.use("/getOngoingProjects", getOngoingProjectsRoute);
router.use("/relevantToAthleteCreative", userRelativeCreatives);
router.use('/addFavoriteCreativeOfAthlete', athleteFavoriteList);
router.use("/creativePendingProjects", creativePendingProjects);
router.use("/creativeInProgressProjects", creativeInProgressProject);
router.use("/averagePriceForSameProject", averagePriceForSameProject);
router.use('/athleteAcceptProposalOfCreative', athleteAcceptProposalOfCreative);
router.use('/acceptProject', acceptProject)
router.use('/rejectProject', rejectProject)



module.exports = router;
