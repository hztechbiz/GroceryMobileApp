import React, { Component } from 'react'
import {
  Text,
  View,
  Dimensions,
  PermissionsAndroid,
  Platform,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import { CardStyleInterpolators } from 'react-navigation-stack'
import themeStyle from '../common/Theme.style'
import MapView, { Marker } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation'
import Toast from 'react-native-easy-toast'
import Spinner from 'react-native-loading-spinner-overlay'
import ShoppingCartIcon from '../common/ShoppingCartIcon'
const { width } = Dimensions.get('window')
class RewardPoints extends Component {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    return {
      headerTitle: headerStyle,
      headerRight: () => <ShoppingCartIcon navigation={navigation} />,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
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

  async componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson2['Map Screen']
    })
    if (Platform.OS === 'android') {
      await this.requestLocationPermission()
    } else {
      Geolocation.getCurrentPosition(
        info => {
          const newCoords = {}
          newCoords.latitude = parseFloat(JSON.stringify(info.coords.latitude))
          newCoords.longitude = parseFloat(
            JSON.stringify(info.coords.longitude)
          )
          newCoords.latitudeDelta = 0.09
          newCoords.longitudeDelta = 0.09
          this.setState({
            x: newCoords,
            SpinnerTemp: false
          })
        },

        error => {
          this.refs.toast.show(error.message + this.props.isLoading.Config.languageJson2[
            'Press and hold the marker to set location'
          ])
          this.setState(
            {
              SpinnerTemp: false
            }
          )
        },
        {
          enableHighAccuracy: false,
          timeout: 20000
        }
      )
    }
  }

  requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: themeStyle.title,
          message: themeStyle.title + 'App access to your location ',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          info => {
            const newCoords = {}
            newCoords.latitude = parseFloat(
              JSON.stringify(info.coords.latitude)
            )
            newCoords.longitude = parseFloat(
              JSON.stringify(info.coords.longitude)
            )
            newCoords.latitudeDelta = 0.09
            newCoords.longitudeDelta = 0.09
            this.setState({
              x: newCoords,
              SpinnerTemp: false
            })
          },
          error => {
            this.refs.toast.show(error.message + this.props.isLoading.Config.languageJson2[
              'Press and hold the marker to set location'
            ])
            this.setState(
              {
                SpinnerTemp: false
              }
            )
          },
          {
            enableHighAccuracy: false,
            timeout: 20000
          }
        )
      } else {
        this.refs.toast.show(this.props.isLoading.Config.languageJson2[
          'Press and hold the marker to set location'
        ])
        this.setState(
          {
            SpinnerTemp: false
          }
        )
      }
    } catch (err) {
      this.refs.toast.show(this.props.isLoading.Config.languageJson2[
        'Press and hold the marker to set location'
      ])
      this.setState(
        {
          SpinnerTemp: false
        }
      )
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      x: {
        latitude: 32.100847,
        longitude: 72.688091,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009
      },
      SpinnerTemp: true
    }
  }

  render () {
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={this.state.SpinnerTemp} />
        <Toast
          ref='toast'
          style={{ backgroundColor: '#c1c1c1' }}
          position='bottom'
          positionValue={200}
          fadeOutDuration={7000}
          textStyle={{ color: themeStyle.textColor, fontSize: 15 }}
        />
        <MapView
          showsUserLocation={true}
          style={{ flex: 1, marginBottom: 40, marginTop: 10 }}
          showsMyLocationButton={true}
          initialRegion={this.state.x}
          region={this.state.x}>
          <Marker
            draggable
            coordinate={this.state.x}
            title={this.props.isLoading.Config.languageJson2.Address}
            onDragEnd={e => {
              const newCoords = {}
              newCoords.latitude = e.nativeEvent.coordinate.latitude
              newCoords.longitude = e.nativeEvent.coordinate.longitude
              newCoords.latitudeDelta = 0.09
              newCoords.longitudeDelta = 0.09
              this.setState({ x: newCoords })
            }}
            description={
              this.props.isLoading.Config.languageJson2['My Location']
            }
          />
        </MapView>
        <View
          style={{
            backgroundColor: themeStyle.outOfStockBtnColor,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            zIndex: 12,
            top: 0,
            width
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: themeStyle.mediumSize,
              fontWeight: '500'
            }}>
            {
              this.props.isLoading.Config.languageJson2[
                'Press and hold the marker to set location'
              ]
            }
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            this.props.navigation.state.params.onGoBackFun(this.state.x)
            this.props.navigation.pop()
          }}
          style={{
            flex: 1,
            bottom: 0,
            position: 'absolute',
            width: width,
            borderColor: '#fff',
            alignItems: 'center',
            height: 42,
            backgroundColor: themeStyle.otherBtnsColor,
            justifyContent: 'center'
          }}>
          <Text
            style={{
              color: themeStyle.otherBtnsText,
              fontSize: themeStyle.mediumSize,
              fontWeight: '500',
              position: 'absolute'
            }}>
            {this.props.isLoading.Config.languageJson2['Set this location']}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
const mapStateToProps = state => ({
  isLoading: state
})

export default connect(mapStateToProps, null)(RewardPoints)
