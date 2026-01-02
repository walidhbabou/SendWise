import { useState } from "react";
import { UserPlus, Plus, Trash2, Mail, Edit2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImportExportContacts } from "@/components/ImportExportContacts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";
import { useData } from "@/contexts/DataContext";
import { Contact } from "@/lib/storage";

const Contacts = () => {
  const { contacts, groups, addContact, updateContact, deleteContact } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  
  const { toast } = useToast();

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setSelectedGroupIds([]);
    setEditingContact(null);
  };

  const handleOpenDialog = (contact?: Contact) => {
    if (contact) {
      setEditingContact(contact);
      setName(contact.name);
      setEmail(contact.email);
      setPhone(contact.phone || "");
      setSelectedGroupIds(contact.groupIds);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Champs requis",
        description: "Nom et email sont obligatoires.",
        variant: "destructive",
      });
      return;
    }

    // Validation email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive",
      });
      return;
    }

    if (editingContact) {
      updateContact(editingContact.id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        groupIds: selectedGroupIds,
      });
      toast({
        title: "Contact mis à jour",
        description: `${name} a été modifié avec succès.`,
      });
    } else {
      addContact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        groupIds: selectedGroupIds,
      });
      toast({
        title: "Contact ajouté",
        description: `${name} a été ajouté avec succès.`,
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (contact: Contact) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${contact.name} ?`)) {
      deleteContact(contact.id);
      toast({
        title: "Contact supprimé",
        description: `${contact.name} a été supprimé.`,
      });
    }
  };

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroupIds(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const getGroupNames = (groupIds: string[]) => {
    return groupIds
      .map(id => groups.find(g => g.id === id))
      .filter(Boolean)
      .map(g => g!.name);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-8 md:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <UserPlus className="h-4 w-4" />
                  Gestion
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Contacts
                </h1>
                <p className="text-muted-foreground">
                  Gérez votre liste de contacts pour vos campagnes email.
                </p>
              </div>
              <div className="flex gap-2">
                <ImportExportContacts />
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button onClick={() => handleOpenDialog()} size="lg">
                      <Plus className="mr-2 h-4 w-4" />
                      Nouveau contact
                    </Button>
                  </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingContact ? "Modifier le contact" : "Nouveau contact"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingContact
                        ? "Modifiez les informations du contact."
                        : "Ajoutez un nouveau contact à votre liste."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        placeholder="Jean Dupont"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jean.dupont@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        placeholder="+33 6 12 34 56 78"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Groupes</Label>
                      <div className="space-y-2 border rounded-md p-4 max-h-48 overflow-y-auto">
                        {groups.map((group) => (
                          <div key={group.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`group-${group.id}`}
                              checked={selectedGroupIds.includes(group.id)}
                              onCheckedChange={() => toggleGroupSelection(group.id)}
                            />
                            <label
                              htmlFor={`group-${group.id}`}
                              className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              <span>{group.icon}</span>
                              <span>{group.name}</span>
                            </label>
                          </div>
                        ))}
                        {groups.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            Aucun groupe disponible
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSubmit}>
                      {editingContact ? "Mettre à jour" : "Ajouter"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <UserPlus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{contacts.length}</p>
                    <p className="text-sm text-muted-foreground">Total contacts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                    <Mail className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {contacts.filter(c => c.groupIds.length > 0).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Dans des groupes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                    <UserPlus className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{groups.length}</p>
                    <p className="text-sm text-muted-foreground">Groupes actifs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Liste des contacts</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredContacts.length === 0 ? (
                <div className="text-center py-12">
                  <UserPlus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun contact</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm
                      ? "Aucun contact ne correspond à votre recherche."
                      : "Commencez par ajouter des contacts à votre liste."}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Groupes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {contact.email}
                          </div>
                        </TableCell>
                        <TableCell>{contact.phone || "—"}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {getGroupNames(contact.groupIds).map((name, idx) => (
                              <Badge key={idx} variant="secondary">
                                {name}
                              </Badge>
                            ))}
                            {contact.groupIds.length === 0 && (
                              <span className="text-sm text-muted-foreground">Aucun</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(contact)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(contact)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Contacts;
