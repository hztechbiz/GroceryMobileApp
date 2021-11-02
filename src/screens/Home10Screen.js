import React, { PureComponent } from 'react'
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  I18nManager,
  Linking
} from 'react-native'
import { UIActivityIndicator } from 'react-native-indicators'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { NavigationEvents } from 'react-navigation'
import Spinner from 'react-native-loading-spinner-overlay'
import { connect } from 'react-redux'
import CardTem from '../common/CardTemplate'
import { Icon } from 'native-base'
import BottomNav from '../common/BottomNav'
import SyncStorage from 'sync-storage'
import Loader from 'react-native-easy-content-loader'
import FlatListView from '../common/FlatListView'
import CategoryFlatList from '../common/CategoriesFlatList'
import Banner from '../common/Banner'
import ShoppingCartIcon from '../common/ShoppingCartIcon'
import MenuIcon from '../common/MenuIcon'
import { postHttp, getUrl } from '../common/WooComFetch'
import themeStyle from '../common/Theme.style'
const WIDTH = Dimensions.get('window').width
class Newest extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: () => <MenuIcon navigation={navigation} />,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    headerTitle: themeStyle.homeTitle,
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
  })

  static getDerivedStateFromProps (props) {
    return {
      length:
        props.cartItems2.cartItems.recentViewedProducts.length !== undefined
          ? props.cartItems2.cartItems.recentViewedProducts.length
          : 0,
      noDataFound: !(props.cartItems2.sharedData.products !== undefined &&
          props.cartItems2.sharedData.products !== null)
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      page: 2,
      products:
        this.props.cartItems2.sharedData.tab2 !== undefined &&
        this.props.cartItems2.sharedData.tab2 !== null
          ? this.props.cartItems2.sharedData.tab2
          : [],
      selected: '',
      refreshing: false,
      fabB: false,
      timeValue: 400,
      length: this.props.cartItems2.cartItems.recentViewedProducts.length,
      selectedTab: '',
      type: '',
      tempBox: [],
      loading: false,
      activityIndicatorTemp: true,
      temp: 1,
      SpinnerTemp: false,
      noDataFound: !(this.props.cartItems2.sharedData.products !== undefined &&
      this.props.cartItems2.sharedData.products !== null)
    }
  }

  getOneProduct = async value => {
    const formData = new FormData()
    formData.append('language_id', '1')
    formData.append('products_id', value)
    formData.append('currency_code', '1')
    formData.append(
      'currency_code',
      this.props.cartItems2.Config.productsArguments.currency
    )
    const json = await postHttp(getUrl() + '/api/' + 'getallproducts', formData)
    this.setState({ SpinnerTemp: false }, () => {
      this.navigate(json.product_data[0])
    })
  }

  handleOpenURL = event => {
    // D
    if (event.url !== '' && event.url !== undefined && event.url !== null) {
      const route = event.url.replace(/.*?:\/\//g, '')
      const id = route.match(/\/([^/]+)\/?$/)[1]
      if (id !== '' && id !== undefined && id !== null) {
        this.setState({ SpinnerTemp: true }, () => {
          this.getOneProduct(id)
        })
      }
    }
  }

  navigate = json => {
    // E
    if (json !== '' && json !== undefined && json !== null) {
      Linking.removeEventListener('url', this.handleOpenURL)
      this.props.navigation.navigate('ProductDetails', { objectArray: json })
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({ activityIndicatorTemp: false })
    }, 1000)
    this.props.navigation.setParams({
      headerTitle: this.props.cartItems2.Config.languageJson.Home
    })
    if (!this.props.cartItems2.sharedData.deepTemp) {
      this.props.cartItems2.sharedData.deepTemp = true
      if (Platform.OS === 'android') {
        const NativeLinking = require('react-native/Libraries/Linking/NativeLinking')
          .default
        NativeLinking.getInitialURL().then(url => {
          if (url !== '' && url !== undefined && url !== null) {
            const route = url.replace(/.*?:\/\//g, '')
            const id = route.match(/\/([^/]+)\/?$/)[1]
            if (id !== '' && id !== undefined && id !== null) {
              this.setState({ SpinnerTemp: true }, () => {
                this.getOneProduct(id)
              })
            }
          }
        })
      } else {
        Linking.addEventListener('url', this.handleOpenURL)
      }
    }
  }

  componentWillUnmount () {
    clearInterval(this.state.activityIndicatorTemp)
    Linking.removeEventListener('url', this.handleOpenURL)
  }

  getProducts = arr => {
    if (arr.length !== 0) {
      for (const value of arr) {
        this.state.products.push(value)
      }
    }
    this.setState({ refreshing: false })
  }

  // changing tab
  changeTab (c) {
    this.state.page = 1
    if (c === '') {
      this.state.selected = c
      this.state.selectedTab = c
      this.setState(
        {
          products: this.props.cartItems2.sharedData.tab2,
          tempBox: [],
          fabB: false,
          refreshing: false
        },
        () => {
        }
      )
    } else {
      this.state.selected = 'a'
      this.state.selectedTab = 'a'
      this.setState(
        {
          products: this.props.cartItems2.sharedData.tab3,
          tempBox: [],
          fabB: false,
          refreshing: false
        },
        () => {
        }
      )
    }
  }

  renderItem = (item, index) => (
    this.state.noDataFound ? (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center'
        }}>
        <Text>
          {this.props.cartItems2.Config.languageJson['No Products Found'] + ''}
        </Text>
      </View>
    ) : (
      <View>
        <Loader
          secondaryColor='rgba(208, 205, 205, 1)'
          primaryColor='rgba(218, 215, 215, 1)'
          animationDuration={this.state.timeValue}
          active
          loading={this.state.loading}
          containerStyles={{
            backgroundColor: themeStyle.backgroundColor,
            height: this.props.cartItems2.Config.cartButton
              ? Platform.OS === 'android'
                ? 260
                : 230
              : Platform.OS === 'android'
                ? 240
                : 210,
            width: WIDTH * themeStyle.twoRowCardWIdth,
            shadowOffset: { width: 1, height: 1 },
            shadowColor: '#000',
            shadowOpacity: 0.5,
            elevation: 3,
            margin: 5
          }}
          pRows={this.props.cartItems2.Config.cartButton ? 3 : 2}
          pWidth={['100%', '100%', '80%']}
          pHeight={30}
          titleStyles={{
            height: 110,
            width: WIDTH * themeStyle.twoRowCardWIdth,
            alignSelf: 'center',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 0,
            borderWidth: 0,
            flex: 1
          }}
          paragraphStyles={{
            paddingTop: 7,
            padding: 6,
            flex: 1,
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center'
          }}>
          <CardTem
            objectArray={item.item}
            rows={this.props.vertical}
            recent={this.state.recent}
            width={WIDTH * themeStyle.twoRowCardWIdth}
          />
        </Loader>
      </View>
    )
  )

  categoryFun (text, iconName, sort) {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor:
            this.props.cartItems2.Config.card_style === 11 ||
            this.props.cartItems2.Config.card_style === 12 ||
            this.props.cartItems2.Config.card_style === 15
              ? themeStyle.backgroundColor
              : themeStyle.backgroundColor,
          marginLeft: 10,
          justifyContent: 'space-between',
          padding: 3,
          paddingBottom: 1
        }}>
        <View
          style={{
            flexDirection: 'row'
          }}>
          <Icon
            name={iconName}
            style={{
              fontSize: 14,
              paddingTop: 10,
              padding: 10,
              paddingLeft: 0,
              color: themeStyle.primary,
              paddingBottom: 4
            }}
          />
          <Text
            style={{
              fontSize: themeStyle.smallSize - 1,
              fontWeight: '400',
              padding: 10,
              paddingTop: Platform.OS === 'android' ? 8 : 10,
              paddingLeft: 0,
              paddingRight: 5,
              paddingBottom: 2,
              color: themeStyle.primary
            }}>
            {text}{' '}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row'
          }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              margin: 5,
              marginRight: 3,
              marginTop: 6,
              alignItems: 'center'
            }}
            onPress={() =>
              sort === 'shop'
                ? this.props.navigation.navigate('Categories')
                : this.props.navigation.navigate('NewestScreen', {
                  id: this.props.parentId,
                  name: '',
                  sortOrder: sort
                })
            }>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row'
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: themeStyle.addToCartBtnColor,
                  fontSize: themeStyle.smallSize - 2
                }}>
                {this.props.cartItems2.Config.languageJson['Shop More']}
              </Text>
              <Icon
                name={
                  !I18nManager.isRTL
                    ? 'md-arrow-dropright'
                    : 'md-arrow-dropleft'
                }
                style={{
                  color: themeStyle.addToCartBtnColor,
                  fontSize: 16,
                  paddingTop: 2,
                  paddingLeft: !I18nManager.isRTL ? 8 : 8,
                  paddingRight: I18nManager.isRTL ? 8 : 8
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render () {
    if (
      this.props.cartItems2.sharedData.tab2 !== undefined &&
      this.props.cartItems2.sharedData.tab2 !== null &&
      this.props.cartItems2.sharedData.tab2 !== [] &&
      this.props.cartItems2.sharedData.tab2 !== '' &&
      this.state.temp === 1
    ) {
      if (this.props.cartItems2.sharedData.tab2.length > 0) {
        this.state.products = this.props.cartItems2.sharedData.tab2
        this.state.temp = 0
      }
    }

    if (this.state.products.length > 0) {
      this.state.loading = false
      this.state.timeValue = 400
    } else {
      this.state.loading = true
      this.state.timeValue = 400
      this.state.refreshing = false
    }
    return this.state.activityIndicatorTemp ? (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: themeStyle.backgroundColor
        }}>
        <UIActivityIndicator
          size={27}
          color={themeStyle.loadingIndicatorColor}
        />
      </View>
    ) : (
      <View
        style={{
          backgroundColor:
            this.props.cartItems2.Config.card_style === 11 ||
            this.props.cartItems2.Config.card_style === 12 ||
            this.props.cartItems2.Config.card_style === 15
              ? themeStyle.backgroundColor
              : themeStyle.backgroundColor,
          flex: 1,
          paddingBottom: SyncStorage.get('bottom') ? 50 : 0
        }}>
        <Spinner visible={this.state.SpinnerTemp} />

        {SyncStorage.get('bottom') ? <BottomNav active={0}></BottomNav> : null}
        {this.props.cartItems2.Config.appInProduction ? (
          <TouchableOpacity
            style={{
              zIndex: 5,
              position: 'absolute',
              left: 20,
              bottom: 55,
              alignItems: 'center',
              height: 55,
              width: 55,
              borderRadius: 55 / 2,
              alignSelf: 'center',
              justifyContent: 'center',
              backgroundColor: themeStyle.primary,
              elevation: 10
            }}
            onPress={() => {
              this.props.navigation.navigate('DemoScreen')
            }}>

            <Icon
              name={'md-settings'}
              style={{
                color: themeStyle.primaryContrast,
                paddingTop: Platform.OS === 'ios' ? 2 : 0,
                fontSize: 22
              }}
            />

          </TouchableOpacity>
        ) : null}
        <NavigationEvents
          onDidFocus={() => {
            this.props.navigation.setParams({
              headerRight: () => <ShoppingCartIcon navigation={this.props.navigation} />
            })
            this.setState({
              products:
                this.props.cartItems2.sharedData.tab2 !== undefined &&
                this.props.cartItems2.sharedData.tab2 !== null
                  ? this.props.cartItems2.sharedData.tab2
                  : []
            })
          }}
        />
        {this.state.fabB ? (
          <TouchableOpacity
            style={{
              zIndex: 5,
              position: 'absolute',
              right: 0,
              bottom: 0,
              marginRight: 25,
              marginBottom: 50
            }}
            onPress={() => {
              this.flatListRef.scrollToOffset({
                animated: true,
                offset: 0,
                useNativeDriver: true
              }, {
                useNativeDriver: true
              })
              this.setState({ fabB: false })
            }}>
            <View
              style={{
                alignItems: 'center',
                height: 48,
                width: 48,
                borderRadius: 400,
                alignSelf: 'center',
                justifyContent: 'center',
                backgroundColor: themeStyle.primary
              }}>
              <Icon
                name={'md-arrow-up'}
                style={{
                  color: themeStyle.primaryContrast,
                  paddingTop: Platform.OS === 'ios' ? 2 : 0,
                  fontSize: 22
                }}
              />
            </View>
          </TouchableOpacity>
        ) : null}

        <FlatList
          showsVerticalScrollIndicator={false}
          showsVerticalScrollIndicator={false}

          windowSize={50}
          initialNumToRender={6}
          removeClippedSubviews={true}
          legacyImplementation={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={10}

          data={
            this.state.products !== undefined &&
            this.state.products !== null &&
            this.state.products.length > 0
              ? this.state.products
              : this.state.noDataFound
                ? ['']
                : ['', '', '', '', '', '', '', '', '', '']
          }
          key={this.state.productView}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          ref={ref => {
            this.flatListRef = ref
          }}
          columnWrapperStyle={{
            padding: 2,
            paddingLeft:
              WIDTH >= 375
                ? WIDTH * 0.009
                : WIDTH >= 360 && WIDTH <= 75
                  ? WIDTH * 0.008
                  : WIDTH * 0.007,
            paddingBottom: 0,
            marginBottom: 0,
            paddingTop: 0,
            marginTop: 0
          }}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            backgroundColor:
              this.props.cartItems2.Config.card_style === 11 ||
              this.props.cartItems2.Config.card_style === 12 ||
              this.props.cartItems2.Config.card_style === 15
                ? themeStyle.backgroundColor
                : themeStyle.backgroundColor
          }}
          extraData={this.state}
          renderItem={this.renderItem}
          ListFooterComponent={
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                margin: 5,
                marginRight: 3,
                marginTop: 6,
                alignItems: 'center',
                marginBottom: 8
              }}
              onPress={() =>
                this.props.navigation.navigate('NewestScreen', {
                  id: this.props.parentId,
                  name: '',
                  sortOrder:
                    this.state.selectedTab === 'a' ? 'most liked' : 'special'
                })
              }>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row'
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: themeStyle.addToCartBtnColor,
                    fontSize: themeStyle.largeSize - 2
                  }}>
                  {this.props.cartItems2.Config.languageJson['Shop More']}
                </Text>
                <Icon
                  name={
                    !I18nManager.isRTL
                      ? 'md-arrow-dropright'
                      : 'md-arrow-dropleft'
                  }
                  style={{
                    color: themeStyle.addToCartBtnColor,
                    fontSize: 22,
                    paddingTop: 2,
                    paddingLeft: !I18nManager.isRTL ? 8 : 8,
                    paddingRight: I18nManager.isRTL ? 8 : 8
                  }}
                />
              </View>
            </TouchableOpacity>
          }
          ListHeaderComponent={
            <View style={{ marginBottom: 5 }}>
              {this.props.cartItems2.cartItems.categories.length > 0 ? (
                <View>
                  {this.categoryFun(
                    this.props.cartItems2.Config.languageJson.Categories,
                    'apps',
                    'shop'
                  )}
                  <CategoryFlatList
                    dataSource={this.props.cartItems2.cartItems.categories}
                    products={
                      this.props.cartItems2.Config.languageJson.Products
                    }
                    allCategories={
                      this.props.cartItems2.cartItems.allCategories
                    }
                    props={this.props}
                    vertical
                    noOfCol={1}
                    categoryPage={61}
                  />
                </View>
              ) : null}
              <Banner
                navigation={this.props.navigation}
                bannerSelect={
                  this.props.cartItems2.Config.banner_style
                }
              />

              {/* Recently Viewed */}

              {this.state.length > 0 ? (
                <View
                  style={{
                    backgroundColor:
                      this.props.cartItems2.Config.card_style === 11 ||
                      this.props.cartItems2.Config.card_style === 12 ||
                      this.props.cartItems2.Config.card_style === 15
                        ? themeStyle.backgroundColor
                        : themeStyle.backgroundColor
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor:
                        this.props.cartItems2.Config.card_style === 11 ||
                        this.props.cartItems2.Config.card_style === 12 ||
                        this.props.cartItems2.Config.card_style === 15
                          ? themeStyle.backgroundColor
                          : themeStyle.backgroundColor,
                      marginLeft: 10
                    }}>
                    <Icon
                      name={'list'}
                      style={{
                        color: themeStyle.primaryDark,
                        fontSize: 15,
                        paddingTop: 10,
                        padding: 10,
                        paddingLeft: 0,
                        paddingBottom: 4
                      }}
                    />
                    <Text
                      style={{
                        color: themeStyle.textColor,
                        fontSize: themeStyle.smallSize + 1,
                        fontWeight: '400',
                        padding: 10,
                        paddingTop: Platform.OS === 'android' ? 8 : 10,
                        paddingLeft: 0,
                        paddingRight: 5,
                        paddingBottom: 2
                      }}>
                      {
                        this.props.cartItems2.Config.languageJson[
                          'Recently Viewed'
                        ]
                      }{' '}
                    </Text>
                  </View>
                  <FlatListView vertical dataName={'RecentlyViewed'} />
                </View>
              ) : null}

              {this.categoryFun(
                this.props.cartItems2.Config.languageJson['top seller'],
                'albums',
                'top seller'
              )}
              {this.props.cartItems2.sharedData.tab1 !== undefined ? (
                <FlatListView
                  vertical
                  dataName={'Newest'}
                  viewButton={false}
                  scrollEnabled={false}
                  navigation={this.props.navigation}
                  tabArray={
                    this.props.cartItems2.sharedData.tab1 !== undefined &&
                    this.props.cartItems2.sharedData.tab1 !== null
                      ? this.props.cartItems2.sharedData.tab1
                      : []
                  }
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    alignContent: 'center'
                  }}>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 40,
                      alignSelf: 'center'
                    }}>
                    <Icon
                      name={'logo-dropbox'}
                      style={{ color: 'gray', fontSize: 80 }}
                    />

                    <Text
                      style={{
                        fontSize: themeStyle.largeSize + 2,
                        color: themeStyle.textColor
                      }}>
                      {
                        this.props.cartItems2.Config.languageJson[
                          'No Products Found'
                        ]
                      }
                    </Text>
                  </View>
                </View>
              )}
              <View
                style={{
                  height: 52,
                  width: WIDTH,
                  flexDirection: 'row',
                  justifyContent: 'space-around'
                }}>
                <TouchableOpacity
                  disabled={this.state.selectedTab === ''}
                  onPress={() => this.changeTab('')}
                  style={{
                    width: WIDTH * 0.5,
                    borderBottomColor:
                      this.state.selectedTab === ''
                        ? themeStyle.primary
                        : themeStyle.textColor,
                    borderBottomWidth: this.state.selectedTab === '' ? 2 : 0
                  }}>
                  <View
                    style={{
                      margin: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 5,
                      marginTop: 7
                    }}>
                    <Text
                      style={{
                        fontSize: themeStyle.largeSize - 2,
                        fontWeight: '400',
                        fontFamily: 'Roboto',
                        padding: 10,
                        paddingBottom: 0,
                        paddingTop: 5,
                        color:
                          this.state.selectedTab === ''
                            ? themeStyle.primary
                            : '#707070'
                      }}>
                      {this.props.cartItems2.Config.languageJson.Deals}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={this.state.selectedTab === 'a'}
                  onPress={() => {
                    if (this.props.cartItems2.sharedData.tab3 !== undefined) { this.changeTab('a') }
                  }}
                  style={{
                    width: WIDTH * 0.5,
                    borderBottomColor:
                      this.state.selectedTab === 'a'
                        ? themeStyle.primary
                        : themeStyle.textColor,
                    borderBottomWidth: this.state.selectedTab === 'a' ? 2 : 0
                  }}>
                  <View
                    style={{
                      margin: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 5,
                      marginTop: 7
                    }}>
                    <Text
                      style={{
                        fontSize: themeStyle.largeSize - 2,
                        fontWeight: '400',
                        fontFamily: 'Roboto',
                        padding: 10,
                        paddingBottom: 0,
                        paddingTop: 5,
                        color:
                          this.state.selectedTab === 'a'
                            ? themeStyle.primary
                            : '#707070'
                      }}>
                      {this.props.cartItems2.Config.languageJson['Most Liked']}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          }
        />
      </View>
    )
  }
}
/// ///////////////////////////////////////////////
const mapStateToProps = state => ({
  cartItems2: state
})
/// //////////////////////////////////////////
export default connect(mapStateToProps, null)(Newest)
