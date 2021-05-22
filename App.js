//import { StatusBar } from 'expo-status-bar';

import React from 'react';
import { Router, Stack, Scene } from 'react-native-router-flux';
import { StyleSheet } from 'react-native';
import First from './screen/first.js';
import Second from './screen/second.js';
import Third from './screen/third.js';
export default function App() {
  return (
    <Router>
      <Stack key="router">
      <Scene key="First" component={First} title=""  initial={true}  hideNavBar={true} hideTabBar={true}/>
      <Scene key="Second" component={Second} title=""   hideNavBar={true} hideTabBar={true}/>
      <Scene key="Third" component={Third} title=""  hideNavBar={true} hideTabBar={true}/>
      </Stack>
    </Router>
  )
  }
