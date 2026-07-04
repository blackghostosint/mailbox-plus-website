/* eslint-disable jsx-a11y/control-has-associated-label, @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Search from '~icons/lucide/search';
import Plus from '~icons/lucide/plus';
import Gift from '~icons/lucide/gift';
import Award from '~icons/lucide/award';
import Clock from '~icons/lucide/clock';
import Phone from '~icons/lucide/phone';
import Mail from '~icons/lucide/mail';
import MapPin from '~icons/lucide/map-pin';
import User from '~icons/lucide/user';
import ChevronRight from '~icons/lucide/chevron-right';
import Calculator from '~icons/lucide/calculator';
import Sparkles from '~icons/lucide/sparkles';
import Lock from '~icons/lucide/lock';

declare global {
  interface Window {
    netlifyIdentity: any;
  }
}

interface Customer {
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
}

interface Transaction {
  id: string;
  customerId: string;
  date: string;
  type: 'Earned' | 'Redeemed';
  desc: string;
  amount: number;
}

export const PlusPointsAdmin: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);

  // New Transaction Form State
  const [spendAmount, setAmount] = useState('');
  const [serviceType, setServiceType] = useState('Shipping');
  const [pointsToEarn, setPointsToEarn] = useState(0);

  // New Customer Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: 'OH',
    zip: '',
    birthday: '',
    referredBy: '',
  });
  const [addLoading, setAddModalLoading] = useState(false);

  // Identity Widget hookup
  useEffect(() => {
    const initWidget = () => {
      if (window.netlifyIdentity) {
        const currentUser = window.netlifyIdentity.currentUser();
        setUser(currentUser);

        window.netlifyIdentity.on('init', (u: any) => setUser(u));
        window.netlifyIdentity.on('login', (u: any) => {
          setUser(u);
          window.netlifyIdentity.close();
        });
        window.netlifyIdentity.on('logout', () => {
          setUser(null);
          setSelectedCustomer(null);
          setCustomers([]);
        });
      }
    };

    // Retry in case Netlify Widget loads slightly after React
    const timer = setTimeout(initWidget, 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch customers
  const fetchCustomers = async (query = '') => {
    if (!user) return;
    setLoading(true);
    try {
      const token = await user.jwt();
      const res = await fetch(`/api/customer?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCustomers();
    }
  }, [user]);

  // Fetch selected customer transactions
  const fetchTransactions = async (customerId: string) => {
    if (!user) return;
    setLoadingTx(true);
    try {
      const token = await user.jwt();
      const res = await fetch(`/api/me?id=${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.activities || []);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoadingTx(false);
    }
  };

  useEffect(() => {
    if (selectedCustomer) {
      fetchTransactions(selectedCustomer.id);
    }
  }, [selectedCustomer]);

  // Trigger login popup
  const handleLogin = () => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.open();
    }
  };

  const handleLogout = () => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.logout();
    }
  };

  // Wednesday Double Points calculator
  const isWednesday = new Date().getDay() === 3;

  useEffect(() => {
    if (!selectedCustomer) return;
    const rawVal = parseFloat(spendAmount);
    if (isNaN(rawVal) || rawVal <= 0) {
      setPointsToEarn(0);
      return;
    }

    // Spend calculations: floor(dollars) * tier multiplier
    const floored = Math.floor(rawVal);
    let points = floored * selectedCustomer.multiplier;
    if (isWednesday) {
      points *= 2;
    }
    setPointsToEarn(Math.floor(points));
  }, [spendAmount, selectedCustomer, isWednesday]);

  // Handle transaction submission
  const handleAddTx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !user) return;

    const amountNum = parseFloat(spendAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    try {
      const token = await user.jwt();
      const res = await fetch('/api/transact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId: selectedCustomer.id,
          type: 'Earned',
          desc: `${serviceType} purchase`,
          amount: pointsToEarn,
        }),
      });

      if (res.ok) {
        // Refresh customer details and transaction history
        const updatedRes = await fetch(`/api/customer/${selectedCustomer.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (updatedRes.ok) {
          const updatedCust = await updatedRes.json();
          setSelectedCustomer(updatedCust);
          // Update in main list as well
          setCustomers(customers.map((c) => (c.id === updatedCust.id ? updatedCust : c)));
        }
        setAmount('');
        alert('Transaction logged successfully!');
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (err) {
      console.error('Error logging transaction:', err);
    }
  };

  // Handle reward redemption
  const handleRedeem = async (rewardName: string, cost: number) => {
    if (!selectedCustomer || !user) return;

    if (selectedCustomer.points < cost) {
      alert(`Customer has insufficient points balance (${selectedCustomer.points} pts)`);
      return;
    }

    if (!confirm(`Confirm redemption of "${rewardName}" for ${cost} points?`)) return;

    try {
      const token = await user.jwt();
      const res = await fetch('/api/transact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId: selectedCustomer.id,
          type: 'Redeemed',
          desc: `Redeemed: ${rewardName}`,
          amount: cost,
        }),
      });

      if (res.ok) {
        // Refresh customer details
        const updatedRes = await fetch(`/api/customer/${selectedCustomer.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (updatedRes.ok) {
          const updatedCust = await updatedRes.json();
          setSelectedCustomer(updatedCust);
          setCustomers(customers.map((c) => (c.id === updatedCust.id ? updatedCust : c)));
        }
        alert('Reward redeemed!');
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (err) {
      console.error('Error redeeming reward:', err);
    }
  };

  // Handle tier skip upgrades (Phase 1 Cash Upgrades)
  const handleTierUpgrade = async (targetTier: 'Shipper' | 'Pro', cost: number) => {
    if (!selectedCustomer || !user) return;

    if (
      !confirm(
        `Confirm cash/card payment of $${cost} processed in-store? Upgrading instantly to ${targetTier} Tier.`
      )
    )
      return;

    try {
      const token = await user.jwt();
      const targetYtd = targetTier === 'Pro' ? 2500 : 500;

      const res = await fetch(`/api/customer/${selectedCustomer.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tier: targetTier,
          multiplier: targetTier === 'Pro' ? 1.5 : 1.2,
          ytdPoints: Math.max(selectedCustomer.ytdPoints, targetYtd),
        }),
      });

      if (res.ok) {
        const updatedCust = await res.json();
        setSelectedCustomer(updatedCust);
        setCustomers(customers.map((c) => (c.id === updatedCust.id ? updatedCust : c)));
        alert(`Upgraded to ${targetTier} Tier!`);
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (err) {
      console.error('Error upgrading tier:', err);
    }
  };

  // Add new customer
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setAddModalLoading(true);
    try {
      const token = await user.jwt();
      const res = await fetch('/api/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCustomerForm),
      });

      if (res.ok) {
        const newCust = await res.json();
        setCustomers([newCust, ...customers]);
        setSelectedCustomer(newCust);
        setShowAddModal(false);
        setNewCustomerForm({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          street: '',
          city: '',
          state: 'OH',
          zip: '',
          birthday: '',
          referredBy: '',
        });
        alert('Customer registered successfully!');
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (err) {
      console.error('Error creating customer:', err);
    } finally {
      setAddModalLoading(false);
    }
  };

  return (
    <>
      <div className="bg-bg-primary min-h-screen">
        {/* Auth Gate Screen */}
        {!user ? (
          <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl border border-border-strong shadow-lg p-8 md:p-10 text-center space-y-6">
              <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 border border-border-strong">
                <Lock className="w-8 h-8 text-text-secondary" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary">Staff Portal Access</h1>
              <p className="text-text-secondary text-sm leading-relaxed">
                Log in with your verified staff email and password to access the Plus Points
                customer lookup and counter tools.
              </p>
              <button
                onClick={handleLogin}
                className="w-full py-3.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-sm text-[15px]"
              >
                Sign In to Console
              </button>
            </div>
          </div>
        ) : (
          /* Main Console UI */
          <div className="py-6 md:py-8">
            <div className="container mx-auto px-4 max-w-7xl">
              {/* Top Admin Navigation bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-border pb-6">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
                    <Sparkles className="text-accent-gold w-8 h-8" />
                    <span>Rewards Counter Console</span>
                  </h1>
                  <p className="text-text-secondary text-sm">
                    Log in as: <strong className="text-text-primary">{user.email}</strong>
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-accent-warm text-white font-bold rounded-lg hover:bg-opacity-95 transition-all text-[15px] flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Customer</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-border-strong rounded-lg text-text-secondary hover:text-accent-warm hover:border-accent-warm bg-white font-bold text-sm transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              {/* Wednesday Double Points Banner */}
              {isWednesday && (
                <div className="bg-accent-gold/15 border-2 border-accent-gold text-primary p-4 rounded-xl flex items-center gap-3 mb-8 shadow-sm">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                  <p className="text-sm md:text-base font-bold">
                    🚀 Double Point Wednesday Active! Customers earn 2x points on shipping &
                    printing today!
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. Customer Lookup List Column */}
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 border border-border-strong shadow-sm space-y-4">
                    <h3 className="font-bold text-text-primary text-lg">Customer Directory</h3>

                    {/* Search Field */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        fetchCustomers(search);
                      }}
                      className="relative flex gap-2"
                    >
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-3.5 w-4 h-4 text-text-muted" />
                        <input
                          type="text"
                          placeholder="Name, Phone, or Code"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-3 rounded-lg border border-border outline-none focus:border-primary text-sm bg-bg-primary"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors text-sm"
                      >
                        Search
                      </button>
                    </form>

                    {/* Customer Results List */}
                    <div className="divide-y divide-border max-h-[50vh] overflow-y-auto pr-1">
                      {loading ? (
                        <p className="text-center py-8 text-text-secondary text-sm">
                          Searching directory...
                        </p>
                      ) : customers.length === 0 ? (
                        <p className="text-center py-8 text-text-secondary text-sm">
                          No customers found
                        </p>
                      ) : (
                        customers.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => setSelectedCustomer(c)}
                            className={`w-full text-left py-3 flex justify-between items-center transition-colors group px-3 rounded-xl ${
                              selectedCustomer?.id === c.id
                                ? 'bg-bg-warm-tint border border-border-strong'
                                : 'hover:bg-bg-secondary border border-transparent'
                            }`}
                          >
                            <div>
                              <p className="font-bold text-text-primary text-sm md:text-base">
                                {c.firstName} {c.lastName}
                              </p>
                              <p className="text-xs text-text-secondary mt-1">{c.phone}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-accent-warm px-2 py-0.5 bg-accent-warm/10 rounded">
                                {c.points} pts
                              </span>
                              <ChevronRight className="w-4 h-4 text-text-muted group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Customer Action Center Panel Column (2/3 Width) */}
                <div className="lg:col-span-2 space-y-8">
                  {selectedCustomer ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Left Block: Profile Details & Tiers */}
                      <div className="space-y-8">
                        {/* Selected Customer Details */}
                        <div className="bg-white rounded-2xl p-6 border border-border-strong shadow-sm space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                                {selectedCustomer.firstName[0]}
                              </div>
                              <div>
                                <h3 className="font-bold text-text-primary text-lg">
                                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                                </h3>
                                <p className="text-xs text-text-secondary">
                                  Code: {selectedCustomer.referralCode}
                                </p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-accent-gold text-primary rounded-full text-xs font-bold shadow-sm">
                              {selectedCustomer.tier}
                            </span>
                          </div>

                          <div className="space-y-2 border-t border-border pt-4 text-sm text-text-secondary">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{selectedCustomer.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span>{selectedCustomer.email}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 mt-0.5" />
                              <span>
                                {selectedCustomer.street}, {selectedCustomer.city},{' '}
                                {selectedCustomer.state} {selectedCustomer.zip}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center bg-bg-primary p-3 rounded-xl border border-border">
                            <div>
                              <p className="text-[10px] uppercase font-bold text-text-secondary">
                                Balance
                              </p>
                              <p className="text-lg font-bold text-primary">
                                {selectedCustomer.points}
                              </p>
                            </div>
                            <div className="border-x border-border">
                              <p className="text-[10px] uppercase font-bold text-text-secondary">
                                YTD
                              </p>
                              <p className="text-lg font-bold text-text-primary">
                                {selectedCustomer.ytdPoints}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase font-bold text-text-secondary">
                                Multiplier
                              </p>
                              <p className="text-lg font-bold text-accent-warm">
                                {selectedCustomer.multiplier}x
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Point Redemptions */}
                        <div className="bg-white rounded-2xl p-6 border border-border-strong shadow-sm space-y-4">
                          <h4 className="font-bold text-text-primary flex items-center gap-2">
                            <Gift className="w-5 h-5 text-accent-warm" />
                            <span>Redeem Customer Rewards</span>
                          </h4>

                          <div className="space-y-3">
                            {[
                              { name: 'Free Tape Roll', cost: 50 },
                              { name: 'Free Packaging Services', cost: 200 },
                              { name: 'Free Mailbox Month', cost: 500 },
                            ].map((reward, i) => (
                              <button
                                key={i}
                                disabled={selectedCustomer.points < reward.cost}
                                onClick={() => handleRedeem(reward.name, reward.cost)}
                                className={`w-full p-3.5 rounded-xl border flex justify-between items-center transition-all ${
                                  selectedCustomer.points >= reward.cost
                                    ? 'bg-bg-warm-tint border-border-strong hover:border-accent-warm hover:bg-accent-warm/15 cursor-pointer'
                                    : 'bg-bg-secondary border-border opacity-50 cursor-not-allowed'
                                }`}
                              >
                                <span className="font-bold text-text-primary text-sm">
                                  {reward.name}
                                </span>
                                <span className="text-xs font-bold bg-white px-2 py-1 rounded border border-border-strong text-accent-warm">
                                  {reward.cost} pts
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Manual Tier Skipping (Phase 1 Cash/Card) */}
                        {selectedCustomer.tier !== 'Pro' && (
                          <div className="bg-white rounded-2xl p-6 border border-border-strong shadow-sm space-y-4">
                            <h4 className="font-bold text-text-primary flex items-center gap-2">
                              <Award className="w-5 h-5 text-accent-gold" />
                              <span>Skip Earn-in (Store Upgrade)</span>
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              {selectedCustomer.tier === 'Sender' && (
                                <button
                                  onClick={() => handleTierUpgrade('Shipper', 15)}
                                  className="p-3 rounded-lg border border-border-strong bg-white hover:bg-bg-primary transition-colors text-center text-xs space-y-1 hover:border-primary"
                                >
                                  <p className="font-bold text-text-primary">Upgrade Shipper</p>
                                  <p className="text-accent-warm font-bold">$15 Cash/Card</p>
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  handleTierUpgrade(
                                    'Pro',
                                    selectedCustomer.tier === 'Sender' ? 35 : 25
                                  )
                                }
                                className="p-3 rounded-lg border border-border-strong bg-primary text-white hover:bg-opacity-95 transition-colors text-center text-xs space-y-1"
                              >
                                <p className="font-bold">Upgrade to Pro</p>
                                <p className="text-accent-gold font-bold">
                                  ${selectedCustomer.tier === 'Sender' ? '35' : '25'} Cash/Card
                                </p>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Block: Add Transaction & Logs */}
                      <div className="space-y-8">
                        {/* Log New Transaction */}
                        <div className="bg-white rounded-2xl p-6 border border-border-strong shadow-sm">
                          <h4 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-primary" />
                            <span>Log Counter Purchase</span>
                          </h4>

                          <form onSubmit={handleAddTx} className="space-y-4">
                            <div>
                              <label
                                htmlFor="spendAmt"
                                className="block text-xs font-bold text-text-primary mb-2"
                              >
                                Spend Amount ($)
                              </label>
                              <input
                                id="spendAmt"
                                required
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={spendAmount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-border outline-none focus:border-primary bg-bg-primary"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="serviceSelector"
                                className="block text-xs font-bold text-text-primary mb-2"
                              >
                                Service Category
                              </label>
                              <select
                                id="serviceSelector"
                                value={serviceType}
                                onChange={(e) => setServiceType(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-border outline-none bg-bg-primary"
                              >
                                <option>Shipping</option>
                                <option>Packing</option>
                                <option>Boxes/Supplies</option>
                                <option>Printing</option>
                                <option>Notary Signature</option>
                              </select>
                            </div>

                            <div className="bg-bg-warm-tint p-4 rounded-xl border border-border flex justify-between items-center text-sm font-bold text-text-primary">
                              <span>Points to Earn:</span>
                              <span className="text-lg text-accent-warm">{pointsToEarn} pts</span>
                            </div>

                            <button
                              type="submit"
                              className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-sm text-sm"
                            >
                              Credit Points to Customer
                            </button>
                          </form>
                        </div>

                        {/* Recent Transactions List */}
                        <div className="bg-white rounded-2xl p-6 border border-border-strong shadow-sm">
                          <h4 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-text-secondary" />
                            <span>Tx History Log</span>
                          </h4>
                          <div className="divide-y divide-border max-h-[40vh] overflow-y-auto">
                            {loadingTx ? (
                              <p className="text-center py-4 text-xs text-text-secondary">
                                Loading logs...
                              </p>
                            ) : transactions.length === 0 ? (
                              <p className="text-center py-4 text-xs text-text-secondary">
                                No recorded transactions
                              </p>
                            ) : (
                              transactions.map((t, i) => (
                                <div
                                  key={i}
                                  className="py-2.5 flex justify-between items-center text-xs"
                                >
                                  <div>
                                    <p className="font-bold text-text-primary">{t.desc}</p>
                                    <p className="text-[10px] text-text-secondary mt-0.5">
                                      {new Date(t.date).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <span
                                    className={`font-bold px-2 py-0.5 rounded ${
                                      t.amount > 0
                                        ? 'bg-green-50 text-green-700'
                                        : 'bg-red-50 text-red-700'
                                    }`}
                                  >
                                    {t.amount > 0 ? `+${t.amount}` : t.amount} pts
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Default select fallback state */
                    <div className="bg-white rounded-2xl p-12 border border-border-strong shadow-sm text-center">
                      <User className="w-12 h-12 text-text-muted mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-text-primary mb-2">
                        No Customer Selected
                      </h3>
                      <p className="text-text-secondary text-sm max-w-sm mx-auto leading-relaxed">
                        Search directory and select a customer from the sidebar directory to view
                        points balances, credit transactions, or redeem rewards.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-border-strong shadow-xl overflow-hidden animate-fade-in-up">
            <div className="bg-bg-secondary p-6 border-b border-border">
              <h3 className="text-xl font-bold text-text-primary">Add New Customer Profile</h3>
            </div>
            <form onSubmit={handleAddCustomer}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="addFirst"
                      className="block text-xs font-bold text-text-primary mb-2"
                    >
                      First Name *
                    </label>
                    <input
                      id="addFirst"
                      required
                      type="text"
                      value={newCustomerForm.firstName}
                      onChange={(e) =>
                        setNewCustomerForm({ ...newCustomerForm, firstName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg outline-none focus:border-primary text-sm bg-bg-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="addLast"
                      className="block text-xs font-bold text-text-primary mb-2"
                    >
                      Last Name *
                    </label>
                    <input
                      id="addLast"
                      required
                      type="text"
                      value={newCustomerForm.lastName}
                      onChange={(e) =>
                        setNewCustomerForm({ ...newCustomerForm, lastName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg outline-none focus:border-primary text-sm bg-bg-primary"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="addPhone"
                    className="block text-xs font-bold text-text-primary mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    id="addPhone"
                    required
                    type="text"
                    value={newCustomerForm.phone}
                    onChange={(e) =>
                      setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg outline-none focus:border-primary text-sm bg-bg-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="addEmail"
                    className="block text-xs font-bold text-text-primary mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    id="addEmail"
                    required
                    type="email"
                    value={newCustomerForm.email}
                    onChange={(e) =>
                      setNewCustomerForm({ ...newCustomerForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg outline-none focus:border-primary text-sm bg-bg-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="addStreet"
                    className="block text-xs font-bold text-text-primary mb-2"
                  >
                    Street Address
                  </label>
                  <input
                    id="addStreet"
                    type="text"
                    value={newCustomerForm.street}
                    onChange={(e) =>
                      setNewCustomerForm({ ...newCustomerForm, street: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg outline-none focus:border-primary text-sm bg-bg-primary"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="addCity"
                      className="block text-xs font-bold text-text-primary mb-2"
                    >
                      City
                    </label>
                    <input
                      id="addCity"
                      type="text"
                      value={newCustomerForm.city}
                      onChange={(e) =>
                        setNewCustomerForm({ ...newCustomerForm, city: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg outline-none focus:border-primary text-sm bg-bg-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="addState"
                      className="block text-xs font-bold text-text-primary mb-2"
                    >
                      State
                    </label>
                    <input
                      id="addState"
                      type="text"
                      value={newCustomerForm.state}
                      onChange={(e) =>
                        setNewCustomerForm({ ...newCustomerForm, state: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg outline-none focus:border-primary text-sm bg-bg-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="addZip"
                      className="block text-xs font-bold text-text-primary mb-2"
                    >
                      ZIP
                    </label>
                    <input
                      id="addZip"
                      type="text"
                      value={newCustomerForm.zip}
                      onChange={(e) =>
                        setNewCustomerForm({ ...newCustomerForm, zip: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg outline-none focus:border-primary text-sm bg-bg-primary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="addBday"
                      className="block text-xs font-bold text-text-primary mb-2"
                    >
                      Birthday (MM/DD)
                    </label>
                    <input
                      id="addBday"
                      type="text"
                      value={newCustomerForm.birthday}
                      onChange={(e) =>
                        setNewCustomerForm({ ...newCustomerForm, birthday: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg outline-none focus:border-primary text-sm bg-bg-primary"
                      placeholder="MM/DD"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="addReferred"
                      className="block text-xs font-bold text-text-primary mb-2"
                    >
                      Referred By (Code)
                    </label>
                    <input
                      id="addReferred"
                      type="text"
                      value={newCustomerForm.referredBy}
                      onChange={(e) =>
                        setNewCustomerForm({ ...newCustomerForm, referredBy: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg outline-none focus:border-primary text-sm bg-bg-primary"
                      placeholder="e.g. SARAH-M"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-bg-secondary p-4 flex gap-4 border-t border-border justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-border-strong rounded-lg text-text-secondary hover:bg-bg-primary transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors text-sm flex items-center gap-2"
                >
                  {addLoading ? 'Registering...' : 'Register Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
