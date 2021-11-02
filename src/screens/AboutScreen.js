import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Switch,
  I18nManager,
  ScrollView,
  Platform
} from 'react-native'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { connect } from 'react-redux'
import HTML from 'react-native-render-html'
import { Icon } from 'native-base'
import ShoppingCartIcon from '../common/ShoppingCartIcon'
import theme from '../common/Theme.style'
class About extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    return {
      headerTitle: headerStyle,
      headerRight: () => <ShoppingCartIcon navigation={navigation} />,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerForceInset: { top: 'never', vertical: 'never' },
      headerTintColor: theme.headerTintColor,
      headerStyle: {
        backgroundColor: theme.primary
      },
      headerTitleStyle: {
        fontWeight: Platform.OS === 'android' ? 'bold' : 'normal'
      },
      headerTitleAlign: 'center'
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson['About Us']
    })
  }

  constructor (props) {
    super(props)
    this.state = {
      isLoading: true
    }
  }

  categoryFun (text, iconName, nav) {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingBottom: 0,
            paddingTop: 0
          }}>
          {
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: theme.backgroundColor
              }}
              onPress={() => {
                text ===
                this.props.isLoading.Config.languageJson['Official Website']
                  ? Linking.openURL(nav)
                  : this.props.navigation.push(nav)
              }}>
              <View style={styles.tabComponents}>
                <Text style={{
                  fontSize: theme.mediumSize,
                  color: theme.textColor
                }}>{text}</Text>
                {text ===
                this.props.isLoading.Config.languageJson[
                  'Turn on/off Local Notifications'
                ] ? (
                    <Switch
                      thumbColor={'#4267b2'}
                      onValueChange={value => this.toggleSwitch1(value, text)}
                      value={this.state.switch1Value}
                    />
                  ) : text ===
                  this.props.isLoading.Config.languageJson[
                    'Turn on/off Notifications'
                  ] ? (
                      <Switch
                        thumbColor={'#4267b2'}
                        onValueChange={value => this.toggleSwitch1(value, text)}
                        value={this.state.switch2Value}
                      />
                    ) : (
                      <Icon
                        name={iconName}
                        style={{ color: '#4d4d4d', fontSize: 25 }}
                      />
                    )}
              </View>
            </TouchableOpacity>
          }
        </View>

        <View style={{ width: '100%', height: 1, backgroundColor: '#4d4d4d' }} />
      </View>
    )
  }

  /// ///////////////////////////////////////
  render () {
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={{
        flex: 1,
        padding: 6,
        backgroundColor: theme.backgroundColor
      }}>
        <View>
          <HTML
            html={this.props.isLoading.Config.aboutUs}
            baseFontStyle={{
              fontSize: theme.largeSize,
              color: theme.textColor
            }}
          />
        </View>
        <View>
          <View height={7} />

          {this.categoryFun(
            this.props.isLoading.Config.languageJson['Official Website'],
            I18nManager.isRTL ? 'arrow-back' : 'arrow-forward',
            this.props.isLoading.Config.siteUrl !== undefined &&
              this.props.isLoading.Config.siteUrl !== null &&
              this.props.isLoading.Config.siteUrl !== ''
              ? this.props.isLoading.Config.siteUrl
              : 'https://www.google.com/'
          )}
          {this.categoryFun(
            this.props.isLoading.Config.languageJson['Privacy Policy'],
            I18nManager.isRTL ? 'arrow-back' : 'arrow-forward',
            'PrivacyPolicyScreen'
          )}
          {this.categoryFun(
            this.props.isLoading.Config.languageJson['Refund Policy'],
            I18nManager.isRTL ? 'arrow-back' : 'arrow-forward',
            'RefundPolicy'
          )}
          {this.categoryFun(
            this.props.isLoading.Config.languageJson['Term and Services'],
            I18nManager.isRTL ? 'arrow-back' : 'arrow-forward',
            'TermAndServiceScreen'
          )}
        </View>
      </ScrollView>
    )
  }
}
const mapStateToProps = state => ({
  isLoading: state
})

export default connect(mapStateToProps, null)(About)

const styles = StyleSheet.create({
  tabComponents: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    paddingLeft: 13
  }
})
