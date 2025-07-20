import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ManagementModal from "@/components/modals/management-modal";
import type { ManagementTeam } from "@shared/schema"; // ✅ corrected path

export default function Management() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ManagementTeam | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: managementData = [], isLoading } = useQuery({
    queryKey: ['/api/managementteam']
  });


  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/managementteam/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/managementteam'] }); // ✅ corrected
      toast({
        title: "Success",
        description: "Management team member deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete management team member",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (member: ManagementTeam) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this management team member?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading management team...</div>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Management Team</h3>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary-900 hover:bg-primary-800 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managementData.map((member: ManagementTeam) => (
              <Card key={member._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {getInitials(member.name)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.designation}</p>
                      <p className="text-xs text-gray-500">{member.branch}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <p>ID: {member.managementId ?? "N/A"}</p>
                    <p>Mobile: {member.mobileNo ?? "N/A"}</p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(member)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(member._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {managementData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No management team members found
            </div>
          )}
        </CardContent>
      </Card>

      <ManagementModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        member={editingMember}
      />
    </div>
  );
}
