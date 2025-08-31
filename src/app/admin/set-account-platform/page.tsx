'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePlatform } from '../../context/PlatformContext';

type PlatformAccountPair = {
  id: string;
  platformName: string;
  accountAddress: string;
  platformType: string;
  createdAt: Date;
};

type GroupedPlatformData = {
  platformType: string;
  platformName: string;
  accountAddresses: string[];
};

type SelectedAccount = {
  [platformType: string]: string;
};

export default function SetAccountPlatform() {
  const { getPlatformAccountPairs } = usePlatform();
  const [savedPairs, setSavedPairs] = useState<PlatformAccountPair[]>([]);
  const [groupedData, setGroupedData] = useState<GroupedPlatformData[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<SelectedAccount>({});

  // Load saved platform-account pairs on component mount
  useEffect(() => {
    loadSavedData();
  }, [getPlatformAccountPairs]);

  const loadSavedData = () => {
    const pairs = getPlatformAccountPairs();
    setSavedPairs(pairs);
    
    // Group the data by platform type and name
    const grouped = groupDataByPlatform(pairs);
    setGroupedData(grouped);
    
    // Initialize selected accounts with empty selection
    const initialSelections: SelectedAccount = {};
    grouped.forEach(group => {
      initialSelections[group.platformName] = '';
    });
    setSelectedAccounts(initialSelections);
  };

  const groupDataByPlatform = (pairs: PlatformAccountPair[]): GroupedPlatformData[] => {
    const groupedMap = new Map<string, GroupedPlatformData>();
    
    pairs.forEach(pair => {
      // Group by platform name to show all account addresses for each platform
      const platformKey = pair.platformName;
      
      if (!groupedMap.has(platformKey)) {
        groupedMap.set(platformKey, {
          platformType: pair.platformType,
          platformName: pair.platformName,
          accountAddresses: []
        });
      }
      
      const group = groupedMap.get(platformKey)!;
      // Add all account addresses for this platform
      if (!group.accountAddresses.includes(pair.accountAddress)) {
        group.accountAddresses.push(pair.accountAddress);
      }
    });
    
    return Array.from(groupedMap.values());
  };

  const getPlatformLabel = (platformType: string) => {
    const platformMap: { [key: string]: string } = {
      'instagram': 'Instagram',
      'whatsapp-business': 'WhatsApp Business',
      'whatsapp': 'WhatsApp',
      'linkedin': 'LinkedIn',
      'facebook': 'Facebook',
      'youtube': 'YouTube',
      'gmail': 'Gmail',
      'twitter': 'Twitter',
      'telegram': 'Telegram',
      'tiktok': 'TikTok',
      'snapchat': 'Snapchat',
      'pinterest': 'Pinterest'
    };
    return platformMap[platformType] || platformType;
  };

  const handleAccountSelection = (platformName: string, accountAddress: string) => {
    setSelectedAccounts(prev => ({
      ...prev,
      [platformName]: accountAddress
    }));
  };

  const getSelectedAccountForPlatform = (platformName: string) => {
    return selectedAccounts[platformName] || '';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Set Account & Platform</h1>
          <p className="text-gray-700 mt-2">ACCOUNT & PLATFORM</p>
          {savedPairs.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center">
                <p className="text-green-800 font-medium">
                  ✓ {savedPairs.length} account(s) across {groupedData.length} platform(s) loaded from Admin Add Account & Platform
                </p>
                <button
                  type="button"
                  onClick={loadSavedData}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="bg-white p-6 rounded-lg shadow-md">
          {groupedData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Platform Data Available</h3>
              <p className="text-gray-500 mb-6">
                No platforms and accounts have been added yet. Please add them from the Admin Add Account & Platform page.
              </p>
              <Link
                href="/admin/add-account-platform"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
              >
                Go to Add Account & Platform
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedData.map((group, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-blue-600 capitalize mb-4">
                      {getPlatformLabel(group.platformType)} Platform
                      <span className="ml-2 text-sm text-gray-500 font-normal">
                        ({group.accountAddresses.length} account{group.accountAddresses.length !== 1 ? 's' : ''})
                      </span>
                    </h3>
                    
                    {/* Account Selection Dropdown - Single Box */}
                    <div className="w-full max-w-2xl">
                      <label className="block text-sm font-medium text-blue-600 mb-2">
                        Select Account Address
                      </label>
                      <div className="relative">
                        <select
                          value={getSelectedAccountForPlatform(group.platformName)}
                          onChange={(e) => handleAccountSelection(group.platformName, e.target.value)}
                          className="w-full p-3 border-2 border-blue-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                        >
                          <option value="">Select Address</option>
                          {group.accountAddresses.map((address, addressIndex) => (
                            <option key={addressIndex} value={address}>
                              {address}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Show Selected Account */}
                      {getSelectedAccountForPlatform(group.platformName) && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-sm text-blue-800">
                            <strong>Selected:</strong> {getSelectedAccountForPlatform(group.platformName)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div className="flex space-x-4">
              <Link
                href="/"
                className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
              >
                Back to Home
              </Link>
              <Link
                href="/admin/view-account-platform"
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
              >
                View All
              </Link>
            </div>
            
            <div className="flex space-x-4">
              <Link
                href="/admin/add-account-platform"
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
              >
                Add More Platforms
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}