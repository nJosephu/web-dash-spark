
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define the sponsor type
interface Sponsor {
  id: number;
  name: string;
  relationship: string;
  email: string;
  phone: string;
  joinedDate: string;
}

// Form validation schema
const sponsorFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  relationship: z.string().min(1, "Please select a relationship"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
});

const Sponsors = () => {
  const [userName, setUserName] = useState("User");
  const [searchQuery, setSearchQuery] = useState("");
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const { fetchWithAuth } = useApi();
  const { toast: showToast } = useToast();

  // Initialize the form with react-hook-form
  const form = useForm<z.infer<typeof sponsorFormSchema>>({
    resolver: zodResolver(sponsorFormSchema),
    defaultValues: {
      name: "",
      relationship: "",
      email: "",
      phone: "",
    },
  });

  // Mock data for now - would come from API in real implementation
  const mockSponsors: Sponsor[] = [
    {
      id: 1,
      name: "John Doe",
      relationship: "Family",
      email: "john.doe@example.com",
      phone: "+234 812 345 6789",
      joinedDate: "Jan 2025",
    },
    {
      id: 2,
      name: "Sarah Williams",
      relationship: "Friend",
      email: "sarah.williams@example.com",
      phone: "+234 813 456 7890",
      joinedDate: "Feb 2025",
    },
    {
      id: 3,
      name: "Michael Brown",
      relationship: "Colleague",
      email: "michael.brown@example.com",
      phone: "+234 814 567 8901",
      joinedDate: "Dec 2024",
    },
    {
      id: 4,
      name: "Lisa Johnson",
      relationship: "Other",
      email: "lisa.johnson@example.com",
      phone: "+234 815 678 9012",
      joinedDate: "Mar 2025",
    },
  ];

  useEffect(() => {
    document.title = "Sponsors | Urgent2kay";

    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData.email) {
      // Extract name from email (for demo purposes)
      const nameFromEmail = userData.email.split("@")[0];
      setUserName(
        nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1)
      );
    }

    // Load sponsors (mock data for now)
    setSponsors(mockSponsors);
    setIsLoading(false);

    // In a real implementation, this would be:
    // fetchSponsors();
  }, []);

  // Filter sponsors based on search query
  const filteredSponsors = sponsors.filter((sponsor) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      sponsor.name.toLowerCase().includes(query) ||
      sponsor.relationship.toLowerCase().includes(query) ||
      sponsor.email.toLowerCase().includes(query) ||
      sponsor.phone.toLowerCase().includes(query)
    );
  });

  // Handle opening the create sponsor dialog
  const handleCreateSponsor = () => {
    form.reset();
    setIsCreateDialogOpen(true);
  };

  // Handle opening the edit sponsor dialog
  const handleEditSponsor = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    form.reset({
      name: sponsor.name,
      relationship: sponsor.relationship,
      email: sponsor.email,
      phone: sponsor.phone,
    });
    setIsEditDialogOpen(true);
  };

  // Handle opening the delete sponsor dialog
  const handleDeleteSponsor = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setIsDeleteDialogOpen(true);
  };

  // Handle form submission for create/edit
  const onSubmit = (data: z.infer<typeof sponsorFormSchema>) => {
    if (isEditDialogOpen && selectedSponsor) {
      // Update existing sponsor
      const updatedSponsors = sponsors.map((s) =>
        s.id === selectedSponsor.id
          ? { ...s, ...data }
          : s
      );
      setSponsors(updatedSponsors);
      toast.success("Sponsor updated successfully");
      setIsEditDialogOpen(false);
    } else {
      // Create new sponsor
      const newSponsor: Sponsor = {
        id: Math.max(0, ...sponsors.map((s) => s.id)) + 1,
        ...data,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      };
      setSponsors([...sponsors, newSponsor]);
      toast.success("Sponsor added successfully");
      setIsCreateDialogOpen(false);
    }
  };

  // Handle sponsor deletion
  const confirmDelete = () => {
    if (selectedSponsor) {
      const filteredSponsors = sponsors.filter(
        (s) => s.id !== selectedSponsor.id
      );
      setSponsors(filteredSponsors);
      toast.success("Sponsor deleted successfully");
      setIsDeleteDialogOpen(false);
    }
  };

  // In a real implementation, these functions would call the API:
  const fetchSponsors = async () => {
    try {
      setIsLoading(true);
      const data = await fetchWithAuth("/api/sponsors");
      setSponsors(data);
    } catch (error) {
      toast.error("Failed to load sponsors");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const relationshipOptions = ["Family", "Friend", "Colleague", "Business", "Other"];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 w-full md:ml-64">
        <TopNav userName={userName} />

        <div className="max-w-[100vw] overflow-x-hidden p-4 pt-0 md:p-6 md:pt-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Sponsors</h1>
              <p className="text-gray-500">
                View and manage your bill sponsors
              </p>
            </div>
            <Button 
              className="bg-[#6544E4] hover:bg-[#5A3DD0] gap-2"
              onClick={handleCreateSponsor}
            >
              <Plus size={18} />
              Add New Sponsor
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Sponsors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sponsors.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Active Sponsors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {sponsors.length > 0 ? sponsors.length - 1 : 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Sponsored
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#6544E4]">
                  ₦1,225,000
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Your Sponsors</CardTitle>
                  <CardDescription>
                    People who have sponsored your bill requests
                  </CardDescription>
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    type="text"
                    placeholder="Search sponsors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center p-4">Loading sponsors...</div>
              ) : filteredSponsors.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">S/N</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Relationship</TableHead>
                        <TableHead>Email Address</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSponsors.map((sponsor, index) => (
                        <TableRow key={sponsor.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{sponsor.name}</TableCell>
                          <TableCell>{sponsor.relationship}</TableCell>
                          <TableCell>{sponsor.email}</TableCell>
                          <TableCell>{sponsor.phone}</TableCell>
                          <TableCell>{sponsor.joinedDate}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditSponsor(sponsor)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteSponsor(sponsor)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No sponsors found. Try adjusting your search or add a new sponsor.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Sponsor Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Sponsor</DialogTitle>
            <DialogDescription>
              Add a new sponsor to your bill payment system.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="">Select relationship</option>
                        {relationshipOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+234 812 345 6789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#6544E4] hover:bg-[#5A3DD0]">Add Sponsor</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Sponsor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Sponsor</DialogTitle>
            <DialogDescription>
              Update the details for this sponsor.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="">Select relationship</option>
                        {relationshipOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+234 812 345 6789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#6544E4] hover:bg-[#5A3DD0]">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Sponsor Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the sponsor {selectedSponsor?.name}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Sponsors;
