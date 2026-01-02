import { useState } from "react";
import { Eye, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { sendEmailViaGmail } from "@/lib/gmail";

interface EmailPreviewProps {
  title: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EmailPreview = ({ title, message, isOpen, onClose }: EmailPreviewProps) => {
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);
  const { accessToken, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleSendTest = async () => {
    if (!isAuthenticated || !accessToken) {
      toast({
        title: "Not authenticated",
        description: "Please connect your Gmail account first.",
        variant: "destructive",
      });
      return;
    }

    if (!testEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter a test email address.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      await sendEmailViaGmail(accessToken, {
        to: [testEmail],
        subject: `[TEST] ${title}`,
        body: `
          <html>
            <body>
              <div style="background: #f3f4f6; padding: 20px;">
                <div style="background: white; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
                  <p style="color: #dc2626; font-weight: bold; margin-bottom: 10px;">🧪 TEST EMAIL</p>
                  <h2>${title}</h2>
                  <p>${message.replace(/\n/g, '<br>')}</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      toast({
        title: "Test email sent",
        description: `Test email sent to ${testEmail}`,
      });
      setTestEmail("");
    } catch (error) {
      toast({
        title: "Failed to send",
        description: "Error sending test email.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Email Preview</DialogTitle>
          <DialogDescription>
            Preview how your email will look to recipients
          </DialogDescription>
        </DialogHeader>
        
        <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <div 
              className="prose dark:prose-invert"
              dangerouslySetInnerHTML={{ 
                __html: message.replace(/\n/g, '<br>') 
              }}
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-2">
            <Label htmlFor="test-email">Send test email</Label>
            <div className="flex gap-2">
              <Input
                id="test-email"
                type="email"
                placeholder="your-email@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
              <Button onClick={handleSendTest} disabled={sending}>
                <Send className="mr-2 h-4 w-4" />
                {sending ? "Sending..." : "Send Test"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
