import puppeteer from "https://deno.land/x/puppeteer@9.0.2/mod.ts";
import { get_all_available_exams } from "./src/get_all_availbale_exams.ts";
import { get_all_required_cources } from "./src/get_all_required_cources.ts";
import { osType } from "https://deno.land/std@0.93.0/_util/os.ts";
import type { Cource } from "./src/datatypes.d.ts";

const linux_chrome_path: string = "/usr/bin/google-chrome";
const macos_chrome_path: string = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const mekatronikk_url = "https://www.uia.no/studier/program/mekatronikk-bachelor/studieplaner/2024h.html";
const computer_science_url = "https://www.uia.no/studier/program/data-ingeniorutdanning-bachelor/studieplaner/2024h.html";
try {
    const browser = await puppeteer.launch({
        executablePath: osType === "linux" ? linux_chrome_path : macos_chrome_path,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        console.log("STEP 1: Fetching all required cources")
        const final_required_cources_list: Cource[] = [];

        const mekatronikk_required_cources = await get_all_required_cources(browser, mekatronikk_url);
        const computer_science_required_cources = await get_all_required_cources(browser, computer_science_url);

        // overlapping cources between mekatronics and compsci
        const overlapping_cources = mekatronikk_required_cources.filter(cource => computer_science_required_cources.some(c => c.cource_code === cource.cource_code));
        console.log(`Found ${overlapping_cources.length} overlapping cources between mekatronics and compsci`);

        final_required_cources_list.push(...mekatronikk_required_cources, ...computer_science_required_cources);
        console.log(`STEP 2: Found ${final_required_cources_list.length} required cources`);
        console.table(final_required_cources_list);

        console.log("3. Fetching all available exams");
        const available_exams = await get_all_available_exams(browser);

        console.log(`4. Found ${available_exams.length} available exams`);
        console.table(available_exams);

        console.log("5. Comparing required and available exams");
        const overlapping_exams = final_required_cources_list.filter(cource => available_exams.some(exam => exam.cource_code === cource.cource_code));

        console.log(`6. ${overlapping_exams.length} out of ${final_required_cources_list.length} required exams are available`);
    } finally {
        await browser.close();
    }
} catch (error) {
    console.error('Failed to scrape courses:', error);
}