'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DebugPage() {
  const [apiTest, setApiTest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [strapiUrl, setStrapiUrl] = useState<string>('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/test-strapi');
        const data = await response.json();
        setApiTest(data);
        const apiUrl = data.strapi_url || process.env.NEXT_PUBLIC_STRAPI_API_URL || 'Not set';
        setStrapiUrl(apiUrl);
        console.log('Debug: Setting Strapi URL to:', apiUrl);
      } catch (err) {
        console.error('Error testing Strapi connection:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    testConnection();
  }, []);

  const directApiTest = async () => {
    try {
      setIsLoading(true);
      const url = `${strapiUrl}/ai-tools?populate=*`;
      console.log('Testing direct fetch from:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`Direct API call failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      alert('Direct API test successful! Check console for details.');
      console.log('Direct API response:', data);
    } catch (err) {
      console.error('Direct API test failed:', err);
      alert(`Direct API test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkCollections = async () => {
    try {
      setIsLoading(true);
      const baseUrl = strapiUrl.endsWith('/api') 
        ? strapiUrl.substring(0, strapiUrl.length - 4) 
        : strapiUrl;
        
      const rootApiUrl = `${baseUrl}/api`;
      console.log('Checking available collections at:', rootApiUrl);
      
      const response = await fetch(rootApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`API root call failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      alert('Collection check successful! Check console for details.');
      console.log('Available collections:', data);
      
      const testUrls = [
        `${baseUrl}/api/ai-tools`,
        `${baseUrl}/api/ai-tool`,
        `${strapiUrl}/ai-tools`,
        `${strapiUrl}/ai-tool`
      ];
      
      console.log('Testing alternative endpoint structures:');
      for (const testUrl of testUrls) {
        try {
          console.log(`Trying: ${testUrl}`);
          const testResp = await fetch(`${testUrl}?populate=*`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          });
          
          console.log(`${testUrl}: ${testResp.status} ${testResp.statusText}`);
          if (testResp.ok) {
            const testData = await testResp.json();
            console.log(`Success with ${testUrl}:`, testData);
          }
        } catch (e) {
          console.error(`Error with ${testUrl}:`, e);
        }
      }
      
    } catch (err) {
      console.error('Collection check failed:', err);
      alert(`Collection check failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Strapi Debug Page</h1>
      
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Configuration</h2>
        <p className="mb-2">Strapi URL: <span className="font-mono">{strapiUrl || 'Not set'}</span></p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Note: Your NEXT_PUBLIC_STRAPI_API_URL should be set in .env.local or environment variables
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <button 
          onClick={directApiTest}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Test Direct API Connection
        </button>
        
        <button 
          onClick={checkCollections}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ml-4"
        >
          Check Available Collections
        </button>
        
        <Link 
          href="/api/test-strapi" 
          target="_blank"
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors inline-block ml-4"
        >
          View API Test Route
        </Link>

        <Link 
          href="/api/test-direct" 
          target="_blank"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors inline-block ml-4"
        >
          Test Direct Connection
        </Link>
      </div>

      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading test results...</p>
      ) : error ? (
        <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      ) : apiTest ? (
        <div className="space-y-6">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">API Test Results</h2>
            <p className="mb-2">Status: {apiTest.success ? '✅ Success' : '❌ Failed'}</p>
            
            {apiTest.success && (
              <>
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-1">AI Tools</h3>
                  <p>API URL: <span className="font-mono">{apiTest.aiTools.apiUrl}</span></p>
                  <p>Has Data: {apiTest.aiTools.hasData ? 'Yes' : 'No'}</p>
                  <p>Count: {apiTest.aiTools.dataCount}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-1">Smartphones</h3>
                  <p>API URL: <span className="font-mono">{apiTest.smartphones.apiUrl}</span></p>
                  <p>Has Data: {apiTest.smartphones.hasData ? 'Yes' : 'No'}</p>
                  <p>Count: {apiTest.smartphones.dataCount}</p>
                </div>
              </>
            )}
            
            {!apiTest.success && apiTest.error && (
              <p className="text-red-600 dark:text-red-400">{apiTest.error}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/ai-tools" className="p-4 bg-indigo-100 dark:bg-indigo-900 rounded-lg hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium mb-2">Go to AI Tools Page</h3>
              <p>Check if the AI Tools are now displaying correctly</p>
            </Link>
            
            <Link href="/smartphone-tech" className="p-4 bg-indigo-100 dark:bg-indigo-900 rounded-lg hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium mb-2">Go to Smartphone Tech Page</h3>
              <p>Check if the Smartphone Reviews are now displaying correctly</p>
            </Link>

            <Link href="/test-page" className="p-4 bg-green-100 dark:bg-green-900 rounded-lg hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium mb-2">View Test Page</h3>
              <p>A simple test page that directly uses the strapiService</p>
            </Link>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Test Collections Directly</h3>
            <div className="flex flex-wrap gap-2">
              <Link 
                href="/api/test-collection?collection=ai-tools" 
                target="_blank"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Test ai-tools
              </Link>
              <Link 
                href="/api/test-collection?collection=ai-tool" 
                target="_blank"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Test ai-tool (singular)
              </Link>
              <Link 
                href="/api/test-collection?collection=smartphone-reviews" 
                target="_blank"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Test smartphone-reviews
              </Link>
              <Link 
                href="/api/test-collection" 
                target="_blank"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Test Default
              </Link>
            </div>
            <div className="mt-2">
              <Link 
                href="/api/test-collection?id=4&collection=ai-tools" 
                target="_blank"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Test ai-tools ID=4
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
} 