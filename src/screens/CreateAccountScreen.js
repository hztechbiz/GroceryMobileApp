import React, {PureComponent} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  I18nManager,
  ScrollView,
  Image,
} from 'react-native';
import {CardStyleInterpolators} from 'react-navigation-stack';
import {getUrl, postHttp} from '../common/WooComFetch';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import SyncStorage from 'sync-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import themeStyle from '../common/Theme.style';
import Icon from 'react-native-vector-icons/FontAwesome5';

class CreateAccount extends PureComponent {
  /// /////////////////////////////////////////////////////////
  static navigationOptions = ({navigation}) => {
    const headerStyle = navigation.getParam('headerTitle');
    return {
      headerTitle: headerStyle,
      headerTitleAlign: 'center',
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerRight: null,
      gestureEnabled: false,
      drawerLockMode: 'locked-closed',
      headerTintColor: themeStyle.headerTintColor,
      headerStyle: {
        backgroundColor: themeStyle.primary,
      },
      headerTitleStyle: {
        fontWeight: Platform.OS === 'android' ? 'bold' : 'normal',
      },
      headerForceInset: {top: 'never', vertical: 'never'},
    };
  };

  /// /////////////////////////////////////////////////////////
  componentDidMount() {
    this.props.navigation.setParams({
      headerTitle:
        this.props.isLoading.Config.languageJson['Create an Account'],
    });
  }

