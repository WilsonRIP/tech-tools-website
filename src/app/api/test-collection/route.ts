import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get the URL from the URL search params
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get('collection') || 'ai-tools';
    const id = searchParams.get('id') || null;
    
    // Base URL for Strapi
    const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api';
    // Strip /api if it exists
    const baseUrl = STRAPI_API_URL.endsWith('/api') 
      ? STRAPI_API_URL.substring(0, STRAPI_API_URL.length - 4) 
      : STRAPI_API_URL;
    
    // Construct endpoint URL
    let apiUrl = `${baseUrl}/api/${collection}`;
    if (id) {
      apiUrl += `/${id}`;
    }
    apiUrl += '?populate=*';
    
    console.log('Testing Strapi collection at:', apiUrl);
    
    // Make the request
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      // Try alternative URL if the first one fails
      console.log('First URL failed, trying alternative pattern');
      
      // Try a URL without /api prefix if it might be in the baseUrl already
      const alternativeUrl = `${baseUrl}/${collection}${id ? `/${id}` : ''}?populate=*`;
      console.log('Trying alternative URL:', alternativeUrl);
      
      try {
        const altResponse = await fetch(alternativeUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
          next: { revalidate: 0 }
        });
        
        if (altResponse.ok) {
          const altData = await altResponse.json();
          return NextResponse.json({
            success: true,
            url: alternativeUrl,
            note: 'Used alternative URL structure',
            collection,
            data: altData,
            dataStructure: detectDataStructure(altData)
          });
        } else {
          console.log('Alternative URL also failed');
        }
      } catch (altError) {
        console.error('Error with alternative URL:', altError);
      }
      
      return NextResponse.json({
        success: false,
        error: `Strapi API error: ${response.status} ${response.statusText}`,
        url: apiUrl,
        collection,
        alternativeTriedUrl: `${baseUrl}/${collection}${id ? `/${id}` : ''}?populate=*`
      }, { status: response.status });
    }
    
    // Parse the data
    const data = await response.json();
    
    // Check if data exists and if it's properly formed
    const hasId = data.data?.[0]?.id !== undefined || data.data?.id !== undefined;
    const hasAttributes = data.data?.[0]?.attributes !== undefined || data.data?.attributes !== undefined;
    
    return NextResponse.json({
      success: true,
      url: apiUrl,
      collection,
      data,
      hasId,
      hasAttributes,
      dataStructure: detectDataStructure(data)
    });
  } catch (error) {
    console.error('Collection test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper to analyze the data structure
function detectDataStructure(data: any) {
  if (!data) return 'Empty data';
  
  const result = {
    hasDataWrapper: data.data !== undefined,
    isArray: Array.isArray(data.data),
    isEmpty: data.data === null || (Array.isArray(data.data) && data.data.length === 0),
    itemCount: Array.isArray(data.data) ? data.data.length : (data.data ? 1 : 0),
    hasMeta: data.meta !== undefined,
    hasError: data.error !== undefined
  };
  
  // Check the structure of the first item if it exists
  if (result.itemCount > 0) {
    const firstItem = Array.isArray(data.data) ? data.data[0] : data.data;
    result['firstItemKeys'] = Object.keys(firstItem);
    result['hasAttributes'] = firstItem.attributes !== undefined;
    
    if (result['hasAttributes']) {
      result['attributeKeys'] = Object.keys(firstItem.attributes);
    }
  }
  
  return result;
} 