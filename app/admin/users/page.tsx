"use client";

import React from "react"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Shield,
  User,
  Mail,
  Calendar,
  Eye,
  EyeOff,
  UserPlus,
  Users as UsersIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import { useUsers } from "@/hooks/use-data";
import { useAuth } from "@/contexts/auth-context";
import type { User as UserType } from "@/lib/types";

export default function UsersManagement() {
  const { data: users, isLoading, mutate } = useUsers();
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as "admin" | "user",
  });

  const filteredUsers = users?.filter((user: UserType) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenDialog = (user?: UserType) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingUser) {
        const updateData: Record<string, string> = {
          _id: editingUser._id!,
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }

        const response = await fetch("/api/users", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });

        if (response.ok) {
          toast.success("User updated successfully");
          mutate();
          setIsDialogOpen(false);
        } else {
          const data = await response.json();
          toast.error(data.error || "Failed to update user");
        }
      } else {
        if (!formData.password) {
          toast.error("Password is required for new users");
          setIsSubmitting(false);
          return;
        }

        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast.success("User created successfully");
          mutate();
          setIsDialogOpen(false);
        } else {
          const data = await response.json();
          toast.error(data.error || "Failed to create user");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/users?id=${userToDelete._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("User deleted successfully");
        mutate();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete user");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsConfirmDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const adminCount = users?.filter((u: UserType) => u.role === "admin").length || 0;
  const userCount = users?.filter((u: UserType) => u.role === "user").length || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">User Management</h2>
          <p className="text-muted-foreground text-sm">Manage administrative access and system users</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-none bg-card/50 backdrop-blur-sm shadow-sm ring-1 ring-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner border border-primary/10">
                <UsersIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground tracking-tight">
                  {users?.length || 0}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-card/50 backdrop-blur-sm shadow-sm ring-1 ring-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shadow-inner border border-amber-500/10">
                <Shield className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground tracking-tight">{adminCount}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Administrators</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none bg-card/50 backdrop-blur-sm shadow-sm ring-1 ring-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shadow-inner border border-blue-500/10">
                <User className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground tracking-tight">{userCount}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Regular Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none bg-card/50 backdrop-blur-sm shadow-sm ring-1 ring-border overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/50 px-6 py-6">
          <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
            <div>
              <CardTitle className="text-lg font-bold text-foreground">Registered Users</CardTitle>
              <CardDescription className="text-[10px] font-black uppercase tracking-widest mt-1">
                {filteredUsers?.length || 0} accounts found
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative group overflow-hidden rounded-xl ring-1 ring-border transition-all focus-within:ring-primary/50">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-card/50 border-none w-full sm:w-64 focus-visible:ring-0"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-44 bg-card/50 border-none ring-1 ring-border rounded-xl">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-card">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Administrators</SelectItem>
                  <SelectItem value="user">Regular Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 border-b border-border/50 hover:bg-muted/50">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12 px-6">User Profile</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Email Address</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Access Level</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Join Date</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12 text-right px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredUsers?.map((user: UserType) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group border-b border-border/50 hover:bg-primary/[0.02] transition-colors"
                    >
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              "h-10 w-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-300",
                              user.role === "admin"
                                ? "bg-amber-500 text-white shadow-amber-500/20"
                                : "bg-primary text-primary-foreground shadow-primary/20"
                            )}
                          >
                            <span className="font-black text-xs">{user.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold tracking-tight text-foreground">
                              {user.name}
                            </span>
                            {user._id === currentUser?._id && (
                              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                                Original Admin
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 text-muted-foreground font-medium text-[13px]">
                          <Mail className="h-3.5 w-3.5 text-primary/50" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                          className={cn(
                            "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                            user.role === "admin"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              : "bg-primary/10 text-primary border-primary/20"
                          )}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-foreground/70 tracking-tight">
                            {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleOpenDialog(user)}
                            className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setUserToDelete(user);
                              setIsConfirmDeleteDialogOpen(true);
                            }}
                            disabled={user._id === currentUser?._id}
                            className="h-9 w-9 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>

          {filteredUsers?.length === 0 && (
            <div className="text-center py-12">
              <UsersIcon className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {editingUser ? "Edit Profile" : "New User Account"}
            </DialogTitle>
            <DialogDescription className="font-medium text-muted-foreground">
              {editingUser
                ? "Update security roles and user credentials"
                : "Create a new administrative or staff account"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Full Legal Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="bg-muted/50 border-border rounded-xl h-11 focus-visible:ring-primary/50"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Corporate Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="bg-muted/50 border-border rounded-xl h-11 focus-visible:ring-primary/50"
                  placeholder="john@dimensionnepal.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Access Password {editingUser && "(Optional)"}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required={!editingUser}
                    className="bg-muted/50 border-border rounded-xl h-11 pr-10 focus-visible:ring-primary/50"
                    placeholder={
                      editingUser ? "••••••••" : "Create strong password"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Security Role
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "admin" | "user") =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className="bg-muted/50 border-border rounded-xl h-11 focus:ring-primary/50">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    <SelectItem value="user">Standard User</SelectItem>
                    <SelectItem value="admin">System Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl border-border font-bold h-11 px-6"
              >
                Discard
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold h-11 px-8 shadow-lg shadow-primary/20"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Syncing...
                  </>
                ) : editingUser ? (
                  "Update Profile"
                ) : (
                  "Create Account"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-foreground">
              Delete User Account
            </AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-muted-foreground">
              Are you sure you want to delete <span className="text-primary font-bold">{userToDelete?.name}</span>? This action
              is permanent and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 pt-4">
            <AlertDialogCancel className="rounded-xl border-border hover:bg-muted font-bold">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-500/20"
            >
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
