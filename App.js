// Imports libraries
import React, { useState, useEffect, useCallback } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Platform, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import styles from './Styles';

// Imports screens
import BottomButtons from './components/bottomButtons';
import DirectoryScreen from './screens/DirectoryScreen';
import StaffDetailsScreen from './screens/StaffDetailsScreen';
import EditStaffScreen from './screens/EditStaffScreen';
import AddStaffScreen from './screens/AddStaffScreen';
import Settings from './screens/Settings';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>

        {/* Sets ROI logo in header, see Styles.js for more info on sizing/position */}
        <View style={styles.headerBar}>
          <Image source={require('./assets/roi-icon1.png')} style={styles.roiIcon} />
        </View>

        {/* Sets Navigation Stack*/}
        <Stack.Navigator>

          {/* Directory page */}
          <Stack.Screen
            name="Staff Directory"
            component={DirectoryScreen}
            options={{
              headerLeft: null,
              headerTitle: 'Staff Directory',
            }}
          />

          {/* Details page */}
          <Stack.Screen
            name="Staff Details"
            component={StaffDetailsScreen}
            options={{
              headerBackTitleVisible: false,
            }}
          />

          {/* Edit details page */}
          <Stack.Screen
            name="Edit Staff"
            component={EditStaffScreen}
            options={{
              headerBackTitleVisible: false,
            }}
          />

          {/* Add staff page */}
          <Stack.Screen
            name="Add Staff"
            component={AddStaffScreen}
            options={{
              headerBackTitleVisible: false,
            }}
          />

          {/* Settings page */}
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{
              headerBackTitleVisible: false,
            }}
          />
        </Stack.Navigator>

        {/* Calls bottomButtons.js to populate bottom nav persistent across screens*/}
        <BottomButtons />
      </SafeAreaView>
    </NavigationContainer>
  );
}
