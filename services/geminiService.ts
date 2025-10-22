import { GoogleGenAI, Type, GenerateContentResponse, Chat, Modality } from "@google/genai";
import { LearningRoadmap, CareerPath, ResumeData } from '../types';

// FIX: Per @google/genai guidelines, the API key must be obtained exclusively from `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const roadmapSchema = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING },
        steps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    resources: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                type: { type: Type.STRING, enum: ['youtube', 'book', 'article', 'documentation'] },
                                title: { type: Type.STRING },
                                url: { type: Type.STRING },
                            },
                            required: ['type', 'title', 'url']
                        },
                    },
                },
                required: ['title', 'description', 'resources']
            },
        },
    },
    required: ['topic', 'steps']
};

const careerPathSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The name of the recommended career path, e.g., 'AI Engineer'." },
        description: { type: Type.STRING, description: "A detailed description of this career path and why it fits the user's interests." },
        learningPlan: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A high-level, step-by-step learning plan." },
        certifications: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Recommended professional certifications." },
        jobPortals: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Popular job portals or websites to find jobs in this field." },
    },
    required: ['name', 'description', 'learningPlan', 'certifications', 'jobPortals']
};

export const generateLearningRoadmap = async (topic: string): Promise<LearningRoadmap> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `Generate a detailed learning roadmap for the topic: "${topic}". The roadmap should be structured with clear steps, and each step should include a title, a description, and a list of diverse resources like YouTube videos, books, articles, and official documentation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: roadmapSchema,
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as LearningRoadmap;
  } catch (error) {
    console.error("Error generating learning roadmap:", error);
    throw new Error("Failed to generate learning roadmap. Please check your API key and try again.");
  }
};

export const recommendCareerPath = async (answers: Record<string, string>): Promise<CareerPath> => {
    const prompt = `
        Based on the following user quiz answers, recommend a suitable tech career path.
        Provide a detailed plan including a description, learning steps, certification suggestions, and job portals.

        User Interests: ${answers.interests}
        Preferred Activities: ${answers.activities}
        Learning Style: ${answers.learningStyle}
        Career Goal: ${answers.goal}
    `;
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: careerPathSchema,
                thinkingConfig: { thinkingBudget: 32768 },
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as CareerPath;
    } catch (error) {
        console.error("Error recommending career path:", error);
        throw new Error("Failed to recommend career path. Please check your API key and try again.");
    }
};

export const createChat = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash-lite',
        config: {
            systemInstruction: 'You are EduFluxAI\'s Smart Tutor. You are a helpful and friendly AI assistant for students learning about technology. Keep your answers concise and encouraging. You can answer questions related to courses, topics, or concepts.',
        },
    });
};

export const generateResume = async (data: ResumeData): Promise<string> => {
    const experienceText = data.experience.map(exp => `
- Job Title: ${exp.title}
  Company: ${exp.company}
  Dates: ${exp.dates}
  Description: ${exp.description}
    `).join('');

    const educationText = data.education.map(edu => `
- Degree: ${edu.degree}
  School: ${edu.school}
  Dates: ${edu.dates}
    `).join('');

    const prompt = `
        Act as a professional resume writer and career coach.
        Generate a professional resume based on the following information.
        The output must be in clean, well-structured Markdown format.
        Use strong action verbs and quantify achievements where possible.
        The resume should be tailored for a tech industry role.

        **Personal Information:**
        - Name: ${data.name}
        - Email: ${data.email}
        - Phone: ${data.phone}

        **Summary:**
        ${data.summary}

        **Work Experience:**
        ${experienceText}

        **Education:**
        ${educationText}

        **Skills:**
        ${data.skills}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 32768 },
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating resume:", error);
        throw new Error("Failed to generate resume. Please check your API key and try again.");
    }
};


export const getFutureTrends = async (career: string): Promise<{ text: string; sources: any[] }> => {
    const prompt = `
        Act as a tech industry analyst and futurist.
        For the career path "${career}", predict the key trends, technologies, and skills that will be in high demand over the next 5 years.
        Use Google Search to find the most up-to-date information.
        Structure your response in clear, concise Markdown. Use headings for different sections like 'Key Technologies', 'Evolving Skills', and 'Future Outlook'.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              tools: [{googleSearch: {}}],
            },
        });
        
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        return { text: response.text, sources };

    } catch (error) {
        console.error("Error getting future trends:", error);
        throw new Error("Failed to get future trends. Please check your API key and try again.");
    }
};

export const getDSAHint = async (problemTitle: string): Promise<string> => {
    const prompt = `
        I am a student working on the Data Structures and Algorithms problem: "${problemTitle}".
        Please provide a helpful, high-level hint to guide me in the right direction.
        Do not give away the full solution. Focus on the underlying concept, a potential data structure to use, or the general approach to take.
        Keep the hint to 2-3 sentences.
    `;
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting DSA hint:", error);
        throw new Error("Failed to get DSA hint. Please try again.");
    }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts',
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return audioBase64 || null;
    } catch (error) {
        console.error("Error generating speech:", error);
        // Don't throw, just return null so the app doesn't crash if TTS fails
        return null;
    }
};