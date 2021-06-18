import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  TouchableHighlight,
} from 'react-native';
import 'react-native-gesture-handler';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ApolloClient, InMemoryCache} from '@apollo/client';
import {ApolloProvider} from '@apollo/client/react';

// Global State Management
import {Provider, useDispatch} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from './Reducers/rootReducer';
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk)),
);
const ServerURI = 'http://192.168.0.102:3000';

// Navigation Setup
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import GetInScreen from './Screens/LoginScreen/GetInScreen';
import MainTabNavigator from './Components/NavScreens/MainTabNavigator';
import ChatScreen from './Screens/NavScreens/CS2';
import ContactsScreen from './Screens/NavScreens/ContactsScreen';
import UsersScreen from './Screens/NavScreens/UsersScreen';
import {io, Socket} from 'socket.io-client';
import FB from './Assets/FirebaseSetup';
import {StackParams} from './types';
const Stack = createStackNavigator<StackParams>();
const Client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: ServerURI + '/APIv3',
});
export default function App() {
  const [User, setUser] = useState({
    Loaded: false,
    SignedIn: false,
  });
  const Socket = useRef(null as unknown as Socket);
  useEffect(() => {
    Socket.current = io(ServerURI);
    FB.auth().onAuthStateChanged(currentUser => {
      if (currentUser) {
        setUser({
          ...User,
          SignedIn: true,
          Loaded: true,
        });
      } else {
        setUser({
          ...User,
          SignedIn: false,
          Loaded: true,
        });
      }
    });
  }, []);

  if (!User.Loaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Loading</Text>
      </View>
    );
  }
  return (
    <Provider store={store}>
      <ApolloProvider client={Client}>
        {User.SignedIn ? (
          <NavigationContainer>
            <StatusBar barStyle={'default'} backgroundColor={'#0C6157'} />
            <Stack.Navigator
              initialRouteName="Root"
              screenOptions={{
                headerStatusBarHeight: 0,
                headerStyle: {
                  backgroundColor: '#0C6157',
                  shadowOpacity: 0,
                  elevation: 0,
                },
                headerTintColor: '#fff',
                headerTitleAlign: 'left',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}>
              <Stack.Screen
                name="Root"
                children={() => <MainTabNavigator Socket={Socket.current} />}
                options={{
                  title: 'WhatsApp',
                  headerRight: () => (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: 60,
                        marginRight: 10,
                      }}>
                      <TouchableOpacity>
                        <Octicons name={'search'} size={24} color={'white'} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          FB.auth().signOut();
                        }}>
                        <MaterialCommunityIcons
                          name={'dots-vertical'}
                          size={24}
                          color={'white'}
                        />
                      </TouchableOpacity>
                    </View>
                  ),
                }}
              />
              <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={({navigation, route}) => ({
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'row',
                        }}>
                        <Ionicons
                          style={{
                            paddingHorizontal: 5,
                          }}
                          name={'chevron-back-circle-outline'}
                          size={25}
                          color={'white'}
                        />
                        <Image
                          source={{
                            uri: (route.params as any).ChatUser.ImageURI,
                          }}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 50,
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  ),
                  headerTitleAlign: 'left',
                  headerTitle: () => (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 15,
                          fontWeight: 'bold',
                          color: 'white',
                        }}>
                        {(route.params as any).ChatUser.Name}
                      </Text>
                    </View>
                  ),
                })}
              />
              <Stack.Screen name="Contacts" component={ContactsScreen} />
              <Stack.Screen name="Users" component={UsersScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        ) : (
          <GetInScreen />
        )}
      </ApolloProvider>
    </Provider>
  );
}
