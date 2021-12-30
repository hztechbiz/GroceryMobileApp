import React, {Component} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  I18nManager,
  Platform,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {Container, Content, Text} from 'native-base';
import {CardStyleInterpolators} from 'react-navigation-stack';
import WooComFetch, {getUrl} from '../common/WooComFetch';
import * as global from '../common/LocationData';
import SyncStorage from 'sync-storage';
import {connect} from 'react-redux';
import themeStyle from '../common/Theme.style';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

class ShippingAddress extends Component {
  static navigationOptions = ({navigation}) => {
    const headerStyle = navigation.getParam('headerTitle');
    return {
      headerTitle: headerStyle,
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
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    };
  };

  componentDidMount() {
    if (this.props.navigation.state.params.type !== 'add') {
      this.state.shippingData.entry_firstname =
        this.props.navigation.state.params.data.firstname;
      this.state.shippingData.entry_lastname =
        this.props.navigation.state.params.data.lastname;
      this.state.shippingData.entry_street_address =
        this.props.navigation.state.params.data.street;
      this.state.shippingData.entry_country_name =
        this.props.navigation.state.params.data.country_name;
      this.state.shippingData.entry_zone =
        this.props.navigation.state.params.data.zone_name;
      this.state.shippingData.entry_postcode =
        this.props.navigation.state.params.data.postcode;
      this.state.shippingData.entry_country_id =
        this.props.navigation.state.params.data.countries_id;
      this.state.shippingData.entry_address_id =
        this.props.navigation.state.params.data.address_id;
      this.state.shippingData.entry_city =
        this.props.navigation.state.params.data.city;
      this.state.shippingData.entry_zone_id =
        this.props.navigation.state.params.data.zone_id;
      this.state.shippingData.entry_state =
        this.props.navigation.state.params.data.state;
      this.state.shippingData.suburb =
        this.props.navigation.state.params.data.suburb;
      this.state.shippingData.address_id =
        this.props.navigation.state.params.data.address_id;
    }
    this.props.navigation.setParams({
      headerTitle:
        this.props.isLoading.Config.languageJson2['Shipping Address'],
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      spinnerTemp: false,
      shippingData: [],
      placeholderArray: [
        this.props.isLoading.Config.languageJson['First Name'],
        this.props.isLoading.Config.languageJson['Last Name'],
        this.props.isLoading.Config.languageJson.Address,
        // this.props.isLoading.Config.languageJson2.Location,
        // this.props.isLoading.Config.languageJson.Country,
        // this.props.isLoading.Config.languageJson.Zone,
        // this.props.isLoading.Config.languageJson.City,
        // this.props.isLoading.Config.languageJson['Post code'],
      ],

      otherArray: [{value: 'other', name: 'other'}],
    };
  }

  /// ///////////////////////////////////////
  searchFilterFun(text, name, selection, nav) {
    return null;
    // <TouchableOpacity
    //   onPress={() =>
    //     this.props.navigation.navigate(nav, {
    //       data: text,
    //       id: this.state.shippingData.entry_country_id,
    //       page: 'editShipping',
    //       onSelectionBase: selection,
    //       onGoBack: (name, selectedValue) =>
    //         this.refresh(name, selectedValue),
    //     })
    //   }>
    //   <View
    //     style={{
    //       marginRight: 20,
    //       marginLeft: 20,
    //       marginTop: 20,
    //       paddingTop: 10,
    //       paddingBottom: 10,
    //       paddingLeft: 4,
    //       width: wp('90%'),
    //       borderRadius: 1,
    //       borderWidth: 1,
    //       borderColor: '#c0c0c0',
    //     }}>
    //     <Text
    //       style={{
    //         color:
    //           name === 'Country' || name === 'Zone'
    //             ? '#c0c0c0'
    //             : themeStyle.textColor,
    //         fontSize: themeStyle.mediumSize,
    //       }}>
    //       {name}
    //     </Text>
    //   </View>
    // </TouchableOpacity>
  }

  /// ////////////////////////////////////////
  customTextView(placeholderText, index) {
    return placeholderText ===
      this.props.isLoading.Config.languageJson.Country ? (
      <View>
        {this.searchFilterFun(
          global.data.countries,
          this.state.shippingData.entry_country_name === undefined ||
            this.state.shippingData.entry_country_name === null
            ? placeholderText
            : this.state.shippingData.entry_country_name,
          'shipping',
          'SearchFilterClass',
        )}
      </View>
    ) : placeholderText === this.props.isLoading.Config.languageJson.Zone ? (
      <View>
        {this.searchFilterFun(
          global.data.countries,
          this.state.shippingData.entry_zone === undefined ||
            this.state.shippingData.entry_zone === null
            ? placeholderText
            : this.state.shippingData.entry_zone,
          'shipping',
          'SearchFilterZone',
        )}
      </View>
    ) : (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => this.shippingInput[index].focus()}>
        <TextInput
          style={{
            marginTop: 20,
            height: 38,
            width: wp('90%'),
            borderColor: '#c1c1c1',
            borderWidth: 1,
            marginLeft: 20,
            fontSize: themeStyle.mediumSize,
            textAlign: I18nManager.isRTL ? 'right' : 'left',
            paddingLeft: 6,
            paddingRight: 6,
            color: themeStyle.textColor,
            // backgroundColor: 'pink',
          }}
          selectionColor="#51688F"
          placeholder={` ${placeholderText}`}
          placeholderTextColor={'#c0c0c0'}
          // onChangeText={(text) => {
          //   index === 0
          //     ? (this.state.shippingData.entry_firstname = text)
          //     : index === 1
          //     ? (this.state.shippingData.entry_lastname = text)
          //     : index === 2
          //     ? (this.state.shippingData.entry_street_address = text)
          //     : index === 3
          //     ? (this.state.shippingData.entry_country_name = text)
          //     : index === 4
          //     ? (this.state.shippingData.entry_zone = text)
          //     : index === 5
          //     ? (this.state.shippingData.entry_city = text)
          //     : (this.state.shippingData.entry_postcode = text);
          //   this.setState({shippingData: this.state.shippingData});
          // }}
          onChangeText={(text) => {
            index === 0
              ? (this.state.shippingData.entry_firstname = text)
              : index === 1
              ? (this.state.shippingData.entry_lastname = text)
              : (this.state.shippingData.entry_street_address = text);

            this.setState({shippingData: this.state.shippingData});
          }}
          // value={
          //   index === 0
          //     ? this.state.shippingData.entry_firstname
          //     : index === 1
          //     ? this.state.shippingData.entry_lastname
          //     : index === 2
          //     ? this.state.shippingData.entry_street_address
          //     : index === 3
          //     ? this.state.shippingData.entry_country_name
          //     : index === 4
          //     ? this.state.shippingData.entry_zone
          //     : index === 5
          //     ? this.state.shippingData.entry_city
          //     : this.state.shippingData.entry_postcode
          // }
          value={
            index === 0
              ? this.state.shippingData.entry_firstname
              : index === 1
              ? this.state.shippingData.entry_lastname
              : this.state.shippingData.entry_street_address
            // index === 2
            // ? this.state.shippingData.entry_street_address
            // : index === 3
            // ? this.state.shippingData.entry_country_name
            // : index === 4
            // ? this.state.shippingData.entry_zone
            // : index === 5
            // ? this.state.shippingData.entry_city
            // : this.state.shippingData.entry_postcode
          }
        />
      </TouchableOpacity>
    );
  }

