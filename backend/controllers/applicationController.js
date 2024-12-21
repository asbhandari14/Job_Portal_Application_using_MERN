import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import { v2 as cloudinary } from "cloudinary";
import uploadImageOnCloudinary from "../middlewares/cloudinary.js";





export const postApplication = async (req, res) => {
  const { jobId } = req.params;
  const { name, email, phone, address, coverLetter } = req.body;

  if (!name || !email || !phone || !address || !coverLetter) {
    return res.status(400).json({ success: false, mssg: "All Fields are required to filled" });
  }

  const jobSeekerInfo = {
    id: req.user._id,
    name,
    email,
    phone,
    address,
    coverLetter,
    role: "Job Seeker",
  };

  const jobDetails = await Job.findById(jobId);

  if (!jobDetails) {
    return res.status(404).json({ success: false, mssg: "Job not found" })
  }

  const isAlreadyApplied = await Application.findOne({
    "jobInfo.jobId": jobId,
    "jobSeekerInfo.id": req.user._id,
  });

  if (isAlreadyApplied) {
    return res.status(404).json({ status: false, mssg: "You have already applied for this job" })
  }

  if (req.file?.filename) {
    const { secure_url, public_id } = await uploadImageOnCloudinary(req.file.path, "Resume"); 

    jobSeekerInfo.resume = {
      public_id: public_id,
      url: secure_url,
    };
  }
  else {
  // console.log(req.user);
    if (req.user && !req.user.resume.url) {
      return res.status(400).json({ success: false, mssg: "Please upload your resume" });
    }

    jobSeekerInfo.resume = {
      public_id: req.user.resume.public_id,
      url: req.user.resume.url,
    };
  }

  const employerInfo = {
    id: jobDetails.postedBy,
    role: "Employer",
  };

  const jobInfo = {
    jobId: jobId,
    jobTitle: jobDetails.title,
  };

  const application = await Application.create({
    jobSeekerInfo,
    employerInfo,
    jobInfo,
  });

  res.status(201).json({
    success: true,
    message: "Application submitted.",
    application,
  });
}



export const employerGetAllApplication = async (req, res) => {
  const { _id } = req.user;
  const applications = await Application.find({
    "employerInfo.id": _id,
    "deletedBy.employer": false,
  });
  res.status(200).json({
    success: true,
    applications,
  });
}



export const jobSeekerGetAllApplication = async (req, res) => {
  const { _id } = req.user;
  const applications = await Application.find({
    "jobSeekerInfo.id": _id,
    "deletedBy.jobSeeker": false,
  });
  return res.status(200).json({ success: true, applications });
}


export const deleteApplication = async (req, res) => {
  const { id } = req.params;

  const application = await Application.findById(id);

  if (!application) {
    return res.status(404).json({ success: false, mssg: "Application not found" });
  }

  const { role } = req.user;

  switch (role) {
    case "Job Seeker":
      application.deletedBy.jobSeeker = true;
      await application.save();
      break;
    case "Employer":
      application.deletedBy.employer = true;
      await application.save();
      break;

    default:
      console.log("Default case for application delete function.");
      break;
  }

  if (application.deletedBy.employer === true && application.deletedBy.jobSeeker === true) {
    await application.deleteOne();
  }
  res.status(200).json({
    success: true,
    message: "Application Deleted.",
  });
}


export const alreadyApplied=async(req, res)=>{
  try {
    const user = req.user
    const {jobId} = req.params;
    
    const alreadyAppliedUser = await Application.findOne({
      $and: [{ "jobSeekerInfo.id" : user._id.toString() }, { "jobInfo.jobId" : jobId }]
    })

    if(!alreadyAppliedUser){
      return res.status(401).json({success: false, mssg : "Not Applied yet"});
    }

    return res.status(200).json({success: true, mssg : "Already Applied"})
  } catch (error) {
    console.log(error)
  }
}