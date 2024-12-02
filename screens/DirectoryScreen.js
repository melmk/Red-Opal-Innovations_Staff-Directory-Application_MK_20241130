import React, { useState, useEffect } from 'react';
import { Alert, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from '../Styles';

// View 1: DirectoryScreen - Displays a list of staff members fetched from a .json stored in a GitHub repo
export default function DirectoryScreen({ navigation }) {

  // State to hold the staff data fetched from the GitHub repository
  const [staffList, setStaffList] = useState([]);

  // GitHub info
  const repo = 'melmk/testDataRedOpalInovations';
  const filePath = 'staffTestData.json';
  const gitHubToken = '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';

  // Function to fetch the staff data from GitHub
  const fetchStaffData = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repo}/contents/${filePath}?ref=main`, 
        {
          headers: { 'Authorization': `token ${gitHubToken}` },
        }
      );

      if (!response.ok) {
        throw new Error('Could not fetch staff data from GitHub.');
      }

      const data = await response.json();
      const decodedContent = atob(data.content); // Decode the base64 encoded JSON
      const parsedContent = JSON.parse(decodedContent); // Parse the decoded JSON
      return parsedContent; // Return the parsed staff data
    } catch (error) {
      console.error('Error fetching staff data:', error);
      throw error;
    }
  };

  // Function to load staff data and update the state
  const loadStaffData = async () => {
    try {
      const { people } = await fetchStaffData(); // Get the "people" data from the fetched content
      setStaffList(people); // Update the state with the staff data
    } catch (error) {
      Alert.alert('Error', 'Unable to load staff data. Please try again later.');
    }
  };

  // UseEffect hook to load the staff data once when the component is mounted
  useEffect(() => {
    loadStaffData();
  }, []);

  // Function to render a clickable tile for each staff member
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
      {/* Render a list of staff tiles */}
      {staffList.map(renderStaffTile)}
    </ScrollView>
  );
}
