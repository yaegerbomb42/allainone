
import { jsPDF } from "jspdf";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// CONFIG
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant"; // Fast, High Limits

if (!GROQ_API_KEY) {
    console.error("❌ MISSING GROQ_API_KEY. Please check .env.local");
    process.exit(1);
}

// HELPER: Sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// HELPER: Clean Text
function cleanText(text) {
    if (!text) return "";
    return text
        .replace(/[\u{1F600}-\u{1F6FF}]/gu, '')
        .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')
        .replace(/[\u{2600}-\u{26FF}]/gu, '')
        .replace(/[^\x20-\x7E\n]/g, "")
        .replace(/&/g, "and")
        .replace(/\*\*/g, "")
        .replace(/##/g, "")
        .trim();
}

// BATCH GENERATION
async function generateBatch(startWeek, count) {
    const trade = "HVAC";
    console.log(`[Batch] Weeks ${startWeek}-${startWeek + count - 1} using ${MODEL}...`);

    const prompt = `Generate ${count} MASTER-CLASS level weekly safety modules for an expert ${trade} crew.
        Batch: Weeks ${startWeek} to ${startWeek + count - 1}.
        
        REQUIREMENTS:
        1. "story": A SHOCKING, gritty, specific real-world fatality or near-miss. 
        2. "trainerNotes": A strategic script for the foreman.
        3. "talkingPoints": Hard-hitting discussion questions.
        4. "checklist": 5 critical items.

        JSON FORMAT (Return ONLY raw JSON array. Start with [ and end with ]):
        [{ "title": "...", "desc": "...", "oshaRef": "...", "story": "...", "checklist": ["..."], "trainerNotes": "...", "talkingPoints": ["..."], "quiz": {"question": "...", "answer": "..."} }]`;

    const controller = new AbortController();
    const timeout = setTimeout(() => { controller.abort(); }, 120000);

    try {
        const res = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL,
                messages: [{ role: 'user', content: prompt }],
                stream: false,
                temperature: 0.5
            }),
            signal: controller.signal
        });
        clearTimeout(timeout);

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(`Groq ${res.status}: ${txt}`);
        }

        const data = await res.json();
        const content = data.choices[0].message.content;

        // ROBUST EXTRACTION
        const start = content.indexOf('[');
        const end = content.lastIndexOf(']');

        if (start === -1 || end === -1) {
            console.error("Raw content:", content.substring(0, 100) + "...");
            throw new Error("No JSON array brackets found.");
        }

        const cleanJson = content.substring(start, end + 1);
        return JSON.parse(cleanJson);
    } catch (e) {
        clearTimeout(timeout);
        console.error(`Batch failed:`, e);
        return [];
    }
}

