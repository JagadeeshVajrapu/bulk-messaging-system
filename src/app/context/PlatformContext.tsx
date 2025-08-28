'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Account = {
  id: string;
  name: string;
  type: string;
  email?: string;
  phone?: string;
  status?: string;
};

type Platform = {
  id: string;
  name: string;
  type: string;
  url: string;
  apiKey: string;
  status?: string;
};

type AccountPlatform = {
  accountId: string;
  platformId: string;
};

// New type for platform-account pairs with display data
type PlatformAccountPair = {
  id: string;
  platformName: string;
  accountAddress: string;
  platformType: string;
  createdAt: Date;
};

type PlatformContextType = {
  accounts: Account[];
  platforms: Platform[];
  accountPlatforms: AccountPlatform[];
  platformAccountPairs: PlatformAccountPair[]; // New field
  addAccount: (account: Omit<Account, 'id'>) => string;
  addPlatform: (platform: Omit<Platform, 'id'>) => string;
  linkAccountPlatform: (accountId: string, platformId: string) => void;
  getAccountPlatforms: (accountId: string) => Platform[];
  getPlatformAccounts: (platformId: string) => Account[];
  deleteAccount: (accountId: string) => void;
  deleteAccountFromPlatform: (accountId: string, platformId: string) => void;
  // New functions for platform-account pairs
  addPlatformAccountPair: (platformName: string, accountAddress: string, platformType: string) => void;
  getPlatformAccountPairs: () => PlatformAccountPair[];
  deletePlatformAccountPair: (id: string) => void;
  clearPlatformAccountPairs: () => void;
};

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([
    { id: 'instagram', name: 'Instagram', type: 'instagram', url: '', apiKey: '', status: 'active' },
    { id: 'whatsapp-business', name: 'WhatsApp Business', type: 'whatsapp-business', url: '', apiKey: '', status: 'active' },
    { id: 'linkedin', name: 'LinkedIn', type: 'linkedin', url: '', apiKey: '', status: 'active' },
    { id: 'facebook', name: 'Facebook', type: 'facebook', url: '', apiKey: '', status: 'active' },
    { id: 'youtube', name: 'YouTube', type: 'youtube', url: '', apiKey: '', status: 'active' },
    { id: 'gmail', name: 'Gmail', type: 'gmail', url: '', apiKey: '', status: 'active' },
    { id: 'twitter', name: 'Twitter', type: 'twitter', url: '', apiKey: '', status: 'active' },
    { id: 'telegram', name: 'Telegram', type: 'telegram', url: '', apiKey: '', status: 'active' },
    { id: 'tiktok', name: 'TikTok', type: 'tiktok', url: '', apiKey: '', status: 'active' },
    { id: 'snapchat', name: 'Snapchat', type: 'snapchat', url: '', apiKey: '', status: 'active' },
    { id: 'pinterest', name: 'Pinterest', type: 'pinterest', url: '', apiKey: '', status: 'active' },
  ]);
  const [accountPlatforms, setAccountPlatforms] = useState<AccountPlatform[]>([]);
  const [platformAccountPairs, setPlatformAccountPairs] = useState<PlatformAccountPair[]>([]); // New state

  const addAccount = (account: Omit<Account, 'id'>) => {
    const newAccount = {
      ...account,
      id: Math.random().toString(36).substring(2, 9),
      status: account.status || 'active',
    };
    setAccounts([...accounts, newAccount]);
    return newAccount.id;
  };

  const addPlatform = (platform: Omit<Platform, 'id'>) => {
    const newPlatform = {
      ...platform,
      id: Math.random().toString(36).substring(2, 9),
      status: platform.status || 'active',
    };
    setPlatforms([...platforms, newPlatform]);
    return newPlatform.id;
  };
  
  const linkAccountPlatform = (accountId: string, platformId: string) => {
    // Check if the link already exists
    const exists = accountPlatforms.some(
      link => link.accountId === accountId && link.platformId === platformId
    );
    
    if (!exists) {
      setAccountPlatforms([...accountPlatforms, { accountId, platformId }]);
    }
  };
  
  const getAccountPlatforms = (accountId: string): Platform[] => {
    const links = accountPlatforms.filter(link => link.accountId === accountId);
    return links.map(link => platforms.find(p => p.id === link.platformId)!).filter(Boolean);
  };
  
  const getPlatformAccounts = (platformId: string): Account[] => {
    const links = accountPlatforms.filter(link => link.platformId === platformId);
    return links.map(link => accounts.find(a => a.id === link.accountId)!).filter(Boolean);
  };

  // Delete an account and its links
  const deleteAccount = (accountId: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== accountId));
    setAccountPlatforms(prev => prev.filter(link => link.accountId !== accountId));
  };

  // Delete only the link between an account and a platform
  const deleteAccountFromPlatform = (accountId: string, platformId: string) => {
    setAccountPlatforms(prev => prev.filter(link => !(link.accountId === accountId && link.platformId === platformId)));
    // Optionally, remove the account if it is not linked to any platform
    setAccounts(prev => {
      const stillLinked = accountPlatforms.some(link => link.accountId === accountId && link.platformId !== platformId);
      if (!stillLinked) {
        return prev.filter(acc => acc.id !== accountId);
      }
      return prev;
    });
  };

  // New functions for platform-account pairs
  const addPlatformAccountPair = (platformName: string, accountAddress: string, platformType: string) => {
    const newPair: PlatformAccountPair = {
      id: Math.random().toString(36).substring(2, 9),
      platformName,
      accountAddress,
      platformType,
      createdAt: new Date()
    };
    setPlatformAccountPairs(prev => [...prev, newPair]);
  };

  const getPlatformAccountPairs = () => {
    return platformAccountPairs;
  };

  const deletePlatformAccountPair = (id: string) => {
    setPlatformAccountPairs(prev => prev.filter(pair => pair.id !== id));
  };

  const clearPlatformAccountPairs = () => {
    setPlatformAccountPairs([]);
  };

  return (
    <PlatformContext.Provider value={{
      accounts,
      platforms,
      accountPlatforms,
      platformAccountPairs,
      addAccount,
      addPlatform,
      linkAccountPlatform,
      getAccountPlatforms,
      getPlatformAccounts,
      deleteAccount,
      deleteAccountFromPlatform,
      addPlatformAccountPair,
      getPlatformAccountPairs,
      deletePlatformAccountPair,
      clearPlatformAccountPairs
    }}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
}