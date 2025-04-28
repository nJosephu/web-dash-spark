
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search } from "lucide-react";

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
          <div className="flex items-center px-3 py-1.5 border rounded-md text-sm">
            <span className="mr-2">Filter by</span>
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
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search"
              className="pl-9 pr-4 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-urgent-purple focus:border-urgent-purple"
            />
          </div>
          <Button variant="ghost" className="text-urgent-purple hover:text-urgent-purple/90 hover:bg-purple-50">
            View all
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">S/N</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Request</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Sponsor</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Request status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Due date</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">{request.id}</td>
                <td className="px-4 py-4">{request.title}</td>
                <td className="px-4 py-4">{request.sponsor}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    request.status === 'Completed' ? 'bg-green-50 text-green-700' :
                    request.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {request.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    request.priority === 'High' ? 'bg-red-50 text-red-700' :
                    request.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {request.priority}
                  </span>
                </td>
                <td className="px-4 py-4">{request.created}</td>
                <td className="px-4 py-4">{request.dueDate}</td>
                <td className="px-4 py-4">
                  <Button variant="ghost" size="sm" className="text-urgent-purple">
                    View more info
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestsTable;
