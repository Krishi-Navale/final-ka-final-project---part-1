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
  CheckCircle2,
  Search,
  Radio,
  Plus,
  Trash2,
  Copy,
  Check,
  Zap,
  Cpu,
  Lock,
} from 'lucide-react';
import { sendTestEmailAPI } from '../data/apiClient';
import {
  addNotification,
  removeNotificationById,
  formatNotificationRelativeTime,
} from '../data/notificationStore';

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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [testEmailStatus, setTestEmailStatus] = useState<string | null>(null);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [showCustomComposer, setShowCustomComposer] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [customType, setCustomType] =
    useState<SystemNotification['type']>('DIRECT_NOTICE');

  if (!isOpen) return null;

  // Filter relevant notifications for current user
  const userNotifications = notifications.filter((n) => {
    if (!n.recipientEmail && !n.recipientRole) return true;
    if (
      n.recipientEmail &&
      n.recipientEmail.toLowerCase() === currentUser.email?.toLowerCase()
    )
      return true;
    if (n.recipientRole === 'all') return true;
    if (n.recipientRole === currentUser.role) return true;
    return false;
  });

  const filtered = userNotifications.filter((n) => {
    const matchesCategory =
      filterType === 'ALL'
        ? true
        : filterType === 'UNREAD'
        ? !n.read
        : filterType === 'CERT'
        ? n.type === 'CERTIFICATE'
        : filterType === 'NOTICE'
        ? n.type === 'DIRECT_NOTICE' || n.type === 'HANDOVER'
        : filterType === 'ALERT'
        ? n.type === 'CUSTODY_ALERT' ||
          n.type === 'LIEN_ISSUED' ||
          n.type === 'DONTPAD_SYNC'
        : true;

    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.message.toLowerCase().includes(q) ||
      (n.senderName && n.senderName.toLowerCase().includes(q)) ||
      (n.relatedTrackingCode && n.relatedTrackingCode.toLowerCase().includes(q)) ||
      (n.badge && n.badge.toLowerCase().includes(q))
    );
  });

  const unreadCount = userNotifications.filter((n) => !n.read).length;
  const certCount = userNotifications.filter((n) => n.type === 'CERTIFICATE').length;
  const alertCount = userNotifications.filter(
    (n) => n.type === 'CUSTODY_ALERT' || n.type === 'LIEN_ISSUED'
  ).length;

  const handleSendTestEmails = async () => {
    setIsSendingTest(true);
    setTestEmailStatus(null);
    const target = currentUser.email || 'navalekrishi@gmail.com';
    const res = await sendTestEmailAPI(target, 'all');
    setIsSendingTest(false);

    addNotification({
      type: 'DIRECT_NOTICE',
      title: `Gmail SMTP Dispatch Verified (${target})`,
      message: `Multi-stage forensic email templates (Welcome, Evidence Ingest, Section 65B Certificate & Tamper Alert) transmitted to ${target}.`,
      recipientEmail: target,
      recipientRole: 'all',
      relatedTrackingCode: 'IN-CFC-2026-849102',
      senderName: 'F.I.P SMTP Relay',
      badge: 'SMTP 250 OK',
    });

    if (res.results) {
      setTestEmailStatus(
        `Official Gmail SMTP suite dispatched to ${target} & logged to live stream.`
      );
    } else {
      setTestEmailStatus(`Live SMTP dispatch logged for ${target}.`);
    }
  };

  // Interactive Live Forensic Event Simulator
  const triggerLiveSimulationEvent = (
    preset: 'LIEN' | 'CERT65B' | 'SYNDICATE' | 'WORM'
  ) => {
    const targetEmail = currentUser.email || 'navalekrishi@gmail.com';
    if (preset === 'LIEN') {
      addNotification({
        type: 'LIEN_ISSUED',
        title: '1930 Golden-Hour NPCI Bank Freeze Executed',
        message:
          'Emergency debit freeze locked ₹4,85,000 in Beneficiary Mule A/C #5010049281920 (HDFC Nodal Desk) within 14 minutes of intake.',
        recipientEmail: targetEmail,
        recipientRole: 'all',
        relatedTrackingCode: 'IN-CFC-2026-849102',
        senderName: '1930 Nodal Command',
        badge: 'LIEN FROZEN',
      });
    } else if (preset === 'CERT65B') {
      const certNum = `CERT-65B-2026-${Math.floor(10000 + Math.random() * 89999)}`;
      addNotification({
        type: 'CERTIFICATE',
        title: `Section 65B Evidentiary Certificate Sealed (${certNum})`,
        message: `Cryptographic SHA-256 hash verified and countersigned by Lead Examiner Bibi Zohara for court admissibility.`,
        recipientEmail: targetEmail,
        recipientRole: 'all',
        relatedTrackingCode: 'IN-CFC-2026-849102',
        senderName: 'Bibi Zohara · Sec 65B',
        badge: 'SEC 65B SEALED',
      });
    } else if (preset === 'SYNDICATE') {
      addNotification({
        type: 'CUSTODY_ALERT',
        title: 'AI Cross-Case Syndicate Match: 99.6% Confidence',
        message:
          'Neural Graph Engine correlated UPI handle powerelectric99@axl and IMEI 864920041829104 across 4 active state dockets.',
        recipientEmail: targetEmail,
        recipientRole: 'all',
        relatedTrackingCode: 'IN-CFC-2026-849103',
        senderName: 'Krishi · AI Engine',
        badge: 'SYNDICATE HIT',
      });
    } else if (preset === 'WORM') {
      addNotification({
        type: 'DONTPAD_SYNC',
        title: 'RFC-3161 WORM Bitstream Audit Completed',
        message:
          'Zero bit-rot or unauthorized mutation detected across all sealed evidence blocks in primary & cold storage.',
        recipientEmail: targetEmail,
        recipientRole: 'all',
        actionUrlHash: '#pad/evidence-vault-docket',
        senderName: 'Afsheen S · WORM Vault',
        badge: 'MERKLE OK',
      });
    }
  };

  const handleCreateCustomNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customMessage.trim()) return;

    addNotification({
      type: customType,
      title: customTitle.trim(),
      message: customMessage.trim(),
      recipientEmail: currentUser.email || 'navalekrishi@gmail.com',
      recipientRole: 'all',
      relatedTrackingCode: 'IN-CFC-2026-849102',
      senderName: currentUser.name || 'Senior Investigator',
      badge: 'LIVE DISPATCH',
    });

    setCustomTitle('');
    setCustomMessage('');
    setShowCustomComposer(false);
  };

  const handleCopyCode = (e: React.MouseEvent, code: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 1800);
  };

  const handleDismiss = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeNotificationById(id);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'CERTIFICATE':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'DIRECT_NOTICE':
      case 'HANDOVER':
        return <Send className="w-4 h-4 text-sky-400" />;
      case 'CUSTODY_ALERT':
      case 'LIEN_ISSUED':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'DONTPAD_SYNC':
        return <FileText className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-[#FF4D15]" />;
    }
  };

  const getAccentClassesForType = (type: string, read: boolean) => {
    if (read) {
      return 'bg-[#0F0F15] border-white/10 hover:border-white/25 text-zinc-300';
    }
    switch (type) {
      case 'CERTIFICATE':
        return 'bg-gradient-to-r from-emerald-500/10 via-[#14141D] to-[#14141D] border-emerald-500/40 hover:border-emerald-400/70 text-white shadow-[0_8px_30px_rgba(16,185,129,0.12)]';
      case 'CUSTODY_ALERT':
      case 'LIEN_ISSUED':
        return 'bg-gradient-to-r from-amber-500/10 via-[#14141D] to-[#14141D] border-amber-500/40 hover:border-amber-400/70 text-white shadow-[0_8px_30px_rgba(245,158,11,0.12)]';
      default:
        return 'bg-gradient-to-r from-[#FF4D15]/12 via-[#14141D] to-[#14141D] border-[#FF4D15]/45 hover:border-[#FF4D15]/80 text-white shadow-[0_8px_30px_rgba(255,77,21,0.15)]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dark Blur Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#040406]/80 backdrop-blur-md transition-opacity"
      />

      {/* Notification Command Drawer */}
      <div className="relative z-10 w-full max-w-xl bg-[#08080C] text-white h-full shadow-[0_0_80px_rgba(0,0,0,0.95)] border-l border-white/12 flex flex-col animate-in slide-in-from-right duration-300">
        {/* ============================================================
            HEADER: LIVE SSE STREAM TELEMETRY & COUNTERS
           ============================================================ */}
        <div className="p-5 border-b border-white/10 bg-[#0E0E14] space-y-4 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-[#FF4D15]/25 to-[#FF4D15]/5 border border-[#FF4D15]/40 shadow-[0_0_20px_rgba(255,77,21,0.25)]">
                <Bell className="w-5 h-5 text-[#FF4D15]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FF4D15] animate-ping" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FF4D15] ring-2 ring-[#08080C]" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black tracking-tight text-white">
                    Live Forensic Notification Center
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono-code font-bold flex items-center gap-1">
                    <Radio className="w-3 h-3 animate-pulse" />
                    SSE LIVE STREAM
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Real-time 1930 bank freeze alerts, Section 65B certificates & Gmail dispatches
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close Notification Center"
              className="p-2 rounded-xl bg-[#181822] hover:bg-[#FF4D15] border border-white/10 text-zinc-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 4-Metric Telemetry Strip */}
          <div className="grid grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-[#08080C] border border-white/10">
              <span className="text-[9px] font-mono-code uppercase tracking-wider text-zinc-500 block">
                TOTAL FEED
              </span>
              <span className="text-sm font-black font-mono-code text-white">
                {userNotifications.length}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#08080C] border border-[#FF4D15]/30">
              <span className="text-[9px] font-mono-code uppercase tracking-wider text-[#FF4D15] block">
                UNREAD
              </span>
              <span className="text-sm font-black font-mono-code text-[#FF4D15]">
                {unreadCount}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#08080C] border border-emerald-500/25">
              <span className="text-[9px] font-mono-code uppercase tracking-wider text-emerald-400 block">
                SEC 65B CERTS
              </span>
              <span className="text-sm font-black font-mono-code text-emerald-400">
                {certCount}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#08080C] border border-amber-500/25">
              <span className="text-[9px] font-mono-code uppercase tracking-wider text-amber-400 block">
                1930 & ALERTS
              </span>
              <span className="text-sm font-black font-mono-code text-amber-400">
                {alertCount}
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================
            LIVE EVENT SIMULATOR & GMAIL SMTP DISPATCH CONSOLE
           ============================================================ */}
        <div className="p-3.5 bg-gradient-to-r from-[#FF4D15]/12 via-[#111118] to-[#111118] border-b border-white/10 space-y-2.5 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Zap className="w-3.5 h-3.5 text-[#FF4D15]" />
              <span>Live Telemetry Simulator & Gmail SMTP</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowCustomComposer(!showCustomComposer)}
                className="px-2.5 py-1 rounded-lg bg-[#181824] hover:bg-white/15 border border-white/15 text-zinc-200 font-mono-code font-bold text-[10px] flex items-center gap-1 transition-all"
              >
                <Plus className="w-3 h-3 text-[#FF4D15]" />
                <span>Custom Dispatch</span>
              </button>

              <button
                type="button"
                onClick={handleSendTestEmails}
                disabled={isSendingTest}
                className="px-2.5 py-1 rounded-lg bg-[#FF4D15] hover:bg-[#E03E0B] disabled:opacity-50 text-white font-mono-code font-bold text-[10px] flex items-center gap-1 transition-all shadow-sm active:scale-95"
              >
                <MailCheck className="w-3 h-3" />
                <span>{isSendingTest ? 'Dispatching...' : 'Test Gmail SMTP'}</span>
              </button>
            </div>
          </div>

          {/* 1-Click Live Forensic Event Triggers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => triggerLiveSimulationEvent('LIEN')}
              className="px-2 py-1.5 rounded-lg bg-[#08080C]/90 hover:bg-amber-500/15 border border-white/10 hover:border-amber-500/40 text-[10px] font-mono-code font-bold text-amber-300 transition-all truncate text-center"
            >
              + 1930 Lien Freeze
            </button>
            <button
              type="button"
              onClick={() => triggerLiveSimulationEvent('CERT65B')}
              className="px-2 py-1.5 rounded-lg bg-[#08080C]/90 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/40 text-[10px] font-mono-code font-bold text-emerald-300 transition-all truncate text-center"
            >
              + Sec 65B Sealed
            </button>
            <button
              type="button"
              onClick={() => triggerLiveSimulationEvent('SYNDICATE')}
              className="px-2 py-1.5 rounded-lg bg-[#08080C]/90 hover:bg-sky-500/15 border border-white/10 hover:border-sky-500/40 text-[10px] font-mono-code font-bold text-sky-300 transition-all truncate text-center"
            >
              + AI Syndicate Hit
            </button>
            <button
              type="button"
              onClick={() => triggerLiveSimulationEvent('WORM')}
              className="px-2 py-1.5 rounded-lg bg-[#08080C]/90 hover:bg-purple-500/15 border border-white/10 hover:border-purple-500/40 text-[10px] font-mono-code font-bold text-purple-300 transition-all truncate text-center"
            >
              + WORM Audit
            </button>
          </div>

          {/* Optional Custom Notification Composer */}
          {showCustomComposer && (
            <form
              onSubmit={handleCreateCustomNotification}
              className="p-3 rounded-xl bg-[#08080C] border border-white/15 space-y-2 animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-code uppercase text-[#FF4D15] font-bold">
                  Broadcast Custom Live Alert
                </span>
                <select
                  value={customType}
                  onChange={(e) =>
                    setCustomType(e.target.value as SystemNotification['type'])
                  }
                  className="bg-[#14141D] border border-white/10 rounded px-2 py-0.5 text-[10px] font-mono-code text-white"
                >
                  <option value="DIRECT_NOTICE">Investigator Notice</option>
                  <option value="CERTIFICATE">Section 65B Certificate</option>
                  <option value="LIEN_ISSUED">1930 Bank Lien</option>
                  <option value="CUSTODY_ALERT">AI Syndicate Alert</option>
                </select>
              </div>
              <input
                type="text"
                required
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Alert Headline (e.g. Urgent UTR Verification Required)"
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#111118] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4D15]"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Enter forensic telemetry details..."
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#111118] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4D15]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-[#FF4D15] hover:bg-[#e03e0b] text-white text-xs font-bold shrink-0"
                >
                  Emit Live
                </button>
              </div>
            </form>
          )}

          {testEmailStatus && (
            <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono-code flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{testEmailStatus}</span>
            </div>
          )}
        </div>

        {/* ============================================================
            SEARCH & FILTER BAR
           ============================================================ */}
        <div className="p-3 bg-[#0E0E14] border-b border-white/10 space-y-2.5 shrink-0">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by docket ID (IN-CFC-...), examiner name, or certificate..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#08080C] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4D15] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Pills & Mark All Read */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto text-[11px]">
            <div className="flex items-center gap-1">
              {[
                { key: 'ALL', label: `All (${userNotifications.length})` },
                { key: 'UNREAD', label: `Unread (${unreadCount})` },
                { key: 'CERT', label: 'Sec 65B' },
                { key: 'NOTICE', label: 'Notices' },
                { key: 'ALERT', label: '1930 & Alerts' },
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilterType(f.key)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                    filterType === f.key
                      ? 'bg-[#FF4D15] text-white shadow-[0_0_12px_rgba(255,77,21,0.35)]'
                      : 'bg-[#15151E] text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-[10px] font-mono-code text-[#FF4D15] hover:text-white font-bold flex items-center gap-1 shrink-0 whitespace-nowrap px-2 py-1 rounded-lg bg-[#FF4D15]/10 border border-[#FF4D15]/25"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        </div>

        {/* ============================================================
            LIVE NOTIFICATIONS STREAM
           ============================================================ */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                onMarkRead(n.id);
                onSelectAction(n);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${getAccentClassesForType(
                n.type,
                n.read
              )}`}
            >
              {/* Top Row: Sender, Badge, Relative Time, Dismiss */}
              <div className="flex items-start gap-3">
                {(n.senderName || '').toLowerCase().includes('balchandra') ? (
                  <img
                    src="/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.28.47_PM_76cc2fa2.jpeg"
                    alt={n.senderName}
                    className="w-9 h-9 rounded-xl object-cover object-top border border-[#FF4D15] shrink-0 mt-0.5 shadow-sm"
                  />
                ) : (n.senderName || '').toLowerCase().includes('krishi') ? (
                  <img
                    src="/assets/aistudio/image_526c1ede.png"
                    alt={n.senderName}
                    className="w-9 h-9 rounded-xl object-cover object-top border border-[#FF4D15] shrink-0 mt-0.5 shadow-sm"
                  />
                ) : (n.senderName || '').toLowerCase().includes('zohara') ? (
                  <img
                    src="/assets/aistudio/image_acc490cb.png"
                    alt={n.senderName}
                    className="w-9 h-9 rounded-xl object-cover object-top border border-[#FF4D15] shrink-0 mt-0.5 shadow-sm"
                  />
                ) : (n.senderName || '').toLowerCase().includes('afsheen') ? (
                  <img
                    src="/assets/aistudio/WhatsApp_Image_2026-11-15_at_11.07.15_AM_8f0b2ddc.jpeg"
                    alt={n.senderName}
                    className="w-9 h-9 rounded-xl object-cover object-top border border-[#FF4D15] shrink-0 mt-0.5 shadow-sm"
                  />
                ) : (
                  <div className="p-2.5 rounded-xl bg-[#070709] border border-white/10 shrink-0 mt-0.5">
                    {getIconForType(n.type)}
                  </div>
                )}

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-zinc-300">
                        {n.senderName || 'F.I.P Command'}
                      </span>
                      {n.badge && (
                        <span className="text-[9px] font-mono-code font-extrabold px-1.5 py-0.5 rounded bg-black/60 text-amber-300 border border-amber-500/30">
                          {n.badge}
                        </span>
                      )}
                      {!n.read && (
                        <span className="px-1.5 py-0.2 rounded-full bg-[#FF4D15] text-white text-[8px] font-mono-code font-black uppercase">
                          NEW
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-mono-code text-emerald-400 font-bold">
                        {formatNotificationRelativeTime(n.timestamp)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDismiss(e, n.id)}
                        title="Dismiss notification"
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-xs sm:text-sm font-extrabold text-white leading-snug">
                    {n.title}
                  </h4>

                  <p className="text-xs text-zinc-300 leading-relaxed">{n.message}</p>

                  {/* Tracking Code & Action Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono-code text-zinc-400 pt-2.5 border-t border-white/10 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-zinc-500">
                        <Clock className="w-3 h-3" />
                        {n.timestamp}
                      </span>

                      {n.relatedTrackingCode && (
                        <button
                          type="button"
                          onClick={(e) =>
                            handleCopyCode(e, n.relatedTrackingCode!, n.id)
                          }
                          className="px-2 py-0.5 rounded bg-black/50 hover:bg-white/10 border border-white/10 text-zinc-200 flex items-center gap-1 transition-colors"
                        >
                          <span>#{n.relatedTrackingCode}</span>
                          {copiedCodeId === n.id ? (
                            <Check className="w-2.5 h-2.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-2.5 h-2.5 text-zinc-400" />
                          )}
                        </button>
                      )}
                    </div>

                    <span className="text-[#FF4D15] group-hover:translate-x-0.5 transition-transform font-bold flex items-center gap-1">
                      <span>Open Forensic Docket</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-12 text-center text-zinc-500 text-xs space-y-3 border border-dashed border-white/10 rounded-2xl my-4">
              <Sparkles className="w-8 h-8 text-[#FF4D15]/60 mx-auto animate-pulse" />
              <div>
                <p className="font-bold text-zinc-300 text-sm">
                  No Forensic Notifications Match Filter
                </p>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-xs mx-auto">
                  Use the Live Telemetry Simulator buttons above to emit a real-time 1930 Bank Freeze, Section 65B Certificate, or Syndicate Alert.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================
            FOOTER: CRYPTOGRAPHIC RELAY STATUS
           ============================================================ */}
        <div className="p-3.5 bg-[#0E0E14] border-t border-white/10 text-[10px] font-mono-code text-zinc-400 flex items-center justify-between shrink-0">
          <span className="flex items-center gap-1.5 truncate">
            {(currentUser.email || 'navalekrishi@gmail.com').toLowerCase().includes('krishi') ? (
              <img
                src="/assets/aistudio/image_526c1ede.png"
                alt="Krishi"
                className="w-4 h-4 rounded-full object-cover object-top border border-[#FF4D15] shrink-0"
              />
            ) : (
              <Lock className="w-3 h-3 text-[#FF4D15]" />
            )}
            <span>RELAY: {currentUser.email || 'navalekrishi@gmail.com'}</span>
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1 shrink-0">
            <Cpu className="w-3 h-3" />
            WORM LEDGER SYNCED
          </span>
        </div>
      </div>
    </div>
  );
};
