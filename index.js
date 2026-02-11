/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import AppEyeTrackingMock from "./AppEyeTrackingMock";

export default AppEyeTrackingMock;

AppRegistry.registerComponent(appName, () => App);
