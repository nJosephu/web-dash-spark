
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import { useWeb3 } from "@/context/Web3Context";

export const RequestHistory = () => {
  const { web3State } = useWeb3();
  const [searchQuery, setSearchQuery] = useState("");

  // For now, using mock data - would be replaced with real blockchain data
  const requestHistoryData = [
    {
      id: "1",
      request: "DSTV, Power bills",
      sponsor: "Father",
      status: "Completed",
      priority: "High",
      created: "Mar 21, 2025",
      dueDate: "Apr 13, 2025",
    },
  ];

  const filteredData = requestHistoryData.filter((item) =>
    item.request.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sponsor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  S/N
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Request
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Sponsor
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Request status
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Due date
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-800">
                    <td className="py-4 text-sm">{item.id}</td>
                    <td className="py-4 text-sm">{item.request}</td>
                    <td className="py-4 text-sm">{item.sponsor}</td>
                    <td className="py-4 text-sm">
                      <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-md text-xs">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm">
                      <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded-md text-xs">
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-4 text-sm">{item.created}</td>
                    <td className="py-4 text-sm">{item.dueDate}</td>
                    <td className="py-4 text-sm">
                      <Button
                        variant="link"
                        className="text-[#6544E4] p-0 h-auto"
                      >
                        View more info
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-gray-500">
                    {searchQuery
                      ? "No matching requests found"
                      : web3State.isConnected
                      ? "No bill requests found"
                      : "Connect your wallet to view request history"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
