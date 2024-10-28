import puppeteer from "https://deno.land/x/puppeteer@9.0.2/mod.ts";
import { get_all_available_exams } from "./src/get_all_availbale_exams.ts";
import { get_all_required_cources } from "./src/get_all_required_cources.ts";

try {
    const browser = await puppeteer.launch({
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        /*
        console.log("STEP 1: Fetching all required cources")
        const required_cources = await get_all_required_cources(browser);
        console.log(`STEP 2: Found ${required_cources.length} required cources`);
        console.table(required_cources);
        */
        console.log("3. Fetching all available exams");
        const available_exams = await get_all_available_exams(browser);
        console.log(`4. Found ${available_exams.length} available exams`);
        console.table(available_exams);
        /*
        console.log("5. Comparing required and available exams");
        const overlapping_exams = required_cources.filter(cource => available_exams.includes(cource));
        console.log(`6. ${overlapping_exams.length} out of ${required_cources.length} required exams are available`);
        */
    } finally {
        await browser.close();
    }
} catch (error) {
    console.error('Failed to scrape courses:', error);
}