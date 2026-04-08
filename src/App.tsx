import React from 'react';
import { Search, MapPin, TrendingUp, Info, AlertTriangle, CheckCircle2, XCircle, Clock, Building2, Navigation, School, Stethoscope, Bus, Train } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateIntelligence } from './services/gemini';
import { LocationIntelligence } from './types';
import { cn } from './utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import ReactMarkdown from 'react-markdown';

function PricingChart({ data }: { data: { label: string, value: number }[] }) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: -20, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#14141420" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="label" 
            type="category" 
            width={80} 
            tick={{ fontSize: 10, fill: '#141414' }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: '#14141410' }}
            contentStyle={{ backgroundColor: '#141414', color: '#E4E3E0', border: 'none', fontSize: '12px' }}
          />
          <Bar dataKey="value" fill="#141414" radius={[0, 2, 2, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function MapPlaceholder({ lat, lng, area, satellite = false, year = 2025 }: { lat: number, lng: number, area: string, satellite?: boolean, year?: number }) {
  return (
    <div className="relative w-full h-full bg-[#141414] overflow-hidden group">
      {/* Simulated Map Grid / Satellite View */}
      {satellite ? (
        <div className="absolute inset-0 bg-[#0a0a0a]">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at center, #1a1a1a 0%, #000 100%)',
          }} />
          {/* Simulated Rooftop Density */}
          <div className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            year === 2020 ? "opacity-30" : "opacity-80"
          )}>
            <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")'
            }} />
            {/* Simulated "Rooftops" as dots */}
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-4 p-8">
              {Array.from({ length: year === 2020 ? 40 : 100 }).map((_, i) => (
                <div key={i} className="w-2 h-2 bg-white/20 rounded-sm" style={{
                  transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random()})`,
                  marginTop: `${Math.random() * 20}px`,
                  marginLeft: `${Math.random() * 20}px`
                }} />
              ))}
            </div>
          </div>
          <div className="absolute top-4 left-4 text-[10px] font-mono text-white/40 uppercase tracking-widest">Satellite Mode (Simulated)</div>
        </div>
      ) : (
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: 'radial-gradient(#E4E3E0 1px, transparent 1px)', 
          backgroundSize: '20px 20px' 
        }} />
      )}
      
      {/* Center Marker */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-white/20 rounded-full animate-ping" />
          <div className="relative bg-white p-2 rounded-full shadow-lg">
            <MapPin className="text-[#141414]" size={20} />
          </div>
        </div>
      </div>

      {/* Info Overlay */}
      <div className="absolute bottom-4 left-4 right-4 bg-white p-3 border border-[#141414] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] flex justify-between items-center">
        <div>
          <div className="text-[10px] font-mono uppercase opacity-50">Coordinates</div>
          <div className="text-xs font-bold">{lat.toFixed(4)}°N, {lng.toFixed(4)}°E</div>
        </div>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-mono uppercase font-bold underline hover:opacity-70"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [report, setReport] = React.useState<LocationIntelligence | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [mapMode, setMapMode] = React.useState<'map' | 'satellite'>('map');
  const [satelliteYear, setSatelliteYear] = React.useState<2020 | 2025>(2025);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await generateIntelligence(query);
      setReport(data);
    } catch (err) {
      console.error(err);
      setError('Failed to generate intelligence report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Header */}
      <header className="border-b border-[#141414] p-6 flex justify-between items-center sticky top-0 bg-[#E4E3E0]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#141414] rounded-sm flex items-center justify-center text-[#E4E3E0] font-bold">H</div>
          <h1 className="text-xl font-bold tracking-tighter uppercase">HydSight</h1>
        </div>
        <div className="text-[10px] uppercase tracking-widest opacity-50 font-mono hidden sm:block">
          Hyderabad Real Estate Intelligence Engine v1.2
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-12">
        {/* Hero Search */}
        <section className={cn(
          "transition-all duration-700 ease-in-out",
          report ? "py-8" : "py-32 flex flex-col items-center text-center"
        )}>
          {!report && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 space-y-4"
            >
              <h2 className="text-6xl sm:text-8xl font-serif italic tracking-tighter leading-none">
                Know before <br /> you buy.
              </h2>
              <p className="text-lg opacity-60 max-w-xl mx-auto">
                Hyderabad's only data-backed research tool for land and property investment.
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSearch} className="w-full max-w-2xl relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search area (e.g., Shadnagar, Tellapur, Adibatla...)"
              className="w-full bg-transparent border-b-2 border-[#141414] py-4 px-2 text-2xl focus:outline-none placeholder:opacity-20 font-serif italic"
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-2 bottom-4 p-2 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors rounded-full"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-current border-t-transparent animate-spin rounded-full" />
              ) : (
                <Search size={24} />
              )}
            </button>
          </form>
        </section>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center gap-3 text-red-700"
            >
              <AlertTriangle size={20} />
              <p>{error}</p>
            </motion.div>
          )}

          {report && (
            <motion.div
              key={report.areaName}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Overview & Summary */}
              <div className="lg:col-span-8 space-y-8">
                {/* Main Card */}
                <div className="border border-[#141414] p-8 space-y-6 bg-white shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest opacity-50">
                        <MapPin size={10} />
                        {report.growthCorridor} Corridor • {report.authority} • {report.demographics.adminRank}
                      </div>
                      <h3 className="text-4xl font-serif italic">{report.areaName}</h3>
                    </div>
                    <div className="flex gap-2">
                      <div className="px-3 py-1 border border-[#141414] bg-[#141414] text-[#E4E3E0] text-[10px] font-bold uppercase tracking-widest">
                        {report.ringZone}
                      </div>
                      <div className="px-3 py-1 border border-[#141414] bg-white text-[#141414] text-[10px] font-bold uppercase tracking-widest">
                        {report.investment.developmentPhase}
                      </div>
                    </div>
                  </div>

                  <div className="prose prose-sm max-w-none">
                    <p className="text-xl leading-relaxed font-medium">
                      {report.verdict}
                    </p>
                    <div className="mt-4 opacity-70">
                      <ReactMarkdown>{report.summary}</ReactMarkdown>
                    </div>
                  </div>

                  {/* Property Specific Analysis */}
                  {report.propertySpecifics?.isSpecificAddress && (
                    <div className="bg-amber-50 border border-amber-200 p-6 space-y-4">
                      <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-widest">
                        <Info size={14} />
                        Hyper-Local Property Analysis
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <div className="text-[10px] font-mono uppercase opacity-50">Frontage Road Width</div>
                          <div className="text-lg font-bold text-amber-900">{report.propertySpecifics.frontageRoadWidth}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-mono uppercase opacity-50">Land Use Zone</div>
                          <div className="text-lg font-bold text-amber-900">{report.propertySpecifics.landUseZone}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] font-mono uppercase opacity-50">Immediate Landmarks</div>
                          <div className="flex flex-wrap gap-1">
                            {report.propertySpecifics.nearbyLandmarks?.map((l, i) => (
                              <span key={i} className="text-[10px] bg-amber-200/50 px-2 py-0.5 rounded-full text-amber-900">{l}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Demographics & Strategic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[#141414]/10">
                    <div>
                      <span className="text-[10px] font-mono uppercase opacity-50 block mb-1">Population</span>
                      <span className="text-sm font-bold">{report.demographics.population}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase opacity-50 block mb-1">Zoning Type</span>
                      <span className="text-sm font-bold">{report.demographics.zoningType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase opacity-50 block mb-1">Economic Cluster</span>
                      <span className="text-sm font-bold">{report.economicDrivers.cluster}</span>
                    </div>
                  </div>
                </div>

                {/* School Density Widget */}
                <div className="border border-[#141414] p-6 bg-white shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] flex items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono uppercase tracking-widest opacity-50 flex items-center gap-2">
                      <School size={14} />
                      School Density Analysis
                    </h4>
                    <p className="text-sm opacity-70">{report.schoolStats.context}</p>
                    <div className="text-[10px] font-mono uppercase opacity-40">Coverage: {report.schoolStats.radius}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-serif italic text-[#141414]">{report.schoolStats.count}</div>
                    <div className="text-[10px] font-mono uppercase opacity-50">Schools Identified</div>
                  </div>
                </div>

                {/* Strategic Analysis: Three-Point Strategy */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-widest opacity-50 flex items-center gap-2">
                    <TrendingUp size={14} />
                    Strategic Analysis (Three-Point Strategy)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-[#141414] p-5 bg-white space-y-3">
                      <div className="text-[10px] font-mono uppercase opacity-50">Highway Intersections</div>
                      <div className="flex flex-wrap gap-2">
                        {report.strategicAnalysis.highwayIntersections.map((h, i) => (
                          <span key={i} className="px-2 py-1 bg-[#141414]/5 text-[10px] font-bold border border-[#141414]/10">{h}</span>
                        ))}
                      </div>
                    </div>
                    <div className="border border-[#141414] p-5 bg-white space-y-3">
                      <div className="text-[10px] font-mono uppercase opacity-50">Nearest Urban Hub</div>
                      <div className="text-sm font-bold">{report.strategicAnalysis.nearestBigTown.name} ({report.strategicAnalysis.nearestBigTown.distance})</div>
                      <div className="flex flex-wrap gap-1">
                        {report.strategicAnalysis.nearestBigTown.facilities.map((f, i) => (
                          <span key={i} className="text-[9px] opacity-60">#{f}</span>
                        ))}
                      </div>
                    </div>
                    <div className="border border-[#141414] p-5 bg-white space-y-3">
                      <div className="text-[10px] font-mono uppercase opacity-50">Growth Run Rate</div>
                      <div className="text-sm font-bold text-emerald-600">{report.strategicAnalysis.growthRunRate.expansionPercentage}</div>
                      <p className="text-[10px] opacity-60 leading-tight">{report.strategicAnalysis.growthRunRate.description}</p>
                    </div>
                  </div>
                </div>

                {/* Satellite Comparison UI */}
                <div className="border border-[#141414] bg-white overflow-hidden shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
                  <div className="p-4 border-b border-[#141414] flex justify-between items-center bg-[#141414] text-[#E4E3E0]">
                    <h4 className="text-xs font-mono uppercase tracking-widest opacity-70">"Visible Growth" Satellite Comparison</h4>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setMapMode('satellite'); setSatelliteYear(2020); }}
                        className={cn("px-3 py-1 text-[10px] font-bold uppercase border border-[#E4E3E0]", satelliteYear === 2020 ? "bg-[#E4E3E0] text-[#141414]" : "bg-transparent text-[#E4E3E0]")}
                      >2020</button>
                      <button 
                        onClick={() => { setMapMode('satellite'); setSatelliteYear(2025); }}
                        className={cn("px-3 py-1 text-[10px] font-bold uppercase border border-[#E4E3E0]", satelliteYear === 2025 ? "bg-[#E4E3E0] text-[#141414]" : "bg-transparent text-[#E4E3E0]")}
                      >2025</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-7 relative h-80 border-r border-[#141414]">
                      <MapPlaceholder lat={report.coordinates.lat} lng={report.coordinates.lng} area={report.areaName} satellite={true} year={satelliteYear} />
                      <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 text-[10px] font-bold border border-[#141414] uppercase tracking-tighter">
                        {satelliteYear} Rooftop Density
                      </div>
                    </div>
                    <div className="md:col-span-5 p-6 space-y-4 bg-[#E4E3E0]/30">
                      <div className="space-y-2">
                        <div className="text-[10px] font-mono uppercase opacity-50">Visual Expansion Report</div>
                        <div className="text-2xl font-serif italic text-emerald-600">{report.strategicAnalysis.growthRunRate.expansionPercentage} Growth</div>
                        <p className="text-xs leading-relaxed opacity-70">{report.strategicAnalysis.growthRunRate.visualChange2020vs2025}</p>
                      </div>
                      <div className="pt-4 border-t border-[#141414]/10">
                        <div className="text-[10px] font-mono uppercase opacity-50 mb-2">Absorption Analysis</div>
                        <p className="text-[10px] leading-tight opacity-60">{report.strategicAnalysis.growthRunRate.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Livability: Schools & Hospitals */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-widest opacity-50 flex items-center gap-2">
                    <School size={14} />
                    Livability Check (5km Radius)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Schools */}
                    <div className="border border-[#141414] bg-white p-6 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-[#141414]/10 pb-2">
                        <School size={14} className="text-blue-600" />
                        Educational Institutions
                      </div>
                      <div className="space-y-4">
                        {report.economicDrivers.socialInfrastructure.schools.map((school, i) => (
                          <div key={i} className="flex justify-between items-start group">
                            <div className="space-y-0.5">
                              <div className="text-sm font-bold group-hover:underline cursor-default">{school.name}</div>
                              <div className="text-[10px] opacity-50 uppercase">{school.type}</div>
                            </div>
                            <div className="text-xs font-mono bg-[#141414]/5 px-2 py-1 border border-[#141414]/10">{school.distance}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Hospitals */}
                    <div className="border border-[#141414] bg-white p-6 space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-[#141414]/10 pb-2">
                        <Stethoscope size={14} className="text-red-600" />
                        Clinics & Hospitals
                      </div>
                      <div className="space-y-4">
                        {report.economicDrivers.socialInfrastructure.hospitals.map((hospital, i) => (
                          <div key={i} className="flex justify-between items-start group">
                            <div className="space-y-0.5">
                              <div className="text-sm font-bold group-hover:underline cursor-default">{hospital.name}</div>
                              <div className="text-[10px] opacity-50 uppercase">{hospital.specialty}</div>
                            </div>
                            <div className="text-xs font-mono bg-[#141414]/5 px-2 py-1 border border-[#141414]/10">{hospital.distance}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Public Transport & Commute */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-widest opacity-50 flex items-center gap-2">
                    <Bus size={14} />
                    Public Transport & Commute
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border border-[#141414] bg-white p-4 space-y-2">
                      <Bus size={18} className="opacity-30" />
                      <div className="text-[10px] font-mono uppercase opacity-50">Bus Stop</div>
                      <div className="text-sm font-bold leading-tight">{report.transport.busStop.name}</div>
                      <div className="text-xs opacity-60">{report.transport.busStop.distance}</div>
                    </div>
                    <div className="border border-[#141414] bg-white p-4 space-y-2">
                      <Train size={18} className="opacity-30" />
                      <div className="text-[10px] font-mono uppercase opacity-50">Metro Station</div>
                      <div className="text-sm font-bold leading-tight">{report.transport.metroStation.name}</div>
                      <div className="text-[10px] opacity-60 uppercase">{report.transport.metroStation.line} • {report.transport.metroStation.distance}</div>
                    </div>
                    <div className="border border-[#141414] bg-white p-4 space-y-2">
                      <Train size={18} className="opacity-30" />
                      <div className="text-[10px] font-mono uppercase opacity-50">MMTS Station</div>
                      <div className="text-sm font-bold leading-tight">{report.transport.mmtsStation.name}</div>
                      <div className="text-[10px] opacity-60 uppercase">{report.transport.mmtsStation.status} • {report.transport.mmtsStation.distance}</div>
                    </div>
                    <div className="border border-[#141414] bg-white p-4 space-y-2">
                      <Train size={18} className="opacity-30" />
                      <div className="text-[10px] font-mono uppercase opacity-50">Railway Station</div>
                      <div className="text-sm font-bold leading-tight">{report.transport.railwayStation.name}</div>
                      <div className="text-xs opacity-60">{report.transport.railwayStation.distance}</div>
                    </div>
                  </div>
                </div>

                {/* Infrastructure Milestones */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-widest opacity-50 flex items-center gap-2">
                    <Info size={14} />
                    Project Realization Status
                  </h4>
                  <div className="border border-[#141414] bg-white divide-y divide-[#141414]">
                    {report.infrastructureMilestones.map((m, i) => (
                      <div key={i} className="p-4 flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="text-sm font-bold">{m.milestone}</div>
                          {m.date && <div className="text-[10px] opacity-50">{m.date}</div>}
                        </div>
                        <span className={cn(
                          "text-[9px] px-2 py-1 font-bold uppercase border border-[#141414]",
                          m.status === 'Completed' ? "bg-emerald-100 text-emerald-700" : 
                          m.status === 'In Progress' ? "bg-blue-100 text-blue-700" : "bg-white text-[#141414]"
                        )}>
                          {m.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* News Signals */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-widest opacity-50 flex items-center gap-2">
                    <TrendingUp size={14} />
                    News & Government Buzz
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.newsSignals.map((signal, i) => (
                      <div key={i} className="border border-[#141414] p-4 space-y-2 bg-white/50">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono opacity-50">{signal.date} {signal.source && `• ${signal.source}`}</span>
                          <span className={cn(
                            "text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase",
                            signal.impact === 'Positive' ? "bg-emerald-100 text-emerald-700" : 
                            signal.impact === 'Negative' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                          )}>
                            {signal.impact}
                          </span>
                        </div>
                        <h5 className="font-bold text-sm">{signal.title}</h5>
                        <p className="text-xs opacity-70 leading-relaxed">{signal.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Stats & Pricing */}
              <div className="lg:col-span-4 space-y-8">
                {/* Growth Score */}
                <div className="border border-[#141414] p-6 space-y-6 bg-white shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
                  <div className="flex justify-between items-end">
                    <h4 className="text-xs font-mono uppercase tracking-widest opacity-50">Visible Growth Score</h4>
                    <span className="text-6xl font-serif italic leading-none">{report.growthScore.total}<span className="text-xl opacity-30">/10</span></span>
                  </div>
                  
                  <div className="space-y-4">
                    {report.growthScore.factors.map((factor, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold">{factor.name}</span>
                          <span className="font-mono">{factor.score}/10</span>
                        </div>
                        <div className="h-1 bg-[#141414]/10">
                          <div 
                            className="h-full bg-[#141414]" 
                            style={{ width: `${factor.score * 10}%` }}
                          />
                        </div>
                        <p className="text-[10px] opacity-60">{factor.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Analysis */}
                <div className="border border-[#141414] p-6 space-y-6 bg-[#141414] text-[#E4E3E0] shadow-[8px_8px_0px_0px_rgba(20,20,20,0.2)]">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-mono uppercase tracking-widest opacity-50">Fair Price Estimate</h4>
                    {report.pricing.isOverpriced && (
                      <div className="flex items-center gap-1 text-red-400 text-[10px] font-bold uppercase animate-pulse">
                        <AlertTriangle size={12} />
                        Overpriced
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="text-3xl font-serif italic">
                      ₹{report.pricing.fairRange.min.toLocaleString()} - ₹{report.pricing.fairRange.max.toLocaleString()}
                    </div>
                    <div className="text-[10px] font-mono opacity-50 uppercase tracking-widest">Per Square Yard</div>
                  </div>

                  <div className="pt-4 border-t border-[#E4E3E0]/20 space-y-6">
                    <PricingChart data={report.pricing.breakdown} />
                    <div className="space-y-3">
                      {report.pricing.breakdown.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="opacity-60">{item.label}</span>
                          <span className="font-mono">₹{item.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Investment Summary */}
                <div className="border border-[#141414] p-6 space-y-6 bg-white shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
                  <h4 className="text-xs font-mono uppercase tracking-widest opacity-50">Investment Strategy</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#141414] text-[#E4E3E0] rounded-sm">
                        <Clock size={16} />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase opacity-50">Horizon</div>
                        <div className="text-sm font-bold">{report.investment.horizon}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#141414] text-[#E4E3E0] rounded-sm">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase opacity-50">Best Asset Type</div>
                        <div className="text-sm font-bold">{report.investment.recommendedType}</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#141414]/10">
                      <p className="text-xs italic opacity-70 leading-relaxed">
                        "{report.investment.strategy}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Economic & Industrial Drivers */}
                <div className="border border-[#141414] p-6 space-y-6 bg-white shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
                  <h4 className="text-xs font-mono uppercase tracking-widest opacity-50">Economic & Industrial Drivers</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono uppercase opacity-50">Anchor Institutions</div>
                      <div className="flex flex-wrap gap-2">
                        {report.economicDrivers.anchors.map((a, i) => (
                          <span key={i} className="text-xs font-bold px-2 py-1 border border-[#141414]/10 bg-[#141414]/5">{a}</span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono uppercase opacity-50">Malls & Retail</div>
                      <div className="text-sm font-bold">{report.economicDrivers.socialInfrastructure.malls}</div>
                    </div>
                    <div className="pt-2 border-t border-[#141414]/10">
                      <div className="text-[10px] font-mono uppercase opacity-50 mb-1">Industrial Growth</div>
                      <p className="text-[10px] opacity-70 leading-relaxed">{report.economicDrivers.industrialGrowth}</p>
                    </div>
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="border border-[#141414] p-4 bg-emerald-50 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-widest">
                      <CheckCircle2 size={14} />
                      Advantages
                    </div>
                    <ul className="space-y-1">
                      {report.pros.map((pro, i) => (
                        <li key={i} className="text-xs text-emerald-900/70 flex gap-2">
                          <span>•</span> {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border border-[#141414] p-4 bg-red-50 space-y-2">
                    <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-widest">
                      <XCircle size={14} />
                      Risk Factors
                    </div>
                    <ul className="space-y-1">
                      {report.cons.map((con, i) => (
                        <li key={i} className="text-xs text-red-900/70 flex gap-2">
                          <span>•</span> {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#141414] p-12 mt-24 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#141414] rounded-sm flex items-center justify-center text-[#E4E3E0] text-xs font-bold">H</div>
              <h1 className="text-lg font-bold tracking-tighter uppercase">HydSight</h1>
            </div>
            <p className="text-sm opacity-60 max-w-sm">
              HydSight is an independent research platform. We do not sell real estate or represent developers. 
              Our reports are generated using AI-driven analysis of public data and market trends.
            </p>
          </div>
          <div className="flex flex-col md:items-end justify-end space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-widest opacity-30">
              Data Sources: HMDA Master Plan 2050, RERA Telangana, Market Surveys
            </div>
            <div className="text-[10px] font-mono uppercase tracking-widest opacity-30">
              © 2026 HydSight Intelligence Engine
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
