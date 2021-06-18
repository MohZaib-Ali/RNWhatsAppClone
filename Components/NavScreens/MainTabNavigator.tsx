import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CameraScreen from '../../Screens/MainScreens/CameraScreen';
import StatusScreen from '../../Screens/MainScreens/StatusScreen';
import CallsScreen from '../../Screens/MainScreens/CallsScreen';
import ChatsScreen from '../../Screens/MainScreens/ChatsScreen';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { ChatRoomType, ContactType, MainTabParamsListType } from '../../types';
import { Socket } from 'socket.io-client';
import { useNavigation } from '@react-navigation/core';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USERS, SIGN_INTO_IT } from '../../GraphQL/Queries';
import FB from '../../Assets/FirebaseSetup';
import { useDispatch } from 'react-redux';
import { Text } from 'react-native-animatable';
const MainTab = createMaterialTopTabNavigator<MainTabParamsListType>();

const MainTabNavigator = ({ Socket }: { Socket: Socket }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [Me, setMe] = useState(null);
  let { currentUser } = FB.auth();
  const { loading, error, data } = useQuery(GET_USERS);
  const [AddUser] = useMutation(SIGN_INTO_IT);
  useEffect(() => {
    dispatch({ type: 'SET_SOCKET', Socket });
  }, []);
  useEffect(() => {
    if (!loading && !error) {
      let UserIDs = data.Users.map((User: any) => User.ID);
      if (!UserIDs.includes(currentUser?.uid)) {
        AddUser({
          variables: {
            ID: currentUser?.uid,
            Name: (currentUser?.displayName || '').split('@')[0],
            Email: currentUser?.email,
            ImageURI: currentUser?.photoURL,
            Status: (currentUser?.displayName || '').split('@')[1],
          },
        });
      } else {
        let Me = Object.assign(
          {},
          ...data.Users.filter((User: any) => {
            return User.ID == currentUser?.uid;
          }),
        );
        setMe(Me);
        dispatch({ type: 'GET_IN', signedInUser: Me });
      }
    }
  }, [data]);
  return (
    <MainTab.Navigator
      initialRouteName="Chats"
      tabBarOptions={{
        activeTintColor: '#fff',
        style: {
          backgroundColor: '#0C6157',
        },
        indicatorStyle: {
          backgroundColor: '#fff',
          height: 2,
        },
        labelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
        showIcon: true,
      }}>
      <MainTab.Screen
        name="Camera"
        children={() => <CameraScreen navigation={navigation} />}
        options={{
          tabBarIcon: ({ color }) => (
            <Fontisto name={'camera'} color={color} size={18} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <MainTab.Screen
        name="Chats"
        children={() => Me && <ChatsScreen navigation={navigation} />}
      />
      <MainTab.Screen
        name="Status"
        children={() => <StatusScreen navigation={navigation} />}
      />
      <MainTab.Screen
        name="Calls"
        children={() => <CallsScreen navigation={navigation} />}
      />
    </MainTab.Navigator>
  );
};

export default MainTabNavigator;
