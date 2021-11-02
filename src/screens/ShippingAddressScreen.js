import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Switch,
  Platform,
  I18nManager,
  Dimensions,
  Alert
} from 'react-native'
import { UIActivityIndicator } from 'react-native-indicators'
import { CardStyleInterpolators } from 'react-navigation-stack'
import Dialog, { DialogContent } from 'react-native-popup-dialog'
import auth from '@react-native-firebase/auth'
import themeStyle from '../common/Theme.style'
import { getUrl, postHttp } from '../common/WooComFetch'
import * as global from '../common/LocationData'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import SyncStorage from 'sync-storage'
import ShoppingCartIcon from '../common/ShoppingCartIcon'
import Spinner from 'react-native-loading-spinner-overlay'
import { CountryCodePicker, CountryCodeKey } from './CountryCodes'
import { Picker, Content, Icon } from 'native-base'
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js'
const WIDTH = Dimensions.get('window').width
class ShippingAddress extends Component {
  /// /////////////////////////////////////////////////////////
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

  /// /////////////////////////////////////////////////////////
  componentDidMount () {
    this.shippingInput = ['', '', '', '', '', '', '', '', '']
    this.billingInput = ['', '', '', '', '', '', '', '', '', '', '']
    if (SyncStorage.get('gustLogin') === false) {
      this.getUserAddress()
    }
    this.form = ''
    this.props.navigation.setParams({
      headerTitle: this.props.cartItems2.Config.languageJson.Address
    })
  }

  /// //////////////////////////////////////////////////////////
  constructor (props) {
    super(props)
    this.state = {
      myAccountData: {},
      password: '',
      errorMessage: '',
      errorEmailMessage: '',
      errorPhoneMessage: '',
      spinnerTemp: false,
      shippingData: [],
      billingArray: [],
      defaultAddress: false,
      placeholderArray: [
        this.props.cartItems2.Config.languageJson['First Name'],
        this.props.cartItems2.Config.languageJson['Last Name'],
        this.props.cartItems2.Config.languageJson2.Location,
        this.props.cartItems2.Config.languageJson.Address,
        this.props.cartItems2.Config.languageJson.Country,
        this.props.cartItems2.Config.languageJson.Zone,
        this.props.cartItems2.Config.languageJson.City,
        this.props.cartItems2.Config.languageJson['Post code']
      ],

      placeholderArray2: [
        this.props.cartItems2.Config.languageJson['First Name'],
        this.props.cartItems2.Config.languageJson['Last Name'],
        this.props.cartItems2.Config.languageJson.Address,
        this.props.cartItems2.Config.languageJson.Country,
        this.props.cartItems2.Config.languageJson.Zone,
        this.props.cartItems2.Config.languageJson.City,
        this.props.cartItems2.Config.languageJson['Post code']
      ],
      switch2Value: false,
      disableCondition: true,
      currentLabel: '',
      currency: '',
      otherArray: [{ value: 'other', name: 'other' }],
      activityIndicatorTemp: SyncStorage.get('gustLogin') === false,
      visible: false,
      userData: {},
      code: '',
      code2: '',
      confirmResult: '',
      confirmResult2: '',
      phone: '',
      shippingCountryCode: '228',
      invalidCode: false,
      invalidCode2: false,
      itemVal: '',
      text: '',
      textSize: 15,
      phone2: '',
      billingCountryCode: '228',
      itemVal3: '',
      text3: '',
      textSize3: 15
    }
  }
  /// ////////////////////////////////////////

  getUserAddress = async () => {
    const orderDetails = SyncStorage.get('orderDetails')
    const formData = new FormData()
    formData.append(
      'customers_id',
      SyncStorage.get('customerData').customers_id
    )
    const data = await postHttp(getUrl() + '/api/' + 'getalladdress', formData)
    if (data.success === '1') {
      var allShippingAddress = data.data
      let tempObject = {}
      for (const value of allShippingAddress) {
        if (value.default_address === 1) {
          tempObject = value
        } else if (allShippingAddress.length > 1) {
          tempObject = allShippingAddress[0]
        } else if (allShippingAddress.length === 1) {
          tempObject = value
        }
      }
      orderDetails.tax_zone_id = tempObject.zone_id
      orderDetails.delivery_firstname = tempObject.firstname
      orderDetails.delivery_lastname = tempObject.lastname
      orderDetails.delivery_state = tempObject.state
      orderDetails.delivery_city = tempObject.city
      orderDetails.delivery_postcode = tempObject.postcode
      orderDetails.delivery_zone = tempObject.zone_name
      orderDetails.delivery_country = tempObject.country_name
      orderDetails.delivery_country_id = tempObject.countries_id
      orderDetails.delivery_street_address = tempObject.street
      if (tempObject.zone_code == null) {
        orderDetails.delivery_zone = 'other'
        orderDetails.delivery_state = 'other'
        tempObject.zone_name = 'other'
        orderDetails.tax_zone_id = null
      }
      this.state.shippingData = tempObject
    }
    orderDetails.delivery_phone = SyncStorage.get(
      'customerData'
    ).customers_telephone
    SyncStorage.set('orderDetails', orderDetails)
    this.setState({
      activityIndicatorTemp: false,
      shippingData: this.state.shippingData
    })
  }

