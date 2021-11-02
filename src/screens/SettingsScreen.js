import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Linking,
  Switch,
  Dimensions,
  Platform
} from 'react-native'
import BottomNav from '../common/BottomNav'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { NavigationEvents } from 'react-navigation'
import themeStyle from '../common/Theme.style'
import RateUsButton from './RateUs'
import { Icon } from 'native-base'
import { GoogleSignin } from '@react-native-community/google-signin'
import FontIcon from 'react-native-vector-icons/FontAwesome'
import WooComFetch, { postHttp, getUrl, getHttp } from '../common/WooComFetch'
import ImageLoad from '../common/RnImagePlaceH'
import { connect } from 'react-redux'
import RNRestart from 'react-native-restart'
import SyncStorage from 'sync-storage'
import ShoppingCartIcon from '../common/ShoppingCartIcon'
import Spinner from 'react-native-loading-spinner-overlay'
import { ScrollView } from 'react-native-gesture-handler'
import {
  LoginManager,
  AccessToken,
  GraphRequestManager,
  GraphRequest
} from 'react-native-fbsdk'
const WIDTH = Dimensions.get('window').width
class CreateAccount extends Component {
  /// /////////////////////////////////////////////////////////
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    return {
      headerTitle: headerStyle,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerRight: () => <ShoppingCartIcon navigation={navigation} />,
      headerTitleAlign: 'center',
      headerTintColor: themeStyle.headerTintColor,
      headerStyle: {
        backgroundColor: themeStyle.primary
      },
      headerTitleStyle: {
        fontWeight: Platform.OS === 'android' ? 'bold' : 'normal'
      },
      headerForceInset: { top: 'never', vertical: 'never' },
      gestureEnabled: true
    }
  }

  /// /////////////////////////////////////////////////////////

  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson.Settings
    })
  }

  /// //////////////////////////////////////////////////////////
  constructor (props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
      errorMessage: '',
      spinnerTemp: false,
      switch1Value: false,
      switch2Value: false
    }
  }

  /// ////////////////////////////////////////////////////
  toggleSwitch1 = value => {
    if (value) {
      SyncStorage.set('backgroundColor', '#fdfdfd')
      SyncStorage.set('textColor', '#393e46')
      SyncStorage.set('textContrast', '#000000')
    } else {
      SyncStorage.set('backgroundColor', '#222831')
      SyncStorage.set('textColor', '#ececec')
      SyncStorage.set('textContrast', '#222831')
    }
    setTimeout(() => {
      RNRestart.Restart()
    }, 200)
    this.setState({})
  }
  /// /////////////////////////////////////////

signOut = async () => {
  try {
    await GoogleSignin.revokeAccess()
    await GoogleSignin.signOut()
    // setUserInfo(null); // Remember to remove the user from your app's state as well
  } catch (error) {
    console.log(error)
  }
};

/// ////////////////////////////////////////////
categoryFun (text, iconName, nav) {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: 8,
          paddingBottom: 0,
          paddingTop: 0
        }}>
        {nav === 'rate1' ? (
          <RateUsButton
            text={text}
            iconName={iconName}
            appleId={this.props.isLoading.Config.packgeName}
          />
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: themeStyle.backgroundColor
            }}
            onPress={() => {
              text ===
                this.props.isLoading.Config.languageJson['Official Website']
                ? Linking.openURL(nav)
                : this.props.navigation.push(nav)
            }}>
            <View style={styles.tabComponents}>
              <Text style={{
                fontSize: themeStyle.mediumSize,
                color: themeStyle.textColor
              }}>{text}</Text>
              {text ===
                this.props.isLoading.Config.languageJson2[
                  'Dark Mode'
                ] ? (
                  <View style={{ marginLeft: 60, position: 'absolute', right: 0 }}>
                    <Switch
                      thumbColor={themeStyle.primary}
                      style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }] }}
                      onValueChange={() => this.toggleSwitch1(false)}
                      value={this.state.switch1Value}
                    />
                  </View>
                ) : text ===
                  this.props.isLoading.Config.languageJson2[
                    'Light Mode'
                  ] ? (
                    <View style={{ marginLeft: 60, position: 'absolute', right: 0 }}>
                      <Switch
                        thumbColor={themeStyle.primary}
                        style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }] }}
                        onValueChange={() => this.toggleSwitch1(true)}
                        value={this.state.switch2Value}
                      />
                    </View>
                  ) : (
                    text === this.props.isLoading.Config.languageJson['Change Password']
                      ? <FontIcon
                        name={'lock'}
                        style={{ color: '#4d4d4d', fontSize: 20 }}
                      />
                      : <Icon
                        name={iconName}
                        style={{ color: '#4d4d4d', fontSize: 20 }}
                      />
                  )}
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View
        style={{
          marginLeft: 16,
          marginRight: 16,
          width: '96%',
          height: 1,
          backgroundColor: '#4d4d4d'
        }}
      />
    </View>
  )
}

