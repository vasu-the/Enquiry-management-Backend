const Enquiry = require('../models/enquiryModel');

exports.createEnquiry = async (req, res) => {
  try {
    console.log("Authenticated user:", req.user);
    console.log(" Request body:", req.body);
    console.log(" Uploaded file:", req.file);

    const { title, description, category } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      console.error(" No user ID found in request");
      return res.status(401).json({ error: "Unauthorized: No user" });
    }

    const fileUrl = req.file?.path;
    console.log(" Cloudinary file URL:", fileUrl);

    const newEnquiry = new Enquiry({
      userId,
      title,
      description,
      category,
      fileUrl,
    });

    console.log(" Saving Enquiry object:", newEnquiry);

    const savedEnquiry = await newEnquiry.save();
    console.log(" Enquiry saved:", savedEnquiry);

    res.status(201).json(savedEnquiry);
  } catch (error) {
    console.error(" Error while creating enquiry:");

    try {
      console.error("error.message:", error.message);
      console.error(" error.stack:", error.stack);
      console.error(" Full error JSON:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    } catch (err) {
      console.error("Failed to stringify error, using console.dir");
      console.dir(error, { depth: null });
    }

    res.status(500).json({
      error: 'Failed to create enquiry',
      message: error.message || 'Unknown error',
    });
  }
};
