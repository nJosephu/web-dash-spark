import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  CircleDollarSign,
  Filter,
  Plus,
  Search,
  Wallet,
  Eye,
  EyeOff,
  ExternalLink,
  AlertCircle,
  Send,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWeb3 } from "@/context/Web3Context";
import { useBlockchainBills } from "@/hooks/useBlockchainBills";
import { shortenAddress, formatEthAmount } from "@/config/blockchain";
import { ethers } from "ethers";
import { NETWORK } from "@/config/blockchain";
import MetaMaskAlert from "@/components/blockchain/MetaMaskAlert";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const Web3Wallet = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    isConnected,
    isConnecting,
    address,
    ethBalance,
    u2kBalance,
    connectWallet,
    isCorrectNetwork,
    switchNetwork,
    refreshBalances,
    showMetaMaskAlert,
    setShowMetaMaskAlert,
    isBillContractAvailable,
  } = useWeb3();

  const {
    bills,
    isLoading: isLoadingBills,
    getBillStatusLabel,
    createBill,
    isCreatingBill,
  } = useBlockchainBills();

  const [balanceVisible, setBalanceVisible] = useState(true);
  const [isCreateRequestOpen, setIsCreateRequestOpen] = useState(false);
  const [newRequestData, setNewRequestData] = useState({
    description: "",
    amount: "",
    destinationAddress: "",
  });

  // Create a reference to sponsor selector data
  const [selectedSponsor, setSelectedSponsor] = useState({
    id: "",
    name: "",
    address: "",
  });

  // Mock sponsors data - in a real app would come from API
  const mockSponsors = [
    {
      id: "sponsor1",
      name: "John Sponsor",
      address: "0x1234567890123456789012345678901234567890",
    },
    {
      id: "sponsor2",
      name: "Mary Supporter",
      address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    },
  ];

  // Calculate stats based on blockchain bills
  const calculateStats = () => {
    const billsArray = bills.address || [];

    const totalRequested = billsArray.reduce((sum, bill) => {
      return sum + parseFloat(ethers.utils.formatEther(bill.amount));
    }, 0);

    const approved = billsArray
      .filter((bill) => bill.status === 1) // Status 1 = Paid
      .reduce((sum, bill) => {
        return sum + parseFloat(ethers.utils.formatEther(bill.amount));
      }, 0);

    const rejected = billsArray
      .filter((bill) => bill.status === 2) // Status 2 = Rejected
      .reduce((sum, bill) => {
        return sum + parseFloat(ethers.utils.formatEther(bill.amount));
      }, 0);

    const pending = billsArray
      .filter((bill) => bill.status === 0) // Status 0 = Pending
      .reduce((sum, bill) => {
        return sum + parseFloat(ethers.utils.formatEther(bill.amount));
      }, 0);

    return [
      {
        title: "Total Requested",
        value: `${totalRequested.toFixed(6)} ETH`,
        increase: totalRequested > 0 ? "Active" : "No requests",
        increaseText: "Total on blockchain",
        color: "bg-green-500",
        icon: <CircleDollarSign className="h-4 w-4" />,
      },
      {
        title: "Approved Requests",
        value: `${approved.toFixed(6)} ETH`,
        increase: approved > 0 ? "Received" : "None yet",
        increaseText: "Successful requests",
        color: "bg-purple-500",
        icon: <CircleDollarSign className="h-4 w-4" />,
      },
      {
        title: "Rejected Requests",
        value: `${rejected.toFixed(6)} ETH`,
        increase: rejected > 0 ? "Rejected" : "None",
        increaseText: "Unsuccessful requests",
        color: "bg-red-500",
        icon: <CircleDollarSign className="h-4 w-4" />,
      },
      {
        title: "Pending Requests",
        value: `${pending.toFixed(6)} ETH`,
        increase: pending > 0 ? "Awaiting" : "None pending",
        increaseText: "Under review",
        color: "bg-yellow-500",
        icon: <CircleDollarSign className="h-4 w-4" />,
      },
    ];
  };

  const statsData = calculateStats();

  // Handle modal input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRequestData({
      ...newRequestData,
      [name]: value,
    });
  };

  // Handle create request
  const handleCreateRequest = async () => {
    if (!selectedSponsor.id || !selectedSponsor.address) {
      toast({
        title: "Error",
        description: "Please select a sponsor",
        variant: "destructive",
      });
      return;
    }

    if (!newRequestData.description || !newRequestData.amount) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use the current wallet address if no destination is specified
      const destinationAddress =
        newRequestData.destinationAddress.trim() || address;

      if (!destinationAddress) {
        toast({
          title: "Error",
          description: "Destination address is required",
          variant: "destructive",
        });
        return;
      }

      await createBill({
        sponsorId: selectedSponsor.id,
        paymentDestination: destinationAddress,
        amount: parseFloat(newRequestData.amount),
        description: newRequestData.description,
      });

      setIsCreateRequestOpen(false);
      setNewRequestData({
        description: "",
        amount: "",
        destinationAddress: "",
      });
      setSelectedSponsor({
        id: "",
        name: "",
        address: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to create bill request: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const toggleBalanceVisibility = () => {
    setBalanceVisible(!balanceVisible);
  };

  // Handle MetaMask connect attempt
  const handleConnectWallet = async () => {
    const result = await connectWallet();
    if (!result && !window.ethereum) {
      setShowMetaMaskAlert(true);
    }
  };

  // Format bill requests for display
  const requestHistoryData = bills.address
    ? bills.address.map((bill) => {
        const status = getBillStatusLabel(bill.status);
        return {
          id: bill.id.toString(),
          request: bill.description || "Blockchain Bill Request",
          sponsor: shortenAddress(bill.sponsor),
          status: status.label,
          statusColor: status.color,
          priority:
            parseFloat(ethers.utils.formatEther(bill.amount)) > 0.1
              ? "High"
              : "Medium",
          created: new Date(bill.createdAt * 1000).toLocaleDateString(),
          processedDate: bill.processedAt
            ? new Date(bill.processedAt * 1000).toLocaleDateString()
            : "-",
          amount: `${formatEthAmount(
            ethers.utils.formatEther(bill.amount)
          )} ETH`,
        };
      })
    : [];

  return (
    <div className="py-6">
      {/* MetaMask Alert Dialog */}
      <MetaMaskAlert
        isOpen={showMetaMaskAlert}
        onClose={() => setShowMetaMaskAlert(false)}
      />

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsData.map((stat, index) => (
          <Card
            key={index}
            className="bg-[#1A1F2C] text-white border-none shadow-md"
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={`p-1.5 rounded-full ${stat.color} mr-2`}>
                    {stat.icon}
                  </div>
                  <p className="text-xs text-gray-400">{stat.title}</p>
                </div>
                <div className="flex items-center text-xs text-green-400">
                  <span className="mr-1">{stat.increase}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 17L17 7M17 7H8M17 7V16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-1">
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.increaseText}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Wallet and Request Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Wallet Section */}
        <Card className="bg-[#1A1F2C] text-white border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Wallet</CardTitle>
            {isConnected && (
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                onClick={refreshBalances}
              >
                <Plus className="h-4 w-4 mr-1" /> Refresh balance
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {!isConnected ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Wallet size={32} className="text-gray-500" />
                </div>
                <h3 className="font-medium mb-2">Connect Your Wallet</h3>
                <p className="text-gray-400 text-sm text-center mb-6 max-w-md">
                  Connect your crypto wallet to create and track bill requests
                </p>
                <Button
                  className="bg-[#6544E4] hover:bg-[#5A3DD0]"
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                >
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400">Wallet Address</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono">
                      {shortenAddress(address || "")}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => {
                        window.open(
                          `${NETWORK.blockExplorerUrl}/address/${address}`,
                          "_blank"
                        );
                      }}
                    >
                      <ExternalLink size={14} />
                    </Button>
                  </div>
                </div>

                {!isCorrectNetwork && (
                  <div className="bg-yellow-900/20 border border-yellow-900/50 text-yellow-400 px-4 py-3 rounded-lg mb-6 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Wrong Network</p>
                      <p className="text-sm">
                        Please connect to Base Sepolia Testnet
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto bg-yellow-500/20 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30"
                      onClick={switchNetwork}
                    >
                      Switch Network
                    </Button>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {/* ETH Balance */}
                  <div className="bg-gradient-to-r from-[#6544E4]/5 to-[#6544E4]/10 p-5 rounded-xl">
                    <div className="flex items-start gap-4 mb-2">
                      <div className="p-3 rounded-full bg-[#6544E4]/20">
                        <CircleDollarSign
                          size={20}
                          className="text-[#6544E4]"
                        />
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm mb-1">
                          ETH Balance
                        </div>
                        <div className="font-semibold text-2xl">
                          {balanceVisible ? ethBalance || "0.00" : "••••••••"}
                        </div>
                        <div className="text-gray-400 text-xs">
                          Base Sepolia Testnet
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto hover:bg-transparent"
                      onClick={toggleBalanceVisibility}
                    >
                      {balanceVisible ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>

                  {/* U2KAY Tokens */}
                  <div className="bg-gradient-to-r from-[#6544E4]/5 to-[#6544E4]/10 p-5 rounded-xl">
                    <div className="flex items-start gap-4 mb-2">
                      <div className="p-3 rounded-full bg-[#6544E4]/20">
                        <Wallet size={20} className="text-[#6544E4]" />
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm mb-1">
                          U2K Tokens
                        </div>
                        <div className="font-semibold text-2xl">
                          {balanceVisible ? u2kBalance || "0.00" : "••••••••"}
                        </div>
                        <div className="text-gray-400 text-xs">
                          Rewards tokens
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Request Section */}
        <Card className="bg-[#1A1F2C] text-white border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Create a new bill request</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm mb-6">
              Submit a bill request directly to your sponsor. Once approved,
              funds will be sent to your wallet or specified payment address.
              All transactions are recorded on the blockchain.
            </p>

            {!isBillContractAvailable && (
              <div className="bg-yellow-900/20 border border-yellow-900/50 text-yellow-400 px-4 py-3 rounded-lg mb-6">
                <p className="font-medium">Bill Contract Not Available</p>
                <p className="text-sm">
                  The bill request contract is not available on this network.
                  Please switch to Base Sepolia Testnet.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <Button
                className="w-full py-6 bg-[#6544E4] hover:bg-[#5335C5] text-white"
                onClick={() => setIsCreateRequestOpen(true)}
                disabled={
                  !isConnected || !isCorrectNetwork || !isBillContractAvailable
                }
              >
                <Send className="h-4 w-4 mr-2" /> Create an URGENT 2KAY Request
              </Button>
              <Button
                variant="outline"
                className="w-full py-6 bg-transparent border-gray-700 text-white hover:bg-gray-800"
                disabled={!isConnected || bills.address.length === 0}
              >
                See Previous Requests
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Request History Section */}
      <Card className="bg-[#1A1F2C] text-white border-none shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Bill request history</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400" />
                <Input
                  placeholder="Search"
                  className="pl-9 bg-gray-800 border-gray-700 text-white h-9"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                <Filter className="h-4 w-4 mr-1" /> Filter by
              </Button>
              <Button variant="ghost" size="sm" className="text-[#6544E4]">
                View all
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-700">
                  <TableHead className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    ID
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Request
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Sponsor
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Priority
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Created
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Processed
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requestHistoryData.length > 0 ? (
                  requestHistoryData.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-b border-gray-800"
                    >
                      <TableCell className="text-sm">{item.id}</TableCell>
                      <TableCell className="text-sm">{item.request}</TableCell>
                      <TableCell className="text-sm">{item.sponsor}</TableCell>
                      <TableCell className="text-sm">{item.amount}</TableCell>
                      <TableCell className="text-sm">
                        <span
                          className={`px-2 py-1 ${item.statusColor} rounded-md text-xs`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded-md text-xs">
                          {item.priority}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{item.created}</TableCell>
                      <TableCell className="text-sm">
                        {item.processedDate}
                      </TableCell>
                      <TableCell className="text-sm">
                        <Button
                          variant="link"
                          className="text-[#6544E4] p-0 h-auto"
                        >
                          View details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="py-10 text-center text-gray-400"
                    >
                      {isConnected
                        ? "No blockchain requests found. Create your first request!"
                        : "Connect your wallet to view blockchain requests"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Request Modal */}
      <Dialog open={isCreateRequestOpen} onOpenChange={setIsCreateRequestOpen}>
        <DialogContent className="sm:max-w-[500px] bg-[#1A1F2C] text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl">Create Bill Request</DialogTitle>
            <DialogDescription className="text-gray-400">
              Submit a new bill request to your sponsor.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-4">
              <label
                htmlFor="sponsor"
                className="text-right text-sm font-medium text-gray-300"
              >
                Sponsor
              </label>
              <select
                id="sponsor"
                className="col-span-3 flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white"
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const sponsor = mockSponsors.find((s) => s.id === selectedId);
                  if (sponsor) {
                    setSelectedSponsor({
                      id: sponsor.id,
                      name: sponsor.name,
                      address: sponsor.address,
                    });
                  }
                }}
                value={selectedSponsor.id}
              >
                <option value="">Select a sponsor</option>
                {mockSponsors.map((sponsor) => (
                  <option key={sponsor.id} value={sponsor.id}>
                    {sponsor.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-4">
              <label
                htmlFor="description"
                className="text-right text-sm font-medium text-gray-300"
              >
                Description*
              </label>
              <Input
                id="description"
                name="description"
                placeholder="Bill description"
                className="col-span-3 bg-gray-800 border-gray-700 text-white"
                value={newRequestData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex flex-col gap-4">
              <label
                htmlFor="amount"
                className="text-right text-sm font-medium text-gray-300"
              >
                Amount (ETH)*
              </label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.001"
                placeholder="0.00"
                className="col-span-3 bg-gray-800 border-gray-700 text-white"
                value={newRequestData.amount}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex flex-col gap-4">
              <label
                htmlFor="destinationAddress"
                className="text-right text-sm font-medium text-gray-300"
              >
                Destination
              </label>
              <Input
                id="destinationAddress"
                name="destinationAddress"
                placeholder="0x... (default: your wallet address)"
                className="col-span-3 bg-gray-800 border-gray-700 text-white"
                value={newRequestData.destinationAddress}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-4 text-xs text-gray-400 px-4">
              * Required fields
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateRequestOpen(false)}
              className="bg-transparent border-gray-700 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateRequest}
              className="bg-[#6544E4] hover:bg-[#5335C5] text-white"
              disabled={isCreatingBill}
            >
              {isCreatingBill ? "Creating..." : "Create Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Web3Wallet;
