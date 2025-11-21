/**
 * Reviews Controller
 * 
 * Handles review operations.
 */

import { Request, Response } from 'express';
import { db } from '../db';

/**
 * GET /api/reviews
 * List reviews with filters
 */
export async function listReviews(req: Request, res: Response): Promise<void> {
  try {
    const { id, propertyId, userId, limit = '50', offset = '0' } = req.query;
    
    const limitNum = Math.min(parseInt(limit as string), 100);
    const offsetNum = parseInt(offset as string);

    // Single review by ID
    if (id) {
      if (isNaN(parseInt(id as string))) {
        res.status(400).json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        });
        return;
      }

      const review = await db.review.findUnique({
        where: { id: parseInt(id as string) }
      });

      if (!review) {
        res.status(404).json({ 
          error: 'Review not found',
          code: 'REVIEW_NOT_FOUND' 
        });
        return;
      }

      res.json(review);
      return;
    }

    // List reviews with filters
    const where: any = {};

    if (propertyId) {
      if (isNaN(parseInt(propertyId as string))) {
        res.status(400).json({ 
          error: "Valid property ID is required",
          code: "INVALID_PROPERTY_ID" 
        });
        return;
      }
      where.propertyId = parseInt(propertyId as string);
    }

    if (userId) {
      where.userId = userId as string;
    }

    const results = await db.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limitNum,
      skip: offsetNum,
    });

    res.json(results);
  } catch (error) {
    console.error('GET reviews error:', error);
    res.status(500).json({ 
      error: 'Internal server error: ' + (error as Error).message 
    });
  }
}

/**
 * POST /api/reviews
 * Create a new review
 */
export async function createReview(req: Request, res: Response): Promise<void> {
  try {
    const { 
      propertyId, 
      userId,
      userName, 
      userAvatar,
      rating, 
      comment,
      cleanliness,
      accuracy,
      communication,
      location,
      value
    } = req.body;

    // Validate required fields
    if (!userName || userName.trim() === '') {
      res.status(400).json({ 
        error: "User name is required",
        code: "MISSING_USER_NAME" 
      });
      return;
    }

    if (rating === undefined || rating === null || typeof rating !== 'number' || rating < 0 || rating > 5) {
      res.status(400).json({ 
        error: "Rating is required and must be between 0 and 5",
        code: "INVALID_RATING" 
      });
      return;
    }

    if (!comment || comment.trim() === '' || comment.trim().length < 10) {
      res.status(400).json({ 
        error: "Comment is required and must be at least 10 characters",
        code: "INVALID_COMMENT" 
      });
      return;
    }

    const hasPropertyId = propertyId !== undefined && propertyId !== null;

    if (!hasPropertyId) {
      res.status(400).json({ 
        error: "propertyId must be provided",
        code: "INVALID_REFERENCE" 
      });
      return;
    }

    if (hasPropertyId) {
      if (isNaN(parseInt(propertyId)) || parseInt(propertyId) <= 0) {
        res.status(400).json({ 
          error: "Property ID must be a valid positive integer",
          code: "INVALID_PROPERTY_ID" 
        });
        return;
      }
    }

    // Validate optional rating fields
    const ratingFields = [
      { name: 'cleanliness', value: cleanliness },
      { name: 'accuracy', value: accuracy },
      { name: 'communication', value: communication },
      { name: 'location', value: location },
      { name: 'value', value: value }
    ];

    for (const field of ratingFields) {
      if (field.value !== undefined && field.value !== null) {
        if (typeof field.value !== 'number' || field.value < 0 || field.value > 5) {
          res.status(400).json({ 
            error: `${field.name} must be between 0 and 5`,
            code: `INVALID_${field.name.toUpperCase()}` 
          });
          return;
        }
      }
    }

    // Prepare insert data
    const insertData: any = {
      userName: userName.trim(),
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (hasPropertyId) {
      insertData.propertyId = parseInt(propertyId);
    }

    if (userId) {
      insertData.userId = userId;
    }

    if (userAvatar) {
      insertData.userAvatar = userAvatar;
    }

    if (cleanliness !== undefined && cleanliness !== null) {
      insertData.cleanliness = cleanliness;
    }

    if (accuracy !== undefined && accuracy !== null) {
      insertData.accuracy = accuracy;
    }

    if (communication !== undefined && communication !== null) {
      insertData.communication = communication;
    }

    if (location !== undefined && location !== null) {
      insertData.location = location;
    }

    if (value !== undefined && value !== null) {
      insertData.value = value;
    }

    const newReview = await db.review.create({
      data: insertData
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error('POST review error:', error);
    res.status(500).json({ 
      error: 'Internal server error: ' + (error as Error).message 
    });
  }
}
