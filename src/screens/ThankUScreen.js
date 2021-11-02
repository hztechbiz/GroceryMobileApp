import React, { PureComponent } from 'react'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { Text, View, Platform, TouchableOpacity, Dimensions } from 'react-native'
import { Icon } from 'native-base'
import themeStyle from '../common/Theme.style'
import { connect } from 'react-redux'
const WIDTH = Dimensions.get('window').width
class News extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam(
      'headerTitle'
    )
    return {
      headerTitle: headerStyle,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
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
      headerForceInset: { top: 'never', vertical: 'never' }
    }
  };

  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson2['Cart Page']
    })
  }

  render () {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: themeStyle.backgroundColor,
        paddingTop: 50
      }}>
        <Icon name={'md-checkbox-outline'} style={{ color: themeStyle.otherBtnsColor, fontSize: 80 }} />
        <View>
          <Text style={{
            fontSize: 20,
            textAlign: 'center',
            margin: 10,
            color: themeStyle.textColor
          }}>
            {
              this.props.isLoading.Config.languageJson[
                'Thank You'
              ]
            }
          </Text>
          <Text style={{
            marginTop: -2,
            fontSize: themeStyle.smallSize,
            marginBottom: 10,
            alignSelf: 'center',
            color: themeStyle.textColor
          }}>
            {
              this.props.isLoading.Config.languageJson[
                'Thank you for shopping with us.'
              ]
            }
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: themeStyle.otherBtnsColor,
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 4,
              width: WIDTH * 0.8
            }}
            onPress={() => this.props.navigation.navigate('MyOrdersScreen')}
          >
            <Text style={{
              fontSize: themeStyle.mediumSize,
              color: themeStyle.otherBtnsText
            }}>
              { this.props.isLoading.Config.languageJson[
                'My Orders'
              ]}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
const mapStateToProps = state => ({
  isLoading: state
})

export default connect(
  mapStateToProps,
  null
)(News)
