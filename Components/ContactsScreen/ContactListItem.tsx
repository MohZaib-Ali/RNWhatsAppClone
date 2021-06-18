import React from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { UserType } from "../../types";
import { useNavigation } from "@react-navigation/native";
const ContactListItem = ({
  Contact,
  CurrentUser,
}: {
  Contact: UserType;
  CurrentUser: UserType;
}) => {
  const navigation = useNavigation();
  const { ID, Name, Email, Status, ImageURI } = Contact;
  return (
    <Pressable
      style={Styles.ChatItemContainer}
      onPress={() =>
        navigation.navigate("Chat", {
          ChatUser: Contact,
        })
      }
    >
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

export default ContactListItem;

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
