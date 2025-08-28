'use client';

import React from 'react';
import Link from 'next/link';
import { usePlatform } from '../../context/PlatformContext';

export default function ViewAccountPlatform() {
  const { platforms, getPlatformAccounts } = usePlatform();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with bottom border */}
        <header className="mb-8 pb-6 border-b-2 border-gray-300">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">View Accounts & Platforms</h1>
          <p className="text-gray-700 text-lg">View all your registered platforms and their associated accounts</p>
        </header>

        {/* Main Content with enhanced borders */}
        <main className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          {/* Platforms & Accounts Section with top border */}
          <div className="mb-8 pt-6 border-t-2 border-gray-200">
            <h3 className="text-xl font-semibold mb-6 pb-3 border-b-2 border-blue-300 text-gray-900">Platforms & Accounts</h3>
            
            {platforms.length === 0 ? (
              <div className="text-gray-500 py-12 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <p className="text-xl mb-2">No platforms added yet.</p>
                <p className="text-base">Add a platform from the Add Account & Platform page.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {platforms.map((platform) => (
                  <div key={platform.id} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                    {/* Platform header with bottom border */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">
                      <h4 className="text-lg font-semibold text-gray-900">{platform.name}</h4>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full border border-blue-200">
                        {platform.type}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Account count with border */}
                      <div className="flex items-center p-3 bg-white border border-gray-200 rounded-md">
                        <span className="text-sm font-medium text-gray-700 mr-3">Accounts:</span>
                        <span className="text-sm text-gray-600">
                          {getPlatformAccounts(platform.id).length === 0 ? (
                            <span className="text-gray-400 italic">No accounts</span>
                          ) : (
                            <span className="text-blue-600 font-medium">
                              {getPlatformAccounts(platform.id).length} account(s)
                            </span>
                          )}
                        </span>
                      </div>
                      
                      {/* Account list with enhanced borders */}
                      {getPlatformAccounts(platform.id).length > 0 && (
                        <div className="bg-white border-2 border-gray-200 rounded-md p-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-3 pb-2 border-b border-gray-200">Account Details:</h5>
                          <ul className="space-y-2">
                            {getPlatformAccounts(platform.id).map(account => (
                              <li key={account.id} className="text-sm text-gray-800 flex items-center p-2 bg-gray-50 rounded border border-gray-100">
                                <span className="w-3 h-3 bg-green-400 rounded-full mr-3 border border-green-500"></span>
                                {account.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons with top border */}
          <div className="flex justify-end space-x-4 pt-6 border-t-2 border-gray-200">
            <Link href="/" className="px-6 py-3 bg-pink-300 border-2 border-pink-400 rounded-md text-gray-900 font-bold hover:bg-pink-400 hover:text-white transition-all duration-200 hover:shadow-md">
              Back to Home
            </Link>
            <Link 
              href="/admin/set-account-platform" 
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border-2 border-blue-700 hover:shadow-md transition-all duration-200"
            >
              Configure Accounts & Platforms
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}