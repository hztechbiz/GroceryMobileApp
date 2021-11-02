import React, { Component } from 'react'
import AppContainer from './src/navigation/Index'
import DeviceInfo from 'react-native-device-info'
import SplashScreen from 'react-native-splash-screen'
import Spinner from 'react-native-loading-spinner-overlay'
import { getUrl, getHttp, postHttp } from './src/common/WooComFetch'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import SyncStorage from 'sync-storage'
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
  YellowBox
} from 'react-native'
import theme from './src/common/Theme.style'
const Height = Dimensions.get('window').height
const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar backgroundColor={backgroundColor} {...props} />
  </View>
)
class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      listTotal: 0,
      isLoading: true,
      data: '',
      SpinnerTemp: false
    }
    const deviceId = DeviceInfo.getDeviceId()
    if (deviceId !== undefined && deviceId != 'unknown') {
      theme.deviceId = deviceId
    }
    DeviceInfo.getIpAddress().then(ip => {
      if (ip !== undefined) {
        theme.ipAdress = ip
      }
    })
  }

  async componentDidMount () {
    console.disableYellowBox = true
    YellowBox.ignoreWarnings(['Animated:', 'FlatList:'])
    console.reportErrorsAsExceptions = false
    const data = await SyncStorage.init()

    if (this.props.cartItems2.Config.appInProduction) {
      theme.bottomNavigation = SyncStorage.get('bottom') !== undefined
        ? SyncStorage.get('bottom') : false

      theme.backgroundColor = SyncStorage.get('backgroundColor') !== undefined
        ? SyncStorage.get('backgroundColor') : '#fdfdfd'

      theme.textContrast = SyncStorage.get('textContrast') !== undefined
        ? SyncStorage.get('textContrast') : '#000000'

      theme.textColor = SyncStorage.get('textColor') !== undefined
        ? SyncStorage.get('textColor') : '#000000'
    } else {
      SyncStorage.set('bottom', theme.bottomNavigation) /// / for bottom navigation
      //SyncStorage.set('backgroundColor', theme.backgroundColor) /// / for bottom navigation
      // SyncStorage.set('textColor', theme.textColor)
      theme.textColor = SyncStorage.get('textColor') !== undefined
      ? SyncStorage.get('textColor') : '#000000'
      theme.backgroundColor = SyncStorage.get('backgroundColor') !== undefined
      ? SyncStorage.get('backgroundColor') : '#fdfdfd'
      // SyncStorage.set('textContrast', theme.textContrast)
      theme.textContrast = SyncStorage.get('textContrast') !== undefined
      ? SyncStorage.get('textContrast') : '#000000'
    }
    if (
      SyncStorage.get('languageJson') === undefined ||
      SyncStorage.get('languageJson') === '' ||
      SyncStorage.get('languageJson') === null
    ) {
      await this.props.getTranslationData()
    }
    this.props.saveDefaultCurrency()
    const val = SyncStorage.getAllKeys().includes('appSettings')
    if (val === false) {
      this.props.siteSetting2(this.props, this)
    } else {
      this.props.cartItems2.Config.productsArguments.currency = SyncStorage.get('currencyCode')
      this.props.siteSetting()
    }
    this.props.languageJson2()
    this.props.getAllCategories(this.props)
    this.getRecentProducts()
    this.props.saveLocalDataIntoArrays()
    this.props.getBannersData()
    this.props.getFlashData(this.props)
    this.props.getTopSeller(this.props)
    this.props.getSpecialData(this.props)
    this.props.getMostLikedData(this.props, this)
    this.props.getProductData(this.props, this)
    this.props.aboutUsPageGetIds(this.props)
    this.setState({ isLoading: false })
  }

  getRecentProducts = async () => {
    const data = {}
    if (SyncStorage.get('customerData').customers_id != null) { data.customers_id = SyncStorage.get('customerData').customers_id }
    data.language_id =
          SyncStorage.get('langId') === undefined
            ? '1'
            : SyncStorage.get('langId')
    data.currency_code = theme.defaultCurrencyCode
    const arr = []

    SyncStorage.get('recentViewedProducts').forEach(products_id => {
      arr.push(products_id)
    })
    data.multiple_products_id = arr
    this.props.recentViewedProducts = []
    this.props.deleteAllRecentProducts()
    const json = await postHttp(getUrl() + '/api/' + 'getallproducts', data)

    json.product_data.forEach(element => {
      this.props.addRecentItems(element)
    })
  }

  checkingNewSettingsFromServer = async props => {
    const settings = await getHttp(getUrl() + '/api/' + 'sitesetting', {})
    if (settings.data.success === '1') {
      if (
        JSON.stringify(props.cartItems2.Config.appSettings) !==
        JSON.stringify(settings.data.data)
      ) { SyncStorage.set('appSettings', JSON.stringify(settings.data.data)) }
    }
  }

  componentWillUnmount () {
    this.props.cartItems2.sharedData.deepTemp = false
  }

  componentDidUpdate () {
    if (this.state.isLoading === false) { SplashScreen.hide() }
  }

  render () {
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={this.state.SpinnerTemp} />
        <MyStatusBar
          backgroundColor={theme.StatusBarColor}
          barStyle={theme.barStyle}
        />
        {this.state.isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center' }}></View>
        ) : (
          <AppContainer />
        )}
      </View>
    )
  }
}
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? Height * 0.04 : 0

