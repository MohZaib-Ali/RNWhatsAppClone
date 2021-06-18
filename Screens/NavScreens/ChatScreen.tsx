import React, {useEffect, useRef, useState, Component} from 'react';
import {io, Socket} from 'socket.io-client';
import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  Platform,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Firebase from '../../Assets/FirebaseSetup';
import firebase from 'firebase';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Message from '../../Components/NavScreens/Message';
import {MessageType, ContactType, UserType} from '../../types';
import {Image, Text} from 'react-native-animatable';
const {width, height} = Dimensions.get('screen');

export default class ChatScreen extends Component<
  {
    navigation: any;
    route: any;
  },
  {
    MessageInput: string;
    Messages: Array<MessageType>;
    Typing: boolean;
    NewMessages: boolean;
    ID: string;
    Document: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;
  }
> {
  navigation = this.props.navigation;
  CurrentUser = (this.props.route.params as any).CurrentUser as UserType;
  ChatUser = (this.props.route.params as any).ChatUser as UserType;
  ServerURL = 'http://192.168.0.103:3000';
  Socket: Socket;

  Styles = StyleSheet.create({
    MessageBar: {
      position: 'absolute',
      right: 0,
      bottom: 5,
      marginHorizontal: 5,
      width: width - 10,
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
      width: width - 10 - 5 - 45,
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
  constructor(props: any) {
    super(props);
    this.Socket = io(this.ServerURL);
    this.state = {
      MessageInput: '',
      Messages: [] as Array<MessageType>,
      Typing: false,
      NewMessages: false,
      ID: `${this.CurrentUser.ID}---${this.ChatUser.ID}`,
      Document: Firebase.firestore()
        .collection('Chats')
        .doc(
          `${this.CurrentUser.ID}---${this.ChatUser.ID}`,
        ) as firebase.firestore.DocumentReference<firebase.firestore.DocumentData>,
    };
  }
  componentDidMount() {
    this.Socket.open();
    Firebase.firestore()
      .collection('Chats')
      .doc(`${this.CurrentUser.ID}---${this.ChatUser.ID}`)
      .get()
      .then(InitialSnapshot => {
        !InitialSnapshot.exists
          ? Firebase.firestore()
              .collection('Chats')
              .doc(`${this.ChatUser.ID}---${this.CurrentUser.ID}`)
              .get()
              .then(FinalSnapshot => {
                !FinalSnapshot.exists
                  ? this.setState({
                      Messages: [],
                    })
                  : this.setState({
                      ID: `${this.ChatUser.ID}---${this.CurrentUser.ID}`,
                      Document: Firebase.firestore()
                        .collection('Chats')
                        .doc(`${this.ChatUser.ID}---${this.CurrentUser.ID}`),
                      Messages: FinalSnapshot.data()?.Messages,
                    });
              })
          : this.setState({
              Messages: InitialSnapshot.data()?.Messages,
            });
      })
      .finally(() => {
        this.Socket.emit('join-chat', this.state.ID);
      });
    this.Socket.on('receive-message', () => {
      this.Init();
    });
    this.Socket.on('is-typing', (User: any) => {
      this.navigation.setOptions({
        headerTitle: () => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={{uri: this.ChatUser.ImageURI}}
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
              }}
            />
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
                {this.ChatUser.Name}
              </Text>
              <Text
                style={{
                  marginLeft: 10,
                  fontWeight: '700',
                  color: 'grey',
                }}>
                typing...
              </Text>
            </View>
          </View>
        ),
      });
    });
    this.Socket.on('!is-typing', (User: any) => {
      this.navigation.setOptions({
        headerTitle: () => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={{uri: this.ChatUser.ImageURI}}
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
              }}
            />
            <Text
              style={{
                marginLeft: 10,
                fontWeight: 'bold',
                color: 'white',
              }}>
              {this.ChatUser.Name}
            </Text>
          </View>
        ),
      });
    });
  }
  componentWillUnmount() {
    this.Socket.close();
  }

  Init() {
    this.state.Document.get().then(Snapshot => {
      console.log('Data Loaded');
      this.setState({
        Messages: Snapshot.data()?.Messages,
      });
    });
  }
  sendMessage(Message: string) {
    this.setState({
      Typing: false,
    });
    this.Socket.emit('off-typing', this.CurrentUser);
    const {Chats, Contacts, ...User} = this.CurrentUser;
    const MessageData = {
      Content: Message,
      CreatedBy: User,
      CreatedAt: new Date(Date.now()).toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      }),
    } as MessageType;

    const Participants = [
      User as ContactType,
      {
        ID: this.ChatUser.ID,
        Name: this.ChatUser.Name,
        Email: this.ChatUser.Email,
        ImageURI: this.ChatUser.ImageURI,
        Status: this.ChatUser.Status,
      } as ContactType,
    ] as Array<ContactType>;

    const ChatData = {
      ID: `${this.CurrentUser.ID}---${this.ChatUser.ID}`,
      Name: '',
      ImageURI: '',
      Group: false,
      Participants: Participants,
    };

    this.state.Document.get()
      .then(Snapshot => {
        !Snapshot.exists
          ? this.state.Document.set({
              Messages: [MessageData],
            })
              .then(() => {
                this.setState({
                  Messages: [MessageData],
                });
              })
              .finally(() => {
                Participants.forEach(Participant => {
                  Firebase.firestore()
                    .collection('Users')
                    .doc(Participant.ID)
                    .get()
                    .then(snapshot => {
                      snapshot.exists &&
                        !snapshot.data()?.this.states.includes(ChatData) &&
                        Firebase.firestore()
                          .collection('Users')
                          .doc(Participant.ID)
                          .update({
                            Chats: [...snapshot.data()?.this.states, ChatData],
                          });
                    });
                });
              })
          : this.state.Document.update({
              Messages: [...this.state.Messages, MessageData],
            }).then(() => {
              this.setState({
                Messages: [...Snapshot.data()?.Messages, MessageData],
              });
            });
      })
      .finally(() => {
        this.setState({
          MessageInput: '',
        });
        this.Socket.emit('send-message');
      });
  }

  render() {
    return (
      <ImageBackground
        style={{flex: 1, backgroundColor: '#dddbd1'}}
        imageStyle={{opacity: 0.5}}
        source={{
          uri: 'https://web.whatsapp.com/img/bg-chat-tile-light_04fcacde539c58cca6745483d4858c52.png',
        }}
        resizeMode={(Platform.OS == 'web' && 'repeat') || undefined}>
        <SafeAreaView
          style={{
            flex: 1,
            position: 'relative',
          }}>
          <FlatList
            style={{
              marginTop: 5,
              marginBottom: 50,
              marginHorizontal: 5,
            }}
            data={this.state.Messages}
            renderItem={({item}) => (
              <Message Message={item} CurrentUser={this.CurrentUser} />
            )}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={null}
          />
          <View style={this.Styles.MessageBar}>
            <View style={this.Styles.MessageInput}>
              <View style={this.Styles.MessageBarView}>
                <TouchableOpacity style={this.Styles.MessageTextInputIcon}>
                  <FontAwesome name={'smile-o'} size={25} color={'grey'} />
                </TouchableOpacity>
              </View>
              <View
                style={[
                  this.Styles.MessageInput,
                  {flexGrow: 1, alignItems: 'center'},
                ]}>
                <TextInput
                  multiline={true}
                  autoFocus={true}
                  style={this.Styles.MessageTextInput}
                  placeholder={'Type a message'}
                  value={this.state.MessageInput}
                  onChangeText={Input => {
                    if (Input != '') {
                      this.setState({
                        Typing: true,
                        MessageInput: Input,
                      });
                      this.Socket.emit('on-typing', this.CurrentUser);
                    } else {
                      this.setState({
                        Typing: false,
                        MessageInput: Input,
                      });
                      this.Socket.emit('off-typing', this.CurrentUser);
                    }
                  }}
                  onSubmitEditing={({nativeEvent: {text: Input}}) => {
                    this.sendMessage(Input);
                  }}
                />
              </View>
              <View style={this.Styles.MessageBarView}>
                <TouchableOpacity style={this.Styles.MessageTextInputIcon}>
                  <Entypo
                    style={{transform: [{rotateX: '180deg'}]}}
                    name={'attachment'}
                    size={25}
                    color={'grey'}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {this.state.MessageInput == '' ? (
              <View style={[this.Styles.MessageBarView, {marginLeft: 5}]}>
                <TouchableOpacity style={this.Styles.MessageVoice}>
                  <MaterialCommunityIcons
                    name={'microphone'}
                    size={25}
                    color={'white'}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={[this.Styles.MessageBarView, {marginLeft: 5}]}>
                <TouchableOpacity
                  style={this.Styles.MessageVoice}
                  onPress={() => {
                    this.setState({
                      Typing: false,
                    });
                    this.sendMessage(this.state.MessageInput);
                  }}>
                  <Ionicons name={'send'} size={20} color={'white'} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}
