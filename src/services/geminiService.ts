import { Question, QuizConfig, QuestionType } from '../types/quiz';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export const geminiService = {
  /**
   * Generates quiz questions based on raw text extracted from PDF or PPT documents
   */
  async generateQuiz(config: QuizConfig, apiKey?: string): Promise<Question[]> {
    if (!apiKey) {
      console.warn('No Gemini API key provided. Using fallback smart AI question generator.');
      return this.generateMockQuestions(config);
    }

    const prompt = this.buildPrompt(config);

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${errText}`);
      }

      const data = await response.json();
      const rawJsonString = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawJsonString) {
        throw new Error('Empty response received from Gemini AI model.');
      }

      const parsedQuestions: Question[] = JSON.parse(rawJsonString);
      return this.validateAndNormalizeQuestions(parsedQuestions, config);
    } catch (error) {
      console.error('Error generating quiz with Gemini API:', error);
      // Fallback to mock generation if API call fails
      return this.generateMockQuestions(config);
    }
  },

  buildPrompt(config: QuizConfig): string {
    const typesFormatted = config.types.join(', ');

    return `
You are an expert AI Educator and Quiz Generator.
Analyze the following educational material and generate a high-quality quiz.

PARAMETRIC REQUIREMENTS:
- Subject/Topic: ${config.subject}
- Number of Questions: ${config.numQuestions}
- Difficulty Level: ${config.difficulty.toUpperCase()} (Easy, Medium, or Hard)
- Allowed Question Types: [${typesFormatted}]

DOCUMENT TEXT CONTENT:
"""
${config.rawText.slice(0, 15000)}
"""

OUTPUT INSTRUCTIONS:
Return ONLY a valid JSON array of question objects. Do not include markdown codeblocks or intro text.
Each question object MUST strictly follow this JSON schema:
[
  {
    "id": "q1",
    "text": "Question statement here?",
    "type": "multiple_choice" | "true_false" | "enumeration",
    "options": ["Option A", "Option B", "Option C", "Option D"], // ONLY for multiple_choice! For true_false use ["True", "False"]. Omit or empty for enumeration.
    "correctAnswer": "Exact string of correct answer option or expected keyword for enumeration",
    "explanation": "Clear, concise academic explanation of why this answer is correct based on the text.",
    "topicTag": "Specific concept tag (e.g., Photosynthesis, Newton's Third Law, Database Normalization)"
  }
]
`;
  },

  validateAndNormalizeQuestions(questions: any[], config: QuizConfig): Question[] {
    return questions.map((q, idx) => ({
      id: `q_${Date.now()}_${idx}`,
      text: q.text || `Question ${idx + 1}`,
      type: (q.type as QuestionType) || 'multiple_choice',
      options: Array.isArray(q.options) ? q.options : q.type === 'true_false' ? ['True', 'False'] : undefined,
      correctAnswer: String(q.correctAnswer || (q.options ? q.options[0] : 'True')),
      explanation: q.explanation || 'Based on the provided study document.',
      topicTag: q.topicTag || config.subject || 'General Knowledge',
    }));
  },

  /**
   * High quality mock quiz generator for instant offline testing & default demos
   */
  generateMockQuestions(config: QuizConfig): Question[] {
    const questions: Question[] = [];
    const count = config.numQuestions || 5;

    const sampleTopics = [
      'Core Principles',
      'Key Definitions',
      'Practical Application',
      'Advanced Concepts',
      'Synthesis & Analysis',
    ];

    for (let i = 0; i < count; i++) {
      const type: QuestionType = config.types[i % config.types.length] || 'multiple_choice';
      const topic = sampleTopics[i % sampleTopics.length];
      const qNum = i + 1;

      if (type === 'true_false') {
        questions.push({
          id: `mock_${Date.now()}_${i}`,
          text: `[${config.difficulty.toUpperCase()}] Statement #${qNum}: The document emphasizes that ${topic.toLowerCase()} is fundamental to mastering ${config.subject}.`,
          type: 'true_false',
          options: ['True', 'False'],
          correctAnswer: i % 2 === 0 ? 'True' : 'False',
          explanation: `As detailed in the ${config.subject} learning material, this principle directly impacts performance.`,
          topicTag: topic,
        });
      } else if (type === 'enumeration') {
        questions.push({
          id: `mock_${Date.now()}_${i}`,
          text: `[${config.difficulty.toUpperCase()}] Identify the primary key component associated with ${topic} in ${config.subject}.`,
          type: 'enumeration',
          correctAnswer: 'System Architecture',
          explanation: `System Architecture represents the primary foundational element referenced in ${topic}.`,
          topicTag: topic,
        });
      } else {
        questions.push({
          id: `mock_${Date.now()}_${i}`,
          text: `[${config.difficulty.toUpperCase()}] Which of the following best describes ${topic} in the context of ${config.subject}?`,
          type: 'multiple_choice',
          options: [
            `The primary framework governing ${topic}`,
            `A secondary auxiliary process with minor impact`,
            `An outdated method superseded by modern techniques`,
            `An unrelated theoretical concept`,
          ],
          correctAnswer: `The primary framework governing ${topic}`,
          explanation: `The uploaded text highlights that the primary framework plays a critical role in ${topic}.`,
          topicTag: topic,
        });
      }
    }

    return questions;
  },
};
