import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Platform
} from 'react-native'
import { UIActivityIndicator } from 'react-native-indicators'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { connect } from 'react-redux'
import SyncStorage from 'sync-storage'
import { Icon } from 'native-base'
import ShoppingCartIcon from '../common/ShoppingCartIcon'
import themeStyle from '../common/Theme.style'

class RewardPoints extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    return {
      headerTitle: headerStyle,
      headerRight: () => <ShoppingCartIcon navigation={navigation} />,
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
      headerTitle: this.props.isLoading.Config.languageJson['Reward Points']
    })
  }

  /// /////////////////
  constructor (props) {
    super(props)
    this.state = {
      page: 1,
      orders: [],
      httpRunning: true,
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
    fetch(
      `${
        this.props.isLoading.Config.url
      }/api/reactappusers/react_reward_points/?insecure=cool&user_id=${
        SyncStorage.get('customerData').id
      }`,
      {
        method: 'GET'
      }
    )
      .then(response => response.json())
      .then(data => {
        if (data.data.length !== 0) {
          this.state.orders = []
          for (const value of data.data) {
            this.state.orders.push(value)
          }
        }
        this.setState({ isRefreshing: false })
      })
      .catch(error => {
        console.log(error)
      })
  }

  /// ////////
  getOrders = async () => {
    fetch(
      `${
        this.props.isLoading.Config.url
      }/api/reactappusers/react_reward_points/?insecure=cool&user_id=${
        SyncStorage.get('customerData').id
      }`,
      {
        method: 'GET'
      }
    )
      .then(response => response.json())
      .then(data => {
        if (data.data.length !== 0) {
          for (const value of data.data) {
            this.state.orders.push(value)
          }
        }
        this.setState({ page: this.state.page++, loading: false })
      })
      .catch(error => {
        console.log(error)
      })
  }

  singaleRow (placeholderText, name, check, Status) {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          padding: 6,
          flexDirection: 'row',
          fontSize: themeStyle.mediumSize,
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
            fontSize: themeStyle.mediumSize,
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
            fontSize: themeStyle.mediumSize,
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
          <View
            style={{
              height: 20,
              marginTop: 30
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
  }

  totalPoints () {
    let t = 0
    for (const v of this.state.orders) {
      t += parseInt(v.points)
    }
    return t
  }

  render () {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: themeStyle.backgroundColor,
          paddingTop: 6
        }}>
        {this.state.orders.length === 0 &&
        !this.state.loading &&
        !this.state.isRefreshing &&
        !this.state.refreshing ? (
            <View style={styles.container}>
              <Icon name={'basket'} style={{ color: 'gray', fontSize: 80 }} />
              <View>
                <Text style={styles.welcome}>
                  {
                    this.props.isLoading.Config.languageJson[
                      'Your Rewards List is Empty'
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
                      borderColor: themeStyle.otherBtnsColor,
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
                        color: '#fff',
                        fontSize: 16
                      }}>
                      {this.props.isLoading.Config.languageJson.Explore}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
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
                        this.props.isLoading.Config.languageJson.Action,
                        `#${item.item.type}`,
                        0
                      )}

                      {this.singaleRow(
                        this.props.isLoading.Config.languageJson.Points,
                        item.item.points,
                        0
                      )}
                      {this.singaleRow(
                        this.props.isLoading.Config.languageJson.Date,
                        item.item.date.substr(0, item.item.date.indexOf(' ')),
                        0
                      )}
                    </View>
                  </View>
                </View>
              )}
            />
          )}
        </View>

        <View style={{ height: 50, backgroundColor: themeStyle.otherBtnsColor }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
              alignItems: 'center'
            }}>
            <Text
              style={{
                fontSize: themeStyle.largeSize,
                color: 'white'
              }}>{`${this.props.isLoading.Config.languageJson['Total Points Earned']}  :`}</Text>
            <Text style={{ fontSize: 18, color: 'white' }}>
              {this.totalPoints()}
            </Text>
          </View>
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
    fontSize: 18,
    textAlign: 'center',
    margin: 2
  },
  textStyle: {
    fontSize: 15,
    textAlign: 'center',
    margin: 2,
    color: 'gray'
  }
})
