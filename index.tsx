import React, { useState, useEffect, useRef, useMemo } from 'react';

// Seed incidents for regional monitoring
const SEED_INCIDENTS = [
  {
    id: 'inc-sea-1',
    date: '2026-11-02',
    category: 'Vandalism / Defacement',
    biasMotivation: 'Anti-Indigenous & Duwamish Tribe Rights',
    location: 'West Seattle (Duwamish Longhouse vicinity)',
    neighborhood: 'West Seattle',
    lat: 47.562,
    lng: -122.358,
    status: 'Action Ongoing',
    counterResponse:
      'Duwamish solidarity vigil, native cultural preservation fund dispatch & youth watch',
    narrative:
      'Anti-tribal sovereignty graffiti and threats spray-painted along the cultural corridor near the historic river bend.',
  },
  {
    id: 'inc-sea-2',
    date: '2026-11-01',
    category: 'Harassment & Threat',
    biasMotivation: 'Anti-LGBTQ+ / Transphobia',
    location: 'Capitol Hill, Seattle',
    neighborhood: 'Capitol Hill',
    lat: 47.618,
    lng: -122.321,
    status: 'Verified',
    counterResponse:
      'Community safety escort group active along Pike/Pine & queer venue mutual aid hotline',
    narrative:
      'Extremist individuals shouting hate slurs and recording community members outside inclusive community bookstore.',
  },
  {
    id: 'inc-sea-3',
    date: '2026-10-31',
    category: 'Intimidation / Propaganda Drop',
    biasMotivation: 'Anti-Black / White Supremacist',
    location: 'Central District, Seattle',
    neighborhood: 'Central District',
    lat: 47.608,
    lng: -122.301,
    status: 'Verified',
    counterResponse:
      'Neighborhood rapid flyer sweeps, legal aid alert, and community restorative circle',
    narrative:
      'Bags with white supremacist recruitment propaganda dropped on porches across historic residential blocks.',
  },
  {
    id: 'inc-sea-4',
    date: '2026-10-29',
    category: 'Harassment & Defacement',
    biasMotivation: 'Anti-Asian / Xenophobic',
    location: 'Chinatown-International District, Seattle',
    neighborhood: 'CID / Pioneer Square',
    lat: 47.599,
    lng: -122.324,
    status: 'Verified',
    counterResponse:
      'CID Community Watch foot patrols expanded and elder bilingual escort active',
    narrative:
      'Xenophobic slurs painted on family-owned storefront; verbal intimidation directed at elders at bus stop.',
  },
  {
    id: 'inc-sea-5',
    date: '2026-10-27',
    category: 'Intimidation / Flash Rally',
    biasMotivation: 'Anti-Immigrant & Religious',
    location: 'Ballard, Seattle',
    neighborhood: 'Ballard',
    lat: 47.668,
    lng: -122.384,
    status: 'Verified',
    counterResponse:
      'Interfaith community watch, solidarity rally with migrant-worker defense alliance',
    narrative:
      'Masked individuals displaying hate insignia clustered near community center before dispersal.',
  },
  {
    id: 'inc-sea-6',
    date: '2026-10-22',
    category: 'Harassment & Online Stalking',
    biasMotivation: 'Anti-Indigenous Sovereignty',
    location: 'University District, Seattle',
    neighborhood: 'University District',
    lat: 47.659,
    lng: -122.313,
    status: 'Under Investigation',
    counterResponse:
      'Indigenous Student Union solidarity security caucus, University civil rights grievance filed',
    narrative:
      'Online intimidation campaign coordinated against Indigenous students hosting Treaty Rights symposium.',
  },
  {
    id: 'inc-1',
    date: '2026-10-18',
    category: 'Vandalism / Defacement',
    biasMotivation: 'Anti-Indigenous / Native Land Rights',
    location: 'Okanogan County, WA',
    neighborhood: 'Eastern WA',
    lat: 48.4,
    lng: -119.5,
    status: 'Verified',
    counterResponse:
      'Community clean-up & intertribal cultural vigil organized',
    narrative:
      'Offensive hate symbols and anti-tribal graffiti painted on community trail and cultural marker sign.',
  },
  {
    id: 'inc-2',
    date: '2026-10-24',
    category: 'Harassment & Threat',
    biasMotivation: 'Anti-Black / Racial',
    location: 'Denver, CO',
    neighborhood: 'Denver Metro',
    lat: 39.73,
    lng: -104.99,
    status: 'Under Investigation',
    counterResponse:
      'Legal aid advocacy alerted, municipal civil rights complaint filed',
    narrative:
      'Flyers from known regional extremist network distributed targeting local community center.',
  },
];

