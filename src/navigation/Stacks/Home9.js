import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import Home9Screen from '../../screens/Home'
import MenuIcon from '../../common/MenuIcon'
import AboutScreen from '../../screens/AboutScreen'
import AddressEdit from '../../screens/AddressEdit'
import AdressesScreen from '../../screens/AdressesScreen'
import CartScreen from '../../navigation/Stacks/Cart'
import Categories from '../../screens/Category2Screen'
import ContactUsScreen from '../../screens/ContactUsScreen'
import CreateAccountScreen from '../../screens/CreateAccountScreen'
import CurrencyScreen from '../../screens/CurrencyScreen'
import DownloadsScreen from '../../screens/DownloadsScreen'
import ForgotPasswordScreen from '../../screens/ForgotPasswordScreen'
import IntroScreen from '../../screens/IntroScreen'
import LanguageScreen from '../../screens/LanguageScreen'
import LoginScreen from '../../screens/LoginScreen'
import MyAccountScreen from '../../screens/MyAccountScreen'
import MyFavorites from '../../screens/MyFavorites'
import MyOrdersScreen from '../../screens/MyOrdersScreen'
import NewestScreen from '../../navigation/Stacks/Newest'
import NewsDetails from '../../screens/NewsDetails'
import newsList from '../../screens/NewsList'
import NewsScreen from '../../screens/NewsScreen'
import OrderDetail from '../../screens/OrderDetail'
import OrderScreen from '../../screens/OrderScreen'
import PrivacyPolicyScreen from '../../screens/PrivacyPolicyScreen'
import ProductDetails from '../../screens/ProductDetails'
import RatingAndReviewScreen from '../../screens/RatingAndReviewScreen'
import RefundPolicy from '../../screens/RefundPolicy'
import RewardPoints from '../../screens/RewardPoints'
import SearchScreen from '../../navigation/Stacks/Search'
import SettingsScreen from '../../navigation/Stacks/Settings'
import ShippingAddressScreen from '../../screens/ShippingAddressScreen'
import ShippingMethodScreen from '../../screens/ShippingMethodScreen'
import SubCategory from '../../screens/SubCategory'
import TermAndServiceScreen from '../../screens/TermAndServiceScreen'
import ThankUScreen from '../../screens/ThankUScreen'
import DemoScreen from '../../screens/DemoScreen'
/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator({
  Home9Screen: {
    screen: Home9Screen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  DemoScreen: {
    screen: DemoScreen,
    navigationOptions: () => ({
      gestureEnabled: false
    })
  },
  TermAndServiceScreen: {
    screen: TermAndServiceScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  ThankUScreen: {
    screen: ThankUScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  AboutScreen: {
    screen: AboutScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  AddressEdit: {
    screen: AddressEdit,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  AdressesScreen: {
    screen: AdressesScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  CartScreen: {
    screen: CartScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />,
      header: null
    })
  },
  ContactUsScreen: {
    screen: ContactUsScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  CurrencyScreen: {
    screen: CurrencyScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  DownloadsScreen: {
    screen: DownloadsScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  IntroScreen: {
    screen: IntroScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  LanguageScreen: {
    screen: LanguageScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  MyAccountScreen: {
    screen: MyAccountScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  MyFavorites: {
    screen: MyFavorites,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  MyOrdersScreen: {
    screen: MyOrdersScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  NewsDetails: {
    screen: NewsDetails,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  newsList: {
    screen: newsList,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  NewsScreen: {
    screen: NewsScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  OrderDetail: {
    screen: OrderDetail,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  OrderScreen: {
    screen: OrderScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  PrivacyPolicyScreen: {
    screen: PrivacyPolicyScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  RefundPolicy: {
    screen: RefundPolicy,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  RewardPoints: {
    screen: RewardPoints,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  SearchScreen: {
    screen: SearchScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: true,
      headerLeft: () => <MenuIcon navigation={navigation} />,
      header: null
    })
  },
  ShippingAddressScreen: {
    screen: ShippingAddressScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  ShippingMethodScreen: {
    screen: ShippingMethodScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  SubCategory: {
    screen: SubCategory,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false
    })
  },
  SettingsScreen: {
    screen: SettingsScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerLeft: () => <MenuIcon navigation={navigation} />,
      header: null
    })
  },
  Categories: {
    screen: Categories,
    navigationOptions: ({ navigation }) => ({
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
  LoginScreen: {
    screen: LoginScreen,
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
