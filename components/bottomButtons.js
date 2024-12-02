import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import styles from '../Styles';

// Sets up bottom navigation bar called in App.js, persistent across screens
const BottomButtons = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.bottomButtonsContainer}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#FBF9F9' }]}
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate({
              name: 'Staff Directory', // Directory button always sends user back to DirectoryScreen via Staff Directory route
            })
          );
        }}
      >
        <Text>Directory</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#FBF9F9' }]}
        onPress={() => {
          navigation.dispatch(
            CommonActions.navigate({
              name: 'Settings', // Settings button always sends user back to DirectoryScreen via Staff Directory route
            })
          );
        }}
      >
        <Text>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#FBF9F9' }]}
        onPress={() => navigation.navigate('Add Staff')}
      >
        <Text>Add Staff</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomButtons;
