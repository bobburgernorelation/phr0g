const pdfParse = require('pdf-parse');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

class ResumeParser {
    async parsePDF(buffer) {
        const data = await pdfParse(buffer);
        return this.extractResumeDetails(data.text);
    }

    async extractResumeDetails(text) {
        const prompt = `Extract the following details from this resume text:
${text}

Extract:
- Name
- Contact Information
- Skills
- Work Experience
- Education

Return the result in JSON format.`;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt,
            max_tokens: 500,
            temperature: 0.3,
        });

        return JSON.parse(response.data.choices[0].text.trim());
    }
}

module.exports = new ResumeParser(); 