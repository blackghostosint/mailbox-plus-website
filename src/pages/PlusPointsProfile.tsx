/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import Trophy from '~icons/lucide/trophy';
import Award from '~icons/lucide/award';
import LogOut from '~icons/lucide/log-out';
import Copy from '~icons/lucide/copy';
import Check from '~icons/lucide/check';
import Share2 from '~icons/lucide/share-2';
import MapPin from '~icons/lucide/map-pin';
import Phone from '~icons/lucide/phone';
import Mail from '~icons/lucide/mail';
import Calendar from '~icons/lucide/calendar';
import Edit from '~icons/lucide/edit';
import ChevronRight from '~icons/lucide/chevron-right';
import TrendingUp from '~icons/lucide/trending-up';
import Clock from '~icons/lucide/clock';
import AlertCircle from '~icons/lucide/alert-circle';
import Sparkles from '~icons/lucide/sparkles';
import { Meta } from '../components/Meta';

// Mock data based on the spec "Sarah Miller — Shipper tier"
const mockCustomer = {
  id: 'cust_123',
  firstName: 'Sarah',
  lastName: 'Miller',
  email: 'sarah.m@gmail.com',
  phone: '(555) 382-9012',
  street: '742 Evergreen Terrace',
  city: 'Concord Township',
  state: 'OH',
  zip: '44077',
  birthday: '08/14',
  tier: 'Shipper', // Sender, Shipper, Pro
  multiplier: 1.2,
  points: 342,
  ytdPoints: 680,
  referralCode: 'SARAH-M',
  referrals: [
    { name: 'John Davis', date: 'Jun 20', status: 'Active', points: 500 },
    { name: 'Linda Moore', date: 'Jun 25', status: 'Active', points: 500 },
  ],
  activities: [
    { date: 'Jun 25', type: 'Earned', desc: 'FedEx Ground to CA', amount: 27 },
    { date: 'Jun 22', type: 'Earned', desc: 'Notary Signature', amount: 5 },
    { date: 'Jun 20', type: 'Redeemed', desc: 'Free tape roll', amount: -50 },
    { date: 'Jun 18', type: 'Earned', desc: 'Copy/Print — Business cards', amount: 15 },
  ],
};

