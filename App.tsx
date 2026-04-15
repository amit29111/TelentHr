import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './src/navigation/StackNavigation'; // Adjust path if needed
import { Provider } from 'react-redux';
import  {store}  from './src/redux/store';
import InternetGuard from './src/screens/InternetGuard';

const App = () => {
  return (
    <Provider store={store}>
      <InternetGuard>
        <NavigationContainer>
          <StackNavigation />
        </NavigationContainer>
      </InternetGuard>
    </Provider>
  );
};  

export default App;




// get: /resignation/getAllPreResignations?employeeId=${empId} 

// get: /resignation/getPreResignationById/${preResignationId}

// post: /resignation/addPreResignation 
// put: /resignation/updatePreResignation/${preResignationId}
// delete: /resignation/deletePreResignation/${preResignationId}`

