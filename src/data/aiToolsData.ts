import type { AITool } from '../lib/types';

export const aiToolsData: AITool[] = [
  {
    id: '1',
    name: 'GitHub Copilot',
    category: 'Code Generation',
    description: 'AI pair programmer that helps you write code faster and with less work. GitHub Copilot draws context from comments and code to suggest individual lines and whole functions instantly.',
    url: 'https://github.com/features/copilot',
    imageUrl: '/icons/github-copilot.svg', // Placeholder - ensure you have this image
    tags: ['development', 'coding', 'IDE', ' productividad'],
    pricing: 'Paid',
    reviewDate: '2023-10-01',
  },
  {
    id: '2',
    name: 'ChatGPT',
    category: 'Content Creation',
    description: 'A powerful conversational AI capable of generating human-like text, answering questions, writing essays, and more. Useful for brainstorming, drafting, and summarizing content.',
    url: 'https://chat.openai.com/',
    imageUrl: '/icons/chatgpt.svg', // Placeholder - ensure you have this image
    tags: ['writing', 'general purpose', 'chatbot', 'research'],
    pricing: 'Freemium',
    reviewDate: '2023-09-15',
  },
  {
    id: '3',
    name: 'Midjourney',
    category: 'Image Generation',
    description: 'An independent research lab exploring new mediums of thought and expanding the imaginative powers of the human species. Generates images from textual descriptions.',
    url: 'https://www.midjourney.com/',
    imageUrl: '/icons/midjourney.png', // Placeholder - ensure you have this image
    tags: ['art', 'design', 'creative', 'text-to-image'],
    pricing: 'Paid',
    reviewDate: '2023-11-05',
  },
  {
    id: '4',
    name: 'Notion AI',
    category: 'Productivity',
    description: 'Leverage the power of AI in your Notion workspace. Summarize, find action items, translate, explain, and improve your writing without leaving Notion.',
    url: 'https://www.notion.so/product/ai',
    imageUrl: '/icons/notion-ai.svg', // Placeholder - ensure you have this image
    tags: ['notes', 'writing', 'summarization', 'workspace'],
    pricing: 'Paid',
    reviewDate: '2023-10-20',
  },
]; 