
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteBill } from "@/services/billService";
import { useAuth } from "@/context/AuthContext";

export function useBillOperations() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  // Mutation for deleting a bill
  const deleteBillMutation = useMutation({
    mutationFn: async (billId: string) => {
      return deleteBill(billId);
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["request"] });
      toast.success("Bill deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete bill: ${error.message}`);
    },
  });

  return {
    deleteBill: deleteBillMutation.mutate,
    isDeleting: deleteBillMutation.isPending,
    deleteBillError: deleteBillMutation.error,
  };
}
