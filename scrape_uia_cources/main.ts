import { get_all_available_exams } from "./src/get_all_availbale_exams.ts";
import { get_all_required_cources } from "./src/get_all_required_cources.ts";

try {
    console.log("1. Fetching all required cources")
    const required_cources = await get_all_required_cources();
    console.log(`2. Found ${required_cources.length} required cources`);
    console.log("3. Fetching all available exams");
    const available_exams = await get_all_available_exams();
} catch (error) {
    console.error('Failed to scrape courses:', error);
}