  /// //////////////////////////////////
  refresh = (name, selectedValue) => {
    if (SyncStorage.get('tempdata').entry_country_id !== undefined) {
      this.state.shippingData.entry_country_id =
        SyncStorage.get('tempdata').entry_country_id;
      this.state.shippingData.entry_country_name =
        SyncStorage.get('tempdata').entry_country_name;
      this.state.shippingData.entry_country_code =
        SyncStorage.get('tempdata').entry_country_code;
      this.state.shippingData.entry_zone =
        SyncStorage.get('tempdata').entry_zone;
    }
    if (SyncStorage.get('tempdata').entry_zone !== undefined) {
      this.state.shippingData.entry_zone =
        SyncStorage.get('tempdata').entry_zone;
      this.state.shippingData.entry_zone_id =
        SyncStorage.get('tempdata').entry_zone_id;
    }
    this.setState({
      shippingData: this.state.shippingData,
      placeholderArray: this.state.placeholderArray,
    });
  };

  //= ===========================================================================================
  // updating shipping address of the user
  updateShippingAddress = async (type) => {
    this.state.shippingData.customers_id =
      SyncStorage.get('customerData').customers_id;
    const dat = this.state.shippingData;
    dat.is_default = 0;
    const formData = new FormData();
    formData.append('entry_firstname', this.state.shippingData.entry_firstname);
    formData.append('entry_lastname', this.state.shippingData.entry_lastname);
    formData.append(
      'entry_street_address',
      this.state.shippingData.entry_street_address,
    );
    formData.append(
      'entry_country_name',
      this.state.shippingData.entry_country_name,
    );
    formData.append('entry_zone', this.state.shippingData.entry_zone);
    formData.append('entry_postcode', this.state.shippingData.entry_postcode);
    formData.append(
      'entry_country_id',
      this.state.shippingData.entry_country_id,
    );
    formData.append(
      'entry_address_id',
      this.state.shippingData.entry_address_id,
    );
    formData.append('entry_city', this.state.shippingData.entry_city);
    formData.append('entry_zone_id', this.state.shippingData.entry_zone_id);
    formData.append('entry_state', this.state.shippingData.entry_state);
    formData.append('suburb', this.state.shippingData.suburb);
    formData.append('address_id', this.state.shippingData.address_id);
    formData.append('customers_id', this.state.shippingData.customers_id);
    // formData.append('address_id', this.state.shippingData.address_id);
    // formData.append('entry_latitude', this.state.shippingData.entry_latitude);
    // formData.append('entry_longitude', this.state.shippingData.entry_longitude);

    formData.append('is_default', 0);
    await WooComFetch.postHttp(getUrl() + '/api/' + type, formData);
    this.setState({spinnerTemp: false});
    this.props.navigation.pop();
  };

