/**
 * Extracts and parses JSON-formatted data from Gemini response
 * @param {string} rawData - The raw string output from Gemini
 * @returns {object} Parsed quiz object or error message
 */
export function formatJson(rawData) {
  try {
    const jsonMatch = rawData.match(/```json\s*([\s\S]*?)\s*```/i);
    const jsonString = jsonMatch ? jsonMatch[1] : quizRaw;
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("JSON parsing failed:", err.message);
    return null;
  }
}

export function formatStudyPlan(planRaw) {
  return planRaw.trim().split('\n').map(line => line.trim()).filter(Boolean);
}

export function formatCourse(courseRaw) {
  return courseRaw.split('\n\n').map(section => section.trim());
}
