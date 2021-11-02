import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import LanguageScreen from '../../screens/LanguageScreen'
import Home2Screen from '../../screens/Home2Screen'
import Home3Screen from '../../screens/Home3Screen'
import MenuIcon from '../../common/MenuIcon'
import NewestScreen from '../../navigation/Stacks/Newest'
/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator({
  Home: {
    screen: LanguageScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: true,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  Home2: {
    screen: Home2Screen,
    navigationOptions: () => ({
      gestureEnabled: false
    })
  },
  NewestScreen: {
    screen: NewestScreen,
    navigationOptions: () => ({
      gestureEnabled: false
    })
  },
  Home3: {
    screen: Home3Screen,
    navigationOptions: () => ({
      gestureEnabled: false
    })
  }
})
HomeStackNavigator.navigationOptions = ({ navigation }) => {
  let drawerLockMode = 'unlocked'
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed'
  }

  return {
    drawerLockMode
  }
}
export default HomeStackNavigator
