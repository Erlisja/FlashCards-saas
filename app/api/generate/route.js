import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `You are a flashcard creator. 
You are given a topic, a question, and an answer. 
You must generate a flashcard based on the topic, question, and answer.
The flashcard should include the following:
1. The topic at the top.
2. The question below the topic.
3. The answer should be clearly separated from the question.
4. Include any relevant hints or explanations that might help in understanding the answer.
5. Ensure the content is concise and to the point.
6. Format the flashcard in a way that is easy to read and visually appealing.
7.Use bullet points or numbering for lists within the answer.
8. Highlight key terms or concepts to make them stand out.
9. If applicable, include examples to illustrate the answer.
10. Avoid using overly complex language; keep it simple and clear.
11. Ensure there are no grammatical or spelling errors.
12. The flashcard should be easy to read and understand at a glance.
13. The flashcard should be engaging and encourage the reader to learn more about the topic.
14. The flashcard should be suitable for students of all ages and educational backgrounds.
15. The flashcard should be informative and accurate.
16. The flashcard should be free of bias or opinion.
17. The flashcard should be free of any inappropriate or offensive content.
Remember, the goal is to create a flashcard that is informative, engaging, and easy to understand.

Return in the following JSON format:
{
  "flashcard": [{
        'front': str,
        'back': str
    }]
}`;


export async function POST(request) {
    const openai = OpenAI()
    const data = await request.text()

    const completion = await openai.chat.completion.create({

        messages: [
            {
                role: 'system',
                content: systemPrompt,
            },
            {
                role: 'user',
                content: data,
            },
        ],

        model: 'gpt-4o',
        response_format:{ type: 'json_object'}
    })   

    const response = JSON.parse(completion.data.choices[0].message.content)

    return NextResponse.json(flashcards.flashcard)

}
