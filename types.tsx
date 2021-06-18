export type StackParams = {
  Root: any;
  Chat: {
    ChatUser: UserType;
  };
  Users: undefined;
  Contacts: undefined;
};
export type MainTabParamsListType = {
  Camera: undefined;
  Chats: undefined;
  Status: undefined;
  Calls: undefined;
};
export type ChatRoomType = {
  ID: string;
  Name: string;
  ImageURI: string;
  Group: boolean;
  Participants: [UserType];
  Messages: [MessageType];
};
export type ChatType = {
  ID: string;
  Name: string;
  ImageURI: string;
  Group: boolean;
  Messages: [MessageType];
};
export type UserType = {
  ID: string;
  Name: string;
  Email: string;
  ImageURI: string;
  Status: string;
  Chats: Array<ChatRoomType>;
  Contacts: Array<ContactType>;
};
export type ContactType = {
  ID: string;
  Name: string;
  Email: string;
  ImageURI: string;
  Status: string;
};
export type MessageType = {
  Content: string;
  CreatedBy: ContactType;
  CreatedAt: string;
};
