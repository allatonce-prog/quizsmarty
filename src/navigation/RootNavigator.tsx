import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '../theme/ThemeContext';
import { Header } from '../components/Header';
import { FloatingTabBar } from '../components/FloatingTabBar';

import { LoginScreen } from '../auth/LoginScreen';
import { RegisterScreen } from '../auth/RegisterScreen';
import { DashboardScreen } from '../dashboard/DashboardScreen';
import { UploadScreen } from '../upload/UploadScreen';
import { QuizGeneratorScreen } from '../quiz/QuizGeneratorScreen';
import { QuizPlayerScreen } from '../quiz/QuizPlayerScreen';
import { QuizResultsScreen } from '../quiz/QuizResultsScreen';
import { MistakeBankScreen } from '../mistakes/MistakeBankScreen';
import { AnalyticsScreen } from '../analytics/AnalyticsScreen';
import { AchievementsScreen } from '../achievements/AchievementsScreen';
import { ProfileScreen } from '../profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

function TabNavigator({ navigation }: any) {
  const { theme } = useTheme();

  return (
    <View style={[styles.tabWrapper, { backgroundColor: theme.bg }]}>
      {/* Persistent Top Header Bar with navigation support for Login redirect */}
      <Header
        navigation={navigation}
        onPressProfile={() => navigation.navigate('Profile')}
        onPressSettings={() => navigation.navigate('Profile')}
      />

      <Tab.Navigator
        tabBarPosition="bottom"
        tabBar={(props) => <FloatingTabBar {...props} />}
        screenOptions={{
          swipeEnabled: true,
          animationEnabled: true,
          lazy: false,
        }}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="MistakeBank" component={MistakeBankScreen} />
        <Tab.Screen name="Upload" component={UploadScreen} />
        <Tab.Screen name="Analytics" component={AnalyticsScreen} />
        <Tab.Screen name="Achievements" component={AchievementsScreen} />
      </Tab.Navigator>
    </View>
  );
}

export function RootNavigator() {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
          headerStyle: {
            backgroundColor: theme.card,
          },
          headerTintColor: theme.textPrimary,
          headerTitleStyle: {
            fontWeight: '700',
          },
          contentStyle: {
            backgroundColor: theme.bg,
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false, animation: 'fade' }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QuizGenerator"
          component={QuizGeneratorScreen}
          options={{ title: 'Configure Quiz' }}
        />
        <Stack.Screen
          name="QuizPlayer"
          component={QuizPlayerScreen}
          options={{ title: 'Quiz in Progress', headerBackVisible: false }}
        />
        <Stack.Screen
          name="QuizResults"
          component={QuizResultsScreen}
          options={{ title: 'Quiz Results', headerBackVisible: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'User Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabWrapper: {
    flex: 1,
  },
});
