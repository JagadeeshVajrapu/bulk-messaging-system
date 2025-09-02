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
  const [connectingPlatforms, setConnectingPlatforms] = useState<Set<string>>(new Set());

  // Load saved platform-account pairs on component mount
  useEffect(() => {
    loadSavedData();
    // Auto-login to previously connected platforms
    handleAutoLoginOnPageLoad();
  }, [getPlatformAccountPairs]);

  const handleAutoLoginOnPageLoad = () => {
    // Get all saved connections from localStorage
    const savedSelections = localStorage.getItem('selectedPlatformAccounts');
    if (savedSelections) {
      const selections = JSON.parse(savedSelections);
      
      // Auto-login to each connected platform
      Object.entries(selections).forEach(([platformName, accountAddress]) => {
        if (accountAddress && typeof accountAddress === 'string') {
          const isConnected = isPlatformConnected(platformName);
          if (!isConnected) {
            console.log(`🔄 Auto-login to ${platformName} with account: ${accountAddress}`);
            handleAutoLogin(platformName, accountAddress);
          }
        }
      });
    }
  };

  const loadSavedData = () => {
    const pairs = getPlatformAccountPairs();
    setSavedPairs(pairs);
    
    // Group the data by platform type and name
    const grouped = groupDataByPlatform(pairs);
    setGroupedData(grouped);
    
    // Load saved selections from localStorage
    const savedSelections = localStorage.getItem('selectedPlatformAccounts');
    const initialSelections: SelectedAccount = savedSelections ? JSON.parse(savedSelections) : {};
    
    // Initialize with saved selections or empty for new platforms
    grouped.forEach(group => {
      if (!initialSelections[group.platformName]) {
        initialSelections[group.platformName] = '';
      }
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
    const newSelections = {
      ...selectedAccounts,
      [platformName]: accountAddress
    };
    setSelectedAccounts(newSelections);
    
    // Save to localStorage for automatic registration
    localStorage.setItem('selectedPlatformAccounts', JSON.stringify(newSelections));
    
    // Also save the registration status
    const registrationData = {
      platformName,
      accountAddress,
      registeredAt: new Date().toISOString(),
      isRegistered: true
    };
    localStorage.setItem(`platformRegistration_${platformName}`, JSON.stringify(registrationData));
    
    // Automatically connect to the selected account
    handleAutoLogin(platformName, accountAddress);
  };

  const handleAutoLogin = async (platformName: string, accountAddress: string) => {
    try {
      // Show loading state
      setConnectingPlatforms(prev => new Set(prev).add(platformName));
      console.log(`🔄 Connecting to ${platformName} with account: ${accountAddress}`);
      
      // Simulate connection process (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update connection status
      const connectionData = {
        platformName,
        accountAddress,
        connectedAt: new Date().toISOString(),
        isConnected: true,
        status: 'connected'
      };
      localStorage.setItem(`platformConnection_${platformName}`, JSON.stringify(connectionData));
      
      // Remove loading state
      setConnectingPlatforms(prev => {
        const newSet = new Set(prev);
        newSet.delete(platformName);
        return newSet;
      });
      
      // Show success message
      alert(`✅ Successfully connected to ${platformName} with account: ${accountAddress}`);
      
      console.log(`✅ Connected to ${platformName} successfully!`);
      
    } catch (error) {
      // Remove loading state on error
      setConnectingPlatforms(prev => {
      const newSet = new Set(prev);
        newSet.delete(platformName);
      return newSet;
    });
      
      console.error(`❌ Failed to connect to ${platformName}:`, error);
      alert(`❌ Failed to connect to ${platformName}. Please try again.`);
    }
  };

  const getSelectedAccountForPlatform = (platformName: string) => {
    return selectedAccounts[platformName] || '';
  };

  const isPlatformRegistered = (platformName: string) => {
    const registrationData = localStorage.getItem(`platformRegistration_${platformName}`);
    return registrationData ? JSON.parse(registrationData).isRegistered : false;
  };

  const isPlatformConnected = (platformName: string) => {
    const connectionData = localStorage.getItem(`platformConnection_${platformName}`);
    return connectionData ? JSON.parse(connectionData).isConnected : false;
  };

  const getConnectedAccountForPlatform = (platformName: string) => {
    const connectionData = localStorage.getItem(`platformConnection_${platformName}`);
    if (connectionData) {
      const data = JSON.parse(connectionData);
      return data.isConnected ? data.accountAddress : null;
    }
    return null;
  };

  const getAllConnectedAccounts = () => {
    const connectedAccounts: { [platformName: string]: string } = {};
    const savedSelections = localStorage.getItem('selectedPlatformAccounts');
    
    if (savedSelections) {
      const selections = JSON.parse(savedSelections);
      Object.entries(selections).forEach(([platformName, accountAddress]) => {
        if (accountAddress && typeof accountAddress === 'string' && isPlatformConnected(platformName)) {
          connectedAccounts[platformName] = accountAddress;
        }
      });
    }
    
    return connectedAccounts;
  };

  const handleDataExtraction = async (platformName: string) => {
    const connectedAccount = getConnectedAccountForPlatform(platformName);
    
    if (!connectedAccount) {
      alert(`❌ No connected account found for ${platformName}. Please connect an account first.`);
      return;
    }

    try {
      console.log(`🔄 Starting data extraction for ${platformName} using account: ${connectedAccount}`);
      
      // Simulate data extraction process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log(`✅ Data extraction completed for ${platformName}`);
      alert(`✅ Data extraction completed for ${platformName} using account: ${connectedAccount}`);
      
    } catch (error) {
      console.error(`❌ Data extraction failed for ${platformName}:`, error);
      alert(`❌ Data extraction failed for ${platformName}. Please try again.`);
    }
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
            <>
              {/* Connection Summary */}
              {(() => {
                const connectedAccounts = getAllConnectedAccounts();
                const connectedCount = Object.keys(connectedAccounts).length;
                
                if (connectedCount > 0) {
                  return (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-800 mb-3">
                        🔗 Connected Accounts ({connectedCount})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(connectedAccounts).map(([platformName, accountAddress]) => (
                          <div key={platformName} className="p-3 bg-white border border-green-300 rounded-md">
                            <p className="text-sm font-medium text-green-800">{platformName}</p>
                            <p className="text-xs text-green-600">{accountAddress}</p>
                            <p className="text-xs text-green-500 mt-1">✅ Ready for Data Extraction</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
              
                            {/* Platform Sections */}
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
                  
                        {/* Show Selected Account and Connection Status */}
                        {getSelectedAccountForPlatform(group.platformName) && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-800">
                              <strong>Selected:</strong> {getSelectedAccountForPlatform(group.platformName)}
                            </p>
                            
                            {/* Loading State */}
                            {connectingPlatforms.has(group.platformName) && (
                              <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded">
                                <p className="text-xs text-yellow-800">
                                  🔄 <strong>Connecting...</strong> - Please wait while we connect to your account
                                </p>
                              </div>
                            )}
                            
                            {/* Connection Status */}
                            {isPlatformConnected(group.platformName) && !connectingPlatforms.has(group.platformName) && (
                              <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded">
                                <p className="text-xs text-green-800">
                                  ✅ <strong>Connected</strong> - Successfully logged in to your account
                                </p>
                              </div>
                            )}
                            
                            {/* Registration Status */}
                            {isPlatformRegistered(group.platformName) && !isPlatformConnected(group.platformName) && !connectingPlatforms.has(group.platformName) && (
                              <div className="mt-2 p-2 bg-blue-100 border border-blue-300 rounded">
                                <p className="text-xs text-blue-800">
                                  📝 <strong>Registered</strong> - Will auto-login on next session
                                </p>
                          </div>
                            )}
                            
                            {/* Data Extraction Button for Connected Platforms */}
                            {isPlatformConnected(group.platformName) && (
                              <div className="mt-3">
                                <button
                                  onClick={() => handleDataExtraction(group.platformName)}
                                  className="w-full py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium text-sm"
                                >
                                  🔍 Extract Data using {getConnectedAccountForPlatform(group.platformName)}
                                </button>
                            </div>
                            )}
                          </div>
                        )}
                        </div>
                    </div>
                </div>
              ))}
            </div>
            </>
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