        // function for controlled text
        onTextChange = (number) => {
          if (this.state.shippingData.phonenumber === undefined) { this.state.shippingData.phonenumber = '' }
          const num = parsePhoneNumberFromString(number, CountryCodeKey[this.state.shippingCountryCode][0])
          const reg = /^[0-9]/
          if (!!num && this.state.shippingData.phonenumber.toString().length > number.length && !reg.test(this.state.shippingData.phonenumber[this.state.shippingData.phonenumber.toString().length - 1])) {
            let phone = num.nationalNumber.split('')
            phone.pop()
            phone = phone.join('')
            this.state.shippingData.phonenumber = phone
            this.setState({ shippingData: this.state.shippingData })
          } else {
            this.state.shippingData.phonenumber = new AsYouType(CountryCodeKey[this.state.shippingCountryCode][0]).input(number)
            this.setState({ shippingData: this.state.shippingData })
          }
        }

              // function for controlled text
              onTextChange2 = (number) => {
                if (this.state.billingArray.phonenumber !== undefined) {
                  this.state.billingArray.phonenumber = ''
                }
                const num = parsePhoneNumberFromString(number, CountryCodeKey[this.state.billingCountryCode][0])
                const reg = /^[0-9]/
                if (!!num && this.state.billingArray.phonenumber.toString().length > number.length && !reg.test(this.state.billingArray.phonenumber[this.state.billingArray.phonenumber.toString().length - 1])) {
                  let phone = num.nationalNumber.split('')
                  phone.pop()
                  phone = phone.join('')
                  this.state.billingArray.phonenumber = phone
                  this.setState({ billingArray: this.state.billingArray })
                } else {
                  this.state.billingArray.phonenumber = new AsYouType(CountryCodeKey[this.state.billingCountryCode][0]).input(number)
                  this.setState({ billingArray: this.state.billingArray })
                }
              }

              signInWithPhone2 = () => {
                const num = parsePhoneNumberFromString(this.state.billingArray.phonenumber, CountryCodeKey[this.state.billingCountryCode][0])
                if (!!num && num.isPossible()) {
                  this.signInWithPhoneNumber2(num.number.toString())
                } else {
                  this.setState({ spinnerTemp: false }, () => {
                    Alert.alert(this.props.cartItems2.Config.languageJson2['Please enter a valid phone number'])
                  })
                }
              }

        signInWithPhone = () => {
          const num = parsePhoneNumberFromString(this.state.shippingData.phonenumber, CountryCodeKey[this.state.shippingCountryCode][0])
          if (!!num && num.isPossible()) {
            this.signInWithPhoneNumber(num.number.toString())
          } else {
            this.setState({ spinnerTemp: false }, () => {
              Alert.alert(this.props.cartItems2.Config.languageJson2['Please enter a valid phone number'])
            })
          }
        }

        // Handle the button press
        signInWithPhoneNumber = async (phoneNumber) => {
          try {
            if (phoneNumber !== null && phoneNumber !== undefined) {
              auth()
                .signInWithPhoneNumber(phoneNumber)
                .then((confirmResult) => {
                  this.setState({
                    visible: true,
                    confirmResult,
                    spinnerTemp: false,
                    phone: phoneNumber
                  })
                })
            } else {
              Alert.alert('Invalid Phone Number')
              this.setState({ spinnerTemp: false })
            }
          } catch (err) {
            this.setState({ spinnerTemp: false }, () => {
              Alert.alert(this.props.cartItems2.Config.languageJson2['Please enter a valid phone number'])
            })
          }
        };

               // Handle the button press
               signInWithPhoneNumber2 = async (phoneNumber) => {
                 try {
                   if (phoneNumber !== null && phoneNumber !== undefined) {
                     auth()
                       .signInWithPhoneNumber(phoneNumber)
                       .then((confirmResult2) => {
                         this.setState({
                           visible2: true,
                           confirmResult2,
                           spinnerTemp: false,
                           phone2: phoneNumber
                         })
                       })
                   } else {
                     Alert.alert('Invalid Phone Number')
                     this.setState({ spinnerTemp: false })
                   }
                 } catch (err) {
                   this.setState({ spinnerTemp: false }, () => {
                     Alert.alert(this.props.cartItems2.Config.languageJson2['Please enter a valid phone number'])
                   })
                 }
               };

               phoneNumberCheck () {
                 const reg = /^([0-9\\(\\)\\/\\+ -]*)$/
                 return (
                   (this.state.billingArray.phonenumber.length >= 11) && reg.test(this.state.billingArray.phonenumber) === true
                 )
               }

        confirmCode = async (code) => {
          try {
            await code.confirm(this.state.code)
            this.setState({
              visible: false,
              spinnerTemp: false,
              pin: '',
              code: '',
              invalidCode: false
            }, () => {
              if (this.state.shippingData.phonenumber !== this.state.billingArray.phonenumber) {
                this.signInWithPhone2(this.state.shippingData.phonenumber)
              } else {
                this.setAddress()
              }
            })
          } catch (error) {
            this.setState({ spinnerTemp: false, code: '', code2: '', invalidCode: true })
          }
        };

