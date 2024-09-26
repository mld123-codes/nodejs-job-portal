const express = require('express');
const userAuth = require('../middleware/authMiddleware');
const {
  createJobController,
  getJobsController,
  updateJobsController,
  deleteJobsController,
  jobStatsController,
} = require('../controllers/jobController');
const router = express.Router();

router.post('/create-job', userAuth, createJobController);
router.get('/get-jobs', userAuth, getJobsController);
router.patch('/update-job/:id', userAuth, updateJobsController);
router.delete('/delete-job/:id', userAuth, deleteJobsController);
router.get('/job-stats', userAuth, jobStatsController);

module.exports = router;
