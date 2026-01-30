import {SplashScreen, Stack} from "expo-router";
import './globals.css';
import { useFonts } from 'expo-font';
import * as Sentry from '@sentry/react-native';
import useAuthStore from "@/store/auth.store";
import {useEffect} from 'react';


Sentry.init({
  dsn: 'https://6b0508df2af6e8c73be40b10abef0067@o4510732473860096.ingest.us.sentry.io/4510732498370561',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
  const {isLoading, fetchAuthenticatedUser } = useAuthStore();

  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require('../assets/fonts/Quicksand-Bold.ttf'),
    "QuickSand-Medium": require('../assets/fonts/Quicksand-Medium.ttf'),
    "QuickSand-Regular": require('../assets/fonts/Quicksand-Regular.ttf'),
    "QuickSand-SemiBold": require('../assets/fonts/Quicksand-SemiBold.ttf'),
    "QuickSand-Light": require('../assets/fonts/Quicksand-Light.ttf'),
  });

  useEffect(() => {
    if(error) throw error;
    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  
  useEffect(() => {
    fetchAuthenticatedUser()
  }, []);

  //temporary 
  if(!fontsLoaded) return null;

  return <Stack screenOptions={{ headerShown: false}}/>;

  
});