const mapDispatchToProps = dispatch => ({
  addRecentItems: productObject => {
    dispatch({
      type: 'ADD_RECENT',
      product: productObject
    })
  },
  deleteAllRecentProducts: () => {
    dispatch({
      type: 'CLEAR_RECENT_PRODUCT'
    })
  },
  aboutUsPageGetIds: props => {
    dispatch(async dispatch => {
      const formData = new FormData()
      formData.append(
        'language_id',
        SyncStorage.get('langId') === undefined
          ? '1'
          : SyncStorage.get('langId')
      )
      formData.append(
        'currency_code',
        props.cartItems2.Config.productsArguments.currency
      )
      const json = await postHttp(getUrl() + '/api/' + 'getallpages', formData)
      if (json.success === '1') {
        const d = json.pages_data
        for (const value of d) {
          if (String(value.slug).toLowerCase() === 'privacy-policy') {
            props.cartItems2.Config.privacyPolicy = value.description
          }
          if (String(value.slug).toLowerCase() === 'term-services') {
            props.cartItems2.Config.termServices = value.description
          }
          if (String(value.slug).toLowerCase() === 'refund-policy') {
            props.cartItems2.Config.refundPolicy = value.description
          }
          if (String(value.slug).toLowerCase() === 'about-us') {
            props.cartItems2.Config.aboutUs = value.description
          }
        }
      }
    })
  },
  languageJson2: () => {
    dispatch({
      type: 'languageJson2'
    })
  },
  siteSetting: () => {
    dispatch({
      type: 'siteSetting'
    })
  },
  siteSetting2: (props, th) => {
    th.setState({ SpinnerTemp: true }, () => {
      dispatch(async dispatch => {
        const settings = await getHttp(getUrl() + '/api/' + 'sitesetting', {})
        th.setState({ SpinnerTemp: false })
        if (settings.data.success == 1) {
          dispatch({
            type: 'siteSetting2',
            payload: settings.data.data
          })
        }
      })
    })
  },
  wishlistData: (props, th) => {
    th.setState({ SpinnerTemp: true }, () => {
      dispatch(async dispatch => {
        var dat = {}
        if (SyncStorage.get('customerData').customers_id !== null) { dat.customers_id = SyncStorage.get('customerData').customers_id }
        dat.page_number = 0
        dat.type = 'wishlist'
        dat.language_id =
          SyncStorage.get('langId') === undefined
            ? '1'
            : SyncStorage.get('langId')
        dat.currency_code = theme.defaultCurrencyCode
        const json = await postHttp(getUrl() + '/api/' + 'getallproducts', dat)
        th.setState({ SpinnerTemp: false })
        if (json.success === '1') {
          var prod = json.product_data.length === 0 ? undefined : json.product_data
          dispatch({
            type: 'ADD_WISHLIST_PRODUCTS',
            product: prod
          })
        }
      })
    })
  },
  saveDefaultCurrency: () => {
    dispatch({
      type: 'saveDefaultCurrency'
    })
  },
  saveLocalDataIntoArrays: () => {
    dispatch({
      type: 'SAVE_LOCAL_DATA_INTO_ARRAYS'
    })
  },
  getAllCategories: props => {
    const formData = new FormData()
    formData.append(
      'customers_id',
      SyncStorage.get('customerData').customers_id !== null &&
        SyncStorage.get('customerData').customers_id !== undefined
        ? SyncStorage.get('customerData').customers_id
        : null
    )
    formData.append('page_number', 0)
    formData.append(
      'language_id',
      SyncStorage.get('langId') === undefined ? '1' : SyncStorage.get('langId')
    )
    formData.append(
      'currency_code',
      props.cartItems2.Config.productsArguments.currency
    )
    dispatch({
      type: 'GET_ALL_CATEGORIES',
      payload: formData
    })
  },

  getBannersData: () => {
    dispatch(async dispatch => {
      const formData = new FormData()
      formData.append(
        'customers_id',
        SyncStorage.get('customerData').customers_id !== null &&
          SyncStorage.get('customerData').customers_id !== undefined
          ? SyncStorage.get('customerData').customers_id
          : null
      )
      formData.append(
        'language_id',
        SyncStorage.get('langId') === undefined
          ? '1'
          : SyncStorage.get('langId')
      )
      var dat = {}

      dat.languages_id = '1'
      const json = await getHttp(
        getUrl() + '/api/' + 'getbanners?languages_id=1',
        {}
      )
      if (json.data.success === '1') {
        dispatch({
          type: 'ADD_BANNERS',
          payload: json.data.data.length === 0 ? undefined : json.data.data
        })
      } else {
        dispatch({
          type: 'ADD_BANNERS',
          payload: undefined
        })
      }
    })
  },
  getFlashData: props => {
    dispatch(async dispatch => {
      const formData = new FormData()
      formData.append(
        'customers_id',
        SyncStorage.get('customerData').customers_id !== null &&
          SyncStorage.get('customerData').customers_id !== undefined
          ? SyncStorage.get('customerData').customers_id
          : null
      )
      formData.append('page_number', 0)
      formData.append(
        'language_id',
        SyncStorage.get('langId') === undefined
          ? '1'
          : SyncStorage.get('langId')
      )
      formData.append(
        'currency_code',
        props.cartItems2.Config.productsArguments.currency
      )
      formData.append('type', 'flashsale')
      const json = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData
      )
      dispatch({
        type: 'ADD_FLASH_PRODUCTS',
        payload1: json.product_data.length === 0 ? undefined : json.product_data
      })
    })
  },
  getTopSeller: props => {
    dispatch(async dispatch => {
      const formData = new FormData()
      formData.append(
        'customers_id',
        SyncStorage.get('customerData').customers_id !== null &&
          SyncStorage.get('customerData').customers_id !== undefined
          ? SyncStorage.get('customerData').customers_id
          : null
      )
      formData.append('page_number', 0)
      formData.append(
        'language_id',
        SyncStorage.get('langId') === undefined
          ? '1'
          : SyncStorage.get('langId')
      )
      formData.append(
        'currency_code',
        props.cartItems2.Config.productsArguments.currency
      )
      formData.append('type', 'top seller')
      const json = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData
      )
      dispatch({
        type: 'ADD_TOP_SELLER_PRODUCTS',
        payload10: json.product_data.length === 0 ? undefined : json.product_data
      })
    })
  },
  getSpecialData: props => {
    dispatch(async dispatch => {
      const formData = new FormData()
      formData.append(
        'customers_id',
        SyncStorage.get('customerData').customers_id !== null &&
          SyncStorage.get('customerData').customers_id !== undefined
          ? SyncStorage.get('customerData').customers_id
          : null
      )
      formData.append('page_number', 0)
      formData.append(
        'language_id',
        SyncStorage.get('langId') === undefined
          ? '1'
          : SyncStorage.get('langId')
      )
      formData.append(
        'currency_code',
        props.cartItems2.Config.productsArguments.currency
      )
      formData.append('type', 'special')
      const json = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData
      )
      dispatch({
        type: 'ADD_SPECIAL_PRODUCTS',
        payload2: json.product_data.length === 0 ? undefined : json.product_data
      })
    })
  },
  getTranslationData: () => {
    dispatch(async dispatch => {
      const json = await getHttp(getUrl() + '/api/' + 'applabels3?lang=1', {})
      dispatch({
        type: 'languageSettings',
        payload: json.data
      })
      // }
    })
  },
  getMostLikedData: (props2, props) => {
    dispatch(async dispatch => {
      const formData = new FormData()
      formData.append(
        'customers_id',
        SyncStorage.get('customerData').customers_id !== null &&
          SyncStorage.get('customerData').customers_id !== undefined
          ? SyncStorage.get('customerData').customers_id
          : null
      )
      formData.append('page_number', 0)
      formData.append(
        'language_id',
        SyncStorage.get('langId') === undefined
          ? '1'
          : SyncStorage.get('langId')
      )
      formData.append(
        'currency_code',
        props2.cartItems2.Config.productsArguments.currency
      )
      formData.append('type', 'most liked')
      const json = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData
      )
      props.checkingNewSettingsFromServer(props.props)
      dispatch({
        type: 'ADD_MOST_LIKED_PRODUCTS',
        payload3: json.product_data.length === 0 ? undefined : json.product_data
      })
    })
  },
  getProductData: (r, t) => {
    dispatch(async dispatch => {
      const formData = new FormData()
      formData.append(
        'customers_id',
        SyncStorage.get('customerData').customers_id !== null &&
          SyncStorage.get('customerData').customers_id !== undefined
          ? SyncStorage.get('customerData').customers_id
          : null
      )
      formData.append('page_number', 0)
      formData.append(
        'language_id',
        SyncStorage.get('langId') === undefined
          ? '1'
          : SyncStorage.get('langId')
      )
      formData.append(
        'currency_code',
        t.props.cartItems2.Config.productsArguments.currency
      )
      formData.append('categories_id', 0)
      const json = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData
      )
      dispatch({
        type: 'ADD_Products',
        payload6: json.product_data.length === 0 ? undefined : json.product_data
      })
    })
  }
})
const getRecent = (state) => JSON.parse(JSON.stringify(state.cartItems.recentViewedProducts))
// const getRecent = (state) =>  JSON.stringify(state.cartItems.recentViewedProducts)
const getRecentProducts = createSelector(
  [getRecent],
  (getRecent) => {
    return getRecent
  }
)
/// ///////////////////////////////////////////////
const mapStateToProps = state => ({
  cartItems2: state,
  recentViewedProducts: getRecentProducts(state)
})
/// //////////////////////////////////////////
export default connect(mapStateToProps, mapDispatchToProps)(App)

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT
  }
})
