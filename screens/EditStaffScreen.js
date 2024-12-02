import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import styles from '../Styles';

export default function EditStaffScreen({ route, navigation }) {
  
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

  // Extract staff data passed from previous screen
  const { staff, fileSha } = route.params;

  // States for editable fields
  const [id] = useState(staff.id);
  const [name, setName] = useState(staff.name);
  const [department, setDepartment] = useState(staff.department);
  const [address, setAddress] = useState(staff.address);

 const handleSave = async () => {
  try {
    const updatedStaff = { id, name, department, address };

    // Fetch the latest file data from GitHub
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

    // Update staff data
    const updatedPeople = content.people.map((person) =>
      person.id === updatedStaff.id ? updatedStaff : person
    );

    const updatedContent = btoa(JSON.stringify({ ...content, people: updatedPeople }));

    // Save updated content back to GitHub
    const putResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${gitHubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Update staff record for ${name}`,
        sha: data.sha, // Use fetched SHA
        content: updatedContent,
      }),
    });

    if (!putResponse.ok) {
      const putErrorData = await putResponse.json();
      console.error('PUT Request Error:', putErrorData);
      throw new Error(`Failed to save file: ${putErrorData.message}`);
    }

    Alert.alert('Success', 'Staff details updated successfully!');

    // Navigate back to StaffDetailsScreen with updated details
    navigation.navigate('Staff Details', { updatedStaff });
  } catch (error) {
    console.error('Save Error:', error);
    Alert.alert('Error', error.message);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.editContainer}>
        {/* ID - not editable */}
        <View style={styles.tile}>
          <Text style={styles.labelText}>ID - cannot edit</Text>
          <Text style={[styles.input, { backgroundColor: '#f0f0f0', color: '#555' }]}>
            {id}
          </Text>
        </View>

        {/* Name */}
        <View style={styles.tile}>
          <Text style={styles.labelText}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter Name"
          />
        </View>

        {/* Department */}
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

        {/* Address Street */}
        <View style={styles.tile}>
          <Text style={styles.labelText}>Street</Text>
          <TextInput
            style={styles.input}
            value={address.street}
            onChangeText={(text) => setAddress({ ...address, street: text })}
            placeholder="Enter Street Address"
          />
        </View>

        {/* Address City */}
        <View style={styles.tile}>
          <Text style={styles.labelText}>City</Text>
          <TextInput
            style={styles.input}
            value={address.city}
            onChangeText={(text) => setAddress({ ...address, city: text })}
            placeholder="Enter City"
          />
        </View>

        {/* Address State */}
        <View style={styles.tile}>
          <Text style={styles.labelText}>State</Text>
          <TextInput
            style={styles.input}
            value={address.state}
            onChangeText={(text) => setAddress({ ...address, state: text })}
            placeholder="Enter State"
          />
        </View>

        {/* Address ZIP */}
        <View style={styles.tile}>
          <Text style={styles.labelText}>Zip Code</Text>
          <TextInput
            style={styles.input}
            value={address.zip}
            onChangeText={(text) => setAddress({ ...address, zip: text })}
            placeholder="Enter Zip Code"
          />
        </View>

        {/* Address Country */}
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

      {/* Save Button */}
      <TouchableOpacity style={styles.editButton} onPress={handleSave}>
        <Text style={styles.editButtonText}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
