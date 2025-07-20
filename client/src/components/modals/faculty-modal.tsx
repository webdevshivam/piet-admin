import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  insertFacultySchema,
  type Faculty,
  type InsertFaculty,
} from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";


// 1. Create a new schema specifically for the form to handle the file upload
const facultyFormSchema = insertFacultySchema
  .omit({ imageUrl: true }) // The server will create the imageUrl
  .extend({
    image: z
      .custom<FileList>()
      .refine(
        (files) => !files || files.length === 0 || files[0].size <= 2 * 1024 * 1024, // 2MB max size
        `Max file size is 2MB.`
      )
      .optional(),
  });

type FacultyFormData = z.infer<typeof facultyFormSchema>;

interface FacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  faculty?: Faculty | null;
}

export default function FacultyModal({
  isOpen,
  onClose,
  faculty,
}: FacultyModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const defaultValues: FacultyFormData = {
    facultyId: "",
    name: "",
    department: "Computer Science",
    designation: "Professor",
    gender: "male",
    image: undefined,
  };

  // 2. Use the new schema and inferred type for the form
  const form = useForm<FacultyFormData>({
    resolver: zodResolver(facultyFormSchema),
    defaultValues,
  });

  // Populate form with existing data when editing
  useEffect(() => {
    if (faculty) {
      form.reset({
        facultyId: faculty.facultyId,
        name: faculty.name,
        department: faculty.department,
        designation: faculty.designation,
        gender: faculty.gender,
        image: undefined, // Clear previous file input
      });
    } else {
      form.reset(defaultValues); // Reset to default for new entries
    }
  }, [faculty, isOpen, form]);

  const mutation = useMutation({
    // 3. The mutation now receives the corrected form data type
    mutationFn: async (data: FacultyFormData) => {
      const formData = new FormData();

      // Append all fields except the image
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "image" && value !== undefined) {
          formData.append(key, value as string);
        }
      });

      // 4. Correctly append the file with the key "image"
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      const id = faculty?._id?.toString() ?? "";
      const method = faculty ? "PUT" : "POST";
      const url = faculty ? `/api/faculty/${id}` : "/api/faculty";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.message || "Failed to submit form");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faculty"] });
      toast({
        title: "Success",
        description: faculty
          ? "Faculty updated successfully"
          : "Faculty added successfully",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FacultyFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {faculty ? "Edit Faculty" : "Add New Faculty"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="name">Full Name</Label>
                    <FormControl>
                      <Input id="name" placeholder="Dr. John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <Label>Department</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        {/* Add other departments as needed */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                   <FormItem>
                    <Label>Designation</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Professor">Professor</SelectItem>
                         {/* Add other designations as needed */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <Label>Gender</Label>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex space-x-6 pt-2"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="male" />
                        </FormControl>
                        <Label>Male</Label>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="female" />
                        </FormControl>
                        <Label>Female</Label>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <Label htmlFor="image">Upload Image</Label>
                  <FormControl>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                      {...rest}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-6">
               <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={mutation.isPending} className="relative">
                {mutation.isPending && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent" />
                  </div>
                )}
                <span className={mutation.isPending ? "opacity-0" : ""}>
                  {mutation.isPending ? "Saving..." : "Save Changes"}
                </span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
