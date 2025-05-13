
import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Sponsor, SponsorFormValues, sponsorFormSchema } from "@/types/sponsor";

const Sponsors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);

  // Initialize the form with react-hook-form
  const form = useForm<SponsorFormValues>({
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
      id: "1", // Changed from number to string
      name: "John Doe",
      relationship: "Family",
      email: "john.doe@example.com",
      phone: "+234 812 345 6789",
      joinedDate: "Jan 2025",
    },
    {
      id: "2", // Changed from number to string
      name: "Sarah Williams",
      relationship: "Friend",
      email: "sarah.williams@example.com",
      phone: "+234 813 456 7890",
      joinedDate: "Feb 2025",
    },
    {
      id: "3", // Changed from number to string
      name: "Michael Brown",
      relationship: "Colleague",
      email: "michael.brown@example.com",
      phone: "+234 814 567 8901",
      joinedDate: "Dec 2024",
    },
    {
      id: "4", // Changed from number to string
      name: "Lisa Johnson",
      relationship: "Other",
      email: "lisa.johnson@example.com",
      phone: "+234 815 678 9012",
      joinedDate: "Mar 2025",
    },
  ];

  useEffect(() => {
    document.title = "My Sponsors | Urgent2kay";

    // Load sponsors (mock data for now)
    setSponsors(mockSponsors);
    setIsLoading(false);
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

  // Handle opening the create sponsor sheet
  const handleCreateSponsor = () => {
    form.reset();
    setIsCreateSheetOpen(true);
  };

  // Handle opening the edit sponsor sheet
  const handleEditSponsor = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    form.reset({
      name: sponsor.name,
      relationship: sponsor.relationship,
      email: sponsor.email,
      phone: sponsor.phone,
    });
    setIsEditSheetOpen(true);
  };

  // Handle opening the delete sponsor dialog
  const handleDeleteSponsor = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setIsDeleteDialogOpen(true);
  };

  // Handle form submission for create/edit
  const onSubmit = (data: SponsorFormValues) => {
    if (isEditSheetOpen && selectedSponsor) {
      // Update existing sponsor
      const updatedSponsors = sponsors.map((s) =>
        s.id === selectedSponsor.id ? { ...s, ...data } : s
      );
      setSponsors(updatedSponsors);
      toast.success("Sponsor updated successfully");
      setIsEditSheetOpen(false);
    } else {
      // Create new sponsor
      // Generate a unique string ID instead of a number
      const newId = String(Math.max(0, ...sponsors.map((s) => Number(s.id))) + 1);
      
      const newSponsor: Sponsor = {
        id: newId, // Use string ID
        name: data.name,
        relationship: data.relationship,
        email: data.email,
        phone: data.phone,
        joinedDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
      };
      setSponsors([...sponsors, newSponsor]);
      toast.success("Sponsor added successfully");
      setIsCreateSheetOpen(false);
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

  const relationshipOptions = [
    "Family",
    "Friend",
    "Colleague",
    "Business",
    "Other",
  ];

  return (
    <>
      <div className="mb-6">
        <p className="text-gray-500">
          Manage people who have sponsored your bill requests
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>All Sponsors</CardTitle>{" "}
                <div className="inline-flex items-center px-2.5 py-0.5 text-[#6544E4] rounded-lg bg-[#F1EDFF]">
                  {sponsors.length}
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <Input
                  type="text"
                  placeholder="Search sponsors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                className="bg-[#6544E4] hover:bg-[#5A3DD0] gap-2"
                onClick={handleCreateSponsor}
              >
                <Plus size={18} />
                Add New Sponsor
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center p-4">Loading sponsors...</div>
          ) : filteredSponsors.length > 0 ? (
            <div className="rounded-md">
              <Table>
                <TableHeader className="bg-[#F5F5F5]">
                  <TableRow>
                    <TableHead className="w-12">S/N</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Relationship</TableHead>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSponsors.map((sponsor, index) => (
                    <TableRow key={sponsor.id}>
                      <TableCell className="font-medium py-9">
                        {index + 1}
                      </TableCell>
                      <TableCell>{sponsor.name}</TableCell>
                      <TableCell>{sponsor.relationship}</TableCell>
                      <TableCell>{sponsor.email}</TableCell>
                      <TableCell>{sponsor.phone}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditSponsor(sponsor)}
                            >
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
              <p className="text-gray-500">
                No sponsors found. Try adjusting your search or add a new
                sponsor.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Sponsor Sheet */}
      <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
        <SheetContent className="sm:max-w-[450px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold">
              Add New Sponsor
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Form fields */}
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {relationshipOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                        />
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
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateSheetOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#6544E4] hover:bg-[#5A3DD0]"
                  >
                    Add Sponsor
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Sponsor Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="sm:max-w-[450px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold">Edit Sponsor</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Form fields same as create form */}
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {relationshipOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                        />
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
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditSheetOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#6544E4] hover:bg-[#5A3DD0]"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Sponsor Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
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
    </>
  );
};

export default Sponsors;
