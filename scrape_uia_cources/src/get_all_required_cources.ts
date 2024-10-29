import type { Browser, Element } from "https://deno.land/x/puppeteer@9.0.2/mod.ts";
import type { Cource } from "./datatypes.d.ts";

const mekatronikk_url = "https://www.uia.no/studier/program/mekatronikk-bachelor/studieplaner/2024h.html";
const computer_science_url = "https://www.uia.no/studier/program/data-ingeniorutdanning-bachelor/studieplaner/2024h.html";

export async function get_all_required_cources(browser: Browser): Promise<Cource[][]> {
    console.log("****************************************");
    console.log("***** getting all required cources *****");
    console.log("****************************************");

    const results: Cource[][] = [];

    // Fetch data for both programs
    const mekatronikkCources = await scrape_data(browser, mekatronikk_url, 'mechatronics');
    const computerScienceCources = await scrape_data(browser, computer_science_url, 'computer_science');

    results.push(mekatronikkCources);
    results.push(computerScienceCources);

    return results;
}

async function scrape_data(browser: Browser, url: string, page_flow: string): Promise<Cource[]> {
    const page = await browser.newPage();

    try {
        console.log(`Scraping data from ${url}`);
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        switch (page_flow) {
            case 'mechatronics':
                await page.waitForSelector('#direction-select-INGMASK324SO');
                await page.click('#direction-select-INGMASK324SO');
                break;
            case 'computer_science':
                await page.waitForSelector(`#direction-select-INGDATA24SO`);
                await page.click(`#direction-select-INGDATA24SO`);
                await page.waitForSelector(`#direction-select-INGDATA24SWU`);
                await page.click(`#direction-select-INGDATA24SWU`);
                break;
        }

        await page.waitForSelector('li.mandatory', {
            timeout: 30000,
            visible: true
        });

        const mandatoryCourses = await page.$$('li.mandatory');
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

        return cources.filter((cource, index, self) =>
            index === self.findIndex((t) => t.cource_code === cource.cource_code)
        );

    } catch (error) {
        console.error('Error scraping courses:', error);
        throw error;
    } finally {
        await page.close();
    }
}
