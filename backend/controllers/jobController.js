import { Job } from "../models/jobSchema.js";





export const postJob = async (req, res) => { 
  const { title, jobType, location, companyName, introduction, responsibilities, qualifications, offers, salary, hiringMultipleCandidates, personalWebsiteTitle, personalWebsiteUrl, jobCategory } = req.body;

  
  if (!title || !jobType || !location || !companyName || !introduction || !responsibilities || !qualifications || !salary || !jobCategory) {
    return res.status(400).json({ success: false, mssg: "Please provide full job details" })
  }

  if ((personalWebsiteTitle && !personalWebsiteUrl) || (!personalWebsiteTitle && personalWebsiteUrl)) {
    return res.status(400).json({ success: false, mssg: "Provide both the website url and title, or leave both blank" })
  }

  const postedBy = req.user._id;

  const job = await Job.create({ title, jobType, location, companyName, introduction, responsibilities, qualifications, offers, salary, hiringMultipleCandidates, personalWebsite: { title: personalWebsiteTitle, url: personalWebsiteUrl }, jobCategory, postedBy });


  return res.status(201).json({ success: true, mssg: "Job posted successfully.", job });
}



export const getAllJobs = async (req, res) => {
  let { city, category, searchKeyword } = req.query;
  if(city && city == "Any City") city="";
  if(category && category == "Any Job") category = "";

  const query = {};
  if (city) {
    query.location = city;
  }
  if (category) {
    query.jobCategory = category;
  }

// In this if the searchKeyword exist then it check whether that searchKeyword exist in the title or not and option "i" means it ignore case sensitivity and if not exist in title then it checkin the company Name and then in the introduction whatever exist out of these that has been push in the query object 
  if (searchKeyword) {
    query.$or = [
      { title: { $regex: searchKeyword, $options: "i" } },
      { companyName: { $regex: searchKeyword, $options: "i" } },
      { introduction: { $regex: searchKeyword, $options: "i" } },
    ];
  }
  // console.log(query)
  const jobs = await Job.find(query);
  return res.status(200).json({ success: true, jobs, count: jobs.length });
}



export const getMyJobs = async (req, res) => {
  const myJobs = await Job.find({ postedBy: req.user._id });
  res.status(200).json({ success: true, myJobs });
}



export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return res.status(404).json({ success: false, mssg: "Oops! Job not found" })
  }

  await job.deleteOne();

  return res.status(200).json({ success: true, mssg: "Job deleted"});
}



export const getASingleJob = async (req, res) => {
  const { id } = req.params;
  // console.log(id);

  const job = await Job.findOne({_id: id});
  // console.log(job);
  if (!job) {
    return res.status(404).json({ success: false, mssg: "Job not found"});
  }
  return res.status(200).json({ success: true, job});
}
