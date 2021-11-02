import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import AboutScreen from '../../screens/AboutScreen'
import TermAndServiceScreen from '../../screens/TermAndServiceScreen'
import PrivacyPolicyScreen from '../../screens/PrivacyPolicyScreen'
import RefundPolicy from '../../screens/RefundPolicy'
import NewestScreen from '../../navigation/Stacks/Newest'
import MenuIcon from '../../common/MenuIcon'
/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator({
  Home: {
    screen: AboutScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: true,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  NewestScreen: {
    screen: NewestScreen,
    navigationOptions: () => ({
      gestureEnabled: false
    })
  },
  TermAndServiceScreen: {
    screen: TermAndServiceScreen,
    navigationOptions: () => ({
      gestureEnabled: false
    })
  },
  PrivacyPolicyScreen: {
    screen: PrivacyPolicyScreen,
    navigationOptions: () => ({
      gestureEnabled: false
    })
  },
  RefundPolicy: {
    screen: RefundPolicy,
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
