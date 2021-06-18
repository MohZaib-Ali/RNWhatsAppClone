import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import {useDispatch, useStore} from 'react-redux';
import FB from '../../Assets/FirebaseSetup';
import * as Animatable from 'react-native-animatable';
import * as ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useMutation} from '@apollo/client';
const GetInScreen = () => {
  // States
  const [User, setUser] = useState({
    ID: '',
    Name: '',
    Email: '',
    Password: '',
    ImageURI: '',
    Status: 'Hey there, I am using WhatsApp.',
    Contacts: [],
    Chats: [],
  });
  const [GetIn, setGetIn] = useState({
    SignIn: true,
    SignUp: false,
    ProfileSetup: false,
    Error: '',
    ValidEmail: false,
    SecureText: true,
  });

  const store = useStore();
  const dispatch = useDispatch();
  // SignIn/Up Setup
  const getIntoIt = (GetInMethod: string) => {
    if (GetIn.ValidEmail && User.Password.length != 0) {
      if (GetInMethod == 'SignIn') {
        FB.auth()
          .signInWithEmailAndPassword(User.Email.trim(), User.Password.trim())
          .then(() => {
            const {Password, ...currentUser} = User;
            dispatch({
              type: 'GET_IN',
              signedInUser: {...currentUser, Email: User.Email.trim()},
            });
            setUser({
              ID: '',
              Name: '',
              Email: '',
              Password: '',
              ImageURI: '',
              Status: 'Hey there, I am using WhatsApp.',
              Contacts: [],
              Chats: [],
            });
            setGetIn({
              ...GetIn,
              Error: '',
              SignIn: false,
            });
          })
          .catch(err =>
            setGetIn({
              ...GetIn,
              Error: err.message,
            }),
          );
      } else if (GetInMethod == 'SignUp') {
        setGetIn({
          ...GetIn,
          Error: '',
          SignUp: false,
          SignIn: false,
          ProfileSetup: true,
        });
      }
    } else if (User.Email.length == 0) {
      setGetIn({
        ...GetIn,
        Error: 'please enter your email first!',
      });
    } else if (User.Email.length != 0 && !GetIn.ValidEmail) {
      setGetIn({
        ...GetIn,
        Error: 'invalid email, Please recheck!',
      });
    } else if (User.Password.length == 0) {
      setGetIn({
        ...GetIn,
        Error: 'please enter your password first!',
      });
    }
  };

  function validateEmail(email: string) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  // ProfileSetup
  const uploadPhotoAsync = (URI: string) => {
    let {currentUser} = FB.auth();
    return new Promise<string>(async (resolve, reject) => {
      const URI_PATH = `Photos/${currentUser?.uid}/${Date.now()}.jpg`;
      const response = await fetch(URI);
      const File = await response.blob();
      let Upload = FB.storage().ref().child(URI_PATH).put(File);
      Upload.on(
        'state_changed',
        snapshot => {},
        err => reject(err),
        async () => {
          let UFile = await Upload.snapshot;
          if (UFile) {
            const ImageURI = UFile.ref.getDownloadURL();
            resolve(ImageURI);
          }
        },
      );
    });
  };
  const PickImage = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
      },
      Selected => {
        if (!Selected.didCancel && Selected.assets.length == 1) {
          setUser({
            ...User,
            ImageURI: Object.assign({}, ...Selected.assets).uri,
          });
        }
      },
    );
  };
  const ImageUpdate = (RemoteURI: string, User: any) => {
    let {currentUser} = FB.auth();
    currentUser
      ?.updateProfile({
        displayName: `${User.Name}@${User.Status}`,
        photoURL: RemoteURI,
      })
      .then(() => {
        dispatch({type: 'PROFILE_UPDATE', signedInUser: User});
        let {signedInUser} = store.getState().userState;
        // FB.firestore()
        //   .collection("Users")
        //   .doc(currentUser?.uid)
        //   .set({ ...signedInUser, ImageURI: RemoteURI });
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  const ImageUpload = () => {
    if (User.ImageURI != '') {
      FB.auth()
        .createUserWithEmailAndPassword(User.Email.trim(), User.Password.trim())
        .then(({user}) => {
          setUser({...User, ID: user?.uid || ''});
        })
        .catch(err => console.log(err.message))
        .finally(() => {
          const {Password, ...currentUser} = User;
          dispatch({
            type: 'GET_IN',
            signedInUser: {...currentUser, Email: User.Email.trim()},
          });
          uploadPhotoAsync(currentUser.ImageURI)
            .then(RemoteURI => {
              ImageUpdate(RemoteURI, currentUser);
            })
            .catch(err => {
              console.log(err);
            });
          setUser({
            ID: '',
            Name: '',
            Email: '',
            Password: '',
            ImageURI: '',
            Status: 'Hey there, I am using WhatsApp.',
            Contacts: [],
            Chats: [],
          });
          setGetIn({
            ...GetIn,
            ProfileSetup: false,
          });
        });
    } else {
      Alert.alert('Please select An Image First');
    }
  };
  return (
    <View style={Styles.Container}>
      <View style={Styles.Upper}>
        <Animatable.Image
          animation={'bounceIn'}
          duration={1500}
          style={Styles.Logo}
          source={require('../../Assets/Images/WhatsApp_Cloudy.png')}
          resizeMode="stretch"
        />
      </View>
      {GetIn.SignIn && !GetIn.SignUp && !GetIn.ProfileSetup ? (
        <Animatable.View
          animation={'fadeInUpBig'}
          duration={1500}
          style={Styles.Lower}>
          <View style={Styles.TextInput}>
            <Text style={Styles.TextInputHeading}>Email</Text>
            <View style={Styles.TextInputPrompt}>
              <FontAwesome name={'user-o'} size={20} color={'#05375A'} />
              <TextInput
                style={Styles.TextInputValue}
                placeholder="Enter Your Email"
                value={User.Email}
                autoCapitalize={'none'}
                onChangeText={Email => {
                  setUser({...User, Email: Email});
                  setGetIn({
                    ...GetIn,
                    ValidEmail: validateEmail(Email),
                    Error: '',
                  });
                }}
              />
              {GetIn.ValidEmail ? (
                <Feather name={'check-circle'} size={20} color={'green'} />
              ) : null}
            </View>
          </View>
          <View style={Styles.TextInput}>
            <Text style={Styles.TextInputHeading}>Password</Text>
            <View style={Styles.TextInputPrompt}>
              <Feather name={'lock'} size={20} color={'#05375A'} />
              <TextInput
                style={Styles.TextInputValue}
                placeholder="Enter Your Password"
                value={User.Password}
                secureTextEntry={GetIn.SecureText}
                autoCapitalize={'none'}
                onChangeText={Password => {
                  setUser({...User, Password: Password.trim()});
                  setGetIn({
                    ...GetIn,
                    Error: '',
                  });
                }}
              />
              <TouchableOpacity
                onPress={() =>
                  setGetIn({
                    ...GetIn,
                    SecureText: !GetIn.SecureText,
                  })
                }>
                {GetIn.SecureText ? (
                  <Feather name={'eye'} size={20} color={'grey'} />
                ) : (
                  <Feather name={'eye-off'} size={20} color={'grey'} />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={Styles.ButtonContainer}>
            <Text>
              Don't have an account?{' '}
              <Pressable
                onPress={() => {
                  setUser({
                    ID: '',
                    Name: '',
                    Email: '',
                    Password: '',
                    ImageURI: '',
                    Status: 'Hey there, I am using WhatsApp.',
                    Contacts: [],
                    Chats: [],
                  });
                  setGetIn({
                    ...GetIn,
                    Error: '',
                    ValidEmail: false,
                    SecureText: true,
                    SignIn: !GetIn.SignIn,
                    SignUp: !GetIn.SignUp,
                  });
                }}>
                <Text>Sign Up</Text>
              </Pressable>
            </Text>
            <TouchableOpacity
              onPress={() => {
                getIntoIt('SignIn');
              }}>
              <LinearGradient
                style={Styles.Button}
                colors={['#08d4c4', '#01ab9d']}>
                <Text style={Styles.ButtonText}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          {GetIn.Error != '' ? (
            <Text style={Styles.Error}>* {GetIn.Error}</Text>
          ) : null}
        </Animatable.View>
      ) : GetIn.SignUp && !GetIn.SignIn && !GetIn.ProfileSetup ? (
        <Animatable.View
          animation={'fadeInUpBig'}
          duration={1500}
          style={Styles.Lower}>
          <View style={Styles.TextInput}>
            <Text style={Styles.TextInputHeading}>Email</Text>
            <View style={Styles.TextInputPrompt}>
              <FontAwesome name={'user-o'} size={20} color={'#05375A'} />
              <TextInput
                style={Styles.TextInputValue}
                placeholder="Enter Your Email"
                value={User.Email}
                autoCapitalize={'none'}
                onChangeText={Email => {
                  setUser({...User, Email: Email.trim()});
                  setGetIn({
                    ...GetIn,
                    ValidEmail: validateEmail(Email),
                    Error: '',
                  });
                }}
              />
              {GetIn.ValidEmail ? (
                <Feather name={'check-circle'} size={20} color={'green'} />
              ) : null}
            </View>
          </View>
          <View style={Styles.TextInput}>
            <Text style={Styles.TextInputHeading}>Password</Text>
            <View style={Styles.TextInputPrompt}>
              <Feather name={'lock'} size={20} color={'#05375A'} />
              <TextInput
                style={Styles.TextInputValue}
                placeholder="Enter Your Password"
                value={User.Password}
                secureTextEntry={GetIn.SecureText}
                autoCapitalize={'none'}
                onChangeText={Password => {
                  setUser({...User, Password: Password.trim()});
                  setGetIn({
                    ...GetIn,
                    Error: '',
                  });
                }}
              />
              <TouchableOpacity
                onPress={() =>
                  setGetIn({
                    ...GetIn,
                    SecureText: !GetIn.SecureText,
                  })
                }>
                {GetIn.SecureText ? (
                  <Feather name={'eye'} size={20} color={'grey'} />
                ) : (
                  <Feather name={'eye-off'} size={20} color={'grey'} />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={Styles.ButtonContainer}>
            <Text>
              Already have an account?{' '}
              <Pressable
                onPress={() => {
                  setUser({
                    ID: '',
                    Name: '',
                    Email: '',
                    Password: '',
                    ImageURI: '',
                    Status: 'Hey there, I am using WhatsApp.',
                    Contacts: [],
                    Chats: [],
                  });
                  setGetIn({
                    ...GetIn,
                    Error: '',
                    ValidEmail: false,
                    SecureText: true,
                    SignIn: !GetIn.SignIn,
                    SignUp: !GetIn.SignUp,
                  });
                }}>
                <Text>Sign In</Text>
              </Pressable>
            </Text>
            <TouchableOpacity onPress={() => getIntoIt('SignUp')}>
              <LinearGradient
                style={Styles.Button}
                colors={['#08d4c4', '#01ab9d']}>
                <Text style={Styles.ButtonText}>Sign Up</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          {GetIn.Error != '' ? (
            <Text style={Styles.Error}>* {GetIn.Error}</Text>
          ) : null}
        </Animatable.View>
      ) : (
        <Animatable.View
          animation={'fadeInUpBig'}
          duration={1500}
          style={Styles.Lower}>
          <View style={Styles.TextInput}>
            <Text style={Styles.TextInputHeading}>Name</Text>
            <View style={Styles.TextInputPrompt}>
              {User.ImageURI == '' ? (
                <FontAwesome name={'user-o'} size={30} color={'#05375A'} />
              ) : (
                <Image
                  style={Styles.TextInputImage}
                  source={{uri: User.ImageURI}}
                />
              )}
              <TextInput
                style={Styles.TextInputValue}
                placeholder="Enter Your Name"
                value={User.Name}
                autoCapitalize={'none'}
                onChangeText={Name => {
                  setUser({...User, Name: Name});
                }}
              />

              <TouchableOpacity onPress={PickImage}>
                <Fontisto name={'camera'} color={'#05375A'} size={30} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={Styles.TextInput}>
            <Text style={Styles.TextInputHeading}>Status</Text>
            <View style={Styles.TextInputPrompt}>
              <FontAwesome name={'info'} size={30} color={'#05375A'} />
              <TextInput
                style={Styles.TextInputValue}
                placeholder="Enter Your Status"
                value={User.Status}
                autoCapitalize={'none'}
                onChangeText={Status => {
                  setUser({...User, Status: Status});
                }}
              />
            </View>
          </View>

          <View style={Styles.ButtonContainer}>
            <TouchableOpacity onPress={() => ImageUpload()}>
              <LinearGradient
                style={Styles.Button}
                colors={['#08d4c4', '#01ab9d']}>
                <Text style={Styles.ButtonText}>Update Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      )}
    </View>
  );
};
export default GetInScreen;
const {height} = Dimensions.get('screen');
const logoHeight = height * 0.4;
export const Styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#009387',
  },
  Upper: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Logo: {
    width: logoHeight,
    height: logoHeight,
  },
  Lower: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#fff',
    padding: 30,
  },
  TextInput: {
    flexDirection: 'column',
    marginVertical: 5,
  },
  TextInputImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  TextInputHeading: {
    color: '#05375A',
    fontSize: 15,
  },
  TextInputPrompt: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  TextInputValue: {
    marginHorizontal: 10,
    flexGrow: 1,
    paddingHorizontal: 5,
    paddingVertical: 2.5,
  },
  ButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  Button: {
    alignSelf: 'flex-end',
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  ButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  Error: {
    color: 'red',
  },
});
