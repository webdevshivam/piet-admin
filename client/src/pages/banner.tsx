import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BannerModal from "@/components/modals/banner-modal";
import DragDrop from "@/components/ui/drag-drop";
import type { Banner } from "@shared/schema";

const url: string = 'http://localhost:5000';

export default function Banner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['/api/banners'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/banners/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/banners'] });
      toast({
        title: "Success",
        description: "Banner deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {

    if (confirm("Are you sure you want to delete this banner?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  const handleReorder = async (newOrder: Banner[]) => {
    const updates = newOrder.map((banner, index) => {
      const newPriority = index + 1;
      if (banner.priority !== newPriority) {
        return apiRequest('PUT', `/api/banners/${banner._id}`, {
          ...banner,
          priority: newPriority,
        });
      }
      return null;
    });

    await Promise.all(updates.filter(Boolean));
    queryClient.invalidateQueries({ queryKey: ['/api/banners'] });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading banners...</div>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Banner Management</h3>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-900 hover:bg-primary-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Banner
            </Button>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-4">
              Drag and drop banners to reorder their priority
            </p>
            <DragDrop items={banners} onReorder={handleReorder}>
              {(banner: Banner) => (
                <div className="drag-item bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary-500 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="cursor-move text-gray-400">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        {banner.imageUrl ? (
                          <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-gray-400 text-xs">No Image</div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{banner.bannerId}</h4>
                        <p className="text-sm text-gray-600">Priority: {banner.priority}</p>
                        <p className="text-xs text-gray-500">{banner.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(banner)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(banner._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </DragDrop>
          </div>

          {banners.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No banners found
            </div>
          )}
        </CardContent>
      </Card>

      <BannerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        banner={editingBanner}
      />
    </div>
  );
}
