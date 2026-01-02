// Types pour les données
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  groupIds: string[];
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  icon: string;
  contactCount: number;
  createdAt: string;
}

export interface Campaign {
  id: string;
  title: string;
  message: string;
  groupId: string;
  groupName: string;
  recipientCount: number;
  status: 'draft' | 'sent' | 'failed';
  sentAt?: string;
  createdAt: string;
}

// Clés de stockage
const CONTACTS_KEY = 'campaign_contacts';
const GROUPS_KEY = 'campaign_groups';
const CAMPAIGNS_KEY = 'campaign_campaigns';

// Fonctions de gestion des contacts
export const getContacts = (): Contact[] => {
  const data = localStorage.getItem(CONTACTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveContacts = (contacts: Contact[]): void => {
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
};

export const addContact = (contact: Omit<Contact, 'id' | 'createdAt'>): Contact => {
  const contacts = getContacts();
  const newContact: Contact = {
    ...contact,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  contacts.push(newContact);
  saveContacts(contacts);
  return newContact;
};

export const updateContact = (id: string, updates: Partial<Contact>): Contact | null => {
  const contacts = getContacts();
  const index = contacts.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  contacts[index] = { ...contacts[index], ...updates };
  saveContacts(contacts);
  return contacts[index];
};

export const deleteContact = (id: string): boolean => {
  const contacts = getContacts();
  const filtered = contacts.filter(c => c.id !== id);
  if (filtered.length === contacts.length) return false;
  saveContacts(filtered);
  return true;
};

export const getContactsByGroup = (groupId: string): Contact[] => {
  return getContacts().filter(c => c.groupIds.includes(groupId));
};

// Fonctions de gestion des groupes
export const getGroups = (): Group[] => {
  const data = localStorage.getItem(GROUPS_KEY);
  if (!data) {
    // Initialiser avec des groupes par défaut
    const defaultGroups: Group[] = [
      {
        id: '1',
        name: 'Students',
        description: 'Student contacts',
        icon: '🎓',
        contactCount: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Clients',
        description: 'Client contacts',
        icon: '💼',
        contactCount: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Admins',
        description: 'Admin contacts',
        icon: '🔐',
        contactCount: 0,
        createdAt: new Date().toISOString(),
      },
    ];
    saveGroups(defaultGroups);
    return defaultGroups;
  }
  return JSON.parse(data);
};

export const saveGroups = (groups: Group[]): void => {
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
};

export const addGroup = (group: Omit<Group, 'id' | 'createdAt' | 'contactCount'>): Group => {
  const groups = getGroups();
  const newGroup: Group = {
    ...group,
    id: crypto.randomUUID(),
    contactCount: 0,
    createdAt: new Date().toISOString(),
  };
  groups.push(newGroup);
  saveGroups(groups);
  return newGroup;
};

export const updateGroup = (id: string, updates: Partial<Group>): Group | null => {
  const groups = getGroups();
  const index = groups.findIndex(g => g.id === id);
  if (index === -1) return null;
  
  groups[index] = { ...groups[index], ...updates };
  saveGroups(groups);
  return groups[index];
};

export const deleteGroup = (id: string): boolean => {
  const groups = getGroups();
  const filtered = groups.filter(g => g.id !== id);
  if (filtered.length === groups.length) return false;
  
  // Retirer le groupe des contacts
  const contacts = getContacts();
  contacts.forEach(contact => {
    contact.groupIds = contact.groupIds.filter(gId => gId !== id);
  });
  saveContacts(contacts);
  
  saveGroups(filtered);
  return true;
};

export const updateGroupContactCount = (groupId: string): void => {
  const contacts = getContactsByGroup(groupId);
  updateGroup(groupId, { contactCount: contacts.length });
};

// Fonctions de gestion des campagnes
export const getCampaigns = (): Campaign[] => {
  const data = localStorage.getItem(CAMPAIGNS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCampaigns = (campaigns: Campaign[]): void => {
  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
};

export const addCampaign = (campaign: Omit<Campaign, 'id' | 'createdAt'>): Campaign => {
  const campaigns = getCampaigns();
  const newCampaign: Campaign = {
    ...campaign,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  campaigns.unshift(newCampaign); // Ajouter au début
  saveCampaigns(campaigns);
  return newCampaign;
};

export const updateCampaign = (id: string, updates: Partial<Campaign>): Campaign | null => {
  const campaigns = getCampaigns();
  const index = campaigns.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  campaigns[index] = { ...campaigns[index], ...updates };
  saveCampaigns(campaigns);
  return campaigns[index];
};

export const deleteCampaign = (id: string): boolean => {
  const campaigns = getCampaigns();
  const filtered = campaigns.filter(c => c.id !== id);
  if (filtered.length === campaigns.length) return false;
  saveCampaigns(filtered);
  return true;
};
