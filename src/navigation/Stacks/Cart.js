import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import CartScreen from '../../screens/CartScreen'
import ProductDetails from '../../screens/ProductDetails'
import LoginScreen from '../../screens/LoginScreen'
import ThankUScreen from '../../screens/ThankUScreen'
import NewestScreen from '../../navigation/Stacks/Newest'
import ShippingMethodScreen from '../../screens/ShippingMethodScreen'
import MapScreen from '../../screens/MapScreen'
import ShippingAddressScreen from '../../screens/ShippingAddressScreen'
import MyOrdersScreen from '../../screens/MyOrdersScreen'
import OrderDetail from '../../screens/OrderDetail'
import SearchFilterClass from '../../common/SearchFilterClass'
import SearchFilterZone from '../../common/SearchFilterZone'
import OrderScreen from '../../screens/OrderScreen'
import RatingAndReviewScreen from '../../screens/RatingAndReviewScreen'
import CreateAccountScreen from '../../screens/CreateAccountScreen'
import ForgotPasswordScreen from '../../screens/ForgotPasswordScreen'
import MenuIcon from '../../common/MenuIcon'
/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator({
  CartScreen: {
    screen: CartScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: true,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  SearchFilterClass: {
    screen: SearchFilterClass,
    navigationOptions: () => ({
      gestureEnabled: false,
      headerRight: null
    })
  },
  MapScreen: {
    screen: MapScreen,
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
  NewestScreen: {
    screen: NewestScreen,
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
  MyOrdersScreen: {
    screen: MyOrdersScreen,
    navigationOptions: () => ({
      gestureEnabled: false
    })
  },
  OrderDetail: {
    screen: OrderDetail,
    navigationOptions: () => ({
      gestureEnabled: false
    })
  },
  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: () => ({
      gestureEnabled: false
    })
  },
  ThankUScreen: {
    screen: ThankUScreen,
    navigationOptions: () => ({
      gestureEnabled: false,
      headerRight: null
    })
  },
  ShippingAddressScreen: {
    screen: ShippingAddressScreen,
    navigationOptions: () => ({
      gestureEnabled: false,
      headerRight: null
    })
  },
  ShippingMethodScreen: {
    screen: ShippingMethodScreen,
    navigationOptions: () => ({
      gestureEnabled: false,
      headerRight: null
    })
  },
  OrderScreen: {
    screen: OrderScreen,
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
