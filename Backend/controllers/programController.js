import * as ProgramModel from "../models/programModel.js";
import fs from "fs";
import path from "path";

// GET /api/programs -> sab programs (public site + admin dono use karenge)
export const getPrograms = async (req, res) => {
  try {
    const programs = await ProgramModel.getAllPrograms();
    res.status(200).json({ success: true, data: programs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Programs fetch karne me error aaya" });
  }
};

// GET /api/programs/:id -> ek program (Read More ke liye)
export const getProgram = async (req, res) => {
  try {
    const program = await ProgramModel.getProgramById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: "Program nahi mila" });
    }
    res.status(200).json({ success: true, data: program });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Program fetch karne me error aaya" });
  }
};

// POST /api/programs -> naya program add (admin)
export const addProgram = async (req, res) => {
  try {
    const { title, shortDescription, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title aur Description dena zaroori hai" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const program = await ProgramModel.createProgram({
      title,
      shortDescription,
      description,
      imageUrl,
    });

    res.status(201).json({ success: true, message: "Program add ho gaya", data: program });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Program add karne me error aaya" });
  }
};

// PUT /api/programs/:id -> program edit/update (admin)
export const editProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await ProgramModel.getProgramById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: "Program nahi mila" });
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

    const updated = await ProgramModel.updateProgram(id, {
      title: title || existing.Title,
      shortDescription: shortDescription !== undefined ? shortDescription : existing.ShortDescription,
      description: description || existing.Description,
      imageUrl,
    });

    res.status(200).json({ success: true, message: "Program update ho gaya", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Program update karne me error aaya" });
  }
};

// DELETE /api/programs/:id -> program delete (admin)
export const removeProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await ProgramModel.getProgramById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: "Program nahi mila" });
    }

    if (existing.ImageUrl) {
      const imgPath = path.resolve("." + existing.ImageUrl);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await ProgramModel.deleteProgram(id);
    res.status(200).json({ success: true, message: "Program delete ho gaya" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Program delete karne me error aaya" });
  }
};
