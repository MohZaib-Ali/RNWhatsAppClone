import React from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { UserType } from "../../types";
import Firebase from "../../Assets/FirebaseSetup";
import { useQuery, useMutation } from "@apollo/client";
import { ADD_CONTACT } from "../../GraphQL/Queries";
import { useNavigation } from "@react-navigation/native";
const UserListItem = ({
  User,
  CurrentUser,
}: {
  User: UserType;
  CurrentUser: any;
}) => {
  const navigation = useNavigation();
  const { ID, Name, Status, ImageURI, Chats } = User;
  const [AddContact] = useMutation(ADD_CONTACT);
  const setContacts = () => {
    AddContact({
      variables: {
        myID: CurrentUser.ID,
        ContactID: User.ID,
      },
    });
    // Firebase.firestore()
    //   .collection("Users")
    //   .doc(CurrentUser.ID)
    //   .get()
    //   .then((snapshot) => {
    //     snapshot.exists &&
    //       !snapshot.data()?.Contacts.includes(User) &&
    //       Firebase.firestore()
    //         .collection("Users")
    //         .doc(CurrentUser.ID)
    //         .update({
    //           Contacts: [...snapshot.data()?.Contacts, User],
    //         });
    //   });
  };
  return (
    <Pressable style={Styles.ChatItemContainer} onPress={setContacts}>
      <Image
        style={Styles.ChatItemImage}
        source={{ uri: ImageURI == "" ? undefined : ImageURI }}
      />
      <View style={Styles.ChatItemContent}>
        <View style={Styles.ChatName_Time}>
          <Text style={Styles.ChatName}>{Name}</Text>
        </View>
        <Text style={Styles.ChatMessage} numberOfLines={1}>
          {Status}
        </Text>
      </View>
    </Pressable>
  );
};

export default UserListItem;

const Styles = StyleSheet.create({
  ChatItemContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  ChatItemImage: {
    width: 40,
    height: 40,
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
