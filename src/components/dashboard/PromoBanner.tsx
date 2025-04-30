
import { Button } from "@/components/ui/button";
import money3d from "../../images/money3d.png";
import CreateBundleSheet from "./CreateBundleSheet";

const PromoBanner = () => {
  return (
    <div className="flex justify-between items-center rounded-lg mb-6 overflow-hidden relative bg-[#1A1F2C]">
      <div className="w-2/3 p-6 z-10">
        <h2 className="text-xl font-bold text-white mb-1">
          Create New Urgent 2kay Bundle!
        </h2>
        <p className="text-gray-300 text-sm">
          Combine all your bills into one transparent, easy-to-manage request.
          We'll handle the rest.
        </p>
      </div>

      <CreateBundleSheet 
        trigger={
          <Button className="bg-[#6544E4] hover:bg-[#5A3DD0] text-white absolute right-6 top-1/2 transform -translate-y-1/2 z-10">
            Create new bundle
          </Button>
        }
      />

      {/* Money graphic in green */}
      <div className="absolute right-[170px] h-full w-1/3 overflow-hidden">
        <img
          src={money3d}
          alt="money3d"
          className="max-w-full w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default PromoBanner;
