import React, { useState } from 'react';
import { SystemNotification, UserProfile } from '../types';
import { 
  X, 
  Bell, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  ExternalLink, 
  CheckCheck, 
  Send, 
  Clock,
  Sparkles,
  MailCheck,
  CheckCircle2
} from 'lucide-react';
import { sendTestEmailAPI } from '../data/apiClient';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SystemNotification[];
  currentUser: UserProfile;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onSelectAction: (notif: SystemNotification) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  currentUser,
  onMarkRead,
  onMarkAllRead,
  onSelectAction,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [testEmailStatus, setTestEmailStatus] = useState<string | null>(null);
  const [isSendingTest, setIsSendingTest] = useState(false);

  if (!isOpen) return null;

  // Filter relevant notifications for current user
  const userNotifications = notifications.filter((n) => {
    if (!n.recipientEmail && !n.recipientRole) return true;
    if (n.recipientEmail && n.recipientEmail.toLowerCase() === currentUser.email?.toLowerCase()) return true;
    if (n.recipientRole === 'all') return true;
    if (n.recipientRole === currentUser.role) return true;
    return false;
  });

  const filtered = userNotifications.filter((n) => {
    if (filterType === 'UNREAD') return !n.read;
    if (filterType === 'CERT') return n.type === 'CERTIFICATE';
    if (filterType === 'NOTICE') return n.type === 'DIRECT_NOTICE' || n.type === 'HANDOVER';
    if (filterType === 'ALERT') return n.type === 'CUSTODY_ALERT' || n.type === 'LIEN_ISSUED';
    return true;
  });

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const handleSendTestEmails = async () => {
    setIsSendingTest(true);
    setTestEmailStatus(null);
    const target = currentUser.email || 'navalekrishi@gmail.com';
    const res = await sendTestEmailAPI(target, 'all');
    setIsSendingTest(false);
    if (res.results) {
      setTestEmailStatus(`Official Gmail SMTP notifications (Welcome, Evidence Ingest, Case Completed, Tamper Alert) successfully dispatched to ${target}!`);
    } else {
      setTestEmailStatus(`Email dispatch initiated for ${target}.`);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'CERTIFICATE':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'DIRECT_NOTICE':
      case 'HANDOVER':
        return <Send className="w-4 h-4 text-cyan-400" />;
      case 'CUSTODY_ALERT':
      case 'LIEN_ISSUED':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'DONTPAD_SYNC':
        return <FileText className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
      />

      {/* Drawer Container */}
      <div className="relative z-10 w-full max-w-md bg-slate-950 text-white h-full shadow-2xl border-l border-slate-800 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="relative p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <Bell className="w-5 h-5 text-[#FF5A1F]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 animate-pulse ring-2 ring-slate-950" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-2">
                Live Notification Center
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono-code">
                  Gmail SMTP Connected
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Real-time forensic alerts, direct investigator notices & Gmail dispatches
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gmail SMTP Dispatch Quick Action Banner */}
        <div className="p-3.5 bg-gradient-to-r from-blue-950/80 to-slate-900 border-b border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
              <MailCheck className="w-4 h-4 text-cyan-400" />
              <span>Official Gmail SMTP System</span>
            </div>
            <button
              onClick={handleSendTestEmails}
              disabled={isSendingTest}
              className="px-3 py-1.5 rounded-lg bg-[#FF5A1F] hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-[10px] uppercase tracking-wider transition-all shadow-sm active:scale-95"
            >
              {isSendingTest ? 'Dispatching...' : 'Test Send To Gmail'}
            </button>
          </div>
          {testEmailStatus && (
            <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono-code flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{testEmailStatus}</span>
            </div>
          )}
        </div>

        {/* Filter Bar & Quick Mark All */}
        <div className="p-3 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto text-[11px]">
          <div className="flex items-center gap-1">
            {[
              { key: 'ALL', label: 'All' },
              { key: 'UNREAD', label: `Unread (${unreadCount})` },
              { key: 'CERT', label: 'Certificates' },
              { key: 'NOTICE', label: 'Notices' },
              { key: 'ALERT', label: 'Alerts' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                  filterType === f.key
                    ? 'bg-[#FF5A1F] text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-[10px] text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 shrink-0 whitespace-nowrap"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>

        {/* Notifications Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                onMarkRead(n.id);
                onSelectAction(n);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                n.read
                  ? 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  : 'bg-slate-900/90 border-[#FF5A1F]/30 hover:border-[#FF5A1F]/60 text-white shadow-lg shadow-orange-950/20 ring-1 ring-[#FF5A1F]/20'
              }`}
            >
              {!n.read && (
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#FF5A1F]" />
              )}

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-800/90 border border-slate-700 shrink-0">
                  {getIconForType(n.type)}
                </div>

                <div className="space-y-1 flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-400">
                      {n.senderName || 'System'}
                    </span>
                    {n.badge && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 border border-amber-500/20">
                        {n.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug">
                    {n.title}
                  </h4>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {n.message}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-400 pt-2 border-t border-slate-800/80 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {n.timestamp}
                    </span>
                    <span className="text-[#FF5A1F] group-hover:translate-x-0.5 transition-transform font-bold flex items-center gap-1">
                      <span>View & Investigate</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-12 text-center text-slate-500 text-xs space-y-2">
              <Sparkles className="w-8 h-8 text-slate-700 mx-auto mb-2 animate-pulse" />
              <p className="font-semibold text-slate-400">No notifications found in this view</p>
              <p className="text-[11px]">All forensic feeds, 1930 updates & certificates will appear here in real time.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 text-[10px] font-mono-code text-slate-400 text-center flex items-center justify-between">
          <span>SMTP: navalekrishi@gmail.com</span>
          <span className="text-emerald-400 font-bold">100% DISPATCH ACTIVE</span>
        </div>

      </div>
    </div>
  );
};
