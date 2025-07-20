import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertGallerySchema, type Gallery, type InsertGallery } from "@shared/schema";
import FileUpload from "@/components/ui/file-upload";
import { useEffect, useState } from "react";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: Gallery | null;
}

export default function GalleryModal({ isOpen, onClose, item }: GalleryModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertGallery>({
    resolver: zodResolver(insertGallerySchema),
    defaultValues: {
      galleryId: item?.galleryId || "",
      year: item?.year || new Date().getFullYear().toString(),
      category: item?.category || "Events",
      title: item?.title || "",
      imageUrl: item?.imageUrl || "",
    },
  });
  useEffect(() => {
    if (item) {
      form.reset({
        galleryId: item.galleryId || "",
        year: item.year || new Date().getFullYear().toString(),
        category: item.category || "Events",
        title: item.title || "",
        imageUrl: item.imageUrl || "",
      });
    } else {
      form.reset({
        galleryId: "",
        year: new Date().getFullYear().toString(),
        category: "Events",
        title: "",
        imageUrl: "",
      });
    }
  }, [item, form]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: InsertGallery) => {
      const id = item?._id || "";
      const url = item ? `/api/gallery/${id}` : "/api/gallery";
      const method = item ? "PUT" : "POST";

      const formData = new FormData();
      formData.append('galleryId', data.galleryId);
      formData.append('year', data.year);
      formData.append('category', data.category);
      formData.append('title', data.title);
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
        throw new Error(errorData.message || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({
        title: "Success",
        description: item ? "Gallery item updated successfully" : "Gallery item added successfully",
      });
      onClose();
      form.reset();
      setSelectedFile(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: item ? "Failed to update gallery item" : "Failed to add gallery item",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertGallery) => {
    mutation.mutate(data);
  };

  const handleFileUpload = (url: string, file?: File) => {
    form.setValue("imageUrl", url);
    if (file) {
      setSelectedFile(file);
    }
  };

  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());
  const categories = ["Events", "Campus", "Sports", "Academic", "Cultural"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {item ? "Edit Gallery Item" : "Add New Gallery Item"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="year">Year</Label>
            <Select
              value={form.watch("year")}
              onValueChange={(value) => form.setValue("year", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={form.watch("category")}
                onValueChange={(value) => form.setValue("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="Annual Cultural Festival"
              />
            </div>
          </div>

          <div>
            <Label>Image</Label>
            <FileUpload
              onUpload={handleFileUpload}
              accept="image/*"
              maxSize={5 * 1024 * 1024} // 5MB
              currentFile={form.watch("imageUrl")}
            />
            {form.watch("imageUrl") && (
              <div className="mt-2">
                <img
                  src={form.watch("imageUrl")}
                  alt="Preview"
                  className="w-32 h-24 object-cover rounded-lg"
                />
              </div>
            )}
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
              {mutation.isPending ? "Saving..." : item ? "Update Item" : "Add Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}