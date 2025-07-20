import mongoose, { Schema, model } from "mongoose";
import { Types } from "mongoose";
import { z } from "zod";

// User schemas
export const loginUserSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const updateUserSchema = z.object({
  email: z.string().email("Please enter a valid email").optional(),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export type LoginUser = z.infer<typeof loginUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

// User schemas moved to top of file to avoid duplication

export const insertFacultySchema = z.object({
  facultyId: z.string(),
  name: z.string(),
  department: z.string(),
  designation: z.string(),
  gender: z.string(),
  imageUrl: z.string().optional(), // ✅ allow optional imageUrl
});



export const insertBannerSchema = z.object({
  bannerId: z.string(),
  title: z.string(),
  imageUrl: z.string(),
  priority: z.number(),
  isActive: z.boolean().optional(),
});

export const insertNewsSchema = z.object({
  newsId: z.string(),
  title: z.string(),
  description: z.string(),
  importance: z.string(),
  link: z.string().optional(),
});

export const insertIprSchema = z.object({
  iprId: z.string(),
  year: z.string(),
  grantNo: z.string(),
  affiliation: z.string(),
  title: z.string(),
});

export const insertManagementTeamSchema = z.object({
  managementId: z.string(),
  name: z.string(),
  branch: z.string(),
  designation: z.string(),
  mobileNo: z.string(),
});

export const insertCellsCommitteesSchema = z.object({
  cellId: z.string(),
  name: z.string(),
  pdfUrl: z.string().url("Please enter a valid URL"),
});

export const insertGallerySchema = z.object({
  galleryId: z.string(),
  year: z.string(),
  category: z.string(),
  title: z.string(),
  imageUrl: z.string(),
});

// Mongoose Schemas
// User mongoose schema removed - using the one from server/models/user.ts

const facultySchema = new Schema(
  {
    facultyId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    gender: { type: String, required: true },
    imageUrl: { type: String, required: false }, // Added field for image URL
  },
  { timestamps: { createdAt: "createdAt" } }
);


const bannerSchema = new Schema(
  {
    bannerId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    priority: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "createdAt" } }
);

const newsSchema = new Schema(
  {
    newsId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    importance: { type: String, required: true },
    link: { type: String },
    publishDate: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "createdAt" } }
);

const iprSchema = new Schema(
  {
    iprId: { type: String, required: true, unique: true },
    year: { type: String, required: true },
    grantNo: { type: String, required: true },
    affiliation: { type: String, required: true },
    title: { type: String, required: true },
  },
  { timestamps: { createdAt: "createdAt" } }
);

const managementTeamSchema = new Schema(
  {
    managementId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    branch: { type: String, required: true },
    designation: { type: String, required: true },
    mobileNo: { type: String, required: true },
  },
  { timestamps: { createdAt: "createdAt" } }
);

const cellsCommitteesSchema = new Schema(
  {
    cellId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    pdfUrl: { type: String, required: true },
  },
  { timestamps: { createdAt: "createdAt" } }
);

const gallerySchema = new Schema(
  {
    galleryId: { type: String, required: true, unique: true },
    year: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: { createdAt: "createdAt" } }
);

// Helper to get existing model or create it (safe to use in hot reload envs)
function getOrCreateModel<T>(name: string, schema: mongoose.Schema<T>) {
  return mongoose.models?.[name] || mongoose.model<T>(name, schema);
}

// Mongoose Models (with overwrite check)
// UserModel removed - import from server/models/user.ts instead
export const FacultyModel = getOrCreateModel("Faculty", facultySchema);
export const BannerModel = getOrCreateModel("Banner", bannerSchema);
export const NewsModel = getOrCreateModel("News", newsSchema);
export const IprModel = getOrCreateModel("Ipr", iprSchema);
export const ManagementTeamModel = getOrCreateModel("ManagementTeam", managementTeamSchema);
export const CellsCommitteesModel = getOrCreateModel("CellsCommittees", cellsCommitteesSchema);
export const GalleryModel = getOrCreateModel("Gallery", gallerySchema);

// Types (from Zod)
// User type available from server/models/user.ts
export type Faculty = mongoose.InferSchemaType<typeof facultySchema>;
export type Banner = mongoose.InferSchemaType<typeof bannerSchema>;
export type News = mongoose.InferSchemaType<typeof newsSchema>;
export type Ipr = mongoose.InferSchemaType<typeof iprSchema>;
export type ManagementTeam = mongoose.InferSchemaType<typeof managementTeamSchema>;
export type CellsCommittees = mongoose.InferSchemaType<typeof cellsCommitteesSchema>;
export type Gallery = mongoose.InferSchemaType<typeof gallerySchema>;

export type InsertFaculty = z.infer<typeof insertFacultySchema>;
export type InsertBanner = z.infer<typeof insertBannerSchema>;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type InsertIpr = z.infer<typeof insertIprSchema>;
export type InsertManagementTeam = z.infer<typeof insertManagementTeamSchema>;
export type InsertCellsCommittees = z.infer<typeof insertCellsCommitteesSchema>;
export type InsertGallery = z.infer<typeof insertGallerySchema>;

// Storage interface
export interface IStorage {
  getUser(id: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  

  getFaculty(): Promise<Faculty[]>;
  getFacultyById(id: string): Promise<Faculty | null>;
  createFaculty(faculty: InsertFaculty): Promise<Faculty>;
  updateFaculty(id: string, faculty: Partial<InsertFaculty>): Promise<Faculty | null>;
  deleteFaculty(id: string): Promise<void>;

  getBanners(): Promise<Banner[]>;
  getBannerById(id: string): Promise<Banner | null>;
  createBanner(banner: InsertBanner): Promise<Banner>;
  updateBanner(id: string, banner: Partial<InsertBanner>): Promise<Banner | null>;
  deleteBanner(id: string): Promise<void>;
  updateBannerPriority(id: string, priority: number): Promise<Banner | null>;

  getNews(): Promise<News[]>;
  getNewsById(id: string): Promise<News | null>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: string, news: Partial<InsertNews>): Promise<News | null>;
  deleteNews(id: string): Promise<void>;

  getIpr(): Promise<Ipr[]>;
  getIprById(id: string): Promise<Ipr | null>;
  createIpr(ipr: InsertIpr): Promise<Ipr>;
  updateIpr(id: string, ipr: Partial<InsertIpr>): Promise<Ipr | null>;
  deleteIpr(id: string): Promise<void>;

  getManagementTeam(): Promise<ManagementTeam[]>;
  getManagementTeamById(id: string): Promise<ManagementTeam | null>;
  createManagementTeam(member: InsertManagementTeam): Promise<ManagementTeam>;
  updateManagementTeam(id: string, member: Partial<InsertManagementTeam>): Promise<ManagementTeam | null>;
  deleteManagementTeam(id: string): Promise<void>;

  getCellsCommittees(): Promise<CellsCommittees[]>;
  getCellsCommitteesById(id: string): Promise<CellsCommittees | null>;
  createCellsCommittees(cell: InsertCellsCommittees): Promise<CellsCommittees>;
  updateCellsCommittees(id: string, cell: Partial<InsertCellsCommittees>): Promise<CellsCommittees | null>;
  deleteCellsCommittees(id: string): Promise<void>;

  getGallery(): Promise<Gallery[]>;
  getGalleryById(id: string): Promise<Gallery | null>;
  createGallery(item: InsertGallery): Promise<Gallery>;
  updateGallery(id: string, item: Partial<InsertGallery>): Promise<Gallery | null>;
  deleteGallery(id: string): Promise<void>;
}