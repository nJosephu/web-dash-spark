
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Request {
  id: number;
  title: string;
  sponsor: string;
  status: 'Completed' | 'Pending' | 'Rejected';
  priority: 'High' | 'Medium' | 'Low';
  created: string;
  dueDate: string;
}

const mockRequests: Request[] = [
  {
    id: 1,
    title: "DSTV Power bill",
    sponsor: "Father",
    status: "Completed",
    priority: "High",
    created: "Mar 21, 2025",
    dueDate: "Apr 13, 2025"
  },
  {
    id: 2,
    title: "Cloth, shoes and accessories",
    sponsor: "Friend",
    status: "Completed",
    priority: "Medium",
    created: "Mar 21, 2025",
    dueDate: "Apr 13, 2025"
  },
  {
    id: 3,
    title: "Airtime & Data",
    sponsor: "Mother",
    status: "Completed",
    priority: "High",
    created: "Mar 21, 2025",
    dueDate: "Apr 13, 2025"
  },
  {
    id: 4,
    title: "DSTV Power bill",
    sponsor: "Father",
    status: "Completed",
    priority: "High",
    created: "Mar 21, 2025",
    dueDate: "Apr 13, 2025"
  }
];

const RequestsTable = () => {
  const [requests] = useState<Request[]>(mockRequests);
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 flex justify-between items-center border-b">
        <h3 className="font-medium">Bill request history</h3>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <Button variant="outline" className="flex items-center gap-1 text-sm h-9">
              <span>Filter by</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 7 6 6 6-6" />
              </svg>
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search"
                className="pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#7B68EE] focus:border-[#7B68EE] h-9"
              />
            </div>
          </div>
          <Button variant="ghost" className="text-[#7B68EE] hover:text-[#7B68EE]/90 hover:bg-purple-50 h-9">
            View all
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-xs uppercase">S/N</TableHead>
              <TableHead className="text-xs uppercase">Request</TableHead>
              <TableHead className="text-xs uppercase">Sponsor</TableHead>
              <TableHead className="text-xs uppercase">Request status</TableHead>
              <TableHead className="text-xs uppercase">Priority</TableHead>
              <TableHead className="text-xs uppercase">Created</TableHead>
              <TableHead className="text-xs uppercase">Due date</TableHead>
              <TableHead className="text-xs uppercase">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id} className="hover:bg-gray-50">
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.title}</TableCell>
                <TableCell>{request.sponsor}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${
                    request.status === 'Completed' ? 'bg-green-50 text-green-700' :
                    request.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {request.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${
                    request.priority === 'High' ? 'bg-red-50 text-red-700' :
                    request.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {request.priority}
                  </span>
                </TableCell>
                <TableCell>{request.created}</TableCell>
                <TableCell>{request.dueDate}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-[#7B68EE]">
                    View more info
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RequestsTable;
