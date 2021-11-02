import React, { Component } from 'react'
import {
  View,
  PermissionsAndroid,
  Platform,
  Alert
} from 'react-native'
import { connect } from 'react-redux'
import database from '@react-native-firebase/database'
import { CardStyleInterpolators } from 'react-navigation-stack'
import themeStyle from '../common/Theme.style'
import MapView, { Marker } from 'react-native-maps'
import Spinner from 'react-native-loading-spinner-overlay'

class RewardPoints extends Component {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    return {
      headerTitle: headerStyle,
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

  constructor (props) {
    super(props)
    this.state = {
      x: {
        latitude:
          this.props.navigation.state.params.data.delivery_latitude !== null &&
          this.props.navigation.state.params.data.delivery_latitude !==
            undefined
            ? parseFloat(
              this.props.navigation.state.params.data.delivery_latitude
            )
            : 32.100847,
        longitude:
          this.props.navigation.state.params.data.delivery_longitude !== null &&
          this.props.navigation.state.params.data.delivery_longitude !==
            undefined
            ? parseFloat(
              this.props.navigation.state.params.data.delivery_longitude
            )
            : 72.688091,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009
      },
      deliveryBoyLatLong: {
        latitude:
          this.props.navigation.state.params.data.delivery_latitude !== null &&
          this.props.navigation.state.params.data.delivery_latitude !==
            undefined
            ? parseFloat(
              this.props.navigation.state.params.data.delivery_latitude
            )
            : 32.100847,
        longitude:
          this.props.navigation.state.params.data.delivery_longitude !== null &&
          this.props.navigation.state.params.data.delivery_longitude !==
            undefined
            ? parseFloat(
              this.props.navigation.state.params.data.delivery_longitude
            )
            : 72.688091,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009
      },
      SpinnerTemp: false
    }
    this.mapRef = null
  }

  async componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson2['Map Screen']
    })
    if (Platform.OS === 'android') {
      await this.requestLocationPermission()
    } else {
      database()
        .ref(
          'location/' +
            this.props.navigation.state.params.data.deliveryboy_info[0]
              .deliveryboy_id
        )
        .on('value', snapshot => {
          const newCoords = {}
          newCoords.latitude = parseFloat(snapshot.val().latitude)
          newCoords.longitude = parseFloat(snapshot.val().longitude)

          newCoords.latitudeDelta = 0.09
          newCoords.longitudeDelta = 0.09
          this.setState(
            {
              deliveryBoyLatLong: newCoords
            },
            () => {
            }
          )
        })
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
        database()
          .ref(
            'location/' +
              this.props.navigation.state.params.data.deliveryboy_info[0]
                .deliveryboy_id
          )
          .on('value', snapshot => {
            const newCoords = {}
            newCoords.latitude = parseFloat(snapshot.val().latitude)
            newCoords.longitude = parseFloat(snapshot.val().longitude)

            newCoords.latitudeDelta = 0.09
            newCoords.longitudeDelta = 0.09
            this.setState(
              {
                deliveryBoyLatLong: newCoords
              },
              () => {
              }
            )
          })
      } else {
        Alert.alert('Please Turn On Device Location')
      }
    } catch (err) {
      Alert.alert(err)
    }
  }

  onLayout = () => {
    setTimeout(() => {
      if (
        this.state.deliveryBoyLatLong !== null &&
        this.state.deliveryBoyLatLong !== undefined &&
        this.state.x !== null &&
        this.state.x !== undefined
      ) {
        this.mapRef.fitToCoordinates(
          [this.state.deliveryBoyLatLong, this.state.x],
          {
            edgePadding: { top: 200, right: 200, bottom: 200, left: 200 },
            animated: false,
            useNativeDriver: true
          }
        )
      }
    }, 3000)
  }

  render () {
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={this.state.SpinnerTemp} />
        <MapView
          showsUserLocation={true}
          ref={ref => {
            this.mapRef = ref
          }}
          style={{ flex: 1 }}
          showsMyLocationButton={true}
          onMapReady={this.onLayout}
          initialRegion={this.state.deliveryBoyLatLong}
          region={this.state.deliveryBoyLatLong}>
          {this.props.navigation.state.params.data.delivery_latitude !== null &&
          this.props.navigation.state.params.data.delivery_latitude !==
            undefined &&
          this.props.navigation.state.params.data.delivery_longitude !== null &&
          this.props.navigation.state.params.data.delivery_longitude !==
            undefined ? (
              <Marker
                coordinate={{
                  latitude: parseFloat(
                    this.props.navigation.state.params.data.delivery_latitude
                  ),
                  longitude: parseFloat(
                    this.props.navigation.state.params.data.delivery_longitude
                  )
                }}
                title={this.props.isLoading.Config.languageJson2.Address}
                description={
                  this.props.isLoading.Config.languageJson2['My Location']
                }
              />
            ) : null}
          <Marker
            coordinate={this.state.deliveryBoyLatLong}
            title={this.props.isLoading.Config.languageJson2.Address}
            description={
              this.props.isLoading.Config.languageJson2['Delivery Boy']
            }
            pinColor={themeStyle.primaryDark}
          />
        </MapView>
      </View>
    )
  }
}
const mapStateToProps = state => ({
  isLoading: state
})

export default connect(mapStateToProps, null)(RewardPoints)
