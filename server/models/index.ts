
import mongoose, { Schema } from "mongoose";

// User model moved to server/models/user.ts to avoid conflicts

export const FacultySchema = new Schema({
  facultyId: { type: String, required: false, unique: true, sparse: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  gender: { type: String, required: true },
  imageUrl: { type: String, required: false },
}, { timestamps: { createdAt: "createdAt" } });
export const FacultyModel = mongoose.models.Faculty || mongoose.model("Faculty", FacultySchema);

export const BannerSchema = new Schema({
  bannerId: { type: String, required: false, unique: true, sparse: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  priority: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: { createdAt: "createdAt" } });
export const BannerModel = mongoose.models.Banner || mongoose.model("Banner", BannerSchema);

export const NewsSchema = new Schema({
  newsId: { type: String, required: false, unique: true, sparse: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  importance: { type: String, required: true },
  link: { type: String },
  publishDate: { type: Date, default: Date.now },
}, { timestamps: { createdAt: "createdAt" } });
export const NewsModel = mongoose.models.News || mongoose.model("News", NewsSchema);

export const IprSchema = new Schema({
  iprId: { type: String, required: false, unique: true, sparse: true },
  year: { type: String, required: true },
  grantNo: { type: String, required: true },
  affiliation: { type: String, required: true },
  title: { type: String, required: true },
}, { timestamps: { createdAt: "createdAt" } });
export const IprModel = mongoose.models.Ipr || mongoose.model("Ipr", IprSchema);

export const ManagementTeamSchema = new Schema({
  managementId: { type: String, required: false, unique: true, sparse: true },
  name: { type: String, required: true },
  branch: { type: String, required: true },
  designation: { type: String, required: true },
  mobileNo: { type: String, required: true },
}, { timestamps: { createdAt: "createdAt" } });
export const ManagementTeamModel = mongoose.models.ManagementTeam || mongoose.model("ManagementTeam", ManagementTeamSchema);

export const CellsCommitteesSchema = new Schema({
  cellId: { type: String, required: false, unique: true, sparse: true },
  name: { type: String, required: true },
  pdfUrl: { type: String },
}, { timestamps: { createdAt: "createdAt" } });
export const CellsCommitteesModel = mongoose.models.CellsCommittees || mongoose.model("CellsCommittees", CellsCommitteesSchema);

export const GallerySchema = new Schema({
  galleryId: { type: String, required: false, unique: true, sparse: true },
  year: { type: String, required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
}, { timestamps: { createdAt: "createdAt" } });
export const GalleryModel = mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);

export const AlumniSchema = new Schema({
  alumniId: { type: String, required: false, unique: true, sparse: true },
  name: { type: String, required: true },
  batch: { type: String, required: true },
  fromCity: { type: String, required: true },
  currentCity: { type: String, required: true },
  companyName: { type: String, required: true },
  position: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  achievements: { type: String, required: false },
  photoUrl: { type: String, required: false },
}, { timestamps: { createdAt: "createdAt" } });
export const AlumniModel = mongoose.models.Alumni || mongoose.model("Alumni", AlumniSchema);
