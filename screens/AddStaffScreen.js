import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../Styles';

export default function AddStaffScreen({ route, navigation }) {

  const departmentMap = {
    0: 'General',
    1: 'Information Communications Technology',
    2: 'Finance',
    3: 'Marketing',
    4: 'Human Resources',
  };

  const repo = 'melmk/testDataRedOpalInovations';
  const filePath = 'staffTestData.json';
  const gitHubToken = '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';

  const [id, setID] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState(0);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const saveInfo = async () => {
    // Check if any fields are empty
    if (
      !id.trim() ||
      !name.trim() ||
      !address.street.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.zip.trim() ||
      !address.country.trim()
    ) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
        headers: {
          Authorization: `token ${gitHubToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Fetch File Error:', errorData);
        throw new Error(`Failed to fetch file data: ${errorData.message}`);
      }

      const data = await response.json();
      const decodedContent = atob(data.content);
      const content = JSON.parse(decodedContent);

      // Check if the new ID already exists in the retrieved data
      const existingID = content.people.some((person) => person.id === id);
      if (existingID) {
        Alert.alert('Error', 'ID must be unique.');
        return;
      }

      const newStaff = { id, name, department, address };
      const updatedPeople = [...content.people, newStaff];
      const updatedContent = btoa(JSON.stringify({ ...content, people: updatedPeople }));

      // Post updated content back to GitHub .json
      const putResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          Authorization: `token ${gitHubToken}`,
          'Content-Type': 'application/json',
        },

        // Add commit comment to specify the person added and use new SHA for the commit
        body: JSON.stringify({
          message: `Add new staff member: ${name}`,
          sha: data.sha,
          content: updatedContent,
        }),
      });

      if (!putResponse.ok) {
        const putErrorData = await putResponse.json();
        console.error('PUT Request Error:', putErrorData);
        throw new Error(`Failed to save file: ${putErrorData.message}`);
      }

      // Notify user the save was successful, send user back to StaffDetailsScreen
      Alert.alert('Success', 'New staff member added successfully!');
      navigation.navigate('Staff Directory');
    } 
    
    catch (error) {
      console.error('Save Error:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.editContainer}>
        // ID
        <View style={styles.tile}>
          <Text style={styles.labelText}>ID</Text>
          <TextInput
            style={styles.input}
            value={id}
            onChangeText={setID}
            placeholder="Enter ID"
          />
        </View>

        // Name
        <View style={styles.tile}>
          <Text style={styles.labelText}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter Name"
          />
        </View>

        // Department picker
        <View style={styles.tile}>
          <Text style={styles.labelText}>Department</Text>
          <Picker
            selectedValue={department}
            onValueChange={(itemValue) => setDepartment(itemValue)}
            style={styles.picker}
          >
            {Object.entries(departmentMap).map(([key, value]) => (
              <Picker.Item key={key} label={value} value={Number(key)} />
            ))}
          </Picker>
        </View>

        // Address Street
        <View style={styles.tile}>
          <Text style={styles.labelText}>Street</Text>
          <TextInput
            style={styles.input}
            value={address.street}
            onChangeText={(text) => setAddress({ ...address, street: text })}
            placeholder="Enter Street Address"
          />
        </View>

        // Address City
        <View style={styles.tile}>
          <Text style={styles.labelText}>City</Text>
          <TextInput
            style={styles.input}
            value={address.city}
            onChangeText={(text) => setAddress({ ...address, city: text })}
            placeholder="Enter City"
          />
        </View>

        // Address State
        <View style={styles.tile}>
          <Text style={styles.labelText}>State</Text>
          <TextInput
            style={styles.input}
            value={address.state}
            onChangeText={(text) => setAddress({ ...address, state: text })}
            placeholder="Enter State"
          />
        </View>

        // Address ZIP
        <View style={styles.tile}>
          <Text style={styles.labelText}>Zip Code</Text>
          <TextInput
            style={styles.input}
            value={address.zip}
            onChangeText={(text) => setAddress({ ...address, zip: text })}
            placeholder="Enter Zip Code"
          />
        </View>

        // Address Country
        <View style={styles.tile}>
          <Text style={styles.labelText}>Country</Text>
          <TextInput
            style={styles.input}
            value={address.country}
            onChangeText={(text) => setAddress({ ...address, country: text })}
            placeholder="Enter Country"
          />
        </View>
      </ScrollView>

      // Save button
      <TouchableOpacity style={styles.editButton} onPress={saveInfo}>
        <Text style={styles.editButtonText}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
