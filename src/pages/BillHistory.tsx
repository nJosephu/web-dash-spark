import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Receipt, Download, Calendar, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BillHistory = () => {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    document.title = "Bill History | Urgent2kay";

    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData.email) {
      // Extract name from email (for demo purposes)
      const nameFromEmail = userData.email.split("@")[0];
      setUserName(
        nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)
      );
    }
  }, []);

  const billsData = [
    {
      id: "INV-001",
      title: "Rent Payment",
      amount: "₦120,000",
      date: "2025-03-15",
      status: "paid",
      paymentMethod: "Direct Transfer",
      sponsor: "John Doe",
    },
    {
      id: "INV-002",
      title: "Electricity Bill",
      amount: "₦38,500",
      date: "2025-03-10",
      status: "paid",
      paymentMethod: "Credit Card",
      sponsor: "Self",
    },
    {
      id: "INV-003",
      title: "Water Bill",
      amount: "₦12,800",
      date: "2025-02-28",
      status: "paid",
      paymentMethod: "Direct Transfer",
      sponsor: "Sarah Williams",
    },
    {
      id: "INV-004",
      title: "Internet Payment",
      amount: "₦25,000",
      date: "2025-02-15",
      status: "paid",
      paymentMethod: "Credit Card",
      sponsor: "Michael Brown",
    },
    {
      id: "INV-005",
      title: "Cable TV",
      amount: "₦21,500",
      date: "2025-01-28",
      status: "paid",
      paymentMethod: "Direct Transfer",
      sponsor: "Self",
    },
    {
      id: "INV-006",
      title: "Phone Bill",
      amount: "₦15,000",
      date: "2025-01-15",
      status: "paid",
      paymentMethod: "Credit Card",
      sponsor: "Lisa Johnson",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 w-full md:ml-64">
        <TopNav userName={userName} />

        <div className="max-w-[100vw] overflow-x-hidden p-4 pt-0 md:p-6 md:pt-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Bill History</h1>
              <p className="text-gray-500">
                View your complete bill payment history
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" /> Filter by Date
              </Button>
              <Button className="bg-[#6544E4] hover:bg-[#5A3DD0]">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Bills Paid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Amount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#6544E4]">
                  ₦232,800
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Sponsored Amount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ₦172,800
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="bg-white">
              <div className="flex items-center">
                <Receipt className="mr-2 h-5 w-5 text-[#6544E4]" />
                <CardTitle className="text-lg font-medium">
                  Bills Payment History
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="all" className="p-4">
                <TabsList>
                  <TabsTrigger value="all">All Bills</TabsTrigger>
                  <TabsTrigger value="sponsored">Sponsored Bills</TabsTrigger>
                  <TabsTrigger value="self">Self-Paid Bills</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Sponsor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {billsData.map((bill) => (
                          <TableRow key={bill.id}>
                            <TableCell className="font-medium">
                              {bill.id}
                            </TableCell>
                            <TableCell>{bill.title}</TableCell>
                            <TableCell>{bill.amount}</TableCell>
                            <TableCell>{bill.date}</TableCell>
                            <TableCell>{bill.sponsor}</TableCell>
                            <TableCell>
                              <Badge
                                className="bg-green-100 text-green-800"
                                variant="outline"
                              >
                                {bill.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                <TabsContent value="sponsored" className="mt-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Sponsor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {billsData
                          .filter((bill) => bill.sponsor !== "Self")
                          .map((bill) => (
                            <TableRow key={bill.id}>
                              <TableCell className="font-medium">
                                {bill.id}
                              </TableCell>
                              <TableCell>{bill.title}</TableCell>
                              <TableCell>{bill.amount}</TableCell>
                              <TableCell>{bill.date}</TableCell>
                              <TableCell>{bill.sponsor}</TableCell>
                              <TableCell>
                                <Badge
                                  className="bg-green-100 text-green-800"
                                  variant="outline"
                                >
                                  {bill.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                <TabsContent value="self" className="mt-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Payment Method</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {billsData
                          .filter((bill) => bill.sponsor === "Self")
                          .map((bill) => (
                            <TableRow key={bill.id}>
                              <TableCell className="font-medium">
                                {bill.id}
                              </TableCell>
                              <TableCell>{bill.title}</TableCell>
                              <TableCell>{bill.amount}</TableCell>
                              <TableCell>{bill.date}</TableCell>
                              <TableCell>{bill.paymentMethod}</TableCell>
                              <TableCell>
                                <Badge
                                  className="bg-green-100 text-green-800"
                                  variant="outline"
                                >
                                  {bill.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BillHistory;
