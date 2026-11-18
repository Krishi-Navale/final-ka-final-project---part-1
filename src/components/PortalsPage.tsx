import React, { useState } from 'react';
import { GLOBAL_PORTALS } from '../data/portals';
import { Phone, Search, Building, ArrowUpRight } from 'lucide-react';
import { StaggeredGrid } from './effects/StaggeredGrid';
import { ScrollExpandBlock } from './effects/ScrollExpandBlock';
import { PageStudioHeader } from './effects/PageStudioHeader';
import { KineticMarquee } from './effects/KineticMarquee';

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

  const globalCount = GLOBAL_PORTALS.filter((p) => p.jurisdiction === 'Global').length;

  return (
    <div className="w-full bg-[#F5F5F7] text-[#0D0D10] min-h-screen font-sans">
      <PageStudioHeader
        kicker="Global Links · Verified Sovereign Cyber Units"
        title="Global Links. Verified nodes."
        subtitle="Direct, cryptographically verified routes to sovereign government cyber defense portals. Prioritize Top 7 Indian authorities or cross-border international bureaus."
        nodeLabel="MHA · MEITY · DOT · INTERPOL"
        showOrb
      >
        {/* Clean Editorial Search & Segmented Jurisdiction Bar (Stunixo Selected-Work Strip) */}
        <div className="pt-4 border-t border-black/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterJurisdiction('all')}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                filterJurisdiction === 'all'
                  ? 'bg-[#0D0D10] text-white shadow-sm'
                  : 'bg-white text-zinc-600 border border-black/10 hover:text-[#0D0D10]'
              }`}
            >
              All Portals ({GLOBAL_PORTALS.length})
            </button>
            <button
              onClick={() => setFilterJurisdiction('India')}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                filterJurisdiction === 'India'
                  ? 'bg-[#0D0D10] text-white shadow-sm'
                  : 'bg-white text-zinc-600 border border-black/10 hover:text-[#0D0D10]'
              }`}
            >
              🇮🇳 Top 7 India
            </button>
            <button
              onClick={() => setFilterJurisdiction('Global')}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                filterJurisdiction === 'Global'
                  ? 'bg-[#0D0D10] text-white shadow-sm'
                  : 'bg-white text-zinc-600 border border-black/10 hover:text-[#0D0D10]'
              }`}
            >
              🌐 Global ({globalCount})
            </button>
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search portal, jurisdiction, or crime vector..."
              className="w-full pl-11 pr-5 py-2.5 rounded-full border border-black/15 bg-white text-xs text-[#0D0D10] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#FF4D15] shadow-2xs"
            />
          </div>
        </div>
      </PageStudioHeader>

      <KineticMarquee
        theme="light"
        variant="band"
        items={[
          'SOVEREIGN INTAKE NODES',
          'MHA NCRP 1930',
          'DELHI IFSO UNIT',
          'RBI SACHET',
          'CROSS-BORDER DISPATCH',
        ]}
      />

      {/* Editorial Studio White Directory Grid */}
      <section className="w-full py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-black/10">
        <ScrollExpandBlock minScale={0.95} className="w-full space-y-8">
          {filterJurisdiction !== 'Global' && !searchQuery && (
            <div className="pb-4 border-b border-black/10 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-mono-code font-bold uppercase tracking-wider text-[#FF4D15]">
                Primary Sovereign Indian Portals · Priority Top 7
              </span>
              <span className="font-mono-code text-zinc-500">
                MHA · MeitY · DoT · RBI · Delhi Police
              </span>
            </div>
          )}

          <StaggeredGrid
            staggerMs={70}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPortals.map((portal, index) => (
              <div
                key={portal.id}
                className="p-7 rounded-3xl bg-[#F5F5F7] border border-black/10 hover:border-[#0D0D10] hover:bg-white transition-all flex flex-col justify-between group h-full"
              >
                <div>
                  {/* Clean unboxed editorial metadata header */}
                  <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-black/10 text-[11px] font-mono-code">
                    <span className="font-bold text-[#FF4D15]">
                      {String(index + 1).padStart(2, '0')} /{' '}
                      {portal.jurisdiction === 'India' ? '🇮🇳 India' : `🌐 ${portal.country}`}
                    </span>
                    <span className="text-zinc-500 truncate max-w-[160px]">
                      {portal.verifiedGovDomain}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0D0D10] group-hover:text-[#FF4D15] transition-colors leading-snug mb-2">
                    {portal.name}
                  </h3>

                  <div className="text-xs text-zinc-500 font-medium leading-relaxed mb-4 flex items-start gap-2">
                    <Building className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                    <span>{portal.department}</span>
                  </div>

                  <p className="text-xs sm:text-[13px] text-zinc-700 leading-relaxed mb-6">
                    <span className="font-semibold text-[#0D0D10]">Scope: </span>
                    {portal.purpose}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/10 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#0D0D10] bg-white p-3 rounded-2xl border border-black/10">
                    <Phone className="w-3.5 h-3.5 text-[#FF4D15] shrink-0" />
                    <span className="font-mono-code text-[11px] truncate">
                      {portal.contactHotline}
                    </span>
                  </div>

                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-5 rounded-full bg-[#0D0D10] hover:bg-[#FF4D15] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm whitespace-nowrap"
                  >
                    <span>Open Official Portal</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </StaggeredGrid>

          {filteredPortals.length === 0 && (
            <div className="p-16 text-center rounded-3xl bg-[#F5F5F7] border border-black/10 text-zinc-600 text-sm">
              No reporting portal matched your search query. Try searching for &ldquo;India&rdquo;, &ldquo;FBI&rdquo;, or &ldquo;Banking&rdquo;.
            </div>
          )}
        </ScrollExpandBlock>
      </section>
    </div>
  );
};
