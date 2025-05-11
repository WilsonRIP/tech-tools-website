import { NextResponse } from 'next/server';

export async function GET() {
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
  
  try {
    // Ensure URL format is correct - avoid double api prefixes
    const aiToolsUrl = `${STRAPI_API_URL}/api/ai-tools?populate=*`;
    console.log('Fetching AI tools from:', aiToolsUrl);
    
    // Test AI tools endpoint
    const aiToolsResponse = await fetch(aiToolsUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      next: { revalidate: 0 },
    });
    
    if (!aiToolsResponse.ok) {
      throw new Error(`Strapi AI tools error: ${aiToolsResponse.status} ${aiToolsResponse.statusText}`);
    }
    
    const aiToolsData = await aiToolsResponse.json();
    
    // Test smartphone reviews endpoint
    const smartphoneUrl = `${STRAPI_API_URL}/api/smartphone-reviews?populate=*`;
    console.log('Fetching smartphone reviews from:', smartphoneUrl);
    
    const smartphoneResponse = await fetch(smartphoneUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      next: { revalidate: 0 },
    });
    
    if (!smartphoneResponse.ok) {
      throw new Error(`Strapi smartphone error: ${smartphoneResponse.status} ${smartphoneResponse.statusText}`);
    }
    
    const smartphoneData = await smartphoneResponse.json();
    
    // Return both datasets for debugging
    return NextResponse.json({
      success: true,
      aiTools: {
        apiUrl: aiToolsUrl,
        data: aiToolsData,
        hasData: aiToolsData.data && aiToolsData.data.length > 0,
        dataCount: aiToolsData.data ? aiToolsData.data.length : 0
      },
      smartphones: {
        apiUrl: smartphoneUrl,
        data: smartphoneData,
        hasData: smartphoneData.data && smartphoneData.data.length > 0,
        dataCount: smartphoneData.data ? smartphoneData.data.length : 0
      },
      strapi_url: STRAPI_API_URL
    });
  } catch (error) {
    console.error('Test route error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      strapi_url: STRAPI_API_URL
    }, { status: 500 });
  }
} 