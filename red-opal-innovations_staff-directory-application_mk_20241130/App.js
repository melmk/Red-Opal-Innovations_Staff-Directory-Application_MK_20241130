import React, { useState, useEffect } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Platform,TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as FileSystem from 'expo-file-system';
import defaultData from './assets/staffTestData.json'; 

// Path to save the file (within the app's document directory)
const fileUri = FileSystem.documentDirectory + 'staffTestData.json';

const departmentMap = {
  0: 'General',
  1: 'Information Communications Technology',
  2: 'Finance',
  3: 'Marketing',
  4: 'Human Resources',
};

// View 1: Directory Screen
function DirectoryScreen({ navigation }) {
  const [staffData, setStaffData] = useState([]);

  // Function to read staff data from the file
  const readStaffData = async () => {
    try {
      if (Platform.OS !== 'web') {
        const fileExists = await FileSystem.getInfoAsync(fileUri);
        if (fileExists.exists) {
          const fileData = await FileSystem.readAsStringAsync(fileUri);
          return JSON.parse(fileData);
        } else {
          // If the file doesn't exist, create it
          await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(defaultData));
          return defaultData;
        }
      } else {
        console.warn('File system operations are not supported on web.');
        return defaultData; // Return default data on web
      }
    } catch (error) {
      console.error('Error reading or writing file:', error);
      return defaultData;
    }
  };

  // Load staff data
  useEffect(() => {
    const loadData = async () => {
      const data = await readStaffData();
      setStaffData(data.people);
    };
    loadData();
  }, []);

  // Creates a tile for each staff member
  const renderStaffTile = ({ item }) => (
    <TouchableOpacity
      style={styles.tile}
      onPress={() => navigation.navigate('Staff Details', { staff: item })} // Pass staff data to the details screen
    >
      <Text style={styles.tileText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {staffData.map((staff) => renderStaffTile({ item: staff }))}
    </ScrollView>
  );
}

function StaffDetailsScreen({ route, navigation }) {
  const { staff } = route.params || {};  // Check parameters exist

  if (!staff || !staff.address) {
    return <Text style={styles.errorText}>Staff information is not available.</Text>;
  }

  const departmentId = staff.department;
  const departmentName = departmentMap[departmentId] || 'Department unknown';

  return (
    <ScrollView style={styles.detailsContainer}>
      <Text style={styles.detailTitle}>{staff.name || 'No Name Available'}</Text>

      <View style={styles.tile}>
        <Text style={styles.tileText}>Name: {staff.name || 'No Name Available'}</Text>
      </View>

      <View style={styles.tile}>
        <Text style={styles.tileText}>Department: {departmentName}</Text>
      </View>

      <View style={styles.tile}>
        <Text style={styles.tileText}>Street: {staff.address.street || 'Not Available'}</Text>
      </View>
      <View style={styles.tile}>
        <Text style={styles.tileText}>City: {staff.address.city || 'Not Available'}</Text>
      </View>
      <View style={styles.tile}>
        <Text style={styles.tileText}>State: {staff.address.state || 'Not Available'}</Text>
      </View>
      <View style={styles.tile}>
        <Text style={styles.tileText}>Zip Code: {staff.address.zip || 'Not Available'}</Text>
      </View>
      <View style={styles.tile}>
        <Text style={styles.tileText}>Country: {staff.address.country || 'Not Available'}</Text>
      </View>

      {/* Edit button */}
      <TouchableOpacity 
        style={styles.editButton} 
        onPress={() => navigation.navigate('Edit Staff', { staff })}
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


// VIEW 3: Editable staff information populated placeholders with current information
function EditStaffScreen({ route, navigation }) {
  const { staff } = route.params;

  const [name, setName] = useState(staff.name);
  const [department, setDepartment] = useState(staff.department);
  const [address, setAddress] = useState(staff.address);

  const handleSave = async () => {
    try {
      const updatedStaff = { ...staff, name, department, address };

      const fileData = await FileSystem.readAsStringAsync(fileUri);
      const data = JSON.parse(fileData);
      const updatedData = {
        ...data,
        people: data.people.map((item) => (item.id === staff.id ? updatedStaff : item)),
      };

      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(updatedData));
      Alert.alert('Staff details updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving staff details:', error);
      Alert.alert('Error', 'Failed to save staff details');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.editContainer}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter Name"
        />
        <TextInput
          style={styles.input}
          value={department}
          onChangeText={setDepartment}
          placeholder="Enter Department"
        />
        <TextInput
          style={styles.input}
          value={address.street}
          onChangeText={(text) => setAddress({ ...address, street: text })}
          placeholder="Enter Street Address"
        />
        <TextInput
          style={styles.input}
          value={address.city}
          onChangeText={(text) => setAddress({ ...address, city: text })}
          placeholder="Enter City"
        />
        <TextInput
          style={styles.input}
          value={address.state}
          onChangeText={(text) => setAddress({ ...address, state: text })}
          placeholder="Enter State"
        />
        <TextInput
          style={styles.input}
          value={address.zip}
          onChangeText={(text) => setAddress({ ...address, zip: text })}
          placeholder="Enter Zip Code"
        />
        <TextInput
          style={styles.input}
          value={address.country}
          onChangeText={(text) => setAddress({ ...address, country: text })}
          placeholder="Enter Country"
        />

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ADD LATER
const handleAddStaff = () => {
  Alert.alert('Add Staff clicked!');
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerBar}>
          <Image source={require('./assets/roi-icon1.png')} style={styles.roiIcon} />
        </View>

        <Stack.Navigator>
          <Stack.Screen name="Staff Directory" component={DirectoryScreen} />
          <Stack.Screen name="Staff Details" component={StaffDetailsScreen} />
          <Stack.Screen name="Edit Staff" component={EditStaffScreen} />
        </Stack.Navigator>

        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#FBF9F9' }]} onPress={() => Alert.alert('Navigate to Directory')}>
            <View style={styles.buttonContent}>
              <Image source={require('./assets/directory-icon.png')} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Directory</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: '#FBF9F9' }]} onPress={handleAddStaff}>
            <View style={styles.buttonContent}>
              <Image source={require('./assets/add-staff-icon.png')} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Add Staff</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerBar: {
    height: 144,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    position: 'relative',
  },
  roiIcon: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    width: 110,
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FBF9F9',
    height: 66,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
    width: 150,
    height: 50,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    fontFamily: 'Trebuchet MS',
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  tile: {
    backgroundColor: '#FBF9F9',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'flex-start',
    width: '98%',
    marginLeft: '1%',
    marginRight: '1%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  tileText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
    width: '100%',
  },
  editButton: {
    position: 'absolute',
    right: 10,
    top: 0,
    backgroundColor: '#941a1d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: 70,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
