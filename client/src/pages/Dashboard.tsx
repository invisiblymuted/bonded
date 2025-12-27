import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMyChildren, useCreateChild, useUpdateChild, useDeleteChild } from "@/hooks/use-children";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Loader2, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertChildSchema, type InsertChild, type Child } from "@shared/schema";
import { z } from "zod";
import { useState } from "react";
import { format } from "date-fns";
import { useLocation } from "wouter";

// --- Components for this page ---

function ChildForm({ 
  child, 
  onClose 
}: { 
  child?: Child, 
  onClose: () => void 
}) {
  const createMutation = useCreateChild();
  const updateMutation = useUpdateChild();
  const isEditing = !!child;

  const formSchema = insertChildSchema.omit({ parentId: true, createdAt: true }).extend({
    age: z.coerce.number().min(0, "Age must be positive"),
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: child ? {
      name: child.name,
      age: child.age,
      description: child.description,
      lastSeenLocation: child.lastSeenLocation,
      photoUrl: child.photoUrl || "",
      status: child.status || "missing",
    } : {
      status: "missing"
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (isEditing && child) {
      updateMutation.mutate({ id: child.id, ...data }, {
        onSuccess: onClose
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: onClose
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const statusValue = watch("status");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" {...register("name")} placeholder="Jane Doe" />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" {...register("age")} placeholder="10" />
          {errors.age && <p className="text-xs text-destructive">{errors.age.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastSeenLocation">Last Seen Location</Label>
        <Input id="lastSeenLocation" {...register("lastSeenLocation")} placeholder="City, State, Country" />
        {errors.lastSeenLocation && <p className="text-xs text-destructive">{errors.lastSeenLocation.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Physical Description & Details</Label>
        <Textarea 
          id="description" 
          {...register("description")} 
          placeholder="Height, hair color, eye color, clothing worn..." 
          className="h-24"
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="photoUrl">Photo URL (Optional)</Label>
        <Input id="photoUrl" {...register("photoUrl")} placeholder="https://example.com/photo.jpg" />
        <p className="text-xs text-muted-foreground">Link to a publicly accessible image.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Current Status</Label>
        <Select 
          onValueChange={(val) => setValue("status", val)} 
          defaultValue={statusValue || "missing"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="missing">Missing</SelectItem>
            <SelectItem value="found">Found (Safe)</SelectItem>
            <SelectItem value="reunited">Reunited with Family</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Save Changes" : "Submit Report"}
        </Button>
      </div>
    </form>
  );
}

// --- Main Page Component ---

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: myChildren, isLoading: dataLoading } = useMyChildren();
  const deleteMutation = useDeleteChild();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [authLoading, isAuthenticated]);

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this profile? This cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (child: Child) => {
    setEditingChild(child);
    setOpenDialog(true);
  };

  const handleCreate = () => {
    setEditingChild(null);
    setOpenDialog(true);
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-display tracking-tight">Parent Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your reported cases and update statuses.</p>
          </div>
          
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate} className="shadow-lg shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" /> Report Missing Child
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingChild ? "Edit Profile" : "Create New Report"}</DialogTitle>
              </DialogHeader>
              <ChildForm 
                child={editingChild || undefined} 
                onClose={() => setOpenDialog(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>

        {myChildren?.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-2xl border border-dashed border-border shadow-sm">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No reports yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              You haven't reported any missing children yet. If you need to file a report, click the button below.
            </p>
            <Button onClick={handleCreate} variant="outline">Create First Report</Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {myChildren?.map((child) => (
              <Card key={child.id} className="overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-48 aspect-video sm:aspect-square bg-muted relative">
                    {child.photoUrl ? (
                      <img src={child.photoUrl} alt={child.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
                    )}
                    <div className="absolute top-2 left-2">
                       <Badge variant={child.status === 'missing' ? 'destructive' : 'default'}>
                         {child.status}
                       </Badge>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold font-display">{child.name}</h3>
                        <span className="text-xs text-muted-foreground">Created {format(new Date(child.createdAt!), 'MMM d, yyyy')}</span>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{child.description}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center"><span className="font-semibold mr-1">Age:</span> {child.age}</div>
                        <div className="flex items-center"><span className="font-semibold mr-1">Location:</span> {child.lastSeenLocation}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border/50">
                      <Button variant="outline" size="sm" onClick={() => setLocation(`/child/${child.id}`)}>
                        View Public Page
                      </Button>
                      <div className="flex-1" />
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(child)}>
                        <Edit2 className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(child.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
