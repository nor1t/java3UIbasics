import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openAiKey = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'Mesazhi është i zbrazët' },
        { status: 400 }
      );
    }

    // Check if using a demo/fake key
    if (!openAiKey || openAiKey.includes('projekti')) {
      // Return a demo response
      const demoResponses = [
        `Demo përgjigje për: "${message}"\n\nKjo është një përgjigje demo sepse nuk keni vendosur një çelës valid OpenAI. Për funksionimin real, siguroni që të keni një çelës valid nga https://platform.openai.com/`,
        `Përgjigja për pyetjen tuaj: "${message}"\n\nEste është më vetëm një demo. Për të përdorur AI-në real, duhet të shtoni çelësin tuaj OpenAI në .env.local`,
        `Faleminderit për pyetjen: "${message}"\n\nNë modalitetin demo, nuk mund të lidhem me OpenAI. Shtoni çelësin tuaj personal për përgjigje real.`
      ];
      const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
      return NextResponse.json({ reply: randomResponse });
    }

    const client = new OpenAI({
      apiKey: openAiKey,
    });

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Je një asistent i dobishëm. Përgjigju shkurt dhe qartë.' },
        { role: 'user', content: message },
      ],
      max_tokens: 500,
    });

    const reply = completion.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Gabim gjatë komunikimit me AI. Siguroni që të keni një çelës valid OpenAI.' },
      { status: 500 }
    );
  }
}