import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertNewsSchema, type News, type InsertNews } from "@shared/schema";

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  news?: News | null;
}

export default function NewsModal({ isOpen, onClose, news }: NewsModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertNews>({
    resolver: zodResolver(insertNewsSchema),
    defaultValues: {
      newsId: "",
      title: "",
      description: "",
      importance: "medium",
      link: "",
    },
  });

  useEffect(() => {
    if (news) {
      form.reset({
        newsId: news.newsId,
        title: news.title,
        description: news.description,
        importance: news.importance,
        link: news.link || "",
      });
    } else {
      form.reset({
        newsId: "",
        title: "",
        description: "",
        importance: "medium",
        link: "",
      });
    }
  }, [news, form]);

  const mutation = useMutation({
    mutationFn: async (data: InsertNews) => {
      const id = news?._id || news?.id;
      const url = news ? `/api/news/${id}` : "/api/news";
      const method = news ? "PUT" : "POST";
      return await apiRequest(method, url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({
        title: "Success",
        description: news ? "News updated successfully" : "News added successfully",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: news ? "Failed to update news" : "Failed to add news",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertNews) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{news ? "Edit News/Notice" : "Add New News/Notice"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="importance">Importance</Label>
            <Select
              value={form.watch("importance")}
              onValueChange={(value) => form.setValue("importance", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select importance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="Enter news title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Enter news description"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="link">Link (Optional)</Label>
            <Input
              id="link"
              {...form.register("link")}
              placeholder="https://example.com"
            />
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
              {mutation.isPending ? "Saving..." : news ? "Update News" : "Add News"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
