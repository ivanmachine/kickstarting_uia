import { assertEquals } from "https://deno.land/std@0.220.1/assert/mod.ts";
import { get_all_available_exams } from "../src/get_all_availbale_exams.ts";

// Add shared variable to store exams
let exams: Awaited<ReturnType<typeof get_all_available_exams>>;

// Add beforeAll setup
Deno.test({
  name: "setup",
  fn: async () => {
    exams = await get_all_available_exams();
  },
  sanitizeOps: false,
  sanitizeResources: false,
});

Deno.test("getAllAvailableExams returns array of correct size", () => {
  // Check if result is an array
  assertEquals(Array.isArray(exams), true);
  
  // Check if array length is between 5 and 100
  assertEquals(exams.length >= 5 && exams.length <= 100, true);
});

Deno.test("getAllAvailableExams returns correctly structured exam objects", () => {
  // Test the first exam in the array
  const firstExam = exams[0];
  
  // Check if the exam has all required properties
  assertEquals(typeof firstExam.cource_code, "string");
  assertEquals(Array.isArray(firstExam.cource_requirements), true);
  assertEquals(typeof firstExam.faculty, "string");
  assertEquals(
    ["bachelor", "master", "phd"].includes(firstExam.study_type), 
    true
  );
  assertEquals(typeof firstExam.course_name, "string");
});

Deno.test("getAllAvailableExams returns unique course codes", () => {
  // Get all course codes
  const courseCodes = exams.map(exam => exam.cource_code);
  
  // Convert to Set and back to array to get unique values
  const uniqueCourseCodes = [...new Set(courseCodes)];
  
  // Check if the number of unique codes equals the total number of codes
  assertEquals(courseCodes.length, uniqueCourseCodes.length);
});

Deno.test("getAllAvailableExams handles empty requirements", () => {
  // Check if there's at least one exam with no requirements
  const hasEmptyRequirements = exams.some(exam => 
    exam.cource_requirements.length === 0
  );
  
  assertEquals(hasEmptyRequirements, true);
});
