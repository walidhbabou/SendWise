import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Contact,
  Group,
  Campaign,
  getContacts,
  getGroups,
  getCampaigns,
  addContact as addContactStorage,
  updateContact as updateContactStorage,
  deleteContact as deleteContactStorage,
  addGroup as addGroupStorage,
  updateGroup as updateGroupStorage,
  deleteGroup as deleteGroupStorage,
  addCampaign as addCampaignStorage,
  updateCampaign as updateCampaignStorage,
  deleteCampaign as deleteCampaignStorage,
  getContactsByGroup,
  updateGroupContactCount,
} from '@/lib/storage';

interface DataContextType {
  // Contacts
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => Contact;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  getContactsByGroupId: (groupId: string) => Contact[];
  
  // Groups
  groups: Group[];
  addGroup: (group: Omit<Group, 'id' | 'createdAt' | 'contactCount'>) => Group;
  updateGroup: (id: string, updates: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  
  // Campaigns
  campaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt'>) => Campaign;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  
  // Refresh
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const refreshData = () => {
    setContacts(getContacts());
    setGroups(getGroups());
    setCampaigns(getCampaigns());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addContact = (contact: Omit<Contact, 'id' | 'createdAt'>) => {
    const newContact = addContactStorage(contact);
    // Mettre à jour le nombre de contacts dans les groupes
    contact.groupIds.forEach(groupId => {
      updateGroupContactCount(groupId);
    });
    refreshData();
    return newContact;
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    updateContactStorage(id, updates);
    // Mettre à jour les compteurs de groupes si nécessaire
    if (updates.groupIds) {
      const allGroups = getGroups();
      allGroups.forEach(group => {
        updateGroupContactCount(group.id);
      });
    }
    refreshData();
  };

  const deleteContact = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
      deleteContactStorage(id);
      // Mettre à jour les compteurs de groupes
      contact.groupIds.forEach(groupId => {
        updateGroupContactCount(groupId);
      });
      refreshData();
    }
  };

  const getContactsByGroupId = (groupId: string) => {
    return getContactsByGroup(groupId);
  };

  const addGroup = (group: Omit<Group, 'id' | 'createdAt' | 'contactCount'>) => {
    const newGroup = addGroupStorage(group);
    refreshData();
    return newGroup;
  };

  const updateGroup = (id: string, updates: Partial<Group>) => {
    updateGroupStorage(id, updates);
    refreshData();
  };

  const deleteGroup = (id: string) => {
    deleteGroupStorage(id);
    refreshData();
  };

  const addCampaign = (campaign: Omit<Campaign, 'id' | 'createdAt'>) => {
    const newCampaign = addCampaignStorage(campaign);
    refreshData();
    return newCampaign;
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    updateCampaignStorage(id, updates);
    refreshData();
  };

  const deleteCampaign = (id: string) => {
    deleteCampaignStorage(id);
    refreshData();
  };

  return (
    <DataContext.Provider
      value={{
        contacts,
        addContact,
        updateContact,
        deleteContact,
        getContactsByGroupId,
        groups,
        addGroup,
        updateGroup,
        deleteGroup,
        campaigns,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
