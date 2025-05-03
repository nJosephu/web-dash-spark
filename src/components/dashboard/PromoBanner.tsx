import { Button } from "@/components/ui/button";
import money3d from "../../images/money3d.png";
import CreateBundleSheet from "./CreateBundleSheet";

const PromoBanner = () => {
  return (
    <div
      className="flex flex-col p-4 md:p-6 md:flex-row justify-between items-start md:items-center rounded-lg mb-6 overflow-hidden relative bg-[#1A1F2C] gap-5 md:gap-0

"
    >
      <div className="w-full md:w-2/3  z-10 max-w-[450px]">
        <h2 className="text-2xl font-regular text-white mb-1">
          Create New Urgent 2kay Bundle!
        </h2>
        <p className="text-gray-300 text-sm">
          Combine all your bills into one transparent, easy-to-manage request.
          We'll handle the rest.
        </p>
      </div>

      <CreateBundleSheet
        trigger={
          <Button
            className="bg-[#6544E4] hover:bg-[#5A3DD0] text-white static right-6 top-1/2 z-10 md:absolute md:transform md:-translate-y-1/2
"
          >
            Create new bundle
          </Button>
        }
      />

      {/* Money graphic in green */}
      <div
        className="absolute right-[220px] h-full w-1/3 overflow-hidden hidden lg:block"
        style={{
          backgroundImage: `url(${money3d})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
};

export default PromoBanner;
