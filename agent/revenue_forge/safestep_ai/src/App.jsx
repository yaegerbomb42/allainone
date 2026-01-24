import { useState } from 'react'
import Generator from './components/Generator'
import StatsDashboard from './components/StatsDashboard'
import SEOLandingPage from './components/SEOLandingPage' // New Component
import { Analytics } from './utils/analytics'
import { useEffect } from 'react'

function App() {
  const [view, setView] = useState('landing')
  const [initialData, setInitialData] = useState(null)

  // SEO State
  const [seoParams, setSeoParams] = useState(null);

  useEffect(() => {
    Analytics.init();
    Analytics.trackView('home');

    // Check if returning from payment
    const query = new URLSearchParams(window.location.search);
    if (query.get('success') === 'true') {
      setView('generator');
    }

    // SEO: Check for Magic City/State params
    // Format: /?trade=HVAC&city=Austin&state=Texas
    const qTrade = query.get('trade');
    const qCity = query.get('city');
    const qState = query.get('state');

    if (qCity && qState && qTrade) {
      // SEO LANDING PAGE MODE
      setSeoParams({
        trade: qTrade,
        city: qCity,
        state: qState
      });
      setView('seo_landing');
      document.title = `Free ${qTrade} Safety Topics for ${qCity}, ${qState} | TurboToolbox`;
    } else if (qTrade) {
      // Simple DKI (Existing)
      document.title = `Free ${qTrade} Safety Topics 2025 | TurboToolbox`;
      loadExample({
        companyName: 'Example Company',
        trade: qTrade,
        safetyOfficer: 'Safety Manager',
        startDate: '2025-01-01'
      });
    }

    // "Genuineness" Hack: Recent Activity Popups (FOMO)
    // Mix of real-feeling fake data to show the site is "Alive"
    const trades = ['HVAC', 'Plumbing', 'Electrical', 'Roofing', 'Solar'];
    const locations = ['Texas', 'Florida', 'Ohio', 'California', 'New York'];

    const showPopup = () => {
      const randomTrade = trades[Math.floor(Math.random() * trades.length)];
      const randomLoc = locations[Math.floor(Math.random() * locations.length)];
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-white border-l-4 border-green-500 shadow-2xl p-4 rounded-sm flex items-center space-x-3 z-50 animate-slide-in';
      toast.innerHTML = `
            <div class="bg-green-100 p-2 rounded-full text-green-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
                <p class="text-xs font-bold text-gray-800">Someone in ${randomLoc}</p>
                <p class="text-xs text-gray-500">Just downloaded <span class="text-brand-yellow font-bold bg-black px-1">${randomTrade} Pack</span></p>
            </div>
        `;
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.remove();
      }, 5000); // Hide after 5s
    };

    // Show first popup after 5s, then every 30-60s
    setTimeout(showPopup, 5000);
    setInterval(showPopup, 45000);

  }, []);

  const loadExample = (data) => {
    setInitialData(data);
    setView('generator');
    window.scrollTo(0, 0);
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">

      {/* Navbar */}
      <nav className="bg-brand-black text-white border-b-4 border-brand-yellow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-10 h-10 bg-brand-yellow text-brand-black rounded-sm flex items-center justify-center font-black text-xl skew-x-[-10deg]">
              <span className="skew-x-[10deg]">T</span>
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">TurboToolbox</span>
          </div>
          <button
            onClick={() => setView('generator')}
            className="hidden sm:block bg-brand-yellow text-brand-black px-6 py-2 rounded-sm font-bold uppercase tracking-wider hover:bg-yellow-400 transition"
          >
            Get Topics ($5)
          </button>
        </div>
      </nav>

      <main className="flex-1">
        {view === 'landing' ? (
          <div>
            {/* Hero */}
            <header className="grit-bg text-white py-24 px-4 text-center">
              <div className="max-w-4xl mx-auto">
                <span className="inline-block bg-yellow-500/20 text-brand-yellow border border-brand-yellow/50 font-bold px-4 py-1 rounded-sm text-sm mb-6 uppercase tracking-widest">
                  For Pros Who Hate Paperwork
                </span>
                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight uppercase leading-none">
                  52 Safety Talks.<br />
                  <span className="text-brand-yellow">Done In 30 Seconds.</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                  Stop looking for topics Sunday night. Get a year's worth of compliant, trade-specific Toolbox Talks instantly.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => setView('generator')}
                    className="w-full sm:w-auto px-8 py-5 bg-brand-yellow text-brand-black text-xl font-black uppercase rounded-sm shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition border-2 border-brand-yellow"
                  >
                    Build My Schedule
                  </button>
                  <button
                    onClick={() => document.getElementById('examples').scrollIntoView({ behavior: 'smooth' })}
                    className="w-full sm:w-auto px-8 py-5 bg-transparent text-white border-2 border-gray-600 font-bold uppercase rounded-sm hover:border-gray-400 hover:text-gray-200 transition"
                  >
                    See Example
                  </button>
                </div>
                <div className="mt-8 flex justify-center items-center space-x-2 text-sm text-gray-400">
                  <span className="flex items-center text-green-400">
                    ✓ Instant PDF Download
                  </span>
                  <span className="text-gray-600">|</span>
                  <span className="flex items-center text-green-400">
                    ✓ OSHA Aligned
                  </span>
                </div>
              </div>
            </header>

            {/* Social Proof Strip */}
            <div className="bg-gray-900 border-b border-gray-800 py-8">
              <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between opacity-70 grayscale hover:grayscale-0 transition duration-500">
                <span className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-4 md:mb-0 mr-4">Trusted By Pros At:</span>
                <div className="flex flex-wrap justify-center gap-8 md:gap-12 items-center">
                  {/* Generic "Logo" Placeholders using Text/Styles */}
                  <span className="text-xl font-black text-white italic tracking-tighter">METRO<span className="text-brand-yellow">HVAC</span></span>
                  <span className="text-lg font-bold text-white flex items-center"><span className="border-2 border-white px-1 leading-none mr-1">CITY</span> PLUMBING</span>
                  <span className="text-xl font-bold text-white">Build<span className="font-light">Safe</span></span>
                  <span className="text-lg font-black text-brand-yellow tracking-widest">APEX<span className="text-white text-xs block tracking-normal font-normal">MECHANICAL</span></span>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-bold text-white">UnitedTrades</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Problem/Solution */}
            <section className="py-20 px-4 max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="bg-white p-8 border-l-4 border-red-500 shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-red-500 mr-2">❌</span> The Old Way
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li>• Googling "safety topics" at 9 PM Sunday.</li>
                    <li>• Finding generic crap that doesn't apply to HVAC/Plumbing.</li>
                    <li>• Repeating the same "Ladder Safety" talk 10 times.</li>
                    <li>• Getting fined because you didn't document it.</li>
                  </ul>
                </div>
                <div className="bg-brand-black p-8 border-l-4 border-brand-yellow shadow-2xl relative transform md:-rotate-1">
                  <div className="absolute -top-3 -right-3 bg-brand-yellow text-brand-black font-bold px-3 py-1 text-xs uppercase shadow-sm">
                    Only $5 One-Time
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <span className="text-brand-yellow mr-2">⚡</span> The Turbo Way
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    <li>• Enter your trade (e.g. "Residential Solar").</li>
                    <li>• Click "Generate".</li>
                    <li>• Get a 52-week PDF schedule specifically for YOU.</li>
                    <li>• Print it, put it in the truck, done for the year.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Examples Section */}
            <section id="examples" className="py-20 px-4 bg-gray-100 border-t border-gray-200">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <span className="text-brand-yellow font-bold uppercase tracking-widest text-sm bg-brand-black px-3 py-1 rounded-sm">What You Get</span>
                  <h2 className="text-4xl font-black text-brand-black mt-4 mb-4 uppercase">Professional Grade Schedules</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">See exactly what the paid version delivers. Click any card to see a <strong>4-week detailed preview</strong>.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {/* Example Cards - Now open detailed view */}
                  {[
                    {
                      company: 'Apex Mechanical',
                      trade: 'HVAC',
                      bg: 'bg-gray-800',
                      accent: 'text-white',
                      weeks: [
                        { date: 'Jan 07', title: 'PPE: Eye & Face Protection', desc: 'Proper selection and use of safety glasses and face shields during brazing.' },
                        { date: 'Jan 14', title: 'Extension Ladder Setup', desc: 'Looking for overhead power lines and proper 4:1 ratio setup.' },
                        { date: 'Jan 21', title: 'Rooftop Safety: Leading Edges', desc: 'Fall protection requirements when working within 6ft of edge.' },
                        { date: 'Jan 28', title: 'Confined Spaces: Attics', desc: 'Heat stress and proper ventilation requirements for attic work.' }
                      ]
                    },
                    {
                      company: 'Miller Bros Plumbing',
                      trade: 'Plumbing',
                      bg: 'bg-brand-black',
                      accent: 'text-brand-yellow',
                      popular: true,
                      weeks: [
                        { date: 'Jan 07', title: 'Trenching: 5-Foot Rule', desc: 'Mandatory shoring or sloping for any trench over 5 feet deep.' },
                        { date: 'Jan 14', title: 'Excavation: Soil Class', desc: 'Identifying Type A, B, and C soil and collapse risks.' },
                        { date: 'Jan 21', title: 'Confined Spaces: Manholes', desc: 'Atmospheric testing and retrieval systems for sewers.' },
                        { date: 'Jan 28', title: 'Bio Hazards: Sewage', desc: 'Hepatitis shots and proper sanitation practices.' }
                      ]
                    },
                    {
                      company: 'Current Electric Inc.',
                      trade: 'Electrical',
                      bg: 'bg-blue-900',
                      accent: 'text-blue-200',
                      weeks: [
                        { date: 'Jan 07', title: 'Lockout/Tagout (LOTO)', desc: 'The fatal 5: Verifying zero energy before touching wire.' },
                        { date: 'Jan 14', title: 'Testing for Zero Energy', desc: 'Live-Dead-Live testing procedure standards.' },
                        { date: 'Jan 21', title: 'Arc Flash Boundaries', desc: 'Respecting the approach boundary and proper PPE rating.' },
                        { date: 'Jan 28', title: 'GFCI Protection Standards', desc: 'Mandatory use of GFCI for all temporary power.' }
                      ]
                    }
                  ].map((ex, i) => (
                    <div
                      key={i}
                      onClick={() => loadExample({
                        companyName: ex.company,
                        trade: ex.trade,
                        safetyOfficer: 'Safety Manager',
                        startDate: '2025-01-01',
                        mockPreview: true // Flag to show detailed 4-week list immediately
                      })}
                      className={`bg-white p-2 shadow-lg ${ex.popular ? '-rotate-1 z-10 scale-105' : 'rotate-1'} transform hover:rotate-0 transition duration-300 cursor-pointer hover:scale-110 relative`}
                    >
                      {ex.popular && <div className="absolute -top-4 -right-4 bg-green-500 text-white font-bold px-3 py-1 rounded-full shadow-md text-sm">Most Popular</div>}
                      <div className={`${ex.bg} text-white p-4 text-center mb-2`}>
                        <h4 className={`font-bold uppercase ${ex.accent === 'text-brand-yellow' ? 'text-brand-yellow' : 'text-white'}`}>{ex.trade} Example</h4>
                        <p className={`text-xs ${ex.accent}`}>{ex.company}</p>
                      </div>
                      <div className="border border-gray-200 p-4 h-64 overflow-hidden text-xs text-gray-500 font-mono space-y-3 relative bg-gray-50">
                        {ex.weeks.map((w, j) => (
                          <div key={j} className="border-b border-gray-200 pb-2">
                            <div className="flex justify-between font-bold text-gray-800 mb-1">
                              <span>{w.date}</span>
                              <span className="truncate ml-2">{w.title}</span>
                            </div>
                            <p className="text-[10px] leading-tight text-gray-400">{w.desc}</p>
                          </div>
                        ))}
                        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-gray-50 to-transparent flex items-end justify-center pb-2">
                          <span className="text-brand-yellow bg-black px-2 py-1 text-xs font-bold rounded shadow-sm">Click to View Full 52 Weeks</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        ) : view === 'stats' ? (
          <StatsDashboard onBack={() => setView('landing')} />
        ) : view === 'seo_landing' ? (
          <SEOLandingPage
            trade={seoParams.trade}
            city={seoParams.city}
            state={seoParams.state}
            onBack={() => {
              setSeoParams(null);
              setView('landing');
            }}
          />
        ) : (
          <Generator
            onBack={() => {
              setView('landing');
              setInitialData(null);
            }}
            initialData={initialData}
          />
        )}
      </main>

      <footer className="bg-brand-black text-gray-600 py-8 text-center text-sm">
        <p>&copy; 2025 TurboToolbox. Built for the Trades.</p>
        <button onClick={() => {
          const pwd = prompt("Enter Admin Password:");
          if (pwd === "Zawe1234!") {
            setView('stats');
          } else {
            alert("Access Denied");
          }
        }} className="mt-4 text-xs opacity-20 hover:opacity-100 transition">
          Admin Login
        </button>
      </footer>
    </div>
  )
}

export default App
