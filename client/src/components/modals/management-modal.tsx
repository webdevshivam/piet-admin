import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  insertManagementTeamSchema,
  type ManagementTeam,
  type InsertManagementTeam,
} from "@shared/schema";

interface ManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  member?: ManagementTeam | null;
}

export default function ManagementModal({
  isOpen,
  onClose,
  member,
}: ManagementModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertManagementTeam>({
    resolver: zodResolver(insertManagementTeamSchema),
    defaultValues: {
      managementId: member?.managementId || "",
      name: member?.name || "",
      branch: member?.branch || "",
      designation: member?.designation || "",
      mobileNo: member?.mobileNo || "",
    },
  });


  useEffect(() => {
    if (member) {
      form.reset({
        managementId: member.managementId || "",
        name: member.name || "",
        branch: member.branch || "",  
        designation: member.designation || "",
        mobileNo: member.mobileNo || "",
      });
    } else {
      form.reset({
        managementId: "",
        name: "",
        branch: "",
        designation: "",
        mobileNo: "",
      });
    }
  }, [member, form]);


  const mutation = useMutation({
    mutationFn: async (data: InsertManagementTeam) => {
      const url = member ? `/api/managementteam/${member._id}` : "/api/managementteam";
      const method = member ? "PUT" : "POST";
      return await apiRequest(method, url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/managementteam"] });
      toast({
        title: "Success",
        description: member
          ? "Management team member updated successfully"
          : "Management team member added successfully",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: member
          ? "Failed to update management team member"
          : "Failed to add management team member",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertManagementTeam) => {
    mutation.mutate(data);
  };

  const branches = [
    "Administration",
    "Academic Affairs",
    "Student Affairs",
    "Finance",
    "Human Resources",
    "IT Services",
    "Library",
    "Research",
    "Quality Assurance",
    "Placement Cell",
  ];

  const designations = [
    "Principal",
    "Vice Principal",
    "Dean",
    "Associate Dean",
    "Director",
    "Registrar",
    "Controller of Examinations",
    "Chief Librarian",
    "Head of Department",
    "Administrative Officer",
    "Finance Officer",
    "HR Manager",
    "IT Manager",
    "Placement Officer",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {member ? "Edit Management Member" : "Add New Management Member"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="managementId">Management ID</Label>
              <Input
                id="managementId"
                {...form.register("managementId")}
                placeholder="MGT001"
              />
            </div>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Dr. John Doe"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="branch">Branch</Label>
              <Select
                value={form.watch("branch")}
                onValueChange={(value) => form.setValue("branch", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="designation">Designation</Label>
              <Select
                value={form.watch("designation")}
                onValueChange={(value) => form.setValue("designation", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  {designations.map((designation) => (
                    <SelectItem key={designation} value={designation}>
                      {designation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="mobileNo">Mobile Number</Label>
            <Input
              id="mobileNo"
              {...form.register("mobileNo")}
              placeholder="+1 (555) 123-4567"
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
              {mutation.isPending
                ? "Saving..."
                : member
                  ? "Update Member"
                  : "Add Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