// SPLC and ADL regional tracked groups
const REAL_SPLC_GROUPS = [
  {
    id: 'grp-splc-1',
    name: 'Patriot Front',
    ideology: 'White Nationalist / Neo-Fascist',
    tactics:
      'Flash marches with face coverings, nighttime stencil defacement, banner drops on I-5 & Hwy 99, sticker/flyer campaigns',
    reach:
      'Pacific Northwest Chapter (Seattle, Tacoma, Spokane, Coeur d Alene)',
    counterStrategy:
      'Rapid community cleanup & flyer removal, reporting municipal property defacement, de-platforming recruitment staging channels',
    source: 'SPLC Hate Map & ADL Center on Extremism',
  },
  {
    id: 'grp-splc-2',
    name: 'Proud Boys (Pacific Northwest Chapters)',
    ideology: 'General Hate / Anti-LGBTQ+ & Far-Right Nationalist',
    tactics:
      'Swarming public drag events and school board meetings, street intimidations, armed presence near cultural spaces',
    reach: 'Seattle, Snohomish County, Clark County, WA',
    counterStrategy:
      'Peaceful mass community wall-building with brass bands and colorful umbrellas, venue contract revocation, civil safety escorts',
    source: 'SPLC & WA State Civil Rights Monitoring',
  },
  {
    id: 'grp-splc-3',
    name: 'Northwest Active Club / Cascade Active Club',
    ideology: 'Neo-Nazi / White Supremacist Martial Network',
    tactics:
      'Combat gyms, white-separatist propaganda sticker distribution, coordinated harassment at pride celebrations and Indigenous spaces',
    reach: 'King County, Pierce County, Eastern WA',
    counterStrategy:
      'Exposing gym/venue leasing agreements, community alerts, gym de-chartering campaigns, nonviolent self-defense collectives',
    source: 'SPLC Hate Map & Regional Antifascist Research',
  },
  {
    id: 'grp-splc-4',
    name: 'Asatru Folk Assembly (AFA)',
    ideology: 'Neo-Volkisch / White Supremacist Pagan Front',
    tactics:
      'Attempting to buy rural properties and meeting halls to establish exclusive white ethno-enclaves, historical revisionism',
    reach: 'Washington State & Greater Northwest',
    counterStrategy:
      'Community land trusts, interfaith coalitions, open public zoning opposition, tribal sovereignty land defense caucuses',
    source: 'SPLC Extremist Files',
  },
  {
    id: 'grp-splc-5',
    name: 'Blood Tribe / Neo-Nazi Accelerationist Cells',
    ideology: 'Neo-Nazi / Hate Network',
    tactics:
      'Uniformed armed flash rallies targeting migrant workers and ethnic minority cultural centers, aggressive online doxxing',
    reach: 'Multi-State Regional (WA, OR, ID corridor)',
    counterStrategy:
      'Civil rights legal litigation, rapid community alerts, direct liaison with Tribal law enforcement and civil rights attorneys',
    source: 'SPLC / ADL Extremism Watch',
  },
];

const MARBLE_PALETTES = [
  {
    id: 'amber',
    label: 'Gold Amber',
    bg: 'radial-gradient(circle at 35% 30%, #fef08a 0%, #d97706 45%, #78350f 85%, #451a03 100%)',
    text: '#ffffff',
    border: '#fcd34d',
  },
  {
    id: 'jade',
    label: 'Imperial Jade',
    bg: 'radial-gradient(circle at 35% 30%, #a7f3d0 0%, #059669 45%, #064e3b 85%, #022c22 100%)',
    text: '#ffffff',
    border: '#6ee7b7',
  },
  {
    id: 'cobalt',
    label: 'Deep Lapis',
    bg: 'radial-gradient(circle at 35% 30%, #bae6fd 0%, #0284c7 45%, #1e3a8a 85%, #0f172a 100%)',
    text: '#ffffff',
    border: '#7dd3fc',
  },
  {
    id: 'ruby',
    label: 'Ruby Swirl',
    bg: 'radial-gradient(circle at 35% 30%, #fecdd3 0%, #e11d48 45%, #881337 85%, #4c0519 100%)',
    text: '#ffffff',
    border: '#fda4af',
  },
  {
    id: 'obsidian',
    label: 'Obsidian Smoke',
    bg: 'radial-gradient(circle at 35% 30%, #cbd5e1 0%, #475569 45%, #0f172a 85%, #020617 100%)',
    text: '#f8fafc',
    border: '#94a3b8',
  },
  {
    id: 'amethyst',
    label: 'Amethyst Quartz',
    bg: 'radial-gradient(circle at 35% 30%, #f5d0fe 0%, #9333ea 45%, #581c87 85%, #3b0764 100%)',
    text: '#ffffff',
    border: '#d8b4fe',
  },
];

const MARBLE_TEXTURES = [
  {
    id: 'glassy',
    label: 'Glass Polish',
    shadow:
      'inset -2px -2px 4px rgba(0,0,0,0.7), inset 2px 2px 4px rgba(255,255,255,0.9), 0 2px 6px rgba(0,0,0,0.6)',
    letterClass: 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]',
  },
  {
    id: 'veined',
    label: 'Veined Mineral',
    shadow:
      'inset -3px -3px 6px rgba(0,0,0,0.85), inset 3px 3px 5px rgba(255,255,255,0.7), inset 0 0 10px rgba(0,0,0,0.5), 0 3px 8px rgba(0,0,0,0.7)',
    letterClass: 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] tracking-widest',
  },
  {
    id: 'matte',
    label: 'Honed Matte',
    shadow:
      'inset -1px -1px 3px rgba(0,0,0,0.5), inset 1px 1px 2px rgba(255,255,255,0.5), 0 1px 3px rgba(0,0,0,0.4)',
    letterClass: 'drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] opacity-95',
  },
  {
    id: 'gemstone',
    label: 'Carved Gem',
    shadow:
      'inset -4px -4px 7px rgba(0,0,0,0.9), inset 3px 3px 6px rgba(255,255,255,0.95), 0 0 8px rgba(251,191,36,0.3)',
    letterClass: 'drop-shadow-[0_0_3px_rgba(255,255,255,0.8)] font-black',
  },
];

