# 📧 Campaign Creator Suite - Système Dynamique Gmail

Application complète de gestion de campagnes email intégrée avec Gmail.

## ✨ Fonctionnalités

### 🔐 Authentification Gmail
- Connexion OAuth 2.0 avec Google
- Envoi d'emails directement depuis votre compte Gmail
- Gestion sécurisée des tokens d'accès

### 👥 Gestion des Contacts
- Ajout, modification et suppression de contacts
- Stockage du nom, email, téléphone
- Association de contacts à plusieurs groupes
- Recherche en temps réel
- Import/Export (à venir)

### 📊 Gestion des Groupes
- Création de groupes personnalisés
- Icônes et descriptions
- Compteur automatique de membres
- Organisation flexible

### 📬 Campagnes Email
- Création de campagnes ciblées par groupe
- Envoi via Gmail API
- Historique complet des campagnes
- Statistiques en temps réel

## 🚀 Démarrage Rapide

### 1. Configuration Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un projet (ou utilisez un existant)
3. Activez **Gmail API** :
   - APIs & Services → Library
   - Recherchez "Gmail API"
   - Cliquez sur "Enable"

4. Créez des credentials OAuth 2.0 :
   - APIs & Services → Credentials
   - Create Credentials → OAuth client ID
   - Type: **Web application**
   - Name: Campaign Creator
   - Authorized JavaScript origins:
     - `http://localhost:8081`
     - `http://localhost:5173`
   - Authorized redirect URIs:
     - `http://localhost:8081`
     - `http://localhost:5173`

5. Configurez l'écran de consentement OAuth :
   - OAuth consent screen
   - User Type: **External**
   - App information: Remplissez les champs requis
   - Scopes: Ajoutez :
     - `https://www.googleapis.com/auth/gmail.send`
     - `https://www.googleapis.com/auth/gmail.compose`
   - Test users: Ajoutez votre email Gmail

6. Copiez le **Client ID** généré

### 2. Configuration Locale

Éditez le fichier `.env.local` et ajoutez votre Client ID :

```env
VITE_GOOGLE_CLIENT_ID=votre_client_id_ici.apps.googleusercontent.com
```

### 3. Installation et Lancement

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

L'application sera accessible sur **http://localhost:8081**

## 📱 Utilisation

### 1️⃣ Connexion Gmail

1. Cliquez sur "Connect Gmail" dans le formulaire de campagne
2. Autorisez l'accès à votre compte Gmail
3. Vous êtes connecté ! Votre email s'affiche en haut à droite

### 2️⃣ Créer des Groupes

1. Allez dans **Groups** (menu de navigation)
2. Cliquez sur "Nouveau groupe"
3. Remplissez :
   - Nom du groupe
   - Description (optionnelle)
   - Choisissez une icône
4. Cliquez sur "Créer"

### 3️⃣ Ajouter des Contacts

1. Allez dans **Contacts**
2. Cliquez sur "Nouveau contact"
3. Remplissez :
   - Nom complet (requis)
   - Email (requis)
   - Téléphone (optionnel)
   - Sélectionnez un ou plusieurs groupes
4. Cliquez sur "Ajouter"

### 4️⃣ Envoyer une Campagne

1. Revenez à la **page d'accueil**
2. Assurez-vous d'être connecté à Gmail
3. Remplissez le formulaire :
   - Titre de la campagne
   - Message (supporte HTML)
   - Sélectionnez un groupe cible
4. Cliquez sur "Send Campaign"
5. Les emails sont envoyés à tous les contacts du groupe !

### 5️⃣ Consulter l'Historique

1. Allez dans **Campaigns**
2. Consultez toutes vos campagnes envoyées
3. Statistiques :
   - Total de campagnes
   - Taux de réussite
   - Nombre de destinataires

## 🗂️ Structure du Projet

