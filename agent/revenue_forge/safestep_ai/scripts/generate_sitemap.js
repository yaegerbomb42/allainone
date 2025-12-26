
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Data
// import locationsData from '../src/data/seo_locations.json' assert { type: 'json' };
const locationsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/seo_locations.json'), 'utf8'));


const BASE_URL = 'https://turbotoolbox.vercel.app';

function generateSitemap() {
    console.log("🚀 Generating Sitemap...");

    let urls = [];
    const trades = locationsData.trades;
    const states = locationsData.locations;

    // 1. Core Pages
    urls.push(`${BASE_URL}/`);

    // 2. Programmatic Pages (Trade x City)
    // Format: /?trade=HVAC&city=Austin&state=Texas
    // But standardized for clean indexing if we used rewrites, 
    // for now we used query params which Google accepts.

    // Actually, to make it "Foolproof", let's generate the QUERY PARAM version 
    // but formatted as standard XML.

    states.forEach(stateObj => {
        const state = stateObj.state;
        stateObj.cities.forEach(city => {
            trades.forEach(trade => {
                // Encode params
                const safeTrade = encodeURIComponent(trade);
                const safeCity = encodeURIComponent(city);
                const safeState = encodeURIComponent(state);

                // URL: https://turbotoolbox.vercel.app/?trade=HVAC&city=Austin&state=Texas
                const url = `${BASE_URL}/?trade=${safeTrade}&city=${safeCity}&state=${safeState}`;
                urls.push(url);
            });
        });
    });

    console.log(`✅ Generated ${urls.length} URLs.`);

    // 3. Build XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

    // 4. Write to public/sitemap.xml
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
    console.log(`🎉 Sitemap saved to ${path.join(publicDir, 'sitemap.xml')}`);
}

generateSitemap();
