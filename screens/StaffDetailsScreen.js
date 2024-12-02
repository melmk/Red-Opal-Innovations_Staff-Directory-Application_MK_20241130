import React, { useState, useEffect, useLayoutEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { CommonActions } from '@react-navigation/native'; // Import CommonActions
import styles from '../Styles';

const departmentMap = {
  0: 'General',
  1: 'Information Communications Technology',
  2: 'Finance',
  3: 'Marketing',
  4: 'Human Resources',
};

export default function StaffDetailsScreen({ route, navigation }) {
  const { staff } = route.params || {}; // Initially passed staff details
  const [currentStaff, setCurrentStaff] = useState(staff);

  // Check for updated details every time screen regains focus
  useEffect(() => {
    if (route.params?.updatedStaff) {
      setCurrentStaff(route.params.updatedStaff); // Update staff if edited
    }
  }, [route.params?.updatedStaff]);

  // Remove the back button by setting headerLeft to null
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: null, // This removes the back button
    });
  }, [navigation]);

  if (!currentStaff || !currentStaff.address) {
    return <Text style={styles.errorText}>Staff information is not available.</Text>;
  }

  const departmentId = currentStaff.department;
  const departmentName = departmentMap[departmentId] || 'Department unknown';

  return (
    <ScrollView style={styles.detailsContainer}>
      <Text style={styles.detailTitle}>{currentStaff.name || 'No Name Available'}</Text>

      {/* Render staff details */}
      {['ID', 'Name', 'Department', 'Street', 'City', 'State', 'Zip Code', 'Country'].map((field) => {
        let value;
        switch (field) {
          case 'ID':
            value = currentStaff.id || 'Not Available';
            break;
          case 'Name':
            value = currentStaff.name || 'Not Available';
            break;
          case 'Department':
            value = departmentName;
            break;
          case 'Street':
            value = currentStaff.address?.street || 'Not Available';
            break;
          case 'City':
            value = currentStaff.address?.city || 'Not Available';
            break;
          case 'State':
            value = currentStaff.address?.state || 'Not Available';
            break;
          case 'Zip Code':
            value = currentStaff.address?.zip || 'Not Available';
            break;
          case 'Country':
            value = currentStaff.address?.country || 'Not Available';
            break;
          default:
            value = 'Not Available';
        }
        return (
          <View style={styles.tile} key={field}>
            <Text style={styles.tileText}>
              {field}: {value}
            </Text>
          </View>
        );
      })}

      {/* Edit button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('Edit Staff', { staff: currentStaff })}
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
