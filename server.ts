import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold, Type } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

const SYSTEM_INSTRUCTION = `You are MAZI KALU, the wise, friendly, and street-smart City AI for FindAba OS V2. 
  You represent the heartbeat of Aba (Enyimba City).
  
  Your Personality:
  - Wise: You know the history and secrets of Aba.
  - Friendly: You treat everyone like a brother or sister.
  - Funny & Street-smart: You use local slang (Pidgin/Igbo) naturally but stay professional when needed.
  - Helpful: You are the ultimate guide to Aba.
  
  Your Knowledge Base:
  - You know all markets (Ariaria, Ahia Ohuru, Cemetery, etc.).
  - You know the roads, landmarks, and neighbourhoods.
  - You can recommend businesses, products, and services based on real data from Supabase.
  
  Guidelines:
  - Never sound robotic.
  - Speak naturally (mixture of English, Pidgin, and Igbo where appropriate).
  - Use the tools provided to search for businesses, products, and community info.
  - Respect RLS: Only provide information that is publicly available or specifically requested.
  - If you don't know something about Aba, admit it and offer to find someone who does.
  - Always encourage "Made-in-Aba" products.
  
  Functional Capabilities:
  - Search businesses by category, market zone, or name.
  - Recommend products and compare prices.
  - Help with logistics, transport, and hotel bookings.
  - Analyze images (photos of products, signs, flyers) to provide context.
  
  Response Style:
  - Use markdown, lists, and bold text for readability.
  - Be proactive (suggest related things).`;

// Supabase Configuration
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

app.use(express.json());

// Paystack Integration
app.post("/api/paystack/initialize", async (req, res) => {
  try {
    const { email, amount, metadata } = req.body;
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Kobo
        metadata,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/paystack/verify/:reference", async (req, res) => {
  try {
    const { reference } = req.params;
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const paystackData = await response.json();
    
    if (paystackData.status && paystackData.data.status === 'success') {
      const { metadata, amount } = paystackData.data;
      const userId = metadata?.userId;
      
      if (userId) {
        const { data: existingTx } = await supabase
          .from('wallet_transactions')
          .select('id')
          .eq('reference', reference)
          .single();
          
        if (!existingTx) {
          const { error: txError } = await supabase.from('wallet_transactions').insert({
            user_id: userId,
            amount: amount / 100,
            type: 'credit',
            title: 'Wallet Funding (Paystack)',
            status: 'completed',
            reference: reference,
            created_at: new Date().toISOString()
          });
          
          if (!txError) {
            const { data: wallet } = await supabase.from('wallets').select('balance').eq('user_id', userId).single();
            const newBalance = (wallet?.balance || 0) + (amount / 100);
            await supabase.from('wallets').update({ balance: newBalance }).eq('user_id', userId);
          }
        }
      }
    }
    res.json(paystackData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/paystack/webhook", async (req, res) => {
  // TODO: Implement signature verification
  const event = req.body;
  console.log("Paystack Webhook:", event);
  res.sendStatus(200);
});

// API Routes
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const modelName = 'gemini-3.5-flash';
    
    const tools = [
      {
        functionDeclarations: [
          {
            name: 'search_businesses',
            description: 'Search for businesses in Aba by query, category, or market zone.',
            parameters: {
              type: Type.OBJECT,
              properties: {
                query: { type: Type.STRING, description: 'Search term' },
                category: { type: Type.STRING, description: 'Business category' },
                market_zone: { type: Type.STRING, description: 'Market area' },
              },
            },
          },
          {
            name: 'search_products',
            description: 'Search for products available in Aba markets.',
            parameters: {
              type: Type.OBJECT,
              properties: {
                query: { type: Type.STRING, description: 'Product name or description' },
                category: { type: Type.STRING },
              },
            },
          },
          {
            name: 'get_city_stats',
            description: 'Get real-time statistics about Aba.',
          },
        ],
      },
    ];

    // Convert messages to Gemini format
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    let currentResponse = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: tools as any,
      }
    });

    // Handle potential tool calls in a loop (max 5 turns)
    let turns = 0;
    while (currentResponse.functionCalls && currentResponse.functionCalls.length > 0 && turns < 5) {
      turns++;
      const toolParts = [];
      
      for (const call of currentResponse.functionCalls) {
        let toolResponse = {};
        if (call.name === 'search_businesses') {
          const { query, category, market_zone } = call.args as any;
          let dbQuery = supabase.from('businesses').select('*');
          if (query) dbQuery = dbQuery.ilike('name', `%${query}%`);
          if (category) dbQuery = dbQuery.ilike('category', `%${category}%`);
          if (market_zone) dbQuery = dbQuery.ilike('market_zone', `%${market_zone}%`);
          const { data } = await dbQuery.limit(5);
          toolResponse = { result: data || [] };
        } else if (call.name === 'search_products') {
          const { query, category } = call.args as any;
          let dbQuery = supabase.from('products').select('*');
          if (query) dbQuery = dbQuery.ilike('name', `%${query}%`);
          if (category) dbQuery = dbQuery.ilike('category', `%${category}%`);
          const { data } = await dbQuery.limit(5);
          toolResponse = { result: data || [] };
        } else if (call.name === 'get_city_stats') {
          const { count: businesses } = await supabase.from('businesses').select('*', { count: 'exact', head: true });
          const { count: products } = await supabase.from('products').select('*', { count: 'exact', head: true });
          const { count: profiles } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
          toolResponse = { businesses_count: businesses || 0, products_count: products || 0, citizens_count: profiles || 0 };
        }

        toolParts.push({
          functionResponse: {
            name: call.name,
            response: toolResponse,
          }
        });
      }

      // Append model's tool call and our response
      contents.push(currentResponse.candidates![0].content);
      contents.push({ role: 'user', parts: toolParts });

      currentResponse = await ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: tools as any,
        }
      });
    }

    res.json({ content: currentResponse.text || "I'm having a bit of trouble connecting to the city grid right now. Try again in a second!" });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: 'Mazi Kalu is currently resting. Please try again later.' });
  }
});

// Tool Implementations (Internal API endpoints or direct Supabase calls)
// In a real scenario, we'd handle tool calls within the stream loop or using a dispatcher.
// For this demo, we'll implement the logic that the AI would trigger.

// Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mazi Kalu is awake on http://localhost:${PORT}`);
  });
}

startServer();
