import React, { useEffect, useState } from 'react';
import { Meta } from '../components/Meta';
import Shield from '~icons/lucide/shield';
import AlertCircle from '~icons/lucide/alert-circle';
import CheckCircle from '~icons/lucide/check-circle';
import Loader from '~icons/lucide/loader';

export const AcceptInvite: React.FC = () => {
  const [status, setStatus] = useState<'waiting' | 'ready' | 'complete' | 'error'>('waiting');

  useEffect(() => {
    // Give the widget a moment to fully initialize and scan the URL hash
    const timer = setTimeout(() => {
      const hasToken = window.location.hash.includes('invite_token');
      if (hasToken) {
        setStatus('ready');
        // Netlify Identity Widget auto-detects the token and shows the modal
      } else {
        setStatus('error');
      }
    }, 500);

    // Listen for the widget completing the invite acceptance
    const handleComplete = () => {
      setStatus('complete');
    };
    window.addEventListener('identity-signup', handleComplete);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('identity-signup', handleComplete);
    };
  }, []);

  return (
    <>
      <Meta title="Staff Invitation | Mailbox Plus" description="" robots="noindex, nofollow" />
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-border-strong shadow-lg p-8 md:p-10 text-center">
          {/* Status: Waiting for widget */}
          {status === 'waiting' && (
            <div className="animate-fade-in-up">
              <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader className="w-8 h-8 text-primary animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">Preparing Your Account</h1>
              <p className="text-text-secondary">
                Please wait while we set up your staff invitation...
              </p>
            </div>
          )}

          {/* Status: Ready for password setup */}
          {status === 'ready' && (
            <div className="animate-fade-in-up">
              <div className="w-16 h-16 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent-gold/20">
                <Shield className="w-8 h-8 text-accent-gold" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Staff Account Invitation
              </h1>
              <p className="text-text-secondary mb-6">
                A setup window should appear above. Choose a strong password to activate your staff
                account.
              </p>
              <div className="bg-bg-warm-tint p-4 rounded-xl border border-border text-left text-sm text-text-secondary space-y-2">
                <p className="font-bold text-text-primary">📋 Password Requirements:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>At least 8 characters long</li>
                  <li>Include a number and a letter</li>
                  <li>Something you'll remember</li>
                </ul>
              </div>
            </div>
          )}

          {/* Status: Complete */}
          {status === 'complete' && (
            <div className="animate-fade-in-up">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">Account Activated!</h1>
              <p className="text-text-secondary mb-6">
                Your staff account is ready. You can now log into the Mailbox Plus Rewards counter
                tool.
              </p>
              <a
                href="/rewards"
                className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
              >
                Go to Rewards Dashboard
              </a>
            </div>
          )}

          {/* Status: No token found */}
          {status === 'error' && (
            <div>
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">Invalid or Expired Link</h1>
              <p className="text-text-secondary mb-6 leading-relaxed">
                This invitation link is missing a valid token or has already been used. Please ask
                the store manager to send you a new invitation.
              </p>
              <a
                href="/"
                className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
              >
                Return to Mailbox Plus
              </a>
            </div>
          )}

          {/* Small print */}
          <p className="text-xs text-text-muted mt-8 border-t border-border pt-4">
            Mailbox Plus Staff Portal &middot; Concord Township, OH
          </p>
        </div>
      </div>
    </>
  );
};
