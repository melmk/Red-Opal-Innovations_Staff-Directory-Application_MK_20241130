import React, { useContext } from 'react';
import { Alert, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StaffContext } from '../components/StaffContext';
import styles from '../Styles';

// View 1: DirectoryScreen - Displays a list of staff members fetched from a .json stored in a GitHub repo
export default function DirectoryScreen({ navigation }) {

  const { staffList } = useContext(StaffContext);

const renderStaffTile = (staff) => (
    <TouchableOpacity
      key={staff.id}
      style={styles.tile}
      onPress={() => navigation.navigate('Staff Details', { staff })}
    >
      <Text style={styles.tileText}>{staff.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {staffList.map(renderStaffTile)}
    </ScrollView>
  );
}