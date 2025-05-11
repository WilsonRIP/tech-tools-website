import { getAITools, getAIToolById } from '../../lib/strapiService';
import Link from 'next/link';
import { AITool } from '../../lib/types';
import Image from 'next/image';

// Force dynamic to avoid caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TestPage() {
  console.log('Fetching AI tools for test page...');
  const aiTools = await getAITools();
  console.log('Fetched AI tools:', JSON.stringify(aiTools, null, 2));
  
  // Specifically test fetching item with ID 4
  console.log('Directly testing tool with ID 4...');
  const specificTool = await getAIToolById(4);
  console.log('Tool with ID 4:', JSON.stringify(specificTool, null, 2));
  
  // Add fallback data for testing if no tools are returned or only IDs
  const enhancedTools = aiTools.map((tool: AITool) => {
    // If tool only has an ID, create minimal displayable object
    if (Object.keys(tool).length === 1 && tool.id) {
      return {
        id: tool.id,
        name: `Tool #${tool.id}`,
        description: 'This tool has minimal data - only an ID was returned from Strapi',
        category: 'Unknown',
        _dataIssue: true
      } as AITool & { _dataIssue: boolean };
    }
    return tool;
  });
  
  // Helper to process image URLs
  const getImageUrl = (tool: AITool) => {
    if (!tool.imageUrl) return null;
    
    // Handle Strapi media array structure
    if (Array.isArray(tool.imageUrl) && tool.imageUrl.length > 0) {
      const image = tool.imageUrl[0];
      if (!image) return null;
      
      // Get the large format if available, otherwise use the original URL
      const imageUrl = image.formats?.large?.url || 
                       image.formats?.medium?.url || 
                       image.url;
      
      if (!imageUrl) return null;
      
      // If URL is absolute, use it directly
      if (typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
        return imageUrl;
      }
      
      // Otherwise, prefix with Strapi URL
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api';
      // Remove /api from the end if present to avoid double /api in path
      const baseUrl = strapiUrl.endsWith('/api') 
        ? strapiUrl.substring(0, strapiUrl.length - 4) 
        : strapiUrl;
        
      return `${baseUrl}${imageUrl}`;
    }
    
    // Handle case where imageUrl might be a string
    const imageUrlAsString = tool.imageUrl as unknown as string;
    if (typeof imageUrlAsString === 'string') {
      if (imageUrlAsString.startsWith('http')) {
        return imageUrlAsString;
      }
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api';
      const baseUrl = strapiUrl.endsWith('/api') 
        ? strapiUrl.substring(0, strapiUrl.length - 4) 
        : strapiUrl;
      return `${baseUrl}${imageUrlAsString}`;
    }
    
    return null;
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Page: AI Tools</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-lg font-semibold mb-2">Technical Information</h2>
        <p>Strapi URL: {process.env.NEXT_PUBLIC_STRAPI_API_URL || 'Not set'}</p>
        <p>Number of tools fetched: {aiTools.length}</p>
        <p>Raw data has issues: {aiTools.some(tool => Object.keys(tool).length === 1) ? 'Yes' : 'No'}</p>
      </div>
      
      <div className="mb-4 flex space-x-4">
        <Link href="/debug" className="text-blue-500 hover:underline">
          Back to Debug Page
        </Link>
        <Link href="/api/test-direct" className="text-blue-500 hover:underline" target="_blank">
          Run Endpoint Tests
        </Link>
        <Link href="/api/test-collection?id=4&collection=ai-tools" className="text-blue-500 hover:underline" target="_blank">
          Test Tool ID 4
        </Link>
      </div>
      
      {/* Single Tool Debug Section */}
      {specificTool && (
        <div className="mb-8 p-6 bg-white border border-blue-200 rounded shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Tool ID 4 Debug</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-2">{specificTool.name || 'No Name'}</h3>
              <p className="mb-2">{specificTool.description || 'No description'}</p>
              <p className="text-sm text-gray-600 mb-1">ID: {specificTool.id}</p>
              <p className="text-sm text-gray-600 mb-1">Category: {specificTool.category || 'Unknown'}</p>
              <p className="text-sm text-gray-600 mb-1">URL: {specificTool.url || 'None'}</p>
              <p className="text-sm text-gray-600 mb-1">Pricing: {specificTool.pricing || 'Unknown'}</p>
              <p className="text-sm text-gray-600 mb-1">Review Date: {specificTool.ReviewDate || 'None'}</p>
              
              {specificTool.tags && Array.isArray(specificTool.tags) && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {specificTool.tags.map((tag, i) => (
                      <span key={i} className="bg-gray-200 px-2 py-1 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              {getImageUrl(specificTool) ? (
                <div className="relative h-64 w-full rounded overflow-hidden bg-gray-100">
                  <Image
                    src={getImageUrl(specificTool)!}
                    alt={specificTool.name || 'Tool image'}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="h-64 w-full flex items-center justify-center bg-gray-100 rounded border border-gray-300">
                  <p className="text-gray-500">No image available</p>
                </div>
              )}
              
              <div className="mt-3 text-sm text-gray-600">
                <p>Image data structure:</p>
                <pre className="bg-gray-100 p-2 rounded text-xs mt-1 overflow-auto max-h-40">
                  {JSON.stringify(specificTool.imageUrl, null, 2) || 'No image data'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Raw Data Debug Section */}
      <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h2 className="text-lg font-semibold mb-2">Raw Data Debug</h2>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-xs overflow-auto max-h-60">
          {JSON.stringify(aiTools, null, 2)}
        </pre>
      </div>
      
      {enhancedTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enhancedTools.map((tool) => (
            <div key={tool.id} className={`border rounded p-4 shadow-sm ${(tool as any)._dataIssue ? 'bg-red-50' : 'bg-white'}`}>
              <h2 className="text-xl font-bold">{tool.name || 'Unnamed Tool'}</h2>
              <p className="text-sm text-gray-600">ID: {tool.id}</p>
              {(tool as any)._dataIssue && (
                <div className="bg-red-100 text-red-800 p-2 rounded text-sm mb-2">
                  Data issue detected - only ID was returned from Strapi API
                </div>
              )}
              <p>{tool.description || 'No description available'}</p>
              {tool.category && <p className="text-sm mt-2">Category: {tool.category}</p>}
              {tool.tags && tool.tags.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Tags:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tool.tags.map((tag: string, index: number) => (
                      <span key={index} className="bg-gray-200 px-2 py-0.5 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded">
          No AI tools found. Check the console for more details.
        </div>
      )}
    </div>
  );
} 