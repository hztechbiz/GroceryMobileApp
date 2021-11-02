import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import Home1Screen from '../../screens/Home'
import LoginScreen from '../../screens/LoginScreen'
import Category1 from '../../screens/Category1Screen'
import Category2 from '../../screens/Category1Screen'
import Category from '../../screens/Category1Screen'
import SubCategory from '../../screens/SubCategory'
import NewestScreen from '../../navigation/Stacks/Newest'
import ProductDetails from '../../screens/ProductDetails'
import RatingAndReviewScreen from '../../screens/RatingAndReviewScreen'
import MenuIcon from '../../common/MenuIcon'
import CreateAccountScreen from '../../screens/CreateAccountScreen'
import ForgotPasswordScreen from '../../screens/ForgotPasswordScreen'
/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator({
  Home1Screen: {
    screen: Home1Screen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: true,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  Category1: {
    screen: Category1,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: true,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  Category2: {
    screen: Category2,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: true,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  Category: {
    screen: Category,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: true,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  ForgotPasswordScreen: {
    screen: ForgotPasswordScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false
    })
  },
  CreateAccountScreen: {
    screen: CreateAccountScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false
    })
  },
  LoginScreen: {
    screen: LoginScreen,
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
