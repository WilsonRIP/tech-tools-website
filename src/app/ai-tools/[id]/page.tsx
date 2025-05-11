import { getAIToolById } from '../../../lib/strapiService';
import { AITool } from '../../../lib/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, Tag, DollarSign, Info, Users, CalendarDays, Palette } from 'lucide-react';
import Link from 'next/link';

interface AIToolPageProps {
  params: {
    id: string;
  };
}

// Force this page to be dynamic
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AIToolPage({ params }: AIToolPageProps) {
  const toolId = params.id;
  console.log(`Fetching AI tool with ID: ${toolId}`);
  const tool: AITool | null = await getAIToolById(toolId);
  
  if (!tool) {
    console.error(`Tool with ID ${toolId} not found`);
    notFound(); // Triggers the not-found page if the tool isn't found
  }
  
  console.log(`Found tool with ID ${toolId}:`, JSON.stringify(tool, null, 2));

  // Add validation for required fields
  if (!tool.name || typeof tool.name !== 'string') {
    console.error('Tool is missing name or name is not a string:', tool);
    notFound();
  }

  // Process image URL if present
  const getImageUrl = () => {
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
    
    // Handle case where imageUrl might be a string (unlikely with updated types)
    // Use type assertion for proper TypeScript handling
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

  const imageUrl = getImageUrl();
  const name = tool.name;
  const category = tool.category || 'Uncategorized';
  const description = tool.description || 'No description available';

  const renderField = (Icon: React.ElementType, label: string, value?: string | string[] | null, isLink: boolean = false, isTagList: boolean = false) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return null;
    }

    return (
      <div className="flex items-start space-x-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0 last:mb-0">
        <Icon className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mt-1 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{label}</p>
          {isLink && typeof value === 'string' ? (
            <a 
              href={value} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-lg text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 underline transition-colors flex items-center"
            >
              {value} <ExternalLink size={16} className="ml-2" />
            </a>
          ) : isTagList && Array.isArray(value) ? (
            <div className="flex flex-wrap gap-2 mt-1">
              {value.map((tag, index) => (
                <span key={index} className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-lg text-gray-800 dark:text-gray-100">{Array.isArray(value) ? value.join(', ') : value}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <div className="px-6 py-8 md:px-10 md:py-12">
          <Link href="/ai-tools" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline mb-6 group">
            <ArrowLeft size={20} className="mr-2 transition-transform group-hover:-translate-x-1" />
            Back to AI Tools
          </Link>

          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 break-words">
              {name}
            </h1>
            {tool.pricing && (
              <div className="mt-2 inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-sm font-medium">
                {tool.pricing}
              </div>
            )}
          </header>

          {imageUrl && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <div className="relative w-full aspect-[16/9]">
                <Image 
                  src={imageUrl} 
                  alt={`${name} screenshot or logo`}
                  fill
                  className="object-contain bg-gray-50 dark:bg-gray-900"
                  priority
                />
              </div>
            </div>
          )}

          <section className="space-y-6">
            {renderField(Info, "Description", description)}
            {renderField(Palette, "Category", category)}
            {renderField(ExternalLink, "Website URL", tool.url, true)}
            {renderField(Tag, "Tags", Array.isArray(tool.tags) ? tool.tags : [], false, true)}
            {renderField(CalendarDays, "Review Date", tool.ReviewDate ? new Date(tool.ReviewDate).toLocaleDateString() : undefined)}
          </section>
        </div>
      </div>
    </div>
  );
}

// Optional: Generate static paths if you know all IDs at build time (for performance)
// export async function generateStaticParams() {
//   const tools = await getAITools(); // Assuming getAITools fetches all tools with their IDs
//   return tools.map(tool => ({ id: tool.id.toString() }));
// } 