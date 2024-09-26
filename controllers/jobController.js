const mongoose = require('mongoose');
const jobModel = require('../models/jobModel');
const moment = require('moment');

const createJobController = async (req, res, next) => {
  const { company, position } = req.body;
  if (!company || !position) {
    next('Please provide fields');
  }
  req.body.createdBy = req.user.userId;
  const job = await jobModel.create(req.body);
  res.status(201).json(job);
};
const getJobsController = async (req, res, next) => {
  const { status, workType, position, search, sort } = req.query;
  const queryObject = {
    createdBy: req.user.userId,
  };
  if (status && status !== 'all') {
    queryObject.status = status;
  }
  if (workType && workType !== 'all') {
    queryObject.workType = workType;
  }
  if (position && position !== 'all') {
    queryObject.position = position;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: 'i' };
  }

  let queryResult = jobModel.find(queryObject);
  if (sort === 'latest') {
    queryResult = queryResult.sort('createdAt');
  }
  if (sort === 'oldest') {
    queryResult = queryResult.sort('-createdAt');
  }
  if (sort === 'a-z') {
    queryResult = queryResult.sort('position');
  }
  if (sort === 'z-a') {
    queryResult = queryResult.sort('-position');
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 1;
  const skip = (page - 1) * limit;
  queryResult = queryResult.skip(skip).limit(limit);
  const totalJobs = await jobModel.countDocuments(queryResult);
  const numPages = Math.ceil(totalJobs / limit);
  const jobs = await queryResult;
  // const jobs = await jobModel.find({ createdBy: req.user.userId });
  res.status(200).json({
    totalJobs,
    jobs,
    numPages: page,
  });
};
const updateJobsController = async (req, res, next) => {
  const { id } = req.params;
  const { company, position } = req.body;
  if (!position || !company) {
    next('Please provide all fields');
  }
  const job = await jobModel.findOne({ _id: id });
  if (!job) {
    next('No job found with id ' + id);
  }
  if (!req.user.userId === job.createdBy.toString()) {
    next('you are not authorized to update this job');
    return;
  }
  const updateJob = await jobModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json(updateJob);
};
const deleteJobsController = async (req, res, next) => {
  const { id } = req.params;
  const job = await jobModel.findOne({ _id: id });
  if (!job) {
    next('No job found with id ' + id);
  }
  if (!req.user.userId === job.createdBy.toString()) {
    next('you are not authorized to delete this job');
    return;
  }
  await job.deleteOne();
  res.status(200).json({ message: 'Job deleted successfully' });
};

const jobStatsController = async (req, res) => {
  const stats = await jobModel.aggregate([
    // search by user job
    {
      $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) },
    },
    {
      $group: { _id: '$status', count: { $sum: 1 } },
    },
  ]);
  const defaultStats = {
    pending: stats.pending || 0,
    reject: stats.reject || 0,
    interview: stats.interview || 0,
  };

  let monthlyApplication = await jobModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
  ]);
  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM y');
      return { date, count };
    })
    .reverse();
  res
    .status(200)
    .json({ totalJob: stats.length, defaultStats, monthlyApplication });
};
module.exports = {
  createJobController,
  getJobsController,
  updateJobsController,
  deleteJobsController,
  jobStatsController,
};
