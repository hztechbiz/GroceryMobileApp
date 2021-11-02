import React, { PureComponent } from 'react'
import {
  View,
  FlatList,
  Dimensions,
  Text,
  TouchableOpacity,
  RefreshControl,
  Platform
} from 'react-native'
import SyncStorage from 'sync-storage'
import { NavigationEvents } from 'react-navigation'
import { postHttp, getUrl } from '../common/WooComFetch'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { UIActivityIndicator } from 'react-native-indicators'
import CardTem from '../common/CardTemplate'
import { connect } from 'react-redux'
import { Icon } from 'native-base'
import themeStyle from '../common/Theme.style'
import ShoppingCartIcon from '../common/ShoppingCartIcon'
const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
class wishListScreen extends PureComponent {
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

  componentDidMount () {
    if (
      SyncStorage.get('customerData').customers_id != null &&
      SyncStorage.get('customerData').customers_id !== undefined
    ) {
      this.getProducts()
    }
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson2['My Wish List']
    })
  }

  static getDerivedStateFromProps (props) {
    return {
      wishListProducts: props.isLoading.cartItems.wishListProducts
    }
  }

  constructor (props) {
    super(props)

    this.state = {
      wishListProducts: [],
      page: 0,
      loading: true,
      refreshing: false,
      isRefreshing: false, // for pull to refresh
      temp:
        !!(SyncStorage.get('customerData').customers_id != null &&
        SyncStorage.get('customerData').customers_id !== undefined)
    }
  }

  onRefreshTemp () {
    this.setState({ isRefreshing: true, page: 0, refreshing: false }, () => {
      if (
        SyncStorage.get('customerData').customers_id != null &&
        SyncStorage.get('customerData').customers_id !== undefined
      ) {
        this.getProducts()
      }
    })
  }

  temp = () => {
    this.setState(
      {
        refreshing:
          this.props.isLoading.cartItems.wishListProducts.length > 5
      },
      () => {
        if (
          SyncStorage.get('customerData').customers_id != null &&
          SyncStorage.get('customerData').customers_id !== undefined
        ) {
          this.getProducts()
        }
      }
    )
  }

  /// ////
  renderFooter = () => (
    <View
      style={{
        marginBottom: 30,
        marginTop: 10,
        alignItems: 'center',
        alignSelf: 'center',
        alignContent: 'center'
      }}>
      {this.state.refreshing &&
      this.props.isLoading.cartItems.wishListProducts.length !== 0 ? (
          <View style={{ height: 20, marginTop: 30 }}>
            <UIActivityIndicator
              size={27}
              count={12}
              color={themeStyle.loadingIndicatorColor}
            />
          </View>
        ) : null}
    </View>
  )

  /// //////////////////////////////////////////
  getProducts = async () => {
    this.setState({ temp: true })
    var dat = {}
    if (SyncStorage.get('customerData').customers_id != null) { dat.customers_id = SyncStorage.get('customerData').customers_id }
    dat.page_number = this.state.page
    dat.type = 'wishlist'
    dat.language_id =
      SyncStorage.get('langId') === undefined ? '1' : SyncStorage.get('langId')
    dat.currency_code = SyncStorage.get('currencyCode')
    const json = await postHttp(getUrl() + '/api/' + 'getallproducts', dat)
    if (json.success == 1) {
      this.state.page++
      if (this.state.refreshing !== true) {
        this.state.wishListProducts = []
        this.props.isLoading.cartItems.wishListProducts = []
      }
      var prod = json.product_data
      for (const value of prod) {
        this.props.isLoading.cartItems.wishListProducts.push(value)
      }
      this.setState({
        wishListProducts: this.state.wishListProducts,
        temp: false,
        isRefreshing: false,
        refreshing: false
      })
    }

    this.setState({ temp: false, isRefreshing: false, refreshing: false })
  }

  render () {
    return (
      <View style={{ flex: 1, backgroundColor: themeStyle.backgroundColor }}>
        <FlatList
          data={['']}
          extraData={this.state}
          showsVerticalScrollIndicator={false}
          listKey={'products'}
          contentContainerStyle={{
            width: WIDTH,
            backgroundColor: themeStyle.backgroundColor
          }}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={() => this.renderFooter()}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefreshTemp.bind(this)}
            />
          }
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false
          }}
          onEndReached={() => {
          }}
          renderItem={item =>
            this.props.isLoading.cartItems.wishListProducts <= 0 &&
            this.state.temp &&
            !this.state.isRefreshing ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignSelf: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    marginTop:
                    this.props.isLoading.cartItems.wishListProducts.length === 0
                      ? HEIGHT * 0.4
                      : 0
                  }}>
                  <UIActivityIndicator
                    size={27}
                    color={themeStyle.loadingIndicatorColor}
                  />
                </View>
              ) : this.props.isLoading.cartItems.wishListProducts <= 0 ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: themeStyle.backgroundColor,
                    paddingTop: 6,
                    width: WIDTH,
                    marginTop:
                    this.props.isLoading.cartItems.wishListProducts.length === 0
                      ? HEIGHT * 0.3
                      : 0
                  }}>
                  <NavigationEvents
                    onDidFocus={() => {
                      this.setState({})
                    }}
                  />
                  <Icon name={'basket'} style={{ color: 'gray', fontSize: 80 }} />
                  <View>
                    <Text style={{
                      fontSize: themeStyle.largeSize + 2,
                      color: themeStyle.textColor
                    }}>
                      {
                        this.props.isLoading.Config.languageJson[
                          'Your wish List is empty'
                        ]
                      }
                    </Text>
                    <Text
                      style={{
                        fontSize: themeStyle.mediumSize,
                        alignSelf: 'center',
                        color: themeStyle.textColor
                      }}>
                      {
                        this.props.isLoading.Config.languageJson[
                          'Continue Shopping'
                        ]
                      }
                    </Text>
                    <TouchableOpacity
                      style={{ paddingTop: 5, width: 90, alignSelf: 'center' }}
                      onPress={() =>
                        this.props.navigation.navigate('NewestScreen', {
                          id: undefined,
                          name: undefined,
                          sortOrder: 'Newest'
                        })
                      }>
                      <View
                        style={{
                          alignItems: 'center',
                          height: 33,
                          width: 90,
                          backgroundColor: themeStyle.otherBtnsColor,
                          justifyContent: 'center',
                          elevation: 0.3,
                          marginTop: 5
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: themeStyle.otherBtnsText,
                            fontSize: themeStyle.mediumSize,
                            fontWeight: '500'
                          }}>
                          {this.props.isLoading.Config.languageJson.Explore}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  style={{
                    flex: 1,
                    backgroundColor: themeStyle.backgroundColor
                  }}
                  contentContainerStyle={{
                    backgroundColor: themeStyle.backgroundColor,
                    marginTop: 5
                  }}
                  columnWrapperStyle={{
                    alignContent: 'flex-start',
                    alignItems: 'flex-start',
                    padding: 0,
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
                  data={this.props.isLoading.cartItems.wishListProducts}
                  horizontal={false}
                  extraData={this.state}
                  numColumns={2}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.isRefreshing}
                      onRefresh={this.onRefreshTemp.bind(this)}
                    />
                  }
                  onMomentumScrollBegin={() => {
                    this.onEndReachedCalledDuringMomentum = false
                  }}
                  onEndReached={() => {
                    if (!this.onEndReachedCalledDuringMomentum) {
                      this.temp()
                      this.onEndReachedCalledDuringMomentum = true
                    }
                  }}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={item => (
                    <View>
                      <NavigationEvents
                        onDidFocus={() => {
                          this.setState({})
                        }}
                      />
                      <CardTem
                        objectArray={this.state.wishListProducts[item.index]}
                        rows={false}
                        removeButton
                        width={WIDTH * themeStyle.twoRowCardWIdth}
                      />
                    </View>
                  )}
                />
              )
          }
        />
      </View>
    )
  }
}
const mapStateToProps = state => ({
  isLoading: state
})
export default connect(mapStateToProps, null)(wishListScreen)
