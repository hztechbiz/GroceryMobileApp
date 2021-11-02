import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import MyOrdersScreen from '../../screens/MyOrdersScreen'
import NewestScreen from '../../navigation/Stacks/Newest'
import OrderDetail from '../../screens/OrderDetail'
import TrackLocationScreen from '../../screens/TrackLocationScreen'
import ProductDetails from '../../screens/ProductDetails'
import RatingAndReviewScreen from '../../screens/RatingAndReviewScreen'
import MenuIcon from '../../common/MenuIcon'
/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator({
  Home: {
    screen: MyOrdersScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: true,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  TrackLocationScreen: {
    screen: TrackLocationScreen,
    navigationOptions: () => ({
      gestureEnabled: true
    })
  },
  NewestScreen: {
    screen: NewestScreen,
    navigationOptions: () => ({
      gestureEnabled: true
    })
  },
  ProductDetails: {
    screen: ProductDetails,
    navigationOptions: () => ({
      gestureEnabled: true
    })
  },
  RatingAndReviewScreen: {
    screen: RatingAndReviewScreen,
    navigationOptions: () => ({
      gestureEnabled: true
    })
  },
  OrderDetail: {
    screen: OrderDetail,
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
