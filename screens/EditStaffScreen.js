import React, { useState, useContext } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StaffContext } from '../components/StaffContext';
import styles from '../Styles';

export default function EditStaffScreen({ route, navigation }) {
  const { staff = {} } = route.params;
  const { id = '', name: initialName = '', department: initialDepartment = 0, address: initialAddress = {} } = staff;
  const { staffList, setStaffList } = useContext(StaffContext);

  const [name, setName] = useState(initialName);
  const [department, setDepartment] = useState(initialDepartment);
  const [address, setAddress] = useState({
    street: initialAddress.street || '',
    city: initialAddress.city || '',
    state: initialAddress.state || '',
    zip: initialAddress.zip || '',
    country: initialAddress.country || '',
  });

  const handleSave = () => {
    // Update staff data
    const updatedStaff = { id, name, department, address };

    // Update the global staff list
    const updatedStaffList = staffList.map((item) =>
      item.id === updatedStaff.id ? updatedStaff : item
    );
    setStaffList(updatedStaffList);

    Alert.alert('Success', 'Staff details updated successfully!');
    navigation.navigate('Staff Details', { staff: updatedStaff });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.editContainer}>
        {/* ID - Not Editable */}
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
            {Object.entries({
              0: 'General',
              1: 'Information Communications Technology',
              2: 'Finance',
              3: 'Marketing',
              4: 'Human Resources',
            }).map(([key, value]) => (
              <Picker.Item key={key} label={value} value={Number(key)} />
            ))}
          </Picker>
        </View>

        {/* Address Fields */}
        {['Street', 'City', 'State', 'Zip Code', 'Country'].map((field) => {
          const fieldKey = field.toLowerCase().replace(' ', '');
          return (
            <View style={styles.tile} key={field}>
              <Text style={styles.labelText}>{field}</Text>
              <TextInput
                style={styles.input}
                value={address[fieldKey] || ''}
                onChangeText={(text) => setAddress({ ...address, [fieldKey]: text })}
                placeholder={`Enter ${field}`}
              />
            </View>
          );
        })}
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity style={styles.editButton} onPress={handleSave}>
        <Text style={styles.editButtonText}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
