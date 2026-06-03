export interface AgentMessage {
  id: string;
  role: 'agent';
  content: string;
  badge?: string;
  alternatives?: string[];
  altNote?: string;
  actions?: { primary: string; secondary: string };
  isTyping?: boolean;
}

export interface UserMessage {
  id: string;
  role: 'user';
  content: string;
}

export type Message = AgentMessage | UserMessage;