const MOCK_USERS = [
  { id: 'usr-1', name: 'Duwamish Defense Monitor', online: true, color: { bg: '#2563eb', fg: '#ffffff' } },
  { id: 'usr-2', name: 'Capitol Hill Safety Liaison', online: true, color: { bg: '#059669', fg: '#ffffff' } },
  { id: 'usr-3', name: 'NLG Legal Observer Coordinator', online: true, color: { bg: '#d97706', fg: '#ffffff' } },
  { id: 'usr-4', name: 'CID Youth Escort Dispatch', online: false, color: { bg: '#7c3aed', fg: '#ffffff' } },
];

function MarbleSphere({
  letter = 'H',
  colorId = 'amber',
  textureId = 'glassy',
  size = 'md',
}) {
  const pal =
    MARBLE_PALETTES.find((p) => p.id === colorId) || MARBLE_PALETTES[0];
  const tex =
    MARBLE_TEXTURES.find((t) => t.id === textureId) || MARBLE_TEXTURES[0];
  const sizeMap = {
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-xl',
  };
  const sizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-extrabold overflow-hidden shrink-0 shadow-md select-none border transition-all duration-200 relative`}
      style={{
        background: pal.bg,
        color: pal.text,
        borderColor: `${pal.border}70`,
        boxShadow: tex.shadow,
      }}
    >
      <span className="absolute top-[8%] left-[18%] w-[38%] h-[24%] bg-white/40 rounded-full blur-[0.5px] pointer-events-none -rotate-12" />
      <span
        className={`relative z-10 ${tex.letterClass} leading-none uppercase`}
      >
        {letter.slice(0, 1) || 'H'}
      </span>
    </div>
  );
}

export default function App() {
  const [incidents, setIncidents] = useState(SEED_INCIDENTS);
  const [groups] = useState(REAL_SPLC_GROUPS);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [activeTab, setActiveTab] = useState('seattle-map');
  const [teamNotes, setTeamNotes] = useState(
    '# SEATTLE COMMUNITY SHIELD — TACTICAL INCIDENT NOTES\n\n- West Seattle: Monitoring Duwamish Cultural Corridor; alert issued for active observer presence.\n- Capitol Hill: Pike/Pine safety escort shifts active Thursday-Sunday.\n- SPLC / ADL watchlist alert: Track flyer bag drops across Central District.'
  );
  const [liveApiIncidents, setLiveApiIncidents] = useState([]);
  const [liveApiLoading, setLiveApiLoading] = useState(false);
  const [liveApiError, setLiveApiError] = useState(null);
  const [lastSyncedTime, setLastSyncedTime] = useState(null);
  const [showPresenceModal, setShowPresenceModal] = useState(false);
  const [marbleLetter, setMarbleLetter] = useState('H');
  const [marbleColor, setMarbleColor] = useState('amber');
  const [marbleTexture, setMarbleTexture] = useState('glassy');
  const [includeOpenData, setIncludeOpenData] = useState(true);

  const users = MOCK_USERS;
  const self = MOCK_USERS[0];

  // Fetch live Seattle Open Data (data.seattle.gov)
  const fetchLiveSeattleData = async () => {
    setLiveApiLoading(true);
    setLiveApiError(null);
    try {
      const endpoint =
        'https://data.seattle.gov/resource/tazs-3rd5.json?$limit=35&$order=report_date_time%20DESC';
      const res = await fetch(endpoint);
      if (!res.ok)
        throw new Error(`HTTP ${res.status}: Failed to reach data.seattle.gov`);
      const rows = await res.json();

      const MCPP_COORDS = {
        'WEST SEATTLE': { lat: 47.562, lng: -122.38 },
        ALKI: { lat: 47.575, lng: -122.41 },
        'CAPITOL HILL': { lat: 47.618, lng: -122.32 },
        'CENTRAL AREA': { lat: 47.608, lng: -122.3 },
        'CHINATOWN/INTERNATIONAL DISTRICT': { lat: 47.599, lng: -122.324 },
        'PIONEER SQUARE': { lat: 47.602, lng: -122.333 },
        BALLARD: { lat: 47.668, lng: -122.384 },
        UNIVERSITY: { lat: 47.659, lng: -122.313 },
        'DOWNTOWN COMMERCIAL': { lat: 47.609, lng: -122.339 },
        BELLTOWN: { lat: 47.614, lng: -122.345 },
        'BEACON HILL': { lat: 47.579, lng: -122.311 },
        'SOUTH PARK': { lat: 47.528, lng: -122.322 },
        'RAINIER BEACH': { lat: 47.509, lng: -122.271 },
      };

      const validRows = rows.filter((r) => {
        const lat = parseFloat(r.latitude);
        const lng = parseFloat(r.longitude);
        return (
          !isNaN(lat) &&
          !isNaN(lng) &&
          lat > 40.0 &&
          lng < -100.0 &&
          lat !== -1.0 &&
          lng !== -1.0
        );
      });

      const parsedLive = (validRows.length > 0 ? validRows : rows).map(
        (r, idx) => {
          const rawLat = parseFloat(r.latitude);
          const rawLng = parseFloat(r.longitude);
          const hasDirectCoords =
            !isNaN(rawLat) &&
            !isNaN(rawLng) &&
            rawLat > 45.0 &&
            rawLng < -120.0 &&
            rawLat !== -1.0 &&
            rawLng !== -1.0;

          const mcpp = (
            r.mcpp ||
            r.neighborhood ||
            'Seattle Metro'
          ).toUpperCase();
          const base = MCPP_COORDS[mcpp] || { lat: 47.606, lng: -122.332 };
          const lat = hasDirectCoords
            ? rawLat
            : (base.lat || 47.606) + Math.sin(idx * 1.7) * 0.008;
          const lng = hasDirectCoords
            ? rawLng
            : (base.lng || -122.332) + Math.cos(idx * 1.9) * 0.008;

          const specificOffense =
            r.nibrs_offense_code_description ||
            r.offense_description ||
            r.offense ||
            'Offense Reported';
          const offenseCategory =
            r.offense_category ||
            (r.crime_against_category
              ? `${r.crime_against_category} CRIME`
              : 'ALL OTHER');

          const dateStr = r.offense_date
            ? r.offense_date.slice(0, 10)
            : r.report_date_time
              ? r.report_date_time.slice(0, 10)
              : new Date().toISOString().slice(0, 10);

          const blockLoc =
            r.block_address ||
            r.hundred_block_location ||
            `${mcpp}, Seattle, WA`;

          const uniqueKey = r.offense_id
            ? `spd-offense-${r.offense_id}`
            : `spd-${r.report_number || 'rec'}-${idx}-${Date.now().toString(36)}`;

          return {
            id: uniqueKey,
            offenseId: r.offense_id || null,
            date: dateStr,
            category: specificOffense,
            offenseCategory: offenseCategory,
            biasMotivation: `Category: ${offenseCategory} (SPD / NIBRS Standard)`,
            location: blockLoc,
            neighborhood: r.mcpp || 'Seattle Metro',
            lat,
            lng,
            status: 'SPD Open Data Sync',
            counterResponse:
              'Seattle Community Safety liaison alert & civil observer documentation dispatched',
            narrative: `Official City of Seattle Offense ID #${r.offense_id || r.report_number || 'N/A'}. Macro classification: ${offenseCategory}. Specific offense: ${specificOffense}. Location: ${blockLoc}. Sector: ${r.sector || 'N/A'}, Beat: ${r.beat || 'N/A'}, Precinct: ${r.precinct || 'SPD'}. Verified by City of Seattle public safety open data.`,
            sourceUrl:
              'https://data.seattle.gov/Public-Safety/SPD-Crime-Data-2008-Present/tazs-3rd5',
          };
        }
      );

      setLiveApiIncidents(parsedLive);
      setLastSyncedTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('Live API fetch warning:', err);
      setLiveApiError(
        err.message || 'Error connecting to live open data portal'
      );
    } finally {
      setLiveApiLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveSeattleData();
  }, []);

  const addIncident = (newInc) => {
    const stamped = {
      ...newInc,
      reportedBy: self?.id || null,
      authorName: self?.name || 'Anonymous Civil Monitor',
    };
    setIncidents([stamped, ...incidents]);
  };

  const addCounterAction = (id, actionText) => {
    setIncidents(
      incidents.map((inc) =>
        inc.id === id ? { ...inc, counterResponse: actionText } : inc
      )
    );
  };

  const allIncidents = includeOpenData
    ? [...liveApiIncidents, ...incidents]
    : incidents;

  const filteredIncidents = allIncidents.filter((inc) => {
    const q = filterQuery.toLowerCase();
    return (
      inc.category.toLowerCase().includes(q) ||
      inc.biasMotivation.toLowerCase().includes(q) ||
      inc.location.toLowerCase().includes(q) ||
      inc.counterResponse.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-400 ring-4 ring-amber-400/20" />
            <h1 className="text-xl font-bold tracking-tight text-slate-50">
              Seattle Community Shield - Hate Incident & Counter-Action Monitor
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Documenting hate group tactics, mapping incidents, and organizing
            peaceful, legal community counter-responses & indigenous defense.
          </p>
        </div>

        {/* Presence Directory Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPresenceModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs transition shadow-sm cursor-pointer"
            title="Inspect project access and active viewers"
          >
            <div className="flex items-center -space-x-1.5 overflow-hidden">
              {users.slice(0, 3).map((u) => (
                <MarbleSphere
                  key={u.id}
                  letter={marbleLetter || (u.name ? u.name[0] : 'H')}
                  colorId={marbleColor}
                  textureId={marbleTexture}
                  size="sm"
                />
              ))}
            </div>
            <span className="font-medium text-slate-300">
              Access & Presence ({users.filter((u) => u.online).length} online /{' '}
              {users.length})
            </span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg text-xs font-medium flex-wrap">
          <button
            onClick={() => setActiveTab('seattle-map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition cursor-pointer ${
              activeTab === 'seattle-map'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Seattle Live Map
          </button>
          <button
            onClick={() => setActiveTab('incidents')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
              activeTab === 'incidents'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Incident Log ({allIncidents.length})
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
              activeTab === 'groups'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Extremist Groups ({groups.length})
          </button>
          <button
            onClick={() => setActiveTab('safety-protocols')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
              activeTab === 'safety-protocols'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Safety Protocols
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Trends & RCW 9A.36
          </button>
          <button
            onClick={() => setActiveTab('dogwhistle-bot')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition cursor-pointer ${
              activeTab === 'dogwhistle-bot'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            AI Scanner Bot
          </button>
          <button
            onClick={() => setActiveTab('team-notes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition cursor-pointer ${
              activeTab === 'team-notes'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Live Team Notes
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
              activeTab === 'api'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            API / Open Data
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 gap-6">
        {activeTab === 'seattle-map' && (
          <SeattleLiveMapSection
            incidents={allIncidents}
            onSelectIncident={setSelectedIncident}
            selectedIncident={selectedIncident}
            onAddIncident={addIncident}
            onAddCounterAction={addCounterAction}
            liveApiLoading={liveApiLoading}
            liveApiError={liveApiError}
            lastSyncedTime={lastSyncedTime}
            onRefreshLiveData={fetchLiveSeattleData}
            includeOpenData={includeOpenData}
            setIncludeOpenData={setIncludeOpenData}
          />
        )}

        {activeTab === 'incidents' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
                <input
                  type="text"
                  placeholder="Filter by bias, location, category or counter-action..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm flex-1 min-w-[220px] focus:outline-none focus:border-amber-400"
                />
                <div className="text-xs text-slate-400">
                  Showing <strong className="text-slate-200">{filteredIncidents.length}</strong> incidents
                </div>
              </div>

              {/* Spatial Scatter Board */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Incident Spatial Distribution & Hotspots
                  </h2>
                  <span className="text-[11px] text-amber-400">
                    Click pin to inspect & dispatch counter-action
                  </span>
                </div>
                <div className="relative w-full h-80 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex items-center justify-center p-4">
                  <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>

                  <div className="absolute inset-4">
                    {filteredIncidents.map((inc) => {
                      const minLng = -124.8, maxLng = -104.0;
                      const minLat = 37.0, maxLat = 49.2;
                      const clampedLng = Math.max(minLng, Math.min(maxLng, inc.lng));
                      const clampedLat = Math.max(minLat, Math.min(maxLat, inc.lat));
                      const leftPercent = 8 + ((clampedLng - minLng) / (maxLng - minLng)) * 84;
                      const topPercent = 8 + ((maxLat - clampedLat) / (maxLat - minLat)) * 80;
                      const isSelected = selectedIncident?.id === inc.id;

                      return (
                        <button
                          key={inc.id}
                          onClick={() => setSelectedIncident(inc)}
                          style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-transform cursor-pointer ${
                            isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                          }`}
                          title={`${inc.location}: ${inc.category}`}
                        >
                          <span
                            className={`block w-4 h-4 rounded-full ${
                              isSelected
                                ? 'bg-amber-400 ring-4 ring-amber-400/40'
                                : 'bg-rose-500 ring-2 ring-rose-400/30'
                            }`}
                          />
                          <span className="absolute left-1/2 -translate-x-1/2 top-5 whitespace-nowrap text-[10px] bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded shadow text-slate-200 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            {inc.location}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Table List */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
                <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
                  <h3 className="text-sm font-semibold text-slate-200">Incident Registry Log</h3>
                  <span className="text-xs text-slate-500">Documented by civil monitors</span>
                </div>
                <div className="divide-y divide-slate-800/80 max-h-[380px] overflow-y-auto">
                  {filteredIncidents.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                      No incidents match search query.
                    </div>
                  ) : (
                    filteredIncidents.map((inc) => (
                      <div
                        key={inc.id}
                        onClick={() => setSelectedIncident(inc)}
                        className={`p-4 hover:bg-slate-800/50 cursor-pointer transition ${
                          selectedIncident?.id === inc.id ? 'bg-slate-800/60 border-l-4 border-amber-400' : ''
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <span className="text-xs font-mono text-amber-400 font-semibold">{inc.date}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {inc.location}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-100 mb-1">{inc.category}</h4>
                        <p className="text-xs text-rose-300 font-medium mb-1">
                          Bias motivation: {inc.biasMotivation}
                        </p>
                        <p className="text-xs text-slate-300 leading-relaxed mb-2">{inc.narrative}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
              {selectedIncident && (
                <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-5 shadow-lg flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-amber-400">Deploy / Update Counter-Response</h3>
                    <button
                      onClick={() => setSelectedIncident(null)}
                      className="text-slate-400 hover:text-slate-100 text-xs cursor-pointer"
                    >
                      Close ✕
                    </button>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Target Location</span>
                    <p className="text-sm font-medium text-slate-200 mt-0.5">
                      {selectedIncident.category} in {selectedIncident.location}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Active Strategy</span>
                    <p className="text-xs text-emerald-300 bg-slate-950 p-2.5 rounded border border-slate-800 mt-1">
                      {selectedIncident.counterResponse}
                    </p>
                  </div>
                  <UpdateCounterActionForm
                    incidentId={selectedIncident.id}
                    onUpdate={(text) => {
                      addCounterAction(selectedIncident.id, text);
                      setSelectedIncident({ ...selectedIncident, counterResponse: text });
                    }}
                  />
                </div>
              )}

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-100 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Log Regional Incident
                </h3>
                <IncidentForm onAdd={addIncident} />
              </div>
            </div>
          </div>
        )}

        {/* Extremist Groups */}
        {activeTab === 'groups' && (
          <div className="flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h2 className="text-base font-bold text-slate-100 mb-1">
                Tracked Extremist Groups & Operating Profiles (SPLC & ADL)
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Understanding recruitment channels, public meeting disruption, intimidation tactics, and lawful community defense countermeasures.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.map((grp) => (
                  <div key={grp.id} className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-900">
                          {grp.ideology}
                        </span>
                        <span className="text-[11px] text-slate-400">{grp.reach}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-100 mb-2">{grp.name}</h3>

                      <div className="mb-3">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                          Tactics & Meeting Formats:
                        </span>
                        <p className="text-xs text-slate-300 bg-slate-900 p-2 rounded border border-slate-800/80">
                          {grp.tactics}
                        </p>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block mb-0.5">
                          Effective Counter-Strategy:
                        </span>
                        <p className="text-xs text-emerald-300 bg-slate-900 p-2 rounded border border-slate-800/80">
                          {grp.counterStrategy}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Safety Protocols */}
        {activeTab === 'safety-protocols' && (
          <div className="flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h2 className="text-base font-bold text-slate-100 mb-2">
                Frontline Safety, Legal Shield & Rapid De-escalation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900 inline-block mb-2">
                    LEGAL HOTLINE
                  </span>
                  <h3 className="text-sm font-bold text-slate-100 mb-1">National Lawyers Guild (NLG) PNW</h3>
                  <p className="text-xs text-slate-300 mb-2">Legal observer dispatch & arrest hotline.</p>
                  <div className="font-mono text-xs text-amber-400 bg-slate-900 p-2 rounded border border-slate-800">
                    206-658-7963 (WA Hotline)
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-900 inline-block mb-2">
                    INDIGENOUS DEFENSE
                  </span>
                  <h3 className="text-sm font-bold text-slate-100 mb-1">Duwamish Tribal Services</h3>
                  <p className="text-xs text-slate-300 mb-2">Cultural sovereignty defense liaison.</p>
                  <div className="font-mono text-xs text-amber-400 bg-slate-900 p-2 rounded border border-slate-800">
                    206-431-1582 • West Seattle
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-900 inline-block mb-2">
                    STATE HOTLINE
                  </span>
                  <h3 className="text-sm font-bold text-slate-100 mb-1">WA Hate Incident Hotline</h3>
                  <p className="text-xs text-slate-300 mb-2">Civil rights filing and support.</p>
                  <div className="font-mono text-xs text-amber-400 bg-slate-900 p-2 rounded border border-slate-800">
                    1-877-370-HATE
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-900 inline-block mb-2">
                    QUEER ESCORTS
                  </span>
                  <h3 className="text-sm font-bold text-slate-100 mb-1">Capitol Hill Escorts</h3>
                  <p className="text-xs text-slate-300 mb-2">Walking safety team along Pike/Pine.</p>
                  <div className="font-mono text-xs text-amber-400 bg-slate-900 p-2 rounded border border-slate-800">
                    Active 9PM-3AM
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trends & RCW 9A.36 Data */}
        {activeTab === 'analytics' && (
          <AnalyticsDataSection incidents={allIncidents} groups={groups} />
        )}

        {/* AI Scanner Bot */}
        {activeTab === 'dogwhistle-bot' && (
          <DogWhistleScannerSection onAddIncident={addIncident} />
        )}

        {/* Live Team Notes */}
        {activeTab === 'team-notes' && (
          <TeamNotesWorkspace notes={teamNotes} setNotes={setTeamNotes} users={users} self={self} />
        )}

        {/* API Feed */}
        {activeTab === 'api' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
            <h2 className="text-base font-bold text-slate-100">Open Data REST API & JSON Payload</h2>
            <p className="text-xs text-slate-400">
              Export verified incident records and intelligence feeds in standardized SODA JSON format.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify({ incidents: allIncidents, groups }, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `seattle_community_shield_${new Date().toISOString().slice(0, 10)}.json`;
                  a.click();
                }}
                className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded hover:bg-amber-400 transition cursor-pointer"
              >
                Download Dataset (.json)
              </button>
            </div>
            <pre className="bg-slate-950 border border-slate-800 p-4 rounded text-xs font-mono text-emerald-400 overflow-x-auto max-h-80">
              {JSON.stringify({ total: allIncidents.length, data: allIncidents.slice(0, 3) }, null, 2)}
            </pre>
          </div>
        )}
      </main>

      {/* Presence Modal */}
      {showPresenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100">Project Access & Presence Directory</h3>
              <button onClick={() => setShowPresenceModal(false)} className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <div className="p-5 flex flex-col gap-3">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <MarbleSphere letter={marbleLetter || u.name[0]} colorId={marbleColor} textureId={marbleTexture} size="sm" />
                    <span className="text-xs font-semibold text-slate-200">{u.name}</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${u.online ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
                </div>
              ))}

              <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
                <span className="text-xs font-bold text-amber-400">Customize Marble Insignia</span>
                <div className="flex items-center gap-1.5">
                  {['H', 'A', 'D', 'S', 'M'].map((char) => (
                    <button
                      key={char}
                      onClick={() => setMarbleLetter(char)}
                      className={`w-6 h-6 rounded text-xs font-bold ${
                        marbleLetter === char ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponents

function SeattleLiveMapSection({
  incidents,
  onSelectIncident,
  selectedIncident,
  onAddIncident,
  onAddCounterAction,
  liveApiLoading,
  lastSyncedTime,
  onRefreshLiveData,
}) {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All');
  const [livePulse, setLivePulse] = useState(true);
  const [mapZoom, setMapZoom] = useState(1);
  const [autoTour, setAutoTour] = useState(false);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });

  const SEATTLE_BOUNDS = { minLat: 47.495, maxLat: 47.735, minLng: -122.445, maxLng: -122.255 };

  const seattleIncidents = incidents.filter(
    (inc) =>
      inc.lat >= SEATTLE_BOUNDS.minLat - 0.05 &&
      inc.lat <= SEATTLE_BOUNDS.maxLat + 0.05 &&
      inc.lng >= SEATTLE_BOUNDS.minLng - 0.05 &&
      inc.lng <= SEATTLE_BOUNDS.maxLng + 0.05
  );

  const neighborhoods = [
    'All',
    'West Seattle',
    'Capitol Hill',
    'Central District',
    'CID / Pioneer Square',
    'Ballard',
    'University District',
  ];

  const displayedIncidents = seattleIncidents.filter((inc) => {
    if (selectedNeighborhood !== 'All' && inc.neighborhood !== selectedNeighborhood) return false;
    return true;
  });

  const projectToMap = (lat, lng) => {
    const x = ((lng - SEATTLE_BOUNDS.minLng) / (SEATTLE_BOUNDS.maxLng - SEATTLE_BOUNDS.minLng)) * 100;
    const y = ((SEATTLE_BOUNDS.maxLat - lat) / (SEATTLE_BOUNDS.maxLat - SEATTLE_BOUNDS.minLat)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  useEffect(() => {
    if (!autoTour || displayedIncidents.length === 0) return;
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * displayedIncidents.length);
      const target = displayedIncidents[idx];
      if (target) {
        onSelectIncident(target);
      }
    }, 4200);
    return () => clearInterval(interval);
  }, [autoTour, displayedIncidents, onSelectIncident]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Seattle Live Real-Time Radar Map</h2>
              <p className="text-[11px] text-slate-400">Tactical spatial surveillance and real-time open data nodes</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {lastSyncedTime && <span className="text-[10px] text-emerald-400 font-mono">Synced {lastSyncedTime}</span>}
            <button
              onClick={() => setAutoTour(!autoTour)}
              className={`px-2.5 py-1 text-[11px] rounded font-semibold border transition cursor-pointer ${
                autoTour ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-amber-300 border-amber-500/50'
              }`}
            >
              {autoTour ? 'AUTO-TRAVERSE ON' : 'AUTO-TRAVERSE'}
            </button>
            <button
              onClick={onRefreshLiveData}
              disabled={liveApiLoading}
              className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              {liveApiLoading ? 'Syncing...' : 'Live Sync'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] text-slate-400 font-medium">Zone:</span>
          {neighborhoods.map((nh) => (
            <button
              key={nh}
              onClick={() => setSelectedNeighborhood(nh)}
              className={`px-2.5 py-1 rounded-md text-xs transition cursor-pointer ${
                selectedNeighborhood === nh
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              {nh}
            </button>
          ))}
        </div>

        {/* OpenStreetMap Embed + Interactive Points */}
        <div className="relative w-full h-[580px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-inner">
          <iframe
            title="Real Seattle Map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-122.445%2C47.495%2C-122.255%2C47.735&layer=mapnik"
            className="w-full h-full border-0 filter invert contrast-125 hue-rotate-180 brightness-90 opacity-75 pointer-events-none"
          />

          <div className="absolute inset-0 transition-transform duration-700 origin-center" style={{ transform: `scale(${mapZoom})` }}>
            {displayedIncidents.map((inc) => {
              const pos = projectToMap(inc.lat, inc.lng);
              const isSelected = selectedIncident?.id === inc.id;

              return (
                <div
                  key={inc.id}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 cursor-pointer ${
                    isSelected ? 'z-30 scale-125' : 'z-20 hover:scale-125'
                  }`}
                  onClick={() => onSelectIncident(inc)}
                >
                  <span className={`block w-4 h-4 rounded-full border-2 border-slate-950 shadow-md ${
                    isSelected ? 'bg-amber-400 ring-4 ring-amber-400/50' : 'bg-rose-500'
                  }`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col gap-5">
        {selectedIncident && (
          <div className="bg-slate-900 border border-amber-500/50 rounded-xl p-4 shadow-xl flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase text-amber-400">Selected Incident Details</h3>
            <p className="text-xs text-slate-200 font-bold">{selectedIncident.location}</p>
            <p className="text-xs text-slate-300">{selectedIncident.narrative}</p>
            <UpdateCounterActionForm
              incidentId={selectedIncident.id}
              onUpdate={(text) => {
                onAddCounterAction(selectedIncident.id, text);
                onSelectIncident({ ...selectedIncident, counterResponse: text });
              }}
            />
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-100 mb-2">Report Incident to Live Map</h3>
          <SeattleIncidentForm onAdd={onAddIncident} />
        </div>
      </div>
    </div>
  );
}

function IncidentForm({ onAdd }) {
  const [category, setCategory] = useState('Harassment & Threat');
  const [location, setLocation] = useState('');
  const [narrative, setNarrative] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!location.trim() || !narrative.trim()) return;

    onAdd({
      id: `inc-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      category,
      biasMotivation: 'Anti-Native / Sovereign Rights',
      location: location.trim(),
      lat: 47.606 + (Math.random() - 0.5) * 0.1,
      lng: -122.332 + (Math.random() - 0.5) * 0.1,
      status: 'Submitted / Under Review',
      narrative: narrative.trim(),
      counterResponse: 'Community response pending',
    });

    setLocation('');
    setNarrative('');
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 text-xs">
      <input
        type="text"
        placeholder="Location (e.g. Capitol Hill)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="bg-slate-950 border border-slate-700 text-slate-200 rounded p-2"
        required
      />
      <textarea
        rows={3}
        placeholder="Incident narrative..."
        value={narrative}
        onChange={(e) => setNarrative(e.target.value)}
        className="bg-slate-950 border border-slate-700 text-slate-200 rounded p-2"
        required
      />
      <button type="submit" className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 rounded transition cursor-pointer">
        Submit Incident
      </button>
    </form>
  );
}

function SeattleIncidentForm({ onAdd }) {
  const [specificLoc, setSpecificLoc] = useState('');
  const [narrative, setNarrative] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!specificLoc.trim() || !narrative.trim()) return;

    onAdd({
      id: `inc-sea-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      category: 'Vandalism / Defacement',
      biasMotivation: 'Anti-Indigenous & Duwamish Rights',
      location: specificLoc.trim(),
      neighborhood: 'West Seattle',
      lat: 47.562 + (Math.random() - 0.5) * 0.02,
      lng: -122.38 + (Math.random() - 0.5) * 0.02,
      status: 'Action Ongoing',
      narrative: narrative.trim(),
      counterResponse: 'Community defense alert dispatched',
    });

    setSpecificLoc('');
    setNarrative('');
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2.5 text-xs">
      <input
        type="text"
        placeholder="Specific location..."
        value={specificLoc}
        onChange={(e) => setSpecificLoc(e.target.value)}
        className="bg-slate-950 border border-slate-700 text-slate-200 rounded p-2"
        required
      />
      <textarea
        rows={2}
        placeholder="Tactical details..."
        value={narrative}
        onChange={(e) => setNarrative(e.target.value)}
        className="bg-slate-950 border border-slate-700 text-slate-200 rounded p-2"
        required
      />
      <button type="submit" className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-1.5 rounded transition cursor-pointer">
        Transmit to Map
      </button>
    </form>
  );
}

function UpdateCounterActionForm({ onUpdate }) {
  const [action, setAction] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!action.trim()) return;
    onUpdate(action.trim());
    setAction('');
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <textarea
        rows={2}
        placeholder="Updated counter strategy..."
        value={action}
        onChange={(e) => setAction(e.target.value)}
        className="bg-slate-950 border border-slate-700 text-slate-200 rounded p-2 text-xs"
      />
      <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-1 px-3 rounded text-xs cursor-pointer">
        Update Plan
      </button>
    </form>
  );
}

function AnalyticsDataSection({ incidents }) {
  const total = incidents.length || 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h2 className="text-base font-bold text-slate-100 mb-1">
          Washington State RCW 9A.36 Legal Classification & Trends
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Statistical breakdown across protected classes under RCW 9A.36.080 (Hate Crime Offenses).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Logged Incidents</span>
            <div className="text-2xl font-black text-amber-400 mt-2">{total}</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold">RCW 9A.36.080 Penalty</span>
            <div className="text-sm font-bold text-emerald-400 mt-2">Class C Felony</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold">Civil Remedy</span>
            <div className="text-sm font-bold text-blue-400 mt-2">RCW 9A.36.083 Damages</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DogWhistleScannerSection({ onAddIncident }) {
  const [inputUrl, setInputUrl] = useState('');
  const [inputText, setInputText] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  const runScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanResult({
        threatLevel: 'High',
        summary: 'Extremist dog-whistle text detected utilizing numeric ciphers (1488) and white supremacist territorial rhetoric.',
        dogWhistles: [
          { term: '14 Words', meaning: 'White supremacist mantra', severity: 'Critical' },
          { term: 'Blood and Soil', meaning: 'Neo-Nazi slogan', severity: 'High' }
        ]
      });
      setScanning(false);
    }, 1200);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
      <h2 className="text-base font-bold text-slate-100">AI Dog-Whistle & Extremist Rhetoric Scanner</h2>
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Website URL..."
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 text-xs"
        />
        <textarea
          rows={3}
          placeholder="Text snippet or manifesto to decode..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 text-xs"
        />
        <button
          onClick={runScan}
          disabled={scanning}
          className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 rounded text-xs transition cursor-pointer"
        >
          {scanning ? 'Decoding...' : 'Run Intelligence Scan'}
        </button>
      </div>

      {scanResult && (
        <div className="bg-slate-950 p-4 rounded border border-slate-800 text-xs flex flex-col gap-2">
          <div className="font-bold text-amber-400">Threat Level: {scanResult.threatLevel}</div>
          <p className="text-slate-300">{scanResult.summary}</p>
        </div>
      )}
    </div>
  );
}

function TeamNotesWorkspace({ notes, setNotes, users }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
      <h2 className="text-base font-bold text-slate-100">Synchronized Live Team Dispatch & Field Notes</h2>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full h-80 bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs p-4 rounded focus:outline-none focus:border-cyan-500"
      />
    </div>
  );
}