
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const StatCardSkeleton = () => {
  return (
    <div className="p-4 rounded-lg border border-gray-200">
      <div className="flex items-start gap-2">
        <Skeleton className="w-[30px] h-[30px] rounded-full mt-1.5" />
        <div className="flex-1">
          <Skeleton className="w-24 h-4 mb-2" />
          <Skeleton className="w-20 h-6 mb-2" />
          <div className="flex items-center gap-1 mt-1">
            <Skeleton className="w-12 h-4" />
            <Skeleton className="w-32 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const DonutChartSkeleton = () => {
  return (
    <div>
      <Skeleton className="w-32 h-6 mb-4" />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 h-48 md:h-auto flex items-center justify-center">
          <Skeleton className="w-40 h-40 rounded-full" />
        </div>
        <div className="md:w-1/2 space-y-5 py-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Skeleton className="w-3 h-3 rounded-full mr-2" />
                  <Skeleton className="w-20 h-4" />
                </div>
                <Skeleton className="w-10 h-4" />
              </div>
              <Skeleton className="w-full h-2 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
