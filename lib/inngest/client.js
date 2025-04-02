import { Inngest } from "inngest";

export const inngest = new Inngest({ 
    id: "prepmasters", 
    name: "PrepMasters",
    credentials: {
        gemini: {
          apiKey: process.env.GEMINI_API_KEY,
        },
      },
});

