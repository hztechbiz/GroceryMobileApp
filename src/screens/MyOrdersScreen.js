import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native'
import HTML from 'react-native-render-html'
import { UIActivityIndicator } from 'react-native-indicators'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { connect } from 'react-redux'
import WooComFetch, { getUrl } from '../common/WooComFetch'
import SyncStorage from 'sync-storage'
import { Icon } from 'native-base'
import themeStyle from '../common/Theme.style'
const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]
class RewardPoints extends Component {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    return {
      headerTitle: headerStyle,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
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
    this.getOrders()
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson['Customer Orders']
    })
  }

  /// /////////////////
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      orders: [],
      loading: true,
      refreshing: false,
      isRefreshing: false // for pull to refresh
    }
  }

  addCurrecny = (order, v2) => `${order.currency} ${v2}`
  /// /////////////////
  onRefreshTemp () {
    this.setState({ isRefreshing: true, page: 1 }, () => {
      this.onRefresh()
    })
  }

  /// //////////
  onRefresh = () => {
    this.getOrders()
  }

  /// ////////
  getOrders = async () => {
    const formData = new FormData()
    formData.append(
      'customers_id',
      SyncStorage.get('customerData').customers_id
    )
    formData.append(
      'language_id',
      SyncStorage.get('langId') === undefined ? 1 : SyncStorage.get('langId')
    )
    formData.append(
      'currency_code',
      this.props.isLoading.Config.productsArguments.currency
    )

    const data = await WooComFetch.postHttp(
      getUrl() + '/api/' + 'getorders',
      formData
    )
    if (data.success === '1') {
      this.state.orders = []
      this.state.orders = data.data.data
    }
    this.setState({ loading: false, refreshing: false, isRefreshing: false })
  }

  temp = () => {
    this.setState(
      { refreshing: this.state.orders.length > 5 },
      () => {
        this.getOrders()
      }
    )
  }

  handler = async () => {
    const data = await WooComFetch.getOrders(
      this.props.isLoading.Config.productsArguments,
      this.state.page,
      SyncStorage.get('customerData').id
    )
    if (data.length !== 0) {
      for (const value of data) {
        this.state.orders.push(value)
      }
    }
    this.setState({ refreshing: false })
  }

  singaleRow (placeholderText, name, check, Status) {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          padding: 6,
          flexDirection: 'row',
          backgroundColor:
            Status === 'Status' && name === 'Pending'
              ? themeStyle.primary
              : Status === 'Status' && name === 'Cancel'
                ? themeStyle.primary
                : Status === 'Status' && name === 'Inprocess'
                  ? themeStyle.primary
                  : Status === 'Status' && name === 'Completed'
                    ? themeStyle.primary
                    : Status === 'Status' && name === 'Delivered'
                      ? themeStyle.primary
                      : Status === 'Status' && name === 'Dispatched'
                        ? themeStyle.primary
                        : Status === 'Status' && name === 'Return'
                          ? themeStyle.primary
                          : themeStyle.backgroundColor
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: themeStyle.mediumSize,
            fontWeight: Status === 'Status' ? 'bold' : 'normal',
            color:
            Status === 'Status' && name === 'Pending'
              ? themeStyle.textColor
              : Status === 'Status' && name === 'Cancel'
                ? themeStyle.textColor
                : Status === 'Status' && name === 'Inprocess'
                  ? themeStyle.textColor
                  : Status === 'Status' && name === 'Completed'
                    ? themeStyle.textColor
                    : Status === 'Status' && name === 'Delivered'
                      ? themeStyle.textColor
                      : Status === 'Status' && name === 'Dispatched'
                        ? themeStyle.textColor
                        : Status === 'Status' && name === 'Return'
                          ? themeStyle.textColor
                          : themeStyle.textColor,
            paddingTop: 3
          }}>
          {placeholderText}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: themeStyle.mediumSize,
              color:
              Status === 'Status' && name === 'Pending'
                ? themeStyle.textColor
                : Status === 'Status' && name === 'Cancel'
                  ? themeStyle.textColor
                  : Status === 'Status' && name === 'Inprocess'
                    ? themeStyle.textColor
                    : Status === 'Status' && name === 'Completed'
                      ? themeStyle.textColor
                      : Status === 'Status' && name === 'Delivered'
                        ? themeStyle.textColor
                        : Status === 'Status' && name === 'Dispatched'
                          ? themeStyle.textColor
                          : Status === 'Status' && name === 'Return'
                            ? themeStyle.textColor
                            : themeStyle.textColor,
              fontWeight: check === 1 ? 'bold' : 'normal'
            }}>
            {name}
          </Text>
          {this.props.isLoading.Config.languageJson.Price ===
          placeholderText ? (
              <HTML
                html={' ' + Status}
                baseFontStyle={{
                  fontSize: themeStyle.largeSize - 2,
                  color: themeStyle.textColor
                }}
              />
            ) : null}
        </View>
      </View>
    )
  }

  renderFooter = () => (
    <View
      style={{
        marginBottom: 30,
        marginTop: 10,
        alignItems: 'center',
        alignSelf: 'center',
        alignContent: 'center'
      }}>
      {this.state.refreshing && this.state.orders.length !== 0 ? (
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

  render () {
    return (
      <View style={{ flex: 1, backgroundColor: themeStyle.backgroundColor }}>
        <FlatList
          data={['']}
          extraData={this.state}
          listKey={'products'}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
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
            if (!this.onEndReachedCalledDuringMomentum) {
              this.temp()
              this.onEndReachedCalledDuringMomentum = true
            }
          }}
          renderItem={item => (
            <View
              style={{
                flex: 1,
                backgroundColor: themeStyle.backgroundColor,
                paddingTop: 6,
                width: WIDTH,
                marginTop: this.state.orders.length === 0 ? HEIGHT * 0.4 : 0
              }}>
              {this.state.orders.length === 0 &&
              !this.state.loading &&
              !this.state.isRefreshing &&
              !this.state.refreshing ? (
                  <View style={{
                    flex: 8,
                    marginTop: -90,
                    alignItems: 'center',
                    backgroundColor: themeStyle.backgroundColor
                  }}>
                    <Icon name={'basket'} style={{ color: 'gray', fontSize: 80 }} />
                    <View>
                      <Text style={{
                        fontSize: themeStyle.largeSize + 2,
                        textAlign: 'center',
                        margin: 2,
                        color: themeStyle.textColor
                      }}>
                        {
                          this.props.isLoading.Config.languageJson2[
                            'Your Order List is Empty'
                          ]
                        }
                      </Text>
                      <Text style={styles.textStyle}>
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
                              fontSize: 16
                            }}>
                            {this.props.isLoading.Config.languageJson.Explore}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
              {/* ///////////////////////////////// */}
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                  backgroundColor: themeStyle.backgroundColor
                }}>
                {this.state.loading ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignSelf: 'center',
                      alignContent: 'center',
                      alignItems: 'center'
                    }}>
                    <UIActivityIndicator
                      size={27}
                      color={themeStyle.loadingIndicatorColor}
                    />
                  </View>
                ) : (
                  <FlatList
                    data={this.state.orders}
                    extraData={this.state}
                    listKey={'products'}
                    keyExtractor={(item, index) => index.toString()}
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
                    renderItem={item => (
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.push('OrderDetail', {
                            data: item.item
                          })
                        }}>
                        <View
                          style={{
                            backgroundColor: themeStyle.backgroundColor,
                            justifyContent: 'space-between',
                            shadowOffset: { width: 1, height: 1 },
                            shadowColor: themeStyle.textColor,
                            shadowOpacity: 0.5,
                            margin: 10,
                            marginTop: 3,
                            marginBottom: 5,
                            elevation: 5,
                            borderWidth: 1,
                            borderColor: themeStyle.primaryContrast
                          }}>
                          <View
                            style={{
                              justifyContent: 'space-between',
                              backgroundColor: themeStyle.backgroundColor
                            }}>
                            <View style={{
                              padding: 5,
                              backgroundColor: themeStyle.backgroundColor
                            }}>
                              {this.singaleRow(
                                this.props.isLoading.Config.languageJson[
                                  'Orders ID'
                                ],
                                `#${item.item.orders_id}`,
                                0
                              )}
                              {this.singaleRow(
                                this.props.isLoading.Config.languageJson.Date,
                                `${
                                 monthNames[new Date(item.item.last_modified.split(' ')[0]).getMonth()]
                                }, ${new Date(item.item.last_modified.split(' ')[0]).getDate()
                                 }, ${new Date(item.item.last_modified.split(' ')[0]).getUTCFullYear()}`
                                ,
                                0
                              )}
                              {this.singaleRow(
                                this.props.isLoading.Config.languageJson.Price,
                                item.item.order_price,
                                0,
                                item.item.currency
                              )}
                              {this.singaleRow(
                                this.props.isLoading.Config.languageJson.Status,
                                item.item.orders_status,
                                1,
                                'Status'
                              )}
                            </View>
                          </View>

                          {/* ///////////////////////////////// */}
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
            </View>
          )}
        />
      </View>
    )
  }
}
const mapStateToProps = state => ({
  isLoading: state
})

export default connect(mapStateToProps, null)(RewardPoints)

const styles = StyleSheet.create({
  textStyle: {
    fontSize: themeStyle.mediumSize,
    textAlign: 'center',
    margin: 2,
    color: 'gray',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center'
  }
})
