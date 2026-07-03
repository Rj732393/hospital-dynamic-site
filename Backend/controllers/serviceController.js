import * as ServiceModel from "../models/serviceModel.js";
import fs from "fs";
import path from "path";

// GET /api/services -> sab services (public site + admin dono use karenge)
export const getServices = async (req, res) => {
  try {
    const services = await ServiceModel.getAllServices();
    res.status(200).json({ success: true, data: services });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Services fetch karne me error aaya" });
  }
};

// GET /api/services/:id -> ek service (Read More ke liye)
export const getService = async (req, res) => {
  try {
    const service = await ServiceModel.getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service nahi mila" });
    }
    res.status(200).json({ success: true, data: service });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Service fetch karne me error aaya" });
  }
};

// POST /api/services -> naya service add (admin)
export const addService = async (req, res) => {
  try {
    const { title, shortDescription, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title aur Description dena zaroori hai" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const service = await ServiceModel.createService({
      title,
      shortDescription,
      description,
      imageUrl,
    });

    res.status(201).json({ success: true, message: "Service add ho gaya", data: service });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Service add karne me error aaya" });
  }
};

// PUT /api/services/:id -> service edit/update (admin)
export const editService = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await ServiceModel.getServiceById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: "Service nahi mila" });
    }

    const { title, shortDescription, description } = req.body;
    let imageUrl = existing.ImageUrl;

    // Agar nayi image aayi hai to purani delete karke nayi save karo
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      if (existing.ImageUrl) {
        const oldPath = path.resolve("." + existing.ImageUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    const updated = await ServiceModel.updateService(id, {
      title: title || existing.Title,
      shortDescription: shortDescription !== undefined ? shortDescription : existing.ShortDescription,
      description: description || existing.Description,
      imageUrl,
    });

    res.status(200).json({ success: true, message: "Service update ho gaya", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Service update karne me error aaya" });
  }
};

// DELETE /api/services/:id -> service delete (admin)
export const removeService = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await ServiceModel.getServiceById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: "Service nahi mila" });
    }

    if (existing.ImageUrl) {
      const imgPath = path.resolve("." + existing.ImageUrl);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await ServiceModel.deleteService(id);
    res.status(200).json({ success: true, message: "Service delete ho gaya" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Service delete karne me error aaya" });
  }
};
