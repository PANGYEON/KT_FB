import React from 'react';
import { AppRegistry } from 'react-native';
import MyStack from './Navigator'; // Adjust the path accordingly
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => MyStack);