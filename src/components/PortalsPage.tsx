import React, { useState } from 'react';
import { GLOBAL_PORTALS } from '../data/portals';
import { 
  Globe, 
  ExternalLink, 
  Phone, 
  Search, 
  ShieldCheck, 
  Building, 
  Filter, 
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';

export const PortalsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJurisdiction, setFilterJurisdiction] = useState<'all' | 'India' | 'Global'>('all');

  const filteredPortals = GLOBAL_PORTALS.filter((portal) => {
    const matchesSearch = 
      portal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portal.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portal.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portal.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portal.verifiedGovDomain.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesJurisdiction = 
      filterJurisdiction === 'all' || portal.jurisdiction === filterJurisdiction;

    return matchesSearch && matchesJurisdiction;
  });

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2">
            Verified Sovereign Law Enforcement Hubs
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950">
            Global Cybercrime Reporting Portals
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Direct, verified links to official government cyber defense portals. Top 7 sovereign Indian portals and leading global international police networks for immediate incident reporting and asset freezing.
          </p>

          {/* Search & Jurisdiction Filter Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search portal, country, or crime type..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200/90 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
              />
            </div>

            {/* Jurisdiction Segmented Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-full text-xs font-medium text-slate-600">
              <button
                onClick={() => setFilterJurisdiction('all')}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  filterJurisdiction === 'all'
                    ? 'bg-white text-slate-900 font-semibold shadow-sm'
                    : 'hover:text-slate-900'
                }`}
              >
                All Portals ({GLOBAL_PORTALS.length})
              </button>
              <button
                onClick={() => setFilterJurisdiction('India')}
                className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                  filterJurisdiction === 'India'
                    ? 'bg-white text-slate-900 font-semibold shadow-sm'
                    : 'hover:text-slate-900'
                }`}
              >
                <span>🇮🇳 Top 7 India</span>
              </button>
              <button
                onClick={() => setFilterJurisdiction('Global')}
                className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                  filterJurisdiction === 'Global'
                    ? 'bg-white text-slate-900 font-semibold shadow-sm'
                    : 'hover:text-slate-900'
                }`}
              >
                <span>🌐 Global ({GLOBAL_PORTALS.filter(p => p.jurisdiction === 'Global').length})</span>
              </button>
            </div>

          </div>
        </div>

        {/* Indian Priority Section Notice if All or India */}
        {filterJurisdiction !== 'Global' && !searchQuery && (
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 tracking-wide uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
              <span>Primary Indian Government Portals (Top 7)</span>
            </div>
            <span className="text-xs text-slate-500">MHA · MeitY · DoT · RBI · Delhi Police</span>
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortals.map((portal) => (
            <div
              key={portal.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Card Top: Jurisdiction & Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                    portal.jurisdiction === 'India'
                      ? 'bg-orange-50 text-orange-700 border border-orange-200/60'
                      : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                  }`}>
                    {portal.jurisdiction === 'India' ? '🇮🇳 India' : `🌐 ${portal.country}`}
                  </span>
                  <span className="text-[10px] font-mono-code text-slate-400">
                    {portal.verifiedGovDomain}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-base font-bold text-slate-950 group-hover:text-rose-600 transition-colors leading-snug mb-1.5">
                  {portal.name}
                </h3>

                {/* Department */}
                <div className="text-[11px] text-slate-500 font-medium leading-relaxed mb-3 flex items-start gap-1.5">
                  <Building className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                  <span>{portal.department}</span>
                </div>

                {/* Purpose / Why it is used */}
                <div className="text-xs text-slate-600 leading-relaxed mb-4">
                  <span className="font-semibold text-slate-800">Why it is used: </span>
                  {portal.purpose}
                </div>
              </div>

              {/* Card Bottom: Helpline & Redirect Button */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                {/* Contact Hotline */}
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <Phone className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="font-mono-code text-[11px] truncate">{portal.contactHotline}</span>
                </div>

                {/* Action Link: External Redirect */}
                <a
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-98"
                >
                  <span>Open Official Portal</span>
                  <ArrowUpRight className="w-4 h-4 text-rose-300" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredPortals.length === 0 && (
          <div className="text-center py-16 text-slate-500 text-sm">
            No reporting portal matched your search query. Try searching for "India", "FBI", or "Banking".
          </div>
        )}

      </div>
    </div>
  );
};