        confirmshippingCountryCode = async (code) => {
          try {
            await code.confirm(this.state.code2)
            this.setState({
              visible2: false,
              spinnerTemp: false,
              pin: '',
              invalidCode2: false
            }, () => {
              this.setAddress()
            })
          } catch (error) {
            this.setState({ spinnerTemp: false, code: '', code2: '', invalidCode2: true })
          }
        };
        /// /////////////////////////////////////////

  refresh = (name, selectedValue, id, temp) => {
    if (temp === 'country') {
      this.state.shippingData.entry_country_id = id
      this.state.shippingData.country_name = name
      this.state.shippingData.zone_name = SyncStorage.get('tempdata').entry_zone
    }
    if (temp === 'zone') {
      this.state.shippingData.zone_name = name
      this.state.shippingData.zone_id = id
    }
    this.setState({
      shippingData: this.state.shippingData,
      placeholderArray: this.state.placeholderArray
    })
  }

  refresh2 = (name, selectedValue, id, temp) => {
    if (temp === 'country') {
      this.state.billingArray.entry_country_id = id
      this.state.billingArray.country_name = name
      this.state.billingArray.zone_name = SyncStorage.get('tempdata').entry_zone
    }
    if (temp === 'zone') {
      this.state.billingArray.zone_name = name
      this.state.billingArray.zone_id = id
    }
    this.setState({
      billingArray: this.state.billingArray,
      placeholderArray: this.state.placeholderArray
    })
  }

  isEmptyArray () {
    let temp = 0

    let temp2 = 0
    for (let i = 0; i <= 10; i++) {
      if (this.state.billingArray[i] !== undefined) {
        temp++
      }
    }
    for (let i = 0; i <= 8; i++) {
      if (this.state.shippingData[i] !== undefined) {
        temp2++
      }
    }
    if (temp === 11 && temp2 === 9) {
      temp = 0
      this.setState({ disableCondition: false, errorMessage: '' })
    } else {
      this.setState({ disableCondition: true, errorMessage: '' })
    }
  }

  // return false;
  getCountryName (val) {
    let name = ''
    for (const v of global.data.countries) {
      if (val.toString() === v.name.toString()) {
        name = v.value
      }
    }
    return name
  }

  getCountryNameArray () {
    const name = []
    for (const v of global.data.countries) {
      name.push(v.name)
    }
    return name
  }

  getStateName (val, val2) {
    let name = ''
    if (global.data.states[val]) {
      for (const v of global.data.states[val]) {
        if (val2 === v.name) name = v.value
      }
    } else {
      name = 'other'
    }

    return name
  }

  // <!-- 2.0 updates -->
  setAddress () {
    const orderDetails = SyncStorage.get('orderDetails')
    orderDetails.billing_firstname = this.state.billingArray.firstname
    orderDetails.billing_lastname = this.state.billingArray.lastname
    orderDetails.billing_state = this.state.billingArray.zone_name
    orderDetails.billing_location = orderDetails.delivery_location
    orderDetails.billing_city = this.state.billingArray.city
    orderDetails.billing_postcode = this.state.billingArray.postcode
    orderDetails.billing_zone = this.state.billingArray.zone_name
    orderDetails.billing_country = this.state.billingArray.country_name
    orderDetails.billing_street_address = this.state.billingArray.street
    orderDetails.billing_phone = this.state.billingArray.phonenumber
    orderDetails.delivery_firstname = this.state.shippingData.firstname
    orderDetails.delivery_lastname = this.state.shippingData.lastname
    orderDetails.delivery_state = this.state.shippingData.state
    orderDetails.delivery_city = this.state.shippingData.city
    orderDetails.delivery_postcode = this.state.shippingData.postcode
    orderDetails.delivery_zone = this.state.shippingData.zone_name
    orderDetails.delivery_country = this.state.shippingData.country_name
    orderDetails.delivery_street_address = this.state.shippingData.street
    SyncStorage.set('orderDetails', orderDetails)
    this.props.navigation.navigate('ShippingMethodScreen')
  }

  /// ///////////////////////////////////////
  getCountryNameReverse (val) {
    let name = ''
    for (const v of global.data.countries) {
      if (val.toString() === v.value.toString()) {
        name = v.name
      }
    }
    return name
  }

  getStateNameReverse (val, val2) {
    let name = ''
    if (global.data.states[val]) {
      for (const v of global.data.states[val]) {
        if (val2 === v.value) name = v.name
      }
    } else {
      name = 'other'
    }

    return name
  }

