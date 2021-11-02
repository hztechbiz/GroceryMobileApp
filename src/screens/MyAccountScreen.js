import React, { Component } from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  I18nManager,
  Platform, ScrollView
} from 'react-native'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { NavigationEvents } from 'react-navigation'
import WooComFetch, { getUrl } from '../common/WooComFetch'
import { connect } from 'react-redux'
import SyncStorage from 'sync-storage'
import Spinner from 'react-native-loading-spinner-overlay'
import ShoppingCartIcon from '../common/ShoppingCartIcon'
import themeStyle from '../common/Theme.style'
const WIDTH = Dimensions.get('window').width
class CreateAccount extends Component {
  /// /////////////////////////////////////////////////////////
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    return {
      headerTitle: headerStyle,
      headerRight: () => <ShoppingCartIcon navigation={navigation} />,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
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
      headerForceInset: { top: 'never', vertical: 'never' }
    }
  }

  /// /////////////////////////////////////////////////////////
  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson['Edit Profile']
    })
  }

  /// //////////////////////////////////////////////////////////
  constructor (props) {
    super(props)
    this.state = {
      myAccountData: {},
      firstName: SyncStorage.get('customerData').customers_firstname,
      lastName: SyncStorage.get('customerData').customers_lastname,
      errorMessage: '',
      spinnerTemp: false,
      phone: SyncStorage.get('customerData').phone,
      currentPassword: '',
      password: '',
      success: '',
      customers_id: '',
      image_id: 0,
      customers_telephone: ''
    }
  }

  canBeSubmitted () {
    const { phone } = this.state
    return (
      phone.length >= 11 || phone.length == 0
    )
  }

  /// ///////////////////////////////////////////////////
  updateInfo = t => {
    const reg = /^([0-9\(\)\/\+ \-]*)$/
    if (reg.test(this.state.phone) === false) {
      t.setState({
        errorMessage: this.props.isLoading.Config.languageJson2['The phone number is not valid'],
        success: '0'
      })
      return
    }

    if (!this.canBeSubmitted()) {
      t.setState({
        errorMessage: this.props.isLoading.Config.languageJson2['The phone number is not valid in length'],
        success: '0'
      })
      return
    }
    t.setState({ spinnerTemp: true })

    t.state.myAccountData.customers_firstname = t.state.firstName
    t.state.myAccountData.customers_lastname = t.state.lastName
    t.state.myAccountData.customers_telephone = t.state.phone
    t.state.myAccountData.customers_id = SyncStorage.get(
      'customerData'
    ).customers_id
    if (t.state.password != '') { t.state.myAccountData.password = t.state.password }
    t.UpdateCustomerData1(
      t.state.myAccountData
    )
  }

  /// ///////////////////////////////////////////////////
  UpdateCustomerData1 = async (object) => {
    const data = await WooComFetch.postHttp(
      getUrl() + '/api/' + 'updatecustomerinfo',
      object
    )
    if (data.data.success === '1') {
      SyncStorage.set('customerData', Object.assign(SyncStorage.get('customerData'),
        {
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          phone: this.state.phone,
          customers_telephone: this.state.phone
        }))
    }
    this.setState({
      spinnerTemp: false,
      currentPassword: '',
      password: '',
      errorMessage: data.data.message,
      success: data.data.success
    })
  }

  /// //////
  render () {
    const isEnabled = this.canBeSubmitted()
    return (
      <ScrollView style={{ backgroundColor: themeStyle.backgroundColor }}>
        <View
          style={{
            flex: 1,
            backgroundColor: themeStyle.backgroundColor,

            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Spinner
            visible={this.state.spinnerTemp}
          />
          <NavigationEvents
            onDidFocus={() => {
              this.state.firstName = SyncStorage.get('customerData').first_name
              this.state.lastName = SyncStorage.get('customerData').last_name
              this.state.phone = SyncStorage.get('customerData').phone
              this.setState({})
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <TextInput
              style={{
                marginTop: 20,
                height: 38,
                width: WIDTH * 0.9,
                borderColor: '#c1c1c1',
                borderWidth: 1,
                fontSize: themeStyle.mediumSize,
                paddingLeft: 6,
                paddingRight: 6,
                textAlign: I18nManager.isRTL ? 'right' : 'left',
                color: themeStyle.textColor
              }}
              selectionColor='#51688F'
              placeholderTextColor={'#c0c0c0'}
              placeholder={
                this.props.isLoading.Config.languageJson['First Name']
              }
              onChangeText={firstName =>
                this.setState({ firstName, errorMessage: '' })
              }
              value={this.state.firstName}
            />
            <TextInput
              style={{
                marginTop: 20,
                height: 38,
                width: WIDTH * 0.9,
                borderColor: '#c1c1c1',
                borderWidth: 1,
                fontSize: themeStyle.mediumSize,
                paddingLeft: 6,
                paddingRight: 6,
                textAlign: I18nManager.isRTL ? 'right' : 'left',
                color: themeStyle.textColor
              }}
              selectionColor='#51688F'
              placeholderTextColor={'#c0c0c0'}
              placeholderTextColor={'#c0c0c0'}
              placeholder={
                this.props.isLoading.Config.languageJson['Last Name']
              }
              onChangeText={lastName =>
                this.setState({ lastName, errorMessage: '' })
              }
              value={this.state.lastName}
            />
            <TextInput
              style={{
                marginTop: 20,
                height: 38,
                width: WIDTH * 0.9,
                borderColor: isEnabled ? '#c1c1c1' : 'red',
                borderWidth: 1,
                fontSize: themeStyle.mediumSize,
                paddingLeft: 6,
                paddingRight: 6,
                textAlign: I18nManager.isRTL ? 'right' : 'left',
                color: themeStyle.textColor
              }}
              keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'phone-pad'}
              selectionColor='#51688F'
              placeholder={this.props.isLoading.Config.languageJson2.Mobile}
              onChangeText={phone => this.setState({ phone, errorMessage: '' })}
              value={this.state.phone}
            />
            {!isEnabled ? (
              <Text
                style={{
                  marginTop: 5,
                  color: 'red',
                  fontSize: themeStyle.mediumSize,
                  alignSelf: 'flex-start'
                }}>
                {this.props.isLoading.Config.languageJson2['The phone number is not valid']}
              </Text>
            ) : null}
            <TouchableOpacity onPress={() => this.updateInfo(this)}>
              <View
                style={{
                  marginTop: 18,
                  alignItems: 'center',
                  height: 38,
                  width: WIDTH * 0.9,
                  backgroundColor: themeStyle.otherBtnsColor,
                  justifyContent: 'center',
                  opacity:
                    this.state.firstName === '' ||
                    this.state.lastName === '' ||
                    this.state.email === '' ||
                    (this.state.password === '') === ''
                      ? 0.4
                      : 0.9
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: themeStyle.otherBtnsText,
                    fontSize: themeStyle.mediumSize,
                    fontWeight: '500'
                  }}>
                  {this.props.isLoading.Config.languageJson.Update}
                </Text>
              </View>
            </TouchableOpacity>

            {this.state.errorMessage !== '' ? (
              <Text
                style={{
                  marginTop: 18,
                  color: this.state.success !== '1' ? 'red' : 'green'
                }}>
                {this.state.errorMessage}
              </Text>
            ) : null}

          </View>
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  isLoading: state
})

export default connect(mapStateToProps, null)(CreateAccount)
