import React, {
  useEffect,
  useRef,
  Component,
  useState,
  useLayoutEffect,
} from 'react';
import { io, Socket } from 'socket.io-client';
import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Message from '../../Components/NavScreens/Message';
import { MessageType, ContactType, UserType, ChatRoomType } from '../../types';
import { Image, Text } from 'react-native-animatable';
import { useNavigation, useRoute } from '@react-navigation/core';
import { useDispatch, useStore } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import { GET_CHATS, ADD_CHAT, ADD_MESSAGE } from '../../GraphQL/Queries';
const { width, height } = Dimensions.get('screen');

const ChatScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const store = useStore();
  const Socket = store.getState().socketState.Socket;
  const { ChatUser } = useRoute().params as {
    ChatUser: UserType;
  };
  const dispatch = useDispatch();
  const CurrentUser = store.getState().userState.signedInUser;
  const [Chat, setChat] = useState({
    Exists: true,
    MessageInput: '',
    Messages: [] as Array<MessageType>,
    ID: `${CurrentUser.ID}---${ChatUser.ID}`,
  });

  const { loading, error, data } = useQuery(GET_CHATS);
  const [AddMessage, { data: UpdatedChat }] = useMutation(ADD_MESSAGE, {
    ignoreResults: false,
  });
  const [AddChat, { data: AddedChat }] = useMutation(ADD_CHAT, {
    ignoreResults: false,
  });
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitleAlign: 'left',
  //     headerTitle: () => (
  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //         }}>
  //         <Ionicons
  //           style={{
  //             paddingRight: 10,
  //           }}
  //           name={'chevron-back-circle-outline'}
  //           color={'white'}
  //           size={27.5}
  //           onPress={() => {
  //             navigation.replace('Root');
  //           }}
  //         />
  //         <Image
  //           source={{
  //             uri: route.params.ChatUser.ImageURI,
  //           }}
  //           style={{
  //             width: 40,
  //             height: 40,
  //             borderRadius: 50,
  //           }}
  //         />
  //         <Text
  //           style={{
  //             marginLeft: 10,
  //             fontWeight: 'bold',
  //             color: 'white',
  //           }}>
  //           {route.params.ChatUser.Name}
  //         </Text>
  //       </View>
  //     ),
  //   });
  // }, []);
  const MessageList = useRef(null as any);
  const Styles = StyleSheet.create({
    MessageBar: {
      //position: 'absolute',
      paddingVertical: 5,
      paddingHorizontal: 5,
      width: '100%',
      minHeight: 45,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    MessageBarView: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    MessageInput: {
      flex: 1,
      flexDirection: 'row',
      // width: width - 10 - 5 - 45,
      backgroundColor: 'white',
      borderRadius: 25,
    },
    MessageTextInput: {
      fontSize: 16,
      flexGrow: 1,
      flexDirection: 'column',
      height: '100%',
      paddingHorizontal: 7.5,
      alignItems: 'center',
      color: 'black',
    },
    MessageTextInputIcon: {
      width: 45,
      height: 45,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
    },
    MessageVoice: {
      width: 45,
      height: 45,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0C6157',
      borderRadius: 50,
    },
  });
  useEffect(() => {
    const CurrentChat = Object.assign(
      {},
      ...CurrentUser.Chats.filter((Cht: any) => Cht.ID == Chat.ID),
    );
    setChat({
      ...Chat,
      Messages: CurrentChat.Messages,
    });
  }, [Chat.ID]);

  useEffect(() => {
    MessageList.current.scrollToEnd({ animated: false });
  }, [Chat.Messages]);

  useEffect(() => {
    if (data) {
      let ChatIDs = data.Chats.map((Chat: any) => Chat.ID);
      if (!ChatIDs.includes(Chat.ID)) {
        if (ChatIDs.includes(`${ChatUser.ID}---${CurrentUser.ID}`)) {
          let MyChat = Object.assign(
            {},
            ...data.Chats.filter((Cht: any) => {
              return Cht.ID == `${ChatUser.ID}---${CurrentUser.ID}`;
            }),
          );
          setChat({
            ...Chat,
            ID: `${ChatUser.ID}---${CurrentUser.ID}`,
            Messages: MyChat.Messages,
          });
        } else {
          setChat({
            ...Chat,
            Exists: false,
          });
        }
      } else {
        let MyChat = Object.assign(
          {},
          ...data.Chats.filter((Cht: any) => {
            return Cht.ID == Chat.ID;
          }),
        );
        setChat({
          ...Chat,
          Messages: MyChat.Messages,
        });
      }
    }
  }, [data]);
  // Firebase.firestore()
  //   .collection("Chats")
  //   .doc(`${CurrentUser.ID}---${ChatUser.ID}`)
  //   .get()
  //   .then((InitialSnapshot) => {
  //     !InitialSnapshot.exists
  //       ? Firebase.firestore()
  //           .collection("Chats")
  //           .doc(`${ChatUser.ID}---${CurrentUser.ID}`)
  //           .get()
  //           .then((FinalSnapshot) => {
  //             !FinalSnapshot.exists
  //               ? setChat({
  //                   ...Chat,
  //                   Messages: [],
  //                 })
  //               : setChat({
  //                   ...Chat,
  //                   ID: `${ChatUser.ID}---${CurrentUser.ID}`,
  //                   Document: Firebase.firestore()
  //                     .collection("Chats")
  //                     .doc(`${ChatUser.ID}---${CurrentUser.ID}`),
  //                   Messages: FinalSnapshot.data()?.Messages,
  //                 });
  //           })
  //       : setChat({
  //           ...Chat,
  //           Messages: InitialSnapshot.data()?.Messages,
  //         });
  //   });

  // Chat.Document.onSnapshot((Snapshot) => {
  //   setChat({
  //     ...Chat,
  //     Messages: Snapshot.data()?.Messages,
  //   });
  // });
  useLayoutEffect(() => {
    if (Socket && data) {
      Socket.emit('join-chat', Chat.ID);

      Socket.on('is-typing', (User: any) => {
        navigation.setOptions({
          headerTitle: () => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'column',
                }}>
                <Text
                  style={{
                    marginLeft: 10,
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  {ChatUser.Name}
                </Text>
                <Text
                  style={{
                    marginLeft: 10,
                    fontWeight: '700',
                    color: '#f7f7f7',
                  }}>
                  typing...
                </Text>
              </View>
            </View>
          ),
        });
      });

      Socket.on('!is-typing', (User: any) => {
        navigation.setOptions({
          headerTitle: () => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  marginLeft: 10,
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                {ChatUser.Name}
              </Text>
            </View>
          ),
        });
      });
      return () => {
        Socket.emit('leave-chat');
      };
    }
  }, [Socket, data]);

  useEffect(() => {
    if (UpdatedChat) {
      setChat({
        ...Chat,
        Messages: UpdatedChat.AddMessage.Messages,
      });
      const User = store.getState().userState.signedInUser as UserType;
      let ButChats = User.Chats.filter(Cht => Cht.ID != Chat.ID);
      let TargetChat = UpdatedChat.AddMessage;
      dispatch({
        type: 'UPDATE_CHAT',
        Chats: [...ButChats, TargetChat],
      });
    }
  }, [UpdatedChat]);

  const sendMessage = (Message: string) => {
    Socket.emit('off-typing', CurrentUser);
    // const { Chats, Contacts, ...User } = CurrentUser;
    // const MessageData = {
    //   Content: Message,
    //   CreatedBy: User,
    //   CreatedAt: new Date(Date.now()).toLocaleString("en-US", {
    //     hour: "numeric",
    //     minute: "numeric",
    //     second: "numeric",
    //     hour12: true,
    //   }),
    // } as MessageType;

    // const Participants = [
    //   User as ContactType,
    //   {
    //     ID: ChatUser.ID,
    //     Name: ChatUser.Name,
    //     Email: ChatUser.Email,
    //     ImageURI: ChatUser.ImageURI,
    //     Status: ChatUser.Status,
    //   } as ContactType,
    // ] as Array<ContactType>;

    // const ChatData = {
    //   ID: `${CurrentUser.ID}---${ChatUser.ID}`,
    //   Name: "",
    //   ImageURI: "",
    //   Group: false,
    //   Participants: Participants,
    // };
    if (!Chat.Exists) {
      !AddedChat &&
        AddChat({
          variables: {
            ID: Chat.ID,
            Group: false,
            Name: '',
            ImageURI: '',
            ParticipantIDs: [CurrentUser.ID, ChatUser.ID],
            MessageCreatorID: CurrentUser.ID,
            MessageContent: Message,
            MessageCreatedAt: new Date(Date.now()).toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              hour12: true,
            }),
          },
        });
    } else {
      AddMessage({
        variables: {
          ChatID: Chat.ID,
          CreatorID: CurrentUser.ID,
          Content: Message,
          CreatedAt: new Date(Date.now()).toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
          }),
        },
      });
    }
    setChat({
      ...Chat,
      MessageInput: '',
    });
    // Chat.Document.get().then((Snapshot) => {
    //   !Snapshot.exists
    //     ? Chat.Document.set({
    //         Messages: [MessageData],
    //       })
    //         .then(() => {
    //           setChat({
    //             ...Chat,
    //             MessageInput: "",
    //             Messages: [MessageData],
    //           });
    //         })
    //         .finally(() => {
    //           Participants.forEach((Participant) => {
    //             Firebase.firestore()
    //               .collection("Users")
    //               .doc(Participant.ID)
    //               .get()
    //               .then((snapshot) => {
    //                 snapshot.exists &&
    //                   !snapshot.data()?.Chats.includes(ChatData) &&
    //                   Firebase.firestore()
    //                     .collection("Users")
    //                     .doc(Participant.ID)
    //                     .update({
    //                       Chats: [...snapshot.data()?.Chats, ChatData],
    //                     });
    //               });
    //           });
    //         })
    //     : Chat.Document.update({
    //         Messages: [...Chat.Messages, MessageData],
    //       }).then(() => {
    //         setChat({
    //           ...Chat,
    //           MessageInput: "",
    //           Messages: [...Snapshot.data()?.Messages, MessageData],
    //         });
    //       });
    // });
  };
  return (
    <ImageBackground
      style={{ flex: 1, backgroundColor: '#dddbd1' }}
      imageStyle={{ opacity: 0.5 }}
      source={{
        uri: 'https://web.whatsapp.com/img/bg-chat-tile-light_04fcacde539c58cca6745483d4858c52.png',
      }}
      resizeMode={(Platform.OS == 'web' && 'repeat') || undefined}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          position: 'relative',
        }}>
        <ScrollView
          style={{
            marginTop: 5,
            marginHorizontal: 5,
            flex: 1,
          }}
          onContentSizeChange={() =>
            MessageList.current.scrollToEnd({ animated: false })
          }
          ref={MessageList}>
          {Chat.Messages &&
            Chat.Messages.map((Item, index) => {
              return (
                <Message
                  key={index.toString()}
                  Message={Item}
                  CurrentUser={CurrentUser}
                />
              );
            })}
        </ScrollView>
        <View style={Styles.MessageBar}>
          <View style={Styles.MessageInput}>
            <View style={Styles.MessageBarView}>
              <TouchableOpacity style={Styles.MessageTextInputIcon}>
                <FontAwesome name={'smile-o'} size={25} color={'grey'} />
              </TouchableOpacity>
            </View>
            <View
              style={[
                Styles.MessageInput,
                { flexGrow: 1, alignItems: 'center' },
              ]}>
              <TextInput
                multiline={true}
                style={Styles.MessageTextInput}
                placeholder={'Type a message'}
                value={Chat.MessageInput}
                onChangeText={Input => {
                  setChat({
                    ...Chat,
                    MessageInput: Input,
                  });
                  if (Input.trimLeft().length == 1) {
                    if (Chat.MessageInput.length < Input.length) {
                      Socket.emit('on-typing', CurrentUser);
                    }
                  } else if (Input.trim().length == 0) {
                    if (Input == '') {
                      Socket.emit('off-typing', CurrentUser);
                    } else if (Chat.MessageInput.length > Input.length) {
                      Socket.emit('off-typing', CurrentUser);
                      setChat({
                        ...Chat,
                        MessageInput: '',
                      });
                    }
                  }
                }}
                onSubmitEditing={({ nativeEvent: { text: Input } }) => {
                  sendMessage(Input);
                }}
              />
            </View>
            <View style={Styles.MessageBarView}>
              <TouchableOpacity style={Styles.MessageTextInputIcon}>
                <Entypo
                  style={{ transform: [{ rotateX: '180deg' }] }}
                  name={'attachment'}
                  size={25}
                  color={'grey'}
                />
              </TouchableOpacity>
            </View>
          </View>
          {Chat.MessageInput == '' ? (
            <View style={[Styles.MessageBarView, { marginLeft: 5 }]}>
              <TouchableOpacity style={Styles.MessageVoice}>
                <MaterialCommunityIcons
                  name={'microphone'}
                  size={25}
                  color={'white'}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[Styles.MessageBarView, { marginLeft: 5 }]}>
              <TouchableOpacity
                style={Styles.MessageVoice}
                onPress={() => {
                  sendMessage(Chat.MessageInput);
                }}>
                <Ionicons name={'send'} size={20} color={'white'} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default ChatScreen;
