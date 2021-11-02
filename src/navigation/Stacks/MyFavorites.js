import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import MyFavorites from '../../screens/MyFavorites'
import ProductDetails from '../../screens/ProductDetails'
import RatingAndReviewScreen from '../../screens/RatingAndReviewScreen'
import NewestScreen from '../../navigation/Stacks/Newest'
import CreateAccountScreen from '../../screens/CreateAccountScreen'
import ForgotPasswordScreen from '../../screens/ForgotPasswordScreen'
import MenuIcon from '../../common/MenuIcon'
/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator({
  Home: {
    screen: MyFavorites,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: true,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  ForgotPasswordScreen: {
    screen: ForgotPasswordScreen,
    navigationOptions: () => ({
      gestureEnabled: false
    })
  },
  CreateAccountScreen: {
    screen: CreateAccountScreen,
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
