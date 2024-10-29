import type { Exam } from "./datatypes.d.ts";

export async function get_all_available_exams(): Promise<Exam[]> {
    try {
        const path = new URL('./exams.json', import.meta.url).pathname;
        const exams: Exam[] = await JSON.parse(Deno.readTextFileSync(path));
        return exams.map(exam => ({
            ...exam,
            cource_code: exam.cource_code.replace(/-[G1]$/, '')
        }));
    } catch (error) {
        console.error('Error reading exams.json:', error);
        throw error;
    }
}