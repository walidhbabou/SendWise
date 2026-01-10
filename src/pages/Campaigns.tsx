import { useState } from "react";
import { History, CheckCircle, XCircle, Mail, Users, Trash2, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Layout } from "@/components/Layout";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const statusConfig = {
  sent: {
    label: "Envoyée",
    icon: CheckCircle,
    variant: "default" as const,
    className: "bg-success/10 text-success border-success/20",
  },
  draft: {
    label: "Brouillon",
    icon: Mail,
    variant: "secondary" as const,
    className: "bg-muted text-muted-foreground",
  },
  failed: {
    label: "Échouée",
    icon: XCircle,
    variant: "destructive" as const,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const Campaigns = () => {
  const { campaigns, deleteCampaign } = useData();
  const { toast } = useToast();

  const handleDelete = (campaignId: string, title: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la campagne "${title}" ?`)) {
      deleteCampaign(campaignId);
      toast({
        title: "Campagne supprimée",
        description: `"${title}" a été supprimée de l'historique.`,
      });
    }
  };

  const stats = {
    total: campaigns.length,
    sent: campaigns.filter(c => c.status === "sent").length,
    failed: campaigns.filter(c => c.status === "failed").length,
    totalRecipients: campaigns.reduce((sum, c) => sum + c.recipientCount, 0),
  };

  return (
    <Layout>
      <div className="p-8 md:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <History className="h-4 w-4" />
              Historique
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Campagnes envoyées
            </h1>
            <p className="text-muted-foreground">
              Consultez l'historique de toutes vos campagnes email.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4 mb-8 animate-slide-up">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.sent}</p>
                    <p className="text-sm text-muted-foreground">Envoyées</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                    <XCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.failed}</p>
                    <p className="text-sm text-muted-foreground">Échouées</p>
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
                    <p className="text-2xl font-bold">{stats.totalRecipients}</p>
                    <p className="text-sm text-muted-foreground">Destinataires</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaigns List */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Historique des campagnes</CardTitle>
              <CardDescription>
                Liste de toutes les campagnes envoyées
              </CardDescription>
            </CardHeader>
            <CardContent>
              {campaigns.length === 0 ? (
                <div className="text-center py-12">
                  <History className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune campagne</h3>
                  <p className="text-muted-foreground">
                    Vos campagnes envoyées apparaîtront ici.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Groupe</TableHead>
                      <TableHead>Destinataires</TableHead>
                      <TableHead>Statut de mail</TableHead>
                      <TableHead>Date d'envoyer</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => {
                      const config = statusConfig[campaign.status];
                      const StatusIcon = config.icon;
                      
                      return (
                        <TableRow key={campaign.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{campaign.title}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {campaign.message.substring(0, 60)}...
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{campaign.groupName}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              {campaign.recipientCount}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={config.className}>
                              <StatusIcon className="mr-1 h-3 w-3" />
                              {config.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {campaign.sentAt
                                ? format(new Date(campaign.sentAt), "dd MMM yyyy HH:mm", { locale: fr })
                                : format(new Date(campaign.createdAt), "dd MMM yyyy HH:mm", { locale: fr })}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(campaign.id, campaign.title)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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

export default Campaigns;
