import axios from 'axios';
import * as cheerio from 'cheerio';

async function scrapeUiaCourses(url: string): Promise<string[]> {
    try {
        // Fetch the webpage content
        const response = await axios.get(url);
        const html = response.data;

        // Load HTML into cheerio
        const $ = cheerio.load(html);

        // Find all spans with id 'course-code' and extract their text
        const courseCodes: string[] = [];
        $('span#course-code').each((_, element) => {
            courseCodes.push($(element).text().trim());
        });

        return courseCodes;
    } catch (error) {
        console.error('Error scraping UIA courses:', error);
        throw error;
    }
}

// Example usage
async function main() {
    try {
        const uiaUrl = 'YOUR_UIA_URL_HERE';
        const courses = await scrapeUiaCourses(uiaUrl);
        console.log('Found course codes:', courses);
    } catch (error) {
        console.error('Failed to scrape courses:', error);
    }
}

main();
