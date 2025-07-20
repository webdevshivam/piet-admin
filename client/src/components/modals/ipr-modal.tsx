import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertIprSchema, type Ipr, type InsertIpr } from "@shared/schema";
import { useEffect } from "react";

interface IprModalProps {
  isOpen: boolean;
  onClose: () => void;
  ipr?: Ipr | null;
}

export default function IprModal({ isOpen, onClose, ipr }: IprModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize the form with the default values being the IPR's current values when editing
  const form = useForm<InsertIpr>({
    resolver: zodResolver(insertIprSchema),
    defaultValues: {
      iprId: ipr?.iprId || "", // Pre-fill IPR ID
      year: ipr?.year || new Date().getFullYear().toString(), // Pre-fill Year (default to current year)
      grantNo: ipr?.grantNo || "", // Pre-fill Grant No.
      affiliation: ipr?.affiliation || "", // Pre-fill Affiliation
      title: ipr?.title || "", // Pre-fill Title
    },
  });

  useEffect(() => {
    if (ipr) {
      form.reset({
        iprId: ipr.iprId || "",
        year: ipr.year || new Date().getFullYear().toString(),
        grantNo: ipr.grantNo || "",
        affiliation: ipr.affiliation || "",
        title: ipr.title || "",
      });
    } else {
      // If adding new IPR, reset to default blank values
      form.reset({
        iprId: "",
        year: new Date().getFullYear().toString(),
        grantNo: "",
        affiliation: "",
        title: "",
      });
    }
  }, [ipr, form]);

  const mutation = useMutation({
    mutationFn: async (data: InsertIpr) => {
      // Use _id for PUT requests to update the IPR
      const url = ipr ? `/api/ipr/${ipr._id}` : '/api/ipr';
      const method = ipr ? 'PUT' : 'POST';
      const { _id, createdAt, ...cleanedData } = data;
      return await apiRequest(method, url, data);
    },
    onSuccess: () => {
      // Invalidate the IPR cache to update the UI
      queryClient.invalidateQueries({ queryKey: ['/api/ipr'] });
      toast({
        title: "Success",
        description: ipr ? "IPR updated successfully" : "IPR added successfully",
      });
      onClose(); // Close the modal
      form.reset(); // Reset the form after submission
    },
    onError: () => {
      toast({
        title: "Error",
        description: ipr ? "Failed to update IPR" : "Failed to add IPR",
        variant: "destructive",
      });
    },
  });

  // Submit function that triggers the mutation
  const onSubmit = (data: InsertIpr) => {
    mutation.mutate(data); // Trigger the mutation to add/update the IPR
  };

  // List of years for the Select dropdown (current year - 9)
  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {ipr ? "Edit IPR" : "Add New IPR"} {/* Conditionally show title based on edit or add */}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Year */}
          <div>
            <Label htmlFor="year">Year</Label>
            <Select
              value={form.watch("year")} // Watch the form value for 'year'
              onValueChange={(value) => form.setValue("year", value)} // Update 'year' field
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Grant No. and Affiliation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="grantNo">Grant No.</Label>
              <Input
                id="grantNo"
                {...form.register("grantNo")} // Bind the input field to the form
                placeholder="GR2024001"
              />
            </div>
            <div>
              <Label htmlFor="affiliation">Affiliation</Label>
              <Input
                id="affiliation"
                {...form.register("affiliation")} // Bind the input field to the form
                placeholder="Computer Science Dept."
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Textarea
              id="title"
              {...form.register("title")} // Bind the input field to the form
              placeholder="Enter IPR title"
              rows={3}
            />
          </div>

          {/* Actions: Cancel and Submit buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending} // Disable the button when mutation is in progress
              className="bg-primary-900 hover:bg-primary-800"
            >
              {mutation.isPending ? "Saving..." : ipr ? "Update IPR" : "Add IPR"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
