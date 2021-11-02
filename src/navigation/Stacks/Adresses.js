import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import AdressesScreen from '../../screens/AdressesScreen'
import AddressEdit from '../../screens/AddressEdit'
import SearchFilterClass from '../../common/SearchFilterClass'
import SearchFilterZone from '../../common/SearchFilterZone'
import NewestScreen from '../../navigation/Stacks/Newest'
import MenuIcon from '../../common/MenuIcon'
/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator({
  Home: {
    screen: AdressesScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: true,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  AddressEdit: {
    screen: AddressEdit,
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
  SearchFilterClass: {
    screen: SearchFilterClass,
    navigationOptions: () => ({
      gestureEnabled: false,
      headerRight: null
    })
  },
  SearchFilterZone: {
    screen: SearchFilterZone,
    navigationOptions: () => ({
      gestureEnabled: false,
      headerRight: null
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
