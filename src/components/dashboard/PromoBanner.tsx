
import { Button } from "@/components/ui/button";

const PromoBanner = () => {
  return (
    <div className="flex justify-between items-center rounded-lg mb-6 overflow-hidden relative bg-[#1A1F2C]">
      <div className="w-2/3 p-6 z-10">
        <h2 className="text-xl font-bold text-white mb-1">Create New Urgent 2kay Bundle!</h2>
        <p className="text-gray-300 text-sm">
          Combine all your bills into one transparent, easy-to-manage request.
          We'll handle the rest.
        </p>
      </div>

      <Button className="bg-[#6544E4] hover:bg-[#5A3DD0] text-white absolute right-6 top-1/2 transform -translate-y-1/2 z-10">
        Create new bundle
      </Button>

      {/* Money graphic in green */}
      <div className="absolute right-0 h-full w-1/3 overflow-hidden">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -right-10 top-1/2 transform -translate-y-1/2 opacity-90">
          <circle cx="100" cy="100" r="80" fill="#4CAF50" fillOpacity="0.7"/>
          <circle cx="100" cy="100" r="60" fill="#4CAF50" fillOpacity="0.8"/>
          <circle cx="100" cy="100" r="40" fill="#4CAF50" fillOpacity="0.9"/>
        </svg>
      </div>
    </div>
  );
};

export default PromoBanner;
