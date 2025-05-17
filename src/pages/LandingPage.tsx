import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import useScrollAnimation from "@/hooks/use-scroll-animation";
import logo from "../images/Logo.png";
import logo2 from "../images/logo2kpurple.png";
import { ArrowRight } from "lucide-react";
import DashboardPage from "../images/URGENT 2KAY App Screenshot.png";

const LandingPage = () => {
  const isMobile = useIsMobile();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const howItWorksSection = useScrollAnimation();
  const ctaSection = useScrollAnimation();

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);

    // Add scroll event listener to detect when page is scrolled
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - now fixed with backdrop effect when scrolled */}
      <header
        className={`fixed top-0 z-50 w-full px-4 py-4 lg:px-[154px] lg:py-6 flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center">
          <img src={logo} alt="Urgent 2kay" className="h-6 md:h-8" />
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/login">
            <Button
              variant="outline"
              className="font-medium text-[#6544E4] border border-[#6544E4] transition-all hover:scale-105"
            >
              Log In
            </Button>
          </Link>
          <Link to="/role-selection">
            <Button className="bg-[#6544E4] hover:bg-[#5A3DD0] text-white transition-all hover:scale-105">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Added padding to account for fixed header */}
      <div
        className={`pt-16 md:pt-24 ${isPageLoaded ? "" : "invisible"}`}
      ></div>

      {/* Hero Section */}
      <section
        className={`px-4 pt-12 md:pt-20 [background:linear-gradient(180deg,_#FFFFFF_0%,_#6544E4_100%)] flex-1 flex flex-col items-center text-center transition-all duration-1000 ease-in-out ${
          isPageLoaded
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }
`}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-[#1F2937] mb-4">
            Pay Bills Without Awkward Conversations
          </h1>
          <p className="text-lg md:text-xl text-[#1F2937] mb-8 max-w-3xl mx-auto">
            Create bills, share them, and get a timely collection from your
            sponsors. Collection made simple!
          </p>
          <Link to="/role-selection">
            <Button
              size="lg"
              className="bg-[#6544E4] hover:bg-[#5A3DD0] text-white px-8 py-6 rounded-lg text-lg transition-all hover:scale-105"
            >
              Get Started
            </Button>
          </Link>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-12 md:mt-16 max-w-5xl mx-auto w-full shadow-2xl rounded-lg overflow-hidden transition-transform hover:scale-[1.01] duration-300">
          <img
            src={DashboardPage}
            alt="Dashboard Preview"
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section
        ref={howItWorksSection.ref}
        className={`px-4 py-16 md:py-36 bg-white transition-all duration-1000 ease-in-out ${
          howItWorksSection.isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-16">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105">
              <div className="text-4xl font-semibold text-[#6544E4] mb-3">
                01
              </div>
              <h3 className="text-xl font-bold mb-4">Create Your Bills</h3>
              <p className="text-gray-600">
                Add all your expenses from bills and purchases to one form for
                sending.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105">
              <div className="text-4xl font-semibold text-[#6544E4] mb-3">
                02
              </div>
              <h3 className="text-xl font-bold mb-4">Send to Sponsors</h3>
              <p className="text-gray-600">
                Share your payment form to a funds provider or organization.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105">
              <div className="text-4xl font-semibold text-[#6544E4] mb-3">
                03
              </div>
              <h3 className="text-xl font-bold mb-4">Get Paid Directly</h3>
              <p className="text-gray-600">
                Funds go directly to pay providers – no need for reimbursement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaSection.ref}
        className={`px-4 py-16 md:py-36 bg-[#D3C7FE] transition-all duration-1000 ease-in-out ${
          ctaSection.isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-3xl mx-auto text-center text-[#6544E4]">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Simplify Your Bill Payments?
          </h2>
          <p className="mb-8">
            Join the list of others that have simplified their collections with
            Urgent 2Kay
          </p>
          <Link to="/role-selection">
            <Button
              size="lg"
              className="bg-[#6544E4] hover:bg-[#5A3DD0] text-white px-8 py-6 rounded-lg text-lg transition-all hover:scale-105"
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1F2C] text-white py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-4 md:mb-0">
              <img src={logo2} alt="Urgent 2kay" className="h-6 md:h-8" />
            </div>
          </div>
          <div className="border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-2 md:mb-0">
              © {new Date().getFullYear()} Urgent 2Kay. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-gray-400">
              <Link to="#" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
