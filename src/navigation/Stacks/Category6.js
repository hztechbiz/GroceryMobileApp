import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import Category6Screen from '../../screens/Category6Screen'
import SubCategory from '../../screens/SubCategory'
import NewestScreen from '../../navigation/Stacks/Newest'
import ProductDetails from '../../screens/ProductDetails'
import RatingAndReviewScreen from '../../screens/RatingAndReviewScreen'
import CreateAccountScreen from '../../screens/CreateAccountScreen'
import ForgotPasswordScreen from '../../screens/ForgotPasswordScreen'
import MenuIcon from '../../common/MenuIcon'
/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator({
  Category6Screen: {
    screen: Category6Screen,
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
  },
  SubCategory: {
    screen: SubCategory,
    navigationOptions: () => ({
      gestureEnabled: false
    })
  },
  NewestScreen: {
    screen: NewestScreen,
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
