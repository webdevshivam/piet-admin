import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import IprModal from "@/components/modals/ipr-modal";
import type { Ipr } from "@shared/schema";

export default function Ipr() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIpr, setEditingIpr] = useState<Ipr | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("all");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ipr = [], isLoading } = useQuery({
    queryKey: ['/api/ipr'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/ipr/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ipr'] });
      toast({
        title: "Success",
        description: "IPR deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete IPR",
        variant: "destructive",
      });
    },
  });

  const filteredIpr = ipr.filter((item: Ipr) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.iprId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.grantNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = yearFilter === "all" || item.year === yearFilter;

    return matchesSearch && matchesYear;
  });

  const handleEdit = (ipr: Ipr) => {
    setEditingIpr(ipr);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this IPR?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this IPR?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIpr(null);
  };

  const years = ["2024", "2023", "2022", "2021", "2020"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading IPR data...</div>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">IPR Management</h3>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-900 hover:bg-primary-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add IPR
            </Button>
          </div>

          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative">
              <Input
                placeholder="Search IPR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <div className="flex space-x-2">
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Grant No.</TableHead>
                  <TableHead>Affiliation</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIpr.map((item: Ipr) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.year}</TableCell>
                    <TableCell className="font-medium">{item.iprId}</TableCell>
                    <TableCell>{item.grantNo}</TableCell>
                    <TableCell>{item.affiliation}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.title}</TableCell>
                    <TableCell>
                      {new Date(item.createdAt!).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredIpr.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No IPR records found
            </div>
          )}
        </CardContent>
      </Card>

      <IprModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        ipr={editingIpr}
      />
    </div>
  );
}
