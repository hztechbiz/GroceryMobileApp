import React, { Component } from 'react'
import { View, FlatList, TouchableOpacity, Platform } from 'react-native'
import { UIActivityIndicator } from 'react-native-indicators'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { Container, Content, ListItem, CheckBox, Text, Body } from 'native-base'
import WooComFetch, { getUrl } from '../common/WooComFetch'
import SyncStorage from 'sync-storage'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import themeStyle from '../common/Theme.style'
class ShippingMethod extends Component {
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
    this.getData()
    this.props.navigation.setParams({
      headerTitle: this.props.cartItems2.Config.languageJson['Shipping Method']
    })
  }

  constructor (props) {
    super(props)

    this.state = {
      tick: [],
      isloading: true,
      buttonEnable: true,
      shippingMethod: [],
      selectedMethod: true,
      selectedvalue: '',
      dat: {}
    }
  }

  getData = async () => {
    const dat = {}
    dat.tax_zone_id = SyncStorage.get('orderDetails').tax_zone_id
    dat.state = SyncStorage.get('orderDetails').delivery_state
    dat.city = SyncStorage.get('orderDetails').delivery_city
    dat.country_id = SyncStorage.get('orderDetails').delivery_country_id
    dat.postcode = SyncStorage.get('orderDetails').delivery_postcode
    dat.zone = SyncStorage.get('orderDetails').delivery_zone
    dat.street_address = SyncStorage.get('orderDetails').delivery_street_address
    dat.products_weight = this.calculateWeight()
    dat.products_weight_unit = 'g'
    dat.products = this.getProducts()
    dat.language_id =
      SyncStorage.get('langId') === undefined ? 1 : SyncStorage.get('langId')
    dat.currency_code = this.props.cartItems2.Config.productsArguments.currency
    const data = await WooComFetch.postHttp(getUrl() + '/api/' + 'getrate', dat)
    const orderDetails = SyncStorage.get('orderDetails')
    if (data.data.success == 1) {
      var m = data.data.data.shippingMethods
      this.state.shippingMethod = Object.keys(m).map(function (key) {
        return m[key]
      })
      orderDetails.total_tax = data.data.data.tax
      SyncStorage.set('orderDetails', orderDetails)
    }
    this.setState({ isloading: false, shippingMethod: this.state.shippingMethod })
  } /// ///////////////////////////////////////////////////////////////////////////////////////////////

  //= ================================================================================================================================
  // calcualting products total weight
  calculateWeight = function () {
    var pWeight = 0
    var totalWeight = 0
    for (const value of SyncStorage.get('cartProducts')) {
      pWeight = parseFloat(value.weight)
      if (value.unit == 'kg') {
        pWeight = parseFloat(value.weight) * 1000
      }
      totalWeight = totalWeight + pWeight * value.customers_basket_quantity
    }
    return totalWeight
  }

  getProducts () {
    const temp = []
    SyncStorage.get('cartProducts').forEach(element => {
      temp.push({
        customers_basket_quantity: element.customers_basket_quantity,
        final_price: element.final_price,
        price: element.price,
        products_id: element.products_id,
        total: element.total,
        unit: element.unit,
        weight: element.weight
      })
    })
    return temp
  }

  // //= ================================================================================================================================
  setMethod (data, index) {
    const orderDetails = SyncStorage.get('orderDetails')
    orderDetails.shipping_cost = data.rate
    orderDetails.shipping_method = data.name + '(' + data.shipping_method + ')'
    SyncStorage.set('orderDetails', orderDetails)
    this.state.tick = []
    this.state.tick[index] = true
    this.setState({ buttonEnable: false })
  }

  proceedOrder () {
    this.props.navigation.push('OrderScreen')
  }

  /// //////////////////////////////////////////////////////////////////////////////////////////////////

  render () {
    return this.state.isloading ? (
      <View style={{
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
      <Container style={{
        backgroundColor: themeStyle.backgroundColor
      }}>
        <View style={{flex: 1}}>
          <FlatList
            data={this.state.shippingMethod}
            horizontal={false}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            renderItem={item => (
              <View>
                <View
                  style={{
                    justifyContent: 'center',
                    padding: 10,
                    paddingBottom: 14,
                    paddingTop: 14,
                    backgroundColor: themeStyle.backgroundColor
                  }}>
                  {item.item.services.length != 0 ? (
                    <Text style={{ color: themeStyle.textColor }}>{item.item.name}</Text>
                  ) : null}
                </View>

                {item.item.services.map((v, i) => (
                  <ListItem style={{ backgroundColor: 'gray', marginLeft: 0 }}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row'
                      }}
                      onPress={() => this.setMethod(v, item.index)}>
                      <Body>
                        <View>
                          <Text>
                            {v.name + ' ---- ' + v.rate + ' ' + v.currencyCode}
                          </Text>
                        </View>
                      </Body>
                      <CheckBox
                        onPress={() => this.setMethod(v, item.index)}
                        checked={this.state.tick[item.index]}
                      />
                    </TouchableOpacity>
                  </ListItem>
                ))}
              </View>
            )}
          />
        </View>

        <TouchableOpacity
          onPress={() => this.proceedOrder()}
          disabled={this.state.buttonEnable}>
          <View
            style={{
              borderColor: themeStyle.otherBtnsColor,
              alignItems: 'center',
              height: 40,
              width: wp('100%'),
              backgroundColor: themeStyle.otherBtnsColor,
              justifyContent: 'center',
              opacity: this.state.buttonEnable ? 0.4 : 0.9
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: themeStyle.otherBtnsText,
                fontSize: themeStyle.mediumSize,
                fontWeight: '500'
              }}>
              {this.props.cartItems2.Config.languageJson.Next}
            </Text>
          </View>
        </TouchableOpacity>
      </Container>
    )
  }
}
const mapStateToProps = state => ({
  cartItems2: state
})

export default connect(mapStateToProps, null)(ShippingMethod)