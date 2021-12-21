import React, {PureComponent} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  TextInput,
  I18nManager,
  Platform,
} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';
import {NavigationEvents} from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import {Container, ListItem, CheckBox, Text, Body} from 'native-base';
import {CardStyleInterpolators} from 'react-navigation-stack';
import WooComFetch, {getUrl} from '../common/WooComFetch';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as global from '../common/LocationData';
import SyncStorage from 'sync-storage';
import {connect} from 'react-redux';
import themeStyle from '../common/Theme.style';
import ShoppingCartIcon from '../common/ShoppingCartIcon';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
const WIDTH = Dimensions.get('window').width;
class ShippingAddress extends PureComponent {
  static navigationOptions = ({navigation}) => {
    const headerStyle = navigation.getParam('headerTitle');
    return {
      headerTitle: headerStyle,
      headerRight: () => <ShoppingCartIcon navigation={navigation} />,
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
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson2.Address,
    });
    this.getAllAddress();
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      allShippingAddress: [],
      spinnerTemp: false,
      visible: false,
      shippingArray: [],
      placeholderArray: [
        this.props.isLoading.Config.languageJson['First Name'],
        this.props.isLoading.Config.languageJson['Last Name'],
        // this.props.isLoading.Config.languageJson.Compnay,
        `${this.props.isLoading.Config.languageJson.Address} 1`,
        `${this.props.isLoading.Config.languageJson.Address} 2`,
        // this.props.isLoading.Config.languageJson.Country,
        // this.props.isLoading.Config.languageJson.Zone,
        // this.props.isLoading.Config.languageJson.City,
        // this.props.isLoading.Config.languageJson['Post code'],
      ],