```
src/
├── components/          # Composants React
│   ├── CampaignForm.tsx # Formulaire d'envoi de campagne
│   ├── Layout.tsx       # Layout principal
│   └── ui/              # Composants UI (shadcn)
├── contexts/            # Contextes React
│   ├── AuthContext.tsx  # Gestion authentification Gmail
│   └── DataContext.tsx  # Gestion des données (contacts, groupes, campagnes)
├── lib/                 # Bibliothèques utilitaires
│   ├── gmail.ts         # Fonctions Gmail API
│   ├── storage.ts       # Stockage localStorage
│   └── utils.ts         # Utilitaires divers
├── pages/               # Pages de l'application
│   ├── Index.tsx        # Page d'accueil (campagne)
│   ├── Contacts.tsx     # Gestion des contacts
│   ├── Groups.tsx       # Gestion des groupes
│   └── Campaigns.tsx    # Historique des campagnes
└── App.tsx              # Point d'entrée

```

## 💾 Stockage des Données

Les données sont actuellement stockées dans le **localStorage** du navigateur :

- ✅ Avantages : Simple, rapide, pas de backend requis
- ⚠️ Limites : Données locales au navigateur, limite ~10MB

### Données stockées :
- `campaign_contacts` : Liste des contacts
- `campaign_groups` : Liste des groupes
- `campaign_campaigns` : Historique des campagnes

### 🔄 Migration future vers base de données

Pour passer à une base de données (Firebase, Supabase, etc.) :
1. Modifier `src/lib/storage.ts`
2. Remplacer localStorage par appels API
3. Pas de changement dans les composants (grâce au DataContext)

## 🎨 Personnalisation

### Modifier les icônes de groupes

Éditez `src/pages/Groups.tsx` :

```typescript
const ICON_OPTIONS = ["🎓", "💼", "🔐", "👥", "🏢", "🎯", ...];
```

### Personnaliser les couleurs

Le projet utilise Tailwind CSS. Modifiez `tailwind.config.ts` pour changer le thème.

## 🛡️ Sécurité

- ✅ OAuth 2.0 pour l'authentification
- ✅ Token d'accès stocké localement (localStorage)
- ✅ Pas de stockage de mots de passe
- ⚠️ En production : utilisez HTTPS
- ⚠️ En production : ajoutez un backend pour gérer les tokens de manière sécurisée

## 📦 Technologies Utilisées

- **React** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Composants UI
- **Google OAuth** - Authentification
- **Gmail API** - Envoi d'emails
- **React Router** - Navigation
- **date-fns** - Gestion des dates

## 🐛 Dépannage

### Le port 8080 est déjà utilisé
L'application utilise automatiquement le port suivant (8081, 8082, etc.)

### Erreur "Gmail API not enabled"
Vérifiez que Gmail API est bien activée dans Google Cloud Console

### Erreur "Redirect URI mismatch"
Vérifiez que vos URIs de redirection dans Google Cloud correspondent au port utilisé

### Les emails ne s'envoient pas
1. Vérifiez votre connexion Gmail (bouton "Connect Gmail")
2. Vérifiez que le groupe contient des contacts
3. Consultez la console pour les erreurs

### Les données disparaissent
Les données sont en localStorage. Si vous videz le cache du navigateur, elles sont perdues.
Utilisez "Export" avant de vider le cache (fonctionnalité à venir).

## 🚀 Prochaines Fonctionnalités

- [ ] Import/Export de contacts (CSV, Excel)
- [ ] Templates d'emails personnalisables
- [ ] Éditeur HTML WYSIWYG pour les emails
- [ ] Planification d'envoi différé
- [ ] Statistiques détaillées (taux d'ouverture, clics)
- [ ] Support des pièces jointes
- [ ] Base de données backend
- [ ] Mode hors-ligne (PWA)
- [ ] Multi-utilisateurs
- [ ] API REST

## 📄 Licence

MIT License - Libre d'utilisation

## 👨‍💻 Support

Pour toute question ou problème, créez une issue sur GitHub.

---

Fait avec ❤️ pour simplifier vos campagnes email
