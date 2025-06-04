import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import the Gemini client library

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = 3001; // Backend port

app.use(cors());
app.use(bodyParser.json());

// Initialize the Gemini client
const geminiApiKey = process.env.GEMINI_API_KEY; // Get API key from environment variable

if (!geminiApiKey) {
  console.error("GEMINI_API_KEY is not set in environment variables.");
  // Depending on your needs, you might want to exit or disable AI features here.
  // For now, we'll just log the error and the API calls will likely fail.
}

// Use a conditional check before initializing genAI
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;
// Use a conditional check before getting the model
const geminiModel = genAI
  ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  : null; // Use gemini-1.5-flash

// In-memory data store (replace with a database in a real application)
let chats = [
  {
    id: 1,
    name: "Alice",
    lastMessage: "Hey, how are you?",
    unread: 2,
    type: "person",
  },
  {
    id: 2,
    name: "AI Assistant",
    lastMessage: "How can I help you today?",
    unread: 0,
    type: "ai",
  },
  {
    id: 3,
    name: "Bob",
    lastMessage: "See you later!",
    unread: 0,
    type: "person",
  },
];

let messages = [
  { id: 1, chatId: 1, text: "Hello Alice!", sender: "other", time: "10:00 AM" },
  { id: 2, chatId: 1, text: "Hi there!", sender: "me", time: "10:01 AM" },
  {
    id: 3,
    chatId: 1,
    text: "How are you doing?",
    sender: "other",
    time: "10:02 AM",
  },
  {
    id: 4,
    chatId: 1,
    text: "I'm good, thanks! How about you?",
    sender: "me",
    time: "10:03 AM",
  },
  {
    id: 5,
    chatId: 1,
    text: "I'm doing well too.",
    sender: "other",
    time: "10:04 AM",
  },
  { id: 6, chatId: 2, text: "Hello AI!", sender: "me", time: "10:05 AM" },
  {
    id: 7,
    chatId: 2,
    text: "How can I help you today?",
    sender: "ai",
    time: "10:06 AM",
  },
  { id: 8, chatId: 3, text: "Hey Bob!", sender: "me", time: "10:07 AM" },
  {
    id: 9,
    chatId: 3,
    text: "See you later!",
    sender: "other",
    time: "10:08 AM",
  },
];

// Endpoint to fetch all chats
app.get("/chats", (req, res) => {
  console.log("GET /chats");
  // Removed simulate network delay
  res.json(chats);
});

// Endpoint to fetch messages for a specific chat
app.get("/chats/:chatId/messages", (req, res) => {
  const chatId = parseInt(req.params.chatId);
  console.log(`GET /chats/${chatId}/messages`);
  const messagesForChat = messages.filter((msg) => msg.chatId === chatId);
  // Removed simulate network delay
  res.json(messagesForChat);
});

// Endpoint to send a new message
app.post("/chats/:chatId/messages", async (req, res) => {
  const chatId = parseInt(req.params.chatId);
  const { text } = req.body;

  console.log(`POST /chats/${chatId}/messages with text: "${text}"`);

  if (!text) {
    console.log("Error: Message text is required");
    return res.status(400).json({ error: "Message text is required" });
  }

  const newMessage = {
    id: Date.now(), // Simple unique ID
    chatId: chatId,
    text,
    sender: "me", // Assuming current user is 'me'
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  messages.push(newMessage);
  console.log("Added user message to in-memory store.");

  // Update last message in chats
  const chatIndex = chats.findIndex((chat) => chat.id === chatId);
  if (chatIndex !== -1) {
    chats[chatIndex].lastMessage = text;
    // Move the chat to the top (optional, but good UX)
    const [movedChat] = chats.splice(chatIndex, 1);
    chats.unshift(movedChat);
    console.log(`Updated last message for chat ${chatId} and moved to top.`);
  }

  const selectedChat = chats.find((chat) => chat.id === chatId);

  if (selectedChat && selectedChat.type === "ai") {
    console.log("Chat is an AI chat. Calling Gemini API...");
    try {
      if (!geminiModel) {
        console.error(
          "Gemini API client not initialized. GEMINI_API_KEY might be missing.",
        );
        return res.status(201).json(newMessage);
      }
      console.log(`Sending text to Gemini API: "${text}"`);
      // Call Gemini API using the client library
      const result = await geminiModel.generateContent(text); // Use generateContent method
      console.log("Received result from Gemini API.");
      const response = await result.response; // Get the response object
      const aiMessageText = response.text(); // Extract text using the text() method

      console.log(`Received text from Gemini API response: "${aiMessageText}"`);

      const aiResponse = {
        id: Date.now() + 1, // Simple unique ID
        chatId: chatId,
        text: aiMessageText,
        sender: "ai",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      messages.push(aiResponse);
      console.log("Added AI response to in-memory store.");

      // Update last message in chats for AI response (the chat was moved to index 0)
      if (chats[0] && chats[0].id === chatId) {
        // Double check it's the correct chat
        chats[0].lastMessage = aiMessageText;
        console.log("Updated last message in chats with AI response.");
      }

      // Send the user's message back immediately after AI response is added
      console.log("Sending user message as response (status 201).");
      res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error calling Gemini API:", error); // Updated log message
      if (error.response) {
        console.error("Gemini API error response data:", error.response.data);
        console.error(
          "Gemini API error response status:",
          error.response.status,
        );
        console.error(
          "Gemini API error response headers:",
          error.response.headers,
        );
      } else if (error.request) {
        console.error("Gemini API error: No response received.", error.request);
      } else {
        console.error("Gemini API error:", error.message);
      }
      // If AI call fails, just send the user's message back
      console.log(
        "Sending user message as response due to API error (status 201).",
      );
      res.status(201).json(newMessage);
    }
  } else {
    // If not an AI chat, just send the user's message back immediately
    console.log(
      "Not an AI chat. Sending user message as response (status 201).",
    );
    res.status(201).json(newMessage);
  }
});

// Endpoint to create a new chat
app.post("/chats", (req, res) => {
  const { name, type } = req.body;

  console.log(`POST /chats with name: "${name}", type: "${type}"`);

  if (!name || !type) {
    console.log("Error: Name and type are required for creating chat.");
    return res.status(400).json({ error: "Name and type are required" });
  }

  const newChat = {
    id: Date.now(), // Simple unique ID
    name,
    lastMessage: "",
    unread: 0,
    type: type,
  };

  chats.unshift(newChat); // Add new chat to the beginning
  console.log("Created new chat and added to in-memory store.", newChat);

  res.status(201).json(newChat);
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
