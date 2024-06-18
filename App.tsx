import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from './src/screens/Dashboard';
import Login from './src/screens/Login';
import Movie from './src/screens/Movie';
import Search from './src/screens/Search';

import { getUserData } from './src/utils/UserData';

const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const checkUserData = async () => {
      const userData = await getUserData();
      setInitialRoute(userData ? 'Dashboard' : 'Login');
    };

    checkUserData();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            headerLeft: () => null,
            headerShown: false
          }}
        />
        <Stack.Screen name="Movie" options={{ headerShown: false }} component={Movie} />
        <Stack.Screen name="Search" options={{ headerShown: false }} component={Search} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
