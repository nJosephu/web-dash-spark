
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBill } from "@/services/billService";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export const useBillOperations = (requestId: string) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Mutation for deleting a bill
  const deleteBillMutation = useMutation({
    mutationFn: async (billId: string) => {
      if (!token) throw new Error("Authentication required");
      return await deleteBill(billId);
    },
    onSuccess: () => {
      toast.success("Bill deleted successfully");
      // Invalidate the request query to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ["request", requestId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete bill: ${error.message}`);
    }
  });

  return {
    deleteBill: deleteBillMutation.mutate,
    isDeletingBill: deleteBillMutation.isPending,
  };
};
