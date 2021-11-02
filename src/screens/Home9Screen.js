import React, { PureComponent } from 'react'
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  I18nManager,
  Linking
} from 'react-native'
import { UIActivityIndicator } from 'react-native-indicators'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { NavigationEvents } from 'react-navigation'
import Spinner from 'react-native-loading-spinner-overlay'
import { connect } from 'react-redux'
import BottomNav from '../common/BottomNav'
import { getUrl, postHttp } from '../common/WooComFetch'
import SyncStorage from 'sync-storage'
import CardTem from '../common/CardTemplate'
import { Icon } from 'native-base'
import Loader from 'react-native-easy-content-loader'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TabBar from 'react-native-underline-tabbar'
import FlatListView from '../common/FlatListView'
import CategoryFlatList from '../common/CategoriesFlatList'
import themeStyle from '../common/Theme.style'
import ShoppingCartIcon from '../common/ShoppingCartIcon'
import MenuIcon from '../common/MenuIcon'
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
      cartItems2: true,
      page: 2,
      products:
        this.props.cartItems2.sharedData.products !== undefined &&
        this.props.cartItems2.sharedData.products !== null
          ? this.props.cartItems2.sharedData.products
          : [],
      refreshing: false,
      fabB: false,
      selected: '',
      timeValue: 400,
      length: this.props.cartItems2.cartItems.recentViewedProducts.length,
      selectedTab: '',
      productView: 'grid',
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

  getProducts = async () => {
    if (this.state.tempBox.includes(this.state.page)) {
    } else {
      this.state.tempBox.push(this.state.page)
      const formData = new FormData()
      formData.append('customers_id', null)
      formData.append('page_number', this.state.page)
      formData.append(
        'language_id',
        SyncStorage.get('langId') === undefined ? 1 : SyncStorage.get('langId')
      )
      formData.append(
        'currency_code',
        this.props.cartItems2.Config.productsArguments.currency
      )
      formData.append(
        'categories_id',
        this.state.selected != 0 ? this.state.selected : 0
      )
      const dat = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData
      )
      if (dat.success == 1) {
        this.state.page = this.state.page + 1
        for (const value of dat.product_data) {
          this.state.products.push(value)
        }
        this.state.noDataFound = false
      } else {
        this.state.noDataFound = true
      }
      this.setState({ refreshing: false })
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
            height: 130,
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

  renderSeparator = () => (
    <View style={{ height: 1, width: '100%', backgroundColor: '#ddd' }} />
  )

  handleLoadMore () {
    if (this.state.products.length % 10 === 0) {
      this.setState(
        {
          refreshing: true,
          fabB: this.state.products.length > 9
        },
        () => {
          this.getProducts()
        }
      )
    } else {
      this.setState({
        refreshing: false
      })
    }
  }

  renderFooter = () => (
    <View
      style={{
        marginBottom: this.state.refreshing ? 50 : 10,
        marginTop: 20,
        alignItems: 'center',
        alignSelf: 'center',
        alignContent: 'center'
      }}>
      {this.state.refreshing ? (
        <View
          style={{
            height: 10,
            marginTop: 25
          }}>
          <UIActivityIndicator
            size={27}
            count={12}
            color={themeStyle.loadingIndicatorColor}
          />
        </View>
      ) : null}
    </View>
  )

  onEndReached = () => {
    this.handleLoadMore()
    this.onEndReachedCalledDuringMomentum = true
    // }
  }

  handleScroll (event) {
    if (
      this.state.fabB &&
      event.nativeEvent.contentOffset.y >= 0 &&
      event.nativeEvent.contentOffset.y < 300
    ) {
      this.setState({ fabB: false })
    }
  }

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
      this.props.cartItems2.sharedData.products !== undefined &&
      this.props.cartItems2.sharedData.products !== null &&
      this.props.cartItems2.sharedData.products !== [] &&
      this.props.cartItems2.sharedData.products !== '' &&
      this.state.temp === 1
    ) {
      if (this.props.cartItems2.sharedData.products.length > 0) {
        this.state.products = this.props.cartItems2.sharedData.products
        this.state.temp = 0
      }
    }

    if (this.state.products.length > 0) {
      this.state.loading = false
      this.state.timeValue = 400
      if (this.state.products.length % 10 === 0) {
        this.state.refreshing = true
      } else {
        this.state.refreshing = false
      }
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
                this.props.cartItems2.sharedData.products !== undefined &&
                this.props.cartItems2.sharedData.products !== null
                  ? this.props.cartItems2.sharedData.products
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
          numColumns={2}
          ref={ref => {
            this.flatListRef = ref
          }}
          ListFooterComponent={() => this.renderFooter()}
          keyExtractor={(item, index) => index.toString()}
          columnWrapperStyle={{
            paddingLeft:
              WIDTH >= 375
                ? WIDTH * 0.009
                : WIDTH >= 360 && WIDTH <= 75
                  ? WIDTH * 0.008
                  : WIDTH * 0.007,
            padding: 2,
            paddingBottom: 0,
            marginBottom: 0,
            paddingTop: 0,
            marginTop: 0
          }}
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
          ListHeaderComponent={
            <View style={{ marginBottom: 5 }}>
              <View
                style={{
                  backgroundColor:
                    this.props.cartItems2.Config.card_style === 11 ||
                    this.props.cartItems2.Config.card_style === 12 ||
                    this.props.cartItems2.Config.card_style === 15
                      ? themeStyle.backgroundColor
                      : themeStyle.backgroundColor
                }}>
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
                      noOfCol={3}
                      categoryPage={1}
                      vertical={false}
                      noShadow
                      sizeChange
                    />
                  </View>
                ) : null}
                <View>
                  <ScrollableTabView
                    style={{
                      height:
                        this.props.cartItems2.Config.card_style === 12
                          ? themeStyle.singleRowCardWidth * 1.62
                          : this.props.cartItems2.Config.card_style === 9 ||
                            this.props.cartItems2.Config.card_style === 10 ||
                            this.props.cartItems2.Config.card_style === 13 ||
                            this.props.cartItems2.Config.card_style === 16 ||
                            this.props.cartItems2.Config.card_style === 19 ||
                            this.props.cartItems2.Config.card_style === 7
                            ? themeStyle.singleRowCardWidth * 1.69
                            : this.props.cartItems2.Config.card_style === 11 ||
                            this.props.cartItems2.Config.card_style === 6
                              ? themeStyle.singleRowCardWidth * 1.82
                              : this.props.cartItems2.Config.cartButton ||
                            this.props.cartItems2.Config.card_style === 8 ||
                            this.props.cartItems2.Config.card_style === 15 ||
                            this.props.cartItems2.Config.card_style === 18
                                ? themeStyle.singleRowCardWidth * 1.88
                                : this.props.cartItems2.Config.card_style === 17
                                  ? themeStyle.singleRowCardWidth * 1.93
                                  : this.props.cartItems2.Config.card_style === 4 ||
                            this.props.cartItems2.Config.card_style === 20
                                    ? themeStyle.singleRowCardWidth * 1.76
                                    : this.props.cartItems2.Config.card_style === 3 ||
                            this.props.cartItems2.Config.card_style === 22
                                      ? themeStyle.singleRowCardWidth * 1.838
                                      : themeStyle.singleRowCardWidth * 1.738
                    }}
                    tabBarActiveTextColor={themeStyle.primaryDark}
                    locked={!!I18nManager.isRTL}
                    renderTabBar={() => (
                      <TabBar
                        style={{
                          alignItems: 'center',
                          flexDirection: 'column'
                        }}
                        underlineColor={themeStyle.primaryDark}
                        inactiveTextColor='#707070'
                        backgroundColor={themeStyle.backgroundColor}
                        tabBarStyle={{
                          height: 46,
                          marginTop: 0,
                          paddingTop: 12,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginLeft: -16,
                          width: '109%'
                        }}
                        tabBarTextStyle={{
                          fontSize: themeStyle.smallSize + 1,
                          width: WIDTH * 0.4182 - 48,
                          textAlign: 'center'
                        }}
                      />
                    )}>
                    {/* Newest Viewed */}
                    <ScrollView
                      tabLabel={{
                        label: this.props.cartItems2.Config.languageJson[
                          'top seller'
                        ]
                      }}>
                      {this.props.cartItems2.sharedData.tab1 !== undefined ? (
                        <FlatListView
                          vertical
                          viewButton
                          navigation={this.props.navigation}
                          dataName={'Newest'}
                          tabArray={
                            this.props.cartItems2.sharedData.tab1 !==
                              undefined &&
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
                    </ScrollView>
                    {/* Deals Viewed */}
                    <ScrollView
                      tabLabel={{
                        label: this.props.cartItems2.Config.languageJson.Deals
                      }}>
                      {this.props.cartItems2.sharedData.tab2 !== undefined ? (
                        <FlatListView
                          vertical
                          viewButton
                          navigation={this.props.navigation}
                          dataName={'Deals'}
                          tabArray={
                            this.props.cartItems2.sharedData.tab2 !==
                              undefined &&
                            this.props.cartItems2.sharedData.tab2 !== null
                              ? this.props.cartItems2.sharedData.tab2
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
                    </ScrollView>
                    {/* Featured Viewed */}
                    <ScrollView
                      tabLabel={{
                        label: this.props.cartItems2.Config.languageJson[
                          'Most Liked'
                        ]
                      }}>
                      {this.props.cartItems2.sharedData.tab3 !== undefined ? (
                        <FlatListView
                          vertical
                          viewButton
                          navigation={this.props.navigation}
                          dataName={'Featured'}
                          tabArray={
                            this.props.cartItems2.sharedData.tab3 !==
                              undefined &&
                            this.props.cartItems2.sharedData.tab3 !== null
                              ? this.props.cartItems2.sharedData.tab3
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
                    </ScrollView>
                  </ScrollableTabView>
                </View>

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
                          color: themeStyle.primary,
                          fontSize: 15,
                          paddingTop: 10,
                          padding: 10,
                          paddingLeft: 0,
                          paddingBottom: 4
                        }}
                      />
                      <Text
                        style={{
                          color: themeStyle.primary,
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
              </View>

              <View style={{ height: 38, width: WIDTH }}>
                {this.categoryFun(
                  this.props.cartItems2.Config.languageJson.Products,
                  'bookmark',
                  'newest'
                )}
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  data={this.props.cartItems2.cartItems.allCategories}
                  extraData={this.state}
                  horizontal
                  style={{
                    borderColor: themeStyle.textColor,
                    backgroundColor: themeStyle.backgroundColor,
                    elevation: 5,
                    shadowOffset: { width: 5, height: 1 },
                    shadowColor: '#000',
                    shadowOpacity: 0.8,
                    marginTop: 5
                  }}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={item => null}
                />
              </View>
            </View>
          }
          onScroll={this.handleScroll.bind(this)}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false
          }}
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
/// /////////////////////////////////////////////
