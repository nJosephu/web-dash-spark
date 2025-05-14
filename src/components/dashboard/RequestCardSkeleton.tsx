
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const RequestCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border border-gray-200 rounded-lg">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title */}
        <Skeleton className="h-6 w-3/4 mb-4" />

        {/* Details */}
        <div className="flex flex-col space-y-3">
          {/* Amount */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>

          {/* Due date */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Sponsor */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-16" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 space-y-2">
          <Skeleton className="h-9 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 flex-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestCardSkeleton;
