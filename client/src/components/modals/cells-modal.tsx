import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  insertCellsCommitteesSchema,
  type CellsCommittees,
  type InsertCellsCommittees,
} from "@shared/schema";


interface CellsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cell?: CellsCommittees | null;
}

export default function CellsModal({ isOpen, onClose, cell }: CellsModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertCellsCommittees>({
    resolver: zodResolver(insertCellsCommitteesSchema),
    defaultValues: {
      cellId: "",
      name: "",
      pdfUrl: "",
    },
  });

  // ✅ Reset form when cell changes
  useEffect(() => {
    if (cell) {
      form.reset({
        cellId: cell.cellId || "",
        name: cell.name || "",
        pdfUrl: cell.pdfUrl || "",
      });
    } else {
      form.reset({
        cellId: "",
        name: "",
        pdfUrl: "",
      });
    }
  }, [cell, form]);

  const mutation = useMutation({
    mutationFn: async (data: InsertCellsCommittees) => {
      const url = cell ? `/api/cellscommittees/${cell._id}` : "/api/cellscommittees";
      const method = cell ? "PUT" : "POST";
      return await apiRequest(method, url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cellscommittees"] });
      toast({
        title: "Success",
        description: cell
          ? "Cell/Committee updated successfully"
          : "Cell/Committee added successfully",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: cell
          ? "Failed to update cell/committee"
          : "Failed to add cell/committee",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCellsCommittees) => {
    mutation.mutate(data);
  };

  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {cell ? "Edit Cell/Committee" : "Add New Cell/Committee"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="Anti-Ragging Committee"
            />
          </div>

          <div>
            <Label htmlFor="pdfUrl">PDF Document URL</Label>
            <Input
              id="pdfUrl"
              {...form.register("pdfUrl")}
              placeholder="https://example.com/document.pdf"
              type="url"
            />
            {form.formState.errors.pdfUrl && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.pdfUrl.message}
              </p>
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
              {mutation.isPending ? "Saving..." : cell ? "Update Cell" : "Add Cell"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
