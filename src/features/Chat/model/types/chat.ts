// chat.ts - типы для API чата

export type ConversationType = "private" | "group";
export type ParticipantRole = "admin" | "member";
export type FileType = "image" | "video" | "file";

export interface ChatUser {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  avatar: string;
  role: string;
  position: string;
  email: string;
  bio: string;
  number_phone: string;
  telegram_username: string;
  group: string;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  title: string | null;
  created_by: number;
  created_at: string;
  service: string | null;
  service_id: string | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: number;
  text: string | null;
  reply_to: string | null;
  is_edited: boolean;
  created_at: string;
}

export interface Participant {
  user_id: number;
  role: ParticipantRole;
  joined_at: string;
}

export interface Attachment {
  id: number;
  message_id: string;
  file_url: string;
  file_type: FileType;
  file_size: number;
  created_at: string;
}

// Request типы
export interface CreateConversationRequest {
  type: ConversationType;
  title?: string | null;
  participant_ids?: number[];
  service?: string | null;
  service_id?: string | null;
}

export interface SendMessageRequest {
  conversation_id: string;
  sender_id: number;
  text?: string | null;
  reply_to?: string | null;
}

export interface EditMessageRequest {
  text: string;
}

export interface AddParticipantRequest {
  user_id: number;
  role?: ParticipantRole | null;
}

export interface CreateAttachmentRequest {
  message_id: string;
  file_url: string;
  file_type: FileType;
  file_size: number;
}

// WebSocket типы
export interface WebSocketMessage {
  type: "message:new";
  payload: Message | { text?: string; reply_to?: string | null };
}

// Расширенные типы для UI
export interface ConversationWithLastMessage extends Conversation {
  last_message?: Message;
  unread_count?: number;
  participants?: Participant[];
}

export interface MessageWithSender extends Message {
  sender?: {
    id: number;
    name: string;
    avatar?: string;
    email?: string;
  };
}
