import { useState } from "react";
import { Users, Plus, Trash2, Edit2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";
import { useData } from "@/contexts/DataContext";
import { Group } from "@/lib/storage";

const ICON_OPTIONS = ["🎓", "💼", "🔐", "👥", "🏢", "🎯", "💡", "🚀", "⭐", "🎨", "📱", "💻"];

const Groups = () => {
  const { groups, addGroup, updateGroup, deleteGroup } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(ICON_OPTIONS[0]);
  
  const { toast } = useToast();

  const resetForm = () => {
    setName("");
    setDescription("");
    setIcon(ICON_OPTIONS[0]);
    setEditingGroup(null);
  };

  const handleOpenDialog = (group?: Group) => {
    if (group) {
      setEditingGroup(group);
      setName(group.name);
      setDescription(group.description || "");
      setIcon(group.icon);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez entrer un nom pour le groupe.",
        variant: "destructive",
      });
      return;
    }

    if (editingGroup) {
      updateGroup(editingGroup.id, {
        name: name.trim(),
        description: description.trim(),
        icon,
      });
      toast({
        title: "Groupe mis à jour",
        description: `${name} a été modifié avec succès.`,
      });
    } else {
      addGroup({
        name: name.trim(),
        description: description.trim(),
        icon,
      });
      toast({
        title: "Groupe créé",
        description: `${name} a été créé avec succès.`,
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (group: Group) => {
    if (group.contactCount > 0) {
      if (!confirm(`Ce groupe contient ${group.contactCount} contact(s). Êtes-vous sûr de vouloir le supprimer ? Les contacts ne seront pas supprimés.`)) {
        return;
      }
    } else {
      if (!confirm(`Êtes-vous sûr de vouloir supprimer ${group.name} ?`)) {
        return;
      }
    }
    
    deleteGroup(group.id);
    toast({
      title: "Groupe supprimé",
      description: `${group.name} a été supprimé.`,
    });
  };

  return (
    <Layout>
      <div className="p-8 md:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <Users className="h-4 w-4" />
                  Organisation
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Groupes
                </h1>
                <p className="text-muted-foreground">
                  Organisez vos contacts en groupes pour des campagnes ciblées.
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenDialog()} size="lg">
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau groupe
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingGroup ? "Modifier le groupe" : "Nouveau groupe"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingGroup
                        ? "Modifiez les informations du groupe."
                        : "Créez un nouveau groupe pour organiser vos contacts."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom du groupe *</Label>
                      <Input
                        id="name"
                        placeholder="Ex: Étudiants 2026"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Description du groupe..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Icône</Label>
                      <div className="grid grid-cols-6 gap-2">
                        {ICON_OPTIONS.map((emojiIcon) => (
                          <button
                            key={emojiIcon}
                            type="button"
                            className={`p-3 text-2xl rounded-lg border-2 transition-all hover:scale-110 ${
                              icon === emojiIcon
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => setIcon(emojiIcon)}
                          >
                            {emojiIcon}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSubmit}>
                      {editingGroup ? "Mettre à jour" : "Créer"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{groups.length}</p>
                    <p className="text-sm text-muted-foreground">Total groupes</p>
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
                      {groups.reduce((sum, g) => sum + g.contactCount, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total membres</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                    <Users className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {groups.filter(g => g.contactCount > 0).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Groupes actifs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Groups Grid */}
          {groups.length === 0 ? (
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun groupe</h3>
                <p className="text-muted-foreground mb-4">
                  Créez votre premier groupe pour organiser vos contacts.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {groups.map((group) => (
                <Card
                  key={group.id}
                  className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{group.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {group.contactCount} {group.contactCount === 1 ? "contact" : "contacts"}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(group)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(group)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {group.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {group.description}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Groups;
