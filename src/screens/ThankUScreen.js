import React, {PureComponent} from 'react';
import {CardStyleInterpolators} from 'react-navigation-stack';
import {Text, View, Platform, TouchableOpacity, Dimensions} from 'react-native';
import {Icon} from 'native-base';
import themeStyle from '../common/Theme.style';
import {connect} from 'react-redux';
import Icons from 'react-native-vector-icons/FontAwesome5';

const WIDTH = Dimensions.get('window').width;
class News extends PureComponent {
  static navigationOptions = ({navigation}) => {
    const headerStyle = navigation.getParam('headerTitle');
    return {
      headerTitle: headerStyle,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerRight: null,
      headerLeft: null,
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
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson2['Cart Page'],
    });
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: themeStyle.backgroundColor,
          paddingTop: 50,
        }}>
        <Icons name="check" size={75} color="#13f037" />
        <View>
          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              textAlign: 'center',
              margin: 10,
              color: '#404040',
            }}>
            {this.props.isLoading.Config.languageJson['Thank You']}
          </Text>
          <Text
            style={{
              marginTop: -2,
              fontSize: 13,
              marginBottom: 10,
              alignSelf: 'center',
              color: themeStyle.textColor,
            }}>
            {
              this.props.isLoading.Config.languageJson[
                'Thank you for shopping with us.'
              ]
            }
          </Text>
          {/* <TouchableOpacity
            style={{
              backgroundColor: themeStyle.primary,
              // backgroundColor: '#2d79be',
              marginTop: 12,
              paddingVertical: 18,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              width: 280,
            }}
            onPress={() => this.props.navigation.navigate('MyOrdersScreen')}>
            <Text
              style={{
                fontSize: 17,
                textTransform: 'uppercase',
                color: themeStyle.otherBtnsText,
              }}>
              {this.props.isLoading.Config.languageJson['My Orders']}
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Home3Screen')}>
            <Text
              style={{
                marginTop: -2,
                fontSize: 15,
                marginTop: 16,
                alignSelf: 'center',
                textTransform: 'uppercase',
                color: '#ed1c24',
                borderBottomWidth: 1,
                borderBottomColor: '#ed1c24',
              }}>
              {this.props.isLoading.Config.languageJson['Continue Shopping']}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  isLoading: state,
});

export default connect(mapStateToProps, null)(News);
