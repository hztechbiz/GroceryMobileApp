import React, {PureComponent} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  I18nManager,
  Image,
  ScrollView,
} from 'react-native';
import {CardStyleInterpolators} from 'react-navigation-stack';
import {getUrl, postHttp} from '../common/WooComFetch';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import themeStyle from '../common/Theme.style';
class ForgotPassword extends PureComponent {
  /// /////////////////////////////////////////////////////////
  static navigationOptions = ({navigation}) => {
    const headerStyle = navigation.getParam('headerTitle');
    console.log(headerStyle, '[=====');
    return {
      headerTitle: headerStyle,
      headerRight: null,
      gestureEnabled: false,
      drawerLockMode: 'locked-closed',
      headerTitleAlign: 'center',
      headerTintColor: themeStyle.headerTintColor,
      headerStyle: {
        backgroundColor: themeStyle.primary,
      },
      headerTitleStyle: {
        fontWeight: Platform.OS === 'android' ? 'bold' : 'normal',
      },
      headerForceInset: {top: 'never', vertical: 'never'},
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    };
  };

  /// /////////////////////////////////////////////////////////
  componentDidMount() {
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson['Forgot Password'],
    });
  }

  /// //////////////////////////////////////////////////////////
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errorMessage: '',
      SpinnerTemp: false,
      success: 0,
    };
  }

  /// ///////////////////////////////////////
  forgetPassword = async (t) => {
    // console.log(t., 'data forgot');
    t.setState({SpinnerTemp: true});
    const formData = new FormData();
    formData.append('email', this.state.email);

    const data = await postHttp(
      getUrl() + '/api/' + 'processforgotpassword',
      formData,
    );
    console.log(data, formData, 'forget res');

    t.setState({
      errorMessage: data.message,
      SpinnerTemp: false,
      success: data.success,
    });
  };

  EmailNumberCheck() {
    const {email} = this.state;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return email.length > 0 && reg.test(this.state.email) === true;
  }

  render() {
    const isEnabled = this.EmailNumberCheck();
    return (
      <ScrollView style={{backgroundColor: themeStyle.backgroundColor}}>
        <View
          style={{
            flex: 1,
            backgroundColor: themeStyle.backgroundColor,
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
          <View style={{opacity: 0.2}}>
            <Image
              key={1}
              style={{
                marginTop: 50,
                width: 150,
                height: 150,
                tintColor: themeStyle.textColor,
              }}
              source={require('../images/icons_stripe.png')}
            />
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextInput
              style={{
                marginTop: 20,
                height: 38,
                width: wp('90%'),
                borderColor: this.EmailNumberCheck()
                  ? '#c1c1c1'
                  : themeStyle.removeBtnColor,
                borderBottomWidth: 1,
                fontSize: themeStyle.mediumSize + 2,
                textAlign: I18nManager.isRTL ? 'right' : 'left',
                paddingLeft: 6,
                paddingRight: 6,
                color: themeStyle.textColor,
              }}
              placeholderTextColor={themeStyle.textColor}
              selectionColor="#51688F"
              placeholder={this.props.isLoading.Config.languageJson.Email}
              onChangeText={(email) => this.setState({email, errorMessage: ''})}
              value={this.state.email}
            />
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
            {this.state.errorMessage ? (
              <Text
                style={{
                  marginTop: 15,
                  color: this.state.success == 1 ? 'green' : 'red',
                }}>
                {this.state.errorMessage}
              </Text>
            ) : null}
            <TouchableOpacity
              disabled={!isEnabled}
              onPress={() => this.forgetPassword(this)}>
              <View
                style={{
                  marginTop: 15,
                  alignItems: 'center',
                  height: 38,
                  width: wp('90%'),
                  backgroundColor: themeStyle.otherBtnsColor,
                  justifyContent: 'center',
                  opacity: !isEnabled ? 0.4 : 0.9,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: themeStyle.otherBtnsText,
                    fontSize: 13,
                  }}>
                  {this.props.isLoading.Config.languageJson.Send}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state,
});

export default connect(mapStateToProps, null)(ForgotPassword);
