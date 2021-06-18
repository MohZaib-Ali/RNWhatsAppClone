import React, { useEffect, useState } from "react";
import Firebase from "../../Assets/FirebaseSetup";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import ContactListItem from "../../Components/ContactsScreen/ContactListItem";
import { useStore } from "react-redux";

const ContactsScreen = ({ navigation }: { navigation: any }) => {
  const store = useStore();
  const CurrentUser = store.getState().userState.signedInUser;
  const Socket = store.getState().socketState.Socket;
  return (
    <View>
      <Pressable
        style={Styles.ChatItemContainer}
        onPress={() => console.log(CurrentUser.Contacts)}
      >
        <Image style={Styles.ChatItemImage} source={{ uri: undefined }} />
        <View style={Styles.ChatItemContent}>
          <View style={Styles.ChatName_Time}>
            <Text style={Styles.ChatName}>New group</Text>
          </View>
        </View>
      </Pressable>
      <Pressable
        style={Styles.ChatItemContainer}
        onPress={() =>
          navigation.navigate("Users", {
            CurrentUser: CurrentUser,
          })
        }
      >
        <Image style={Styles.ChatItemImage} source={{ uri: undefined }} />
        <View style={Styles.ChatItemContent}>
          <View style={Styles.ChatName_Time}>
            <Text style={Styles.ChatName}>New contact</Text>
          </View>
        </View>
      </Pressable>
      <FlatList
        data={CurrentUser.Contacts}
        renderItem={({ item }) => (
          <ContactListItem Contact={item} CurrentUser={CurrentUser} />
        )}
        keyExtractor={(item: any) => item.ID}
        ListEmptyComponent={<Text>No Contact</Text>}
      />
    </View>
  );
};

export default ContactsScreen;

const Styles = StyleSheet.create({
  ChatItemContainer: {
    padding: 15,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  ChatItemImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  ChatItemContent: {
    flexGrow: 1,
    marginLeft: 10,
    flexDirection: "column",
    justifyContent: "space-around",
  },
  ChatName_Time: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ChatName: {
    fontSize: 16,
    fontWeight: "500",
  },
  ChatTime: {
    fontSize: 12,
    color: "grey",
  },
  ChatMessage: {
    lineHeight: 25,
    fontSize: 14,
    color: "grey",
  },
});
