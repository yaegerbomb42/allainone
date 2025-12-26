// Real Firebase Analytics Implementation
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, onDisconnect, increment } from "firebase/database";

// ------------------------------------------------------------------
// CONFIGURATION NEEDED
// The user normally provides these keys from their Firebase Console.
// For now, we leave placeholders or use a public demo set if available.
// ------------------------------------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyD7CDVAxQZXH6kNo0ffsk8ORbtCDaIV4G0",
    authDomain: "turbotoolbox.firebaseapp.com",
    databaseURL: "https://turbotoolbox-default-rtdb.firebaseio.com",
    projectId: "turbotoolbox",
    storageBucket: "turbotoolbox.firebasestorage.app",
    messagingSenderId: "300613518960",
    appId: "1:300613518960:web:e8194e36cf9dad3e4fd6b5"
};

// Initialize Firebase (wrapped in try-catch to prevent crashing if config is missing)
let db = null;
export let app = null;

try {
    // Only initialize if we have real keys (check length or specific string)
    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        app = initializeApp(firebaseConfig);
        db = getDatabase(app);
    } else {
        console.warn("Firebase Config missing. Analytics will run in DEMO mode.");
    }
} catch (e) {
    console.error("Firebase Init Error:", e);
}

const STORE_KEY = 'turbo_analytics_id';

export const Analytics = {
    init: () => {
        let visitorId = localStorage.getItem(STORE_KEY);
        if (!visitorId) {
            visitorId = 'visitor_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem(STORE_KEY, visitorId);
        }

        if (db) {
            // PRESENCE SYSTEM (Active Users)
            const connectedRef = ref(db, ".info/connected");
            const userRef = ref(db, `presence/${visitorId}`);

            onValue(connectedRef, (snap) => {
                if (snap.val() === true) {
                    set(userRef, {
                        online: true,
                        lastSeen: Date.now(),
                        startTime: Date.now() // Track when they joined
                    });
                    onDisconnect(userRef).remove();
                }
            });

            // GEOLOCATION TRACKING (More Robust)
            // Always try if we don't have it, or just retry every session to be safe for this user
            fetch('https://ipapi.co/json/')
                .then(res => {
                    if (!res.ok) throw new Error("ipapi failed");
                    return res.json();
                })
                .then(data => {
                    const locationRef = ref(db, `presence/${visitorId}/location`);
                    set(locationRef, {
                        city: data.city,
                        region: data.region,
                        country: data.country_name,
                        ip: data.ip
                    });
                })
                .catch(err => {
                    console.warn("Primary Geo failed, trying backup...", err);
                    // Fallback 1: ipwho.is
                    fetch('https://ipwho.is/')
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                const locationRef = ref(db, `presence/${visitorId}/location`);
                                set(locationRef, {
                                    city: data.city,
                                    region: data.region,
                                    country: data.country,
                                    ip: data.ip
                                });
                            } else {
                                throw new Error("ipwho failed");
                            }
                        })
                        .catch(e => {
                            console.warn("Backup Geo failed, trying tertiary...", e);
                            // Fallback 2: ip-api.com
                            fetch('http://ip-api.com/json')
                                .then(res => res.json())
                                .then(data => {
                                    if (data.status === 'success') {
                                        const locationRef = ref(db, `presence/${visitorId}/location`);
                                        set(locationRef, {
                                            city: data.city,
                                            region: data.regionName,
                                            country: data.country,
                                            ip: data.query
                                        });
                                    }
                                });
                        });
                });

            // TOTAL VISITS
            const visitsRef = ref(db, 'stats/totalVisits');
            set(visitsRef, increment(1));

            // UNIQUE VISITORS (New)
            if (!localStorage.getItem('turbo_unique_tracked')) {
                const uniqueRef = ref(db, 'stats/uniqueVisitors');
                set(uniqueRef, increment(1));
                localStorage.setItem('turbo_unique_tracked', 'true');
            }
        }

        return visitorId;
    },

    trackView: (pageName) => {
        console.log(`[Analytics] Page View: ${pageName}`);
        if (db) {
            const pageRef = ref(db, `stats/pages/${pageName}`);
            set(pageRef, increment(1));
        }
    },

    // Subscribe to live stats for the Dashboard
    subscribeToLiveStats: (callback) => {
        if (!db) {
            console.log("Analytics: No DB connection. Listeners inactive.");
            return () => { };
        }

        // REAL LISTENER
        const presenceRef = ref(db, 'presence');
        const visitsRef = ref(db, 'stats/totalVisits');
        const uniquesRef = ref(db, 'stats/uniqueVisitors');

        const unsubPresence = onValue(presenceRef, (snap) => {
            const users = snap.exists() ? snap.val() : {};
            const userCount = Object.keys(users).length;

            // Extract Locations & Duration
            const locations = {};
            let totalDuration = 0;
            let durationCount = 0;
            const now = Date.now();

            Object.values(users).forEach(u => {
                // Location Tracking
                if (u.location && u.location.country) {
                    const country = u.location.country;
                    const city = u.location.city || "Unknown";
                    const locKey = `${city}, ${country}`;
                    locations[locKey] = (locations[locKey] || 0) + 1;
                }

                // Duration Tracking
                if (u.startTime) {
                    totalDuration += (now - u.startTime);
                    durationCount++;
                }
            });

            // Format Duration
            let avgLabel = "Live";
            if (durationCount > 0) {
                const avgMs = totalDuration / durationCount;
                if (avgMs < 60000) {
                    avgLabel = `${Math.floor(avgMs / 1000)}s`;
                } else {
                    avgLabel = `${Math.floor(avgMs / 60000)}m`;
                }
            }

            callback(prev => ({
                ...prev,
                liveUsers: userCount,
                locations: locations,
                avgDuration: avgLabel
            }));
        });

        const unsubVisits = onValue(visitsRef, (snap) => {
            callback(prev => ({ ...prev, totalVisits: snap.val() || 0 }));
        });

        const unsubUniques = onValue(uniquesRef, (snap) => {
            callback(prev => ({ ...prev, uniqueVisitors: snap.val() || 0 }));
        });

        // Initialize with default structure
        callback({
            liveUsers: 0,
            totalVisits: 0,
            uniqueVisitors: 0,
            avgDuration: 'Live',
            sources: [],
            locations: {}
        });

        return () => {
            unsubPresence();
            unsubVisits();
            unsubUniques();
        };
    }
};

