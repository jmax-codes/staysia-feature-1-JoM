/**
 * Query Builder Utilities
 * 
 * Utilities for building Prisma queries with filtering, sorting, and pagination.
 */

/**
 * Build where clause from query parameters
 */
export function buildWhereClause(params: URLSearchParams): any {
  const where: any = {};

  // Location filter (searches both city AND area)
  const location = params.get('location');
  if (location) {
    where.OR = [
      { city: { contains: location, mode: 'insensitive' } },
      { area: { contains: location, mode: 'insensitive' } }
    ];
  }

  // Legacy city filter (for backward compatibility)
  const city = params.get('city');
  if (city && !location) {
    where.city = { contains: city, mode: 'insensitive' };
  }

  // Category filter (alias for type, used by search bar)
  const category = params.get('category');
  if (category && category !== 'all') {
    // Capitalize first letter to match database format (e.g., "apartment" -> "Apartment")
    const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    where.type = normalizedCategory;
  }

  // Legacy type filter (for backward compatibility)
  const type = params.get('type');
  if (type && !category) {
    // Capitalize first letter to match database format
    const normalizedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    where.type = normalizedType;
  }

  // Price range filter
  const minPrice = params.get('minPrice');
  const maxPrice = params.get('maxPrice');
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseInt(minPrice);
    if (maxPrice) where.price.lte = parseInt(maxPrice);
  }

  // Guest count filter (adults + children)
  const adults = params.get('adults');
  const children = params.get('children');
  if (adults || children) {
    const totalGuests = (parseInt(adults || '0')) + (parseInt(children || '0'));
    if (totalGuests > 0) {
      where.maxGuests = { gte: totalGuests };
    }
  }

  // Legacy guests filter (for backward compatibility)
  const guests = params.get('guests');
  if (guests && !adults && !children) {
    where.maxGuests = { gte: parseInt(guests) };
  }

  // Pets filter
  const pets = params.get('pets');
  if (pets && pets !== '0') {
    where.petsAllowed = true;
  }

  // Date range filter (for future booking system integration)
  // Note: Currently just validates dates are present, actual availability
  // checking requires querying against a Booking table
  const checkIn = params.get('checkIn');
  const checkOut = params.get('checkOut');
  if (checkIn && checkOut) {
    // TODO: When booking system is implemented, add:
    // where.bookings = {
    //   none: {
    //     OR: [
    //       { checkOut: { lte: checkIn } },
    //       { checkIn: { gte: checkOut } }
    //     ]
    //   }
    // };
    // For now, dates are captured but don't filter results
  }

  // Search filter (general text search)
  const search = params.get('search');
  if (search) {
    // If location filter is already set, combine with AND
    if (where.OR) {
      const locationOR = where.OR;
      delete where.OR;
      where.AND = [
        { OR: locationOR },
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { area: { contains: search, mode: 'insensitive' } }
          ]
        }
      ];
    } else {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { area: { contains: search, mode: 'insensitive' } }
      ];
    }
  }

  return where;
}

/**
 * Build order by clause from sort parameter
 */
export function buildOrderBy(sortBy: string): any {
  switch (sortBy) {
    case 'price':
      return { price: 'asc' };
    case 'rating':
      return { rating: 'desc' };
    case 'name':
    default:
      return { name: 'asc' };
  }
}

/**
 * Build pagination metadata
 */
export function buildPaginationMeta(total: number, limit: number, offset: number) {
  return {
    total,
    limit,
    offset,
    page: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(total / limit),
    hasMore: offset + limit < total
  };
}
