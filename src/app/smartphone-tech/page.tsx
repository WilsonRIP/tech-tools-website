'use client';

import { useState, useMemo, useEffect } from 'react';
import ReviewCard from '../../components/ui/ReviewCard';
import { getSmartphoneReviews } from '../../lib/strapiService'; // Import Strapi service function
import type { SmartphoneReview } from '../../lib/types';
import { Search, Tags } from 'lucide-react'; // Using Tags for brand icon, Search for search bar

const SmartphoneTechPage = () => {
  const [allReviews, setAllReviews] = useState<SmartphoneReview[]>([]); // State for all reviews from Strapi
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state

  // Fetch data from Strapi on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      const reviewsFromStrapi = await getSmartphoneReviews();
      console.log('Fetched Smartphone Reviews on SmartphoneTechPage:', JSON.stringify(reviewsFromStrapi, null, 2)); // Log fetched reviews
      setAllReviews(reviewsFromStrapi);
      setIsLoading(false);
    };
    fetchReviews();
  }, []); // Empty dependency array ensures this runs once on mount

  // Get unique brands from the fetched data
  const brands = useMemo(() => {
    if (isLoading || allReviews.length === 0) return ['All'];
    const allBrands = allReviews.map(review => review.brand);
    return ['All', ...new Set(allBrands)];
  }, [allReviews, isLoading]);

  // Filter reviews based on selected brand and search term
  const filteredReviews = useMemo(() => {
    if (isLoading) return [];
    let reviews = allReviews;

    if (selectedBrand !== 'All') {
      reviews = reviews.filter(review => review.brand === selectedBrand);
    }

    if (searchTerm.trim() !== '') {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      reviews = reviews.filter(review => 
        review.phoneName.toLowerCase().includes(lowercasedSearchTerm) ||
        review.brand.toLowerCase().includes(lowercasedSearchTerm) ||
        review.summary.toLowerCase().includes(lowercasedSearchTerm) ||
        (review.reviewerName && review.reviewerName.toLowerCase().includes(lowercasedSearchTerm))
      );
    }
    return reviews;
  }, [allReviews, selectedBrand, searchTerm, isLoading]);

  // Safety filter for rendering
  const safeFilteredReviews = filteredReviews.filter(review => typeof review.reviewUrl === 'string' && review.reviewUrl.trim() !== '');
  if (!isLoading && safeFilteredReviews.length !== filteredReviews.length) {
    console.warn('SmartphoneTechPage: Some reviews had missing or invalid reviewUrls and were filtered out from display.');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-gray-900 dark:text-white">
          Latest Smartphone Insights
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Explore reviews of the newest smartphones. Filter by brand or search to find your next device.
        </p>
      </header>

      {/* Search Bar and Filters Container */}
      <div className="mb-10 space-y-6">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <input 
            type="text"
            placeholder="Search reviews (e.g., 'Pixel 8 Pro', 'Samsung', 'camera')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 pr-12 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 shadow-sm transition-colors"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-5">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        {/* Brand Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {brands.map((brand, index) => (
            <button
              key={`${brand}-${index}`}
              onClick={() => setSelectedBrand(brand)}
              className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ease-in-out flex items-center 
                          ${selectedBrand === brand 
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              <Tags size={16} className="mr-2 opacity-80" /> {brand}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
          Loading smartphone reviews...
        </p>
      ) : safeFilteredReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {safeFilteredReviews.map((review: SmartphoneReview) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
          No smartphone reviews found matching your criteria (Brand: '{selectedBrand}', Search: '{searchTerm}'). Try different filters or a broader search!
        </p>
      )}
    </div>
  );
};

export default SmartphoneTechPage; 