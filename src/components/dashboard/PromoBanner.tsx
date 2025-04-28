
import { Button } from "@/components/ui/button";

const PromoBanner = () => {
  return (
    <div className="flex justify-between items-center p-6 bg-gradient-to-r from-sidebar to-sidebar-active rounded-lg mb-6 overflow-hidden relative">
      <div className="w-2/3">
        <h2 className="text-xl font-bold text-white mb-1">Create New Urgent 2kay Bundle!</h2>
        <p className="text-gray-300 text-sm">
          Combine all your bills into one transparent, easy-to-manage request.
          We'll handle the rest.
        </p>
      </div>

      <Button className="bg-urgent-purple hover:bg-purple-700 text-white">
        Create new bundle
      </Button>

      {/* Money graphic - stylized representation */}
      <div className="absolute right-4 -bottom-5 opacity-50">
        <div className="w-32 h-16 bg-green-500 rounded-md transform rotate-12"></div>
        <div className="w-32 h-16 bg-green-400 rounded-md transform rotate-6 -mt-8"></div>
        <div className="w-32 h-16 bg-green-300 rounded-md transform -mt-8"></div>
      </div>
    </div>
  );
};

export default PromoBanner;
