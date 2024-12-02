import React from 'react';
import { Alert, SafeAreaView, View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../Styles';

export default function SettingsScreen() {
  const navigation = useNavigation();

  const changeBrightness = () => {
    Alert.alert('Success', 'User has pressed brightness change icon');
  };

  const changeTextSize = () => {
    Alert.alert('Success', 'User has pressed text size change icon');
  };

  const changeVolume = () => {
    Alert.alert('Success', 'User has pressed volume change icon');
  };

  return (
    <SafeAreaView style={styles.settingsContainer}>
      <View style={styles.settingsContent}>
       
        {/* Brightness */}
        <TouchableOpacity style={styles.iconContainer} onPress={changeBrightness}>
          <Image source={require('../assets/brightness-slider.png')} style={styles.icon} />
          <Text style={styles.iconTitle}>Brightness</Text>
        </TouchableOpacity>

        {/* Font Size */}
        <TouchableOpacity style={styles.iconContainer} onPress={changeTextSize}>
          <Image source={require('../assets/font-size.png')} style={styles.icon} />
          <Text style={styles.iconTitle}>Text Size</Text>
        </TouchableOpacity>

        {/* Volume */}
        <TouchableOpacity style={styles.iconContainer} onPress={changeVolume}>
          <Image source={require('../assets/sound-control.png')} style={styles.icon} />
          <Text style={styles.iconTitle}>Volume</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
