import React, { PureComponent } from 'react'
import { CardStyleInterpolators } from 'react-navigation-stack'
import {
  View,
  FlatList,
  ScrollView,
  Linking,
  TouchableOpacity,
  Platform,
  Dimensions
} from 'react-native'
import { Text, Icon } from 'native-base'
import HTML from 'react-native-render-html'
import { connect } from 'react-redux'
import Toast from 'react-native-easy-toast'
import WooComFetch from '../common/WooComFetch'
import themeStyle from '../common/Theme.style'
const { width } = Dimensions.get('window')
class orderScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    return {
      headerTitle: headerStyle,
      headerRight: null,
      gestureEnabled: false,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      drawerLockMode: 'locked-closed',
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

  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.cartItems2.Config.languageJson['Order Detail']
    })
  }

  constructor (props) {
    super(props)
    this.state = {
      customerNotes: '',
      discount: 0,
      productsTotal: 0,
      totalAmountWithDisocunt: 0,
      paymentMethods: [],
      selectedPaymentMethod: '',
      selectedPaymentMethodTitle: '',
      order: {},
      tax: 0,
      loaderTaxCalculating: true,
      loaderPaymentMethods: true,
      wrapperCondition: false,
      radioButton: [],
      paymentText: '',
      paymentShowCondition: true,
      buttonEnable: false
    }
  }

  //= ===========================================================================================
  // placing order

  singleRow (header, body) {
    return (
      <View
        style={{
          backgroundColor: themeStyle.backgroundColor,
          justifyContent: 'space-between',
          shadowOffset: { width: 1, height: 1 },
          shadowColor: themeStyle.textColor,
          shadowOpacity: 0.5,
          margin: 10,
          marginTop: 10,
          marginBottom: 5,
          elevation: 5,
          width: '95%'
        }}>
        <View
          style={{
            justifyContent: 'space-between'
          }}>
          <Text
            style={{
              justifyContent: 'space-between',
              padding: 10,
              fontWeight: 'bold',
              fontSize: themeStyle.largeSize,
              backgroundColor: '#d3d3d3',
              color: themeStyle.textContrast
            }}>
            {header}
          </Text>

          <Text
            style={{
              justifyContent: 'space-between',
              padding: 10,
              fontSize: themeStyle.mediumSize,
              color: themeStyle.textColor
            }}>
            {body}
          </Text>
        </View>
      </View>
    )
  }

  multipleRow (header, body) {
    return (
      <View
        style={{
          backgroundColor: themeStyle.backgroundColor,
          justifyContent: 'space-between',
          shadowOffset: { width: 1, height: 1 },
          shadowColor: themeStyle.textColor,
          shadowOpacity: 0.5,
          margin: 10,
          marginTop: 10,
          marginBottom: 5,
          elevation: 5,
          width: '95%'
        }}>
        <View
          style={{
            justifyContent: 'space-between'
          }}>
          <Text
            style={{
              justifyContent: 'space-between',
              padding: 10,
              fontWeight: 'bold',
              backgroundColor: '#d3d3d3',
              fontSize: themeStyle.largeSize,
              color: themeStyle.textContrast
            }}>
            {header}
          </Text>

          <FlatList
            data={body}
            listKey={(item, index) => `D${index.toString()}`}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => ` 1${index.toString()}`}
            renderItem={item => (
              <Text
                style={{
                  justifyContent: 'space-between',
                  padding: 10,
                  fontSize: themeStyle.mediumSize,
                  color: themeStyle.textColor
                }}>
                {item.item.shipping_method}
              </Text>
            )}
          />
        </View>
        {/* ///////////////////////////////// */}
      </View>
    )
  }

  products (header, body) {
    return (
      <View
        style={{
          backgroundColor: themeStyle.backgroundColor,
          justifyContent: 'space-between',
          shadowOffset: { width: 1, height: 1 },
          shadowColor: themeStyle.textColor,
          shadowOpacity: 0.5,
          margin: 10,
          marginTop: 10,
          marginBottom: 5,
          elevation: 5,
          width: '95%'
        }}>
        <View
          style={{
            justifyContent: 'space-between'
          }}>
          <Text
            style={{
              justifyContent: 'space-between',
              padding: 10,
              fontWeight: 'bold',
              fontSize: themeStyle.largeSize,
              backgroundColor: '#d3d3d3',
              color: themeStyle.textContrast
            }}>
            {header}
          </Text>

          <FlatList
            data={body}
            listKey={(item, index) => `A${index.toString()}`}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => `2 ${index.toString()}`}
            renderItem={item => (
              <View>
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#d9d9d9',
                    marginBottom: 12
                  }}
                />
                <Text
                  style={{
                    fontSize: themeStyle.mediumSize,
                    color: themeStyle.textColor,
                    paddingLeft: 7,
                    paddingBottom: 4
                  }}>
                  {item.item.products_name}
                </Text>
                {this.singleRowDirection(
                  `${this.props.cartItems2.Config.languageJson.Price} :`,
                  this.addCurrecny(Number(item.item.products_price).toFixed(2))
                )}

                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={item.item.attributes}
                  listKey={(index) => `TT${index.toString()}`}
                  keyExtractor={(index) => `3 ${index.toString()}`}
                  renderItem={item2 =>
                    this.singleRowDirection(
                      `${item2.item.products_options_values +
                        ' '} :`,
                      item2.item.price_prefix +
                        ' ' +
                        item2.item.options_values_price +
                        ' ' +
                        (
                          <HTML
                            html={' ' + this.props.navigation.state.params.data.currency}
                            baseFontStyle={{
                              fontSize: themeStyle.mediumSize - 2,
                              color: themeStyle.textColor
                            }}
                          />
                        )
                    )
                  }
                />

                {this.singleRowDirection(
                  `${this.props.cartItems2.Config.languageJson.Quantity} :`,
                  item.item.products_quantity
                )}
                {this.singleRowDirection(
                  this.props.cartItems2.Config.languageJson.Total,
                  this.addCurrecny(Number(item.item.final_price).toFixed(2))
                )}
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#d9d9d9',
                    marginBottom: 12
                  }}
                />
              </View>
            )}
          />
        </View>
        {/* ///////////////////////////////// */}
      </View>
    )
  }

  singleRowDirection (text1, text2, t) {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          padding: 5,
          paddingLeft: 8,
          flexDirection: 'row',
          flex: 1
        }}>
        <Text
          style={{
            fontSize: themeStyle.mediumSize,
            fontWeight:
              text1 === 'Total' || text1 === 'مجموع' ? 'bold' : 'normal',
            color: themeStyle.textColor
          }}>
          {text1}{' '}
        </Text>
        {/* //////// */}
        {t === 'T' ? (
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              alignItems: 'center'
            }}>
            <TouchableOpacity
              style={{}}
              onPress={() => {
                Linking.canOpenURL(
                  this.props.cartItems2.Config.trackingUrl +
                    this.getTrackingId()
                )
                  .then(supported => {
                    if (!supported) {
                    } else {
                      return Linking.openURL(
                        this.props.cartItems2.Config.trackingUrl +
                          this.getTrackingId()
                      )
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
                  padding: 4
                }}>
                <Text
                  style={{
                    color: themeStyle.textColor,
                    fontSize: themeStyle.mediumSize,
                    paddingTop: 1
                  }}>
                  Track
                </Text>
                <Icon
                  name={'locate'}
                  style={{
                    color: 'white',
                    fontSize: themeStyle.mediumSize,
                    paddingLeft: 5
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            {t !== 'Coupon Code'
              ? <Text
                style={{
                  fontSize: themeStyle.mediumSize,
                  fontWeight:
                  text1 === 'Total' || text1 === 'مجموع' ? 'bold' : 'normal',
                  color: themeStyle.textColor
                }}>
                {text2}
              </Text>
              : <View style={{
                fontSize: themeStyle.mediumSize,
                fontWeight:
              text1 === 'Total' || text1 === 'مجموع' ? 'bold' : 'normal',
                color: themeStyle.textColor,
                flexWrap: 'wrap'
              }}>
                {
                  text2.map((value) => (
                    <Text
                      style={{
                        fontSize: themeStyle.mediumSize,
                        fontWeight:
                        text1 === 'Total' || text1 === 'مجموع' ? 'bold' : 'normal',
                        color: themeStyle.textColor,
                        paddingTop: 5
                      }}>
                      {value.code}
                    </Text>
                  ))
                }
              </View>
            }
            {`${this.props.cartItems2.Config.languageJson.Quantity} :` !==
            text1 && t !== 'Shipping Method' && t !== 'Coupon Code' ? (
                <HTML
                  html={' ' + this.props.navigation.state.params.data.currency}
                  baseFontStyle={{
                    fontSize: themeStyle.mediumSize,
                    color: themeStyle.textColor,
                    fontWeight:
                    text1 === 'Total' || text1 === 'مجموع' ? 'bold' : 'normal'
                  }}
                />
              ) : null}
          </View>
        )}
      </View>
    )
  }

  addCurrecny = v2 => <Text style={{ color: themeStyle.textColor }}>{v2}</Text>

  getTrackingId () {
    let id = ''
    for (const v of this.props.navigation.state.params.data.meta_data) {
      if (v.key === '_aftership_tracking_number') {
        id = v.value
      }
    }
    return id
  }

  getSubtotal () {
    let total = 0
    this.props.navigation.state.params.data.data.forEach(element => {
      total += element.final_price
    })
    return total
  }

  priceDetailCard (header) {
    return (
      <View
        style={{
          backgroundColor: themeStyle.backgroundColor,
          justifyContent: 'space-between',
          shadowOffset: { width: 1, height: 1 },
          shadowColor: themeStyle.textColor,
          shadowOpacity: 0.5,
          margin: 10,
          marginTop: 10,
          marginBottom: 5,
          elevation: 5,
          width: '95%'
        }}>
        <View
          style={{
            justifyContent: 'space-between'
          }}>
          <Text
            style={{
              justifyContent: 'space-between',
              padding: 10,
              fontWeight: 'bold',
              backgroundColor: '#d3d3d3',
              color: themeStyle.textContrast
            }}>
            {header}
          </Text>

          {this.singleRowDirection(
            this.props.cartItems2.Config.languageJson2['Sub Total'],
            this.getSubtotal()
          )}
          {this.singleRowDirection(
            this.props.cartItems2.Config.languageJson2['Shipping Method'],
            this.props.navigation.state.params.data.shipping_method,
            'Shipping Method'
          )}
          {this.singleRowDirection(
            this.props.cartItems2.Config.languageJson.Shipping + ' ' +
            this.props.cartItems2.Config.languageJson.Price,
            this.addCurrecny(
              Number(this.props.navigation.state.params.data.shipping_cost).toFixed(2)
            )
          )}

          { this.props.navigation.state.params.data.coupons.length !== 0
            ? this.singleRowDirection(
              this.props.cartItems2.Config.languageJson[
                'Coupon Code'
              ],
              this.props.navigation.state.params.data.coupons,
              'Coupon Code') : null}
          {this.props.navigation.state.params.data.coupons.length !== 0
            ? this.singleRowDirection(
              this.props.cartItems2.Config.languageJson2.Coupon + ' ' + this.props.cartItems2.Config.languageJson2.Discount,
            `-${this.props.navigation.state.params.data.coupon_amount}`,
            'Coupon Discount') : null }

          {this.singleRowDirection(this.props.cartItems2.Config.languageJson.Tax,
            this.props.navigation.state.params.data.total_tax

          )}
          {this.singleRowDirection(
            this.props.cartItems2.Config.languageJson.Total,
            this.addCurrecny(
              Number(this.props.navigation.state.params.data.order_price).toFixed(2)
            )
          )}
        </View>
        {/* ///////////////////////////////// */}
      </View>
    )
  }

  cancelOrder = async () => {
    const orderCreateDate = new Date(
      this.props.navigation.state.params.data.date_created
    )
    const orderSeconds = orderCreateDate.getTime() / 1000
    const timeknow = new Date()
    const currentTime = timeknow.getTime() / 1000

    const timeToCancelOrder = this.props.cartItems2.Config.cancelOrderTime * 3600
    const timeDiff = currentTime - orderSeconds
    const result = timeToCancelOrder - timeDiff

    if (result < 0) this.refs.toast.show('Order Cancelation Time Expires!')
    else {
      const dat = {
        status: 'cancelled'
      }
      await WooComFetch.updateShippingAddress(
        this.props.navigation.state.params.data.id,
        dat
      )
      this.refs.toast.show('Order Cancelled')
    }
  }

  render () {
    return (
      <View style={{ flex: 1, backgroundColor: themeStyle.backgroundColor }}>
        <Toast
          ref='toast'
          style={{ backgroundColor: '#c1c1c1' }}
          position='bottom'
          positionValue={200}
          fadeOutDuration={7000}
          textStyle={{ color: themeStyle.textColor, fontSize: themeStyle.mediumSize }}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            backgroundColor: themeStyle.backgroundColor,
            marginBottom: 30
          }}>
          {this.singleRow(
            this.props.cartItems2.Config.languageJson['Shipping Address'],
            `${this.props.navigation.state.params.data.delivery_street_address}, ${this.props.navigation.state.params.data.delivery_city}, ${this.props.navigation.state.params.data.delivery_state} ${this.props.navigation.state.params.data.delivery_postcode}, ${this.props.navigation.state.params.data.delivery_country}`
          )}

          {this.singleRow(
            this.props.cartItems2.Config.languageJson['Billing Address'],
            `${this.props.navigation.state.params.data.billing_street_address}, ${this.props.navigation.state.params.data.billing_city}, ${this.props.navigation.state.params.data.billing_state} ${this.props.navigation.state.params.data.billing_postcode}, ${this.props.navigation.state.params.data.billing_country}`
          )}

          {this.products(
            this.props.cartItems2.Config.languageJson.Products,
            this.props.navigation.state.params.data.data
          )}

          {this.priceDetailCard(
            this.props.cartItems2.Config.languageJson['Price Detail']
          )}

          {this.props.navigation.state.params.data.customer_comments != null
            ? this.singleRow(
              this.props.cartItems2.Config.languageJson['Order Notes'],
              this.props.navigation.state.params.data.customer_comments
            )
            : null}
          {this.props.navigation.state.params.data.admin_comments !== '' &&
          this.props.navigation.state.params.data.admin_comments != null
            ? this.singleRow(
              this.props.cartItems2.Config.languageJson2['Admin Notes'],
              this.props.navigation.state.params.data.admin_comments
            )
            : null}

          {this.singleRow(
            this.props.cartItems2.Config.languageJson['Payment Method'],

            this.props.navigation.state.params.data.payment_method
          )}

          {this.props.navigation.state.params.data.orders_status ===
            'Dispatched' &&
          this.props.navigation.state.params.data.deliveryboy_info.length >
            0 ? (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('TrackLocationScreen', {
                    data: this.props.navigation.state.params.data
                  })
                }}
                style={{
                  width: width * 0.95,
                  borderColor: '#fff',
                  alignItems: 'center',
                  height: 42,
                  backgroundColor: themeStyle.otherBtnsColor,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginTop: 8
                }}>
                <Text
                  style={{
                    color: themeStyle.textColor,
                    fontSize: themeStyle.mediumSize,
                    fontWeight: '500',
                    position: 'absolute'
                  }}>
                  {this.props.cartItems2.Config.languageJson2['TRACK ORDER']}
                </Text>
              </TouchableOpacity>
            ) : null}
        </ScrollView>
      </View>
    )
  }
}
const mapStateToProps = state => ({
  cartItems2: state
})

export default connect(mapStateToProps, null)(orderScreen)
