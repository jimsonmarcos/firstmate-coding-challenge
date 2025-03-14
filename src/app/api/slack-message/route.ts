import axios from "axios";

export async function POST(request: Request) {
    const { message, webhookURL } = await request.json();
    
    const payload = { text: message };

    const response = await axios.post(webhookURL, payload);
  
    return new Response('Message sent to Slack', { status: response.status });
  }