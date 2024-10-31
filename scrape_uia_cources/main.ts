import puppeteer from "https://deno.land/x/puppeteer@9.0.2/mod.ts";
import { get_all_available_exams } from "./src/get_all_availbale_exams.ts";
import { get_all_required_cources } from "./src/get_all_required_cources.ts";
import { osType } from "https://deno.land/std@0.93.0/_util/os.ts";
import type { Cource } from "./src/datatypes.d.ts";

const linux_chrome_path: string = "/usr/bin/google-chrome";
const macos_chrome_path: string = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

try {
    const browser = await puppeteer.launch({
        executablePath: osType === "linux" ? linux_chrome_path : macos_chrome_path,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        console.log("STEP 1: Fetching all required cources")
        const final_required_cources_list: Cource[] = [];

        const all_cources: Cource[][] = await get_all_required_cources(browser);
        const mechatronics_required_cources = all_cources[0];
        const computer_science_required_cources = all_cources[1];

        const overlapping_cources = mechatronics_required_cources.filter(cource =>
            computer_science_required_cources.some(c => c.cource_code === cource.cource_code)
        );
        console.log("\n=== Overlapping Courses between Mechatronics and Computer Science ===");
        console.log(`Found ${overlapping_cources.length} overlapping courses`);
        console.table(overlapping_cources);
        console.log("Sum of all overlapping course points: ", overlapping_cources.reduce((sum, cource) => sum + cource.cource_points, 0));

        const unique_mechatronics = mechatronics_required_cources.filter(cource =>
            !overlapping_cources.some(c => c.cource_code === cource.cource_code)
        );
        console.log("\n=== Unique Mechatronics Courses ===");
        console.log(`Found ${unique_mechatronics.length} unique mechatronics courses`);
        console.table(unique_mechatronics);
        console.log("Sum of all unique mechatronics course points: ", unique_mechatronics.reduce((sum, cource) => sum + cource.cource_points, 0));
        const unique_compsci = computer_science_required_cources.filter(cource =>
            !overlapping_cources.some(c => c.cource_code === cource.cource_code)
        );
        console.log("\n=== Unique Computer Science Courses ===");
        console.log(`Found ${unique_compsci.length} unique computer science courses`);
        console.table(unique_compsci);
        console.log("Sum of all unique computer science course points: ", unique_compsci.reduce((sum, cource) => sum + cource.cource_points, 0));

        final_required_cources_list.push(
            ...overlapping_cources,
            ...unique_mechatronics,
            ...unique_compsci
        );
        console.log(`\nSTEP 2: Found ${final_required_cources_list.length} total required courses`);
        console.log("Sum of all required course points: ", final_required_cources_list.reduce((sum, cource) => sum + cource.cource_points, 0));

        console.log("3. Fetching all available exams");
        const available_exams = await get_all_available_exams();

        console.log(`4. Found ${available_exams.length} available exams`);

        console.log("5. Comparing required and available exams");
        const overlapping_exams = final_required_cources_list
            .filter(cource => available_exams.some(exam => exam.cource_code === cource.cource_code))
            .map(cource => ({
                ...cource,
                cource_requirements: available_exams.find(exam => exam.cource_code === cource.cource_code)?.cource_requirements || 'N/A'
            }));
        console.log(`6. ${overlapping_exams.length} out of ${final_required_cources_list.length} required exams are available`);
        console.table(overlapping_exams);
        console.log("Sum of all available exam points: ", overlapping_exams.reduce((sum, exam) => sum + exam.cource_points, 0));
    } finally {
        await browser.close();
        Deno.exit(1);
    }
} catch (error) {
    console.error('Failed to scrape courses:', error);
}