import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { MessageType } from "../../types";

const Message = ({
  Message,
  CurrentUser,
}: {
  Message: MessageType;
  CurrentUser: any;
}) => {
  const {
    Content,
    CreatedBy: { Name, ID },
    CreatedAt,
  } = Message;
  return (
    <View
      style={[
        Styles.Message,
        ID == CurrentUser.ID ? Styles.MessageOut : Styles.MessageIn,
      ]}
    >
      {/* <View
        style={{
          width: 0,
          height: 0,
          transform: [{ rotate: "70deg" }],
          borderTopWidth: 0,
          borderRightWidth: 5 / 2,
          borderBottomWidth: 5,
          borderLeftWidth: 5 / 2,
          borderTopColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: "#DCF8C9",
          borderLeftColor: "transparent",
        }}
      ></View> */}
      <Text style={Styles.MessageTitle}>{Name}</Text>
      <Text style={Styles.MessageContent}>{Content}</Text>
      <Text style={Styles.MessageTime}>{CreatedAt}</Text>
    </View>
  );
};
export default Message;
const Styles = StyleSheet.create({
  Message: {
    flexGrow: 1,
    paddingVertical: 2.25,
    paddingHorizontal: 7.5,
    marginVertical: 5,
    maxWidth: "65%",
    minWidth: "25%",
    borderRadius: 5,
  },
  MessageOut: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  MessageIn: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
  },
  MessageTitle: {
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 20,
  },
  MessageContent: {
    fontSize: 16,
  },
  MessageTime: {
    alignSelf: "flex-end",
    fontSize: 10,
    color: "grey",
  },
});
