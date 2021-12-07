import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import MenuIcon from '../../common/MenuIcon';
import Home3Screen from '../../screens/Home3Screen';
import ThankUScreen from '../../screens/ThankUScreen';
/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator({
  ThankUScreen: {
    screen: ThankUScreen,

    navigationOptions: ({navigation}) => ({
      gestureEnabled: true,
      headerLeft: () => <MenuIcon navigation={navigation} />,
    }),
  },
  Home3Screen: {
    screen: Home3Screen,

    navigationOptions: ({navigation}) => ({
      gestureEnabled: true,
      headerLeft: () => <MenuIcon navigation={navigation} />,
    }),
  },
});
HomeStackNavigator.navigationOptions = ({navigation}) => {
  let drawerLockMode = 'locked-closed';
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed';
  }

  return {
    drawerLockMode,
  };
};
export default HomeStackNavigator;
