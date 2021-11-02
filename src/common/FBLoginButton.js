import React, { PureComponent } from 'react'
import { View, Button, Alert, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import theme from './Theme.style'
const FBSDK = require('react-native-fbsdk')
const { LoginManager, AccessToken } = FBSDK
const WIDTH = Dimensions.get('window').width
class FBLoginButton extends PureComponent {
  ok (NAV, im, h) {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        if (result.isCancelled) {
          Alert.alert('Login was cancelled')
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            this.props.parentReference(data.accessToken, 'fb', h)
          })
          h._storeDatafb1()
          im.LoginValueChange()
        }
      },
      error => {
        Alert.alert(`Login failed with error:${error}`)
      }
    )
  }

  _storeDatafb1 () {
    try {
    } catch (error) {}
  }

  render () {
    return (
      <View style={{ width: WIDTH * 0.9 }}>
        <Button
          title={
            this.props.LoginValue.Config.languageJson2['Login with facebook']
          }
          color={theme.facebook}
          onPress={() => this.ok(this.props.NAV, this.props, this)}
        />
      </View>
    )
  }
}
const mapStateToProps = state => ({
  LoginValue: state
})
const mapDispatchToProps = dispatch => ({
  LoginValueChange: () => dispatch({ type: 'Login', fb1: '1' })
})

export default connect(mapStateToProps, mapDispatchToProps)(FBLoginButton)
