'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePlatform } from '../../context/PlatformContext';
import { v4 as uuidv4 } from 'uuid';

export default function AddAccountPlatform() {
  const { platforms, addAccount, addPlatform, linkAccountPlatform, addPlatformAccountPair, getPlatformAccountPairs } = usePlatform();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showPlatforms, setShowPlatforms] = useState(true); // Automatically show platforms

  // Platform-account pairs state
  const [platformAccounts, setPlatformAccounts] = useState<{
    [platformId: string]: { id: string; address: string }[]
  }>({});

  // Modal state for adding new platform
  const [showPlatformModal, setShowPlatformModal] = useState(false);

  // Pre-populate with previously saved platform-account pairs
  useEffect(() => {
    const pairs = getPlatformAccountPairs();
    if (!pairs || pairs.length === 0) return;

    // Map platform name -> platform id
    const nameToId = new Map<string, string>();
    platforms.forEach(p => nameToId.set(p.name, p.id));

    const next: { [platformId: string]: { id: string; address: string }[] } = {};
    pairs.forEach(pair => {
      const platformId = nameToId.get(pair.platformName);
      if (!platformId) return;
      if (!next[platformId]) next[platformId] = [];
      // Avoid duplicate addresses in the list
      const exists = next[platformId].some(a => a.address === pair.accountAddress);
      if (!exists) {
        next[platformId].push({ id: uuidv4(), address: pair.accountAddress });
      }
    });

    if (Object.keys(next).length > 0) {
      setPlatformAccounts(next);
      setShowPlatforms(true);
    }
  }, [platforms, getPlatformAccountPairs]);

  // Predefined platform list for the popup
  const predefinedPlatforms = [
    // Social & community
    'Instagram', 'WhatsApp', 'WhatsApp Business', 'Facebook', 'Twitter', 'X', 'Telegram', 'TikTok', 'Snapchat', 'Pinterest', 'Threads', 'Mastodon', 'Bluesky', 'Reddit', 'Quora', 'Twitch', 'YouTube', 'Vimeo', 'Dailymotion',
    // Messaging & collaboration
    'Discord', 'Slack', 'Zoom', 'Skype', 'Microsoft Teams', 'Google Meet', 'Signal', 'WeChat', 'Line', 'Viber',
    // Email
    'Google', 'Gmail', 'Outlook', 'Yahoo Mail', 'iCloud Mail',
    // Productivity & docs
    'Notion', 'Evernote', 'Confluence', 'Jira', 'Asana', 'Trello', 'ClickUp', 'Monday.com',
    // Cloud storage
    'Google Drive', 'OneDrive', 'Dropbox', 'Box', 'iCloud Drive',
    // Dev & knowledge
    'GitHub', 'GitLab', 'Bitbucket', 'Stack Overflow',
    // CMS / publishing
    'WordPress', 'Medium', 'Blogger', 'Ghost', 'Substack',
    // Commerce & CRM
    'Shopify', 'WooCommerce', 'Magento', 'Salesforce', 'HubSpot', 'Zoho CRM',
    // Payments
    'Stripe', 'PayPal', 'Razorpay', 'Square',
    // Marketing & analytics
    'Google Ads', 'Facebook Ads', 'LinkedIn Ads', 'Instagram Ads', 'Google Analytics', 'Mixpanel', 'Amplitude', 'Hotjar', 'Intercom', 'Zendesk', 'Freshdesk', 'ServiceNow',
    // Browsers
    'Chrome', 'Safari', 'Firefox', 'Edge', 'Opera', 'Brave',
    // Media & music
    'Spotify', 'SoundCloud', 'Apple Music'
  ];

  // Filter platforms based on search - show platforms that contain the search query
  const filteredPlatforms = searchQuery.trim() ? platforms.filter(platform =>
    platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    platform.type.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  // Only show WhatsApp platforms when searching for "whatsapp"
  const matchingPredefinedPlatforms = searchQuery.trim() && searchQuery.toLowerCase().includes('whatsapp') ? 
    predefinedPlatforms.filter(platform =>
      platform.toLowerCase().includes('whatsapp')
    ).filter(platformName => {
      // Filter out platforms that are already added
      return !platforms.some(p => p.name === platformName);
    }) : [];



  // Initialize platform with empty accounts if not exists
  const initializePlatform = (platformId: string) => {
    if (!platformAccounts[platformId]) {
      setPlatformAccounts(prev => ({
        ...prev,
        [platformId]: []
      }));
    }
  };

  // Add account to a platform
  const handleAddAccount = (platformId: string) => {
    initializePlatform(platformId);
    setPlatformAccounts(prev => ({
      ...prev,
      [platformId]: [...(prev[platformId] || []), { id: uuidv4(), address: '' }]
    }));
  };

  // Remove account from a platform
  const handleRemoveAccount = (platformId: string, accountId: string) => {
    setPlatformAccounts(prev => ({
      ...prev,
      [platformId]: prev[platformId].filter(acc => acc.id !== accountId)
    }));
  };

  // Update account address
  const handleAccountChange = (platformId: string, accountId: string, address: string) => {
    setPlatformAccounts(prev => ({
      ...prev,
      [platformId]: prev[platformId].map(acc => 
        acc.id === accountId ? { ...acc, address } : acc
      )
    }));
  };

  // Handle search and show platforms
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowPlatforms(true);

      // If the search exactly matches a known platform name and it doesn't exist yet,
      // create it using the full, canonical name.
      const normalizedQuery = searchQuery.toLowerCase().trim();

      // Handle common misspellings to canonical names
      const canonicalMap: { [miss: string]: string } = {
        'whatsappbusiness': 'WhatsApp Business',
        'google drive': 'Google Drive',
        'onedrive': 'OneDrive',
      };
      const mappedName = canonicalMap[normalizedQuery] || null;

      const exactKnownName = mappedName || predefinedPlatforms.find(
        (name) => name.toLowerCase() === normalizedQuery
      );

      if (exactKnownName) {
        const alreadyExists = platforms.some(
          (p) => p.name.toLowerCase() === normalizedQuery
        );

        if (!alreadyExists) {
          const newPlatformId = addPlatform({
            name: exactKnownName,
            type: exactKnownName.toLowerCase().replace(/\s+/g, ''),
            url: '',
            apiKey: ''
          });

          setPlatformAccounts((prev) => ({
            ...prev,
            [newPlatformId]: []
          }));

          setSearchQuery('');
        }
      }
    } else {
      setShowPlatforms(false);
    }
  };

  // Select an existing platform from search results for configuration
  const handleSelectExistingPlatform = (platformId: string) => {
    initializePlatform(platformId);
    setShowPlatforms(true);
  };

  // Handle adding new platform from predefined list
  const handleAddNewPlatform = (platformName: string) => {
    // Generate proper platform type based on the name
    let platformType = platformName.toLowerCase().replace(/\s+/g, '');
    
    // Special handling for WhatsApp platforms
    if (platformName === 'WhatsApp Business') {
      platformType = 'whatsapp-business';
    } else if (platformName === 'WhatsApp') {
      platformType = 'whatsapp';
    }
    
    const newPlatformId = addPlatform({ 
      name: platformName, 
      type: platformType, 
      url: '', 
      apiKey: '' 
    });
    // Initialize platform accounts with the returned ID
    setPlatformAccounts(prev => ({
      ...prev,
      [newPlatformId]: []
    }));
    setShowPlatformModal(false);
    
    // Force re-render of search results to update available platforms
    if (searchQuery.trim()) {
      setShowPlatforms(true);
      // Trigger a small delay to ensure the platform is added before re-rendering
      setTimeout(() => {
        setShowPlatforms(false);
        setShowPlatforms(true);
      }, 100);
    }
  };

  // Save all platform-account pairs
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    for (const [platformId, accounts] of Object.entries(platformAccounts)) {
      const platform = platforms.find(p => p.id === platformId);
      if (platform) {
        for (const account of accounts) {
          if (account.address.trim()) {
            // Save to the new platform-account pairs structure
            addPlatformAccountPair(platform.name, account.address, platform.type);
            
            // Also save to the legacy structure for backward compatibility
            const accountId = addAccount({ 
              name: account.address, 
              type: 'business', 
              email: '', 
              phone: '', 
              status: 'Active' 
            });
            linkAccountPlatform(accountId, platformId);
          }
        }
      }
    }
    
    alert('Platforms and accounts saved successfully! You can now view them on the Set Account & Platform page.');
    
    // Keep the saved platforms visible and allow adding more
    // Don't clear the platformAccounts state - keep them visible
    // User can now add more platforms below the saved ones
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with proper spacing */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Add Account & Platform</h1>
          <p className="text-lg text-gray-600">Manage your platform accounts and configurations</p>
        </header>

        {/* Search Bar with enhanced styling */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search Platforms"
              value={searchQuery}
                                            onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowPlatforms(true); // Always show platforms when typing
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              onBlur={() => handleSearch()} // Auto-search when user clicks away
              className="w-full p-4 border-2 border-blue-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-lg shadow-sm"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <div className="w-px h-8 bg-gray-300 mr-4"></div>
              <svg 
                className="h-6 w-6 text-gray-500 cursor-pointer hover:text-blue-500 transition-colors" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                onClick={handleSearch}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Content Area with proper spacing */}
        <main className="min-h-[600px] mb-12">
          {!showPlatforms && Object.keys(platformAccounts).length === 0 ? (
            /* Empty state with better styling */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[600px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-xl font-medium">No platforms configured yet</p>
                <p className="text-base mt-2">Use the search bar above to find and add platforms</p>
              </div>
            </div>
          ) : (
            /* Platform sections with enhanced styling */
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              {/* Platform Sections */}
              <div className="space-y-10">
                {/* Show platforms that have accounts (saved or being edited) */}
                {Object.keys(platformAccounts).length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-200">
                      Configured Platforms
                    </h2>
                    {Object.entries(platformAccounts).map(([platformId, accounts]) => {
                      const platform = platforms.find(p => p.id === platformId);
                      if (!platform) return null;
                      
                      return (
                        <div key={platformId} className="border-2 border-gray-200 rounded-xl p-6 mb-6 bg-gray-50 hover:border-blue-300 transition-colors">
                          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                            {platform.name}
                          </h3>
                          
                          {/* Account Inputs for this Platform */}
                          <div className="space-y-4">
                            {/* All account inputs and + button on the same horizontal line */}
                            <div className="flex items-center space-x-3 flex-wrap">
                              {/* Show all existing accounts horizontally */}
                              {accounts.map((account) => (
                                <div key={account.id} className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    placeholder="Enter account address"
                                    value={account.address}
                                    onChange={(e) => handleAccountChange(platformId, account.id, e.target.value)}
                                    className="w-48 p-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveAccount(platformId, account.id)}
                                    className="w-10 h-10 bg-red-500 text-white rounded-lg hover:bg-red-600 font-bold text-lg flex items-center justify-center flex-shrink-0 transition-colors shadow-sm"
                                    title="Remove Account"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                              
                              {/* Add Account Button - Always on the same line */}
                              <button
                                type="button"
                                onClick={() => handleAddAccount(platformId)}
                                className="w-10 h-10 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold text-lg flex items-center justify-center flex-shrink-0 transition-colors shadow-sm"
                                title="Add Account"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Search Results Section */}
                {showPlatforms && (
                  <div className="border-t-2 border-gray-200 pt-8">
                    {/* Existing Platforms */}
                    {filteredPlatforms.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Existing Platforms</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredPlatforms.map(platform => {
                            if (platformAccounts[platform.id]) return null;
                            
                            return (
                              <div key={platform.id} className="border-2 border-gray-200 rounded-xl p-4 bg-white hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{platform.name}</h3>
                                <p className="text-sm text-gray-600 mb-3">{platform.type}</p>
                                <button
                                  onClick={() => handleSelectExistingPlatform(platform.id)}
                                  className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                >
                                  Add Platform
                                </button>
                              </div>
                        );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Available Predefined Platforms */}
                    {matchingPredefinedPlatforms.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Available to Add</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {matchingPredefinedPlatforms.map((platformName, index) => {
                            // Check if this platform already exists
                            const alreadyExists = platforms.some(p => p.name === platformName);
                            if (alreadyExists) return null;
                            
                            return (
                              <div key={`${platformName}-${index}`} className="border-2 border-gray-200 rounded-xl p-4 bg-green-50 hover:border-green-300 hover:shadow-md transition-all cursor-pointer">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{platformName}</h3>
                                <p className="text-sm text-gray-600 mb-3">New Platform</p>
                                <button
                                  onClick={() => handleAddNewPlatform(platformName)}
                                  className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                                >
                                  Add New Platform
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Platform Selection Modal with better styling */}
        {showPlatformModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">Add New Platform</h3>
                <p className="text-gray-600 mt-2">Select a platform to add to your configuration</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
                  {predefinedPlatforms.map(platform => (
                    <button
                      key={platform}
                      onClick={() => handleAddNewPlatform(platform)}
                      className="p-4 border-2 border-gray-200 text-gray-800 rounded-xl hover:border-blue-400 hover:bg-blue-50 text-left transition-all hover:shadow-sm"
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end p-6 border-t border-gray-200 space-x-3">
                <button 
                  onClick={() => setShowPlatformModal(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons with enhanced styling */}
        <div className="flex justify-between items-center pt-8 border-t-2 border-gray-200">
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setShowPlatformModal(true)}
              className="px-8 py-4 border-2 border-blue-400 text-blue-700 rounded-xl hover:bg-blue-50 transition-all font-semibold text-lg shadow-sm hover:shadow-md"
            >
              Add Platform
            </button>
            
            <Link
              href="/admin/set-account-platform"
              className="px-8 py-4 border-2 border-green-400 text-blue-600 bg-white rounded-xl hover:bg-green-50 transition-all font-semibold text-lg shadow-sm hover:shadow-md"
            >
              View Set Account & Platform
            </Link>
          </div>
          
          <button 
            type="button" 
            onClick={handleSubmit}
            className="px-8 py-4 border-2 border-blue-400 text-blue-700 rounded-xl hover:bg-blue-50 transition-all font-semibold text-lg shadow-sm hover:shadow-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}