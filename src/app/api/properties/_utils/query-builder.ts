/**
 * Query Builder Utilities for Properties API
 * 
 * Builds Prisma where clauses and order by clauses from query parameters.
 * 
 * @module api/properties/utils/query-builder
 */

/**
 * Build Prisma where clause from query parameters
 * 
 * Supports filtering by city, type, price range, guests, pets, rooms, and search.
 * Only returns published properties.
 * 
 * @param searchParams - URL search parameters
 * @returns Prisma where clause
 */
export function buildWhereClause(searchParams: URLSearchParams) {
  const where: any = { isPublished: true };
  
  const city = searchParams.get('city');
  const type = searchParams.get('type');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const adults = searchParams.get('adults');
  const children = searchParams.get('children');
  const pets = searchParams.get('pets');
  const roomsParam = searchParams.get('rooms');
  const search = searchParams.get('search');

  if (city) {
    where.city = { equals: city, mode: 'insensitive' };
  }
  
  if (type) {
    where.type = { equals: type, mode: 'insensitive' };
  }
  
  if (minPrice) {
    const minPriceNum = parseInt(minPrice);
    if (!isNaN(minPriceNum)) {
      where.price = { ...where.price, gte: minPriceNum };
    }
  }
  
  if (maxPrice) {
    const maxPriceNum = parseInt(maxPrice);
    if (!isNaN(maxPriceNum)) {
      where.price = { ...where.price, lte: maxPriceNum };
    }
  }
  
  if (adults || children) {
    const totalGuests = (parseInt(adults || '0') || 0) + (parseInt(children || '0') || 0);
    if (totalGuests > 0) {
      where.maxGuests = { gte: totalGuests };
    }
  }
  
  if (pets === 'true') {
    where.petsAllowed = true;
  }
  
  if (roomsParam) {
    const roomsNum = parseInt(roomsParam);
    if (!isNaN(roomsNum) && roomsNum > 0) {
      where.bedrooms = { gte: roomsNum };
    }
  }
  
  // Enhanced search
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
      { area: { contains: search, mode: 'insensitive' } },
      { type: { contains: search, mode: 'insensitive' } },
      { propertyCategory: { contains: search, mode: 'insensitive' } },
    ];
  }

  return where;
}

/**
 * Build Prisma order by clause
 * 
 * Prioritizes Indonesian properties, then sorts by specified field.
 * 
 * @param sortBy - Sort field (price_asc, price_desc, rating, name)
 * @returns Prisma order by clause
 */
export function buildOrderBy(sortBy: string) {
  if (sortBy === 'price_asc') {
    return [
      { country: 'asc' as const },
      { price: 'asc' as const }
    ];
  } else if (sortBy === 'price_desc') {
    return [
      { country: 'asc' as const },
      { price: 'desc' as const }
    ];
  } else if (sortBy === 'rating') {
    return [
      { country: 'asc' as const },
      { rating: 'desc' as const }
    ];
  } else {
    return [
      { country: 'asc' as const },
      { name: 'asc' as const }
    ];
  }
}
