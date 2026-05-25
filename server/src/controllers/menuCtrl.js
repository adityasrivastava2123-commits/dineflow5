import MenuItem from "../models/MenuItem.js";
import { getCache, setCache, deleteCache, invalidatePattern } from "../config/redis.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";
import logger from "../utils/logger.js";

const CACHE_KEY_PREFIX = "menu:";

export const getMenu = async (req, res) => {
  try {
    const { category, search } = req.query;
    const restaurantId = req.headers["x-restaurant-id"] || req.query.restaurant;

    const cacheKey = `${CACHE_KEY_PREFIX}${restaurantId}:${category || "all"}:${search || "none"}`;
    const cachedMenu = await getCache(cacheKey);

    if (cachedMenu) {
      return res.status(200).json({
        success: true,
        data: { items: cachedMenu },
        fromCache: true,
      });
    }

    let query = { restaurant: restaurantId, available: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const items = await MenuItem.find(query).sort({ isPopular: -1, rating: -1 });

    await setCache(cacheKey, items, 3600);

    res.status(200).json({
      success: true,
      data: { items },
    });
  } catch (error) {
    logger.error("Get menu error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch menu",
    });
  }
};

export const getMenuCategories = async (req, res) => {
  try {
    const restaurantId = req.headers["x-restaurant-id"] || req.query.restaurant;

    const categories = await MenuItem.distinct("category", {
      restaurant: restaurantId,
      available: true,
    });

    res.status(200).json({
      success: true,
      data: { categories: categories.sort() },
    });
  } catch (error) {
    logger.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const { name, price, category, description, vegetarian, spicyLevel, preparationTime, addons } = req.body;
    const restaurantId = req.headers["x-restaurant-id"];

    let imageData = {};
    if (req.file) {
      const cloudinaryResult = await uploadToCloudinary(req.file, `dineflow/menu/${restaurantId}`);
      imageData = {
        url: cloudinaryResult.url,
        publicId: cloudinaryResult.publicId,
      };
    }

    const menuItem = new MenuItem({
      name,
      price,
      category,
      description,
      vegetarian,
      spicyLevel,
      preparationTime,
      addons,
      image: imageData,
      restaurant: restaurantId,
    });

    await menuItem.save();
    await invalidatePattern(`${CACHE_KEY_PREFIX}${restaurantId}:*`);

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: { item: menuItem },
    });
  } catch (error) {
    logger.error("Create menu item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create menu item",
    });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const restaurantId = req.headers["x-restaurant-id"];

    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    if (req.file) {
      if (menuItem.image?.publicId) {
        await deleteFromCloudinary(menuItem.image.publicId);
      }
      const cloudinaryResult = await uploadToCloudinary(req.file, `dineflow/menu/${restaurantId}`);
      updateData.image = {
        url: cloudinaryResult.url,
        publicId: cloudinaryResult.publicId,
      };
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    await invalidatePattern(`${CACHE_KEY_PREFIX}${restaurantId}:*`);

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: { item: updatedItem },
    });
  } catch (error) {
    logger.error("Update menu item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update menu item",
    });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurantId = req.headers["x-restaurant-id"];

    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    if (menuItem.image?.publicId) {
      await deleteFromCloudinary(menuItem.image.publicId);
    }

    await MenuItem.findByIdAndDelete(id);
    await invalidatePattern(`${CACHE_KEY_PREFIX}${restaurantId}:*`);

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    logger.error("Delete menu item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete menu item",
    });
  }
};

export const toggleMenuItemAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;
    const restaurantId = req.headers["x-restaurant-id"];

    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      { available },
      { new: true }
    );

    await invalidatePattern(`${CACHE_KEY_PREFIX}${restaurantId}:*`);

    res.status(200).json({
      success: true,
      message: "Menu item availability updated",
      data: { item: menuItem },
    });
  } catch (error) {
    logger.error("Toggle availability error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update availability",
    });
  }
};
