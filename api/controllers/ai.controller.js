import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateTitle = async (req, res, next) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ success: false, message: "Content is required"});
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Based on the following blog content, suggest a catchy, SEO-friendly title that is under 60 characters. Return only the title text. Content: ${content}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim().replace(/^["']|["']$/g, '');

        res.status(200).json({ success: true, title: text });
    } catch (error) {
        next(error);
    }
};

export const refineContent = async (req, res, next) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ success: false, message: "Content is required" });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Act as an expert blog editor. Refine and polish the following content while maintaining its original meaning and tone. Improve grammar, flow, and professional appeal. Content: ${content}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        res.status(200).json({ success: true, content: text });
    } catch (error) {
        next(error);
    }
};
