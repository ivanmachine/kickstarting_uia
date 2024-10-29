# Scroll to the bottom, and paste this into the browser:

```js
// Paste this in your browser console when on the page
(async () => {
  // Get all columns
  const courseCodeElements = document.querySelectorAll(
    "div.tab-vizHeaderHolderWrapper:nth-child(1) div.tab-vizHeader"
  );
  const courseNameElements = document.querySelectorAll(
    "div.tab-vizHeaderHolderWrapper:nth-child(2) div.tab-vizHeader"
  );
  const facultyElements = document.querySelectorAll(
    "div.tab-vizHeaderHolderWrapper:nth-child(3) div.tab-vizHeader"
  );
  const studyTypeElements = document.querySelectorAll(
    "div.tab-vizHeaderHolderWrapper:nth-child(4) div.tab-vizHeader"
  );
  const requirementsElements = document.querySelectorAll(
    "div.tab-vizHeaderHolderWrapper:nth-child(5) div.tab-vizHeader"
  );

  const exams = [];

  for (let i = 0; i < courseCodeElements.length; i++) {
    exams.push({
      cource_code: courseCodeElements[i].innerHTML.trim(),
      course_name: courseNameElements[i].innerHTML.trim(),
      faculty: facultyElements[i].innerHTML.trim(),
      study_type: studyTypeElements[i].innerHTML.trim(),
      cource_requirements: requirementsElements[i].innerHTML.trim(),
    });
  }

  // Copy the result to clipboard as JSON
  copy(JSON.stringify(exams, null, 2));
  console.log("Data copied to clipboard!");
  console.log("Found", exams.length, "exams");
  return exams; // Also returns the data in console for inspection
})();
```
