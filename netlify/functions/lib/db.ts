import { getStore } from '@netlify/blobs';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  birthday?: string;
  joinDate: string;
  tier: 'Sender' | 'Shipper' | 'Pro';
  multiplier: number;
  points: number;
  ytdPoints: number;
  referralCode: string;
  referredBy?: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  date: string;
  type: 'Earned' | 'Redeemed';
  desc: string;
  amount: number;
}

export interface ReferralLog {
  code: string;
  visits: Array<{ date: string; ip?: string }>;
  claims: Array<{ date: string; customerId: string }>;
}

// Netlify Blobs setup helper
const getDBStore = (name: string) => {
  // During local development, Netlify CLI handles auth if logged in
  return getStore({
    name,
    // Site ID and Token can fall back to environment variables for local testing
    siteID: process.env.NETLIFY_SITE_ID || '7a885e38-5ed0-4988-bc5c-a6007fce97a4',
    token: process.env.NETLIFY_AUTH_TOKEN,
  });
};

export const db = {
  // Customer Store
  customers: getDBStore('customers'),

  // Lookup index store (mapping referral codes or phone numbers to customer IDs)
  indexes: getDBStore('indexes'),

  // Transaction folder per customer
  transactions: getDBStore('transactions'),

  // Click & visit logs for referral tracking
  referrals: getDBStore('referrals'),

  async saveCustomer(customer: Customer) {
    await this.customers.set(customer.id, JSON.stringify(customer));
    // Index by referral code (uppercase) for fast referral lookups
    await this.indexes.set(`ref-${customer.referralCode.toUpperCase()}`, customer.id);
    // Index by phone (normalized digits) for fast counter search
    const cleanPhone = customer.phone.replace(/\D/g, '');
    if (cleanPhone) {
      await this.indexes.set(`phone-${cleanPhone}`, customer.id);
    }
  },

  async getCustomer(id: string): Promise<Customer | null> {
    const raw = await this.customers.get(id);
    return raw ? JSON.parse(raw) : null;
  },

  async getCustomerByReferralCode(code: string): Promise<Customer | null> {
    const id = await this.indexes.get(`ref-${code.toUpperCase()}`);
    if (!id) return null;
    return this.getCustomer(id);
  },

  async getCustomerByPhone(phone: string): Promise<Customer | null> {
    const cleanPhone = phone.replace(/\D/g, '');
    const id = await this.indexes.get(`phone-${cleanPhone}`);
    if (!id) return null;
    return this.getCustomer(id);
  },

  async getTransactions(customerId: string): Promise<Transaction[]> {
    const raw = await this.transactions.get(customerId);
    return raw ? JSON.parse(raw) : [];
  },

  async addTransaction(transaction: Transaction) {
    const txs = await this.getTransactions(transaction.customerId);
    txs.unshift(transaction); // Keep newest first
    await this.transactions.set(transaction.customerId, JSON.stringify(txs));

    // Update customer points
    const customer = await this.getCustomer(transaction.customerId);
    if (customer) {
      customer.points = Math.max(0, customer.points + transaction.amount);
      if (transaction.amount > 0 && transaction.type === 'Earned') {
        customer.ytdPoints += transaction.amount;
      }

      // Update Tiers: YTD >= 2500 -> Pro, YTD >= 500 -> Shipper
      if (customer.ytdPoints >= 2500) {
        customer.tier = 'Pro';
        customer.multiplier = 1.5;
      } else if (customer.ytdPoints >= 500) {
        customer.tier = 'Shipper';
        customer.multiplier = 1.2;
      } else {
        customer.tier = 'Sender';
        customer.multiplier = 1.0;
      }

      await this.saveCustomer(customer);
    }
  },

  async logReferralVisit(code: string, ip?: string) {
    const raw = await this.referrals.get(code.toUpperCase());
    const refLog: ReferralLog = raw
      ? JSON.parse(raw)
      : { code: code.toUpperCase(), visits: [], claims: [] };
    refLog.visits.push({ date: new Date().toISOString(), ip });
    await this.referrals.set(code.toUpperCase(), JSON.stringify(refLog));
  },

  async logReferralClaim(code: string, customerId: string) {
    const raw = await this.referrals.get(code.toUpperCase());
    const refLog: ReferralLog = raw
      ? JSON.parse(raw)
      : { code: code.toUpperCase(), visits: [], claims: [] };
    refLog.claims.push({ date: new Date().toISOString(), customerId });
    await this.referrals.set(code.toUpperCase(), JSON.stringify(refLog));
  },
};
