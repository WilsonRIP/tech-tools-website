// Use server component for better performance and SEO
import Link from 'next/link';
import ToolCard from '../../components/ui/ToolCard';
import { getAITools } from '../../lib/strapiService';
import { Search } from 'lucide-react';

// Force dynamic rendering to avoid caching issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AIToolsPage() {
  console.log('Fetching AI tools for AIToolsPage...');
  const allTools = await getAITools();
  console.log(`Fetched ${allTools.length} AI Tools on AIToolsPage`);
  // Only log first tool fully to avoid console clutter, but show count of tools
  if (allTools.length > 0) {
    console.log('First tool sample:', JSON.stringify(allTools[0], null, 2));
    console.log(`Total tools: ${allTools.length}`);
  } else {
    console.log('No tools found');
  }
  
  // Get all unique categories
  const categories = ['All'];
  if (allTools && allTools.length > 0) {
    const uniqueCategories = [...new Set(allTools.filter(tool => tool.category).map(tool => tool.category))];
    categories.push(...uniqueCategories);
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-gray-900 dark:text-white">
          Explore AI Tools
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover a curated list of top AI tools.
        </p>
      </header>

      {allTools.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No AI tools found. Please check back later.
          </p>
          <div className="mt-4">
            <Link href="/debug" className="text-blue-600 dark:text-blue-400 hover:underline">
              Go to Debug Page
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
} 