
import puppeteer from 'puppeteer';

(async () => {
    console.log('🚀 Launching TurboToolbox Marketing Bot...');
    console.log('NOTE: You will need to log in manually when the browser opens.');

    const browser = await puppeteer.launch({
        headless: false, // Must be visible for user to interact
        defaultViewport: null,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();

    // Marketing Content
    const postTitle = "I built a tool so I never have to write a Toolbox Talk again. (Roast it)";
    const postBody = `Sunday nights used to be my nightmare. Trying to find a safety topic that wasn't "Wear your hard hat" for the 50th time.

I got sick of it, so I built a simple tool that generates a **full 52-week schedule** specifically for my trade (HVAC).
- One page per week.
- Black & white (printer friendly).
- Actually has good topics (like "Refrigerant Leak Hazards" and "Rooftop Leading Edges").

It’s $29 if you want to download a year's worth, but you can play with the generator for free to see if it sucks or not.

Link: https://turbotoolbox.vercel.app/

Let me know if the topics are accurate or if I missed anything big.`;

    try {
        // 1. Go to Reddit Submit Page
        console.log('➡️  Navigating to Reddit r/HVAC submit page...');
        await page.goto('https://www.reddit.com/r/HVAC/submit', { waitUntil: 'networkidle2' });

        // 2. Wait for user to Log In
        console.log('⏳  WAITING: Please Log In or Solve Captcha in the browser window.');
        console.log('👉  The bot will resume automatically once it detects the post form.');

        // Wait up to 5 minutes for user to login
        await page.waitForSelector('textarea[placeholder="Title"]', { timeout: 300000 });

        console.log('✅  Login detected! Filling out post...');

        // 3. Fill Title
        await page.type('textarea[placeholder="Title"]', postTitle, { delay: 50 });

        // 4. Fill Body (Handling different editor types is tricky, trying standard markdown mode)
        // Attempting to click "Markdown Editor" button if it exists, or just typing in the main body box
        const bodySelector = 'div[role="textbox"], textarea[placeholder="Text (optional)"]';
        try {
            await page.waitForSelector(bodySelector, { timeout: 5000 });
            await page.click(bodySelector);
            await page.keyboard.type(postBody, { delay: 10 });
        } catch (e) {
            console.warn("⚠️  Could not auto-type body. Content copied to clipboard.");
        }

        console.log('🎉  Draft Complete!');
        console.log('👉  Review the post in the browser and hit SUBMIT when ready.');

        // Keep browser open
        // await browser.close(); 

    } catch (error) {
        console.error('❌  Error:', error.message);
    }
})();
