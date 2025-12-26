import { useState, useEffect } from 'react'
import { jsPDF } from 'jspdf'
import confetti from 'canvas-confetti'
import { generatePDF } from '../utils/pdfGenerator'
import { getDatabase, ref, push } from 'firebase/database'
import { app } from '../utils/analytics' // Reuse existing firebase app


// Real AI Topics (Fallback)
import AI_TOPICS_RAW from '../data/real_ai_topics.json'


// Real Stripe Payment Link for TurboToolbox
const PAYMENT_LINK = "https://buy.stripe.com/8x25kv9fD6Fs50hb0FaIM00"

export default function Generator({ onBack, initialData }) {
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1) // 1=Input, 2=Preview
    const [isPaid, setIsPaid] = useState(false)

    const [formData, setFormData] = useState({
        companyName: '',
        trade: 'HVAC',
        email: '',
        safetyOfficer: '',
        startDate: new Date().toISOString().split('T')[0]
    })

    // Topics State
    // Prioritize AI Topics if they exist and match trade, otherwise fallback
    const [fetchedTopics, setFetchedTopics] = useState(null);

    const [loadingText, setLoadingText] = useState("Initializing AI...");

    const loadingMessages = [
        "Analyzing Trade Hazards...",
        "identifying Critical Risks...",
        "Drafting Foreman Scripts...",
        " Formatting Checklists...",
        "Finalizing OSHA Codes...",
        "Generating PDF..."
    ];

    useEffect(() => {
        let interval;
        if (loading) {
            let i = 0;
            setLoadingText(loadingMessages[0]);
            interval = setInterval(() => {
                i = (i + 1) % loadingMessages.length;
                setLoadingText(loadingMessages[i]);
            }, 2500); // Change every 2.5s
        }
        return () => clearInterval(interval);
    }, [loading]);

    const generatePreview = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Call Serverless API
            const response = await fetch('/api/generate_topics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trade: formData.trade,
                    companyName: formData.companyName
                })
            });

            const data = await response.json();
            if (data.topics && Array.isArray(data.topics)) {
                setFetchedTopics(data.topics);
                if (data.source) console.log(`Generated via: ${data.source}`);
            } else {
                setFetchedTopics(getTopics());
            }
        } catch (err) {
            console.error("Generation Failed, using local:", err);
            setFetchedTopics(getTopics());
        }

        setLoading(false)
        setStep(2)
    }

    // Check for success param on mount
    useEffect(() => {
        const query = new URLSearchParams(window.location.search)
        if (query.get('success') === 'true') {
            const savedOrder = localStorage.getItem('turbo_pending_order');

            if (savedOrder) {
                try {
                    const { formData: savedForm, topics: savedTopics } = JSON.parse(savedOrder);
                    setFormData(savedForm);
                    if (JSON.parse(savedOrder).topics) {
                        setFetchedTopics(JSON.parse(savedOrder).topics);
                    }

                    setStep(2)
                    setIsPaid(true)
                    triggerConfetti()

                    // SAVE ORDER TO FIREBASE (New)
                    try {
                        const db = getDatabase(app);
                        const ordersRef = ref(db, 'orders');
                        // Use a flag to prevent double-save on strict mode re-renders
                        if (!sessionStorage.getItem('order_saved_' + Date.now().toString().substring(0, 5))) {
                            push(ordersRef, {
                                company: savedForm.companyName,
                                trade: savedForm.trade,
                                officer: savedForm.safetyOfficer || 'N/A',
                                date: new Date().toISOString(),
                                email: savedForm.email || 'N/A',
                                amount: 29,
                                topics: savedTopics || topics // Critical for historical accuracy
                            });
                            sessionStorage.setItem('order_saved', 'true');
                        }
                    } catch (err) {
                        console.error("Firebase Save Error:", err);
                    }

                    setTimeout(() => generatePDF(savedForm, savedTopics || topics), 1500)
                } catch (e) {
                    console.error("Error restoring session:", e);
                    onBack();
                }
            } else {
                window.location.href = '/';
            }
        }
    }, [])

    // Reset when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData(initialData)
            setStep(1)
        }
    }, [initialData])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };





    // Fallback logic
    const getTopics = () => {
        return AI_TOPICS_RAW || [];
    }

    // Use fetched topics if available, else fallback
    const topics = (fetchedTopics || getTopics()).slice(0, 52);

    const handleBuyClick = () => {
        // Security: Save state so we can verify/generate on return
        localStorage.setItem('turbo_pending_order', JSON.stringify({
            formData,
            topics
        }));
        // Redirects user to Stripe
        window.location.href = PAYMENT_LINK
    }

    const triggerConfetti = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#fbbf24', '#111827', '#ffffff']
        })
    }

    const getWeekDate = (startStr, weekIndex) => {
        const date = new Date(startStr);
        date.setDate(date.getDate() + (weekIndex * 7));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }



    if (isPaid) {
        return (
            <div className="max-w-xl mx-auto py-20 px-4 text-center">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-4xl font-black text-brand-black mb-4 uppercase">You're All Set!</h2>
                <p className="text-xl text-gray-600 mb-8">
                    Your <strong>{formData.trade}</strong> safety schedule has been downloaded to your device.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg text-left mb-8">
                    <h4 className="font-bold text-brand-black mb-2">🚀 Next Steps:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li>1. Print the PDF (It's black & white printer friendly).</li>
                        <li>2. Put it in your foreman's binder.</li>
                        <li>3. Have crews sign off each week.</li>
                    </ul>
                </div>
                <button onClick={() => window.location.reload()} className="text-gray-400 hover:text-brand-black underline">
                    Start Over
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            {step === 1 && (
                <>
                    <button onClick={onBack} className="text-gray-500 hover:text-brand-black mb-6 flex items-center font-semibold">
                        ← Back to Home
                    </button>
                    <div className="bg-white p-8 border-t-8 border-brand-yellow shadow-lg max-w-xl mx-auto">
                        <h2 className="text-3xl font-black text-brand-black mb-2 uppercase">Config Your Pack</h2>
                        <p className="text-gray-600 mb-8">Tell us about your crew so we can pick the right topics.</p>

                        <form onSubmit={generatePreview} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Company Name</label>
                                <input
                                    required
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-brand-yellow outline-none transition font-bold text-lg text-brand-black"
                                    placeholder="e.g. Apex Mechanical"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Safety Officer (Optional)</label>
                                <input
                                    name="safetyOfficer"
                                    value={formData.safetyOfficer}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-brand-yellow outline-none transition font-medium text-lg text-brand-black"
                                    placeholder="e.g. John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Start Date</label>
                                <input
                                    type="date"
                                    required
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-brand-yellow outline-none transition font-medium text-lg text-brand-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Primary Trade</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`cursor-pointer border-2 p-4 flex flex-col items-center justify-center transition ${formData.trade === 'HVAC' ? 'border-brand-yellow bg-yellow-50 text-brand-black' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                                        <input type="radio" name="trade" value="HVAC" checked={formData.trade === 'HVAC'} onChange={handleChange} className="hidden" />
                                        <span className="font-black text-2xl mb-1">❄️</span>
                                        <span className="font-bold uppercase">HVAC</span>
                                    </label>
                                    <label className={`cursor-pointer border-2 p-4 flex flex-col items-center justify-center transition ${formData.trade === 'Plumbing' ? 'border-brand-yellow bg-yellow-50 text-brand-black' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                                        <input type="radio" name="trade" value="Plumbing" checked={formData.trade === 'Plumbing'} onChange={handleChange} className="hidden" />
                                        <span className="font-black text-2xl mb-1">💧</span>
                                        <span className="font-bold uppercase">Plumbing</span>
                                    </label>
                                    <label className={`cursor-pointer border-2 p-4 flex flex-col items-center justify-center transition col-span-2 md:col-span-1 ${formData.trade === 'Electrical' ? 'border-brand-yellow bg-yellow-50 text-brand-black' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                                        <input type="radio" name="trade" value="Electrical" checked={formData.trade === 'Electrical'} onChange={handleChange} className="hidden" />
                                        <span className="font-black text-2xl mb-1">⚡</span>
                                        <span className="font-bold uppercase">Electrical</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 font-black uppercase tracking-wider text-xl shadow-md transition ${loading ? 'bg-gray-300 text-gray-500 cursor-wait' : 'bg-brand-yellow text-brand-black hover:translate-y-px hover:shadow-sm'}`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {loadingText}
                                    </span>
                                ) : "Preview Schedule"}
                            </button>
                        </form>
                    </div>
                </>
            )}

            {step === 2 && (
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Preview Card */}
                    <div className="bg-white p-6 border-2 border-gray-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 z-10">PREVIEW MODE</div>
                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-brand-black">{formData.companyName}</h3>
                                {formData.safetyOfficer && <p className="text-xs text-gray-500">Officer: {formData.safetyOfficer}</p>}
                            </div>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">2025</span>
                        </div>
                        <div className="space-y-0 text-sm text-gray-600">
                            {topics.slice(0, 8).map((t, i) => (
                                <div key={i} className="flex justify-between py-3 border-b border-dashed border-gray-200">
                                    <div className="flex items-start">
                                        <span className="font-mono text-xs text-brand-yellow bg-gray-800 px-1 mr-2 rounded">{getWeekDate(formData.startDate, i)}</span>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-800 w-48 truncate">{t.title}</span>
                                            <span className="text-[10px] text-gray-400 w-48 truncate">{t.desc}</span>
                                        </div>
                                    </div>
                                    <span className="text-gray-300 italic text-xs">Sign Here</span>
                                </div>
                            ))}
                            <div className="py-4 text-center text-brand-yellow font-black text-lg bg-brand-black mt-2 transform -skew-x-3">
                                + {topics.length - 8} MORE WEEKS
                            </div>
                        </div>
                    </div>

                    {/* Checkout Card */}
                    <div className="bg-brand-black text-white p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-red-500"></div>
                        <div>
                            <h2 className="text-3xl font-black text-brand-yellow mb-2 uppercase">Ready to Download?</h2>
                            <ul className="space-y-4 mb-8 text-gray-300 mt-6">
                                <li className="flex items-center"><span className="text-green-500 font-bold mr-3 text-xl">✓</span> <span className="text-lg">Full 52-Week <strong>{formData.trade}</strong> Schedule</span></li>
                                <li className="flex items-center"><span className="text-green-500 font-bold mr-3 text-xl">✓</span> <span className="text-lg">OSHA Aligned Topics</span></li>
                                <li className="flex items-center"><span className="text-green-500 font-bold mr-3 text-xl">✓</span> <span className="text-lg">Print-Ready PDF Format</span></li>
                            </ul>
                        </div>

                        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                            <div className="flex justify-between items-end mb-4">
                                <div className="text-left">
                                    <div className="text-gray-400 line-through text-sm">Standard Price: $49</div>
                                    <div className="text-green-400 text-sm font-bold">Launch Sale</div>
                                </div>
                                <span className="text-6xl font-black text-white tracking-tighter">$5</span>
                            </div>
                            <button
                                id="pay-btn"
                                onClick={handleBuyClick}
                                className="w-full py-4 bg-brand-yellow text-brand-black font-black uppercase tracking-wider text-xl hover:bg-yellow-400 transition shadow-[0px_0px_20px_rgba(251,191,36,0.3)]"
                            >
                                Buy & Download All 52 Weeks
                            </button>

                            <div className="mt-4 text-center">
                                <span className="text-gray-400 text-xs uppercase font-bold tracking-widest block mb-2">- OR -</span>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        // Generate 1 Page Only
                                        generatePDF(formData, topics.slice(0, 1));
                                    }}
                                    className="text-gray-400 hover:text-white underline text-sm transition"
                                >
                                    Download Free 1-Page Example
                                </button>
                            </div>
                            <div className="mt-4 flex justify-center space-x-4 opacity-50 grayscale hover:grayscale-0 transition">
                                {/* Fake Payment Icons */}
                                <div className="h-6 w-10 bg-white rounded"></div>
                                <div className="h-6 w-10 bg-white rounded"></div>
                                <div className="h-6 w-10 bg-white rounded"></div>
                            </div>
                            <p className="text-center text-gray-500 text-xs mt-3">Secure 256-bit Encryption.</p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
