/**
 * Blog Article Data
 * 
 * Contains article content for blog page.
 * Each article includes metadata and React component content.
 * 
 * @module blog/data/articles
 */

export const articleContents = {
  article1: () => (
    <>
      <p className="text-lg text-gray-700 leading-relaxed">
        Bali continues to captivate travelers from around the world with its unique blend of natural beauty, 
        rich culture, and warm hospitality. As we step into 2025, the island has unveiled new hidden gems 
        and revitalized classic destinations that are worth exploring.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Ubud Rice Terraces</h2>
      <p className="text-gray-700 leading-relaxed">
        The iconic Tegallalang Rice Terraces remain a must-visit destination. Walk through the emerald-green 
        paddies, experience traditional Balinese irrigation systems, and capture breathtaking sunrise views. 
        Best visited early morning to avoid crowds.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Uluwatu Temple</h2>
      <p className="text-gray-700 leading-relaxed">
        Perched on a dramatic cliff overlooking the Indian Ocean, Uluwatu Temple offers stunning sunset views 
        and traditional Kecak fire dance performances.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Nusa Penida Island</h2>
      <p className="text-gray-700 leading-relaxed">
        Just a short boat ride from mainland Bali, Nusa Penida boasts pristine beaches and crystal-clear waters. 
        Kelingking Beach, with its T-Rex shaped cliff, remains one of Instagram's most photographed locations.
      </p>

      <div className="mt-12 p-6 bg-[#FAFAFA] rounded-xl border-l-4 border-[#FFB400]">
        <h3 className="text-xl font-bold text-gray-900 mb-3">Plan Your Perfect Bali Trip with Staysia</h3>
        <p className="text-gray-700">
          Book your accommodation through Staysia to ensure you have the perfect home base for exploring 
          these incredible destinations.
        </p>
      </div>
    </>
  ),

  article2: () => (
    <>
      <p className="text-lg text-gray-700 leading-relaxed">
        Choosing the right accommodation can make or break your travel experience. Whether you're planning a 
        weekend getaway or an extended vacation, the property you select plays a crucial role in your overall 
        satisfaction and comfort during your stay.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Consider Your Travel Style</h2>
      <p className="text-gray-700 leading-relaxed">
        Are you a luxury traveler seeking premium amenities, or a budget-conscious explorer looking for value? 
        Understanding your travel style helps narrow down options.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Location is Everything</h2>
      <p className="text-gray-700 leading-relaxed">
        The perfect location depends on your itinerary. Staying near public transportation saves time and money.
      </p>

      <div className="mt-12 p-6 bg-[#FAFAFA] rounded-xl border-l-4 border-[#FFB400]">
        <h3 className="text-xl font-bold text-gray-900 mb-3">Find Your Perfect Stay with Staysia</h3>
        <p className="text-gray-700">
          Staysia's verified properties and detailed listings make choosing accommodation easy.
        </p>
      </div>
    </>
  ),

  article3: () => (
    <>
      <p className="text-lg text-gray-700 leading-relaxed">
        Sarah Thompson never imagined her small vacation home in Bali would transform into a thriving rental 
        business. Today, she's a Staysia Superhost with a perfect 5.0 rating and booked solid year-round.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Beginning: Taking the Leap</h2>
      <p className="text-gray-700 leading-relaxed">
        "I inherited a two-bedroom villa from my grandmother in 2022," Sarah recalls.
      </p>

      <div className="mt-12 p-6 bg-[#FAFAFA] rounded-xl border-l-4 border-[#FFB400]">
        <h3 className="text-xl font-bold text-gray-900 mb-3">Start Your Hosting Journey with Staysia</h3>
        <p className="text-gray-700">
          Inspired by Sarah's success? List your property today!
        </p>
      </div>
    </>
  ),
};

/**
 * Blog article metadata
 */
export const blogArticles = [
  {
    id: 1,
    title: "Top 10 Must-Visit Destinations in Bali for 2025",
    excerpt: "Discover the hidden gems and popular spots that make Bali a traveler's paradise.",
    date: "January 15, 2025",
    readTime: "5 min read",
    category: "Travel Tips",
    image: "🏝️",
    contentKey: "article1",
  },
  {
    id: 2,
    title: "How to Choose the Perfect Accommodation for Your Stay",
    excerpt: "Expert tips on selecting the right property based on your travel style and budget.",
    date: "January 10, 2025",
    readTime: "7 min read",
    category: "Guest Guide",
    image: "🏠",
    contentKey: "article2",
  },
  {
    id: 3,
    title: "Host Success Story: From First Listing to Superhost",
    excerpt: "Meet Sarah, who transformed her vacation home into a thriving rental business.",
    date: "January 5, 2025",
    readTime: "6 min read",
    category: "Host Stories",
    image: "⭐",
    contentKey: "article3",
  },
];
