import React, { PureComponent } from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  I18nManager,
  Dimensions,
  Alert,
  StyleSheet,
  ScrollView
} from 'react-native'
import SyncStorage from 'sync-storage'
import { CardStyleInterpolators } from 'react-navigation-stack'
import Dialog, { DialogContent } from 'react-native-popup-dialog'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import { getUrl, postHttp, getHttp } from '../common/WooComFetch'
import { Picker, Content } from 'native-base'
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js'
import auth from '@react-native-firebase/auth'
import Spinner from 'react-native-loading-spinner-overlay'
import themeStyle from '../common/Theme.style'
import Toast from 'react-native-easy-toast'
import { CountryCodePicker, CountryCodeKey } from './CountryCodes'
const WIDTH = Dimensions.get('window').width
const Height = Dimensions.get('window').height
class ForgotPassword extends PureComponent {
  /// /////////////////////////////////////////////////////////
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    return {
      headerTitle: headerStyle,
      headerRight: null,
      gestureEnabled: false,
      drawerLockMode: 'locked-closed',
      headerTitleAlign: 'center',
      headerTintColor: themeStyle.headerTintColor,
      headerStyle: {
        backgroundColor: themeStyle.primary
      },
      headerTitleStyle: {
        fontWeight: Platform.OS === 'android' ? 'bold' : 'normal'
      },
      headerForceInset: { top: 'never', vertical: 'never' },
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
    }
  }

  /// /////////////////////////////////////////////////////////
  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson.Login
    })
  }

  /// //////////////////////////////////////////////////////////
  constructor (props) {
    super(props)
    this.state = {
      phoneNumber: '',
      errorMessage: '',
      spinnerTemp: false,
      success: 0,
      visible: false,
      userData: {},
      code2: '228',
      confirmResult: '',
      itemVal: '',
      text: '',
      textSize: 15
    }
  }

  /// ///////////////////////////////////////

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
                  spinnerTemp: false
                })
              })
          } else {
            this.setState({ spinnerTemp: false }, () => {
              Alert.alert(this.props.isLoading.Config.languageJson2['Please enter a valid phone number'])
            })
          }
        } catch (err) {
          this.setState({ spinnerTemp: false }, () => {
            Alert.alert(this.props.isLoading.Config.languageJson2['Please enter a valid phone number'])
          })
        }
      };

      phoneNumberCheck () {
        const { text } = this.state
        const reg = /^([0-9\(\)\/\+ \-]*)$/
        return (
          (text.length >= 11) && reg.test(this.state.text) === true
        )
      }

      confirmCode = async (code) => {
        try {
          await code.confirm(this.state.code)
          this.setState({ visible: false })
          this.setState({ visible: false, spinnerTemp: false, pin: '' }, () => {
            this.login()
          })
        } catch (error) {
          Alert.alert(this.props.isLoading.Config.languageJson2['Invalid Code'])
          this.setState({ spinnerTemp: false, code: '' })
        }
      };
      /// ///////////////////////////////////

      // function for controlled text
   onTextChange = (number) => {
     const num = parsePhoneNumberFromString(number, CountryCodeKey[this.state.code2][0])
     const reg = /^[0-9]/
     if (!!num && this.state.text.length > number.length && !reg.test(this.state.text[this.state.text.length - 1])) {
       let phone = num.nationalNumber.split('')
       phone.pop()
       phone = phone.join('')
       this.setState({ text: phone })
     } else {
       this.setState({ text: new AsYouType(CountryCodeKey[this.state.code2][0]).input(number) })
     }
   }

   // function that is called when TextInput is submitted
   signInWithPhone = () => {
     const num = parsePhoneNumberFromString(this.state.text, CountryCodeKey[this.state.code2][0])
     if (!!num && num.isPossible()) {
       this.signInWithPhoneNumber(num.number.toString())
     } else {
       this.setState({ spinnerTemp: false }, () => {
         Alert.alert(this.props.isLoading.Config.languageJson2['Please enter a valid phone number'])
       })
     }
   }

   login = async () => {
     this.setState({ spinnerTemp: true })
     const formData = new FormData()
     formData.append('phone', this.state.confirmResult)
     const data = await postHttp(getUrl() + '/api/' + 'processlogin', formData)
     if (data.success == 1) {
       this.getUserData(data.data[0], 'simple')
     }
     if (data.success == 0) {
       this.setState({ errorMessage: data.message, spinnerTemp: false, colorGren: false })
     }
   }

  /// //////////////////////////////////////////////////////////
  /// /////////////////////////////////////
  getUserData = (data, type) => {
    try {
      const customerData = data
      customerData.customers_telephone = data.phone
      customerData.phone = data.phone
      customerData.customers_id = data.id
      customerData.customers_firstname = data.first_name
      customerData.customers_lastname = data.last_name
      customerData.phone = data.phone
      customerData.avatar = data.avatar
      customerData.image_id = data.image_id
      customerData.customers_dob = data.dob
      SyncStorage.set('customerData', customerData)
      this.setState({ spinnerTemp: true })
      this.props.getAllCategories(this.props)
      this.props.getBannersData()
      this.props.getFlashData(this.props)
      this.props.getTopSeller(this.props)
      this.props.getSpecialData(this.props)
      this.props.getMostLikedData(this.props, this)
      this.props.getProductData(this.props, this)
    } catch (e) {
      this.setState({ spinnerTemp: false })
    }
  }

  render () {
    const isEnabled = this.phoneNumberCheck()

    if (this.state.text.length > 0) this.state.textSize = 18
    else if (this.state.text.length === 0) this.state.textSize = 15
    return (
      <ScrollView style={{ backgroundColor: themeStyle.backgroundColor }}>
        <View
          style={{
            flex: 1,
            backgroundColor: themeStyle.backgroundColor,
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          <Spinner
            visible={this.state.spinnerTemp}
            size={'small'}
            color={themeStyle.primary}
            indicatorStyle={{ paddingTop: Height * 0.062 }}
          />
          <Toast
            ref="toast"
            style={{ backgroundColor: 'black' }}
            position="bottom"
            positionValue={100}
            fadeOutDuration={1000}
            textStyle={{ color: '#fff', fontSize: 15 }}
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
                  {this.props.isLoading.Config.languageJson2[
                    'Enter Sms Code You Received on'
                  ] +
                      ' ' + this.state.text
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
                  placeholder={this.props.isLoading.Config.languageJson2.Code}
                  onChangeText={(text) => {
                    this.setState({ code: text })
                  }}
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
                        {this.props.isLoading.Config.languageJson2.Cancel}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (this.state.code !== '') {
                        this.setState({ spinnerTemp: true }, () => {
                          this.confirmCode(this.state.confirmResult)
                        })
                      }
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
                          color: this.state.code !== '' ? themeStyle.primary : 'gray',
                          fontSize: themeStyle.largeSize,
                          fontWeight: '500'
                        }}>
                        {this.props.isLoading.Config.languageJson2.ok}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
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
                  marginLeft: Platform.OS === 'android' ? 3 : 0,
                  marginTop: 1
                }]}
                textStyle={{ color: themeStyle.textColor, fontSize: themeStyle.mediumSize }}
                itemStyle={{ fontSize: 20, height: 95 }}
                selectedValue={this.state.code2 } onValueChange={((code2) => this.setState({ code2 }))}>
                  {CountryCodePicker.map(cc => <Picker.Item key={cc[2]} label={`${cc[0]} +${cc[1]}`} value={`${cc[2]}`} />)}
                </Picker>
              </Content>
              <TextInput style={{
                marginRight: 20,
                fontSize: this.state.textSize,
                height: 50,
                width: wp('76%'),
                borderColor: this.phoneNumberCheck() ? '#c1c1c1' : themeStyle.removeBtnColor,
                borderBottomWidth: 1,
                textAlign: I18nManager.isRTL ? 'right' : 'left',
                paddingLeft: 6,
                paddingRight: 6,
                color: themeStyle.textColor
              }}
              onChangeText={num => this.onTextChange(num)}
              value={this.state.text}
              keyboardType='phone-pad'
              placeholder='Enter Phone Number' textAlign='left' />
            </View>

            {!this.phoneNumberCheck() ? (
              <Text
                style={{
                  marginTop: 5,
                  color: 'red',
                  fontSize: themeStyle.mediumSize,
                  alignSelf: 'flex-start'
                }}>
                {this.props.isLoading.Config.languageJson2['The phoneNumber address is not valid']}
              </Text>
            ) : null}
            {this.state.errorMessage ? (
              <Text
                style={{
                  marginTop: 15,
                  color: this.state.success == 1 ? 'green' : 'red'
                }}>
                {this.state.errorMessage}
              </Text>
            ) : null}
            <TouchableOpacity
              disabled={!isEnabled}
              onPress={() => {
                this.setState({ spinnerTemp: true }, () => {
                  this.signInWithPhone()
                })
              }}>
              <View
                style={{
                  marginTop: 15,
                  alignItems: 'center',
                  height: 38,
                  width: wp('90%'),
                  backgroundColor: themeStyle.otherBtnsColor,
                  justifyContent: 'center',
                  opacity: !isEnabled ? 0.4 : 0.9
                }}>
                <Text
                  style={{ textAlign: 'center', color: themeStyle.otherBtnsText, fontSize: 13 }}>
                  {this.props.isLoading.Config.languageJson.Send}
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
  isLoading: state
})