  /// ///////////////////////////////////////
  searchFilterFun (text, name, selection, nav) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate(nav, {
            data: text,
            id: this.state.shippingData.entry_country_id,
            page: 'shipping',
            onSelectionBase: selection,
            onGoBack: (name, selectedValue, id, temp) =>
              this.refresh(name, selectedValue, id, temp)
          })
        }>
        <View
          style={{
            marginRight: 20,
            marginLeft: 20,
            marginTop: 20,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 4,
            width: wp('90%'),
            borderRadius: 1,
            borderBottomWidth: 1,
            borderColor: '#c0c0c0'
          }}>
          <Text
            style={{
              color:
                name === 'Country' || name === 'Zone' ? '#c0c0c0' : themeStyle.textColor,
              fontSize: themeStyle.mediumSize,
              paddingRight: 6,
              writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
              textAlign: 'justify',
              marginLeft: 5
            }}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  getLocationAddress (name) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('MapScreen', {
            onGoBackFun: (cord) => {
              const orderDetails = SyncStorage.get('orderDetails')
              orderDetails.latitude = cord.latitude
              orderDetails.longitude = cord.longitude
              orderDetails.delivery_location = cord.latitude + ', ' + cord.longitude
              SyncStorage.set('orderDetails', orderDetails)
              this.state.shippingData.delivery_location = cord.latitude + ', ' + cord.longitude
              this.setState({})
            }
          })
        }>
        <View
          style={{
            marginRight: 20,
            marginLeft: 20,
            marginTop: 20,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 4,
            width: wp('90%'),
            borderRadius: 1,
            borderBottomWidth: 1,
            borderColor: '#c0c0c0',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
          <Text
            style={{
              color:
                name === 'Location' ? '#c0c0c0' : themeStyle.textColor,
              fontSize: themeStyle.mediumSize,
              paddingRight: 6,
              writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
              textAlign: 'justify'
            }}>
            {name}
          </Text>
          <Icon name={'md-locate'} style={{
            color: '#c0c0c0',
            fontSize: 18,
            marginRight: 5,
            marginBottom: -3
          }} />
        </View>

      </TouchableOpacity>
    )
  }

  searchFilterFun2 (text, name, selection, nav) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate(nav, {
            data: text,
            id: this.state.billingArray.entry_country_id,
            page: '',
            onSelectionBase: selection,
            onGoBack: (name, selectedValue, id, temp) =>
              this.refresh2(name, selectedValue, id, temp)
          })
        }>
        <View
          style={{
            marginRight: 20,
            marginLeft: 20,
            marginTop: 20,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 4,
            width: wp('90%'),
            borderRadius: 1,
            borderBottomWidth: 1,
            borderColor: '#c0c0c0'
          }}>
          <Text
            style={{
              color:
                name === 'Country' || name === 'Zone' ? '#c0c0c0' : themeStyle.textColor,
              fontSize: themeStyle.mediumSize,
              paddingRight: 6,
              writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
              textAlign: 'justify',
              marginLeft: 5
            }}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  /// ////////////////////////////////////////
  customTextView (placeholderText, index) {
    return placeholderText ===
    this.props.cartItems2.Config.languageJson2.Location ? (
        <View>
          {this.getLocationAddress(this.state.shippingData.delivery_location === undefined ||
            this.state.shippingData.delivery_location === null
            ? placeholderText
            : this.state.shippingData.delivery_location)}

        </View>
      ) : placeholderText ===
      this.props.cartItems2.Config.languageJson.Country ? (
          <View>
            {this.searchFilterFun(
              global.data.countries,
              this.state.shippingData.country_name === undefined ||
            this.state.shippingData.country_name === null
                ? placeholderText
                : this.state.shippingData.country_name,
              'shipping',
              'SearchFilterClass'
            )}
          </View>
        ) : placeholderText === this.props.cartItems2.Config.languageJson.Zone ? (
          <View>
            {this.searchFilterFun(
              global.data.countries,
              this.state.shippingData.zone_name === undefined ||
            this.state.shippingData.zone_name === null
                ? placeholderText
                : this.state.shippingData.zone_name,
              'shipping',
              'SearchFilterZone'
            )}
          </View>
        ) : (
          <TouchableOpacity activeOpacity={1}>
            <TextInput
              ref={c => {
                this.form = c
              }}
              style={{
                marginTop: 20,
                height: 38,
                width: wp('90%'),
                borderColor: index === 8 ? (this.phoneNumberCheckshipping() ||
                this.state.shippingData.phonenumber === undefined) ? '#c0c0c0' : 'red' : '#c0c0c0',
                borderBottomWidth: 1,
                marginLeft: 20,
                fontSize: themeStyle.mediumSize,
                textAlign: I18nManager.isRTL ? 'right' : 'left',
                paddingLeft: 6,
                paddingRight: 6,
                color: themeStyle.textColor
              }}
              keyboardType={index === 8 ? Platform.OS === 'ios' ? 'number-pad' : 'phone-pad' : 'default'}
              selectionColor='#51688F'
              placeholder={` ${placeholderText}`}
              placeholderTextColor={'#c0c0c0'}
              onChangeText={text => {
                index === 0
                  ? (this.state.shippingData.firstname = text)
                  : index === 1
                    ? (this.state.shippingData.lastname = text)
                    : index === 3
                      ? (this.state.shippingData.street = text)
                      : index === 4
                        ? (this.state.shippingData.country_name = text)
                        : index === 5
                          ? (this.state.shippingData.zone_name = text)
                          : index === 6
                            ? (this.state.shippingData.city = text)
                            : index === 7
                              ? (this.state.shippingData.postcode = text)
                              : (this.state.shippingData.phonenumber = text)
                this.setState({ shippingData: this.state.shippingData })
              }}
              value={
                index === 0
                  ? this.state.shippingData.firstname
                  : index === 1
                    ? this.state.shippingData.lastname
                    : index === 3
                      ? this.state.shippingData.street
                      : index === 4
                        ? this.state.shippingData.country_name
                        : index === 5
                          ? this.state.shippingData.zone_name
                          : index === 6
                            ? this.state.shippingData.city
                            : index === 7
                              ? this.state.shippingData.postcode
                              : this.state.shippingData.phonenumber
              }
            />
          </TouchableOpacity>
        )
  }

  customTextView2 (placeholderText, index) {
    return placeholderText ===
      this.props.cartItems2.Config.languageJson.Country ? (
        <View>
          {this.searchFilterFun2(
            global.data.countries,
            this.state.billingArray.country_name === undefined ||
            this.state.billingArray.country_name === null
              ? placeholderText
              : this.state.billingArray.country_name,
            '',
            'SearchFilterClass'
          )}
        </View>
      ) : placeholderText === this.props.cartItems2.Config.languageJson.Zone ? (
        <View>
          {this.searchFilterFun2(
            global.data.countries,
            this.state.billingArray.zone_name === undefined ||
            this.state.billingArray.zone_name === null
              ? placeholderText
              : this.state.billingArray.zone_name,
            '',
            'SearchFilterZone'
          )}
        </View>
      ) : (
        <TouchableOpacity activeOpacity={1}>
          <TextInput
            ref={c => {
              this.form = c
            }}
            style={{
              marginTop: 20,
              height: 38,
              width: wp('90%'),
              borderColor: index === 7 ? (this.phoneNumberCheckbillingArray() ||
              this.state.billingArray.phonenumber === undefined) ? '#c0c0c0' : 'red' : '#c0c0c0',
              borderBottomWidth: 1,
              marginLeft: 20,
              fontSize: themeStyle.mediumSize,
              textAlign: I18nManager.isRTL ? 'right' : 'left',
              paddingLeft: 6,
              paddingRight: 6,
              color: themeStyle.textColor
            }}
            selectionColor='#51688F'
            keyboardType={index === 7 ? Platform.OS === 'ios' ? 'number-pad' : 'phone-pad' : 'default'}
            placeholder={` ${placeholderText}`}
            placeholderTextColor={'#c0c0c0'}
            onChangeText={text => {
              index === 0
                ? (this.state.billingArray.firstname = text)
                : index === 1
                  ? (this.state.billingArray.lastname = text)
                  : index === 2
                    ? (this.state.billingArray.street = text)
                    : index === 3
                      ? (this.state.billingArray.country_name = text)
                      : index === 4
                        ? (this.state.billingArray.zone_name = text)
                        : index === 5
                          ? (this.state.billingArray.city = text)
                          : (this.state.billingArray.postcode = text)
              this.setState({ billingArray: this.state.billingArray })
            }}
            value={
              index === 0
                ? this.state.billingArray.firstname
                : index === 1
                  ? this.state.billingArray.lastname
                  : index === 2
                    ? this.state.billingArray.street
                    : index === 3
                      ? this.state.billingArray.country_name
                      : index === 4
                        ? this.state.billingArray.zone_name
                        : index === 5
                          ? this.state.billingArray.city
                          : this.state.billingArray.postcode
            }
          />
        </TouchableOpacity>
      )
  }

  /// //////////////////////////////////
  toggleSwitch1 = () => {
    if (!this.state.switch2Value) {
      this.state.billingArray.firstname = this.state.shippingData.firstname
      this.state.billingArray.lastname = this.state.shippingData.lastname
      this.state.billingArray.street = this.state.shippingData.street
      this.state.billingArray.country_name = this.state.shippingData.country_name
      this.state.billingArray.zone_name = this.state.shippingData.zone_name
      this.state.billingArray.city = this.state.shippingData.city
      this.state.billingArray.postcode = this.state.shippingData.postcode
      this.state.billingArray.phonenumber = this.state.shippingData.phonenumber
    } else {
      this.state.billingArray.firstname = ''
      this.state.billingArray.lastname = ''
      this.state.billingArray.street = ''
      this.state.billingArray.country_name = this.props.cartItems2.Config.languageJson.Country
      this.state.billingArray.zone_name = this.props.cartItems2.Config.languageJson.Zone
      this.state.billingArray.city = ''
      this.state.billingArray.postcode = ''
      this.state.billingArray.phonenumber = ''
    }
    this.setState({
      disableCondition: true,
      switch2Value: !this.state.switch2Value,
      billingCountryCode: this.state.shippingCountryCode
    })
  }

  /// ////////////////////////////////////
  pickerChange (index) {
    global.data.countries.map((v, i) => {
      if (index === i) {
        this.setState({
          currentLabel: v.name,
          currency: v.value
        })
      }
    })
  }

  /// ///////////////////////////////////
  /// ////////////////////////////////////
  pickerChange2 (index, country) {
    global.data.states[country].map((v, i) => {
      if (index === i) {
        this.setState({
          currentLabel: v.name,
          currency: v.value
        })
      }
    })
  }

  /// ///////////////////////////////////
  canBeUpdatingBilling () {
    let temp = 0
    for (let i = 0; i <= 8; i++) {
      if (
        this.state.billingArray[i] !== undefined &&
        this.state.billingArray[i] !== ''
      ) {
        temp = temp + 1
      }
    }
    return false
  }

  phonenumber (inputtxt) {
    if (!isNaN(inputtxt)) {
      return true
    }
    return false
  }

  canBeUpdatingShipping () {
    let temp = 0
    if (
      this.state.billingArray.firstname !== null &&
      this.state.billingArray.firstname !== '' &&
      this.state.billingArray.firstname !== undefined
    ) { temp++ }
    if (
      this.state.shippingData.delivery_location !== null &&
        this.state.shippingData.delivery_location !== '' &&
        this.state.shippingData.delivery_location !== undefined
    ) { temp++ }
    if (
      this.state.billingArray.lastname !== null &&
      this.state.billingArray.lastname !== '' &&
      this.state.billingArray.lastname !== undefined
    ) { temp++ }
    if (
      this.state.billingArray.street !== null &&
      this.state.billingArray.street !== '' &&
      this.state.billingArray.street !== undefined
    ) { temp++ }
    if (
      this.state.billingArray.country_name !== null &&
      this.state.billingArray.country_name !==
        this.props.cartItems2.Config.languageJson.Country &&
      this.state.billingArray.country_name !== undefined
    ) { temp++ }
    if (
      this.state.billingArray.zone_name !== null &&
      this.state.billingArray.zone_name !==
        this.props.cartItems2.Config.languageJson.Zone &&
      this.state.billingArray.zone_name !== undefined
    ) { temp++ }
    if (
      this.state.billingArray.city !== null &&
      this.state.billingArray.city !== '' &&
      this.state.billingArray.city !== undefined
    ) { temp++ }
    if (
      this.state.billingArray.postcode !== null &&
      this.state.billingArray.postcode !== '' &&
      this.state.billingArray.postcode !== undefined
    ) { temp++ }
    if (
      this.state.billingArray.phonenumber !== null &&
      this.state.billingArray.phonenumber !== '' &&
      this.state.billingArray.phonenumber !== undefined
    ) { temp++ }
    if (temp === 9 && this.phoneNumberCheckbillingArray() &&
    this.phoneNumberCheckshipping()) {
      temp = 0
      return true
    }
    return false
  }

  phoneNumberCheckshipping () {
    const reg = /^([0-9()/+ -]*)$/
    return (
      (String(this.state.shippingData.phonenumber).length >= 10 || String(this.state.shippingData.phonenumber).length === 0) && reg.test(String(this.state.shippingData.phonenumber)) === true
    )
  }

  phoneNumberCheckbillingArray () {
    const reg = /^([0-9()/+ -]*)$/
    return (
      (String(this.state.billingArray.phonenumber).length >= 10 || String(this.state.billingArray.phonenumber).length === 0) && reg.test(String(this.state.billingArray.phonenumber)) === true
    )
  }

  /// ///////////////////////////////////
  render () {
    const canBeUpdatingBillings = this.canBeUpdatingShipping()
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='always'
        style={{ backgroundColor: themeStyle.backgroundColor }}>
        <View
          style={{
            flex: 1,
            backgroundColor: themeStyle.backgroundColor,

            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          <Spinner
            visible={this.state.spinnerTemp}
            textStyle={styles.spinnerTextStyle}
          />
          <Dialog
            visible={this.state.visible}
            onTouchOutside={() => {
              this.setState({ visible: false })
            }}>
            <DialogContent>
              <View style={{ width: WIDTH * 0.7 }}>
                <Text
                  style={{
                    fontSize: themeStyle.largeSize + 1,
                    textAlign: 'left',
                    marginTop: 30
                  }}>
                  {this.props.cartItems2.Config.languageJson2[
                    'Enter Sms Code You Received on'
                  ] +
                      ' ' +
                      this.state.phone
                  }
                </Text>
                <TextInput
                  style={{
                    marginTop: 20,
                    width: WIDTH * 0.7,
                    fontSize: themeStyle.largeSize,
                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                    paddingLeft: 6,
                    paddingRight: 6,
                    color: '#000',
                    borderBottomWidth: 1,
                    borderColor: themeStyle.secondry,
                    paddingBottom: 8
                  }}
                  blurOnSubmit={false}
                  selectionColor="#51688F"
                  placeholder={this.props.cartItems2.Config.languageJson2.Code}
                  onChangeText={(text) => {
                    this.setState({ code: text, invalidCode: false })
                  }}
                  placeholderTextColor={'#c0c0c0'}
                  value={this.state.code}
                />
                <View
                  style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <TouchableOpacity
                    onPress={() => this.setState({ visible: false })}>
                    <View
                      style={{
                        marginTop: 15,
                        height: 45,
                        borderColor: '#fff',
                        borderWidth: 2,
                        marginLeft: 20,
                        fontSize: themeStyle.largeSize,
                        textAlign: I18nManager.isRTL ? 'right' : 'left',
                        paddingLeft: 6,
                        paddingRight: 6,
                        color: '#fff',
                        borderRadius: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: themeStyle.primaryLight,
                          fontSize: themeStyle.largeSize,
                          fontWeight: '500'
                        }}>
                        {this.props.cartItems2.Config.languageJson2.Cancel}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ spinnerTemp: true, invalidCode: false }, () => {
                        this.confirmCode(this.state.confirmResult)
                      })
                    }}>
                    <View
                      style={{
                        marginTop: 15,
                        height: 45,
                        borderColor: '#fff',
                        borderWidth: 2,
                        marginLeft: 20,
                        fontSize: themeStyle.largeSize,
                        textAlign: I18nManager.isRTL ? 'right' : 'left',
                        paddingLeft: 6,
                        paddingRight: 6,
                        color: '#fff',
                        borderRadius: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: this.state.shippingCountryCode !== '' ? themeStyle.primary : '#c0c0c0',
                          fontSize: themeStyle.largeSize,
                          fontWeight: '500'
                        }}>
                        {this.props.cartItems2.Config.languageJson2.ok}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {this.state.invalidCode
                  ? <Text
                    style={{
                      fontSize: themeStyle.mediumSize + 1,
                      textAlign: 'left',
                      marginTop: 0,
                      color: themeStyle.removeBtnColor
                    }}>
                    {this.props.cartItems2.Config.languageJson2[
                      'Invalid Code'
                    ]
                    }
                  </Text> : null }
              </View>
            </DialogContent>
          </Dialog>
          <Dialog
            visible={this.state.visible2}
            onTouchOutside={() => {
              this.setState({ visible2: false })
            }}>
            <DialogContent>
              <View style={{ width: WIDTH * 0.7 }}>
                <Text
                  style={{
                    fontSize: themeStyle.largeSize + 1,
                    textAlign: 'left',
                    marginTop: 30
                  }}>
                  {this.props.cartItems2.Config.languageJson2[
                    'Enter Sms Code You Received on'
                  ] +
                      ' ' +
                      this.state.phone2
                  }
                </Text>
                <TextInput
                  style={{
                    marginTop: 20,
                    width: WIDTH * 0.7,
                    fontSize: themeStyle.largeSize,
                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                    paddingLeft: 6,
                    paddingRight: 6,
                    color: '#000',
                    borderBottomWidth: 1,
                    borderColor: themeStyle.secondry,
                    paddingBottom: 8
                  }}
                  blurOnSubmit={false}
                  selectionColor="#51688F"
                  placeholder={this.props.cartItems2.Config.languageJson2.Code}
                  onChangeText={(text) => {
                    this.setState({ code2: text, invalidCode2: false })
                  }}
                  placeholderTextColor={'#c0c0c0'}
                  value={this.state.code2}
                />
                <View
                  style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <TouchableOpacity
                    onPress={() => this.setState({ visible2: false })}>
                    <View
                      style={{
                        marginTop: 15,
                        height: 45,
                        borderColor: '#fff',
                        borderWidth: 2,
                        marginLeft: 20,
                        fontSize: themeStyle.largeSize,
                        textAlign: I18nManager.isRTL ? 'right' : 'left',
                        paddingLeft: 6,
                        paddingRight: 6,
                        color: '#fff',
                        borderRadius: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: themeStyle.primaryLight,
                          fontSize: themeStyle.largeSize,
                          fontWeight: '500'
                        }}>
                        {this.props.cartItems2.Config.languageJson2.Cancel}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.confirmshippingCountryCode(this.state.confirmResult)
                    }}>
                    <View
                      style={{
                        marginTop: 15,
                        height: 45,
                        borderColor: '#fff',
                        borderWidth: 2,
                        marginLeft: 20,
                        fontSize: themeStyle.largeSize,
                        textAlign: I18nManager.isRTL ? 'right' : 'left',
                        paddingLeft: 6,
                        paddingRight: 6,
                        color: '#fff',
                        borderRadius: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: this.state.billingCountryCode !== '' ? themeStyle.primary : '#c0c0c0',
                          fontSize: themeStyle.largeSize,
                          fontWeight: '500'
                        }}>
                        {this.props.cartItems2.Config.languageJson2.ok}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {this.state.invalidCode2
                  ? <Text
                    style={{
                      fontSize: themeStyle.mediumSize + 1,
                      textAlign: 'left',
                      marginTop: 0,
                      color: themeStyle.removeBtnColor
                    }}>
                    {this.props.cartItems2.Config.languageJson2[
                      'Invalid Code'
                    ]
                    }
                  </Text> : null }
              </View>
            </DialogContent>
          </Dialog>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Text
              style={{
                fontSize: themeStyle.largeSize + 1,
                color: themeStyle.textColor,
                paddingTop: 10
              }}>
              {this.props.cartItems2.Config.languageJson['Shipping Address']}
            </Text>

            <FlatList
              data={this.state.placeholderArray}
              extraData={this.state}
              keyExtractor={(item, index) => index.toString()}
              renderItem={item =>
                this.customTextView(
                  this.state.placeholderArray[item.index],
                  item.index
                )
              }
            />
            {(!this.phoneNumberCheckshipping() &&
                        this.state.shippingData.phonenumber !== undefined) ? (
                <Text
                  style={{
                    marginTop: 5,
                    color: 'red',
                    fontSize: themeStyle.mediumSize,
                    alignSelf: 'center'
                  }}>
                  {this.props.cartItems2.Config.languageJson2['The phone number is not valid']}
                </Text>
              ) : null}

            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}>

              <Content >
                <Picker style={[styles.picker, {
                  width: WIDTH * 0.3,
                  height: 54,
                  backgroundColor: themeStyle.backgroundColor,
                  marginRight: 0,
                  marginLeft: Platform.OS === 'android' ? 16 : 13,
                  marginTop: 1
                }]}
                textStyle={{ color: themeStyle.textColor, fontSize: themeStyle.mediumSize }}
                itemStyle={{ fontSize: themeStyle.mediumSize, height: 95, color: themeStyle.textColor }}
                selectedValue={this.state.shippingCountryCode } onValueChange={((shippingCountryCode) => this.setState({ shippingCountryCode }))}>
                  {CountryCodePicker.map(cc => <Picker.Item key={cc[2]} label={`${cc[0]} +${cc[1]}`} value={`${cc[2]}`} />)}
                </Picker>
              </Content>
              <TextInput style={{
                marginRight: Platform.OS === 'android' ? 20 : 17,
                fontSize: this.state.textSize,
                height: 50,
                width: wp('66%'),
                borderBottomWidth: 1,
                textAlign: I18nManager.isRTL ? 'right' : 'left',
                paddingLeft: 6,
                paddingRight: 6,
                color: themeStyle.textColor,
                borderBottomColor: '#c0c0c0'
              }}
              onChangeText={num => this.onTextChange(num)}
              value={this.state.shippingData.phonenumber}
              placeholderTextColor={'#c0c0c0'}
              keyboardType='phone-pad'
              placeholder='Enter Phone Number' textAlign='left' />
            </View>

            <Text
              style={{
                fontSize: themeStyle.largeSize + 1,
                color: themeStyle.textColor,
                paddingTop: 20
              }}>
              {this.props.cartItems2.Config.languageJson['Billing Address']}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                backgroundColor: 'transparent',
                paddingRight: 120,
                paddingTop: 10
              }}>
              <Switch
                thumbColor={themeStyle.primaryDark}
                onValueChange={() => this.toggleSwitch1()}
                value={this.state.switch2Value}
              />
              <Text
                style={{
                  fontSize: themeStyle.mediumSize,
                  color: themeStyle.textColor,
                  paddingLeft: 10,
                  paddingTop: 7
                }}>
                {
                  this.props.cartItems2.Config.languageJson[
                    'Same as Shipping Address'
                  ]
                }
              </Text>
            </View>

            <FlatList
              data={this.state.placeholderArray2}
              extraData={this.state}
              keyExtractor={(item, index) => index.toString()}
              renderItem={item =>
                this.customTextView2(
                  this.state.placeholderArray2[item.index],
                  item.index
                )
              }
            />
            {(!this.phoneNumberCheckbillingArray() &&
                        this.state.billingArray.phonenumber !== undefined) ? (
                <Text
                  style={{
                    marginTop: 5,
                    color: 'red',
                    fontSize: themeStyle.mediumSize,
                    alignSelf: 'center'
                  }}>
                  {this.props.cartItems2.Config.languageJson2['The phone number is not valid']}
                </Text>
              ) : null}
            {this.state.errorEmailMessage !== '' ? (
              <Text style={{ padding: 10, paddingBottom: 0, color: 'red' }}>
                {this.state.errorEmailMessage}
              </Text>
            ) : null}
            {this.state.errorPhoneMessage !== '' ? (
              <Text style={{ padding: 10, paddingBottom: 0, color: 'red' }}>
                {this.state.errorPhoneMessage}
              </Text>
            ) : null}

            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}>

              <Content >

                <Picker style={[styles.picker, {
                  width: WIDTH * 0.3,
                  height: 54,
                  backgroundColor: themeStyle.backgroundColor,
                  marginRight: 0,
                  marginLeft: Platform.OS === 'android' ? 16 : 13,
                  marginTop: 1
                }]}
                textStyle={{ color: themeStyle.textColor, fontSize: themeStyle.mediumSize }}
                itemStyle={{ fontSize: themeStyle.mediumSize, height: 95 }}
                selectedValue={this.state.billingCountryCode } onValueChange={((billingCountryCode) => this.setState({ billingCountryCode }))}>
                  {CountryCodePicker.map(cc => <Picker.Item key={cc[2]} label={`${cc[0]} +${cc[1]}`} value={`${cc[2]}`} />)}
                </Picker>
              </Content>
              <TextInput style={{
                fontSize: this.state.textSize3,
                marginRight: Platform.OS === 'android' ? 20 : 17,
                height: 50,
                width: wp('66%'),
                borderBottomWidth: 1,
                textAlign: I18nManager.isRTL ? 'right' : 'left',
                paddingLeft: 6,
                paddingRight: 6,
                color: themeStyle.textColor,
                borderBottomColor: '#c0c0c0'
              }}
              onChangeText={num => this.onTextChange2(num)}
              value={this.state.billingArray.phonenumber}
              keyboardType='phone-pad'
              placeholderTextColor={'#c0c0c0'}
              placeholder='Enter Phone Number' textAlign='left' />
            </View>
            <TouchableOpacity
              onPress={() => {
                this.props.cartItems2.Config.enablePhoneLogin
                  ? this.setState({ spinnerTemp: true }, () => {
                    this.signInWithPhone()
                  }) : this.setAddress()
              }}
              disabled={!canBeUpdatingBillings}>
              <View
                style={{
                  marginBottom: 20,
                  marginTop: 22,
                  alignItems: 'center',
                  height: 38,
                  width: wp('100%'),
                  backgroundColor: themeStyle.otherBtnsColor,
                  justifyContent: 'center',
                  opacity: !canBeUpdatingBillings ? 0.4 : 0.9
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
          </View>
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  cartItems2: state
})

export default connect(mapStateToProps, null)(ShippingAddress)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeStyle.backgroundColor
  }
})
