import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import UserListItem from '../../Components/ContactsScreen/UserListItem';
import { useQuery } from '@apollo/client';
import { GET_MYUSERS } from '../../GraphQL/Queries';
import { useDispatch, useStore } from 'react-redux';

const UsersScreen = () => {
  const { CurrentUser } = useRoute().params as any;
  const [Users, setUsers] = useState({
    Loaded: false,
    ListItems: [],
  });
  const { data } = useQuery(GET_MYUSERS, {
    variables: { myID: CurrentUser.ID },
  });
  useEffect(() => {
    if (data) {
      let UserData = data.MyUsers;
      UserData.length != 0 &&
        setUsers({
          ListItems: UserData,
          Loaded: true,
        });
    }
  }, [data]);

  return (
    <View>
      {Users.Loaded && (
        <FlatList
          data={Users.ListItems}
          renderItem={({ item }) => (
            <UserListItem User={item} CurrentUser={CurrentUser} />
          )}
          keyExtractor={(item: any) => item.ID}
          ListEmptyComponent={<Text>No User</Text>}
        />
      )}
    </View>
  );
};

export default UsersScreen;

const styles = StyleSheet.create({});
