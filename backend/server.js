require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Load context data from files
const loadContextData = () => {
  try {
    const dataDir = path.join(__dirname, 'data');
    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.txt'));
    
    let contextData = '';
    files.forEach(file => {
      const filePath = path.join(dataDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      contextData += content + '\n\n';
    });
    
    return contextData.trim();
  } catch (error) {
    console.error('Error loading context data:', error);
    return '';
  }
};

// Default system prompt
const DEFAULT_SYSTEM_PROMPT = `You are a helpful assistant. Base your responses on the following context information. If you don't know the answer based on this context, say so politely.\n\nContext: {context}`;


// DeepSeek API integration
async function callDeepSeekAPI(messages) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error('DeepSeek API key is not configured');
    }

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.7,
        stream: true
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        responseType: 'stream'
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    throw error;
  }
}

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }

    // Load context data
    const contextData = loadContextData();
    
    // Prepare messages with system prompt
    const systemPrompt = DEFAULT_SYSTEM_PROMPT.replace('{context}', contextData);
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    // Set up streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Call DeepSeek API with streaming
    const stream = await callDeepSeekAPI(formattedMessages);
    
    stream.on('data', (chunk) => {
      const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.substring(6);
          if (data === '[DONE]') {
            res.write(`data: [DONE]\n\n`);
          } else {
            try {
              const parsed = JSON.parse(data);
              if (parsed.choices && parsed.choices[0].delta.content) {
                res.write(`data: ${JSON.stringify({ content: parsed.choices[0].delta.content })}\n\n`);
              }
            } catch (e) {
              console.error('Error parsing streaming response:', e);
            }
          }
        }
      }
    });

    stream.on('end', () => {
      res.end();
    });

    stream.on('error', (error) => {
      console.error('Stream error:', error);
      res.write(`data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`);
      res.end();
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});