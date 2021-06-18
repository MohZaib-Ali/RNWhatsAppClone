import React, { useEffect, useRef, useState } from 'react';
import Firebase from '../../Assets/FirebaseSetup';
import io, { Socket } from 'socket.io-client';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import ChatListItem from '../../Components/ChatsScreen/ChatListItem';
import NewChatButton from '../../Components/NavScreens/NewChatButton';
import { useFocusEffect } from '@react-navigation/native';
import { useStore } from 'react-redux';

const ChatsScreen = ({ navigation }: { navigation: any }) => {
  const store = useStore();
  const [User, setUser] = useState({
    Chats: [],
  });
  useFocusEffect(() => {
    let CurrentUser = store.getState().userState.signedInUser;
    setUser(CurrentUser);
  });
  // Firebase.firestore()
  //   .collection("Users")
  //   .doc(currentUser?.uid)
  //   .get()
  //   .then((InitialSnapshot) => {
  //     Firebase.firestore()
  //       .collection("Chats")
  //       .get()
  //       .then((snapshot: any) => {
  //         let ChatData = snapshot.docs.map((doc: any) => {
  //           if (doc.id.split("---").includes(currentUser?.uid || "")) {
  //             return doc.data();
  //           }
  //         });
  //         ChatData = ChatData.filter((Doc: any) => {
  //           if (Doc != null) {
  //             return Doc;
  //           }
  //         });
  //         let ContactData = InitialSnapshot.data()?.Contacts;
  //         if (ChatData.length != 0) {
  //           setChat({
  //             ...Chat,
  //             Loaded: true,
  //             ListItems: ChatData,
  //             Contacts: ContactData,
  //           });
  //         } else if (ContactData.length != 0) {
  //           setChat({
  //             ...Chat,
  //             Loaded: true,
  //             Contacts: ContactData,
  //           });
  //         } else {
  //           setChat({
  //             ...Chat,
  //             Loaded: true,
  //           });
  //         }
  //       });
  //   });
  const HeaderShow = () => {
    navigation.setOptions({
      headerShown: false,
    });
  };

  return (
    <View style={Styles.Container}>
      <FlatList
        data={User.Chats}
        renderItem={({ item }) => (
          <ChatListItem Chat={item} CurrentUser={User} />
        )}
        ListEmptyComponent={
          <Text>
            No Chats -{' '}
            <TouchableWithoutFeedback
              onPress={() =>
                navigation.navigate('Contacts', {
                  CurrentUser: User,
                })
              }>
              <Text>Start a chat now</Text>
            </TouchableWithoutFeedback>
          </Text>
        }
        onScroll={e => {
          console.log(e.currentTarget);
        }}
        keyExtractor={item => (item as any).ID}
        showsVerticalScrollIndicator={true}
      />
      <NewChatButton CurrentUser={User as any} />
    </View>
  );
};

export default ChatsScreen;

const Styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
});
