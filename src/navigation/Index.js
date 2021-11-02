import React from 'react'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer'
import { Dimensions, I18nManager } from 'react-native'
import MenuDrawer from './MenuDrawer'
import HOME from './Stacks/HomeTemp'
import CATEGORY from './Stacks/CategoryTemp'
import HOME1 from './Stacks/Home1'
import HOME2 from './Stacks/Home2'
import HOME3 from './Stacks/Home3'
import HOME4 from './Stacks/Home4'
import HOME5 from './Stacks/Home5'
import HOME6 from './Stacks/Home6'
import HOME7 from './Stacks/Home7'
import HOME8 from './Stacks/Home8'
import HOME9 from './Stacks/Home9'
import HOME10 from './Stacks/Home10'

import CATEGORY1 from './Stacks/Category1'
import CATEGORY2 from './Stacks/Category2'
import CATEGORY3 from './Stacks/Category3'
import CATEGORY4 from './Stacks/Category4'
import CATEGORY5 from './Stacks/Category5'
import CATEGORY6 from './Stacks/Category6'

import MOSTLIKED from './Stacks/Newest'
import DEALS from './Stacks/Newest'
import NEWEST from './Stacks/Newest'
import TOPSELLER from './Stacks/Newest'
import EDITPROFILE from './Stacks/MyAccount'
import MYORDERS from './Stacks/MyOrders'
import MYFAVORITES from './Stacks/MyFavorites'

import INTRO from './Stacks/Intro'
import NEWS from './Stacks/News'
import CONTACTUS from './Stacks/ContactUs'
import ABOUT from './Stacks/About'
import SETTINGS from './Stacks/Settings'
import LOGIN from './Stacks/Login'
import Search from './Stacks/Search'
import Cart from './Stacks/Cart'
import Currency from './Stacks/Currency'
import Language from './Stacks/Language'
import ADDRESSES from './Stacks/Adresses'
import DOWNLOADS from './Stacks/Downloads'
import RewardPoints from './Stacks/RewardPoints'
const WIDTH = Dimensions.get('window').width
const DrawerConfigs = {
  drawerType: 'front',
  drawerWidth: WIDTH * 0.78,
  headerMode: 'none',
  drawerPosition: I18nManager.isRTL ? 'right' : 'left',
  contentComponent: ({ navigation }) => <MenuDrawer navigation={navigation} />
}
const AppDrawer = createDrawerNavigator(
  {
    HOME,
    HOME1,
    HOME2,
    HOME3,
    HOME4,
    HOME5,
    HOME6,
    HOME7,
    HOME8,
    HOME9,
    HOME10,

    CATEGORY,
    CATEGORY1,
    CATEGORY2,
    CATEGORY3,
    CATEGORY4,
    CATEGORY5,
    CATEGORY6,

    NEWEST,
    DEALS,
    TOPSELLER,
    MOSTLIKED,

    ADDRESSES,
    DOWNLOADS,

    EDITPROFILE,
    MYORDERS,
    MYFAVORITES,
    INTRO,
    NEWS,
    CONTACTUS,
    ABOUT,
    SETTINGS,
    LOGIN,

    Search,
    Cart,
    Currency,
    Language,
    RewardPoints
  },
  DrawerConfigs
)
export default createAppContainer(
  createSwitchNavigator({
    AuthLoading: INTRO,
    App: AppDrawer
  })
)
