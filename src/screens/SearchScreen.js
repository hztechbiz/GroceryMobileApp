import React, {Component} from 'react';
import {
  View,
  FlatList,
  TextInput,
  Dimensions,
  I18nManager,
  Platform,
} from 'react-native';
import BottomNav from '../common/BottomNav';
import CardTem from '../common/CardTemplate';
import {UIActivityIndicator} from 'react-native-indicators';
import {CardStyleInterpolators} from 'react-navigation-stack';
import {NavigationEvents} from 'react-navigation';
import SyncStorage from 'sync-storage';
import Category3Style from '../common/Categories3';
import {connect} from 'react-redux';
import WooComFetch, {getUrl} from '../common/WooComFetch';
import {Icon} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-easy-toast';
import themeStyle from '../common/Theme.style';
import ShoppingCartIcon from '../common/ShoppingCartIcon';
const WIDTH = Dimensions.get('window').width;
class SearchScreen extends Component {
  static navigationOptions = ({navigation}) => {
    const headerStyle = navigation.getParam('headerTitle');
    return {
      headerTitle: headerStyle,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
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
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      text: '',
      arrayholder: [],
      arrayholderHeader: [],
      spinnerTemp: false,
      selected: false,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson.Search,
    });
    this.setState(
      {
        isLoading: false,
        dataSource: this.props.isLoading.cartItems.allCategories,
      },
      function () {
        this.setState({
          arrayholder: this.props.isLoading.cartItems.allCategories,
        });
      },
    );
  }

  openSubCategories = (parent, name, item) => {
    // console.log(parent, 'sdaasdsad');
    this.props.navigation.navigate('NewestScreen', {
      id: parent.id,
      allItem: parent,
      // select: selected,
      //   // allItem: item,
      sortOrder: 'newest',
    });
  };

  GetListViewItem(name) {
    this.setState({text: name});
    this.props.navigation.state.params.onGoBack(
      name,
      this.props.navigation.state.params.onSelectionBase,
    );
    this.props.navigation.goBack();
  }

  SearchFilterFunction(text) {
    this.setState({
      text,
    });
  }

  getSearchData = async () => {
    try {
      this.setState({spinnerTemp: true});
      if (this.state.text !== undefined) {
        if (this.state.text === null || this.state.text === '') {
          this.refs.toast.show('Please enter some text');
          this.setState({spinnerTemp: false});
          return;
        }
      } else {
        this.setState({spinnerTemp: false});
        return;
      }
      const json = await WooComFetch.postHttp(
        getUrl() + '/api/' + 'getsearchdata',
        {
          searchValue: this.state.text,
          language_id: SyncStorage.get('langId'),
          currency_code: this.props.isLoading.Config.productsArguments.currency,
        },
      );

      if (json.data.success === '0') {
        this.refs.toast.show('No Product found!');
      }
      json.data.product_data.products.map((val, key) => {
        const temp = [];
        temp[0] = val.products_image;
        json.data.product_data.products[key].products_image = temp;
      });

      this.setState({
        arrayholderHeader: json.data.product_data.products,
        spinnerTemp: false,
      });
    } catch (e) {
      this.setState({spinnerTemp: false});
    }
  };

  renderItem = (item, index) => (
    <CardTem
      objectArray={item.item}
      index={index}
      cardStyle={101}
      addToCart={false}
      selected={true}
      width={WIDTH}
    />
  );

  renderSeparator = () => (
    <View style={{height: 1, width: '100%', backgroundColor: '#ddd'}} />
  );

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            paddingTop: 20,
            backgroundColor: themeStyle.backgroundColor,
          }}>
          <UIActivityIndicator
            color={themeStyle.loadingIndicatorColor}
            size={27}
          />
        </View>
      );
    }
    return (
      <View
        style={{
          justifyContent: 'center',
          flex: 1,
          backgroundColor: themeStyle.backgroundColor,
          paddingBottom: SyncStorage.get('bottom') ? 50 : 0,
        }}>
        <Spinner visible={this.state.spinnerTemp} />
        <NavigationEvents
          onDidFocus={() => {
            this.setState({});
          }}
        />
        {SyncStorage.get('bottom') ? (
          <BottomNav
            active={1}
            home={
              this.props.isLoading.Config.homePage === 1
                ? 'Home1Screen'
                : this.props.isLoading.Config.homePage === 2
                ? 'Home2Screen'
                : this.props.isLoading.Config.homePage === 3
                ? 'Home3Screen'
                : this.props.isLoading.Config.homePage === 4
                ? 'Home4Screen'
                : this.props.isLoading.Config.homePage === 5
                ? 'Home5Screen'
                : this.props.isLoading.Config.homePage === 6
                ? 'Home6Screen'
                : this.props.isLoading.Config.homePage === 7
                ? 'Home7Screen'
                : this.props.isLoading.Config.homePage === 8
                ? 'Home8Screen'
                : this.props.isLoading.Config.homePage === 9
                ? 'Home9Screen'
                : 'Home10Screen'
            }></BottomNav>
        ) : null}

        <Toast
          ref="toast"
          style={{backgroundColor: '#c1c1c1'}}
          position="bottom"
          positionValue={200}
          fadeOutDuration={7000}
          textStyle={{color: themeStyle.textColor, fontSize: 15}}
        />
        <View
          style={{
            flexDirection: 'row',
            textAlign: 'center',
            height: 40,
            margin: 7,
            marginBottom: -3,
            backgroundColor: themeStyle.backgroundColor,
            shadowOffset: {width: 1, height: 1},
            shadowColor: '#000',
            shadowOpacity: 0.5,
            elevation: 5,
            borderWidth: 1,
            borderColor: themeStyle.primaryContrast,
          }}>
          <Icon
            name={'search'}
            style={{
              color: 'gray',
              fontSize: 22,
              margin: 7,
              marginLeft: 15,
              marginRight: 15,
            }}
          />
          <TextInput
            style={
              ({
                height: 40,
                backgroundColor: themeStyle.backgroundColor,
                padding: 10,
                width: WIDTH - 61,
              },
              {
                textAlign:
                  this.state.text === ''
                    ? I18nManager.isRTL
                      ? 'right'
                      : 'left'
                    : 'auto',
                width: WIDTH,
                color: themeStyle.textColor,
              })
            }
            placeholderTextColor={themeStyle.textColor}
            onChangeText={(text) => this.SearchFilterFunction(text)}
            value={this.state.text}
            underlineColorAndroid="transparent"
            placeholder="Search"
            returnKeyType={'search'}
            onSubmitEditing={() => this.getSearchData()}
          />
        </View>
        <FlatList
          data={this.state.dataSource}
          extraData={this.state}
          listKey={'products'}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={this.renderSeparator}
          renderItem={(item) => (
            <Category3Style
              item={item.item}
              id={item.index}
              products={this.props.isLoading.Config.languageJson.Products}
              image={item.item.image === null ? '' : item.item.image.src}
              openSubCategories={(t, n) => this.openSubCategories(t, n)}
            />
          )}
          ListHeaderComponent={
            <FlatList
              style={{marginBottom: 1}}
              contentContainerStyle={{flex: 1}}
              data={this.state.arrayholderHeader}
              renderItem={this.renderItem}
              extraData={this.state}
              keyExtractor={(item, index) => index.toString()}
            />
          }
          enableEmptySections
          style={{marginTop: 10}}
        />
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  isLoading: state,
});

export default connect(mapStateToProps, null)(SearchScreen);
