/**
 * Contact Controller
 * 
 * Handles contact form submissions.
 */

import { Request, Response } from 'express';

/**
 * POST /api/contact
 * Submit contact form
 */
export async function submitContactForm(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    // TODO: Send email notification or save to database
    console.log('Contact form submission:', { name, email, subject, message });

    res.json({ success: true, message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('POST contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
