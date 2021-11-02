import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Linking,
  Platform
} from 'react-native'
import { UIActivityIndicator } from 'react-native-indicators'
import { connect } from 'react-redux'
import { CardStyleInterpolators } from 'react-navigation-stack'
import WooComFetch from '../common/WooComFetch'
import SyncStorage from 'sync-storage'
import { Icon } from 'native-base'
import themeStyle from '../common/Theme.style'
import ShoppingCartIcon from '../common/ShoppingCartIcon'
class RewardPoints extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    return {
      headerTitle: headerStyle,
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
      gestureEnabled: true,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
    }
  }

  componentDidMount () {
    this.getOrders()
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson.Downloads
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

  /// ////////////////
  addCurrecny = (order, v2) => `${order.currency} ${v2}`
  /// /////////////////
  onRefreshTemp () {
    this.setState({ isRefreshing: true, page: 1 }, () => {
      this.onRefresh()
    })
  }

  /// //////////
  onRefresh = async () => {
    const data = await WooComFetch.getDownloads(
      this.props.isLoading.Config.productsArguments,
      SyncStorage.get('customerData').id
    )
    if (data.length !== 0) {
      this.state.orders = []
      for (const value of data) {
        this.state.orders.push(value)
      }
    }
    this.setState({ isRefreshing: false })
  }

  /// ////////
  getOrders = async () => {
    const data = await WooComFetch.getDownloads(
      this.props.isLoading.Config.productsArguments,
      SyncStorage.get('customerData').id
    )
    if (data.length !== 0) {
      for (const value of data) {
        this.state.orders.push(value)
      }
    }
    this.setState({ page: this.state.page++, loading: false })
  }

  singaleRow (placeholderText, name, check, Status) {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          padding: 6,
          flexDirection: 'row',
          backgroundColor:
            Status === 'Status' && name === 'pending'
              ? 'yellow'
              : Status === 'Status' && name === 'refunded'
                ? 'orange'
                : Status === 'Status' && name === 'cancelled'
                  ? 'red'
                  : Status === 'Status' && name === 'failed'
                    ? 'gray'
                    : Status === 'Status' && name === 'processing'
                      ? 'blue'
                      : Status === 'Status' && name === 'completed'
                        ? 'green'
                        : 'white'
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 14,
            color:
              Status === 'Status' && name === 'pending'
                ? 'white'
                : Status === 'Status' && name === 'refunded'
                  ? 'white'
                  : Status === 'Status' && name === 'cancelled'
                    ? 'white'
                    : Status === 'Status' && name === 'failed'
                      ? 'white'
                      : Status === 'Status' && name === 'processing'
                        ? 'white'
                        : Status === 'Status' && name === 'completed'
                          ? 'white'
                          : themeStyle.textColor,
            paddingTop: 3
          }}>
          {placeholderText}
        </Text>

        <Text
          style={{
            textAlign: 'center',
            fontSize: 14,
            color:
              Status === 'Status' && name === 'pending'
                ? 'white'
                : Status === 'Status' && name === 'refunded'
                  ? 'white'
                  : Status === 'Status' && name === 'cancelled'
                    ? 'white'
                    : Status === 'Status' && name === 'failed'
                      ? 'white'
                      : Status === 'Status' && name === 'processing'
                        ? 'white'
                        : Status === 'Status' && name === 'completed'
                          ? 'white'
                          : themeStyle.textColor,
            fontWeight: check === 1 ? 'bold' : 'normal'
          }}>
          {name}
        </Text>
      </View>
    )
  }

  renderFooter = () => {
    return (
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
  }

  render () {
    return (
      <View style={{ flex: 1, backgroundColor: themeStyle.backgroundColor, paddingTop: 6 }}>
        {this.state.orders.length === 0 &&
        !this.state.loading &&
        !this.state.isRefreshing &&
        !this.state.refreshing ? (
            <View style={styles.container}>
              <Icon name={'download'} style={{ color: 'gray', fontSize: 80 }} />
              <View>
                <Text style={styles.welcome}>
                  {
                    this.props.isLoading.Config.languageJson[
                      'Your Download List is Empty'
                    ]
                  }
                </Text>
                <Text style={styles.textStyle}>
                  {this.props.isLoading.Config.languageJson['Continue Shopping']}
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
                      borderColor: '#51688F',
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
          ) : null}
        {/* ///////////////////////////////// */}
        <View
          style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
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
              renderItem={item => (
                <View
                  style={{
                    backgroundColor: themeStyle.backgroundColor,
                    justifyContent: 'space-between',
                    shadowOffset: { width: 1, height: 1 },
                    shadowColor: '#000',
                    shadowOpacity: 0.5,
                    margin: 10,
                    marginTop: 3,
                    marginBottom: 5,
                    elevation: 5
                  }}>
                  <View
                    style={{
                      justifyContent: 'space-between'
                    }}>
                    <View style={{ padding: 5 }}>
                      {this.singaleRow(
                        this.props.isLoading.Config.languageJson.Product,
                        `#${item.item.product_name}`,
                        0
                      )}

                      {this.singaleRow(
                        this.props.isLoading.Config.languageJson[
                          'Downloads remaining'
                        ],
                        item.item.downloads_remaining,
                        1,
                        'Status'
                      )}
                      {item.item.access_expires === 'never'
                        ? this.singaleRow(
                          this.props.isLoading.Config.languageJson.Expires,
                          item.item.access_expires,
                          0
                        )
                        : this.singaleRow(
                          item.item.date.substr(
                            0,
                            item.item.access_expires.indexOf(' ')
                          ),
                          item.item.access_expires,
                          0
                        )}

                      <TouchableOpacity
                        style={{}}
                        onPress={() => {
                          Linking.canOpenURL(item.item.download_url)
                            .then(supported => {
                              if (!supported) {
                              } else {
                                return Linking.openURL(item.item.download_url)
                              }
                            })
                            .catch(err => console.log('An error occurred', err))
                        }}
                        disabled={this.state.addToCartButtonValue}>
                        <View
                          style={{
                            borderColor: '#fff',
                            alignItems: 'center',
                            height: 38,
                            backgroundColor: themeStyle.primary,
                            flexDirection: 'row',
                            padding: 4,
                            justifyContent: 'center',
                            width: '100%'
                          }}>
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 17,
                              paddingTop: 1
                            }}>
                            {this.props.isLoading.Config.languageJson.Test}
                          </Text>
                          <Icon
                            name={'download'}
                            style={{
                              color: 'white',
                              fontSize: 22,
                              paddingLeft: 5
                            }}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </View>
    )
  }
}
const mapStateToProps = state => ({
  isLoading: state
})

export default connect(mapStateToProps, null)(RewardPoints)

const styles = StyleSheet.create({
  container: {
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeStyle.backgroundColor
  },
  welcome: {
    fontSize: themeStyle.largeSize + 2,
    textAlign: 'center',
    margin: 2,
    color: themeStyle.textColor
  },
  textStyle: {
    fontSize: themeStyle.mediumSize + 1,
    textAlign: 'center',
    margin: 2,
    color: 'gray'
  }
})
