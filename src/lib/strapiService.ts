import type { AITool, SmartphoneReview } from './types'; // Assuming types.ts is in the same lib folder

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

// Helper to transform Strapi data (id + attributes) for an array of items
function transformStrapiData<T>(item: any): T {
  // Handle case where we only get an ID
  if (!item || typeof item !== 'object') {
    console.warn('Invalid item data:', item);
    return { id: item?.id || 'unknown' } as T;
  }
  
  if (!item.attributes && Object.keys(item).length === 1 && item.id) {
    console.warn('Item has only ID without attributes:', item);
    return { id: item.id } as T;
  }
  
  if (!item.attributes) {
    console.warn('Missing attributes in Strapi data:', item);
    // If item has fields that match our expected interface structure, use them directly
    // This handles cases where Strapi might return data without the attributes wrapper
    const potentialDirectData = { id: item.id, ...item };
    delete potentialDirectData.id; // Remove id to check for other properties
    
    if (Object.keys(potentialDirectData).length > 0) {
      console.log('Using direct data without attributes wrapper:', potentialDirectData);
      return { id: item.id, ...item } as T;
    }
    
    return { id: item.id } as T;
  }
  
  // Handle nested fields like imageUrl for proper data transformation
  const attributes = { ...item.attributes };
  
  // If there's a nested field that needs special handling
  if (attributes.imageUrl && attributes.imageUrl.data) {
    if (Array.isArray(attributes.imageUrl.data)) {
      attributes.imageUrl = attributes.imageUrl.data.map((img: any) => ({
        id: img.id,
        ...img.attributes
      }));
    } else if (attributes.imageUrl.data) {
      attributes.imageUrl = {
        id: attributes.imageUrl.data.id,
        ...attributes.imageUrl.data.attributes
      };
    }
  }
  
  // Log the transformation for debugging
  console.log(`Transformed item ${item.id}:`, { id: item.id, ...attributes });
  
  return {
    id: item.id,
    ...attributes,
  } as T;
}

// Helper to transform Strapi data (id + attributes) for a single item
function transformSingleStrapiData<T>(item: any): T {
  if (!item) return null as T; // Handle cases where item might be null (e.g., not found)
  
  // Handle case where we only get an ID
  if (Object.keys(item).length === 1 && item.id) {
    console.warn('Item has only ID without attributes in single item fetch:', item);
    return { id: item.id } as T;
  }
  
  if (!item.attributes) {
    console.warn('Missing attributes in Strapi single data:', item);
    // If item has fields that match our expected interface structure, use them directly
    // This handles cases where Strapi might return data without the attributes wrapper
    const potentialDirectData = { ...item };
    delete potentialDirectData.id; // Remove id to check for other properties
    
    if (Object.keys(potentialDirectData).length > 0) {
      console.log('Using direct data without attributes wrapper for single item:', potentialDirectData);
      return { id: item.id, ...item } as T;
    }
    
    return { id: item.id } as T;
  }
  
  // Handle nested fields like imageUrl for proper data transformation
  const attributes = { ...item.attributes };
  
  // If there's a nested field that needs special handling
  if (attributes.imageUrl && attributes.imageUrl.data) {
    if (Array.isArray(attributes.imageUrl.data)) {
      attributes.imageUrl = attributes.imageUrl.data.map((img: any) => ({
        id: img.id,
        ...img.attributes
      }));
    } else if (attributes.imageUrl.data) {
      attributes.imageUrl = {
        id: attributes.imageUrl.data.id,
        ...attributes.imageUrl.data.attributes
      };
    }
  }
  
  // Log the transformation for debugging
  console.log(`Transformed single item ${item.id}:`, { id: item.id, ...attributes });
  
  return {
    id: item.id,
    ...attributes,
  } as T;
}