async function generateSample() {
    console.log(`🚀 Starting PDF Gen via Groq (${MODEL})...`);

    // Generate Topics
    let allTopics = [];

    // Batch 1
    const b1 = await generateBatch(1, 26);
    allTopics.push(...b1);
    console.log(`✅ Batch 1: ${b1.length} topics.`);

    // Rate Limit Pause
    console.log("⏳ Pausing 5s for Rate Limit...");
    await sleep(5000);

    // Batch 2
    const b2 = await generateBatch(27, 26);
    allTopics.push(...b2);
    console.log(`✅ Batch 2: ${b2.length} topics. (Total: ${allTopics.length})`);

    // PDF SETUP
    console.log("📄 Generating Clean PDF...");
    const doc = new jsPDF();
    const companyName = "Elite Air Systems";
    const currentYear = new Date().getFullYear(); // 2025
    const START_DATE = new Date(); // Today

    // COVER PAGE
    doc.setFillColor(17, 24, 39); doc.rect(0, 0, 210, 297, "F");
    doc.setTextColor(251, 191, 36); doc.setFontSize(40); doc.setFont(undefined, 'bold');
    doc.text(`${currentYear} SAFETY`, 105, 100, null, null, "center");
    doc.text("SCHEDULE", 105, 115, null, null, "center");
    doc.setTextColor(255, 255, 255); doc.setFontSize(16); doc.setFont(undefined, 'normal');
    doc.text(`Prepared for: ${companyName}`, 105, 140, null, null, "center");
    doc.text(`https://turbotoolbox.vercel.app`, 105, 270, null, null, "center");

    // HELPERS
    const getMyDate = (base, weeks) => {
        const d = new Date(base);
        d.setDate(d.getDate() + (weeks * 7));
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // SCHEDULE LIST
    let y = 20;
    doc.addPage();
    doc.setTextColor(0, 0, 0); doc.setFontSize(18); doc.setFont(undefined, 'bold');
    doc.text(`Weekly Safety Topics`, 20, y); y += 15;
    doc.setFillColor(240, 240, 240); doc.rect(15, y - 8, 180, 10, "F");
    doc.setFontSize(10); doc.text("DATE", 20, y); doc.text("TOPIC", 50, y); doc.text("SIGNATURE", 160, y); y += 10;

    allTopics.forEach((topic, i) => {
        if (y > 270) { doc.addPage(); y = 30; }
        doc.setFont(undefined, 'normal'); doc.setFontSize(9);
        doc.text(getMyDate(START_DATE, i), 20, y);
        doc.text(cleanText(topic.title || "").substring(0, 60), 50, y);
        doc.text("_________________", 160, y);
        y += 8;
    });

    // MODULE PAGES
    allTopics.forEach((topic, index) => {
        doc.addPage();
        const MARGIN = 15;
        const BOX_W = 180;
        let cursorY = 15;

        // Header
        doc.setFillColor(17, 24, 39); doc.rect(0, 0, 210, 25, "F");
        doc.setTextColor(251, 191, 36); doc.setFontSize(16); doc.setFont(undefined, 'bold');
        doc.text(`WEEK ${index + 1}: ${getMyDate(START_DATE, index)}`, 105, 10, null, null, "center");
        doc.setFontSize(10); doc.setTextColor(200, 200, 200);
        doc.text(`TurboToolbox.vercel.app | ${companyName}`, 105, 18, null, null, "center");
        cursorY += 20;

        // Title
        const tTitle = cleanText(topic.title || "Topic");
        const tOsha = cleanText(topic.oshaRef || "");
        doc.setTextColor(0, 0, 0); doc.setFontSize(18); doc.setFont(undefined, 'bold');
        doc.text(tTitle.substring(0, 50), MARGIN, cursorY);
        if (tOsha) {
            doc.setFillColor(220, 38, 38); doc.rect(145, cursorY - 6, 50, 8, "F");
            doc.setTextColor(255, 255, 255); doc.setFontSize(9);
            doc.text(`OSHA: ${tOsha}`, 170, cursorY - 1, null, null, "center");
        }
        cursorY += 8;

        // Desc
        const tDesc = cleanText(topic.desc || "");
        doc.setFontSize(10); doc.setFont(undefined, 'normal'); doc.setTextColor(60, 60, 60);
        const descLines = doc.splitTextToSize(tDesc, 180);
        doc.text(descLines, MARGIN, cursorY);
        cursorY += (descLines.length * 4) + 6;

        // Story
        const tStory = cleanText(topic.story || "");
        const storyLines = doc.splitTextToSize(tStory, 170);
        const storyH = (storyLines.length * 4) + 12;
        doc.setFillColor(245, 247, 250); doc.setDrawColor(200, 200, 200);
        doc.rect(MARGIN, cursorY, BOX_W, storyH, "FD");
        doc.setFontSize(9); doc.setFont(undefined, 'bold'); doc.setTextColor(180, 0, 0);
        doc.text("INCIDENT REPORT", MARGIN + 4, cursorY + 6);
        doc.setFont(undefined, 'italic'); doc.setTextColor(0, 0, 0);
        doc.text(storyLines, MARGIN + 4, cursorY + 11);
        cursorY += storyH + 6;

        // Plan
        const tTrainer = cleanText(topic.trainerNotes || "");
        const trainerLines = doc.splitTextToSize(tTrainer, 170);
        const trainerH = (trainerLines.length * 4) + 12;
        doc.setFillColor(255, 252, 230); doc.setDrawColor(240, 180, 0);
        doc.rect(MARGIN, cursorY, BOX_W, trainerH, "FD");
        doc.setFont(undefined, 'bold'); doc.setTextColor(180, 90, 0);
        doc.text("FOREMAN'S GUIDE", MARGIN + 4, cursorY + 6);
        doc.setFont(undefined, 'normal'); doc.setTextColor(0, 0, 0);
        doc.text(trainerLines, MARGIN + 4, cursorY + 11);
        cursorY += trainerH + 8;

        // Check/Disc
        const colY = cursorY;
        let checkY = colY + 6;
        let discY = colY + 6;

        doc.setFontSize(11); doc.setFont(undefined, 'bold'); doc.setTextColor(0, 0, 0);
        doc.text("Inspection Actions", MARGIN, colY);
        doc.setFontSize(9); doc.setFont(undefined, 'normal');
        (topic.checklist || []).slice(0, 5).forEach(item => {
            const lines = doc.splitTextToSize(cleanText(item), 75);
            doc.rect(MARGIN, checkY - 3, 3, 3);
            doc.text(lines, MARGIN + 5, checkY);
            checkY += (lines.length * 4) + 2;
        });

        doc.setFontSize(11); doc.setFont(undefined, 'bold');
        doc.text("Crew Discussion", MARGIN + 95, colY);
        doc.setFontSize(9); doc.setFont(undefined, 'normal');
        (topic.talkingPoints || []).slice(0, 4).forEach(p => {
            const lines = doc.splitTextToSize(`• ${cleanText(p)}`, 85);
            doc.text(lines, MARGIN + 95, discY);
            discY += (lines.length * 4) + 2;
        });
        cursorY = Math.max(checkY, discY) + 6;

        // Quiz
        const tQ = cleanText(topic.quiz?.question || "N/A");
        const tA = cleanText(topic.quiz?.answer || "N/A");
        doc.setDrawColor(220, 220, 220); doc.line(MARGIN, cursorY, 210 - MARGIN, cursorY); cursorY += 6;
        doc.setFontSize(10); doc.setFont(undefined, 'bold'); doc.text("QUIZ:", MARGIN, cursorY);
        doc.setFont(undefined, 'normal'); doc.text(tQ, MARGIN + 15, cursorY);
        cursorY += 5;
        doc.setFont(undefined, 'italic'); doc.setTextColor(100, 100, 100); doc.text(`Answer: ${tA}`, MARGIN + 15, cursorY);

        // Footer
        const fy = 270;
        doc.setTextColor(0, 0, 0); doc.setFont(undefined, 'bold'); doc.setFontSize(12);
        doc.text("Crew Sign-In", MARGIN, fy);
        doc.setLineWidth(0.5); doc.line(MARGIN, fy + 8, 210 - MARGIN, fy + 8);
        doc.setFontSize(8); doc.setFont(undefined, 'normal');
        doc.text("1. __________________  2. __________________  3. __________________  4. __________________", MARGIN, fy + 14);

    });

    const outputPath = 'TurboToolbox_2025_Full_HVAC_Schedule.pdf';
    fs.writeFileSync(outputPath, Buffer.from(doc.output('arraybuffer')));
    console.log(`🎉 Success! Saved Clean PDF to ${outputPath}`);
}

generateSample();
