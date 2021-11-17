import React, {Component} from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  I18nManager,
  Image,
  Linking,
} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';
import SyncStorage from 'sync-storage';
import {CardStyleInterpolators} from 'react-navigation-stack';
import {NavigationEvents} from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux';
import {getUrl, postHttp} from '../common/WooComFetch';
import CardTem from '../common/CardTemplate';
import {Icon} from 'native-base';
import Loader from 'react-native-easy-content-loader';
import Banner from '../common/Banner';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from 'react-native-underline-tabbar';
import FlatListView from '../common/FlatListView';
import BottomNav from '../common/BottomNav';
import themeStyle from '../common/Theme.style';
import ShoppingCartIcon from '../common/ShoppingCartIcon';
import MenuIcon from '../common/MenuIcon';
const WIDTH = Dimensions.get('window').width;
class Newest extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: () => <MenuIcon navigation={navigation} />,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    headerTitle: themeStyle.homeTitle,
    headerRight: () => <ShoppingCartIcon navigation={navigation} />,
    headerTitleAlign: 'left',
    headerTintColor: themeStyle.headerTintColor,
    headerStyle: {
      backgroundColor: themeStyle.primary,
    },
    headerTitleStyle: {
      fontWeight: Platform.OS === 'android' ? 'bold' : 'normal',
    },
    headerForceInset: {top: 'never', vertical: 'never'},
    gestureEnabled: true,
  });

  static getDerivedStateFromProps(props, state) {
    return {
      length:
        props.cartItems2.cartItems.recentViewedProducts.length !== undefined
          ? props.cartItems2.cartItems.recentViewedProducts.length
          : 0,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      cartItems2: true,
      page: 1,
      products:
        this.props.cartItems2.sharedData.products !== undefined &&
        this.props.cartItems2.sharedData.products !== null
          ? this.props.cartItems2.sharedData.products
          : [],
      refreshing: false,
      fabB: false,
      selected: 0,
      timeValue: 400,
      length: this.props.cartItems2.cartItems.recentViewedProducts.length,
      selectedTab: '',
      productView: 'grid',
      tempBox: [],
      loading: false,
      activityIndicatorTemp: true,
      temp: 1,
      SpinnerTemp: false,
      noDataFound: !(
        this.props.cartItems2.sharedData.products !== undefined &&
        this.props.cartItems2.sharedData.products !== null
      ),
    };
  }

  getOneProduct = async (value) => {
    const formData = new FormData();
    formData.append('language_id', '1');
    formData.append('products_id', value);
    formData.append('currency_code', '1');
    formData.append(
      'currency_code',
      this.props.cartItems2.Config.productsArguments.currency,
    );
    const json = await postHttp(
      getUrl() + '/api/' + 'getallproducts',
      formData,
    );
    this.setState({SpinnerTemp: false}, () => {
      this.navigate(json.product_data[0]);
    });
  };

  handleOpenURL = (event) => {
    // D
    if (event.url !== '' && event.url !== undefined && event.url !== null) {
      const route = event.url.replace(/.*?:\/\//g, '');
      const id = route.match(/\/([^/]+)\/?$/)[1];
      if (id !== '' && id !== undefined && id !== null) {
        this.setState({SpinnerTemp: true}, () => {
          this.getOneProduct(id);
        });
      }
    }
  };

  navigate = (json) => {
    // E
    if (json !== '' && json !== undefined && json !== null) {
      Linking.removeEventListener('url', this.handleOpenURL);
      this.props.navigation.navigate('ProductDetails', {objectArray: json});
    }
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({activityIndicatorTemp: false});
    }, 1000);
    this.props.navigation.setParams({
      headerTitle: this.props.cartItems2.Config.languageJson.Home,
    });
    if (!this.props.cartItems2.sharedData.deepTemp) {
      this.props.cartItems2.sharedData.deepTemp = true;
      if (Platform.OS === 'android') {
        const NativeLinking =
          require('react-native/Libraries/Linking/NativeLinking').default;
        NativeLinking.getInitialURL().then((url) => {
          if (url !== '' && url !== undefined && url !== null) {
            const route = url.replace(/.*?:\/\//g, '');
            const id = route.match(/\/([^/]+)\/?$/)[1];
            if (id !== '' && id !== undefined && id !== null) {
              this.setState({SpinnerTemp: true}, () => {
                this.getOneProduct(id);
              });
            }
          }
        });
      } else {
        Linking.addEventListener('url', this.handleOpenURL);
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.activityIndicatorTemp);
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  getProducts = async () => {
    if (this.state.tempBox.includes(this.state.page)) {
    } else {
      this.state.tempBox.push(this.state.page);
      const formData = new FormData();
      formData.append('customers_id', null);
      formData.append('page_number', this.state.page);
      formData.append(
        'language_id',
        SyncStorage.get('langId') === undefined ? 1 : SyncStorage.get('langId'),
      );
      formData.append(
        'currency_code',
        this.props.cartItems2.Config.productsArguments.currency,
      );
      formData.append(
        'categories_id',
        this.state.selected != 0 ? this.state.selected : 0,
      );
      const dat = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData,
      );
      if (dat.success == 1) {
        this.state.page = this.state.page + 1;
        for (const value of dat.product_data) {
          this.state.products.push(value);
        }
        this.state.noDataFound = false;
      } else {
        this.state.noDataFound = true;
      }
      this.setState({refreshing: false});
    }
  };

  // changing tab
  changeTab(c) {
    this.state.noDataFound = false;
    this.state.page = 0;
    if (c === 0) {
      this.state.selected = c;
      this.state.selectedTab = c;
    } else {
      this.state.selected = c.id;
      this.state.selectedTab = c.id;
    }
    this.setState({products: [], tempBox: [], fabB: false}, () => {
      this.getProducts();
    });
  }

  renderItem = (item, index) =>
    this.state.noDataFound ? (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <Text>
          {this.props.cartItems2.Config.languageJson['No Products Found'] + ''}
        </Text>
      </View>
    ) : (
      <View>
        <Loader
          secondaryColor="rgba(208, 205, 205, 1)"
          primaryColor="rgba(218, 215, 215, 1)"
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
            shadowOffset: {width: 1, height: 1},
            shadowColor: '#000',
            shadowOpacity: 0.5,
            elevation: 3,
            margin: 5,
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
            flex: 1,
          }}
          paragraphStyles={{
            paddingTop: 7,
            padding: 6,
            flex: 1,
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <CardTem
            objectArray={item.item}
            rows={this.props.vertical}
            recent={this.state.recent}
            width={WIDTH * themeStyle.twoRowCardWIdth}
          />
        </Loader>
      </View>
    );

  renderSeparator = () => (
    <View style={{height: 1, width: '100%', backgroundColor: '#ddd'}} />
  );

  handleLoadMore() {
    if (this.state.products.length % 10 === 0) {
      this.setState(
        {
          refreshing: true,
          fabB: this.state.products.length > 9,
        },
        () => {
          this.getProducts();
        },
      );
    } else {
      this.setState({
        refreshing: false,
      });
    }
  }

  renderFooter = () => (
    <View
      style={{
        marginBottom: this.state.refreshing ? 50 : 10,
        marginTop: 20,
        alignItems: 'center',
        alignSelf: 'center',
        alignContent: 'center',
      }}>
      {this.state.refreshing ? (
        <View
          style={{
            height: 10,
            marginTop: 25,
          }}>
          <UIActivityIndicator
            size={27}
            count={12}
            color={themeStyle.loadingIndicatorColor}
          />
        </View>
      ) : null}
    </View>
  );

  onEndReached = () => {
    this.handleLoadMore();
    this.onEndReachedCalledDuringMomentum = true;
    // }
  };

  handleScroll(event) {
    if (
      this.state.fabB &&
      event.nativeEvent.contentOffset.y >= 0 &&
      event.nativeEvent.contentOffset.y < 300
    ) {
      this.setState({fabB: false});
    }
  }

  render() {
    if (
      this.props.cartItems2.sharedData.products !== undefined &&
      this.props.cartItems2.sharedData.products !== null &&
      this.props.cartItems2.sharedData.products !== [] &&
      this.props.cartItems2.sharedData.products !== '' &&
      this.state.temp === 1
    ) {
      if (this.props.cartItems2.sharedData.products.length > 0) {
        this.state.products = this.props.cartItems2.sharedData.products;
        this.state.temp = 0;
      }
    }

    if (this.state.products.length > 0) {
      this.state.loading = false;
      this.state.timeValue = 400;
      if (this.state.products.length % 10 === 0) {
        this.state.refreshing = true;
      } else {
        this.state.refreshing = false;
      }
    } else {
      this.state.loading = true;
      this.state.timeValue = 400;
      this.state.refreshing = false;
    }

    return this.state.activityIndicatorTemp ? (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: themeStyle.backgroundColor,
        }}>
        <NavigationEvents
          onDidFocus={() => {
            this.setState({});
          }}
        />
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
          paddingBottom: SyncStorage.get('bottom') ? 50 : 0,
        }}>
        <Spinner visible={this.state.SpinnerTemp} />
        {SyncStorage.get('bottom') ? (
          <BottomNav active={0} home={'Home3Screen'}></BottomNav>
        ) : null}
        <NavigationEvents
          onDidFocus={() => {
            this.props.navigation.setParams({
              headerRight: () => (
                <ShoppingCartIcon navigation={this.props.navigation} />
              ),
            });
            this.setState({
              products:
                this.props.cartItems2.sharedData.products !== undefined &&
                this.props.cartItems2.sharedData.products !== null
                  ? this.props.cartItems2.sharedData.products
                  : [],
            });
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
              marginBottom: 50,
            }}
            onPress={() => {
              this.flatListRef.scrollToOffset(
                {
                  animated: true,
                  offset: 0,
                  useNativeDriver: true,
                },
                {
                  useNativeDriver: true,
                },
              );
              this.setState({fabB: false});
            }}>
            <View
              style={{
                alignItems: 'center',
                height: 48,
                width: 48,
                borderRadius: 400,
                alignSelf: 'center',
                justifyContent: 'center',
                backgroundColor: themeStyle.primary,
              }}>
              <Icon
                name={'md-arrow-up'}
                style={{
                  color: themeStyle.primaryContrast,
                  paddingTop: Platform.OS === 'ios' ? 2 : 0,
                  fontSize: 22,
                }}
              />
            </View>
          </TouchableOpacity>
        ) : null}

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
              elevation: 10,
            }}
            onPress={() => {
              this.props.navigation.navigate('DemoScreen');
            }}>
            <Icon
              name={'md-settings'}
              style={{
                color: themeStyle.primaryContrast,
                paddingTop: Platform.OS === 'ios' ? 2 : 0,
                fontSize: 22,
              }}
            />
          </TouchableOpacity>
        ) : null}
        <FlatList
          showsVerticalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          windowSize={50}
          initialNumToRender={3}
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
          ref={(ref) => {
            this.flatListRef = ref;
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
            marginTop: 0,
          }}
          contentContainerStyle={{
            backgroundColor:
              this.props.cartItems2.Config.card_style === 11 ||
              this.props.cartItems2.Config.card_style === 12 ||
              this.props.cartItems2.Config.card_style === 15
                ? // ? themeStyle.backgroundColor
                  // : themeStyle.backgroundColor,
                  '#f5fafe'
                : '#f5fafe',
          }}
          extraData={this.state}
          renderItem={this.renderItem}
          ListHeaderComponent={
            <View style={{marginBottom: 5}}>
              <View
                style={{
                  backgroundColor:
                    this.props.cartItems2.Config.card_style === 11 ||
                    this.props.cartItems2.Config.card_style === 12 ||
                    this.props.cartItems2.Config.card_style === 15
                      ? '#f5fafe'
                      : '#f5fafe',
                }}>
                <View>
                  <Banner
                    navigation={this.props.navigation}
                    bannerSelect={this.props.cartItems2.Config.banner_style}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor:
                      this.props.cartItems2.Config.card_style === 11 ||
                      this.props.cartItems2.Config.card_style === 12 ||
                      this.props.cartItems2.Config.card_style === 15
                        ? '#f5fafe'
                        : '#f5fafe',
                    marginHorizontal: 20,
                    // marginLeft: 10,
                  }}>
                  {/* <Icon
                    name={'time'}
                    style={{
                      color: themeStyle.primary,
                      fontSize: 15,
                      paddingTop: 10,
                      padding: 10,
                      paddingLeft: 0,
                      paddingBottom: 4,
                    }}
                  /> */}
                  <Image
                    source={require('./../images/magic-wand.png')}
                    style={{
                      height: 15,
                      width: 20,
                      resizeMode: 'contain',
                      marginTop: 10,
                    }}
                  />

                  <Text
                    style={{
                      color: themeStyle.productTextColor,
                      fontSize: themeStyle.smallSize + 1,
                      fontWeight: '400',
                      // paddingVertical: 10,
                      paddingTop: Platform.OS === 'android' ? 10 : 10,
                      // paddingLeft: 5,
                      // paddingRight: 5,
                      // paddingBottom: 2,
                    }}>
                    {this.props.cartItems2?.Config?.languageJson['Flash Sale']}{' '}
                  </Text>
                </View>
                {this.props.cartItems2.sharedData.flashSaleProducts !==
                undefined ? (
                  <FlatListView
                    vertical
                    viewButton
                    navigation={this.props.navigation}
                    dataName={'Flash'}
                    tabArray={
                      this.props.cartItems2.sharedData.flashSaleProducts !==
                        undefined &&
                      this.props.cartItems2.sharedData.flashSaleProducts !==
                        null
                        ? this.props.cartItems2.sharedData.flashSaleProducts
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
                      alignContent: 'center',
                    }}>
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 40,
                        alignSelf: 'center',
                      }}>
                      <Icon
                        name={'logo-dropbox'}
                        style={{color: 'gray', fontSize: 80}}
                      />

                      <Text
                        style={{
                          fontSize: themeStyle.largeSize + 2,
                          color: themeStyle.textColor,
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
                <View style={{marginHorizontal: 9}}>
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
                          : themeStyle.singleRowCardWidth * 1.738,
                    }}
                    tabBarActiveTextColor={'#404040'}
                    locked={!!I18nManager.isRTL}
                    renderTabBar={() => (
                      <TabBar
                        style={{
                          alignItems: 'center',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          // marginHorizontal: 12,
                        }}
                        underlineColor={'#ed1c24'}
                        inactiveTextColor="#707070"
                        backgroundColor={themeStyle.backgroundColor}
                        tabBarStyle={{
                          height: 46,
                          marginTop: 0,
                          paddingTop: 12,
                          backgroundColor: '#e6eff7',
                          justifyContent: 'center',
                          alignItems: 'center',
                          // marginLeft: -16,
                          width: '100%',
                          borderRadius: 10,
                          // marginLeft: 30,
                          // marginRight: 30,
                        }}
                        tabBarTextStyle={{
                          fontSize: themeStyle.smallSize + 1,
                          // fontSize: 12,
                          width: WIDTH * 0.4182 - 60,
                          textTransform: 'uppercase',
                          textAlign: 'center',
                          justifyContent: 'center',
                          fontWeight: Platform.OS === 'android' ? '900' : '400',
                        }}
                      />
                    )}>
                    <ScrollView
                      tabLabel={{
                        label:
                          this.props.cartItems2.Config.languageJson[
                            'top seller'
                          ],
                      }}
                      style={{backgroundColor: '#f5fafe'}}>
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
                            alignContent: 'center',
                          }}>
                          <View
                            style={{
                              flex: 1,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginTop: 40,
                              alignSelf: 'center',
                            }}>
                            <Icon
                              name={'logo-dropbox'}
                              style={{color: 'gray', fontSize: 80}}
                            />

                            <Text
                              style={{
                                fontSize: themeStyle.largeSize + 2,
                                color: themeStyle.textColor,
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
                        label: this.props.cartItems2.Config.languageJson.Deals,
                      }}
                      style={{backgroundColor: '#f5fafe'}}>
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
                            alignContent: 'center',
                          }}>
                          <View
                            style={{
                              flex: 1,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginTop: 40,
                              alignSelf: 'center',
                            }}>
                            <Icon
                              name={'logo-dropbox'}
                              style={{color: 'gray', fontSize: 80}}
                            />

                            <Text
                              style={{
                                fontSize: themeStyle.largeSize + 2,
                                color: themeStyle.textColor,
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
                        label:
                          this.props.cartItems2.Config.languageJson[
                            'Most Liked'
                          ],
                      }}
                      style={{backgroundColor: '#f5fafe'}}>
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
                            alignContent: 'center',
                          }}>
                          <View
                            style={{
                              flex: 1,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginTop: 40,
                              alignSelf: 'center',
                            }}>
                            <Icon
                              name={'logo-dropbox'}
                              style={{color: 'gray', fontSize: 80}}
                            />

                            <Text
                              style={{
                                fontSize: themeStyle.largeSize + 2,
                                color: themeStyle.textColor,
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
                          ? '#f5fafe'
                          : '#f5fafe',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor:
                          this.props.cartItems2.Config.card_style === 11 ||
                          this.props.cartItems2.Config.card_style === 12 ||
                          this.props.cartItems2.Config.card_style === 15
                            ? '#f5fafe'
                            : '#f5fafe',
                        marginLeft: 10,
                      }}>
                      <Icon
                        name={'list'}
                        style={{
                          color: themeStyle.primary,
                          fontSize: 15,
                          paddingTop: 10,
                          padding: 10,
                          paddingLeft: 0,
                          paddingBottom: 4,
                        }}
                      />
                      <Text
                        style={{
                          color: themeStyle.productTextColor,
                          fontSize: themeStyle.smallSize + 1,
                          fontWeight: '400',
                          padding: 10,
                          paddingTop: Platform.OS === 'android' ? 8 : 10,
                          paddingLeft: 0,
                          paddingRight: 5,
                          paddingBottom: 2,
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
              {this.props.cartItems2.cartItems.allCategories !== undefined ? (
                <View style={{height: 50, width: WIDTH}}>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    windowSize={50}
                    initialNumToRender={6}
                    removeClippedSubviews={true}
                    legacyImplementation={true}
                    maxToRenderPerBatch={10}
                    updateCellsBatchingPeriod={10}
                    data={this.props.cartItems2.cartItems.allCategories}
                    extraData={this.state}
                    horizontal
                    style={{
                      borderColor: themeStyle.textColor,
                      backgroundColor: '#e6eff7',
                      elevation: 5,
                      shadowOffset: {width: 5, height: 1},
                      shadowColor: '#000',
                      shadowOpacity: 0.8,
                      marginTop: 5,
                      // paddingTop: 3,
                    }}
                    ListHeaderComponent={
                      this.props.cartItems2.cartItems.allCategories !== null ? (
                        <TouchableOpacity
                          style={{
                            borderBottomColor:
                              this.state.selectedTab === '' ||
                              this.state.selectedTab === 0 ||
                              this.state.selectedTab === undefined
                                ? themeStyle.primary
                                : themeStyle.textColor,
                            borderBottomWidth:
                              this.state.selectedTab === '' ||
                              this.state.selectedTab === 0 ||
                              this.state.selectedTab === undefined
                                ? 2
                                : 0,
                          }}
                          onPress={() => this.changeTab(0)}>
                          <Text
                            style={{
                              fontSize: themeStyle.mediumSize,
                              textDecorationLine:
                                this.state.selectedTab === '' ? 'none' : 'none',
                              padding: 10,
                              height: 43,
                              color:
                                this.state.selectedTab === ''
                                  ? themeStyle.primaryDark
                                  : '#707070',
                            }}>
                            {this.props.cartItems2.Config.languageJson.All}
                          </Text>
                        </TouchableOpacity>
                      ) : null
                    }
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(item) => (
                      <TouchableOpacity
                        style={{
                          borderBottomColor:
                            this.state.selectedTab === item.item.id ||
                            this.state.selectedTab === undefined
                              ? '#ed1c24'
                              : themeStyle.textColor,
                          borderBottomWidth:
                            this.state.selectedTab === item.item.id ||
                            this.state.selectedTab === undefined
                              ? 2
                              : 0,
                        }}
                        onPress={() => this.changeTab(item.item)}>
                        <Text
                          style={{
                            fontSize: themeStyle.mediumSize,
                            textDecorationLine:
                              this.state.selectedTab === item.item.id
                                ? 'none'
                                : 'none',
                            padding: 10,
                            color:
                              this.state.selectedTab === item.item.id
                                ? '#404040'
                                : '#707070',
                          }}>
                          {item.item.name}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              ) : null}
            </View>
          }
          onScroll={this.handleScroll.bind(this)}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
        />
      </View>
    );
  }
}
/// ///////////////////////////////////////////////
const mapStateToProps = (state) => {
  return {
    cartItems2: state,
  };
};
/// //////////////////////////////////////////
export default connect(mapStateToProps, null)(Newest);
/// /////////////////////////////////////////////
