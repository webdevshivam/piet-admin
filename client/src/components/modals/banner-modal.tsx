import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertBannerSchema, type Banner, type InsertBanner } from "@shared/schema";
import FileUpload from "@/components/ui/file-upload";
import { useEffect, useState } from "react";

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner?: Banner | null;
}

export default function BannerModal({ isOpen, onClose, banner }: BannerModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<InsertBanner>({
    resolver: zodResolver(insertBannerSchema),
    defaultValues: {
      bannerId: "",
      title: "",
      imageUrl: "",
      priority: 1,
      isActive: true,
    },
  });

  useEffect(() => {
    if (banner) {
      form.reset({
        bannerId: banner.bannerId,
        title: banner.title,
        imageUrl: banner.imageUrl,
        priority: banner.priority,
        isActive: banner.isActive,
      });
    } else {
      form.reset();
    }
  }, [banner, form]);

  const mutation = useMutation({
    mutationFn: async (data: InsertBanner) => {
      const id = banner?._id || "";
      const url = banner ? `/api/banners/${id}` : "/api/banners";
      const method = banner ? "PUT" : "POST";

      const formData = new FormData();
      formData.append('bannerId', data.bannerId || '');
      formData.append('title', data.title || '');
      formData.append('priority', String(data.priority || 1));
      formData.append('isActive', String(data.isActive === true));
      if (data.imageUrl) {
        formData.append('imageUrl', data.imageUrl);
      }
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Banner upload error:', errorData);
        throw new Error(errorData.message || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      toast({
        title: "Success",
        description: banner ? "Banner updated successfully" : "Banner added successfully",
      });
      onClose();
      form.reset();
      setSelectedFile(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: banner ? "Failed to update banner" : "Failed to add banner",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBanner) => {
    mutation.mutate(data);
  };

  const handleFileUpload = (url: string, file?: File) => {
    form.setValue("imageUrl", url);
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {banner ? "Edit Banner" : "Add New Banner"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Banner Title</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="Welcome Week 2024"
            />
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={form.watch("priority")?.toString()}
              onValueChange={(value) =>
                form.setValue("priority", parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((val) => (
                  <SelectItem key={val} value={val.toString()}>
                    {val} {val === 1 ? "(Highest)" : val === 5 ? "(Lowest)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Banner Image</Label>
            <FileUpload
              onUpload={handleFileUpload}
              accept="image/*"
              maxSize={5 * 1024 * 1024}
            />
            {form.watch("imageUrl") && (
              <div className="mt-2">
                <img
                  src={form.watch("imageUrl")}
                  alt="Banner preview"
                  className="w-32 h-20 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={form.watch("isActive")}
              onCheckedChange={(checked) =>
                form.setValue("isActive", checked)
              }
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-primary-900 hover:bg-primary-800"
            >
              {mutation.isPending
                ? "Saving..."
                : banner
                  ? "Update Banner"
                  : "Add Banner"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}