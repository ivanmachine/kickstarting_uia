import { assertEquals, assertExists } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { get_all_required_cources } from "../src/get_all_required_cources.ts";

Deno.test.only("get_all_required_cources", async (t) => {
  await t.step("should return an array of courses", async () => {
    const courses = await get_all_required_cources();
    
    assertExists(courses, "Courses array should exist");
    assertEquals(Array.isArray(courses), true, "Result should be an array");
  });

  await t.step("should return between 5 and 100 courses", async () => {
    const courses = await get_all_required_cources();
    
    assertEquals(courses.length >= 5, true, "Should have at least 5 courses");
    assertEquals(courses.length <= 100, true, "Should have at most 100 courses"); 
  });
});