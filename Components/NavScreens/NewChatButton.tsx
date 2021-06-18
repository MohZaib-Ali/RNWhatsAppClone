import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {UserType} from '../../types';
import {Socket} from 'socket.io-client';
const NewChatButton = ({CurrentUser}: {CurrentUser: UserType}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={Styles.FloatButton}
      onPress={() =>
        navigation.navigate('Contacts', {
          CurrentUser: CurrentUser,
        })
      }>
      <MaterialCommunityIcons
        name={'message-reply-text'}
        size={28}
        color={'white'}
      />
    </TouchableOpacity>
  );
};

export default NewChatButton;

const Styles = StyleSheet.create({
  FloatButton: {
    position: 'absolute',
    backgroundColor: '#0C6157',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    right: 10,
    bottom: 10,
  },
  FloatButtonIcon: {},
});
