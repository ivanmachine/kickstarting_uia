import type { Browser } from "https://deno.land/x/puppeteer@9.0.2/mod.ts";
import type { Exam, study_types } from "./datatypes.d.ts";

const EXAMS_URL = "https://rapport-dv.uhad.no/views/Enkeltemnermedtekstopptakskrav/Tilbudenkeltemner?%3AshowAppBanner=false&%3Adisplay_count=n&%3AshowVizHome=n&%3Aorigin=viz_share_link&%3AisGuestRedirectFromVizportal=y&%3Aembed=y";

export async function get_all_available_exams(browser: Browser): Promise<Exam[]> {
    console.log("****************************************");
    console.log("***** getting all available exams *****");
    console.log("****************************************");

    const page = await browser.newPage();
    
    try {
        await page.goto(EXAMS_URL, { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });

        // Wait for the main container to load
        await page.waitForSelector('div.tab-vizHeaderHolderWrapper', {
            timeout: 30000,
            visible: true
        });

        // Get all columns
        const courseCodeElements = await page.$$('div.tab-vizHeaderHolderWrapper:nth-child(1) div.tab-vizHeader');
        const courseNameElements = await page.$$('div.tab-vizHeaderHolderWrapper:nth-child(2) div.tab-vizHeader');
        const facultyElements = await page.$$('div.tab-vizHeaderHolderWrapper:nth-child(3) div.tab-vizHeader');
        const studyTypeElements = await page.$$('div.tab-vizHeaderHolderWrapper:nth-child(4) div.tab-vizHeader');
        const requirementsElements = await page.$$('div.tab-vizHeaderHolderWrapper:nth-child(5) div.tab-vizHeader');

        const exams: Exam[] = [];
        console.log(`Found ${courseCodeElements.length} exams`);
        // Assuming all columns have the same length
        for (let i = 0; i < courseCodeElements.length; i++) {
            const courseCode = await courseCodeElements[i].evaluate(el => el.innerHTML);
            const courseName = await courseNameElements[i].evaluate(el => el.innerHTML);
            const faculty = await facultyElements[i].evaluate(el => el.innerHTML);
            const studyType = await studyTypeElements[i].evaluate(el => el.innerHTML) as study_types;
            const requirements = await requirementsElements[i].evaluate(el => el.innerHTML);

            exams.push({
                cource_code: courseCode.trim(),
                course_name: courseName.trim(),
                faculty: faculty.trim(),
                study_type: studyType,
                cource_requirements: requirements.trim()
            });
        }

        return exams;
        
    } catch (error) {
        console.error('Error scraping exams:', error);
        throw error;
    } finally {
        await page.close();
    }
}