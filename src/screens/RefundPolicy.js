import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { View, ScrollView, Linking, Platform, Text } from 'react-native'
import HTML from 'react-native-render-html'
import themeStyle from '../common/Theme.style'
class RefundPolicy extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    return {
      headerTitle: headerStyle,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerRight: null,
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
      gestureEnabled: true
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson['Refund Policy']
    })
  }

  render () {
    return (
      <View style={{
        padding: 10,
        backgroundColor: themeStyle.backgroundColor,
        flex: 1
      }}>
        <ScrollView>
          { this.props.isLoading.Config.refundPolicy === '' ||
       this.props.isLoading.Config.refundPolicy === null ||
       this.props.isLoading.Config.refundPolicy === undefined ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  alignContent: 'center'
                }}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 40,
                    alignSelf: 'center'
                  }}>
                  <Text style={{ fontSize: themeStyle.largeSize + 2, color: themeStyle.textColor }}>
                    {this.props.isLoading.Config.languageJson2['No Data Found']}
                  </Text>
                </View>
              </View>
            )
            : <HTML
              onLinkPress={(event, href) => {
                Linking.openURL(href)
              }}
              html={this.props.isLoading.Config.refundPolicy}
              baseFontStyle={{ color: themeStyle.textColor }}
            />
          }
        </ScrollView>
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
)(RefundPolicy)
