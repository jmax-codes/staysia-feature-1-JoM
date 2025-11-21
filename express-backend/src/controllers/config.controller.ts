/**
 * Config Controller
 * 
 * Handles configuration data (hosts, languages, currencies, etc).
 */

import { Request, Response } from 'express';
import { db } from '../db';

/**
 * GET /api/hosts
 * List all hosts
 */
export async function listHosts(req: Request, res: Response): Promise<void> {
  try {
    const hosts = await db.host.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(hosts);
  } catch (error) {
    console.error('GET hosts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/languages
 * List all languages
 */
export async function listLanguages(req: Request, res: Response): Promise<void> {
  try {
    const languages = await db.language.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    res.json(languages);
  } catch (error) {
    console.error('GET languages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/currencies
 * List all currencies
 */
export async function listCurrencies(req: Request, res: Response): Promise<void> {
  try {
    const currencies = await db.currency.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    res.json(currencies);
  } catch (error) {
    console.error('GET currencies error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * GET /api/exchange-rates
 * Get exchange rates
 */
export async function getExchangeRates(req: Request, res: Response): Promise<void> {
  try {
    const currencies = await db.currency.findMany({
      where: { isActive: true },
      select: {
        code: true,
        name: true,
        symbol: true,
        rate: true
      }
    });

    const rates: any = {};
    currencies.forEach(currency => {
      rates[currency.code] = {
        name: currency.name,
        symbol: currency.symbol,
        rate: currency.rate
      };
    });

    res.json(rates);
  } catch (error) {
    console.error('GET exchange rates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
