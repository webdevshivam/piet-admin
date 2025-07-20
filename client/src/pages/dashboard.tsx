import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Image, Newspaper, Camera } from "lucide-react";

interface DashboardStats {
  faculty: number;
  banners: number;
  news: number;
  gallery: number;
}

export default function Dashboard() {
  const { data: facultyData = [] } = useQuery({
    queryKey: ['/api/faculty'],
  });

  const { data: bannersData = [] } = useQuery({
    queryKey: ['/api/banners'],
  });

  const { data: newsData = [] } = useQuery({
    queryKey: ['/api/news'],
  });

  const { data: galleryData = [] } = useQuery({
    queryKey: ['/api/gallery'],
  });

  const stats: DashboardStats = {
    faculty: facultyData.length,
    banners: bannersData.length,
    news: newsData.length,
    gallery: galleryData.length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Faculty</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.faculty}</p>
              </div>
              <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full">
                <Users className="w-8 h-8 text-primary-900 dark:text-primary-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Banners</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.banners}</p>
              </div>
              <div className="bg-accent-100 dark:bg-accent-900/30 p-3 rounded-full">
                <Image className="w-8 h-8 text-accent-600 dark:text-accent-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">News/Notices</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.news}</p>
              </div>
              <div className="bg-secondary-100 dark:bg-secondary-900/30 p-3 rounded-full">
                <Newspaper className="w-8 h-8 text-secondary-600 dark:text-secondary-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover transition-all duration-300 bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Gallery Items</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white animate-fadeIn">{stats.gallery}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-xs text-blue-600 dark:text-blue-400">Updated</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mb-8 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 dark:text-green-400">Live</span>
            </div>
          </div>
          <div className="space-y-4">
            {newsData.slice(0, 3).map((item: any, index: number) => (
              <div key={item.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors animate-slideIn" style={{animationDelay: `${index * 200}ms`}}>
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                  <Newspaper className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.publishDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            ))}
            {newsData.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Newspaper className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="card-hover transition-all duration-300 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Add New Faculty</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Quick Action</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Quickly add a new faculty member to the system</p>
            <button className="w-full btn-primary text-white py-3 px-4 rounded-lg font-medium shadow-lg">
              Add Faculty
            </button>
          </CardContent>
        </Card>

        <Card className="card-hover transition-all duration-300 bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/20 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
                <Image className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Upload Banner</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Quick Action</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Upload and manage banner images</p>
            <button className="w-full bg-gradient-to-r from-accent-500 to-accent-600 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:from-accent-600 hover:to-accent-700 transition-all duration-300">
              Upload Banner
            </button>
          </CardContent>
        </Card>

        <Card className="card-hover transition-all duration-300 bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Publish Notice</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Quick Action</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Create and publish a new notice</p>
            <button className="w-full bg-gradient-to-r from-secondary-500 to-secondary-600 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:from-secondary-600 hover:to-secondary-700 transition-all duration-300">
              Publish Notice
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}