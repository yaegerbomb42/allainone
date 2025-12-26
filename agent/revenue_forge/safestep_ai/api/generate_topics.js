
import AI_TOPICS_RAW from '../src/data/real_ai_topics.json';

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const { trade, companyName } = await req.json();

        // GROQ CONFIG
        const apiKey = process.env.GROQ_API_KEY;
        const endpoint = "https://api.groq.com/openai/v1/chat/completions";
        const model = "llama-3.3-70b-versatile";

        if (!apiKey) {
            console.error("No GROQ_API_KEY found. Falling back.");
            return new Response(JSON.stringify({
                topics: AI_TOPICS_RAW,
                source: 'database_fallback_no_key'
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        const prompt = `Generate 52 MASTER-CLASS level weekly safety modules for a ${trade} company named "${companyName}".
        
        REQUIREMENTS FOR EACH TOPIC:
        1. "title": Technical and specific to ${trade}.
        2. "desc": Detailed 2-3 sentence overview.
        3. "oshaRef": Specific OSHA code (e.g. 1926.451).
        4. "story": A SHOCKING, gritty, specific real-world fatality or near-miss incident story. NO templates.
        5. "checklist": 5 critical, specific high-risk inspection items.
        6. "trainerNotes": A strategic script for the foreman to deliver a hard-hitting talk.
        7. "talkingPoints": 4 hard-hitting crew discussion questions.
        8. "quiz": A technical knowledge question and correct answer.
        9. "fineAvoided": Estimated OSHA fine amount avoided (e.g. "$16,131").
        10. "efficiencyTip": A quick pro-tip on how safety speeds up the job.

        JSON FORMAT (Return ONLY raw JSON array. Start with [ and end with ]):
        [{ "title": "...", "desc": "...", "oshaRef": "...", "story": "...", "checklist": ["..."], "trainerNotes": "...", "talkingPoints": ["..."], "quiz": {"question": "...", "answer": "..."} , "fineAvoided": "$...", "efficiencyTip": "..." }]`;

        console.log(`[Groq] Requesting topics for ${trade} using ${model}...`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s for 52 topics

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.6,
                    max_tokens: 8000,
                    stream: false
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Groq Error ${res.status}: ${errText}`);
            }

            const data = await res.json();
            const text = data.choices[0].message.content;

            // Robust Extraction
            const start = text.indexOf('[');
            const end = text.lastIndexOf(']');
            if (start === -1 || end === -1) throw new Error("Invalid AI Output format");

            const cleanJson = text.substring(start, end + 1);
            const topics = JSON.parse(cleanJson);

            return new Response(JSON.stringify({
                topics: topics,
                source: 'live_ai_groq'
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });

        } catch (e) {
            clearTimeout(timeoutId);
            console.error("Groq Failed:", e);
            return new Response(JSON.stringify({
                topics: AI_TOPICS_RAW,
                source: 'database_fallback_error'
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

    } catch (error) {
        console.error("API Critical Error:", error);
        return new Response(JSON.stringify({
            topics: AI_TOPICS_RAW,
            source: 'critical_error'
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
}
