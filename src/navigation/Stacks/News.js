import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import NewsScreen from '../../screens/NewsScreen'
import NewestScreen from '../../navigation/Stacks/Newest'
import NewsDetails from '../../screens/NewsDetails'
import newsList from '../../screens/NewsList'
import MenuIcon from '../../common/MenuIcon'
/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator({
  NewsScreen: {
    screen: NewsScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: true,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  NewsDetails: {
    screen: NewsDetails,
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
  newsList: {
    screen: newsList,
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
