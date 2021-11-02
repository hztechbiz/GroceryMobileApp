import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native'
import WooComFetch, { getUrl } from '../common/WooComFetch'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { connect } from 'react-redux'
import { Icon } from 'native-base'
import Spinner from 'react-native-loading-spinner-overlay'
import MapView from 'react-native-maps'
import themeStyle from '../common/Theme.style'
import ShoppingCartIcon from '../common/ShoppingCartIcon'
class RewardPoints extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    return {
      headerTitle: headerStyle,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerTitleAlign: 'center',
      headerRight: () => <ShoppingCartIcon navigation={navigation} />,
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
      headerTitle: this.props.isLoading.Config.languageJson['Contact Us']
    })
  }

  constructor (props) {
    super(props)
    this.state = {
      firstName: '',
      Email: '',
      msg: '',
      errorMessage: '',
      SpinnerTemp: false
    }
  }

  submit = async () => {
    this.setState({ SpinnerTemp: true })
    const formData = new FormData()
    formData.append('name', this.state.firstName)
    formData.append('email', this.state.Email)
    formData.append('message', this.state.msg)
    const json = await WooComFetch.postHttp(
      getUrl() + '/api/' + 'contactus', formData
    )
    if (json.data.success == 1) {
      this.setState({
        firstName: '',
        msg: '',
        Email: '',
        errorMessage: json.data.message,
        SpinnerTemp: false
      })
    }
    this.setState({
      SpinnerTemp: false
    })
  }

  singaleRow (iconName, text) {
    return (
      <View
        style={{
          padding: 2,
          flexDirection: 'row',
          backgroundColor: themeStyle.backgroundColor,
          paddingTop: 2
        }}
      >
        <Icon name={iconName} style={{ color: 'gray', fontSize: 21 }} />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: themeStyle.mediumSize,
              color: themeStyle.textColor,
              fontWeight: 'normal',
              padding: 6,
              paddingTop: 1
            }}
          >
            {text}
          </Text>
        </View>
      </View>
    )
  }

  canBeSubmitted () {
    const { Email, firstName, msg } = this.state
    return (Email.length > 0) && firstName.length > 0 && msg.length > 0 &&
    this.EmailNumberCheck()
  }

  EmailNumberCheck () {
    const { Email } = this.state
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return (
      (Email.length == 0) || reg.test(this.state.Email) === true
    )
  }

  render () {
    const isEnabled = this.canBeSubmitted()
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.SpinnerTemp}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={{ flex: 1, backgroundColor: themeStyle.textColor }}>
          <MapView
            style={{ flex: 1 }}
            region={{
              latitude: parseFloat(
                this.props.isLoading.Config.latitude !== undefined &&
                    this.props.isLoading.Config.latitude !== null &&
                    this.props.isLoading.Config.latitude.toString() !== 'NaN' &&
                    this.props.isLoading.Config.latitude.toString() !== ''
                  ? this.props.isLoading.Config.latitude
                  : 0.0922
              ),
              longitude: parseFloat(
                this.props.isLoading.Config.longitude !== undefined &&
                    this.props.isLoading.Config.longitude !== null &&
                    this.props.isLoading.Config.longitude.toString() !== 'NaN' &&
                    this.props.isLoading.Config.longitude.toString() !== ''
                  ? this.props.isLoading.Config.longitude
                  : 0.0421
              ),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
          >
            <MapView.Marker
              coordinate={{
                latitude: parseFloat(
                  this.props.isLoading.Config.latitude !== undefined &&
                      this.props.isLoading.Config.latitude !== null &&
                      this.props.isLoading.Config.latitude.toString() !== 'NaN' &&
                      this.props.isLoading.Config.latitude.toString() !== ''
                    ? this.props.isLoading.Config.latitude
                    : 0.0922
                ),
                longitude: parseFloat(
                  this.props.isLoading.Config.longitude !== undefined &&
                      this.props.isLoading.Config.longitude !== null &&
                      this.props.isLoading.Config.longitude.toString() !== 'NaN' &&
                      this.props.isLoading.Config.longitude.toString() !== ''
                    ? this.props.isLoading.Config.longitude
                    : 0.0421
                )
              }}
              title={'Address'}
              description={
                this.props.isLoading.Config.address !== undefined &&
                  this.props.isLoading.Config.address !== null
                  ? this.props.isLoading.Config.address
                  : ''
              }
            />
          </MapView>
        </View>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: themeStyle.backgroundColor
          }}
        >
          <ScrollView>
            <View
              style={{
                flex: 1,
                backgroundColor: themeStyle.backgroundColor,
                padding: 10,
                margin: 10,
                marginTop: 10,
                elevation: 4,
                shadowOffset: { width: 1, height: 1 },
                shadowColor: '#000',
                shadowOpacity: 0.6
              }}
            >
              {this.singaleRow('pin', this.props.isLoading.Config.address)}
              {this.singaleRow('mail', this.props.isLoading.Config.email)}
              {this.singaleRow('call', this.props.isLoading.Config.phoneNo)}
              <TextInput
                style={{
                  marginTop: 2,
                  height: 38,
                  width: '97%',
                  borderColor: '#c1c1c1',
                  borderWidth: 1,
                  margin: 6,
                  paddingLeft: 6,
                  fontSize: themeStyle.mediumSize,
                  color: themeStyle.textColor
                }}
                placeholderTextColor={themeStyle.textColor}
                selectionColor='#51688F'
                placeholder={this.props.isLoading.Config.languageJson.Name}
                onChangeText={firstName => {
                  this.setState({ firstName, errorMessage: '' })
                }}
                value={this.state.firstName}
              />
              <TextInput
                style={{
                  marginTop: 2,
                  height: 38,
                  width: '97%',
                  borderColor: this.EmailNumberCheck() ? '#c1c1c1' : themeStyle.removeBtnColor,
                  borderWidth: 1,
                  margin: 6,
                  paddingLeft: 6,
                  fontSize: themeStyle.mediumSize,
                  color: themeStyle.textColor
                }}
                placeholderTextColor={themeStyle.textColor}
                selectionColor='#51688F'
                placeholder={this.props.isLoading.Config.languageJson.Email}
                onChangeText={Email => {
                  this.setState({ Email, errorMessage: '' })
                }}
                value={this.state.Email}
              />
              <TextInput
                style={{
                  marginTop: 2,
                  height: 38,
                  width: '97%',
                  borderColor: '#c1c1c1',
                  borderWidth: 1,
                  margin: 6,
                  paddingLeft: 6,
                  fontSize: themeStyle.mediumSize,
                  color: themeStyle.textColor
                }}
                placeholderTextColor={themeStyle.textColor}
                selectionColor='#51688F'
                placeholder={this.props.isLoading.Config.languageJson['Your Messsage']}
                onChangeText={msg => {
                  this.setState({ msg, errorMessage: '' })
                }}
                value={this.state.msg}
              />

              {this.state.errorMessage === '' ? null : (
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: themeStyle.textColor,
                      fontWeight: 'normal',
                      padding: 10,
                      paddingTop: 4,
                      paddingLeft: 6,
                      fontSize: themeStyle.mediumSize
                    }}
                  >
                    {this.state.errorMessage}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  this.submit()
                }}
                disabled={!isEnabled}
              >
                <View
                  style={{
                    borderColor: '#fff',
                    alignItems: 'center',
                    height: 38,
                    backgroundColor: themeStyle.primary,
                    flexDirection: 'row',
                    padding: 4,
                    justifyContent: 'center',
                    width: '97%',
                    alignSelf: 'center',
                    opacity: (!isEnabled) ? 0.5 : 0.9
                  }}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: themeStyle.mediumSize + 1,
                      paddingTop: 1,
                      fontWeight: '500'
                    }}
                  >
                    {this.props.isLoading.Config.languageJson.Send}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
)(RewardPoints)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeStyle.backgroundColor
  }
})