  /// //////////////////////////////////////////////////////////
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
      errorMessage: '',
      spinnerTemp: false,
      dOB: '',
      chosenDate: new Date(),
    };
  }

  /// ////////////////////////
  getUserData = (data, t) => {
    const customerData = data;
    customerData.customers_telephone = data.phone;
    customerData.phone = data.phone;
    customerData.customers_id = data.id;
    customerData.customers_firstname = data.first_name;
    customerData.customers_lastname = data.last_name;
    customerData.phone = data.phone;
    customerData.avatar = data.avatar;
    customerData.image_id = data.image_id;
    customerData.customers_dob = data.dob;
    SyncStorage.set('customerData', customerData);
    if (SyncStorage.get('drawerLogin')) {
      SyncStorage.set('drawerLogin', false);
      t.props.navigation.navigate('SETTINGS');
    } else {
      t.props.navigation.navigate('SettingsScreen');
    }
  };

  /// ///////////////////////////////////////////////////
  createAccount(t) {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(this.state.email) === false) {
      t.setState({
        errorMessage:
          this.props.isLoading.Config.languageJson2[
            'The email address is not valid'
          ],
      });
      return;
    }
    t.setState({spinnerTemp: true});
    this.signUp(t);
  }

  /// //////////////////////////////////////////
  signUp = async (t) => {
    this.errorMessage = '';
    const formData = new FormData();
    formData.append('customers_firstname', t.state.firstName);
    formData.append('customers_lastname', t.state.lastName);
    formData.append('email', t.state.email);
    formData.append('password', t.state.password);
    formData.append('display_name', `${t.state.firstName} ${t.state.lastName}`);
    formData.append('customers_telephone', t.state.userName);
    const data = await postHttp(
      getUrl() + '/api/' + 'processregistration',
      formData,
    );
    if (data.success === '1') {
      t.setState(
        {
          spinnerTemp: false,
        },
        () => this.getUserData(data.data[0], t),
      );
    }
    if (data.success === '0') {
      t.setState({errorMessage: data.message, spinnerTemp: false});
    }
  };
  /// /////////////////////////////////////

  canBeSubmitted() {
    const {lastName, firstName, userName, email, password} = this.state;
    return (
      lastName.length > 0 &&
      firstName.length > 0 &&
      userName.length > 0 &&
      email.length > 0 &&
      password.length > 0
    );
  }

  phoneNumberCheck() {
    const {userName} = this.state;
    const reg = /^([0-9\(\)\/\+ \-]*)$/;
    return (
      (userName.length >= 11 || userName.length === 0) &&
      reg.test(this.state.userName) === true
    );
  }

  EmailNumberCheck() {
    const {email} = this.state;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return email.length === 0 || reg.test(this.state.email) === true;
  }

  /// //////
  render() {
    const isEnabled = this.canBeSubmitted();
    return (
      <ScrollView
        style={{
          backgroundColor: themeStyle.backgroundColor,
          backgroundColor: '#F5FAFE',
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: themeStyle.backgroundColor,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F5FAFE',
            // marginHorizontal: 15,
          }}>
          <Spinner
            visible={this.state.spinnerTemp}
            textStyle={{
              backgroundColor: themeStyle.loadingIndicatorColor,
              color: themeStyle.loadingIndicatorColor,
            }}
          />

          <Image
            source={require('./../images/logo.png')}
            style={{
              height: 130,
              width: 270,
              resizeMode: 'stretch',
              marginTop: 20,
              marginBottom: 15,
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: 'red',
              backgroundColor: '#F5FAFE',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                width: '92%',
                height: 60,
                borderColor: '#fff',
                borderWidth: 1,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                // marginBottom: 15,
                marginTop: 20,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.29,
                shadowRadius: 4.65,

                elevation: 5,
              }}>
              <TextInput
                style={{
                  // marginTop: 20,
                  // height: 50,
                  // width: wp('90%'),
                  // // borderColor: '#c1c1c1',
                  // // borderBottomWidth: 1,
                  // textAlign: I18nManager.isRTL ? 'right' : 'left',
                  // paddingLeft: 6,
                  // paddingRight: 6,
                  // fontSize: themeStyle.mediumSize + 2,
                  // color: themeStyle.textColor,
                  // // color: 'black',
                  // backgroundColor: '#fff',
                  // borderRadius: 15,
                  // // borderWidth: 1,

                  fontFamily: 'Lato-Regular',
                  fontSize: 18,
                  color: 'black',
                  width: '88%',
                  height: '100%',
                  paddingHorizontal: 20,
                }}
                // placeholderTextColor={'#c1c1c1'}
                placeholderTextColor={'#c1c1c1'}
                selectionColor="#51688F"
                placeholder={
                  this.props.isLoading.Config.languageJson['First Name']
                }
                onChangeText={(firstName) =>
                  this.setState({firstName, errorMessage: ''})
                }
                value={this.state.firstName}
              />
              <Icon
                name="user-alt"
                size={15}
                style={{position: 'absolute', right: 20}}
                color="red"
              />
            </View>

            <View
              style={{
                backgroundColor: '#fff',
                width: '92%',
                height: 60,
                borderColor: '#fff',
                borderWidth: 1,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                // marginBottom: 15,
                marginTop: 20,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.29,
                shadowRadius: 4.65,

                elevation: 5,
              }}>
              <TextInput
                style={{
                  // marginTop: 20,
                  // height: 50,
                  // width: wp('90%'),
                  // // borderColor: '#c1c1c1',
                  // // borderBottomWidth: 1,
                  // // textAlign: I18nManager.isRTL ? 'right' : 'left',
                  // paddingLeft: 6,
                  // paddingRight: 6,
                  // fontSize: themeStyle.mediumSize + 2,
                  // color: themeStyle.textColor,
                  // backgroundColor: '#fff',
                  // borderRadius: 15,
                  // borderWidth: 1,

                  fontFamily: 'Lato-Regular',
                  fontSize: 18,
                  color: 'black',
                  width: '88%',
                  height: '100%',
                  paddingHorizontal: 20,
                }}
                placeholderTextColor={'#c1c1c1'}
                selectionColor="#51688F"
                placeholder={
                  this.props.isLoading.Config.languageJson['Last Name']
                }
                onChangeText={(lastName) =>
                  this.setState({lastName, errorMessage: ''})
                }
                value={this.state.lastName}
              />
            </View>

            <View
              style={{
                backgroundColor: '#fff',
                width: '92%',
                height: 60,
                borderColor: '#fff',
                borderWidth: 1,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                // marginBottom: 15,
                marginTop: 20,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.29,
                shadowRadius: 4.65,

                elevation: 5,
              }}>
              <TextInput
                style={{
                  // marginTop: 20,
                  // height: 50,
                  // width: wp('90%'),
                  // borderColor: this.phoneNumberCheck()
                  //   ? 'black'
                  //   : themeStyle.removeBtnColor,
                  // // borderBottomWidth: 1,
                  // // textAlign: I18nManager.isRTL ? 'right' : 'left',
                  // paddingLeft: 6,
                  // paddingRight: 6,
                  // fontSize: themeStyle.mediumSize + 2,
                  // color: themeStyle.textColor,
                  // backgroundColor: '#fff',
                  // borderRadius: 15,
                  // borderWidth: 1,

                  fontFamily: 'Lato-Regular',
                  fontSize: 18,
                  color: 'black',
                  width: '88%',
                  height: '100%',
                  paddingHorizontal: 20,
                }}
                placeholderTextColor={'#c1c1c1'}
                dataDetectorTypes={'phoneNumber'}
                keyboardType={
                  Platform.OS === 'ios' ? 'number-pad' : 'number-pad'
                }
                selectionColor="#51688F"
                placeholder={this.props.isLoading.Config.languageJson2.Mobile}
                onChangeText={(userName) =>
                  this.setState({userName, errorMessage: ''})
                }
                value={this.state.userName}
              />

              <Icon
                name="phone"
                size={15}
                style={{position: 'absolute', right: 20}}
                color="red"
              />
            </View>
            {!this.phoneNumberCheck() ? (
              <Text
                style={{
                  marginTop: 5,
                  color: 'red',
                  fontSize: themeStyle.mediumSize,
                  alignSelf: 'flex-start',
                }}>
                {
                  this.props.isLoading.Config.languageJson2[
                    'The phone number is not valid'
                  ]
                }
              </Text>
            ) : null}

            <View
              style={{
                backgroundColor: '#fff',
                width: '92%',
                height: 60,
                borderColor: '#fff',
                borderWidth: 1,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                // marginBottom: 15,
                marginTop: 20,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.29,
                shadowRadius: 4.65,

                elevation: 5,
              }}>
              <TextInput
                style={{
                  // marginTop: !this.phoneNumberCheck() ? 0 : 20,
                  // height: 50,
                  // width: wp('90%'),
                  // borderColor: this.EmailNumberCheck()
                  //   ? 'black'
                  //   : themeStyle.removeBtnColor,
                  // borderBottomWidth: 1,
                  // // textAlign: I18nManager.isRTL ? 'right' : 'left',
                  // paddingLeft: 6,
                  // paddingRight: 6,
                  // fontSize: themeStyle.mediumSize + 2,
                  // color: themeStyle.textColor,
                  // backgroundColor: '#fff',
                  // borderRadius: 15,
                  // borderWidth: 1,

                  fontFamily: 'Lato-Regular',
                  fontSize: 18,
                  color: 'black',
                  width: '88%',
                  height: '100%',
                  paddingHorizontal: 20,
                }}
                placeholderTextColor={'#c1c1c1'}
                dataDetectorTypes={'address'}
                selectionColor="#51688F"
                placeholder={this.props.isLoading.Config.languageJson.Email}
                onChangeText={(email) =>
                  this.setState({email, errorMessage: ''})
                }
                value={this.state.email}
              />
              <Icon
                name="envelope"
                size={15}
                style={{position: 'absolute', right: 20}}
                color="red"
              />
            </View>

            {!this.EmailNumberCheck() ? (
              <Text
                style={{
                  marginTop: 5,
                  color: 'red',
                  fontSize: themeStyle.mediumSize,
                  alignSelf: 'flex-start',
                }}>
                {
                  this.props.isLoading.Config.languageJson2[
                    'The email address is not valid'
                  ]
                }
              </Text>
            ) : null}

            <View
              style={{
                backgroundColor: '#fff',
                width: '92%',
                height: 60,
                borderColor: '#fff',
                borderWidth: 1,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                // marginBottom: 15,
                marginTop: 20,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.29,
                shadowRadius: 4.65,

                elevation: 5,
              }}>
              <TextInput
                style={{
                  // marginTop: !this.EmailNumberCheck() ? 0 : 15,
                  // height: 50,
                  // width: wp('90%'),
                  // borderColor: '#c1c1c1',
                  // borderBottomWidth: 1,
                  // // textAlign: I18nManager.isRTL ? 'right' : 'left',
                  // paddingLeft: 6,
                  // paddingRight: 6,
                  // fontSize: themeStyle.mediumSize + 2,
                  // color: themeStyle.textColor,
                  // backgroundColor: '#fff',
                  // borderRadius: 15,
                  // borderWidth: 1,

                  fontFamily: 'Lato-Regular',
                  fontSize: 18,
                  color: 'black',
                  width: '88%',
                  height: '100%',
                  paddingHorizontal: 20,
                }}
                placeholderTextColor={'#c1c1c1'}
                secureTextEntry
                selectionColor="#51688F"
                placeholder={this.props.isLoading.Config.languageJson.Password}
                onChangeText={(password) =>
                  this.setState({password, errorMessage: ''})
                }
                value={this.state.password}
              />

              <Icon
                name="key"
                size={15}
                style={{position: 'absolute', right: 20}}
                color="red"
              />
            </View>

            {this.state.errorMessage !== '' ? (
              <Text
                style={{
                  marginTop: 15,
                  color:
                    this.state.errorMessage ===
                    'User Created. Login Using your Username & Password'
                      ? 'green'
                      : 'red',
                }}>
                {this.state.errorMessage}
              </Text>
            ) : null}
            <Text
              style={{
                marginTop: 20,
                // backgroundColor: 'yellow',
                textAlign: 'center',
                justifyContent: 'center',
                // marginLeft: 500,
                // marginRight: 500,
                padding: 5,
                width: wp('83%'),
                // width: '85%',
                fontSize: themeStyle.mediumSize,
                color: themeStyle.textColor,
              }}>
              {
                this.props.isLoading.Config.languageJson[
                  'Creating an account means you\u2019re okay with our'
                ]
              }
              <Text
                onPress={() => {
                  this.props.navigation.navigate('TermAndServiceScreen');
                }}
                style={{
                  color: '#00F',
                  fontSize: themeStyle.mediumSize,
                  textDecorationLine: 'underline',
                }}>
                {` ${this.props.isLoading.Config.languageJson['Term and Services']}`}
              </Text>
              , {''}
              <Text
                onPress={() => {
                  this.props.navigation.navigate('PrivacyPolicyScreen');
                }}
                style={{
                  color: '#00F',
                  fontSize: themeStyle.mediumSize,
                  textDecorationLine: 'underline',
                }}>
                {` ${this.props.isLoading.Config.languageJson['Privacy Policy']}`}
              </Text>
              {''} {this.props.isLoading.Config.languageJson.and} {''}
              <Text
                onPress={() => {
                  this.props.navigation.navigate('RefundPolicy');
                }}
                style={{
                  color: '#00F',
                  fontSize: themeStyle.mediumSize,
                  textDecorationLine: 'underline',
                }}>
                {` ${this.props.isLoading.Config.languageJson['Refund Policy']}`}
              </Text>
            </Text>
            <TouchableOpacity
              disabled={
                !isEnabled ||
                !this.phoneNumberCheck() ||
                !this.EmailNumberCheck()
              }
              onPress={() => this.createAccount(this)}>
              <View
                style={{
                  marginTop: 18,
                  alignItems: 'center',
                  height: 70,
                  borderRadius: 12,
                  width: wp('80%'),
                  backgroundColor: themeStyle.otherBtnsColor,
                  justifyContent: 'center',
                  opacity:
                    !isEnabled ||
                    !this.phoneNumberCheck() ||
                    !this.EmailNumberCheck()
                      ? 0.4
                      : 0.9,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: themeStyle.otherBtnsText,
                    // fontSize: themeStyle.mediumSize,
                    fontSize: 22,

                    fontWeight: 'bold',
                  }}>
                  {this.props.isLoading.Config.languageJson.Register}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={{flexDirection: 'row', width: '100%'}}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#174791',
                  // backgroundColor: '#ed1b24',
                  width: '40%',
                  height: 50,
                  borderColor: '#fff',
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Regular',
                    fontSize: 15,
                    color: '#ffffff',
                    marginLeft: 8,
                  }}>
                  Register With
                </Text>
                {/* <TextInput
                  style={{
                    fontFamily: 'Lato-Regular',
                    fontSize: 18,
                    color: '#ffffff',
                    width: '40%',
                    height: '100%',
                    // paddingHorizontal: 10,
                  }}
                  placeholder="Register With"
                  placeholderTextColor={'#fff'}
                  // placeholderTextColor="#ffffff"
                  // value={company}
                  // onChangeText={(text) => setCompany(text)}
                /> */}

                <Icon
                  name="facebook-f"
                  size={20}
                  style={{position: 'absolute', right: 12}}
                  color="white"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: '#ed1b24',
                  width: '40%',
                  height: 50,
                  borderColor: '#fff',
                  paddingHorizontal: 10,
                  borderWidth: 1,
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Regular',
                    fontSize: 15,
                    color: '#ffffff',
                    marginLeft: 8,
                  }}>
                  Register With
                </Text>
                {/* <TextInput
                  style={{
                    fontFamily: 'Lato-Regular',
                    fontSize: 18,
                    color: '#ffffff',
                    width: '40%',
                    height: '100%',
                    // paddingHorizontal: 10,
                  }}
                  placeholder="Register With"
                  placeholderTextColor={'#fff'}
                  // placeholderTextColor="#ffffff"
                  // value={company}
                  // onChangeText={(text) => setCompany(text)}
                /> */}

                <Icon
                  name="google"
                  size={20}
                  style={{position: 'absolute', right: 10}}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                textAlign: 'center',
                justifyContent: 'center',
                display: 'flex',
                marginTop: 15,
                marginBottom: 30,
              }}>
              <Text
                style={{
                  fontFamily: 'Lato-Regular',
                  fontSize: 15,
                  color: 'black',
                  // marginRight: 5,
                  // marginLeft: 8,
                  // marginTop: 10,
                }}>
                Already have an account?{'  '}
              </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('LoginScreen')}>
                <Text
                  style={{
                    fontFamily: 'Lato-Regular',
                    fontSize: 15,
                    color: 'black',
                    textDecorationLine: 'underline',
                    fontWeight: 'bold',
                    marginTop: 10,
                  }}>
                  Sign in
                </Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state,
});

export default connect(mapStateToProps, null)(CreateAccount);
