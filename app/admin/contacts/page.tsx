"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  Calendar,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  Search,
  Filter,
  MessageSquare,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";
import { useContacts } from "@/hooks/use-data";
import type { Contact } from "@/lib/types";

export default function ContactsManagement() {
  const { data: contacts, isLoading, mutate } = useContacts();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filteredContacts = contacts?.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = async (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewOpen(true);

    if (contact.status === "new") {
      try {
        await fetch("/api/contacts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: contact._id, status: "read" }),
        });
        mutate();
      } catch (error) {
        console.error("Error updating contact status:", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const response = await fetch(`/api/contacts?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Contact deleted successfully");
        mutate();
      } else {
        toast.error("Failed to delete contact");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleMarkAsResponded = async (contact: Contact) => {
    try {
      const response = await fetch("/api/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: contact._id, status: "replied" }),
      });

      if (response.ok) {
        toast.success("Contact marked as responded");
        mutate();
        setIsViewOpen(false);
      } else {
        toast.error("Failed to update contact");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unread":
        return (
          <Badge variant="destructive" className="gap-1">
            <Clock className="h-3 w-3" />
            Unread
          </Badge>
        );
      case "read":
        return (
          <Badge variant="secondary" className="gap-1">
            <Eye className="h-3 w-3" />
            Read
          </Badge>
        );
      case "responded":
        return (
          <Badge className="gap-1 bg-green-600">
            <CheckCircle className="h-3 w-3" />
            Responded
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const unreadCount =
    contacts?.filter((c: Contact) => c.status === "new").length || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Inquiry Inbox</h2>
          <p className="text-muted-foreground text-sm">Review and respond to client inquiries</p>
        </div>
      </div>

      {unreadCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                New Messages Waiting
              </p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">
                You have {unreadCount} unread message{unreadCount !== 1 ? "s" : ""} to process.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <Card className="border-none bg-card/50 backdrop-blur-sm shadow-sm ring-1 ring-border overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/50 px-6 py-6">
          <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
            <div>
              <CardTitle className="text-lg font-bold text-foreground">Client Messages</CardTitle>
              <CardDescription className="font-semibold text-[10px] uppercase tracking-widest mt-1">
                {filteredContacts?.length || 0} total enquiries found
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative group overflow-hidden rounded-xl ring-1 ring-border focus-within:ring-primary/50 transition-all">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search name, email, subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-card/50 border-none w-full sm:w-72 focus-visible:ring-0"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-44 bg-card/50 border-none ring-1 ring-border rounded-xl">
                  <Filter className="h-4 w-4 mr-2 text-primary" />
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-card">
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="new">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Responded</SelectItem>
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
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12 px-6">Sender Details</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Message Overview</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Date Received</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12">Availability</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground h-12 text-right px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredContacts?.map((contact) => (
                    <motion.tr
                      key={contact._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "group border-b border-border/50 hover:bg-primary/[0.02] transition-colors",
                        contact.status === "new" && "bg-primary/[0.04]"
                      )}
                    >
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 text-primary-foreground font-black">
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className={cn(
                              "text-sm font-bold tracking-tight",
                              contact.status === "new" ? "text-foreground" : "text-foreground/80"
                            )}>
                              {contact.name}
                            </span>
                            <span className="text-[11px] font-medium text-muted-foreground tracking-tight">
                              {contact.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="max-w-[300px]">
                          <p className={cn(
                            "text-sm font-bold tracking-tight truncate",
                            contact.status === "new" ? "text-foreground" : "text-foreground/80"
                          )}>
                            {contact.subject}
                          </p>
                          <p className="text-[11px] font-medium text-muted-foreground/60 truncate mt-0.5">
                            {contact.message}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-foreground/70">
                            {new Date(contact.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-tighter">
                            {new Date(contact.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {contact.status === "new" && (
                          <Badge className="bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                            Urgent
                          </Badge>
                        )}
                        {contact.status === "read" && (
                          <Badge className="bg-primary/10 text-primary border border-primary/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                            Read
                          </Badge>
                        )}
                        {contact.status === "replied" && (
                          <Badge className="bg-green-500/10 text-green-500 border border-green-500/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                            Replied
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleView(contact)}
                            className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(contact._id!)}
                            disabled={isDeleting === contact._id}
                            className="h-9 w-9 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            {isDeleting === contact._id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>

          {filteredContacts?.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No messages found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center justify-between">
              <span>{selectedContact?.subject}</span>
              {selectedContact && getStatusBadge(selectedContact.status)}
            </DialogTitle>
            <DialogDescription>
              Contact form submission details
            </DialogDescription>
          </DialogHeader>

          {selectedContact && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Name</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-amber-500" />
                    {selectedContact.name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-amber-500" />
                    {selectedContact.email}
                  </p>
                </div>
                {selectedContact.phone && (
                  <div className="space-y-1">
                    <p className="text-sm text-slate-400">Phone</p>
                    <p className="text-white font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4 text-amber-500" />
                      {selectedContact.phone}
                    </p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Date</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-amber-500" />
                    {new Date(selectedContact.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-400">Message</p>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-slate-200 whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-4 border-t border-slate-800">
                <Button
                  variant="outline"
                  onClick={() => setIsViewOpen(false)}
                  className="border-slate-700 text-slate-300"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    asChild
                    className="border-slate-700 text-slate-300 bg-transparent"
                  >
                    <a href={`mailto:${selectedContact.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Reply via Email
                    </a>
                  </Button>
                  {selectedContact.status !== "replied" && (
                    <Button
                      onClick={() => handleMarkAsResponded(selectedContact)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Responded
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
