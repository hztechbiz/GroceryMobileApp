import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import SettingsScreen from '../../screens/SettingsScreen'
import ProductDetails from '../../screens/ProductDetails'
import RatingAndReviewScreen from '../../screens/RatingAndReviewScreen'
import MyFavorites from '../../screens/MyFavorites'
import MyAccountScreen from '../../screens/MyAccountScreen'
import AddressEdit from '../../screens/AddressEdit'
import AdressesScreen from '../../screens/AdressesScreen'
import MyOrdersScreen from '../../screens/MyOrdersScreen'
import OrderDetail from '../../screens/OrderDetail'
import DownloadsScreen from '../../screens/DownloadsScreen'
import RewardPoints from '../../screens/RewardPoints'
import ContactUsScreen from '../../screens/ContactUsScreen'
import AboutScreen from '../../screens/AboutScreen'
import NewsScreen from '../../screens/NewsScreen'
import NewsDetails from '../../screens/NewsDetails'
import newsList from '../../screens/NewsList'
import IntroScreen from '../../screens/IntroScreen'
import CurrencyScreen from '../../screens/CurrencyScreen'
import LanguageScreen from '../../screens/LanguageScreen'
import CreateAccountScreen from '../../screens/CreateAccountScreen'
import ForgotPasswordScreen from '../../screens/ForgotPasswordScreen'
import LoginScreen from '../../screens/LoginScreen'
import TermAndServiceScreen from '../../screens/TermAndServiceScreen'
import PrivacyPolicyScreen from '../../screens/PrivacyPolicyScreen'
import RefundPolicy from '../../screens/RefundPolicy'
import ShoppingCartIcon1 from '../../common/ShoppingCartIcon1'
import SearchFilterClass from '../../common/SearchFilterClass'
import NewestScreen from '../../navigation/Stacks/Newest'
import MenuIcon from '../../common/MenuIcon'
import SearchFilterZone from '../../common/SearchFilterZone'
import PassChangeScreen from '../../screens/PassChangeScreen'
/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator({
  SettingsScreen: {
    screen: SettingsScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: true,
      headerRight: <ShoppingCartIcon1 navigation={navigation} />,
      headerLeft: () => <MenuIcon navigation={navigation} />
    })
  },
  PassChangeScreen: {
    screen: PassChangeScreen,
    navigationOptions: () => ({
      gestureEnabled: false
    })
  },
  SearchFilterZone: {
    screen: SearchFilterZone,
    navigationOptions: () => ({
      gestureEnabled: false,
      headerRight: null
    })
  },
  NewsDetails: {
    screen: NewsDetails,
    navigationOptions: () => ({
      gestureEnabled: false
    })
  },
  newsList: {
    screen: newsList,
    navigationOptions: () => ({
      gestureEnabled: false
    })
  },
  ProductDetails: {
    screen: ProductDetails,
    navigationOptions: () => ({
      gestureEnabled: true
    })
  },
  SearchFilterClass: {
    screen: SearchFilterClass,
    navigationOptions: () => ({
      gestureEnabled: false,
      headerRight: null
    })
  },
  RatingAndReviewScreen: {
    screen: RatingAndReviewScreen,
    navigationOptions: () => ({
      gestureEnabled: true
    })
  },
  CurrencyScreen: {
    screen: CurrencyScreen,
    navigationOptions: () => ({
      gestureEnabled: true
    })
  },
  LanguageScreen: {
    screen: LanguageScreen,
    navigationOptions: () => ({
      gestureEnabled: true
    })
  },
  MyFavorites: {
    screen: MyFavorites,
    navigationOptions: () => ({
      gestureEnabled: true
    })
  },
  MyAccountScreen: {
    screen: MyAccountScreen,
    navigationOptions: () => ({
      gestureEnabled: true
    })
  },
  AdressesScreen: {
    screen: AdressesScreen,
    navigationOptions: () => ({
      gestureEnabled: true
    })
  },
  AddressEdit: {
    screen: AddressEdit,
    navigationOptions: () => ({
      gestureEnabled: false
    })
  },
  MyOrdersScreen: {
    screen: MyOrdersScreen,
    navigationOptions: () => ({
      gestureEnabled: true
    })
  },
  OrderDetail: {
    screen: OrderDetail,
    navigationOptions: () => ({
      gestureEnabled: true
    })
  },
  DownloadsScreen: {
    screen: DownloadsScreen,
    navigationOptions: () => ({
      gestureEnabled: true
    })
  },
  RewardPoints: {
    screen: RewardPoints,
    navigationOptions: () => ({
      gestureEnabled: true
    })
  },
  ContactUsScreen: {
    screen: ContactUsScreen,
    navigationOptions: () => ({
      gestureEnabled: true
    })
  },
  AboutScreen: {
    screen: AboutScreen,
    navigationOptions: () => ({
      gestureEnabled: true
    })
  },
  NewsScreen: {
    screen: NewsScreen,
    navigationOptions: () => ({
      gestureEnabled: true
    })
  },
  IntroScreen: {
    screen: IntroScreen,
    navigationOptions: () => ({
      gestureEnabled: true
    })
  },
  NewestScreen: {
    screen: NewestScreen,
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
  }
})

export default HomeStackNavigator
