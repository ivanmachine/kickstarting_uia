import type { Browser, Element } from "https://deno.land/x/puppeteer@9.0.2/mod.ts";
import type { Cource } from "./datatypes.d.ts";


export async function get_all_required_cources(browser: Browser, url: string): Promise<Cource[]> {
    console.log("****************************************");
    console.log("***** getting all required cources *****");
    console.log("****************************************");

    const page = await browser.newPage();

    try {
        console.log("3. navigating to page");
        // Navigate to page and wait for network to be idle
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Wait for specific element to be visible
        console.log("4. waiting for specific element to be visible");
        await page.waitForSelector('#direction-select-INGMASK324SO');

        // Click a button
        console.log("5. clicking button");
        await page.click('#direction-select-INGMASK324SO');

        // Wait for course code elements to be loaded
        console.log("6. waiting for course code elements to be loaded");
        await page.waitForSelector('li.mandatory', {
            timeout: 30000,
            visible: true
        });

        // Get all mandatory course elements
        console.log("7. getting all mandatory course elements");
        const mandatoryCourses = await page.$$('li.mandatory');

        console.log("8. looping through mandatory courses");
        const cources: Cource[] = [];
        for (const course of mandatoryCourses) {
            const courseCode = await course.$eval('span.course-code', (el: Element) => el.innerHTML);
            const coursePoints = await course.$eval('span.course-study-points > span', (el: Element) => parseFloat(el.innerHTML));
            const courseName = await course.$eval('span.course-name', (el: Element) => el.innerHTML);

            cources.push({
                cource_code: String(courseCode),
                cource_points: Number(coursePoints),
                cource_name: String(courseName)
            });
        }
        // delete all duplicates
        const uniqueCources = cources.filter((cource, index, self) =>
            index === self.findIndex((t) => (
                t.cource_code === cource.cource_code
            ))
        );
        return uniqueCources;

    } catch (error) {
        console.error('Error scraping courses:', error);
        throw error;
    } finally {
        await page.close();
    }
}
