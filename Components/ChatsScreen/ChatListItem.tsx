import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { ChatRoomType, StackParams, UserType } from '../../types';
import { useNavigation } from '@react-navigation/native';
import { Socket } from 'socket.io-client';
import { StackNavigationProp } from '@react-navigation/stack';
const ChatListItem = ({
  CurrentUser,
  Chat,
}: {
  CurrentUser: any;
  Chat: ChatRoomType;
}) => {
  const navigation = useNavigation<StackNavigationProp<StackParams>>();
  const [ChatUser, setChatUser] = useState<UserType>({
    ID: '',
    Name: '',
    Email: '',
    ImageURI: '',
    Status: '',
    Chats: [] as any,
    Contacts: [] as any,
  });
  const { Name, ImageURI, Group, Messages, Participants } = Chat;
  useEffect(() => {
    setChatUser(
      Participants.filter(Participant => {
        return Participant.ID != CurrentUser.ID && Participant;
      })[0],
    );
  }, []);
  const LastMessage = Messages[Messages.length - 1];
  return (
    <Pressable
      style={Styles.ChatItemContainer}
      onPress={() =>
        navigation.navigate('Chat', {
          ChatUser: ChatUser,
        })
      }>
      <Image
        style={Styles.ChatItemImage}
        source={{ uri: Group ? ImageURI : ChatUser.ImageURI || undefined }}
      />
      <View style={Styles.ChatItemContent}>
        <View style={Styles.ChatName_Time}>
          <Text style={Styles.ChatName}>{Group ? Name : ChatUser.Name}</Text>
          <Text style={Styles.ChatTime}>{LastMessage.CreatedAt}</Text>
        </View>
        <Text style={Styles.ChatMessage} numberOfLines={1}>
          {Chat.Group
            ? `${LastMessage.CreatedBy.Name}: ${LastMessage.Content}`
            : LastMessage.Content}
        </Text>
      </View>
    </Pressable>
  );
};

export default ChatListItem;

const Styles = StyleSheet.create({
  ChatItemContainer: {
    padding: 15,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  ChatItemImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  ChatItemContent: {
    flexGrow: 1,
    marginLeft: 10,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  ChatName_Time: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ChatName: {
    fontSize: 16,
    fontWeight: '500',
  },
  ChatTime: {
    fontSize: 12,
    color: 'grey',
  },
  ChatMessage: {
    lineHeight: 25,
    fontSize: 14,
    color: 'grey',
  },
});
