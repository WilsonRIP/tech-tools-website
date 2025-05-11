import Link from 'next/link';
import ToolCard from '../components/ui/ToolCard';
import ReviewCard from '../components/ui/ReviewCard';
import type { AITool, SmartphoneReview } from '../lib/types';
import { getAITools, getSmartphoneReviews } from '../lib/strapiService';
import HomeAnimations from '../components/sections/home/HomeAnimations';

// This is now a Server Component, we can make it async
export default async function HomePage() {
  // Fetch data from Strapi
  const allAITools = await getAITools();
  // console.log('Fetched AI Tools on HomePage:', JSON.stringify(allAITools, null, 2)); // Log fetched AI tools
  
  const allSmartphoneReviews = await getSmartphoneReviews();
  console.log('Fetched Smartphone Reviews on HomePage:', JSON.stringify(allSmartphoneReviews, null, 2)); // Log fetched Smartphone reviews

  const featuredAITools = allAITools.slice(0, 3);
  const featuredSmartphoneReviews = allSmartphoneReviews.slice(0, 2);

  // Safety check for undefined URLs before rendering - this is a temporary debug step
  // In a real app, ensure data integrity in CMS or add more robust error handling/defaults in components
  const safeFeaturedAITools = featuredAITools.filter(tool => typeof tool.url === 'string' && tool.url.trim() !== '');
  if (safeFeaturedAITools.length !== featuredAITools.length) {
    console.warn('HomePage: Some featured AI tools had missing or invalid URLs and were filtered out.');
  }

  // Safety check for undefined reviewUrls before rendering
  const safeFeaturedSmartphoneReviews = featuredSmartphoneReviews.filter(review => typeof review.reviewUrl === 'string' && review.reviewUrl.trim() !== '');
  if (safeFeaturedSmartphoneReviews.length !== featuredSmartphoneReviews.length) {
    console.warn('HomePage: Some featured Smartphone reviews had missing or invalid reviewUrls and were filtered out.');
  }

  return (
    <div className="space-y-16">
      <HomeAnimations />

      <section className="py-12 text-center">
        <h2 className="text-4xl font-bold mb-10 text-gray-800 dark:text-gray-200">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400">Curated AI Tools</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Discover a handpicked selection of the best AI tools for developers, designers, marketers, and more. Stay ahead with innovative solutions.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-semibold mb-3 text-yellow-500 dark:text-yellow-400">In-Depth Smartphone News</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Get the latest reviews and news on smartphones from leading tech experts. We compile insights to help you choose your next device.
            </p>
          </div>
        </div>
      </section>

      {/* Use safeFeaturedAITools for rendering */}
      {safeFeaturedAITools.length > 0 && (
        <section className="py-12">
          <h2 className="text-4xl font-bold mb-10 text-center text-gray-800 dark:text-gray-200">Featured AI Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {safeFeaturedAITools.map((tool: AITool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/ai-tools"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
              View All AI Tools
            </Link>
          </div>
        </section>
      )}

      {/* Use safeFeaturedSmartphoneReviews for rendering */}
      {safeFeaturedSmartphoneReviews.length > 0 && (
        <section className="py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h2 className="text-4xl font-bold mb-10 text-center text-gray-800 dark:text-gray-200">Latest Smartphone Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {safeFeaturedSmartphoneReviews.map((review: SmartphoneReview) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/smartphone-tech"
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
              View All Smartphone Reviews
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
