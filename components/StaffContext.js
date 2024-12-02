import React, { createContext, useState, useEffect } from 'react';

// Creates context that will be used across the app to hold the updated staff information
export const StaffContext = createContext();

export function StaffProvider({ children }) {
  const [staffList, setStaffList] = useState([]);

  const repo = 'melmk/testDataRedOpalInovations';
  const filePath = 'staffTestData.json';
  const gitHubToken = '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';

  // Grabs info from GitHub
  const fetchStaffData = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repo}/contents/${filePath}?ref=main`,
        {
          headers: { Authorization: `token ${gitHubToken}` },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch staff data');
      const data = await response.json();
      const decodedContent = atob(data.content);
      const parsedContent = JSON.parse(decodedContent);
      setStaffList(parsedContent.people);
    } catch (error) {
      console.error('Error fetching staff data:', error);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  return (
    <StaffContext.Provider value={{ staffList, setStaffList, fetchStaffData }}>
      {children}
    </StaffContext.Provider>
  );
}
