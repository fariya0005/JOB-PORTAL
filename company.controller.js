import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}



export const updateCompany = async (req, res) => {
    try {
        // Destructure the fields from req.body
        const updateFields = req.body; // This will handle any field provided in the body

        // Access the uploaded file, if provided
        const file = req.file;
        if (file) {
            const fileUri = getDataUri(file); // Get the data URI from the uploaded file
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            updateFields.logo = cloudResponse.secure_url; // Add the logo URL to update fields
        }

        // Update the company with dynamic fields
        const company = await Company.findByIdAndUpdate(req.params.id, updateFields, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Company information updated.",
            success: true,
            data: company, // Return updated company data
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message, success: false });
    }
};




