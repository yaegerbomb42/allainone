import { useState, useEffect } from 'react';
import { Analytics, app } from '../utils/analytics';
import { getDatabase, ref, onValue } from 'firebase/database';
import { generatePDF } from '../utils/pdfGenerator';

export default function StatsDashboard({ onBack }) {
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'orders'

    useEffect(() => {
        const unsubscribe = Analytics.subscribeToLiveStats((data) => {
            setStats(data);
        });

        // Fetch Orders
        try {
            const db = getDatabase(app);
            const ordersRef = ref(db, 'orders');
            onValue(ordersRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    // Convert object to array
                    const orderList = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    })).sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first
                    setOrders(orderList);
                }
            });
        } catch (e) {
            console.error("Orders Fetch Error:", e);
        }

        return () => unsubscribe();
    }, []);

    const handleRegenerate = (order) => {
        if (!order.topics) {
            alert("Legacy order: No topics saved. Cannot regenerate exact copy.");
            return;
        }
        // Reconstruct formData matches what generatePDF expects
        const formData = {
            companyName: order.company,
            trade: order.trade,
            safetyOfficer: order.officer !== 'N/A' ? order.officer : '',
            startDate: order.date.split('T')[0] // Approximation or saved date? Use order date for now
        };
        generatePDF(formData, order.topics);
    };

    if (!stats) return <div className="text-center py-20 text-white">Loading Analytics...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black uppercase text-brand-yellow tracking-widest">
                        <span className="text-white mr-2">⚡</span> Turbo Admin
                    </h1>
                    <button onClick={onBack} className="text-gray-400 hover:text-white">Exit</button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-8 border-b border-gray-700 pb-1">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`pb-2 px-4 font-bold uppercase tracking-wider text-sm ${activeTab === 'overview' ? 'text-brand-yellow border-b-2 border-brand-yellow' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Live Analytics
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`pb-2 px-4 font-bold uppercase tracking-wider text-sm ${activeTab === 'orders' ? 'text-brand-yellow border-b-2 border-brand-yellow' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Customer Orders ({orders.length})
                    </button>
                </div>

                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Live Users */}
                            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 relative overflow-hidden">
                                <div className="absolute top-4 right-4 flex items-center space-x-2">
                                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-xs text-green-500 font-bold uppercase">Live</span>
                                </div>
                                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Users Online</h3>
                                <p className="text-6xl font-black text-white">{stats.liveUsers}</p>
                            </div>

                            {/* Total Visits */}
                            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Visits</h3>
                                <p className="text-6xl font-black text-white">{stats.totalVisits.toLocaleString()}</p>
                            </div>

                            {/* Duration */}
                            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Avg Session</h3>
                                <p className="text-6xl font-black text-white">{stats.avgDuration}</p>
                            </div>
                        </div>

                        {/* Charts Area */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Traffic Sources */}
                            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                                <h3 className="text-xl font-bold mb-6 border-b border-gray-700 pb-4">Acquisition Channels</h3>
                                <div className="space-y-4">
                                    {stats.sources.map((source, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-semibold text-gray-300">{source.name}</span>
                                                <span className="text-gray-400">{source.percent}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-brand-yellow h-full"
                                                    style={{ width: `${source.percent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Visitor Locations */}
                            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 flex flex-col justify-start items-center text-center">
                                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4 text-3xl">
                                    🌍
                                </div>
                                <h3 className="text-xl font-bold mb-4">Live Locations</h3>
                                <div className="text-left w-full space-y-3">
                                    {Object.entries(stats.locations || {}).length === 0 ? (
                                        <div className="text-gray-500 italic text-sm">No location data yet...</div>
                                    ) : (
                                        Object.entries(stats.locations).map(([country, count]) => (
                                            <div key={country} className="flex justify-between text-sm border-b border-gray-700 pb-2">
                                                <span className="text-gray-400">{country}</span>
                                                <span className="font-bold text-brand-yellow">{count}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden animate-fade-in">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-gray-700 text-gray-200 uppercase font-bold text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Company</th>
                                        <th className="px-6 py-4">Trade</th>
                                        <th className="px-6 py-4">Officer</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">
                                                No orders found yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-700/50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {new Date(order.date).toLocaleDateString()}
                                                    <div className="text-xs text-gray-500">{new Date(order.date).toLocaleTimeString()}</div>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-white">{order.company}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.trade === 'Hub' ? 'bg-red-900 text-red-200' :
                                                        order.trade === 'Electrical' ? 'bg-yellow-900 text-yellow-200' :
                                                            'bg-blue-900 text-blue-200'
                                                        }`}>
                                                        {order.trade}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">{order.officer}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => handleRegenerate(order)}
                                                        className="text-green-400 hover:text-white font-bold border border-green-500 hover:bg-green-600 hover:border-transparent px-3 py-1 rounded transition text-xs uppercase tracking-wider"
                                                    >
                                                        ⬇ Download PDF
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