/// ///////////////////////////////////////
logOut () {
  let currentAccessToken = ''
  AccessToken.getCurrentAccessToken()
    .then(data => {
      currentAccessToken = data.accessToken.toString()
    })
    .then(() => {
      const logout = new GraphRequest(
        'me/permissions/',
        {
          accessToken: currentAccessToken,
          httpMethod: 'DELETE'
        },
        error => {
          if (error) {
          } else {
            LoginManager.logOut()
          }
        }
      )
      new GraphRequestManager().addRequest(logout).start()
    })
    .catch(() => {
    })
  this.signOut()
  this.setState({ spinnerTemp: true })
  /// ///////////////////////////////
  SyncStorage.set('customerData', '')
  SyncStorage.set('gustLogin', false)

  this.props.isLoading.cartItems.wishListProducts = []
  SyncStorage.set('wishListProducts', [])
  SyncStorage.set('recentViewedProducts', [])
  SyncStorage.set('cartProducts', [])

  this.props.getAllCategories(this.props)
  this.props.getBannersData()
  this.props.getFlashData(this.props)
  this.props.getTopSeller(this.props)
  this.props.getSpecialData(this.props)
  this.props.getMostLikedData(this.props, this)

  this.props.getProductData(this.props, this)
}

/// /////////////////////////////////////////////
render () {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeStyle.backgroundColor,
        paddingBottom: SyncStorage.get('bottom') ? 50 : 0
      }}>
      {SyncStorage.get('bottom') ? (
        <BottomNav
          active={4}
          home={
            this.props.isLoading.Config.homePage === 1
              ? 'Home1Screen'
              : this.props.isLoading.Config.homePage === 2
                ? 'Home2Screen'
                : this.props.isLoading.Config.homePage === 3
                  ? 'Home3Screen'
                  : this.props.isLoading.Config.homePage === 4
                    ? 'Home4Screen'
                    : this.props.isLoading.Config.homePage === 5
                      ? 'Home5Screen'
                      : this.props.isLoading.Config.homePage === 6
                        ? 'Home6Screen'
                        : this.props.isLoading.Config.homePage === 7
                          ? 'Home7Screen'
                          : this.props.isLoading.Config.homePage === 8
                            ? 'Home8Screen'
                            : this.props.isLoading.Config.homePage === 9
                              ? 'Home9Screen'
                              : 'Home10Screen'
          }></BottomNav>
      ) : null}

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            backgroundColor: themeStyle.backgroundColor,

            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          <Spinner
            visible={this.state.spinnerTemp}
            textStyle={styles.spinnerTextStyle}
          />
          <NavigationEvents
            onDidFocus={() => {
              this.setState({})
            }}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: themeStyle.primary,
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
            <TouchableOpacity
              onPress={() => {
                SyncStorage.set('cartScreen', 0)
                if (
                  SyncStorage.get('customerData') !== '' &&
                  !SyncStorage.get('gustLogin')) {} else {
                  this.props.navigation.navigate('LoginScreen', {
                    updateCart: () => this.setState({})
                  })
                }
              }}>
              <ImageBackground
                style={{
                  height: 230,
                  width: WIDTH,
                  backgroundColor: 'transparent'
                }}
                source={require('../images/icons_stripe.png')}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    height: 230,
                    width: WIDTH,
                    alignContent: 'center',
                    opacity: 0.85,
                    backgroundColor: themeStyle.primaryDark,
                    zIndex: 9,
                    position: 'absolute'
                  }}
                />
                <View style={styles.textImageContainer}>
                  {SyncStorage.get('gustLogin') ||
                    SyncStorage.get('customerData').avatar === undefined ||
                    SyncStorage.get('customerData').avatar === null ? (
                      <ImageLoad
                        key={0}
                        style={{ width: 60, height: 60 }}
                        loadingStyle={{
                          size: 'large',
                          color: themeStyle.loadingIndicatorColor
                        }}
                        placeholder={false}
                        ActivityIndicator={true}
                        placeholderStyle={{ width: 0, height: 0 }}
                        source={require('../images/userImage.png')}
                        borderRadius={60 / 2}
                      />
                    ) : (
                      <ImageLoad
                        key={0}
                        style={{ width: 60, height: 60 }}
                        loadingStyle={{
                          size: 'large',
                          color: themeStyle.loadingIndicatorColor
                        }}
                        placeholderSource={require('../images/placeholder.png')}
                        placeholderStyle={{ width: 60, height: 60 }}
                        source={{
                          uri: themeStyle.url + '/' + SyncStorage.get('customerData').avatar
                        }}
                        borderRadius={60 / 2}
                      />
                    )}
                  <View>
                    {SyncStorage.get('gustLogin') ||
                      SyncStorage.get('customerData') === '' ? (
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'center'
                          }}>
                          <Text style={{
                            fontSize: themeStyle.largeSize + 2,
                            fontWeight: '600',
                            color: themeStyle.primaryContrast,
                            paddingTop: 8
                          }}>
                            {
                              this.props.isLoading.Config.languageJson[
                                'Login & Register'
                              ]
                            }{' '}
                          </Text>
                          <Text style={{
                            fontSize: themeStyle.mediumSize + 1,
                            color: themeStyle.primaryContrast,
                            fontWeight: '400',
                            paddingTop: 3,
                            paddingBottom: 3
                          }}>
                            {
                              this.props.isLoading.Config.languageJson[
                                'Please login or create an account for free'
                              ]
                            }
                          </Text>

                          {SyncStorage.get('gustLogin') ||
                          SyncStorage.get('customerData') === '' ? null : (
                              <TouchableOpacity
                                onPress={() =>
                                  this.props.navigation.navigate(
                                    'CreateAccountScreen'
                                  )
                                }>
                                <View
                                  style={{
                                    alignItems: 'center',
                                    height: 32,
                                    width: 80,
                                    backgroundColor: themeStyle.backgroundColor,
                                    justifyContent: 'center'
                                  }}>
                                  <Text
                                    style={{
                                      textAlign: 'center',
                                      fontSize: themeStyle.mediumSize,
                                      color: themeStyle.textColor,
                                      fontWeight: '500'
                                    }}>
                                    {
                                      this.props.isLoading.Config.languageJson[
                                        'Edit Profile'
                                      ]
                                    }
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            )}
                        </View>
                      ) : (
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'center'
                          }}>
                          <Text style={{
                            fontSize: themeStyle.largeSize + 2,
                            fontWeight: '600',
                            color: themeStyle.primaryContrast,
                            paddingTop: 8
                          }}>
                            {`${SyncStorage.get('customerData').first_name} ${
                              SyncStorage.get('customerData').last_name
                            }`}{' '}
                          </Text>
                          <Text style={{
                            fontSize: themeStyle.mediumSize + 1,
                            color: themeStyle.primaryContrast,
                            fontWeight: '400',
                            paddingTop: 3,
                            paddingBottom: 3
                          }}>
                            {SyncStorage.get('customerData').email}
                          </Text>
                          {SyncStorage.get('customerData') === '' ? null : (
                            <TouchableOpacity
                              style={{ paddingTop: 5 }}
                              onPress={() =>
                                this.props.navigation.navigate(
                                  'MyAccountScreen'
                                )
                              }>
                              <View
                                style={{
                                  alignItems: 'center',
                                  height: 32,
                                  backgroundColor: themeStyle.backgroundColor,
                                  justifyContent: 'center',
                                  padding: 5
                                }}>
                                <Text
                                  style={{
                                    textAlign: 'center',
                                    fontSize: 13,
                                    color: themeStyle.primaryDark
                                  }}>
                                  {
                                    this.props.isLoading.Config.languageJson[
                                      'Edit Profile'
                                    ]
                                  }
                                </Text>
                              </View>
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>

          <View height={7} />

          <View height={7} />

          <View>

            <View
              style={{
                marginLeft: 16,
                marginRight: 16,
                width: '96%',
                height: 1,
                backgroundColor: '#4d4d4d'
              }}
            />
          </View>

          {!this.props.isLoading.Config.multiLanguage
            ? this.categoryFun(SyncStorage.get('backgroundColor') === '#fdfdfd'
              ? this.props.isLoading.Config.languageJson2[
                'Dark Mode'
              ] : this.props.isLoading.Config.languageJson2[
                'Light Mode'
              ],
            'globe',
            'LanguageScreen'
            )
            : null}

          {!this.props.isLoading.Config.multiLanguage
            ? this.categoryFun(
              this.props.isLoading.Config.languageJson['Select Language'],
              'globe',
              'LanguageScreen'
            )
            : null}
          {!this.props.isLoading.Config.multiCurrency
            ? this.categoryFun(
              this.props.isLoading.Config.languageJson2['Select Currency'],
              'logo-usd',
              'CurrencyScreen'
            )
            : null}
          {this.props.isLoading.Config.wishListPage
            ? this.categoryFun(
              this.props.isLoading.Config.languageJson['My Wish List'],
              'heart',
              'MyFavorites'
            )
            : null}
          {this.props.isLoading.Config.editProfilePage &&
            SyncStorage.get('customerData') !== '' &&
            !SyncStorage.get('gustLogin')
            ? this.categoryFun(
              this.props.isLoading.Config.languageJson['Edit Profile'],
              'lock',
              'MyAccountScreen'
            )
            : null}
          {
            SyncStorage.get('customerData') !== '' &&
            !SyncStorage.get('gustLogin')
              ? this.categoryFun(
                this.props.isLoading.Config.languageJson.Address,
                'locate',
                'AdressesScreen'
              )
              : null}

          {this.props.isLoading.Config.myOrdersPage &&
            SyncStorage.get('customerData') !== '' &&
            !SyncStorage.get('gustLogin')
            ? this.categoryFun(
              this.props.isLoading.Config.languageJson['My Orders'],
              'cart',
              'MyOrdersScreen'
            )
            : null}
          {this.props.isLoading.Config.myOrdersPage &&
            SyncStorage.get('customerData') !== '' &&
            !SyncStorage.get('gustLogin')
            ? this.categoryFun(
              this.props.isLoading.Config.languageJson['Change Password'],
              'password',
              'PassChangeScreen'
            )
            : null}
          {this.props.isLoading.Config.contactUsPage
            ? this.categoryFun(
              this.props.isLoading.Config.languageJson['Contact Us'],
              'contacts',
              'ContactUsScreen'
            )
            : null}
          {this.props.isLoading.Config.aboutUsPage
            ? this.categoryFun(
              this.props.isLoading.Config.languageJson['About Us'],
              'alert',
              'AboutScreen'
            )
            : null}
          {this.props.isLoading.Config.newsPage
            ? this.categoryFun(
              this.props.isLoading.Config.languageJson.News,
              'paper',
              'NewsScreen'
            )
            : null}
          {this.props.isLoading.Config.introPage
            ? this.categoryFun(
              this.props.isLoading.Config.languageJson.Intro,
              'reorder',
              'IntroScreen'
            )
            : null}

          <View height={7} />

        </View>

      </ScrollView>
      {SyncStorage.get('gustLogin') ||
            SyncStorage.get('customerData') === '' ? null : (
          <TouchableOpacity
            style={{
              paddingTop: 5,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={() => this.logOut()}>
            <View
              style={{
                alignItems: 'center',
                width: WIDTH,
                backgroundColor: themeStyle.primary,
                justifyContent: 'center'
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 13,
                  color: themeStyle.primaryContrast,
                  padding: 12
                }}>
                {this.props.isLoading.Config.languageJson['Log Out']}
              </Text>
            </View>
          </TouchableOpacity>
        )}
    </View>
  )
}
}

const mapStateToProps = state => ({
  isLoading: state
})
const mapDispatchToProps = dispatch => ({
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
      props.isLoading.Config.productsArguments.currency
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
          payload: json.data.data
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
        props.isLoading.Config.productsArguments.currency
      )
      formData.append('type', 'flashsale')
      const json = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData
      )
      dispatch({
        type: 'ADD_FLASH_PRODUCTS',
        payload1: json.product_data
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
        props.isLoading.Config.productsArguments.currency
      )
      formData.append('type', 'top seller')
      const json = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData
      )
      dispatch({
        type: 'ADD_TOP_SELLER_PRODUCTS',
        payload10: json.product_data
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
        props.isLoading.Config.productsArguments.currency
      )
      formData.append('type', 'special')
      const json = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData
      )
      dispatch({
        type: 'ADD_SPECIAL_PRODUCTS',
        payload2: json.product_data
      })
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
        props2.isLoading.Config.productsArguments.currency
      )
      formData.append('type', 'most liked')
      const json = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData
      )
      dispatch({
        type: 'ADD_MOST_LIKED_PRODUCTS',
        payload3: json.product_data
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
        t.props.isLoading.Config.productsArguments.currency
      )
      formData.append('categories_id', 0)
      const json = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData
      )
      dispatch({
        type: 'ADD_Products',
        payload6: json.product_data
      })
      t.setState({ spinnerTemp: false })
    })
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount)

const styles = StyleSheet.create({
  textImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    width: WIDTH,
    zIndex: 9,
    position: 'absolute',
    flex: 1,
    padding: 15,
    marginTop: SyncStorage.get('customerData') === '' ? 75 : 50
  },
  tabComponents: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    paddingLeft: 13
  }
})
