import React, { PureComponent } from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  I18nManager,
  Platform,
  ScrollView
} from 'react-native'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { getUrl, getHttp } from '../common/WooComFetch'
import { connect } from 'react-redux'
import SyncStorage from 'sync-storage'
import Spinner from 'react-native-loading-spinner-overlay'
import themeStyle from '../common/Theme.style'
const WIDTH = Dimensions.get('window').width
class CreateAccount extends PureComponent {
  /// /////////////////////////////////////////////////////////
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    return {
      headerTitle: headerStyle,
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
      headerTitle: this.props.isLoading.Config.languageJson['Change Password']
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
      newPassword: '',
      password: '',
      success: '',
      customers_id: '',
      image_id: 0,
      customers_telephone: ''
    }
  }

  /// ///////////////////////////////////////////////////
  updateInfo = t => {
    if (
      this.state.newPassword.length === 0 ||
      this.state.password.length === 0 ||
      this.state.currentPassword.length === 0
    ) {
      this.setState({
        errorMessage: this.props.isLoading.Config.languageJson2[
          'Please Enter all fields'
        ]
      })
    } else if (
      this.state.newPassword.toString() !== this.state.password.toString()
    ) {
      this.setState({
        errorMessage: this.props.isLoading.Config.languageJson2[
          'New password and confirm password must be same'
        ]
      })
    } else {
      t.setState({ spinnerTemp: true }, () => {
        t.state.myAccountData.oldpassword = SyncStorage.get(
          'customerData'
        ).password
        t.state.myAccountData.newpassword = t.state.password
        t.state.myAccountData.customers_id = SyncStorage.get(
          'customerData'
        ).customers_id
        if (t.state.password !== '') { t.state.myAccountData.password = t.state.password }
        t.UpdateCustomerData1(
          SyncStorage.get('customerData').customers_id,
          t.state.myAccountData
        )
      })
    }
  }

  /// ///////////////////////////////////////////////////
  UpdateCustomerData1 = async (id, object) => {
    const data = await getHttp(
      getUrl() +
        '/api/' +
        'updatepassword?oldpassword=' +
        this.state.currentPassword +
        '&newpassword=' +
        this.state.newPassword +
        '&customers_id=' +
        id,
      {}
    )
    this.setState({
      spinnerTemp: false,
      currentPassword: '',
      password: '',
      newPassword: '',
      errorMessage: data.data.message,
      success: data.data.success
    })
  }

  /// //////
  render () {
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
              placeholderTextColor={'#c1c1c1'}
              secureTextEntry
              selectionColor='#51688F'
              placeholder={
                this.props.isLoading.Config.languageJson['Current Password']
              }
              onChangeText={currentPassword =>
                this.setState({ currentPassword, errorMessage: '' })
              }
              value={this.state.currentPassword}
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
              placeholderTextColor={'#c1c1c1'}
              secureTextEntry
              selectionColor='#51688F'
              placeholder={
                this.props.isLoading.Config.languageJson['New Password']
              }
              onChangeText={newPassword =>
                this.setState({ newPassword, errorMessage: '' })
              }
              value={this.state.newPassword}
            />

            <TextInput
              style={{
                marginTop: 15,
                height: 38,
                width: WIDTH * 0.9,
                borderColor: '#c1c1c1',
                borderWidth: 1,
                fontSize: themeStyle.mediumSize,
                paddingLeft: 4,
                textAlign: I18nManager.isRTL
                  ? Platform.OS === 'android'
                    ? 'right'
                    : 'auto'
                  : 'auto',
                color: themeStyle.textColor
              }}
              placeholderTextColor={'#c1c1c1'}
              secureTextEntry
              selectionColor='#51688F'
              placeholder={
                this.props.isLoading.Config.languageJson2['Confirm Password']
              }
              onChangeText={password =>
                this.setState({ password, errorMessage: '' })
              }
              value={this.state.password}
            />

            <TouchableOpacity
              disabled={
                this.state.newPassword.length === 0 ||
                this.state.password.length === 0 ||
                this.state.currentPassword.length === 0
              }
              onPress={() => this.updateInfo(this)}>
              <View
                style={{
                  marginTop: 18,
                  alignItems: 'center',
                  height: 38,
                  width: WIDTH * 0.9,
                  backgroundColor:
                    this.state.newPassword.length === 0 ||
                    this.state.password.length === 0 ||
                    this.state.currentPassword.length === 0
                      ? '#c1c1c1'
                      : themeStyle.otherBtnsColor,
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
