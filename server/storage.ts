import {
  FacultyModel,
  BannerModel,
  NewsModel,
  IprModel,
  ManagementTeamModel,
  CellsCommitteesModel,
  GalleryModel,
} from "./models/index";

import { Types } from "mongoose";

function createCrud(model: any) {
  return {
    getAll: () => model.find(),
    create: (data: any) => model.create(data),
    update: (id: string, data: any) => {
      if (!Types.ObjectId.isValid(id)) throw new Error("Invalid ID format");
      return model.findByIdAndUpdate(id, data, { new: true });
    },
    getById: (id: string) => {
      if (!Types.ObjectId.isValid(id)) throw new Error("Invalid ID format");
      return model.findById(id);
    },
    delete: (id: string) => {
      if (!Types.ObjectId.isValid(id)) throw new Error("Invalid ID format");
      return model.findByIdAndDelete(id);
    },
  };
}


export const storage = {
  // Faculty
  getFaculty: () => storage._faculty.getAll(),
  createFaculty: (data: any) => storage._faculty.create(data),
  updateFaculty: (id: string, data: any) => storage._faculty.update(id, data),
  deleteFaculty: (id: string) => storage._faculty.delete(id),
  getFacultyById : (id:string) => storage._faculty.getById(id),

  // Banner
  getBanners: () => storage._banner.getAll(),
  createBanner: (data: any) => storage._banner.create(data),
  updateBanner: (id: string, data: any) => storage._banner.update(id, data),
  deleteBanner: (id: string) => storage._banner.delete(id),
  getBannerById: (id: string) => storage._banner.getById(id),



  // News
  getNews: () => storage._news.getAll(),
  createNews: (data: any) => storage._news.create(data),
  updateNews: (id: string, data: any) => storage._news.update(id, data),
  deleteNews: (id: string) => storage._news.delete(id),

  // IPR
  getIpr: () => storage._ipr.getAll(),
  createIpr: (data: any) => storage._ipr.create(data),
  updateIpr: (id: string, data: any) => storage._ipr.update(id, data),
  deleteIpr: (id: string) => storage._ipr.delete(id),

  // Management Team
  getManagementTeam: () => storage._management.getAll(),
  createManagementTeam: (data: any) => storage._management.create(data),
  updateManagementTeam: (id: string, data: any) => storage._management.update(id, data),
  deleteManagementTeam: (id: string) => storage._management.delete(id),

  // Cells & Committees
  getCellsCommittees: () => storage._cells.getAll(),
  createCellsCommittees: (data: any) => storage._cells.create(data),
  updateCellsCommittees: (id: string, data: any) => storage._cells.update(id, data),
  deleteCellsCommittees: (id: string) => storage._cells.delete(id),

  // Gallery
  getGallery: () => storage._gallery.getAll(),
  createGallery: (data: any) => storage._gallery.create(data),
  updateGallery: (id: string, data: any) => storage._gallery.update(id, data),
  deleteGallery: (id: string) => storage._gallery.delete(id),
  getGalleryById:(id: string) => storage._gallery.getById(id),

  // Internal crud helpers
  _faculty: createCrud(FacultyModel),
  _banner: createCrud(BannerModel),
  _news: createCrud(NewsModel),
  _ipr: createCrud(IprModel),
  _management: createCrud(ManagementTeamModel),
  _cells: createCrud(CellsCommitteesModel),
  _gallery: createCrud(GalleryModel),
};
