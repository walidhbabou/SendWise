import { useState } from "react";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Newsletter Welcome",
    subject: "Welcome to Our Newsletter! 🎉",
    body: "Hi there!\n\nWelcome to our newsletter. We're excited to have you on board.\n\nStay tuned for updates, tips, and exclusive content.\n\nBest regards,\nThe Team",
    category: "Welcome",
  },
  {
    id: "2",
    name: "Event Invitation",
    subject: "You're Invited: [Event Name]",
    body: "Hello!\n\nWe're thrilled to invite you to [Event Name] on [Date] at [Time].\n\nJoin us for an exciting event where you'll discover [key benefits].\n\nRSVP by [Deadline].\n\nSee you there!\n[Your Name]",
    category: "Events",
  },
  {
    id: "3",
    name: "Product Announcement",
    subject: "Introducing Our New Product! 🚀",
    body: "Hi [Name],\n\nWe're excited to announce the launch of [Product Name]!\n\n[Product Description]\n\nKey features:\n• Feature 1\n• Feature 2\n• Feature 3\n\nLearn more and get started today.\n\nCheers,\n[Your Team]",
    category: "Announcements",
  },
  {
    id: "4",
    name: "Monthly Update",
    subject: "Your Monthly Update - [Month]",
    body: "Hello!\n\nHere's what's new this month:\n\n📊 Updates:\n• Update 1\n• Update 2\n• Update 3\n\n🎯 Upcoming:\n• Event 1\n• Event 2\n\nThank you for being part of our community!\n\nBest,\nThe Team",
    category: "Updates",
  },
  {
    id: "5",
    name: "Special Offer",
    subject: "Exclusive Offer Just for You! 🎁",
    body: "Dear Valued Customer,\n\nWe're offering you an exclusive deal:\n\n[Offer Details]\n\n✅ Save [Percentage]%\n✅ Limited time only\n✅ No minimum purchase\n\nUse code: [PROMO_CODE]\n\nOffer expires [Date].\n\nHappy shopping!\n[Your Brand]",
    category: "Promotions",
  },
];

interface EmailTemplatesProps {
  onSelectTemplate: (subject: string, body: string) => void;
}

export const EmailTemplates = ({ onSelectTemplate }: EmailTemplatesProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const templates = defaultTemplates;

  const handleSelectTemplate = (template: EmailTemplate) => {
    onSelectTemplate(template.subject, template.body);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Use Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Email Templates</DialogTitle>
          <DialogDescription>
            Choose a template to get started quickly
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 md:grid-cols-2">
          {templates.map((template) => (
            <Card 
              key={template.id} 
              className="cursor-pointer hover:shadow-lg transition-all"
              onClick={() => handleSelectTemplate(template)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {template.category}
                    </CardDescription>
                  </div>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium mb-2">{template.subject}</p>
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {template.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
