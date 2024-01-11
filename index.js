import React from 'react';
import { AppRegistry,LogBox } from 'react-native';
import MyStack from './Navigator'; // Adjust the path accordingly
import { name as appName } from './app.json';
LogBox.ignoreLogs(['In React 18, SSRProvider is not necessary and is a noop']);
AppRegistry.registerComponent(appName, () => MyStack);