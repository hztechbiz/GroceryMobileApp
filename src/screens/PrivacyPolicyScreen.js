import React, { PureComponent } from 'react'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { connect } from 'react-redux'
import { View, ScrollView, Linking, Platform, Text } from 'react-native'
import HTML from 'react-native-render-html'
import themeStyle from '../common/Theme.style'
class RefundPolicy extends PureComponent {
static navigationOptions = ({ navigation }) => {
  const headerStyle = navigation.getParam(
    'headerTitle'
  )
  return {
    headerTitle: headerStyle,
    headerRight: null,
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
};

componentDidMount () {
  this.props.navigation.setParams({
    headerTitle: this.props.isLoading.Config.languageJson['Privacy Policy']
  })
}

render () {
  return (
    <View style={{
      padding: 10,
      backgroundColor: themeStyle.backgroundColor,
      flex: 1
    }}>
      <ScrollView
        style={{
          backgroundColor: themeStyle.backgroundColor,
          flex: 1
        }}

      >
        { this.props.isLoading.Config.privacyPolicy === '' ||
       this.props.isLoading.Config.privacyPolicy === null ||
       this.props.isLoading.Config.privacyPolicy === undefined ? (
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
            }} html={this.props.isLoading.Config.privacyPolicy} baseFontStyle={{ color: themeStyle.textColor, fontSize: themeStyle.mediumSize }}
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