  //   /// ///////////////////////////////////
  canBeUpdatingBilling() {
    let temp = 0;
    if (
      this.state.shippingData.entry_firstname !== undefined &&
      this.state.shippingData.entry_firstname !== '' &&
      this.state.shippingData.entry_lastname !== undefined &&
      this.state.shippingData.entry_lastname !== '' &&
      this.state.shippingData.entry_street_address !== undefined &&
      this.state.shippingData.entry_street_address !== ''
      // &&
      // this.state.shippingData.entry_country_name !== undefined &&
      // this.state.shippingData.entry_country_name !== '' &&
      // this.state.shippingData.entry_zone !== undefined &&
      // this.state.shippingData.entry_zone !== '' &&
      // this.state.shippingData.entry_city !== undefined &&
      // this.state.shippingData.entry_city !== '' &&
      // this.state.shippingData.entry_postcode !== undefined &&
      // this.state.shippingData.entry_postcode !== ''
    ) {
      temp++;
    }
    if (temp === 1) {
      temp = 0;
      return true;
    }
    return false;
  }

  render() {
    const canBeUpdatingBillings = this.canBeUpdatingBilling();
    return (
      <Container
        style={{
          backgroundColor: themeStyle.backgroundColor,
          flex: 1,
        }}>
        <View>
          <Spinner visible={this.state.spinnerTemp} />
          <FlatList
            data={this.state.placeholderArray}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(item) =>
              this.customTextView(
                this.state.placeholderArray[item.index],
                item.index,
              )
            }
          />
          {this.props.navigation.state.params.type === 'update' ? (
            <TouchableOpacity
              onPress={() => {
                this.setState({spinnerTemp: true}, () => {
                  this.updateShippingAddress('updateshippingaddress');
                });
              }}
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <View
                style={{
                  marginBottom: 20,
                  marginTop: 18,
                  borderColor: themeStyle.primary,
                  alignItems: 'center',
                  height: 38,
                  width: wp('90%'),
                  backgroundColor: themeStyle.primary,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: themeStyle.otherBtnsText,
                    fontSize: themeStyle.mediumSize + 1,
                  }}>
                  {this.props.isLoading.Config.languageJson['Update Address']}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
          {this.props.navigation.state.params.type === 'add' ? (
            <TouchableOpacity
              disabled={!canBeUpdatingBillings}
              onPress={() => {
                this.setState({spinnerTemp: true}, () => {
                  this.updateShippingAddress('addshippingaddress');
                });
              }}
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <View
                style={{
                  marginBottom: 20,
                  marginTop: 18,
                  borderColor: themeStyle.primary,
                  alignItems: 'center',
                  height: 38,
                  width: wp('90%'),
                  backgroundColor: themeStyle.primary,
                  justifyContent: 'center',
                  opacity: !canBeUpdatingBillings ? 0.4 : 0.9,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: themeStyle.otherBtnsText,
                    fontSize: themeStyle.mediumSize + 1,
                  }}>
                  {this.props.isLoading.Config.languageJson2['Save Address']}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </Container>
    );
  }
}
const mapStateToProps = (state) => ({
  isLoading: state,
});

export default connect(mapStateToProps, null)(ShippingAddress);