export const PlusPointsProfile: React.FC = () => {
  const [customer, setCustomer] = useState(mockCustomer);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...customer });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const referralLinkText = `https://mailboxplusohio.com/rewards/join?r=${customer.referralCode}`;
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLinkText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomer(editForm);
    setIsEditing(false);
  };

  // Progress Bar Calcs
  const isSender = customer.tier === 'Sender';
  const isShipper = customer.tier === 'Shipper';
  const isPro = customer.tier === 'Pro';

  const nextTierName = isSender ? 'Shipper' : isShipper ? 'Pro' : 'Maximum Tier';
  const currentTierThreshold = isSender ? 0 : isShipper ? 500 : 2500;
  const nextTierThreshold = isSender ? 500 : isShipper ? 2500 : 2500;

  const ptsToNextTier = nextTierThreshold - customer.ytdPoints;
  const tierProgressPercent = isPro
    ? 100
    : Math.min(
        100,
        Math.max(
          0,
          ((customer.ytdPoints - currentTierThreshold) /
            (nextTierThreshold - currentTierThreshold)) *
            100
        )
      );

  // Reward Progress Calcs
  function getNextRewardInfo(pts: number) {
    if (pts < 50) return { name: 'Free Tape Roll', target: 50 };
    if (pts < 200) return { name: 'Free Packing', target: 200 };
    return { name: 'Free Mailbox Month', target: 500 };
  }

  const currentReward = getNextRewardInfo(customer.points);
  const rewardProgressPercent = Math.min(100, (customer.points / currentReward.target) * 100);

  return (
    <>
      <Meta
        title="My Plus Points Rewards | Mailbox Plus"
        description="View your Plus Points balance, redeem rewards, copy your viral referral link, and manage your customer tier options."
      />
      <div className="bg-bg-primary min-h-screen py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Rewards Dashboard</h1>
              <p className="text-text-secondary">Welcome back, {customer.firstName}!</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border-strong rounded-lg text-text-secondary hover:text-accent-warm hover:border-accent-warm transition-colors bg-white font-bold text-[15px]">
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Stats & Progress */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Card & Stats */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-border-strong shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/10 rounded-full blur-2xl -mr-10 -mt-10" />
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-md">
                      {customer.firstName[0]}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-text-primary">
                        {customer.firstName} {customer.lastName}
                      </h2>
                      <p className="text-sm text-text-secondary">ID: {customer.id}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                      isPro ? 'bg-primary text-white' : 'bg-accent-gold text-primary'
                    }`}
                  >
                    <Trophy className="w-4 h-4" />
                    {customer.tier} Tier
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
                  <div className="text-center">
                    <p className="text-text-secondary text-xs uppercase tracking-wider font-bold mb-1">
                      Spendable Points
                    </p>
                    <p className="text-3xl font-bold text-primary">{customer.points}</p>
                  </div>
                  <div className="text-center border-x border-border">
                    <p className="text-text-secondary text-xs uppercase tracking-wider font-bold mb-1">
                      YTD Earnings
                    </p>
                    <p className="text-3xl font-bold text-text-primary">{customer.ytdPoints}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-text-secondary text-xs uppercase tracking-wider font-bold mb-1">
                      Earning Rate
                    </p>
                    <p className="text-3xl font-bold text-accent-warm">{customer.multiplier}x</p>
                  </div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Reward Progress */}
                <div className="bg-white rounded-2xl p-6 border border-border-strong shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-text-primary flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-accent-gold" />
                        <span>Next Reward Goal</span>
                      </h3>
                      <span className="text-sm font-bold text-primary">
                        {customer.points} / {currentReward.target} pts
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-4">
                      You're on track for a{' '}
                      <strong className="text-text-primary">{currentReward.name}</strong>!
                    </p>
                  </div>
                  <div>
                    <div className="w-full bg-bg-secondary rounded-full h-3 mb-2 overflow-hidden border border-border">
                      <div
                        className="bg-accent-gold h-full rounded-full transition-all duration-500"
                        style={{ width: `${rewardProgressPercent}%` }}
                      />
                    </div>
                    <p className="text-xs text-text-secondary text-right">
                      {currentReward.target - customer.points} points remaining
                    </p>
                  </div>
                </div>

                {/* Tier Progress */}
                <div className="bg-white rounded-2xl p-6 border border-border-strong shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-text-primary flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-accent-warm" />
                        <span>Next Tier Milestone</span>
                      </h3>
                      <span className="text-sm font-bold text-text-primary">
                        {customer.ytdPoints} / {nextTierThreshold} YTD
                      </span>
                    </div>
                    {isPro ? (
                      <p className="text-sm text-text-secondary mb-4">
                        You have achieved our highest tier level. Excellent!
                      </p>
                    ) : (
                      <p className="text-sm text-text-secondary mb-4">
                        Earn {ptsToNextTier} more points to reach{' '}
                        <strong className="text-text-primary">{nextTierName}</strong> tier.
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="w-full bg-bg-secondary rounded-full h-3 mb-2 overflow-hidden border border-border">
                      <div
                        className="bg-accent-warm h-full rounded-full transition-all duration-500"
                        style={{ width: `${tierProgressPercent}%` }}
                      />
                    </div>
                    <p className="text-xs text-text-secondary text-right">
                      {isPro ? 'Max tier unlocked' : `${ptsToNextTier} YTD points to next tier`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Activity Log */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-border-strong shadow-sm">
                <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-text-secondary" />
                  <span>Recent Activity Log</span>
                </h3>
                <div className="divide-y divide-border">
                  {customer.activities.map((act, i) => (
                    <div
                      key={i}
                      className="py-4 flex justify-between items-center first:pt-0 last:pb-0"
                    >
                      <div>
                        <p className="font-bold text-text-primary text-sm md:text-base">
                          {act.desc}
                        </p>
                        <p className="text-xs text-text-secondary mt-1">{act.date}</p>
                      </div>
                      <span
                        className={`font-bold text-sm md:text-base px-3 py-1 rounded-full ${
                          act.amount > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {act.amount > 0 ? `+${act.amount}` : act.amount} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Referrals & Upgrades */}
            <div className="space-y-8">
              {/* Viral Referral Link */}
              <div className="bg-primary text-white rounded-2xl p-6 border border-primary-dark shadow-md relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-deeper to-primary opacity-80 z-0" />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-accent-gold mb-4 border border-white/20">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Invite Friends & Earn Points
                  </h3>
                  <p className="text-sm text-blue-100 mb-6 leading-relaxed">
                    Share your unique link. When a friend signs up and ships at Mailbox Plus, you
                    both get <strong className="text-accent-gold font-bold">500 points!</strong>
                  </p>

                  <div className="space-y-3 mb-6">
                    <label
                      htmlFor="refLink"
                      className="block text-xs font-bold uppercase tracking-wider text-blue-200"
                    >
                      Your Unique Link
                    </label>
                    <div className="flex gap-2 bg-white/10 p-1.5 rounded-lg border border-white/20">
                      <input
                        id="refLink"
                        readOnly
                        type="text"
                        value={referralLinkText}
                        className="bg-transparent flex-1 outline-none text-sm text-white px-2 border-none"
                      />
                      <button
                        onClick={handleCopy}
                        className="p-2 rounded-md bg-accent-gold hover:bg-accent-goldLight text-primary font-bold shadow-sm transition-colors"
                        title="Copy to clipboard"
                      >
                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                    <span className="text-xs text-blue-200 font-bold">Referred Friends</span>
                    <span className="text-sm font-bold text-accent-gold">
                      {customer.referrals.length} active
                    </span>
                  </div>
                </div>
              </div>

              {/* Tier Upgrade Pricing */}
              {!isPro && (
                <div className="bg-white rounded-2xl p-6 border border-border-strong shadow-sm">
                  <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-accent-warm" />
                    <span>Skip The Earn-In?</span>
                  </h3>
                  <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                    Skip earning points and upgrade instantly to unlock better bonuses and exclusive
                    perks.
                  </p>

                  <div className="space-y-3 border-t border-border pt-4 mb-6">
                    {isSender && (
                      <div className="flex justify-between items-center text-sm py-2">
                        <span className="text-text-primary font-semibold">Upgrade to Shipper</span>
                        <strong className="text-accent-warm font-bold">$15</strong>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm py-2">
                      <span className="text-text-primary font-semibold">Upgrade to Pro</span>
                      <strong className="text-accent-warm font-bold">
                        {isSender ? '$35' : '$25'}
                      </strong>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full py-3 bg-accent-gold text-primary hover:bg-accent-goldLight font-bold rounded-lg transition-colors text-sm shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>How to Upgrade</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Account Profile Card */}
              <div className="bg-white rounded-2xl p-6 border border-border-strong shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <h3 className="font-bold text-text-primary">Contact Profile</h3>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-primary hover:underline font-bold text-sm flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
                <div className="space-y-3 text-sm text-text-secondary">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <span>
                      {customer.street}, {customer.city}, {customer.state} {customer.zip}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Birthday: {customer.birthday || 'Not set'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Instruction Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-border-strong shadow-xl overflow-hidden animate-fade-in-up">
            <div className="bg-bg-secondary p-6 border-b border-border text-center">
              <Award className="w-12 h-12 text-accent-gold mx-auto mb-3" />
              <h3 className="text-xl font-bold text-text-primary">Instantly Skip the Earn-in</h3>
            </div>
            <div className="p-6 space-y-4 text-sm text-text-secondary leading-relaxed">
              <p>
                For Phase 1 of our program, upgrades are paid and processed directly at the counter.
              </p>
              <div className="bg-bg-warm-tint p-4 rounded-xl border border-border flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-accent-warm mt-0.5 flex-shrink-0" />
                <p className="text-xs text-text-primary">
                  Just ask any staff member at the counter on your next visit to pay and fast-track
                  your account to a higher rewards tier!
                </p>
              </div>
            </div>
            <div className="bg-bg-secondary p-4 flex gap-4 border-t border-border">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Info Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-border-strong shadow-xl overflow-hidden">
            <div className="bg-bg-secondary p-6 border-b border-border">
              <h3 className="text-xl font-bold text-text-primary">Edit Contact Profile</h3>
            </div>
            <form onSubmit={handleSaveInfo}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="editFirstName"
                      className="block text-xs font-bold text-text-primary mb-2"
                    >
                      First Name
                    </label>
                    <input
                      id="editFirstName"
                      required
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="editLastName"
                      className="block text-xs font-bold text-text-primary mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      id="editLastName"
                      required
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="editEmail"
                    className="block text-xs font-bold text-text-primary mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="editEmail"
                    required
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="editPhone"
                    className="block text-xs font-bold text-text-primary mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    id="editPhone"
                    required
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="editStreet"
                    className="block text-xs font-bold text-text-primary mb-2"
                  >
                    Street Address
                  </label>
                  <input
                    id="editStreet"
                    required
                    type="text"
                    value={editForm.street}
                    onChange={(e) => setEditForm({ ...editForm, street: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="editCity"
                      className="block text-xs font-bold text-text-primary mb-2"
                    >
                      City
                    </label>
                    <input
                      id="editCity"
                      required
                      type="text"
                      value={editForm.city}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="editState"
                      className="block text-xs font-bold text-text-primary mb-2"
                    >
                      State
                    </label>
                    <input
                      id="editState"
                      required
                      type="text"
                      value={editForm.state}
                      onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="editZip"
                      className="block text-xs font-bold text-text-primary mb-2"
                    >
                      ZIP
                    </label>
                    <input
                      id="editZip"
                      required
                      type="text"
                      value={editForm.zip}
                      onChange={(e) => setEditForm({ ...editForm, zip: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="editBirthday"
                    className="block text-xs font-bold text-text-primary mb-2"
                  >
                    Birthday (MM/DD)
                  </label>
                  <input
                    id="editBirthday"
                    type="text"
                    value={editForm.birthday}
                    onChange={(e) => setEditForm({ ...editForm, birthday: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg outline-none focus:border-primary"
                    placeholder="MM/DD"
                  />
                </div>
              </div>
              <div className="bg-bg-secondary p-4 flex gap-4 border-t border-border justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-border-strong rounded-lg text-text-secondary hover:bg-bg-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
