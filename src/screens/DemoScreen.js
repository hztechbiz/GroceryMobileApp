import React, { PureComponent } from 'react'
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  I18nManager,
  Image,
  ScrollView,
  Platform
} from 'react-native'
import { UIActivityIndicator } from 'react-native-indicators'
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay'
import { CardStyleInterpolators } from 'react-navigation-stack'
import themeStyle from '../common/Theme.style'
import SyncStorage from 'sync-storage'
import RNRestart from 'react-native-restart'
import Ionicons from 'react-native-vector-icons/FontAwesome'
import { getHttp, getUrl } from '../common/WooComFetch'
import Image2 from 'react-native-scalable-image'
import { NavigationEvents } from 'react-navigation'
import { ListItem, CheckBox, Body } from 'native-base'
const WIDTH = Dimensions.get('window').width
const colors = [
  {
    primary: '#ec3f34',
    primary2: 'rgb(236, 63, 52',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#d0372e',
    primaryTint: '#ee5248'
  },
  {
    primary: '#44b3ff',
    primary2: 'rgb(68, 179, 255',
    primaryContrast: '#000000',
    primaryContrast2: 'rgb(0, 0, 0)',
    primaryShade: '#3c9ee0',
    primaryTint: '#57bbff'
  },
  {
    primary: '#fcad8e',
    primary2: 'rgb(252, 173, 142',
    primaryContrast: '#000000',
    primaryContrast2: 'rgb(0, 0, 0)',
    primaryShade: '#de987d',
    primaryTint: '#fcb599'
  },
  {
    primary: '#ff8ea6',
    primary2: 'rgb(255, 142, 166',
    primaryContrast: '#000000',
    primaryContrast2: 'rgb(0, 0, 0)',
    primaryShade: '#e07d92',
    primaryTint: '#ff99af'
  },
  {
    primary: '#9546fe',
    primary2: 'rgb(149, 70, 254)',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#833ee0',
    primaryTint: '#a059fe'
  },
  {
    primary: '#a6633c',
    primary2: 'rgb(166, 99, 60)',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#925735',
    primaryTint: '#af7350'
  },
  {
    primary: '#3ca68d',
    primary2: 'rgb(60, 166, 141)',
    primaryContrast: '#000000',
    primaryContrast2: 'rgb(0, 0, 0)',
    primaryShade: '#35927c',
    primaryTint: '#50af98'
  },
  {
    primary: '#3c51a6',
    primary2: 'rgb(60, 81, 166)',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#354792',
    primaryTint: '#5062af'
  },
  {
    primary: '#726dff',
    primary2: 'rgb(114, 109, 255)',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#6460e0',
    primaryTint: '#807cff'
  },
  {
    primary: '#bf04a0',
    primary2: 'rgb(191, 4, 160)',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#a8048d',
    primaryTint: '#c51daa'
  },
  {
    primary: '#9437ff',
    primary2: 'rgb(148, 55, 255)',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#8230e0',
    primaryTint: '#9f4bff'
  },
  {
    primary: '#76d6ff',
    primary2: 'rgb(118, 214, 255)',
    primaryContrast: '#000000',
    primaryContrast2: 'rgb(0, 0, 0)',
    primaryShade: '#68bce0',
    primaryTint: '#84daff'
  },
  {
    primary: '#ff6d6d',
    primary2: 'rgb(255, 109, 109)',
    primaryContrast: '#000000',
    primaryContrast2: 'rgb(0, 0, 0)',
    primaryShade: '#e06060',
    primaryTint: '#ff7c7c'
  },
  {
    primary: '#b3182a',
    primary2: 'rgb(179, 24, 42)',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#9e1525',
    primaryTint: '#bb2f3f'
  },
  {
    primary: '#3980ff',
    primary2: 'rgb(81, 104, 143)',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#0055cb',
    primaryTint: '#7dafff'
  },
  {
    primary: '#483a6f',
    primary2: 'rgb(72, 58, 111)',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#3f3362',
    primaryTint: '#5a4e7d'
  },
  {
    primary: '#621529',
    primary2: 'rgb(98, 21, 41)',
    primaryContrast: '#ffffff',
    primaryContrast2: 'rgb(255, 255, 255)',
    primaryShade: '#561224',
    primaryTint: '#722c3e'
  }
]
class RewardPoints extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    return {
      headerTitle: headerStyle,
      headerRight: null,
      gestureEnabled: false,
      drawerLockMode: 'locked-closed',
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerTitleAlign: 'center',
      headerTintColor: themeStyle.headerTintColor,
      headerStyle: {
        backgroundColor: themeStyle.primary
      },
      headerTitleStyle: {
        fontWeight: Platform.OS === 'android' ? 'bold' : 'normal'
      },
      headerForceInset: { top: 'never', vertical: 'never' }
    }
  }

  getListOfLanguage = async () => {
    const json = await getHttp(getUrl() + '/api/' + 'getlanguages', {})
    for (const val of json.data.languages) {
      if (val.languages_id === SyncStorage.get('langId')) {
        this.state.tick[val.languages_id] = true
      }
    }
    this.setState({
      languages: json.data.languages,
      isLoading: false,
      tick: this.state.tick
    })
  }

  async componentDidMount () {
    this.getListOfLanguage()
    this.getListOfCurrency()
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson.Settings
    })
  }

  constructor (props) {
    super(props)
    this.state = {
      languages: '',
      selectedLanguage: '',
      translate: '',
      prviousLanguageId: 0,
      temp: 0,
      tick: [],
      isLoading: true,
      SpinnerTemp: false,

      currency: {},
      currencyList: [],
      currentCurrencySymbol: SyncStorage.get('currencyCode'),
      temp2: 0,
      tick2: [],
      isLoading2: true,
      bannerStyle: 1
    }
    this.state.tick[SyncStorage.get('langId')] = true
  }

  getListOfCurrency = async () => {
    const responseJson = await getHttp(getUrl() + '/api/' + 'getcurrencies', {})
    for (const val of responseJson.data.data) {
      if (val.code === SyncStorage.get('currencyCode')) {
        this.state.tick2[val.id] = true
      }
    }
    this.state.currencyList = responseJson.data.data
    this.setState({ isLoading2: false })
  }

  /// //////////////////////////////////////////
  updateCurrency (item) {
    if (this.state.currentCurrencySymbol !== item.code) {
      SyncStorage.set('currencyObject', item)
      if (item.symbol_left !== '') {
        SyncStorage.set('currencyPos', 'left')
        SyncStorage.set('currency', item.symbol_left)
      } else {
        SyncStorage.set('currencyPos', 'right')
        SyncStorage.set('currency', item.symbol_right)
      }
      SyncStorage.set('currencyCode', item.code)
      SyncStorage.set('wishListProducts', [])
      SyncStorage.set('recentViewedProducts', [])
      SyncStorage.set('cartProducts', [])
      this.state.tick2 = []
      this.state.tick2[item.id] = true
      this.setState({ temp2: 0 })
      setTimeout(() => {
        RNRestart.Restart()
      }, 200)
    }
  }

  updateLanguage (item) {
    if (
      item !== undefined &&
      this.state.prviousLanguageId !== item.languages_id
    ) {
      SyncStorage.set('langId', item.languages_id)
      SyncStorage.set('languageCode', item.code)
      SyncStorage.set('wishListProducts', [])
      SyncStorage.set('recentViewedProducts', [])
      SyncStorage.set('cartProducts', [])
      this.state.tick = []
      this.state.tick[item.languages_id] = true

      if (item.code === 'ar') {
        I18nManager.forceRTL(true)
      } else {
        I18nManager.forceRTL(false)
      }
      this.setState({ temp: 0 })
      this.props.getTranslationData(item.languages_id, this)
    } else {
      this.setState({ SpinnerTemp: false })
    }
  }

  toggleSwitch1 = value => {
    if (value) {
      SyncStorage.set('bottom', false)
    } else {
      SyncStorage.set('bottom', true)
    }
    setTimeout(() => {
      RNRestart.Restart()
    }, 200)
    this.setState({})
  }

  toggleSwitch2 = value => {
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

  headerFun (text) {
    return (
      <View
        style={{
          width: WIDTH,
          backgroundColor: 'gray',
          marginTop: 15,
          marginBottom: 15
        }}>
        <Text
          style={{
            color: themeStyle.headerTintColor,
            padding: 10,
            fontSize: themeStyle.largeSize + 3
          }}>
          {text}
        </Text>
      </View>
    )
  }

  bannerFun (id, src) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.changeBanners(id, this)
          this.props.navigation.pop()
        }}
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: this.props.isLoading.Config.banner_style === id ? 0.5 : 1
        }}>
        <Image
          key={0}
          style={{ width: WIDTH * 0.8, height: 200 }}
          loadingStyle={{
            size: 'large',
            color: themeStyle.loadingIndicatorColor
          }}
          resizeMode={'cover'}
          placeholder={false}
          ActivityIndicator={true}
          placeholderStyle={{ width: 0, height: 0 }}
          source={src}
        />
      </TouchableOpacity>
    )
  }

  homeFun2 (id, src) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.changeHome(id, this)
          this.props.navigation.pop()
        }}
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: this.props.isLoading.Config.homePage === id ? 0.5 : 1,
          marginTop: 28
        }}>
        <Image
          key={0}
          style={{ width: WIDTH * 0.8, height: 400 }}
          loadingStyle={{
            size: 'large',
            color: themeStyle.loadingIndicatorColor
          }}
          resizeMode={'contain'}
          placeholder={false}
          ActivityIndicator={true}
          placeholderStyle={{ width: 0, height: 0 }}
          source={src}
        />
      </TouchableOpacity>
    )
  }

  categoryFun (id, src) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.changeCategory(id, this)
          this.props.navigation.pop()
        }}
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: this.props.isLoading.Config.categoryPage === id ? 0.5 : 1,
          marginTop: 28
        }}>
        <Image
          key={0}
          style={{ width: WIDTH * 0.8, height: 400 }}
          loadingStyle={{
            size: 'large',
            color: themeStyle.loadingIndicatorColor
          }}
          resizeMode={'contain'}
          placeholder={false}
          ActivityIndicator={true}
          placeholderStyle={{ width: 0, height: 0 }}
          source={src}
        />
      </TouchableOpacity>
    )
  }

  cardStyleFun (id, src) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.changeCardS(id, this)
          this.props.navigation.pop()
        }}
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: this.props.isLoading.Config.card_style === id ? 0.5 : 1,
          marginTop: 5,
          marginBottom: 5
        }}>
        <Image2
          resizeMode={'contain'}
          width={Dimensions.get('window').width * 0.48}
          source={src}
        />
      </TouchableOpacity>
    )
  }

  themeChangeFun (item) {
    themeStyle.StatusBarColor = '#000'
    themeStyle.barStyle = 'light-content' // dark-content, default

    themeStyle.headerTintColor = item.primaryContrast
    themeStyle.headerIconsColor = item.primaryContrast

    themeStyle.primaryDark = item.primaryShade
    themeStyle.primary = item.primary
    themeStyle.primaryContrast = item.primaryContrast
    // Button Colors
    themeStyle.addToCartBtnColor = item.primary
    themeStyle.addToCartBtnTextColor = item.primaryContrast
    themeStyle.addToCartBagBtnColor = item.primary

    themeStyle.outOfStockBtnColor = '#D81800'
    themeStyle.outOfStockBtnTextColor = item.primaryContrast

    themeStyle.detailsBtnColor = item.primary
    themeStyle.detailsBtnTextColor = item.primaryContrast
    themeStyle.removeBtnColor = '#D81800'
    themeStyle.removeBtnTextColor = item.primaryContrast
    themeStyle.wishHeartBtnColor = item.primary
    themeStyle.otherBtnsColor = item.primary
    themeStyle.otherBtnsText = item.primaryContrast

    themeStyle.saleBackgroundColor = item.primary
    themeStyle.saleTextColor = item.primaryContrast
    themeStyle.featuredBackgroundColor = item.primary
    themeStyle.featuredTextColor = item.primaryContrast
    themeStyle.newBackgroundColor = '#D81800'
    themeStyle.newTextColor = item.primaryContrast

    themeStyle.priceColor = item.primaryContrast

    themeStyle.loadingIndicatorColor = item.primary
    this.setState({}, () => this.props.navigation.pop())
  }

  render () {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: themeStyle.backgroundColor }}>
        <NavigationEvents
          onDidFocus={() => {
            this.setState({})
          }}
        />
        <Spinner visible={this.state.SpinnerTemp} />
        {this.headerFun(
          this.props.isLoading.Config.languageJson2['Change App Theme']
        )}

        <FlatList
          horizontal={false}
          showsVerticalScrollIndicator={false}
          listKey={(item, index) => `C${index.toString()}`}
          contentContainerStyle={{
            backgroundColor: '#c1c1c1',
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            alignContent: 'center',
            flexGrow: 1,
            padding: 8
          }}
          data={colors}
          numColumns={6}
          style={{
            paddingLeft: 0
          }}
          extraData={this.state}
          keyExtractor={(item, index) => index}
          renderItem={item => (
            <TouchableOpacity
              onPress={() => this.themeChangeFun(item.item)}
              style={{
                backgroundColor: item.item.primary,
                height: 50,
                width: 50,
                margin: 10,
                marginLeft: 5,
                marginRight: 5,
                marginBottom: 5,
                marginTop: 5,
                borderWidth: 4,
                borderColor:
                  item.item.primary === themeStyle.primary
                    ? themeStyle.backgroundColor
                    : 'transparent'
              }}></TouchableOpacity>
          )}></FlatList>
        {this.headerFun(
          this.props.isLoading.Config.languageJson2['Chose Color Mode']
        )}
        <View
          style={{
            flexDirection: 'row',
            width: WIDTH,
            justifyContent: 'space-evenly',
            alignItems: 'center'
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              backgroundColor: '#c1c1c1',
              borderRadius: 12,
              padding: 3
            }}>
            <TouchableOpacity
              onPress={() => this.toggleSwitch2(false)}
              style={{
                width: WIDTH * 0.45,
                backgroundColor:
                  themeStyle.backgroundColor ===
                  '#222831'
                    ? '#222831'
                    : '#c1c1c1',
                height: 135,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                shadowOffset: {
                  width:
                    themeStyle.backgroundColor !==
                    '#222831'
                      ? 0
                      : 1,
                  height: !SyncStorage.get('bottom') ? 0 : 1
                },
                shadowColor: '#c1c1c1',
                shadowOpacity:
                  themeStyle.backgroundColor !==
                  '#222831'
                    ? 0
                    : 0.5,
                elevation:
                  themeStyle.backgroundColor !==
                  '#222831'
                    ? 0
                    : 3
              }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons
                  style={{
                    color: themeStyle.textColor,
                    fontSize: 34,
                    marginBottom: 2
                  }}
                  active
                  name='paint-brush'
                />
                <Text
                  style={{
                    color: themeStyle.textColor,
                    fontWeight: 'bold',
                    fontSize: themeStyle.largeSize
                  }}>
                  {this.props.isLoading.Config.languageJson2['Dark Mode']}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toggleSwitch2(true)}
              style={{
                width: WIDTH * 0.45,
                backgroundColor:
                  themeStyle.backgroundColor ===
                  '#fdfdfd'
                    ? '#fdfdfd'
                    : '#c1c1c1',
                height: 135,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                shadowOffset: {
                  width:
                    themeStyle.backgroundColor !==
                    '#fdfdfd'
                      ? 0
                      : 1,
                  height:
                    themeStyle.backgroundColor !== '#000000' ? 0 : 1
                },
                shadowColor: '#c1c1c1',
                shadowOpacity:
                  themeStyle.backgroundColor !==
                  '#fdfdfd'
                    ? 0
                    : 0.5,
                elevation:
                  themeStyle.backgroundColor !==
                  '#fdfdfd'
                    ? 0
                    : 3
              }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons
                  style={{
                    color: themeStyle.textColor,
                    fontSize: 34,
                    marginBottom: 2
                  }}
                  active
                  name='paint-brush'
                />
                <Text
                  style={{
                    color: themeStyle.textColor,
                    fontWeight: 'bold',
                    fontSize: themeStyle.largeSize
                  }}>
                  {this.props.isLoading.Config.languageJson2['Light Mode']}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {this.headerFun(this.props.isLoading.Config.languageJson2.Navigation)}
        <View
          style={{
            flexDirection: 'row',
            width: WIDTH,
            justifyContent: 'space-evenly',
            alignItems: 'center'
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              backgroundColor: '#c1c1c1',
              borderRadius: 12,
              padding: 3
            }}>
            <TouchableOpacity
              onPress={() => this.toggleSwitch1(false)}
              style={{
                width: WIDTH * 0.45,
                backgroundColor: SyncStorage.get('bottom')
                  ? themeStyle.backgroundColor
                  : '#c1c1c1',
                height: 135,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                shadowOffset: {
                  width: !SyncStorage.get('bottom') ? 0 : 1,
                  height: !SyncStorage.get('bottom') ? 0 : 1
                },
                shadowColor: '#c1c1c1',
                shadowOpacity: !SyncStorage.get('bottom') ? 0 : 0.5,
                elevation: !SyncStorage.get('bottom') ? 0 : 3
              }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons
                  style={{
                    color: themeStyle.textColor,
                    fontSize: 34,
                    marginBottom: 2
                  }}
                  active
                  name='location-arrow'
                />
                <Text
                  style={{
                    color: themeStyle.textColor,
                    fontWeight: 'bold',
                    fontSize: themeStyle.largeSize
                  }}>
                  {
                    this.props.isLoading.Config.languageJson2[
                      'Bottom Navigation'
                    ]
                  }
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toggleSwitch1(true)}
              style={{
                width: WIDTH * 0.45,
                backgroundColor: !SyncStorage.get('bottom')
                  ? themeStyle.backgroundColor
                  : '#c1c1c1',
                height: 135,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                shadowOffset: {
                  width: SyncStorage.get('bottom') ? 0 : 1,
                  height: SyncStorage.get('bottom') ? 0 : 1
                },
                shadowColor: '#c1c1c1',
                shadowOpacity: SyncStorage.get('bottom') ? 0 : 0.5,
                elevation: SyncStorage.get('bottom') ? 0 : 3
              }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons
                  style={{
                    color: themeStyle.textColor,
                    fontSize: 34,
                    marginBottom: 2
                  }}
                  active
                  name='location-arrow'
                />
                <Text
                  style={{
                    color: themeStyle.textColor,
                    fontWeight: 'bold',
                    fontSize: themeStyle.largeSize
                  }}>
                  {this.props.isLoading.Config.languageJson2['Left Navigation']}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {this.headerFun(
          this.props.isLoading.Config.languageJson2['Multi Language']
        )}

        {this.state.isLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: themeStyle.backgroundColor
            }}>
            <UIActivityIndicator
              size={27}
              color={themeStyle.loadingIndicatorColor}
            />
          </View>
        ) : (
          <FlatList
            style={{ backgroundColor: themeStyle.backgroundColor }}
            data={this.state.languages}
            horizontal={false}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            renderItem={item => (
              <View
                style={{ marginRight: '4%', marginBottom: 1, marginTop: -10 }}>
                <ListItem>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ SpinnerTemp: true }, () =>
                        this.updateLanguage(item.item)
                      )
                    }}
                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      key={0}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        marginRight: 10,
                        marginLeft: 10
                      }}
                      loadingStyle={{
                        size: 'large',
                        color: themeStyle.loadingIndicatorColor
                      }}
                      resizeMode={'cover'}
                      placeholder={false}
                      ActivityIndicator={true}
                      placeholderStyle={{ width: 0, height: 0 }}
                      source={{ uri: themeStyle.url + '/' + item.item.image }}
                    />
                    <Body>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: themeStyle.largeSize,
                          color: themeStyle.textColor,
                          marginRight: 10,
                          marginLeft: 10
                        }}>
                        {item.item.name}
                      </Text>
                    </Body>
                    <CheckBox
                      color={themeStyle.textColor}
                      onPress={() => {
                        this.setState({ SpinnerTemp: true }, () =>
                          this.updateLanguage(item.item)
                        )
                      }}
                      checked={!!this.state.tick[item.item.languages_id]}
                    />
                  </TouchableOpacity>
                </ListItem>
              </View>
            )}
          />
        )}
        {this.headerFun(
          this.props.isLoading.Config.languageJson2['Multi Currency']
        )}
        {this.state.isLoading2 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: themeStyle.backgroundColor
            }}>
            <UIActivityIndicator
              size={27}
              color={themeStyle.loadingIndicatorColor}
            />
          </View>
        ) : (
          <FlatList
            data={this.state.currencyList}
            horizontal={false}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            renderItem={item => (
              <View
                style={{ marginRight: '4%', marginBottom: 1, marginTop: -10 }}>
                <ListItem>
                  <TouchableOpacity
                    onPress={() => this.updateCurrency(item.item)}
                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Body>
                      {item.item.symbol_left !== '' &&
                      item.item.symbol_left !== null &&
                      item.item.symbol_left !== undefined ? (
                          <Text
                            style={{
                              fontWeight: 'bold',
                              fontSize: themeStyle.largeSize,
                              color: themeStyle.textColor,
                              marginRight: 10,
                              marginLeft: 10
                            }}>
                            {item.item.title + '(' + item.item.symbol_left + ')'}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontWeight: 'bold',
                              fontSize: themeStyle.largeSize,
                              color: themeStyle.textColor,
                              marginRight: 10,
                              marginLeft: 10
                            }}>
                            {item.item.title + '(' + item.item.symbol_right + ')'}
                          </Text>
                        )}
                    </Body>
                    <CheckBox
                      onPress={() => this.updateCurrency(item.item)}
                      color={themeStyle.textColor}
                      checked={
                        !!(
                          this.state.tick2[item.item.id] ||
                          SyncStorage.get('currency') === item.item.symbol
                        )
                      }
                    />
                  </TouchableOpacity>
                </ListItem>
              </View>
            )}
          />
        )}
        {this.headerFun(
          this.props.isLoading.Config.languageJson2['Banner Style']
        )}

        {this.bannerFun(1, require('../images/banners/1.png'))}
        {this.bannerFun(2, require('../images/banners/2.png'))}
        {this.bannerFun(3, require('../images/banners/3.png'))}
        {this.bannerFun(4, require('../images/banners/4.png'))}
        {this.bannerFun(5, require('../images/banners/5.png'))}

        {this.headerFun(
          this.props.isLoading.Config.languageJson2['Product Card Styles']
        )}
        <FlatList
          horizontal={false}
          showsVerticalScrollIndicator={false}
          listKey={(item, index) => `C${index.toString()}`}
          contentContainerStyle={{
            backgroundColor: themeStyle.backgroundColor,
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            alignContent: 'center',
            flexGrow: 1
          }}
          data={[
            require('../images/cardStyles/rcard1.png'),
            require('../images/cardStyles/rcard2.png'),
            require('../images/cardStyles/rcard3.png'),
            require('../images/cardStyles/rcard4.png'),
            require('../images/cardStyles/rcard5.png'),
            require('../images/cardStyles/rcard6.png'),
            require('../images/cardStyles/rcard7.png'),
            require('../images/cardStyles/rcard8.png'),
            require('../images/cardStyles/rcard9.png'),
            require('../images/cardStyles/rcard10.png'),
            require('../images/cardStyles/rcard11.png'),
            require('../images/cardStyles/rcard12.png'),
            require('../images/cardStyles/rcard13.png'),
            require('../images/cardStyles/rcard14.png'),
            require('../images/cardStyles/rcard15.png'),
            require('../images/cardStyles/rcard16.png'),
            require('../images/cardStyles/rcard17.png'),
            require('../images/cardStyles/rcard18.png'),
            require('../images/cardStyles/rcard19.png'),
            require('../images/cardStyles/rcard20.png'),
            require('../images/cardStyles/rcard21.png'),
            require('../images/cardStyles/rcard22.png')
          ]}
          numColumns={2}
          style={{
            paddingLeft: 0
          }}
          extraData={this.state}
          keyExtractor={(item, index) => index}
          renderItem={item =>
            this.cardStyleFun(item.index + 1, item.item)
          }></FlatList>

        {this.headerFun(
          this.props.isLoading.Config.languageJson2['Home Style']
        )}

        {this.homeFun2(1, require('../images/home_style/hs1.png'))}
        {this.homeFun2(2, require('../images/home_style/hs2.png'))}
        {this.homeFun2(3, require('../images/home_style/hs3.png'))}
        {this.homeFun2(4, require('../images/home_style/hs4.png'))}
        {this.homeFun2(5, require('../images/home_style/hs5.png'))}
        {this.homeFun2(6, require('../images/home_style/hs6.png'))}
        {this.homeFun2(7, require('../images/home_style/hs7.png'))}
        {this.homeFun2(8, require('../images/home_style/hs8.png'))}
        {this.homeFun2(9, require('../images/home_style/hs9.png'))}
        {this.homeFun2(10, require('../images/home_style/hs10.png'))}

        {this.headerFun(
          this.props.isLoading.Config.languageJson2['Category Style']
        )}

        {this.categoryFun(1, require('../images/category_style/cat1.png'))}
        {this.categoryFun(2, require('../images/category_style/cat2.png'))}
        {this.categoryFun(3, require('../images/category_style/cat3.png'))}
        {this.categoryFun(4, require('../images/category_style/cat4.png'))}
        {this.categoryFun(5, require('../images/category_style/cat5.png'))}
        {this.categoryFun(6, require('../images/category_style/cat6.png'))}
      </ScrollView>
    )
  }
}
/// ///////////////////////////////////////
const mapDispatchToProps = dispatch => ({
  getTranslationData: (id, t) => {
    dispatch(async dispatch => {
      const json = await getHttp(
        getUrl() + '/api/' + 'applabels3?lang=' + id,
        {}
      )
      t.setState({ SpinnerTemp: false })
      dispatch({
        type: 'languageSettings',
        payload: json.data
      })
      RNRestart.Restart()
    })
  },
  changeBanners: (id, t) => {
    dispatch(async dispatch => {
      dispatch({
        type: 'bannerChange',
        payload: id
      })
    })
  },
  changeHome: (id, t) => {
    dispatch(async dispatch => {
      dispatch({
        type: 'HOME_CHANGE',
        payload: id
      })
    })
  },
  changeCategory: (id, t) => {
    dispatch(async dispatch => {
      dispatch({
        type: 'Category_CHANGE',
        payload: id
      })
    })
  },
  changeCardS: (id, t) => {
    dispatch(async dispatch => {
      dispatch({
        type: 'CARD_CHNAGE',
        payload: id
      })
    })
  }
})
const mapStateToProps = state => ({
  isLoading: state
})

export default connect(mapStateToProps, mapDispatchToProps)(RewardPoints)
