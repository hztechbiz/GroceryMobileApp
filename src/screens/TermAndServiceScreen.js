import React, { PureComponent } from 'react'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { connect } from 'react-redux'
import { View, ScrollView, Linking, Platform, Text } from 'react-native'
import HTML from 'react-native-render-html'
import themeStyle from '../common/Theme.style'
class TermAndServices extends PureComponent {
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
    headerTitle: this.props.isLoading.Config.languageJson['Term and Services']
  })
}

render () {
  return (
    <View style={{
      padding: 10,
      flex: 1,
      backgroundColor: themeStyle.backgroundColor

    }}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: themeStyle.backgroundColor
        }}

      >
        { this.props.isLoading.Config.termServices === '' ||
       this.props.isLoading.Config.termServices === null ||
       this.props.isLoading.Config.termServices === undefined ? (
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
            }} html={this.props.isLoading.Config.termServices} baseFontStyle={{ color: themeStyle.textColor }}
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
)(TermAndServices)
