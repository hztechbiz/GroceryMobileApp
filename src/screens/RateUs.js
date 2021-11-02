import Rate, { AndroidMarket } from 'react-native-rate'
import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  I18nManager,
  Platform
} from 'react-native'
import ImageLoad from '../common/RnImagePlaceH'
import { ListItem, Icon } from 'native-base'
import themeStyle from '../common/Theme.style'
export default class rateUs extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      rated: false
    }
  }

  render () {
    return this.props.value === 'menu' ? (
      <View>
        <ListItem noIndent={true}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: themeStyle.backgroundColor
            }}
            onPress={() => {
              const options = {
                AppleAppID: this.props.appleId.toString(),
                GooglePackageName: '', // also require changing
                AmazonPackageName: '',
                OtherAndroidURL: 'http://www.randomappstore.com/app/47172391',
                preferredAndroidMarket: AndroidMarket.Google,
                preferInApp: true,
                openAppStoreIfInAppFails: true,
                fallbackPlatformURL: 'http://www.mywebsite.com/myapp.html'
              }
              Rate.rate(options, success => {
                if (success) {
                  this.setState({ rated: true })
                }
              })
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',

                alignItems: 'center',
                padding: !this.props.defaultIcons
                  ? I18nManager.isRTL
                    ? 1
                    : 0
                  : I18nManager.isRTL
                    ? 8
                    : 0,
                paddingBottom: 0,
                paddingTop: 0,
                marginLeft: I18nManager.isRTL ? 0 : Platform.OS === 'ios' ? -1 : 0
              }}>
              {!this.props.defaultIcons ? (
                <ImageLoad
                  key={0}
                  style={{
                    width: 22,
                    height: 22,
                    marginRight: 0,
                    paddingLeft: 0
                  }}
                  loadingStyle={{ size: 'large', color: themeStyle.primary }}
                  placeholder={false}
                  ActivityIndicator={true}
                  placeholderStyle={{ width: 0, height: 0 }}
                  source={this.props.imageTemp}
                />
              ) : (
                <Icon
                  name={this.props.iconName}
                  size={20}
                  style={{
                    color: themeStyle.textColor,
                    fontSize: 19,
                    marginLeft: I18nManager.isRTL ? -6 : 3
                  }}
                />
              )}
              <Text
                style={{
                  textAlign: 'left',
                  color: themeStyle.textColor,
                  fontSize: themeStyle.mediumSize,
                  paddingLeft: I18nManager.isRTL ? 11 : 9,
                  paddingRight: 11
                }}>
                {this.props.text}
              </Text>
            </View>
          </TouchableOpacity>
        </ListItem>
      </View>
    ) : (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.categoryView}
        onPress={() => {
          const options = {
            AppleAppID: this.props.appleId.toString(),
            GooglePackageName: '', // also require changing
            AmazonPackageName: '',
            OtherAndroidURL: 'http://www.randomappstore.com/app/47172391',
            preferredAndroidMarket: AndroidMarket.Google,
            preferInApp: true,
            openAppStoreIfInAppFails: true,
            fallbackPlatformURL: 'http://www.mywebsite.com/myapp.html'
          }
          Rate.rate(options, success => {
            if (success) {
              this.setState({ rated: true })
            }
          })
        }}>
        <View
          style={{
            alignItems: 'center',
            height: 40
          }}>
          <View
            style={[
              { padding: 5, paddingRight: 10, paddingTop: 0 },
              Platform.OS === 'android' ? styles.iconContainer : null
            ]}>
            <Icon
              name={this.props.iconName}
              style={{ color: themeStyle.primaryContrast, fontSize: 24 }}
            />
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  categoryView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 1
  },
  tabComponents: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    paddingLeft: 13
  },
  categoryText: {
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#4d4d4d',
    fontSize: themeStyle.mediumSize,
    paddingLeft: 7,
    paddingRight: 10
  },
  iconContainer: {
    paddingLeft: 10,
    paddingTop: 8,
    marginRight: 5
  }
})
