import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import RewardPoints from '../../screens/RewardPoints'
import ProductDetails from '../../screens/ProductDetails'
import RatingAndReviewScreen from '../../screens/RatingAndReviewScreen'
import NewestScreen from '../../navigation/Stacks/Newest'
import MenuIcon from '../../common/MenuIcon'
/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator({
  RewardPoints: {
    screen: RewardPoints,
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
  ProductDetails: {
    screen: ProductDetails,
    navigationOptions: () => ({
      gestureEnabled: false
    })
  },
  RatingAndReviewScreen: {
    screen: RatingAndReviewScreen,
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