      otherArray: [{value: 'other', name: 'other'}],
    };
  }

  getAllAddress = async () => {
    var dat = {customers_id: SyncStorage.get('customerData').customers_id};
    const data = await WooComFetch.postHttp(
      getUrl() + '/api/' + 'getalladdress',
      dat,
    );
    if (data.success == 1) {
      this.setState({
        allShippingAddress: data.data.data,
        isLoading: false,
        spinnerTemp: false,
      });
    } else {
      this.setState({
        allShippingAddress: [],
        isLoading: false,
        spinnerTemp: false,
      });
    }
  };

  /// /////
  defaultAddress = async (id) => {
    var dat = {
      customers_id: SyncStorage.get('customerData').customers_id,
      address_book_id: id,
    };
    const data = await WooComFetch.postHttp(
      getUrl() + '/api/' + 'updatedefaultaddress',
      dat,
    );
    if (data.success == 1) {
      this.getAllAddress();
    }
  };

  /// ///////////////////////////////////////
  searchFilterFun(text, name, selection) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('SearchFilterClass', {
            data: text,
            onSelectionBase: selection,
            onGoBack: (name, selectedValue) =>
              this.refresh(name, selectedValue),
          })
        }>
        <View
          style={{
            marginRight: 20,
            marginLeft: 20,
            marginTop: 20,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 4,
            width: wp('90%'),
            borderRadius: 1,
            borderWidth: 1,
            borderColor: '#c0c0c0',
          }}>
          <Text
            style={{
              color:
                name === 'Country' || name === 'State'
                  ? '#c0c0c0'
                  : themeStyle.textColor,
              fontSize: themeStyle.mediumSize,
              paddingRight: 6,
              writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
              textAlign: 'justify',
            }}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  /// ////////////////////////////////////////
  customTextView(placeholderText, index) {
    return placeholderText ===
      this.props.isLoading.Config.languageJson.Country ? (
      <View>
        {this.searchFilterFun(
          global.data.countries,
          this.state.shippingCountry === ''
            ? placeholderText
            : this.state.shippingCountry,
          'shipping',
        )}
      </View>
    ) : placeholderText === this.props.isLoading.Config.languageJson.Zone ? (
      <View></View>
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
          }}
          selectionColor="#51688F"
          placeholderTextColor={'#c1c1c1'}
          placeholder={` ${placeholderText}`}
          onChangeText={(text) => {
            this.state.shippingArray[index] = text;
            this.setState({shippingArray: this.state.shippingArray});
          }}
          value={this.state.shippingArray[index]}
        />
      </TouchableOpacity>
    );
  }

  /// //////////////////
  refresh = (name, selectedValue) => {
    const tempC = SyncStorage.get('customerData');

    if (selectedValue === 'shipping') {
      this.state.shippingArray[5] = name;
      this.state.shippingArray[6] = '';
      this.state.shippingArray[7] = '';
      this.state.shippingArray[8] = '';
      tempC.shipping.Country = name;

      SyncStorage.set('customerData', tempC);
      this.setState({
        shippingCountry: name,
        shippingArray: this.state.shippingArray,
      });
    } else if (selectedValue === 'billing') {
      this.state.billingArray[5] = name;
      this.state.billingArray[6] = '';
      this.state.billingArray[7] = '';
      this.state.billingArray[8] = '';
      tempC.billing.Country = name;
      SyncStorage.set('customerData', tempC);
      this.setState({
        billingCountry: name,
        billingArray: this.state.billingArray,
      });
    }
    if (selectedValue === 'shippingState') {
      this.state.shippingArray[6] = name;
      tempC.shipping.State = name;
      SyncStorage.set('customerData', tempC);
      this.setState({
        shippingState: name,
        shippingArray: this.state.shippingArray,
      });
    } else if (selectedValue === 'billingState') {
      this.state.billingArray[6] = name;
      tempC.billing.State = name;
      SyncStorage.set('customerData', tempC);
      this.setState({
        billingState: name,
        billingArray: this.state.billingArray,
      });
    }
    this.setState({});
  };

  /// //////////////////
  openEditShippingPage = (data, temp) => {
    this.props.navigation.navigate('AddressEdit', {
      data: data,
      type: temp,
      updateCart: () => this.setState({}),
    });
  };

  render() {
    return this.state.isLoading ? (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: themeStyle.backgroundColor,
        }}>
        <UIActivityIndicator
          size={27}
          color={themeStyle.loadingIndicatorColor}
        />
      </View>
    ) : (
      <Container
        style={{
          backgroundColor: themeStyle.backgroundColor,
          flex: 1,
        }}>
        <View style={{flex: 1}}>
          <Spinner visible={this.state.spinnerTemp} />
          <NavigationEvents
            onDidFocus={() => {
              this.setState({spinnerTemp: true}, () => {
                this.getAllAddress();
              });
            }}
          />
          {this.state.allShippingAddress.length === 0 &&
          this.state.spinnerTemp === false ? (
            <Text
              style={{
                padding: 19,
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 2,
                color: themeStyle.textColor,
              }}>
              {
                this.props.isLoading.Config.languageJson[
                  'Please add your new shipping address for the futher processing of the your order'
                ]
              }
            </Text>
          ) : null}

          <FlatList
            data={this.state.allShippingAddress}
            horizontal={false}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(item) => (
              <View>
                <ListItem>
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                      onPress={() =>
                        this.openEditShippingPage(item.item, 'update')
                      }
                      style={{padding: 5}}>
                      <Icon
                        name={'pencil'}
                        style={{color: '#4d4d4d', fontSize: 20}}
                      />
                    </TouchableOpacity>
                    <Body>
                      <Text
                        style={{
                          fontSize: themeStyle.mediumSize + 1,
                          width: WIDTH * 0.7,
                          paddingLeft: 20,
                          color: themeStyle.textColor,
                        }}
                        numberOfLines={1}>
                        {
                          item.item.street
                          // +
                          // ', ' +
                          // item.item.city +
                          // ' ' +
                          // item.item.postcode +
                          // ', ' +
                          // item.item.country_name
                        }
                      </Text>
                    </Body>
                    <CheckBox
                      onPress={() =>
                        this.setState({spinnerTemp: true}, () =>
                          this.defaultAddress(item.item.address_id),
                        )
                      }
                      checked={item.item.default_address === 1}
                    />
                  </TouchableOpacity>
                </ListItem>
              </View>
            )}
          />
          <TouchableOpacity
            onPress={() => {
              this.openEditShippingPage([], 'add');
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
                  color: themeStyle.primaryContrast,
                  fontSize: themeStyle.mediumSize + 1,
                }}>
                {this.props.isLoading.Config.languageJson2['Add New Address']}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }
}
const mapStateToProps = (state) => ({
  isLoading: state,
});

export default connect(mapStateToProps, null)(ShippingAddress);
