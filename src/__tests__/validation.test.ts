/**
 * Validation Logic Unit Tests
 * 
 * Tests for form validation, input sanitization, and data validation.
 * 
 * @module __tests__/validation
 */

import { describe, it, expect } from 'vitest';

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
function isValidPassword(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
}

/**
 * Validate property name
 */
function isValidPropertyName(name: string): boolean {
  return name.trim().length >= 3 && name.trim().length <= 100;
}

/**
 * Validate guest count
 */
function isValidGuestCount(count: number): boolean {
  return Number.isInteger(count) && count > 0 && count <= 50;
}

/**
 * Sanitize user input
 */
function sanitizeInput(input: string): string {
  return input.trim().replace(/<[^>]*>/g, '');
}

describe('Validation Logic', () => {
  describe('isValidEmail', () => {
    it('should accept valid email addresses', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user @example.com')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should accept strong passwords', () => {
      expect(isValidPassword('Password123')).toBe(true);
      expect(isValidPassword('SecureP@ss1')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(isValidPassword('short')).toBe(false);
      expect(isValidPassword('nouppercase123')).toBe(false);
      expect(isValidPassword('NoNumbers')).toBe(false);
      expect(isValidPassword('Pass1')).toBe(false);
    });
  });

  describe('isValidPropertyName', () => {
    it('should accept valid property names', () => {
      expect(isValidPropertyName('Beach Villa')).toBe(true);
      expect(isValidPropertyName('Cozy Studio Apartment')).toBe(true);
    });

    it('should reject too short names', () => {
      expect(isValidPropertyName('AB')).toBe(false);
      expect(isValidPropertyName('  ')).toBe(false);
    });

    it('should reject too long names', () => {
      const longName = 'A'.repeat(101);
      expect(isValidPropertyName(longName)).toBe(false);
    });

    it('should trim whitespace', () => {
      expect(isValidPropertyName('  Valid Name  ')).toBe(true);
    });
  });

  describe('isValidGuestCount', () => {
    it('should accept valid guest counts', () => {
      expect(isValidGuestCount(1)).toBe(true);
      expect(isValidGuestCount(10)).toBe(true);
      expect(isValidGuestCount(50)).toBe(true);
    });

    it('should reject invalid counts', () => {
      expect(isValidGuestCount(0)).toBe(false);
      expect(isValidGuestCount(-5)).toBe(false);
      expect(isValidGuestCount(51)).toBe(false);
    });

    it('should reject non-integers', () => {
      expect(isValidGuestCount(2.5)).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('alert("xss")');
      expect(sanitizeInput('Hello <b>World</b>')).toBe('Hello World');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  Hello  ')).toBe('Hello');
    });

    it('should handle clean input', () => {
      expect(sanitizeInput('Clean text')).toBe('Clean text');
    });
  });
});
