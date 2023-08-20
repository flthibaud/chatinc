export type User = {
  id: number;
  email: string;
  avatar: string;
  username: string;
  first_name: string;
  last_name: string;
  about: string;
  status: string;
  last_seen: string;
  receive_notifications: boolean;
  remember_me_token: string;
  provider: string;
  deleted_at: string;
  created_at: string;
  updated_at: string;
}

export type Message = {
  id: number;
  sender_id: number;
  receiver_id: number;
  message_type: string;
  message: string;
  message_status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}