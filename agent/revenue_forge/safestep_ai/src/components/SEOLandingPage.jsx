import { useState, useEffect } from 'react';
import Generator from './Generator';

export default function SEOLandingPage({ trade, city, state, onBack }) {
    const [showGenerator, setShowGenerator] = useState(false);

    // Initial Data for the generator pre-fill
    const initialData = {
        companyName: '',
        trade: trade || 'HVAC',
        safetyOfficer: '',
        startDate: new Date().toISOString().split('T')[0]
    };

    if (showGenerator) {
        return <Generator initialData={initialData} onBack={() => setShowGenerator(false)} />;
    }

    return (
        <div className="min-h-screen bg-white font-sans text-brand-black">
            {/* Sticky Nav */}
            <nav className="sticky top-0 z-50 bg-brand-black text-white border-b-4 border-brand-yellow shadow-lg">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={onBack}>
                        <div className="w-8 h-8 bg-brand-yellow text-brand-black rounded-sm flex items-center justify-center font-black text-lg skew-x-[-10deg]">
                            <span className="skew-x-[10deg]">T</span>
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase italic hidden sm:inline">TurboToolbox</span>
                    </div>
                    <button
                        onClick={() => setShowGenerator(true)}
                        className="bg-brand-yellow text-brand-black px-4 py-2 rounded-sm font-bold uppercase tracking-wider hover:bg-yellow-400 transition text-sm"
                    >
                        Get {trade} Topics ($5)
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="py-20 px-4 text-center bg-gray-50 border-b border-gray-200">
                <div className="max-w-4xl mx-auto">
                    <span className="inline-block bg-red-100 text-red-600 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-widest mb-4">
                        Attention {city} {trade} Contractors
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase leading-tight">
                        Free <span className="text-brand-yellow bg-black px-2">{trade}</span> Toolbox Talks <br />
                        For <span className="underline decoration-4 decoration-brand-yellow">{city}, {state}</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Don't let a random OSHA inspector in <strong>{city}</strong> handle you a $16,131 fine.
                        Get a compliant, {state}-specific safety schedule in 30 seconds.
                    </p>
                    <button
                        onClick={() => setShowGenerator(true)}
                        className="px-8 py-4 bg-brand-yellow text-brand-black text-lg font-black uppercase rounded-sm shadow-lg hover:translate-y-px transition"
                    >
                        Generate {city} Schedule
                    </button>
                    <p className="mt-4 text-sm text-gray-400">
                        Includes specific topics for {trade} crews in {state}.
                    </p>
                </div>
            </header>

            {/* Localized Value Props */}
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-black mb-6 uppercase">Why {city} Crews Need This</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <span className="text-green-500 font-bold text-xl mr-3">✓</span>
                                <div>
                                    <strong className="block text-lg">Avoid {state} OSHA Fines</strong>
                                    <p className="text-gray-600">Local enforcement is ramping up in {city}. One missing signature costs $16k.</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 font-bold text-xl mr-3">✓</span>
                                <div>
                                    <strong className="block text-lg">Specific to {trade}</strong>
                                    <p className="text-gray-600">Don't use generic junk. Get topics like "Heat Stress in {state}" and "{trade} Hazards".</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 font-bold text-xl mr-3">✓</span>
                                <div>
                                    <strong className="block text-lg">Print & Go</strong>
                                    <p className="text-gray-600">Download the PDF, print it, and put it in the truck. Done for 2025.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-gray-100 p-8 border-2 border-gray-200 rotate-2 transform">
                        <div className="text-center mb-4">
                            <h3 className="font-bold uppercase text-gray-500 tracking-widest">{city} Weather Alert</h3>
                            <div className="text-5xl my-2">☀️</div>
                            <p className="font-bold text-gray-800">High Risk Season</p>
                        </div>
                        <div className="space-y-2 text-sm font-mono bg-white p-4 border border-gray-300">
                            <p className="border-b pb-2"><strong>Topic:</strong> Heat Illness Prevention ({state} Regs)</p>
                            <p className="border-b pb-2"><strong>Topic:</strong> {trade} Specific PPE</p>
                            <p className="border-b pb-2"><strong>Topic:</strong> Hydration Strategies</p>
                            <p><strong>Topic:</strong> Emergency Response in {city}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-brand-black text-gray-500 py-8 text-center text-sm">
                <p>&copy; 2025 TurboToolbox. Serving {city}, {state} and beyond.</p>
            </footer>
        </div>
    );
}
