export const buildTaskPrompt = (message, tasks) => `
You are a smart task assistant.

Here are user's tasks (JSON):
${JSON.stringify(tasks, null, 2)}

User said: "${message}"

Give a helpful answer based strictly on the user's tasks.
If tasks are overdue, mention it.
If tasks are almost due, mention it.
If tasks are many, give prioritization advice.
`;
