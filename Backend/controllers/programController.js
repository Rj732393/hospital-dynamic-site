const Program = require("../models/Program");

// helper: convert DB row -> plain object with images as a real array
function serialize(row) {
  const plain = row.toJSON ? row.toJSON() : row;
  let images = [];
  try {
    images = JSON.parse(plain.images || "[]");
  } catch (e) {
    images = [];
  }
  return { ...plain, images };
}

// @desc    Get all programs (optionally filter by category)
// @route   GET /api/programs?category=ongoing
// @access  Public
exports.getPrograms = async (req, res) => {
  try {
    const where = {};
    if (req.query.category) where.category = req.query.category;

    const programs = await Program.findAll({ where, order: [["createdAt", "DESC"]] });
    res.status(200).json({ success: true, count: programs.length, data: programs.map(serialize) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single program by id
// @route   GET /api/programs/:id
// @access  Public
exports.getProgramById = async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: "Program not found" });
    }
    res.status(200).json({ success: true, data: serialize(program) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a new program
// @route   POST /api/programs
// @access  Admin
exports.createProgram = async (req, res) => {
  try {
    const payload = { ...req.body };
    payload.images = JSON.stringify(payload.images || []);
    const program = await Program.create(payload);
    res.status(201).json({ success: true, data: serialize(program) });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update a program
// @route   PUT /api/programs/:id
// @access  Admin
exports.updateProgram = async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: "Program not found" });
    }
    const payload = { ...req.body };
    if (payload.images) payload.images = JSON.stringify(payload.images);
    await program.update(payload);
    res.status(200).json({ success: true, data: serialize(program) });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete a program
// @route   DELETE /api/programs/:id
// @access  Admin
exports.deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: "Program not found" });
    }
    await program.destroy();
    res.status(200).json({ success: true, message: "Program deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