interface StrapiMultiResponse<T> {
  data: Array<{ id: number | string; attributes: Omit<T, 'id'> }>;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiSingleResponse<T> {
  data: { id: number | string; attributes: Omit<T, 'id'> } | null; // Data can be null if not found
  meta?: object; // Meta for single response might differ or not be present
}

async function fetchFromStrapi<T>(endpoint: string, queryParams: string = ''): Promise<T[]> {
  if (!STRAPI_API_URL) {
    console.error('Strapi API URL is not configured. Please set NEXT_PUBLIC_STRAPI_API_URL in your .env.local file.');
    return [];
  }

  // Check if STRAPI_API_URL already ends with /api or already includes api in path
  // Ensure we're using /api/ prefix for Strapi endpoints but avoid double api
  let apiEndpoint;
  if (endpoint.startsWith('api/')) {
    apiEndpoint = endpoint;
  } else {
    // Check if base URL already ends with /api
    if (STRAPI_API_URL.endsWith('/api')) {
      apiEndpoint = endpoint;
    } else {
      apiEndpoint = `api/${endpoint}`;
    }
  }
  
  // Ensure we don't have double slashes
  const baseUrl = STRAPI_API_URL.endsWith('/') ? STRAPI_API_URL.slice(0, -1) : STRAPI_API_URL;
  const url = `${baseUrl}/${apiEndpoint}${queryParams ? `?${queryParams}` : ''}`;
  
  console.log(`Fetching from Strapi URL: ${url}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      next: { revalidate: 0 } // Ensure no caching
    });

    if (!response.ok) {
      console.error(`Error fetching from Strapi (multiple items): ${response.status} ${response.statusText}`, await response.text());
      return [];
    }

    const jsonResponse = await response.json();
    console.log(`Raw response from ${endpoint}:`, JSON.stringify(jsonResponse, null, 2));
    
    if (jsonResponse && jsonResponse.data) {
      const transformedData = jsonResponse.data.map((item: any) => transformStrapiData<T>(item));
      console.log(`Transformed ${endpoint} data:`, JSON.stringify(transformedData, null, 2));
      return transformedData;
    }
    
    console.warn(`No data found in response for ${endpoint}`);
    return [];

  } catch (error) {
    console.error(`Failed to fetch data from ${url}:`, error);
    return [];
  }
}

async function fetchSingleFromStrapi<T>(endpointWithId: string): Promise<T | null> {
  if (!STRAPI_API_URL) {
    console.error('Strapi API URL is not configured. Please set NEXT_PUBLIC_STRAPI_API_URL in your .env.local file.');
    return null;
  }

  // Check if STRAPI_API_URL already ends with /api or already includes api in path
  // Ensure we're using /api/ prefix for Strapi endpoints but avoid double api
  let apiEndpoint;
  if (endpointWithId.startsWith('api/')) {
    apiEndpoint = endpointWithId;
  } else {
    // Check if base URL already ends with /api
    if (STRAPI_API_URL.endsWith('/api')) {
      apiEndpoint = endpointWithId;
    } else {
      apiEndpoint = `api/${endpointWithId}`;
    }
  }
  
  // Ensure we don't have double slashes
  const baseUrl = STRAPI_API_URL.endsWith('/') ? STRAPI_API_URL.slice(0, -1) : STRAPI_API_URL;
  // Always populate all fields for single item requests
  const url = `${baseUrl}/${apiEndpoint}?populate=*`;
  
  console.log(`Fetching single item from Strapi URL: ${url}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      next: { revalidate: 0 } // Ensure no caching
    });

    if (response.status === 404) {
      console.warn(`Strapi item not found at ${url}`);
      
      // Try alternative URL if the first one fails
      // Some Strapi setups might have different URL structures
      let alternativeUrl;
      if (baseUrl.endsWith('/api')) {
        // If URL already has /api, try with the base URL without /api
        const strippedBaseUrl = baseUrl.substring(0, baseUrl.length - 4);
        alternativeUrl = `${strippedBaseUrl}/api/${endpointWithId}?populate=*`;
      } else {
        // If URL doesn't have /api, try a different format
        alternativeUrl = `${baseUrl}/${endpointWithId}?populate=*`;
      }
      
      console.log(`Trying alternative URL: ${alternativeUrl}`);
      
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
          const jsonResponse = await altResponse.json();
          console.log(`Raw response from alternative URL for ${endpointWithId}:`, JSON.stringify(jsonResponse, null, 2));
          
          if (jsonResponse && jsonResponse.data) {
            const transformedData = transformSingleStrapiData<T>(jsonResponse.data);
            console.log(`Transformed ${endpointWithId} data from alternative URL:`, JSON.stringify(transformedData, null, 2));
            return transformedData;
          }
        } else {
          console.warn(`Alternative URL also failed: ${altResponse.status} ${altResponse.statusText}`);
        }
      } catch (altError) {
        console.error(`Failed to fetch from alternative URL: ${alternativeUrl}`, altError);
      }
      
      return null;
    }

    if (!response.ok) {
      console.error(`Error fetching from Strapi (single item): ${response.status} ${response.statusText}`, await response.text());
      return null;
    }

    const jsonResponse = await response.json();
    console.log(`Raw response from ${endpointWithId}:`, JSON.stringify(jsonResponse, null, 2));
    
    if (jsonResponse && jsonResponse.data) {
      const transformedData = transformSingleStrapiData<T>(jsonResponse.data);
      console.log(`Transformed ${endpointWithId} data:`, JSON.stringify(transformedData, null, 2));
      return transformedData;
    }
    
    console.warn(`No data found in response for ${endpointWithId}`);
    return null;

  } catch (error) {
    console.error(`Failed to fetch single data from ${url}:`, error);
    return null;
  }
}

// Fetch all AI Tools
export async function getAITools(): Promise<AITool[]> {
  return fetchFromStrapi<AITool>('ai-tools', 'populate=*'); // Populate all fields for list view as well
}

// Fetch all Smartphone Reviews
export async function getSmartphoneReviews(): Promise<SmartphoneReview[]> {
  return fetchFromStrapi<SmartphoneReview>('smartphone-reviews', 'populate=*'); // Populate all fields
}

// Fetch a single AI Tool by ID
export async function getAIToolById(id: string | number): Promise<AITool | null> {
  if (!id) return null;
  return fetchSingleFromStrapi<AITool>(`ai-tools/${id}`);
}

// Fetch a single Smartphone Review by ID
export async function getSmartphoneReviewById(id: string | number): Promise<SmartphoneReview | null> {
  if (!id) return null;
  return fetchSingleFromStrapi<SmartphoneReview>(`smartphone-reviews/${id}`);
} 