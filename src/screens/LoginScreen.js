import React, {PureComponent} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  I18nManager,
  Platform,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import WooComFetch, {getUrl, postHttp, getHttp} from '../common/WooComFetch';
import Toast from 'react-native-easy-toast';
import ImageLoad from '../common/RnImagePlaceH';
import {connect} from 'react-redux';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import Spinner from 'react-native-loading-spinner-overlay';
import FBLoginButton from '../common/FBLoginButton';
import themeStyle from '../common/Theme.style';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SyncStorage from 'sync-storage';
const WIDTH = Dimensions.get('window').width;
class Login extends PureComponent {
  /// /////////////////////////////////////////////////////////
  static navigationOptions = ({navigation}) => {
    const headerStyle = navigation.getParam('headerTitle');
    return {
      headerTitle: headerStyle,
      headerRight: null,
      headerLeft: null,
      gestureEnabled: false,
      // drawerLockMode: 'locked-closed',
      // headerTitleAlign: 'center',
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
    // console.log(

    //   '==sdadasdsa==================',
    // );
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson.Login,
    });
    GoogleSignin.configure({
      // scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
      // iosClientId: '930506877678-469k3k9qcobe44ol761hevm4sa65mfqo.apps.googleusercontent.com', // only for iOS
      webClientId: themeStyle.webClientIdForGoogleSign, // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      // hostedDomain: '', // specifies a hosted domain restriction
      // forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
      // accountName: '', // [Android] specifies an account name on the device that should be used
    });
  }

  /// //////////////////////////////////////////////////////////
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      errorMessage: '',
      SpinnerTemp: false,
      colorGren: false,
    };
  }

  registerDevice = (data) => {
    // console.log(data, 'ksksadmsakddmskm');
    // console.log(id, '====================----------------');
    // const customerData = data;
    // console.log(data, '==========================');
    console.log(SyncStorage.get('customerDataId'));
    const formData = new FormData();
    formData.append('device_id', SyncStorage.get('registerDevice'));
    formData.append('device_type', 'Android');
    formData.append('customers_id', SyncStorage.get('customerDataId'));

    const regData = postHttp(getUrl() + '/api/' + 'registerdevices', formData);
    // console.log(regData, formData, 'all data=================');
    // formData.append('processor', null);
    // formData.append('device_os', this.state.password);
    // formData.append('location', this.state.password);
    // formData.append('device_model', this.state.password);
    // formData.append(
    //   'customers_id',
    //   (customerData.customers_id =
    //     data.id === undefined || data.id == null ? '' : data.id),
    // );
    // formData.append('manufacturer', this.state.password);
  };

  login = async (t) => {
    t.setState({SpinnerTemp: true});
    const formData = new FormData();
    formData.append('email', this.state.userName);
    formData.append('password', this.state.password);

    const data = await postHttp(getUrl() + '/api/' + 'processlogin', formData);
    if (data.success == 1) {
      this.registerDevice();
      t.getUserData(data.data[0], 'simple', t);

      // console.log(data.data[0].id, '--------------');
    }
    if (data.success == 0) {
      t.setState({
        errorMessage: data.message,
        SpinnerTemp: false,
        colorGren: false,
      });
    }
  };

  /// //////////////////////////////////////////////////////////

  // Somewhere in your code
  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.user !== undefined) {
        const data2 = await WooComFetch.postHttp(
          getUrl() + '/api/' + 'googleregistration',
          userInfo.user,
        );

        this.setState({SpinnerTemp: true}, () => {
          if (data2.data !== undefined) {
            if (data2.data.data[0] !== undefined) {
              this.getUserData(data2.data.data[0], 'fb', this);
            } else {
              this.setState({SpinnerTemp: false});
            }
          } else {
            this.setState({SpinnerTemp: false});
          }
        });
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        Alert.alert(
          this.props.isLoading.Config.languageJson2[
            'user cancelled the login flow'
          ],
        );
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert(
          this.props.isLoading.Config.languageJson2[
            'operation (e.g. sign in) is in progress already'
          ],
        );
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        Alert.alert(
          this.props.isLoading.Config.languageJson2[
            'play services not available or outdated'
          ],
        );
      } else {
        // some other error happened
      }
    }
  };

  /// /////////////////////////////////////
  getUserData = (data, type, t) => {
    try {
      console.log('user data', data);
      const customerData = data;
      customerData.customers_telephone =
        data.phone === undefined || data.phone == null ? '' : data.phone;
      // customerData.phone = data.phone === undefined ? '' : data.phone
      customerData.customers_id =
        data.id === undefined || data.id == null ? '' : data.id;
      customerData.customers_firstname =
        data.first_name === undefined || data.first_name == null
          ? ''
          : data.first_name;
      customerData.customers_lastname =
        data.last_name === undefined || data.last_name == null
          ? ''
          : data.last_name;
      customerData.phone =
        data.phone == undefined || data.phone == null ? '' : data.phone;
      customerData.avatar =
        data.avatar === undefined || data.avatar == null
          ? undefined
          : data.avatar;
      customerData.image_id =
        data.image_id === undefined || data.image_id == null
          ? ''
          : data.image_id;
      customerData.customers_dob =
        data.dob === undefined || data.dob == null ? '' : data.dob;
      SyncStorage.set('customerData', customerData);
      SyncStorage.set('customerDataId', customerData.id);
      this.setState({spinnerTemp: true});
      this.props.getAllCategories(this.props);
      this.props.getBannersData();
      this.props.getFlashData(this.props);
      this.props.getTopSeller(this.props);
      this.props.getSpecialData(this.props);
      this.props.getMostLikedData(this.props, this);
      this.props.getProductData(this.props, this);
    } catch (e) {
      t.setState({SpinnerTemp: false});
    }
  };

  /// //////////////////////////////////////
  createAccount = async (info, type, h) => {
    const formData = new FormData();
    formData.append('access_token', info);
    const temp = {};
    temp.access_token = info;
    const data2 = await WooComFetch.postHttp(
      getUrl() + '/api/' + 'facebookregistration',
      temp,
    );
    this.setState({SpinnerTemp: true}, () => {
      if (data2.data !== undefined) {
        if (data2.data.data[0] !== undefined) {
          this.getUserData(data2.data.data[0], 'fb', this);
        } else {
          this.setState({SpinnerTemp: false});
        }
      } else {
        this.setState({SpinnerTemp: false});
      }
    });
  };

  EmailNumberCheck() {
    const {userName} = this.state;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return userName.length == 0 || reg.test(userName) === true;
  }

  /// //////
  render() {
    return (
      <ScrollView
        style={{
          // backgroundColor: themeStyle.backgroundColor,
          backgroundColor: '#F5FAFE',
        }}>
        <Toast
          ref="toast"
          style={{backgroundColor: '#c1c1c1'}}
          position="top"
          positionValue={400}
          fadeOutDuration={7000}
          textStyle={{color: themeStyle.textColor, fontSize: 15}}
        />
        <View
          style={{
            flex: 1,
            // backgroundColor: themeStyle.backgroundColor,
            backgroundColor: '#F5FAFE',
            // backgroundColor: 'green',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Spinner
            visible={this.state.SpinnerTemp}
            textStyle={{
              backgroundColor: themeStyle.loadingIndicatorColor,
              color: themeStyle.loadingIndicatorColor,
            }}
          />
          {/* <View style={{opacity: 0.1}}>
            <ImageLoad
              key={1}
              style={{marginTop: 30, width: 150, height: 150}}
              loadingStyle={{
                size: 'large',
                color: themeStyle.loadingIndicatorColor,
              }}
              placeholder={false}
              ActivityIndicator={true}
              placeholderStyle={{width: 0, height: 0}}
              source={require('../images/icons_stripe.png')}
            />
          </View> */}
          <View style={{marginBottom: -30}}>
            <ImageLoad
              source={require('./../images/logo.png')}
              style={{
                height: 200,
                width: 200,
                resizeMode: 'contain',
                marginVertical: 65,
                // backgroundColor: 'red',
                // marginTop: 5,
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: 'red',
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
              {this.props.isLoading.Config.showLoginForm ? (
                <TextInput
                  style={{
                    // marginTop: 20,
                    // height: 38,
                    // width: WIDTH * 0.9,
                    // borderColor: this.EmailNumberCheck()
                    //   ? '#c1c1c1'
                    //   : themeStyle.removeBtnColor,
                    // borderBottomWidth: 1,

                    // textAlign: I18nManager.isRTL ? 'right' : 'left',
                    // paddingLeft: 6,
                    // paddingRight: 6,
                    // fontSize: themeStyle.mediumSize + 2,
                    // color: themeStyle.textColor,

                    fontFamily: 'Lato-Regular',
                    fontSize: 18,
                    color: 'black',
                    width: '88%',
                    height: '100%',
                    paddingHorizontal: 20,
                  }}
                  placeholderTextColor={'#c1c1c1'}
                  selectionColor={themeStyle.primaryDark}
                  placeholder={this.props.isLoading.Config.languageJson.Email}
                  onChangeText={(userName) =>
                    this.setState({userName, errorMessage: ''})
                  }
                  value={this.state.userName}
                />
              ) : null}

              <Icon
                name="envelope"
                size={15}
                style={{position: 'absolute', right: 20}}
                color="red"
                solid
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
              {this.props.isLoading.Config.showLoginForm ? (
                <TextInput
                  style={{
                    // marginTop: 15,
                    // height: 38,
                    // width: WIDTH * 0.9,
                    // borderColor: '#c1c1c1',
                    // borderBottomWidth: 1,
                    // textAlign: I18nManager.isRTL ? 'right' : 'left',
                    // paddingLeft: 6,
                    // paddingRight: 6,
                    // fontSize: themeStyle.mediumSize + 2,
                    // color: themeStyle.textColor,

                    fontFamily: 'Lato-Regular',
                    fontSize: 18,
                    color: 'black',
                    width: '88%',
                    height: '100%',
                    paddingHorizontal: 20,
                  }}
                  placeholderTextColor={'#c1c1c1'}
                  secureTextEntry
                  selectionColor={themeStyle.primaryDark}
                  placeholder={
                    this.props.isLoading.Config.languageJson.Password
                  }
                  onChangeText={(password) =>
                    this.setState({password, errorMessage: ''})
                  }
                  value={this.state.password}
                />
              ) : null}

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
                  marginTop: 18,
                  color: this.state.colorGren ? 'green' : 'red',
                }}>
                {this.state.errorMessage}
              </Text>
            ) : null}

            {this.props.isLoading.Config.showLoginForm ? (
              <TouchableOpacity
                disabled={
                  !!(this.state.userName === '' || this.state.password === '')
                }
                onPress={() => this.login(this)}>
                <View
                  style={{
                    marginTop: 18,
                    alignItems: 'center',
                    height: 70,
                    borderRadius: 12,
                    // width: wp('80%'),
                    width: WIDTH * 0.8,
                    backgroundColor: themeStyle.otherBtnsColor,
                    justifyContent: 'center',
                    opacity:
                      this.state.userName === '' || this.state.password === ''
                        ? 0.4
                        : 0.9,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: themeStyle.otherBtnsText,
                      // fontSize: themeStyle.mediumSize,
                      // fontWeight: '500',
                      fontSize: 22,

                      fontWeight: 'bold',
                    }}>
                    {this.props.isLoading.Config.languageJson.Login}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}

            {/* <View style={{flexDirection: 'row', width: '100%', marginTop: 15}}> */}
            {/* <TouchableOpacity
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
                    marginLeft: 18,
                  }}>
                  Login With
                </Text> */}
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

            {/* <Icon
                  name="facebook-f"
                  size={20}
                  style={{position: 'absolute', right: 16}}
                  color="white"
                />
              </TouchableOpacity> */}

            {/* <TouchableOpacity
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
                    marginLeft: 16,
                  }}>
                  Login With
                </Text> */}
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

            {/* <Icon
                  name="google"
                  size={20}
                  style={{position: 'absolute', right: 14}}
                  color="white"
                />
              </TouchableOpacity> */}
            {/* </View> */}

            {this.props.isLoading.Config.enablePhoneLogin ? (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('LoginWithPhoneScreen');
                }}>
                <View
                  style={{
                    marginTop: 18,
                    alignItems: 'center',
                    height: 38,
                    width: WIDTH * 0.9,
                    backgroundColor: themeStyle.otherBtnsColor,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: themeStyle.otherBtnsText,
                      fontSize: themeStyle.mediumSize,
                      fontWeight: '500',
                    }}>
                    {`${this.props.isLoading.Config.languageJson['Login with']} ${this.props.isLoading.Config.languageJson.Mobile}`}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}

            {/* {this.props.isLoading.Config.showLoginForm ? (
              <Text
                onPress={() => {
                  this.props.navigation.navigate('ForgotPasswordScreen');
                }}
                style={{
                  marginTop: 18,
                  paddingBottom: 7,
                  fontSize: themeStyle.mediumSize + 1,
                  marginBottom: 6,
                  fontWeight: '500',
                  color: themeStyle.textColor,
                }}>
                {
                  this.props.isLoading.Config.languageJson[
                    "I've forgotten my password?"
                  ]
                }
              </Text>
            ) : null} */}

            {/* <Text
              style={{
                textAlign: 'center',
                justifyContent: 'center',
                display: 'flex',
                // marginTop: 15,
              }}> */}
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                marginVertical: 10,
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
                Don't have an account?{'  '}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('CreateAccountScreen')
                }>
                <Text
                  style={{
                    fontFamily: 'Lato-Regular',
                    fontSize: 15,
                    color: 'black',
                    textDecorationLine: 'underline',
                    fontWeight: 'bold',
                    // marginLeft: 8,
                    // marginTop: 10,
                  }}>
                  Register
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('ForgotPasswordScreen')
                }>
                <Text>Forgot password</Text>
              </TouchableOpacity>
            </View>
            {/* </Text> */}

            {this.props.isLoading.Config.fbButton === 1 ? (
              <FBLoginButton
                onRef={(ref) => (this.parentReference = ref)}
                parentReference={(a, s, d) =>
                  this.setState({SpinnerTemp: true}, () => {
                    this.createAccount(a, s, d);
                  })
                }
              />
            ) : null}

            {/* {this.props.isLoading.Config.showLoginForm ? (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('CreateAccountScreen')
                }>
                <View
                  style={{
                    marginTop: 18,
                    borderWidth: 0.6,
                    borderColor: themeStyle.textColor,
                    alignItems: 'center',
                    height: 38,
                    width: WIDTH * 0.9,
                    backgroundColor: themeStyle.backgroundColor,
                    justifyContent: 'center',
                    borderRadius: 4,
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: themeStyle.mediumSize + 1,
                      color: themeStyle.textColor,
                      fontWeight: '500',
                    }}>
                    {this.props.isLoading.Config.languageJson.Register}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null} */}

            {this.props.isLoading.Config.googleButton == 1 ? (
              <GoogleSigninButton
                style={{
                  marginTop: 18,
                  alignItems: 'center',
                  height: 46,
                  width: WIDTH * 0.93,
                  backgroundColor: themeStyle.backgroundColor,
                  justifyContent: 'center',
                  marginBottom: 2,
                }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={this.signIn}
                // disabled={this.state.isSigninInProgress}
              />
            ) : null}

            {SyncStorage.get('cartScreen') === 1 &&
            this.props.isLoading.Config.guestCheckOut ? (
              <TouchableOpacity
                onPress={() => {
                  const temp = {};
                  temp.id = 0;
                  temp.billing = {
                    first_name: '',
                    last_name: '',
                    company: '',
                    address_1: '',
                    address_2: '',
                    city: '',
                    state: '',
                    postcode: '',
                    country: '',
                    email: '',
                    phone: '',
                  };
                  temp.billingCountryName = '';
                  temp.billingStateName = '';
                  temp.shipping = {
                    first_name: '',
                    last_name: '',
                    company: '',
                    address_1: '',
                    address_2: '',
                    city: '',
                    state: '',
                    postcode: '',
                    country: '',
                  };
                  temp.shippingCountryName = '';
                  temp.shippingStateName = '';
                  SyncStorage.set('customerData', temp);
                  SyncStorage.set('gustLogin', true);

                  if (this.props.isLoading.Config.checkOutPage == 1) {
                    this.props.navigation.push('WebViewScreen', {
                      onePageCheckOut2: false,
                      //
                    });
                  } else {
                    this.props.navigation.navigate('ShippingAddressScreen');
                  }
                }}>
                <View
                  style={{
                    marginTop: 18,
                    // borderWidth: 1,
                    // borderColor: themeStyle.primary,
                    alignItems: 'center',
                    height: 50,
                    width: WIDTH * 0.8,
                    // backgroundColor: themeStyle.backgroundColor,
                    backgroundColor: '#8494A3',
                    justifyContent: 'center',
                    borderRadius: 12,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: themeStyle.mediumSize,
                      // color: themeStyle.primary,
                      color: '#fff',
                      fontWeight: '500',
                    }}>
                    {
                      this.props.isLoading.Config.languageJson2[
                        'Continue as a Guest'
                      ]
                    }
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </ScrollView>
    );
  }
}
const mapDispatchToProps = (dispatch) => ({
  getAllCategories: (props) => {
    const formData = new FormData();
    formData.append(
      'customers_id',
      SyncStorage.get('customerData').customers_id !== null &&
        SyncStorage.get('customerData').customers_id !== undefined
        ? SyncStorage.get('customerData').customers_id
        : null,
    );
    formData.append('page_number', 0);
    formData.append(
      'language_id',
      SyncStorage.get('langId') === undefined ? '1' : SyncStorage.get('langId'),
    );
    formData.append(
      'currency_code',
      props.isLoading.Config.productsArguments.currency,
    );
    dispatch({
      type: 'GET_ALL_CATEGORIES',
      payload: formData,
    });
  },

  getBannersData: () => {
    dispatch(async (dispatch) => {
      const formData = new FormData();
      formData.append(
        'customers_id',
        SyncStorage.get('customerData').customers_id !== null &&
          SyncStorage.get('customerData').customers_id !== undefined
          ? SyncStorage.get('customerData').customers_id
          : null,
      );
      formData.append(
        'language_id',
        SyncStorage.get('langId') === undefined
          ? '1'
          : SyncStorage.get('langId'),
      );
      var dat = {};

      dat.languages_id = '1';
      const json = await getHttp(
        getUrl() + '/api/' + 'getbanners?languages_id=1',
        {},
      );
      if (json.data.success === '1') {
        dispatch({
          type: 'ADD_BANNERS',
          payload: json.data.data,
        });
      }
    });
  },
  getFlashData: (props) => {
    dispatch(async (dispatch) => {
      const formData = new FormData();
      formData.append(
        'customers_id',
        SyncStorage.get('customerData').customers_id !== null &&
          SyncStorage.get('customerData').customers_id !== undefined
          ? SyncStorage.get('customerData').customers_id
          : null,
      );
      formData.append('page_number', 0);
      formData.append(
        'language_id',
        SyncStorage.get('langId') === undefined
          ? '1'
          : SyncStorage.get('langId'),
      );
      formData.append(
        'currency_code',
        props.isLoading.Config.productsArguments.currency,
      );
      formData.append('type', 'flashsale');
      const json = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData,
      );
      dispatch({
        type: 'ADD_FLASH_PRODUCTS',
        payload1: json.product_data,
      });
    });
  },
  getTopSeller: (props) => {
    dispatch(async (dispatch) => {
      const formData = new FormData();
      formData.append(
        'customers_id',
        SyncStorage.get('customerData').customers_id !== null &&
          SyncStorage.get('customerData').customers_id !== undefined
          ? SyncStorage.get('customerData').customers_id
          : null,
      );
      formData.append('page_number', 0);
      formData.append(
        'language_id',
        SyncStorage.get('langId') === undefined
          ? '1'
          : SyncStorage.get('langId'),
      );
      formData.append(
        'currency_code',
        props.isLoading.Config.productsArguments.currency,
      );
      formData.append('type', 'top seller');
      const json = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData,
      );
      dispatch({
        type: 'ADD_TOP_SELLER_PRODUCTS',
        payload10: json.product_data,
      });
    });
  },
  getSpecialData: (props) => {
    dispatch(async (dispatch) => {
      const formData = new FormData();
      formData.append(
        'customers_id',
        SyncStorage.get('customerData').customers_id !== null &&
          SyncStorage.get('customerData').customers_id !== undefined
          ? SyncStorage.get('customerData').customers_id
          : null,
      );
      formData.append('page_number', 0);
      formData.append(
        'language_id',
        SyncStorage.get('langId') === undefined
          ? '1'
          : SyncStorage.get('langId'),
      );
      formData.append(
        'currency_code',
        props.isLoading.Config.productsArguments.currency,
      );
      formData.append('type', 'special');
      const json = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData,
      );
      dispatch({
        type: 'ADD_SPECIAL_PRODUCTS',
        payload2: json.product_data,
      });
    });
  },
  getMostLikedData: (props2, props) => {
    dispatch(async (dispatch) => {
      const formData = new FormData();
      formData.append(
        'customers_id',
        SyncStorage.get('customerData').customers_id !== null &&
          SyncStorage.get('customerData').customers_id !== undefined
          ? SyncStorage.get('customerData').customers_id
          : null,
      );
      formData.append('page_number', 0);
      formData.append(
        'language_id',
        SyncStorage.get('langId') === undefined
          ? '1'
          : SyncStorage.get('langId'),
      );
      formData.append(
        'currency_code',
        props2.isLoading.Config.productsArguments.currency,
      );
      formData.append('type', 'most liked');
      const json = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData,
      );
      dispatch({
        type: 'ADD_MOST_LIKED_PRODUCTS',
        payload3: json.product_data,
      });
    });
  },
  getProductData: (r, t) => {
    dispatch(async (dispatch) => {
      const formData = new FormData();
      formData.append(
        'customers_id',
        SyncStorage.get('customerData').customers_id !== null &&
          SyncStorage.get('customerData').customers_id !== undefined
          ? SyncStorage.get('customerData').customers_id
          : null,
      );
      formData.append('page_number', 0);
      formData.append(
        'language_id',
        SyncStorage.get('langId') === undefined
          ? '1'
          : SyncStorage.get('langId'),
      );
      formData.append(
        'currency_code',
        t.props.isLoading.Config.productsArguments.currency,
      );
      formData.append('categories_id', 0);
      const json = await postHttp(
        getUrl() + '/api/' + 'getallproducts',
        formData,
      );
      SyncStorage.set('gustLogin', false);
      t.setState({SpinnerTemp: false});
      if (SyncStorage.get('cartScreen') === 1) {
        SyncStorage.set('cartScreen', 0);
        if (t.props.navigation.state.params.updateCart !== undefined) {
          t.props.navigation.state.params.updateCart();
        }
        t.props.navigation.goBack();
      } else {
        if (t.props.navigation.state.params.updateCart !== undefined) {
          t.props.navigation.state.params.updateCart();
        }
        if (SyncStorage.get('drawerLogin')) {
          SyncStorage.set('drawerLogin', false);
          t.props.navigation.navigate('SETTINGS');
        } else {
          t.props.navigation.navigate('SettingsScreen');
        }
      }
      t.refs.toast.show(
        t.props.isLoading.Config.languageJson2['successfully Login'],
      );
      t.setState({
        userName: '',
        password: '',
      });
      dispatch({
        type: 'ADD_Products',
        payload6: json.product_data,
      });
    });
  },
});
const mapStateToProps = (state) => ({
  isLoading: state,
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
