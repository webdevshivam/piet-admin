import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto"; // Import randomUUID

import { uploadFile , deleteFile } from "../shared/fileHelpers";
import { fileURLToPath } from "url";
import { dirname } from "path";

const memoryStorageEngine = multer.memoryStorage();
const upload = multer({ storage: memoryStorageEngine });
// Equivalent to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


import {
  insertFacultySchema,
  insertBannerSchema,
  insertNewsSchema,
  insertIprSchema,
  insertManagementTeamSchema,
  insertCellsCommitteesSchema,
  insertGallerySchema,
  loginUserSchema,
  updateUserSchema,
} from "@shared/schema";
import { z } from "zod";
import { FacultyModel, BannerModel, NewsModel, IprModel, ManagementTeamModel, CellsCommitteesModel, GalleryModel } from "./models/index";
import { User } from "./models/user";
import jwt from "jsonwebtoken";
import validator from "validator";

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper for string ID parsing
  function getId(req: any) {
    return req.params.id; // IDs are strings like "6876073fc80381755fbb6aaa"
  }



  // User login
  app.post("/api/login", async (req, res) => {
    try {
      const validatedData = loginUserSchema.parse(req.body);

      // Find user by email
      const user = await User.findOne({ email: validatedData.email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(validatedData.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // Get user profile
  app.get("/api/profile", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any;
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  });

  // Update user profile
  app.put("/api/profile", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any;
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const validatedData = updateUserSchema.parse(req.body);

      // If updating password, verify current password
      if (validatedData.newPassword) {
        if (!validatedData.currentPassword) {
          return res.status(400).json({ message: "Current password is required to set new password" });
        }

        const isCurrentPasswordValid = await user.comparePassword(validatedData.currentPassword);
        if (!isCurrentPasswordValid) {
          return res.status(400).json({ message: "Current password is incorrect" });
        }

        user.password = validatedData.newPassword;
      }

      // Update other fields
      if (validatedData.email) {
        // Check if email is already taken by another user
        const existingUser = await User.findOne({
          email: validatedData.email,
          _id: { $ne: user._id }
        });
        if (existingUser) {
          return res.status(400).json({ message: "Email already taken by another user" });
        }
        user.email = validatedData.email;
      }

      if (validatedData.name) {
        user.name = validatedData.name;
      }

      await user.save();

      res.json({
        message: "Profile updated successfully",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Faculty
  app.get("/api/faculty", async (req, res) => {
    try {
      const faculty = await storage.getFaculty();
      res.json(faculty);
    } catch {
      res.status(500).json({ message: "Failed to fetch faculty" });
    }
  });
app.post("/api/faculty", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file ? await uploadFile(req, "faculty") : null;

    const validatedData = insertFacultySchema.parse({
      ...req.body,
      imageUrl: imageUrl,
    });

    const faculty = await storage.createFaculty(validatedData);
    return res.status(201).json(faculty);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Invalid data", errors: error.errors });
    }
    console.error("❌ POST faculty error:", error);
    return res.status(500).json({
      message: "Failed to create faculty",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});


  app.put("/api/faculty/:id", upload.single("image"), async (req, res) => {
  try {
    const id = getId(req);
    const oldFaculty = await storage.getFacultyById(id);

    if (!oldFaculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    let imageUrl = oldFaculty.imageUrl;
    if (req.file) {
      // A new file was uploaded, so process it
      imageUrl = await uploadFile(req, "faculty");
      // If there was an old image, delete it
      if (oldFaculty.imageUrl) {
        await deleteFile(oldFaculty.imageUrl);
      }
    }

    const validatedData = insertFacultySchema.partial().parse({
      ...req.body,
      imageUrl: imageUrl,
    });

    const faculty = await storage.updateFaculty(id, validatedData);
    res.json(faculty);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid data", errors: error.errors });
    } else {
      res.status(500).json({ message: "Failed to update faculty" });
    }
  }
});
  app.delete("/api/faculty/:id", async (req, res) => {
    try {
    const id = getId(req);

    // Step 1: Get faculty data to get the image URL before deleting
    const faculty = await storage.getFacultyById(id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Step 2: Delete the faculty from DB
    await storage.deleteFaculty(id);

    // Step 3: Delete the image file if present
    if (faculty.imageUrl) {
      await deleteFile(faculty.imageUrl);
    }

    return res.status(204).send();
  } catch (error) {
    console.error("❌ DELETE faculty error:", error);
    return res.status(500).json({ message: "Failed to delete faculty" });
  }
  });

  // Banners
  app.get("/api/banners", async (req, res) => {
    try {
      const banners = await storage.getBanners();
      res.json(banners);
    } catch {
      res.status(500).json({ message: "Failed to fetch banners" });
    }
  });
  app.post("/api/banners", upload.single("image"), async (req, res) => {
    try {
      const imageUrl = req.file ? await uploadFile(req, "banners") : null;

      // Convert FormData string values to proper types
      const processedData = {
        ...req.body,
        priority: parseInt(req.body.priority) || 1,
        isActive: req.body.isActive === 'true',
        imageUrl: imageUrl || req.body.imageUrl || "",
      };

      console.log("Processing banner data:", processedData);

      const validatedData = insertBannerSchema.parse(processedData);

      const banner = await storage.createBanner(validatedData);
      res.status(201).json(banner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("❌ Banner validation errors:", error.errors);
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("❌ POST banner error:", error);
        res.status(500).json({ message: "Failed to create banner" });
      }
    }
  });
  app.put("/api/banners/:id", upload.single("image"), async (req, res) => {
    try {
      const id = getId(req);
      const oldBanner = await storage.getBannerById(id);

      if (!oldBanner) {
        return res.status(404).json({ message: "Banner not found" });
      }

      let imageUrl = oldBanner.imageUrl;
      if (req.file) {
        imageUrl = await uploadFile(req, "banners");
        if (oldBanner.imageUrl) {
          await deleteFile(oldBanner.imageUrl);
        }
      }

      // Convert FormData string values to proper types
      const processedData = {
        ...req.body,
        priority: req.body.priority ? parseInt(req.body.priority) : undefined,
        isActive: req.body.isActive !== undefined ? req.body.isActive === 'true' : undefined,
        imageUrl: imageUrl,
      };

      const validatedData = insertBannerSchema.partial().parse(processedData);

      const banner = await storage.updateBanner(id, validatedData);
      res.json(banner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("❌ Banner update validation errors:", error.errors);
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update banner" });
      }
    }
  });
  const baseDir = process.cwd();
 app.delete("/api/banners/:id", async (req, res) => {
  try {
    const id = getId(req);

    // 1. Get banner (for image path)
    const banner = await storage.getBannerById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // 2. Delete the banner from DB
    await storage.deleteBanner(id);

    // 3. Delete the image file from Cloudinary if present
    if (banner.imageUrl) {
      await deleteFile(banner.imageUrl);
    }

    res.status(204).send(); // Success (no content)
  } catch (err) {
    console.error("Error deleting banner or image:", err);
    res.status(500).json({ message: "Failed to delete banner" });
  }
});
  // News
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getNews();
      res.json(news);
    } catch {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });
  app.post("/api/news", async (req, res) => {
    try {
      const validatedData = insertNewsSchema.parse(req.body);
      const news = await storage.createNews(validatedData);
      res.status(201).json(news);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create news" });
      }
    }
  });
  app.put("/api/news/:id", async (req, res) => {
    try {
      const id = getId(req);
      const validatedData = insertNewsSchema.partial().parse(req.body);
      const news = await storage.updateNews(id, validatedData);
      res.json(news);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update news" });
      }
    }
  });
  app.delete("/api/news/:id", async (req, res) => {
    try {
      const id = getId(req);
      await storage.deleteNews(id);
      res.status(204).send();
    } catch {
      res.status(500).json({ message: "Failed to delete news" });
    }
  });

  // IPR
  app.get("/api/ipr", async (req, res) => {
    try {
      const ipr = await storage.getIpr();
      res.json(ipr);
    } catch {
      res.status(500).json({ message: "Failed to fetch IPR" });
    }
  });
  app.post("/api/ipr", async (req, res) => {
    try {
      const validatedData = insertIprSchema.parse(req.body);
      const ipr = await storage.createIpr(validatedData);
      res.status(201).json(ipr);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create IPR" });
      }
    }
  });
  app.put("/api/ipr/:id", async (req, res) => {
    try {
      const id = getId(req);
      const validatedData = insertIprSchema.partial().parse(req.body);
      const ipr = await storage.updateIpr(id, validatedData);
      res.json(ipr);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update IPR" });
      }
    }
  });
  app.delete("/api/ipr/:id", async (req, res) => {
    try {
      const id = getId(req);
      await storage.deleteIpr(id);
      res.status(204).send();
    } catch {
      res.status(500).json({ message: "Failed to delete IPR" });
    }
  });

  // Management Team
  app.get("/api/managementteam", async (req, res) => {
    try {
      const managementTeam = await storage.getManagementTeam();
      res.json(managementTeam);
    } catch {
      res.status(500).json({ message: "Failed to fetch management team" });
    }
  });
  app.post("/api/managementteam", async (req, res) => {
    try {
      const validatedData = insertManagementTeamSchema.parse(req.body);
      const management = await storage.createManagementTeam(validatedData);
      res.status(201).json(management);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create management team member" });
      }
    }
  });
  app.put("/api/managementteam/:id", async (req, res) => {
    try {
      const id = getId(req);
      const validatedData = insertManagementTeamSchema.partial().parse(req.body);
      const management = await storage.updateManagementTeam(id, validatedData);
      res.json(management);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update management team member" });
      }
    }
  });
  app.delete("/api/managementteam/:id", async (req, res) => {
    try {
      const id = getId(req);
      await storage.deleteManagementTeam(id);
      res.status(204).send();
    } catch {
      res.status(500).json({ message: "Failed to delete management team member" });
    }
  });

  // Cells & Committees
  app.get("/api/cellscommittees", async (req, res) => {
    try {
      const cells = await storage.getCellsCommittees();
      res.json(cells);
    } catch {
      res.status(500).json({ message: "Failed to fetch cells and committees" });
    }
  });
  app.post("/api/cellscommittees", async (req, res) => {
    try {
      const validatedData = insertCellsCommitteesSchema.parse(req.body);
      const cell = await storage.createCellsCommittees(validatedData);
      res.status(201).json(cell);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create cell/committee" });
      }
    }
  });
  app.put("/api/cellscommittees/:id", async (req, res) => {
    try {
      const id = getId(req);
      const validatedData = insertCellsCommitteesSchema.partial().parse(req.body);
      const cell = await storage.updateCellsCommittees(id, validatedData);
      res.json(cell);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update cell/committee" });
      }
    }
  });
  app.delete("/api/cellscommittees/:id", async (req, res) => {
    try {
      const id = getId(req);
      await storage.deleteCellsCommittees(id);
      res.status(204).send();
    } catch {
      res.status(500).json({ message: "Failed to delete cell/committee" });
    }
  });

  // Gallery
  app.get("/api/gallery", async (req, res) => {
    try {
      const gallery = await storage.getGallery();
      res.json(gallery);
    } catch {
      res.status(500).json({ message: "Failed to fetch gallery" });
    }
  });
  app.post("/api/gallery", upload.single("image"), async (req, res) => {
    try {
      const imageUrl = req.file ? await uploadFile(req, "gallery") : null;

      const validatedData = insertGallerySchema.parse({
        ...req.body,
        imageUrl: imageUrl,
      });

      const gallery = await storage.createGallery(validatedData);
      res.status(201).json(gallery);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("❌ POST gallery error:", error);
        res.status(500).json({ message: "Failed to create gallery item" });
      }
    }
  });
  app.put("/api/gallery/:id", upload.single("image"), async (req, res) => {
    try {
      const id = getId(req);
      const oldGallery = await storage.getGalleryById(id);

      if (!oldGallery) {
        return res.status(404).json({ message: "Gallery item not found" });
      }

      let imageUrl = oldGallery.imageUrl;
      if (req.file) {
        imageUrl = await uploadFile(req, "gallery");
        if (oldGallery.imageUrl) {
          await deleteFile(oldGallery.imageUrl);
        }
      }

      const validatedData = insertGallerySchema.partial().parse({
        ...req.body,
        imageUrl: imageUrl,
      });

      const gallery = await storage.updateGallery(id, validatedData);
      res.json(gallery);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update gallery item" });
      }
    }
  });
  app.delete("/api/gallery/:id", async (req, res) => {
    try {
      const id = getId(req);

      const gallery = await storage.getGalleryById(id);
      if (!gallery) {
        return res.status(404).json({ message: "Gallery item not found" });
      }

      await storage.deleteGallery(id);

      if (gallery.imageUrl) {
        await deleteFile(gallery.imageUrl);
      }

      res.status(204).send();
    } catch (error) {
      console.error("❌ DELETE gallery error:", error);
      res.status(500).json({ message: "Failed to delete gallery item" });
    }
  });




app.post("/api/upload", upload.single("uploadFile"), async (req, res) => {
  const file = req.file;
  const folder = req.body.folder || "general";

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const fileUrl = await uploadFile(req, folder);

    if (!fileUrl) {
      return res.status(500).json({ message: "Failed to upload file" });
    }

    res.status(200).json({
      message: "File uploaded successfully to Cloudinary",
      filename: file.originalname,
      url: fileUrl,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Failed to upload file" });
  }
});



  return createServer(app);
}
