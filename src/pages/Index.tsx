import { Mail } from "lucide-react";
import { Layout } from "@/components/Layout";
import { CampaignForm } from "@/components/CampaignForm";

const Index = () => {
  return (
    <Layout>
      <div className="p-8 md:p-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Mail className="h-4 w-4" />
              Nouvelle Campagne
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Créer une campagne
            </h1>
            <p className="text-muted-foreground">
              Rédigez et envoyez votre campagne email à un groupe cible.
            </p>
          </div>

          {/* Campaign Form */}
          <CampaignForm />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
