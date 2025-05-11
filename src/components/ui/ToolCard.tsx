import Image from 'next/image';
import Link from 'next/link';
import type { AITool } from '../../lib/types';
import { ExternalLink, Tag, CalendarDays, DollarSign } from 'lucide-react'; // Using lucide-react for icons

interface ToolCardProps {
  tool: AITool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  if (!tool || typeof tool !== 'object') {
    console.error('Invalid tool data:', tool);
    return null;
  }

  const detailPageUrl = `/ai-tools/${tool.id}`;
  
  // Process image URL if present
  const getImageUrl = () => {
    if (!tool.imageUrl) return null;
    
    // Handle Strapi media array structure
    if (Array.isArray(tool.imageUrl) && tool.imageUrl.length > 0) {
      const image = tool.imageUrl[0];
      if (!image) return null;
      
      // Get the medium or small format if available, otherwise use the main URL
      const imageUrl = image.formats?.medium?.url || 
                       image.formats?.small?.url || 
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
  const name = tool.name || 'Unnamed Tool';
  const category = tool.category || 'Uncategorized';
  const description = tool.description || 'No description available';
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-2xl">
      {/* Tool Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-400 dark:text-gray-500">No image available</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
          {category}
        </div>
      </div>
      
      {/* Tool Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">
          <Link href={detailPageUrl} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {name}
          </Link>
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.isArray(tool.tags) && tool.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 text-xs rounded-md">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <CalendarDays size={16} className="mr-1" />
            {tool.ReviewDate ? new Date(tool.ReviewDate).toLocaleDateString() : 'Unknown date'}
          </div>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <DollarSign size={16} className="mr-1" />
            {tool.pricing || 'Unknown pricing'}
          </div>
        </div>
      </div>
      
      {/* Card Footer with Link */}
      <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex justify-between items-center">
        <Link href={detailPageUrl} className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
          View Details
        </Link>
        
        {tool.url && (
          <a 
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ExternalLink size={18} />
          </a>
        )}
      </div>
    </div>
  );
};

export default ToolCard; 