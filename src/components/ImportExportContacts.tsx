import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import { Contact } from "@/lib/storage";

export const ImportExportContacts = () => {
  const { contacts, addContact } = useData();
  const { toast } = useToast();

  // Export contacts to CSV
  const handleExport = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Groups"].join(","),
      ...contacts.map(contact => [
        contact.name,
        contact.email,
        contact.phone || "",
        contact.groupIds.join(";")
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: `${contacts.length} contacts exported to CSV.`,
    });
  };

  // Import contacts from CSV
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n").slice(1); // Skip header
        let imported = 0;

        lines.forEach(line => {
          if (!line.trim()) return;
          const [name, email, phone, groups] = line.split(",");
          
          if (name && email) {
            addContact({
              name: name.trim(),
              email: email.trim(),
              phone: phone?.trim() || "",
              groupIds: groups ? groups.split(";").filter(Boolean) : [],
            });
            imported++;
          }
        });

        toast({
          title: "Import successful",
          description: `${imported} contacts imported from CSV.`,
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Error reading CSV file. Please check the format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
      <label>
        <input
          type="file"
          accept=".csv"
          onChange={handleImport}
          className="hidden"
        />
        <Button variant="outline" size="sm" asChild>
          <span>
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </span>
        </Button>
      </label>
    </div>
  );
};
