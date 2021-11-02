import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import MenuIcon from '../../common/MenuIcon'
import ThankUScreen from '../../screens/ThankUScreen'
/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator({
  ThankUScreen: {
    screen: ThankUScreen,

    navigationOptions: ({ navigation }) => ({
      gestureEnabled: true,
      headerLeft: () => <MenuIcon navigation={navigation} />
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
