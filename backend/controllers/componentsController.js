const Component = require("../models/ComponentsSchema");

/**
 * @desc   Create a new component
 * @route  POST /api/components
 * @access Private (Admin / Authorized user)
 */
exports.createComponent = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      price,
      image,
      about,
      specifications
    } = req.body;

    if (!name || !brand || !category || !price || !image) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    const component = await Component.create({
      name,
      brand,
      category,
      price,
      image,
      about,
      specifications
    });

    res.status(201).json(component);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create component" });
  }
};

/**
 * @desc   Get all components
 * @route  GET /api/components
 * @access Public
 */
exports.getAllComponentsNoCategory = async (req, res) => {
  try {
    const components = await Component.find()
      .sort({ createdAt: -1 });

    res.json(components);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch components" });
  }
};

exports.getAllComponents = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {};
    if (category) {
      filter.category = category;
    }

    const components = await Component.find(filter)
      .sort({ createdAt: -1 });

    res.json(components);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch components" });
  }
};

/**
 * @desc   Get component by ID
 * @route  GET /api/components/:id
 * @access Public
 */
exports.getComponentById = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);

    if (!component) {
      return res.status(404).json({ message: "Component not found" });
    }

    res.json(component);
  } catch (error) {
    res.status(500).json({ message: "Invalid component ID" });
  }
};

/**
 * @desc   Update component
 * @route  PUT /api/components/:id
 * @access Private
 */
exports.updateComponent = async (req, res) => {
  try {
    const updated = await Component.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Component not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update component" });
  }
};

/**
 * @desc   Delete component
 * @route  DELETE /api/components/:id
 * @access Private
 */
exports.deleteComponent = async (req, res) => {
  try {
    const deleted = await Component.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Component not found" });
    }

    res.json({ message: "Component deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete component" });
  }
};

/**
 * @desc   Add / Update star review
 * @route  POST /api/components/:id/review
 * @access Private
 */
exports.addReview = async (req, res) => {
  try {
    const { stars } = req.body;

    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ message: "Stars must be between 1 and 5" });
    }

    const component = await Component.findById(req.params.id);
    if (!component) {
      return res.status(404).json({ message: "Component not found" });
    }

    const existingReview = component.reviews.find(
      r => r.user.toString() === req.user.id
    );

    if (existingReview) {
      existingReview.stars = stars;
    } else {
      component.reviews.push({
        user: req.user.id,
        stars
      });
    }

    await component.save();
    res.json({ message: "Review saved", reviews: component.reviews });
  } catch (error) {
    res.status(500).json({ message: "Failed to add review" });
  }
};
