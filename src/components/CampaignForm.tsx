import { useState } from "react";
import { Mail, Loader2, CheckCircle, AlertCircle, Send, Users, LogIn, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { sendEmailViaGmail } from "@/lib/gmail";
import { EmailPreview } from "@/components/EmailPreview";
import { EmailTemplates } from "@/components/EmailTemplates";

type SendStatus = "idle" | "loading" | "success" | "error";
type SendMode = "group" | "individual";

export const CampaignForm = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [groupId, setGroupId] = useState("");
  const [sendMode, setSendMode] = useState<SendMode>("individual");
  const [status, setStatus] = useState<SendStatus>("idle");
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const { accessToken, isAuthenticated, login, logout, userEmail } = useAuth();
  const { groups, getContactsByGroupId, addCampaign } = useData();

  const handleSelectTemplate = (subject: string, body: string) => {
    setTitle(subject);
    setMessage(body);
    toast({
      title: "Template applied",
      description: "You can now customize the template.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !accessToken) {
      toast({
        title: "Not authenticated",
        description: "Please connect your Gmail account first.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim() || !message.trim() || !groupId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields before sending.",
        variant: "destructive",
      });
      return;
    }

    setStatus("loading");

    try {
      // Récupérer les contacts du groupe sélectionné
      const groupContacts = getContactsByGroupId(groupId);
      
      if (groupContacts.length === 0) {
        toast({
          title: "No contacts",
          description: "The selected group has no contacts.",
          variant: "destructive",
        });
        setStatus("idle");
        return;
      }
      
      const recipientEmails = groupContacts.map(c => c.email);
      
      let successCount = 0;
      let failedCount = 0;

      if (sendMode === "individual") {
        // Envoi individuel - un email par contact
        for (const contact of groupContacts) {
          try {
            const response = await sendEmailViaGmail(accessToken, {
              to: [contact.email],
              subject: title.trim(),
              body: `
                <html>
                  <body>
                    <h2>${title.trim()}</h2>
                    <p>Bonjour ${contact.name},</p>
                    <p>${message.trim().replace(/\n/g, '<br>')}</p>
                  </body>
                </html>
              `,
            });

            if (response.ok) {
              successCount++;
            } else {
              failedCount++;
            }
          } catch (error) {
            failedCount++;
          }
        }

        if (failedCount > 0) {
          toast({
            title: "Partially sent",
            description: `${successCount} emails sent, ${failedCount} failed.`,
            variant: failedCount > successCount ? "destructive" : "default",
          });
        }
      } else {
        // Envoi groupé - tous les destinataires dans le même email
        const response = await sendEmailViaGmail(accessToken, {
          to: recipientEmails,
          subject: title.trim(),
          body: `
            <html>
              <body>
                <h2>${title.trim()}</h2>
                <p>${message.trim().replace(/\n/g, '<br>')}</p>
              </body>
            </html>
          `,
        });

        if (!response.ok) {
          throw new Error("Failed to send campaign");
        }
        successCount = recipientEmails.length;
      }

      if (successCount === 0) {
        throw new Error("All emails failed to send");
      }

      // Enregistrer la campagne dans l'historique
      const selectedGroup = groups.find(g => g.id === groupId);
      addCampaign({
        title: title.trim(),
        message: message.trim(),
        groupId,
        groupName: selectedGroup?.name || "Unknown",
        recipientCount: recipientEmails.length,
        status: "sent",
        sentAt: new Date().toISOString(),
      });

      setStatus("success");
      toast({
        title: "Campaign sent!",
        description: sendMode === "individual" 
          ? `${successCount} individual emails sent successfully.`
          : `Your campaign "${title}" has been sent to ${recipientEmails.length} contacts via Gmail.`,
      });

      // Reset form after success
      setTimeout(() => {
        setTitle("");
        setMessage("");
        setGroupId("");
        setStatus("idle");
      }, 2000);
    } catch (error) {
      setStatus("error");
      toast({
        title: "Failed to send",
        description: "There was an error sending your campaign. Please try again.",
        variant: "destructive",
      });

      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    }
  };

  const getButtonContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <Loader2 className="animate-spin" />
            Sending...
          </>
        );
      case "success":
        return (
          <>
            <CheckCircle />
            Sent Successfully
          </>
        );
      case "error":
        return (
          <>
            <AlertCircle />
            Failed to Send
          </>
        );
      default:
        return (
          <>
            <Send />
            Send Campaign
          </>
        );
    }
  };

  const getButtonVariant = () => {
    if (status === "success") return "default";
    if (status === "error") return "destructive";
    return "glow";
  };

  return (
    <Card className="w-full max-w-2xl border-border/50 bg-card/80 backdrop-blur-sm card-glow animate-slide-up">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">New Campaign</CardTitle>
              <CardDescription className="text-muted-foreground">
                Create and send an email campaign to your audience
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{userEmail}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={login}>
                <LogIn className="mr-2 h-4 w-4" />
                Connect Gmail
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <EmailTemplates onSelectTemplate={handleSelectTemplate} />
        </div>
        {!isAuthenticated && (
          <div className="mb-6 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              Please connect your Gmail account to send campaigns.
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Campaign Title
            </label>
            <Input
              id="title"
              placeholder="Enter your campaign title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={status === "loading"}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-foreground">
              Campaign Message
            </label>
            <Textarea
              id="message"
              placeholder="Write your campaign message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={status === "loading"}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="group" className="text-sm font-medium text-foreground">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Target Audience
              </span>
            </label>
            <Select value={groupId} onValueChange={setGroupId} disabled={status === "loading"}>
              <SelectTrigger id="group">
                <SelectValue placeholder="Select a user group" />
              </SelectTrigger>
              <SelectContent>
                {groups.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No groups available
                  </SelectItem>
                ) : (
                  groups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      <span className="flex items-center gap-2">
                        <span>{g.icon}</span>
                        <span>{g.name}</span>
                        <span className="text-muted-foreground text-xs">
                          ({g.contactCount} {g.contactCount === 1 ? "contact" : "contacts"})
                        </span>
                      </span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Mode d'envoi</Label>
            <RadioGroup value={sendMode} onValueChange={(value) => setSendMode(value as SendMode)}>
              <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="individual" id="individual" />
                <Label htmlFor="individual" className="cursor-pointer flex-1">
                  <div className="font-medium">Envoi individuel</div>
                  <div className="text-sm text-muted-foreground">
                    Envoyer un email personnalisé à chaque membre (plus lent, mais privé)
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="group" id="group" />
                <Label htmlFor="group" className="cursor-pointer flex-1">
                  <div className="font-medium">Envoi groupé</div>
                  <div className="text-sm text-muted-foreground">
                    Envoyer un seul email à tous les membres (plus rapide, tous voient les destinataires)
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => setShowPreview(true)}
              disabled={!title.trim() || !message.trim()}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button
              type="submit"
              variant={getButtonVariant()}
              size="lg"
              className="flex-1"
              disabled={status === "loading" || status === "success"}
            >
              {getButtonContent()}
            </Button>
          </div>
        </form>

        <EmailPreview
          title={title}
          message={message}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
        />
      </CardContent>
    </Card>
  );
};
