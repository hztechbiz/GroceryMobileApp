import React, {PureComponent} from 'react';
import {View, FlatList, TouchableOpacity, Platform} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';
import {getHttp, getUrl} from '../common/WooComFetch';
import {Container, ListItem, CheckBox, Text, Body} from 'native-base';
import {CardStyleInterpolators} from 'react-navigation-stack';
import SyncStorage from 'sync-storage';
import RNRestart from 'react-native-restart';
import {connect} from 'react-redux';
import themeStyle from '../common/Theme.style';
import ShoppingCartIcon from '../common/ShoppingCartIcon';

class currencyScreen extends PureComponent {
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
    // console.log()
    this.getListOfCurrency();
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson2['Select Currency'],
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      currency: {},
      currencyList: [],
      currentCurrencySymbol: SyncStorage.get('currencyCode'),
      temp: 0,
      tick: [],
      isLoading: true,
    };
  }

  getListOfCurrency = async () => {
    const responseJson = await getHttp(
      getUrl() + '/api/' + 'getcurrencies',
      {},
    );
    for (const val of responseJson.data.data) {
      // console.log(val.id, 'id');
      // console.log(val.code, 'code');
      if (val.code === SyncStorage.get('currencyCode')) {
        // console.log('here');
        this.state.tick[val.id] = true;
      }
    }
    this.state.currencyList = responseJson.data.data;
    this.setState({isLoading: false});
  };

  /// //////////////////////////////////////////
  updateCurrency(item) {
    // console.log(item.item, 'item');
    if (this.state.currentCurrencySymbol !== item.code) {
      SyncStorage.set('currencyObject', item);
      if (item.symbol_left !== '') {
        SyncStorage.set('currencyPos', 'left');
        SyncStorage.set('currency', item.symbol_left);
      } else {
        SyncStorage.set('currencyPos', 'right');
        SyncStorage.set('currency', item.symbol_right);
      }
      SyncStorage.set('currencyCode', item.code);
      SyncStorage.set('wishListProducts', []);
      SyncStorage.set('recentViewedProducts', []);
      SyncStorage.set('cartProducts', []);
      this.state.tick = [];
      this.state.tick[item.id] = true;
      this.setState({temp: 0});
      setTimeout(() => {
        RNRestart.Restart();
      }, 200);
    }
  }

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
      <Container style={{backgroundColor: themeStyle.backgroundColor}}>
        <View style={{flex: 1}}>
          <FlatList
            data={this.state.currencyList}
            horizontal={false}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(item) => (
              <View>
                <ListItem>
                  <TouchableOpacity
                    onPress={() => this.updateCurrency(item.item)}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Body>
                      {item.item.symbol_left != '' &&
                      item.item.symbol_left != null &&
                      item.item.symbol_left != undefined ? (
                        <Text
                          style={{
                            fontSize: themeStyle.mediumSize,
                            color: themeStyle.textColor,
                          }}>
                          {item.item.title + '(' + item.item.symbol_left + ')'}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            fontSize: themeStyle.mediumSize,
                            color: themeStyle.textColor,
                          }}>
                          {item.item.title + '(' + item.item.symbol_right + ')'}
                        </Text>
                      )}
                    </Body>
                    <CheckBox
                      onPress={() => this.updateCurrency(item.item)}
                      checked={
                        !!(
                          this.state.tick[item.item.id] ||
                          SyncStorage.get('currency') === item.item.symbol
                        )
                      }
                    />
                  </TouchableOpacity>
                </ListItem>
              </View>
            )}
          />
        </View>
      </Container>
    );
  }
}
const mapStateToProps = (state) => ({
  isLoading: state,
});

export default connect(mapStateToProps, null)(currencyScreen);