const styles = StyleSheet.create({
  app: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%'
  },
  number: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: 95
  },
  picker: {
    color: themeStyle.otherBtnsColor,
    width: 75,
    height: 28,
    backgroundColor: themeStyle.backgroundColor,
    marginTop: 20,
    marginBottom: 20
  }
})
const mapDispatchToProps = dispatch => ({
  getAllCategories: props => {
    const formData = new FormData()
    formData.append(
      'customers_id',
      SyncStorage.get('customerData').customers_id !== null &&
        SyncStorage.get('customerData').customers_id !== undefined
        ? SyncStorage.get('customerData').customers_id
        : null
    )
    formData.append('page_number', 0)
    formData.append(
      'language_id',
      SyncStorage.get('langId') === undefined ? '1' : SyncStorage.get('langId')
    )
    formData.append(
      'currency_code',
      props.isLoading.Config.productsArguments.currency
    )
    dispatch({
      type: 'GET_ALL_CATEGORIES',
      payload: formData
    })
  },

  getBannersData: () => {
    dispatch(async dispatch => {
      const formData = new FormData()
      formData.append(
        'customers_id',
        SyncStorage.get('customerData').customers_id !== null &&
          SyncStorage.get('customerData').customers_id !== undefined
          ? SyncStorage.get('customerData').customers_id
          : null
      )
      formData.append(
        'language_id',
        SyncStorage.get('langId') === undefined
          ? '1'
          : SyncStorage.get('langId')
      )
      var dat = {}

      dat.languages_id = '1'
      const json = await getHttp(
        getUrl() + '/api/' + 'getbanners?languages_id=1',
        {}
      )
      if (json.data.success === '1') {
        dispatch({
          type: 'ADD_BANNERS',
          payload: json.data.data
        })
      }
    })
  },
  getFlashData: props => {
    dispatch(async dispatch => {
      const formData = new FormData()
      formData.append(
        'customers_id',
        SyncStorage.get('customerData').customers_id !== null &&
          SyncStorage.get('customerData').customers_id !== undefined
          ? SyncStorage.get('customerData').customers_id
          : null
      )
      formData.append('page_number', 0)
      formData.append(
        'language_id',
        SyncStorage.get('langId') === undefined
          ? '1'
          : SyncStorage.get('langId')
      )
      formData.append(
        'currency_code',
        props.isLoading.Config.productsArguments.currency
      )
      formData.append('type', 'flashsale')
      const json = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData
      )
      dispatch({
        type: 'ADD_FLASH_PRODUCTS',
        payload1: json.product_data
      })
    })
  },
  getTopSeller: props => {
    dispatch(async dispatch => {
      const formData = new FormData()
      formData.append(
        'customers_id',
        SyncStorage.get('customerData').customers_id !== null &&
          SyncStorage.get('customerData').customers_id !== undefined
          ? SyncStorage.get('customerData').customers_id
          : null
      )
      formData.append('page_number', 0)
      formData.append(
        'language_id',
        SyncStorage.get('langId') === undefined
          ? '1'
          : SyncStorage.get('langId')
      )
      formData.append(
        'currency_code',
        props.isLoading.Config.productsArguments.currency
      )
      formData.append('type', 'top seller')
      const json = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData
      )
      dispatch({
        type: 'ADD_TOP_SELLER_PRODUCTS',
        payload10: json.product_data
      })
    })
  },
  getSpecialData: props => {
    dispatch(async dispatch => {
      const formData = new FormData()
      formData.append(
        'customers_id',
        SyncStorage.get('customerData').customers_id !== null &&
          SyncStorage.get('customerData').customers_id !== undefined
          ? SyncStorage.get('customerData').customers_id
          : null
      )
      formData.append('page_number', 0)
      formData.append(
        'language_id',
        SyncStorage.get('langId') === undefined
          ? '1'
          : SyncStorage.get('langId')
      )
      formData.append(
        'currency_code',
        props.isLoading.Config.productsArguments.currency
      )
      formData.append('type', 'special')
      const json = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData
      )
      dispatch({
        type: 'ADD_SPECIAL_PRODUCTS',
        payload2: json.product_data
      })
    })
  },
  getMostLikedData: (props2, props) => {
    dispatch(async dispatch => {
      const formData = new FormData()
      formData.append(
        'customers_id',
        SyncStorage.get('customerData').customers_id !== null &&
          SyncStorage.get('customerData').customers_id !== undefined
          ? SyncStorage.get('customerData').customers_id
          : null
      )
      formData.append('page_number', 0)
      formData.append(
        'language_id',
        SyncStorage.get('langId') === undefined
          ? '1'
          : SyncStorage.get('langId')
      )
      formData.append(
        'currency_code',
        props2.isLoading.Config.productsArguments.currency
      )
      formData.append('type', 'most liked')
      const json = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData
      )
      dispatch({
        type: 'ADD_MOST_LIKED_PRODUCTS',
        payload3: json.product_data
      })
    })
  },
  getProductData: (r, t) => {
    dispatch(async dispatch => {
      const formData = new FormData()
      formData.append(
        'customers_id',
        SyncStorage.get('customerData').customers_id !== null &&
          SyncStorage.get('customerData').customers_id !== undefined
          ? SyncStorage.get('customerData').customers_id
          : null
      )
      formData.append('page_number', 0)
      formData.append(
        'language_id',
        SyncStorage.get('langId') === undefined
          ? '1'
          : SyncStorage.get('langId')
      )
      formData.append(
        'currency_code',
        t.props.isLoading.Config.productsArguments.currency
      )
      formData.append('categories_id', 0)
      const json = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData
      )
      SyncStorage.set('gustLogin', false)
      t.setState({ SpinnerTemp: false })
      if (SyncStorage.get('cartScreen') === 1) {
        SyncStorage.set('cartScreen', 0)
        if (t.props.navigation.state.params.updateCart !== undefined) {
          t.props.navigation.state.params.updateCart()
        }
        t.props.navigation.goBack()
      } else {
        if (t.props.navigation.state.params.updateCart !== undefined) {
          t.props.navigation.state.params.updateCart()
        }
        if (SyncStorage.get('drawerLogin')) {
          SyncStorage.set('drawerLogin', false)
          t.props.navigation.navigate('SETTINGS')
        } else {
          t.props.navigation.navigate('SettingsScreen')
        }
      }
      t.refs.toast.show(t.props.isLoading.Config.languageJson2[
        'successfully Login'
      ])
      t.setState({
        userName: '', password: ''
      })
      dispatch({
        type: 'ADD_Products',
        payload6: json.product_data
      })
    })
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
