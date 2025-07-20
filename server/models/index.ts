
import mongoose, { Schema } from "mongoose";

export const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });
export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export const FacultySchema = new Schema({
  facultyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  gender: { type: String, required: true },
  imageUrl: { type: String, required: false },
}, { timestamps: { createdAt: "createdAt" } });
export const FacultyModel = mongoose.models.Faculty || mongoose.model("Faculty", FacultySchema);

export const BannerSchema = new Schema({
  bannerId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  priority: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: { createdAt: "createdAt" } });
export const BannerModel = mongoose.models.Banner || mongoose.model("Banner", BannerSchema);

export const NewsSchema = new Schema({
  newsId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  importance: { type: String, required: true },
  link: { type: String },
  publishDate: { type: Date, default: Date.now },
}, { timestamps: { createdAt: "createdAt" } });
export const NewsModel = mongoose.models.News || mongoose.model("News", NewsSchema);

export const IprSchema = new Schema({
  iprId: { type: String, required: true, unique: true },
  year: { type: String, required: true },
  grantNo: { type: String, required: true },
  affiliation: { type: String, required: true },
  title: { type: String, required: true },
}, { timestamps: { createdAt: "createdAt" } });
export const IprModel = mongoose.models.Ipr || mongoose.model("Ipr", IprSchema);

export const ManagementTeamSchema = new Schema({
  managementId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  branch: { type: String, required: true },
  designation: { type: String, required: true },
  mobileNo: { type: String, required: true },
}, { timestamps: { createdAt: "createdAt" } });
export const ManagementTeamModel = mongoose.models.ManagementTeam || mongoose.model("ManagementTeam", ManagementTeamSchema);

export const CellsCommitteesSchema = new Schema({
  cellId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  pdfUrl: { type: String },
}, { timestamps: { createdAt: "createdAt" } });
export const CellsCommitteesModel = mongoose.models.CellsCommittees || mongoose.model("CellsCommittees", CellsCommitteesSchema);

export const GallerySchema = new Schema({
  galleryId: { type: String, required: true, unique: true },
  year: { type: String, required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
}, { timestamps: { createdAt: "createdAt" } });
export const GalleryModel = mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);
