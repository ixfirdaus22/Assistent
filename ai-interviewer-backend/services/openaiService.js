const { Configuration, OpenAIApi } = require("openai");

const Configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateQuestion(jobRole, industry, difficulty) {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: 'Generate a ${difficulty} ${jobRole} interview question for the ${industry} industry.',
            max_tokens: 100,
            n: 1,
            stop: null,
            temperature: 0.7,
        });

        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error("Error generating question:", error);
        throw error;
    }
}

async function analyseResponse(question, answer, jobRole) {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: 'Analyse the following answer to the ${jobRole} interview question: "${question}"\n\nAnswer: "${answer}"\n\nProvide feedback and a score out of 10.',
            max_tokens: 150,
            n: 1,
            stop: null,
            temperature: 0.5,
        });

        const analysis = response.data.choices[0].text.trim();
        const scoreMatch = analysis.match(/(\d+(\.\d+)?)\s*\/\s*10/);
        const score = scoreMatch ? parseFloat(scoreMatch[1]) : null;

        return {
            feedback: analysis,
            score: score
        };
    } catch (error) {
        console.error("Error analysing response:", error);
        throw error;
    }
}

module.exports = { generateQuestion, analyseResponse };