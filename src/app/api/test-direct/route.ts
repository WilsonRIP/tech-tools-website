import { NextResponse } from 'next/server';

export async function GET() {
  // Try different variations of the URL to see what works
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api';
  
  // Remove trailing /api if present to prevent double /api
  const strapiBaseUrl = baseUrl.endsWith('/api') 
    ? baseUrl.substring(0, baseUrl.length - 4) 
    : baseUrl;
  
  // Test different possible endpoint structures
  const endpoints = [
    `${strapiBaseUrl}/api/ai-tools?populate=*`,
    `${strapiBaseUrl}/api/ai-tools/4?populate=*`,
    `${baseUrl}/ai-tools?populate=*`,
    `${baseUrl}/ai-tools/4?populate=*`
  ];

  const results = [];

  for (const url of endpoints) {
    try {
      console.log(`Testing endpoint: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      
      const status = response.status;
      const statusText = response.statusText;
      
      let data = null;
      try {
        if (response.ok) {
          data = await response.json();
        }
      } catch (e) {
        console.error(`Error parsing JSON from ${url}:`, e);
      }
      
      results.push({
        url,
        status,
        statusText,
        success: response.ok,
        data: data ? (data.data ? data.data : data) : null
      });
      
    } catch (error) {
      console.error(`Error testing ${url}:`, error);
      results.push({
        url,
        success: false,
        error: error.message
      });
    }
  }
  
  // Also try a direct call to root API to inspect available endpoints
  try {
    const apiInfoUrl = `${strapiBaseUrl}/api`;
    const infoResponse = await fetch(apiInfoUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (infoResponse.ok) {
      const apiInfo = await infoResponse.json();
      results.push({
        url: apiInfoUrl,
        status: infoResponse.status,
        success: true,
        data: apiInfo
      });
    }
  } catch (error) {
    console.error('Error fetching API info:', error);
  }
  
  return NextResponse.json({
    endpoints_tested: results,
    strapi_base_url: strapiBaseUrl,
    strapi_api_url: baseUrl
  });
} 