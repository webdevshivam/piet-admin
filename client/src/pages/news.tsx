import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import NewsModal from "@/components/modals/news-modal";
import type { News } from "@shared/schema";

export default function News() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [importanceFilter, setImportanceFilter] = useState("all");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: news = [], isLoading } = useQuery({
    queryKey: ['/api/news'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (_id: string) => {
      await apiRequest('DELETE', `/api/news/${_id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      toast({
        title: "Success",
        description: "News/notice deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete news/notice",
        variant: "destructive",
      });
    },
  });

  const filteredNews = news.filter((item: News) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesImportance = importanceFilter === "all" || item.importance === importanceFilter;

    return matchesSearch && matchesImportance;
  });

  const handleEdit = (news: News) => {
    setEditingNews(news);
    setIsModalOpen(true);
  };

  const handleDelete = (_id: string) => {
    if (confirm("Are you sure you want to delete this news/notice?")) {
      deleteMutation.mutate(_id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNews(null);
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{importance}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading news...</div>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">News/Notice Management</h3>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-900 hover:bg-primary-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add News/Notice
            </Button>
          </div>

          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative">
              <Input
                placeholder="Search news/notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <div className="flex space-x-2">
              <Select value={importanceFilter} onValueChange={setImportanceFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Importance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Importance</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item: News) => (
              <Card key={item._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">{item.newsId}</span>
                    {getImportanceBadge(item.importance)}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{item.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {item.publishDate
                        ? new Date(item.publishDate).toLocaleDateString()
                        : new Date(item.createdAt!).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNews.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No news/notices found
            </div>
          )}
        </CardContent>
      </Card>

      <NewsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        news={editingNews}
      />
    </div>
  );
}
