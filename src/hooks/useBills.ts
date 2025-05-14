
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBills, createBill, deleteBill, BILLS_QUERY_KEY } from "@/services/billService";
import type { CreateBillRequest } from "@/services/billService";
import { toast } from "sonner";

export function useBills() {
  const queryClient = useQueryClient();

  // Query to fetch bills
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [BILLS_QUERY_KEY],
    queryFn: fetchBills,
  });

  // Mutation to create a bill
  const createBillMutation = useMutation({
    mutationFn: ({ billData, providerName }: { billData: CreateBillRequest; providerName?: string }) => 
      createBill(billData, providerName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BILLS_QUERY_KEY] });
      toast.success("Bill created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create bill");
    },
  });

  // Mutation to delete a bill
  const deleteBillMutation = useMutation({
    mutationFn: (billId: string) => deleteBill(billId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BILLS_QUERY_KEY] });
      toast.success("Bill deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete bill");
    },
  });

  return {
    bills: data?.bills || [],
    isLoading,
    error,
    refetch,
    createBill: createBillMutation.mutate,
    isCreating: createBillMutation.isPending,
    deleteBill: deleteBillMutation.mutate,
    isDeleting: deleteBillMutation.isPending,
  };
}
