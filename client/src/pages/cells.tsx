import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CellsModal from "@/components/modals/cells-modal";
import type { CellsCommittees } from "@shared/schema";

export default function Cells() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<CellsCommittees | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cells = [], isLoading, error } = useQuery({
    queryKey: ['/api/cellscommittees'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/cellscommittees');
      return response.json();
    },
  });

  // Ensure cells is always an array
  const cellsArray = Array.isArray(cells) ? cells : [];

  const deleteMutation = useMutation({
    mutationFn: async (_id: string) => {
      await apiRequest('DELETE', `/api/cellscommittees/${_id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cellscommittees'] });
      toast({
        title: "Success",
        description: "Cell/Committee deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete cell/committee",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (cell: CellsCommittees) => {
    setEditingCell(cell);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this cell/committee?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCell(null);
  };



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading cells & committees...</div>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Cells & Committees</h3>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-900 hover:bg-primary-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Cell/Committee
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cellsArray.map((cell: CellsCommittees) => (
              <Card key={cell._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">{cell.name}</h4>
                    <span className="text-xs font-medium text-gray-500">{cell.cellId || cell._id}</span>
                  </div>

                  {cell.pdfUrl && (
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <a 
                            href={cell.pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                          >
                            View PDF Document
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(cell)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cell._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {cellsArray.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No cells or committees found
            </div>
          )}
        </CardContent>
      </Card>

      <CellsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        cell={editingCell}
      />
    </div>
  );
}