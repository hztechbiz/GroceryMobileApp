import React, {Component} from 'react';
import {
  Text,
  View,
  Dimensions,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {CardStyleInterpolators} from 'react-navigation-stack';
import themeStyle from '../common/Theme.style';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Toast from 'react-native-easy-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import ShoppingCartIcon from '../common/ShoppingCartIcon';
import Geocoder from 'react-native-geocoding';
import {GOOGLE_MAP_KEY} from '../../constant/constant';
import WooComFetch, { getUrl } from '../common/WooComFetch';
Geocoder.init(GOOGLE_MAP_KEY);

const {width} = Dimensions.get('window');
var areas = ['Shah Faisal Colony'];
class RewardPoints extends Component {
  static navigationOptions = ({navigation}) => {
    const headerStyle = navigation.getParam('headerTitle');
    return {
      headerTitle: headerStyle,
      headerRight: () => <ShoppingCartIcon navigation={navigation} />,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerTitleAlign: 'center',
      headerTintColor: themeStyle.headerTintColor,
      headerStyle: {
        backgroundColor: themeStyle.primary,
      },
      headerTitleStyle: {
        fontWeight: Platform.OS === 'android' ? 'bold' : 'normal',
      },
      headerForceInset: {top: 'never', vertical: 'never'},
      gestureEnabled: true,
    };
  };



  async componentDidMount() {
    console.log('Hello');
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson2['Map Screen'],
    });
    if (Platform.OS === 'android') {
      await this.requestLocationPermission();
    } else {
      Geolocation.getCurrentPosition(
        (info) => {
          const newCoords = {};
          newCoords.latitude = parseFloat(JSON.stringify(info.coords.latitude));
          newCoords.longitude = parseFloat(
            JSON.stringify(info.coords.longitude),
          );
          newCoords.latitudeDelta = 0.09;
          newCoords.longitudeDelta = 0.09;
          this.setState({
            x: newCoords,
            SpinnerTemp: false,
          });
        },

        (error) => {
          this.refs.toast.show(
            error.message +
              this.props.isLoading.Config.languageJson2[
                'Press and hold the marker to set location'
              ],
          );
          this.setState({
            SpinnerTemp: false,
          });
        },
        {
          enableHighAccuracy: false,
          timeout: 20000,
        },
      );
    }
  }

  requestLocationPermission = async () => {
    this.getArea()
    // console.log(map_area, 'all map area')
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: themeStyle.title,
          message: themeStyle.title + 'App access to your location ',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      console.log(areas, 'kadskdmsksad');
      console.log(this.state.map_area, 'kadskdmsksad');
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (info) => {
            // console.log(info, '=-====-==');

            const newCoords = {};
            newCoords.latitude = parseFloat(
              JSON.stringify(info.coords.latitude),
            );
            newCoords.longitude = parseFloat(
              JSON.stringify(info.coords.longitude),
            );
            newCoords.latitudeDelta = 0.09;
            newCoords.longitudeDelta = 0.09;
            this.setState({
              x: newCoords,
              SpinnerTemp: false,
            });

            Geocoder.from(newCoords.latitude, newCoords.longitude)
              .then((json) => {
                // console.log(json);
                var addressComponent =
                  json.results[0].address_components[1].long_name;
                var addressComponentTwo =
                  json.results[0].address_components[1].long_name;
                // var ar = areas.includes
                // cons
                // if (
                //   areas.includes(addressComponent) ||
                //   areas.includes(addressComponentTwo)
                // ) {
                //   Alert.alert('kasdkmdas');
                // } else {
                //   Alert.alert('addressComponentTwo Sorry');
                // }
                // var addressComponent = json.results[0].formatted_address;

                console.log(addressComponent);
              })
              .catch((error) => console.warn(error));
            // console.log(newCoords.latitude, 'current latitude');
            // console.log(newCoords.longitude, 'current longitude');
            // if (newCoords.latitude > 24.861) {
            //   console.log('sdasdasds');
            //   Alert.alert('not avail');
            // }
          },
          (error) => {
            this.refs.toast.show(
              error.message +
                this.props.isLoading.Config.languageJson2[
                  'Press and hold the marker to set location'
                ],
            );
            this.setState({
              SpinnerTemp: false,
            });
          },
          {
            enableHighAccuracy: false,
            timeout: 20000,
          },
        );
      } else {
        this.refs.toast.show(
          this.props.isLoading.Config.languageJson2[
            'Press and hold the marker to set location'
          ],
        );
        this.setState({
          SpinnerTemp: false,
        });
      }
    } catch (err) {
      this.refs.toast.show(
        this.props.isLoading.Config.languageJson2[
          'Press and hold the marker to set location'
        ],
      );
      this.setState({
        SpinnerTemp: false,
      });
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      x: {
        latitude: 32.100847,
        longitude: 72.688091,

        latitudeDelta: 0.009,
        longitudeDelta: 0.009,
      },
      SpinnerTemp: true,
      map_area: []
    };
  }
  getArea = async()=>{
    const data = await WooComFetch.postHttp(
      getUrl() + '/api/' + 'getarea',
    );
    console.log(data.success)
    if(data.success ==1){
      console.log(data.data.data, 'data ============')
      this.setState({map_area:data.data.data })
    }
    if(data.success === 0){
      this.refs.toast.show(
        'Something Went Wrong',
      );
  }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Spinner visible={this.state.SpinnerTemp} />
        <Toast
          ref="toast"
          style={{backgroundColor: '#c1c1c1'}}
          position="bottom"
          positionValue={200}
          fadeOutDuration={7000}
          textStyle={{color: themeStyle.textColor, fontSize: 15}}
        />
        <MapView
          showsUserLocation={true}
          style={{flex: 1, marginBottom: 40, marginTop: 10}}
          showsMyLocationButton={true}
          initialRegion={this.state.x}
          region={this.state.x}>
          <Marker
            draggable
            coordinate={this.state.x}
            title={this.props.isLoading.Config.languageJson2.Address}
            onDragEnd={(e) => {
              console.log(this.state.map_area)
              const newCoords = {};
              // if (newCoords.latitude <= 24.9 && newCoords.latitude >= 24.8) {
              //   Alert.alert('avail');
              // } else {
              //   Alert.alert('not avail');
              // }
              // console.log(e, ' endd');

              newCoords.latitude = e.nativeEvent.coordinate.altitude;

              newCoords.latitude = e.nativeEvent.coordinate.latitude;
              newCoords.longitude = e.nativeEvent.coordinate.longitude;

              newCoords.latitudeDelta = 0.09;
              newCoords.longitudeDelta = 0.09;

              Geocoder.from(newCoords.latitude, newCoords.longitude).then(
                (json) => {
                  // console.log(json);
                  // var addressComponent =
                  //   json.results[0].address_components[1].short_name;
                  // var addressComponentTwo =
                  //   json.results[0].address_components[1].long_name;
                  console.log(
                    'after drag short',
                    json.results[0].address_components,
                   
                  );
                  console.log(
                    'after drag short 2',
                    json.results[0].address_components[2],
                   
                  );

                  console.log(
                    'after drag short 3',
                    json.results[0].address_components[3],
                   
                  );
                  console.log(
                    'after drag short 4',
                    json.results[0].address_components,
                   
                  );
                  // console.log();
                  // var ar = areas.includes
                  // cons
                  // if (
                  //   areas.includes(addressComponent) ||
                  //   areas.includes(addressComponentTwo)
                  // ) {
                  //   Alert.alert('kasdkmdas');
                  // } else {
                  //   Alert.alert('addressComponent Two Sorry');
                  // }
                },
              );
              // console.log(newCoords, 'drage endd');
              this.setState({x: newCoords});
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
            width,
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: themeStyle.mediumSize,
              fontWeight: '500',
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
            Geocoder.from(this.state.x.latitude, this.state.x.longitude).then(
              (json) => {
                // console.log(json);
                var addressComponent =
                  json.results[0].address_components[1].short_name;
                var addressComponentTwo =
                  json.results[0].address_components[1].long_name;
                  var addressComponentThree = json.results[0].address_components[3].long_name
                  var addressComponentFour = json.results[0].address_components[3].short_name

                console.log(
                  'after drag',
                  json.results[0].address_components[1].short_name,
                );
                console.log(
                  'after drag',
                  json.results[0].address_components
                );
                // var ar = areas.includes
                
                if (
                //  this.state.map_area.includes(addressComponent) ||
                //  this.state.map_area.includes(addressComponentTwo) || addressComponentThree || addressComponentFour
                areas.includes(addressComponent) ||
                areas.includes(addressComponentTwo) || addressComponentThree || addressComponentFour
                ) {
                  this.props.navigation.state.params.onGoBackFun(
                    json?.results[0]?.address_components[3]?.long_name,
                  );
                  this.props.navigation.pop();
                } else {
                  this.refs.toast.show(
                    'Not available on selected area. Delivery Only available on Shah Faisal Colony.We are coming to your area very soon.',
                  );
                }
              },
            );

            // if (
            //   this.state.x.latitude >= 24.79 &&
            //   this.state.x.latitude < 24.87 &&
            //   this.state.x.longitude >= 67.087 &&
            //   this.state.x.longitude < 67.22
            // ) {
            //   this.props.navigation.state.params.onGoBackFun(this.state.x);
            //   this.props.navigation.pop();
            // } else {
            //   this.refs.toast.show(
            //     'Not available on selected area.Delivery Only available on Shah faisal town.We are coming to your area very soon.',
            //   );
            // }
          }}
          // disabled={Geocoder.from(
          //   this.state.x.latitude,o
          //   this.state.x.longitude,
          // ).then((json) => {
          //   // console.log(json);
          //   var addressComponent =
          //     json.results[0].address_components[1].short_name;
          //   var addressComponentTwo =
          //     json.results[0].address_components[1].long_name;
          //   // var ar = areas.includes
          //   // cons
          //   if (
          //     areas.includes(addressComponent) ||
          //     areas.includes(addressComponentTwo)
          //   ) {
          //     return true;
          //   } else {
          //     return false;
          //   }
          // })}
          style={{
            flex: 1,
            bottom: 0,
            position: 'absolute',
            width: width,
            borderColor: '#fff',
            alignItems: 'center',
            height: 42,
            backgroundColor: themeStyle.otherBtnsColor,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: themeStyle.otherBtnsText,
              fontSize: themeStyle.mediumSize,
              fontWeight: '500',
              position: 'absolute',
            }}>
            {this.props.isLoading.Config.languageJson2['Set this location']}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  isLoading: state,
});

export default connect(mapStateToProps, null)(RewardPoints);
