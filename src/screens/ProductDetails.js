import React, {PureComponent} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Dimensions,
  I18nManager,
  Platform,
  Share,
  Alert,
} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';
import {CardStyleInterpolators} from 'react-navigation-stack';
import ProductsBanner from '../common/ProductsBanner';
import Stars from 'react-native-stars';
import HTML from 'react-native-render-html';
import Timer from '../common/Timer';
import SyncStorage from 'sync-storage';
import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import Ionicons from 'react-native-vector-icons/FontAwesome';
import WooComFetch, {getUrl, postHttp} from '../common/WooComFetch';
import themeStyle from '../common/Theme.style';
import {ListItem, CheckBox, Icon} from 'native-base';
const pageNumbers = [1];
const WIDTH = Dimensions.get('window').width;

class ProductDetail extends PureComponent {
  static navigationOptions = ({navigation}) => {
    const headerStyle = navigation.getParam('headerTitle');
    return {
      headerTitle: headerStyle,
      headerRight: null,
      gestureEnabled: false,
      drawerLockMode: 'locked-closed',
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerTitleAlign: 'left',
      headerTintColor: themeStyle.headerTintColor,
      headerStyle: {
        backgroundColor: themeStyle.primary,
      },
      headerTitleStyle: {
        fontWeight: Platform.OS === 'android' ? 'bold' : 'normal',
      },
      headerForceInset: {top: 'never', vertical: 'never'},
    };
  };

  mounted = false;

  constructor(props) {
    super(props);
    this.state = {
      tick: [],
      attributes: [],
      selectAttribute: true,
      discount_price:
        this.props.navigation.state.params.objectArray.discount_price,
      products_price:
        this.props.navigation.state.params.objectArray.products_price,
      flash_price: this.props.navigation.state.params.objectArray.flash_price,
      cartButton: 'addToCart',
      is_upcomming: false,
      isLiked: 0,
      wishArray: [],
      disableCartButton: false,
      variations: [],
      groupProducts: [],
      variationPrice: null,
      loaderWcVendorInfo: false,
      wcVendorInfo: {},
      loaderProductVariations: false,
      pId: '',
      /// ////////////////////////////////////////////////
      totalObjectArray: [],
      activityIndicatorTemp: true,
      isLoading: true,
      cartProductQuantity: [],
      selectedVariation: false,
      select: 'Select',
      selectedImages:
        this.props.navigation.state.params.objectArray.images === undefined ||
        this.props.navigation.state.params.objectArray.images === null ||
        this.props.navigation.state.params.objectArray.images.length === 0
          ? this.props.navigation.state.params.objectArray.products_image ===
              undefined ||
            this.props.navigation.state.params.objectArray.products_image ===
              null
            ? ''
            : this.props.navigation.state.params.objectArray.products_image
          : this.props.navigation.state.params.objectArray.images ===
              undefined ||
            this.props.navigation.state.params.objectArray.images === null
          ? ''
          : this.props.navigation.state.params.objectArray.images,
      SpinnerTemp: false,
      addToCartButtonValue: !(
        this.props.navigation.state.params.objectArray.products_type === 0 ||
        this.props.navigation.state.params.objectArray.products_type === 1 ||
        this.props.navigation.state.params.objectArray.products_type === 2
      ),
      initialValue: 1,
    };
  }

  /// /////////////////////////////
  checkAvailability = async () => {
    const att = [];
    for (const a of this.state.attributes) {
      att.push(a.attribute_id.toString());
    }
    const data = {
      products_id:
        this.props.navigation.state.params.objectArray.products_id.toString(),
      attributes: att,
    };
    const json = await WooComFetch.postHttp(
      getUrl() + '/api/' + 'getquantity',
      data,
    );
    if (Number(json.success) == 1) {
      if (Number(json.data.stock) > 0) {
        this.state.cartButton = 'addToCart';
      } else {
        this.state.cartButton = 'outOfStock';
      }
    }
    this.setState({SpinnerTemp: false});
  };

  handleClearFields = () => {
    for (const key in this.form) {
      this.form[key].state.value = 'Select';
    }
  };

  /// ////////////////////////////////////////////////////////////////////////////////////////
  componentWillUnmount() {
    if (this.props.navigation.state.params.updateCart !== undefined) {
      this.props.navigation.state.params.updateCart();
    }
    this.mounted = false;
    this.state.isLoading = false;
    this.state.priceValue = 0;
  }

  /// ///////////////////////////////
  componentDidMount() {
    if (this.props.navigation.state.params.objectArray.flash_start_date) {
      if (
        this.props.navigation.state.params.objectArray.server_time <
        this.props.navigation.state.params.objectArray.flash_start_date
      ) {
        this.state.is_upcomming = true;
      }
    }
    if (
      this.props.navigation.state.params.objectArray.products_type == 0 &&
      this.props.navigation.state.params.objectArray.defaultStock <= 0 &&
      this.props.cartItems2.Config.inventory == 1
    ) {
      this.state.cartButton = 'outOfStock';
    }
    if (this.props.navigation.state.params.objectArray.products_type == 1) {
      this.state.cartButton = 'addToCart';
    }
    if (this.props.navigation.state.params.objectArray.products_type == 2) {
      this.state.cartButton = 'external';
    }

    if (
      this.props.navigation.state.params.objectArray.attributes !== null &&
      this.props.navigation.state.params.objectArray.attributes !== undefined &&
      this.props.navigation.state.params.objectArray.attributes.length !== 0
    ) {
      this.state.tick = [];
      this.props.navigation.state.params.objectArray.attributes.forEach(
        (value, index) => {
          var att = {
            products_options_id: value.option.id,
            products_options: value.option.name,
            products_options_values_id: value.values[0].id,
            options_values_price: value.values[0].price,
            price_prefix: value.values[0].price_prefix,
            products_options_values: value.values[0].value,
            attribute_id: value.values[0].products_attributes_id,
            name:
              value.values[0].value +
              ' ' +
              value.values[0].price_prefix +
              value.values[0].price +
              ' ' +
              SyncStorage.get('currency'),
          };
          value.name = value.values[0];
          this.state.tick[value.values[0].products_attributes_id] = true;
          this.state.attributes.push(att);
        },
      );
      this.state.SpinnerTemp = true;
      if (this.props.cartItems2.Config.inventory == 1) {
        this.checkAvailability();
      } else {
        this.setState({SpinnerTemp: false});
      }
    }
    this.form = [];
    setTimeout(() => {
      if (!this.props.navigation.state.params.objectArray.flash_start_date) {
        this.props.addRecentItems(
          this.props.navigation.state.params.objectArray,
        );
      }
    }, Math.floor(200 / 360000));
    /// //////
    if (
      this.props.navigation.state.params.objectArray.products_type === 0 ||
      this.props.navigation.state.params.objectArray.products_type === 1 ||
      this.props.navigation.state.params.objectArray.products_type === 3
    ) {
      this.state.totalObjectArray.push(
        this.props.navigation.state.params.objectArray,
      );
    }

    if (Platform.OS === 'ios') {
      this.props.navigation.setParams({
        headerTitle:
          this.props.cartItems2.Config.languageJson['Product Details'],
      });
    } else {
      this.props.navigation.setParams({
        headerTitle: `${this.props.cartItems2.Config.languageJson['Product Details']}`,
      });
    }
    this.mounted = true;
    this.setState({activityIndicatorTemp: false});
  }
  /// ////////////////////////////

  check = () => {
    if (this.props.navigation.state.params.objectArray.in_stock === true) {
      if (
        this.props.navigation.state.params.objectArray ===
          this.state.totalObjectArray[0] ||
        this.props.navigation.state.params.objectArray.products_type ===
          'grouped'
      ) {
        this.state.totalObjectArray.map((val, key) =>
          this.props.addItemToCart(
            this.state.totalObjectArray[key],
            this.state.cartProductQuantity[key],
            null,
          ),
        );
      } else {
        this.state.totalObjectArray.map((val, key) =>
          this.props.addItemToCart(
            this.state.totalObjectArray[key],
            this.state.cartProductQuantity[key],
            this.state.selectedVariation,
          ),
        );
      }
    }

    /// ////////////////////////////////
    this.setState({
      totalObjectArray: [],
      tempValue: 0,
      cartNameArray: [],
      cartProductQuantity: [],
      cartImageArray: [],
      cartHtmlArray: [],
      cartPriceArray: [],
      initialValue: 1,
      SpinnerTemp: false,
    });
    this.props.setSpiner(false);
    this.props.navigation.pop();
  };

  check2 = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.log('An error occurred', err));
  };

  onShare = async () => {
    try {
      const result = await Share.share({
        message:
          themeStyle.url +
          'product/' +
          this.props.navigation.state.params.objectArray.products_id,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  /// ////////////////////////////////////////////////////////////
  checkWishList = (props) => {
    let temp = 0;
    let temp2 = 0;
    props.cartItems2.cartItems.wishListProducts.map((row) => {
      if (row.id === this.props.navigation.state.params.objectArray.id) {
        temp2 = 1;
      }
    });
    if (props.navigation.state.params.objectArray.isLiked == '1') {
      temp = 1;
    }

    if (temp === 1 || temp2 === 1) {
      return 1;
    }
    temp = 0;
    temp2 = 0;
    return 0;
  };

  /// /////////////////////////////////////////////////////////////
  removeWishlist = async (props, t) => {
    t.setState({SpinnerTemp: true});
    const data = {};
    data.liked_customers_id = SyncStorage.get('customerData').customers_id;
    data.liked_products_id =
      this.props.navigation.state.params.objectArray.products_id;
    const data2 = await postHttp(getUrl() + '/api/' + 'unlikeproduct', data);
    if (data2.success == 1) {
      this.props.navigation.state.params.objectArray.isLiked = '0';
      setTimeout(() => {
        props.removeWishListProduct(
          this.props.navigation.state.params.objectArray,
        );
        this.setState({SpinnerTemp: false});
      }, Math.floor(100 / 360000));
    }
    setTimeout(() => {
      props.removeWishListProduct(
        this.props.navigation.state.params.objectArray,
      );
      this.setState({SpinnerTemp: false});
    }, Math.floor(100 / 360000));
  };

  /// ////////////////////////////////////////////////////////////
  addWishlist = async (props, t) => {
    t.setState({SpinnerTemp: true});
    const data = {};
    data.liked_customers_id = SyncStorage.get('customerData').customers_id;
    data.liked_products_id =
      this.props.navigation.state.params.objectArray.products_id;
    const data2 = await postHttp(getUrl() + '/api/' + 'likeproduct', data);
    console.log(data2.success, 'heloo ========');
    if (data2.success == 1) {
      this.props.navigation.state.params.objectArray.isLiked = '1';
      setTimeout(() => {
        props.addWishlistProduct(
          this.props.navigation.state.params.objectArray,
        );
        this.setState({SpinnerTemp: false});
      }, Math.floor(100 / 360000));
    }
    if (data2.success == 0) {
      setTimeout(() => {
        this.setState({SpinnerTemp: false});
      }, Math.floor(100 / 360000));
    }
    setTimeout(() => {
      this.setState({SpinnerTemp: false});
    }, Math.floor(100 / 360000));
  };

  /// /////////////////////////
  priceFun = (price, decoration) => (
    <View
      style={{
        flexDirection: 'row',
        backgrounddColor: 'red',

        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginLeft: 8,
      }}>
      <HTML
        html={SyncStorage.get('currency')}
        baseFontStyle={{
          fontSize:
            decoration === 'line-through'
              ? themeStyle.mediumSize - 2
              : themeStyle.mediumSize - 2,
          color:
            decoration === 'line-through' ? '#707070' : themeStyle.iconColor,
          marginTop: decoration === 'line-through' ? 2 : 0,
          textDecorationLine: decoration,
        }}
      />
      <Text
        style={{
          // textAlign: 'left'
          // backgroundColor: 'green',
          justifyContent: 'flex-start',
          marginLeft: 2,
          alignItems: 'flex-start',
          color:
            decoration === 'line-through' ? '#707070' : themeStyle.iconColor,
          fontSize:
            decoration === 'line-through'
              ? themeStyle.mediumSize - 2
              : themeStyle.mediumSize - 2,
          textDecorationLine: decoration,
          marginTop: decoration === 'line-through' ? 0 : 0,
        }}>
        {price && price.toFixed(2) + ' '}
      </Text>
    </View>
  );

  descriptionFun = (description, htmlText) => (
    <View
      style={{
        flex: 1,
        backgroundColor: themeStyle.backgroundColor,
        padding: 8,
        // alignItems: 'flex-start',
        // alignSelf: 'flex-start',
        paddingBottom: 2,
      }}>
      <View
        style={
          {
            // flexDirection: 'row',
            // justifyContent: 'flex-start',
            // alignItems: 'flex-start',
          }
        }>
        {/* <Icon
          name={'list'}
          style={{
            color: themeStyle.primary,
            fontSize: 13,
            paddingRight: 5,
            paddingTop: 3,
          }}
        /> */}
        <Text
          style={{
            fontSize: themeStyle.smallSize,
            // color: themeStyle.primary,
            color: '#000',
            fontWeight: 'bold',
            textAlign:
              Platform.OS === 'ios'
                ? 'left'
                : !I18nManager.isRTL
                ? 'left'
                : 'right',
            marginBottom: 2,
            paddingTop: 5,
          }}>
          {description}
        </Text>
      </View>
      <HTML
        html={htmlText}
        baseFontStyle={{
          fontSize: themeStyle.mediumSize,
          color: themeStyle.textColor,
        }}
        alterNode={(node) => {
          const {name} = node;
          if (SyncStorage.get('currencyPos') === 'right') {
            if (
              name === 'ins' &&
              node.children[0].children[0].data !== undefined
            ) {
              node.children[0].children[0].data = ` ${node.children[0].children[0].data}`;
              return node;
            }
          } else {
            if (
              name === 'ins' &&
              node.children[0].children[0].children[0].data !== undefined
            ) {
              node.children[0].children[0].children[0].data = `  ${node.children[0].children[0].children[0].data}`;
              return node;
            }
          }
        }}
        tagsStyles={{
          ins: {color: themeStyle.textColor, fontSize: themeStyle.mediumSize},
          del: {
            textDecorationLine: 'line-through',
            fontSize: themeStyle.mediumSize,
            color: 'gray',
            fontWeight: '300',
          },
        }}
      />
    </View>
  );

  /// //////////////////
  fillAttributes = function (val, optionID, selectedId, arr) {
    for (const val of arr) {
      this.state.tick[val.products_attributes_id] = false;
    }
    this.state.attributes.forEach((value, index) => {
      if (optionID == value.products_options_id) {
        value.products_options_values_id = val.id;
        value.options_values_price = val.price;
        value.price_prefix = val.price_prefix;
        value.attribute_id = val.products_attributes_id;
        value.products_options_values = val.value;
        value.name =
          val.value +
          ' ' +
          val.price_prefix +
          val.price +
          ' ' +
          SyncStorage.get('currency');
        this.state.tick[selectedId] = true;
      }
    });
    this.calculatingTotalPrice();
    if (this.props.cartItems2.Config.inventory == 1) {
      this.checkAvailability();
    } else {
      this.setState({SpinnerTemp: false});
    }
  };

  /// ////////////////////////////////
  // calculating total price
  calculatingTotalPrice = function () {
    var price = parseFloat(
      this.props.navigation.state.params.objectArray.products_price.toString(),
    );
    if (
      this.props.navigation.state.params.objectArray.discount_price != null ||
      this.props.navigation.state.params.objectArray.discount_price != undefined
    ) {
      price = this.props.navigation.state.params.objectArray.discount_price;
    }
    var totalPrice =
      this.calculateFinalPriceService(this.state.attributes) +
      parseFloat(price.toString());

    if (
      this.props.navigation.state.params.objectArray.discount_price != null ||
      this.props.navigation.state.params.objectArray.discount_price != undefined
    ) {
      this.state.discount_price = totalPrice;
    } else this.state.product_price = totalPrice;
  };

  calculateFinalPriceService(attArray) {
    let total = 0;
    attArray.forEach((value, index) => {
      const attPrice = parseFloat(value.options_values_price);
      if (value.price_prefix == '+') {
        total += attPrice;
      } else {
        total -= attPrice;
      }
    });
    return total;
  }

  /// ///////////////////////////////////////////////////////////
  addToCartProduct = () => {
    this.props.addItemToCart(
      this.props.navigation.state.params.objectArray,
      this.state.attributes,
    );
    this.props.setSpiner(false);
    this.props.navigation.pop();
  };

  /// ///////////////////////////////////////////////
  btnFun = (press, text) => (
    <View
      style={{
        width: '70%',
        position: 'absolute',
        bottom: 10,
        left: 50,
      }}>
      <TouchableOpacity
        style={{
          opacity: !this.state.addToCartButtonValue ? null : 0.6,
        }}
        onPress={() => {
          if (press !== 'outOfStock') {
            this.setState({SpinnerTemp: true}, () => {
              if (press === 'addToCart') {
                this.addToCartProduct();
              }
              if (press === 'external') {
                this.openProductUrl();
              }
            });
          }
        }}
        disabled={this.state.addToCartButtonValue}>
        <View
          style={{
            borderColor: '#fff',
            alignItems: 'center',
            height: 52,
            borderRadius: 10,

            justifyContent: 'center',
            backgroundColor:
              press === 'outOfStock'
                ? themeStyle.removeBtnColor
                : themeStyle.otherBtnsColor,
          }}>
          <Text
            style={{
              color: themeStyle.otherBtnsText,
              fontSize: themeStyle.mediumSize,
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  pDiscount() {
    var rtn = '';
    var p1 = parseInt(
      this.props.navigation.state.params.objectArray.products_price,
    );
    var p2 = parseInt(
      this.props.navigation.state.params.objectArray.discount_price,
    );
    if (p1 == 0 || p2 == null || p2 == undefined || p2 == 0) {
      rtn = '';
    }
    var result = Math.abs(((p1 - p2) / p1) * 100);
    result = parseInt(result.toString());
    if (result == 0) {
      rtn = '';
    }
    rtn = result + '%';
    return rtn;
  }

  render() {
    return this.state.activityIndicatorTemp ? (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <UIActivityIndicator
          size={27}
          color={themeStyle.loadingIndicatorColor}
        />
      </View>
    ) : (
      <View
        style={{
          flex: 1,
          backgroundColor: themeStyle.backgroundColor,
          // backgroundColor: 'red',
        }}>
        <View style={{paddingBottom: 42, paddingTop: 25}}>
          {this.props.navigation.state.params.objectArray.flash_start_date &&
          !this.state.is_upcomming ? (
            <View
              style={{
                zIndex: 12,
                right: -5,
                top: 0,
                flex: 1,
                position: 'absolute',
              }}>
              <Timer
                props={this.props}
                widthPic={WIDTH}
                t={this}
                text={
                  this.props.cartItems2.Config.languageJson2['Discount ends in']
                }
                objectArray={this.props.navigation.state.params.objectArray}
                // s={s}
                btnWidth={WIDTH}></Timer>
            </View>
          ) : null}
          <Spinner
            visible={this.state.SpinnerTemp}
            textStyle={styles.spinnerTextStyle}
          />
          <FlatList
            style={{
              margin: 15,
              // backgroundColor: themeStyle.backgroundColor,
              // justifyContent: 'center',
            }}
            showsVerticalScrollIndicator={false}
            data={pageNumbers}
            vertical
            extraData={this.state}
            keyExtractor={(pageNumber) => pageNumber.toString()}
            renderItem={({item: pageNumber}) => (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    zIndex: 12,
                    // right: 20,
                    // right: -100,
                    // backgroundColor: 'red',
                    position: 'absolute',
                    top:
                      this.props.navigation.state.params.objectArray
                        .flash_start_date && !this.state.is_upcomming
                        ? 50
                        : 10,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      // backgroundColor: themeStyle.backgroundColor,
                      backgroundColor: 'transparent',

                      flexDirection: 'row',
                      padding: 8,
                      paddingTop: 14,
                    }}>
                    {this.props.navigation.state.params.objectArray !== null ? (
                      this.props.navigation.state.params.objectArray
                        .discount_price != null ? (
                        <View
                          style={{
                            backgroundColor: themeStyle.iconColor,
                            height: 27,
                            zIndex: 2,
                            left: 10,
                            top: 0,
                            position: 'absolute',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 5,
                          }}>
                          <Text
                            style={{
                              color: themeStyle.otherBtnsText,
                              padding: 5,
                              zIndex: 2,
                            }}>
                            {this.pDiscount() +
                              ' ' +
                              this.props.cartItems2.Config.languageJson.OFF}
                          </Text>
                        </View>
                      ) : null
                    ) : null}
                  </View>

                  {/* {this.props.navigation.state.params.objectArray
                    .flash_price === undefined ? (
                    <TouchableOpacity
                      style={{
                        width: 33,
                        height: 30,
                        // backgroundColor: 'red',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                      }}>
                      {this.checkWishList(this.props, this) === 1 ? (
                        this.props.cartItems2.Config.removeButton ? (
                          <Icon
                            style={{
                              color: themeStyle.iconColor,
                              fontSize: 19,
                              paddingLeft: 1,
                              paddingRight: 1,
                              marginBottom: -1,
                            }}
                            active
                            name="heart"
                            onPress={() => {
                              this.removeWishlist(this.props, this);
                            }}
                          />
                        ) : (
                          <Icon
                            style={{
                              color: themeStyle.iconColor,
                              fontSize: 19,
                              paddingLeft: 1,
                              paddingRight: 1,
                              marginBottom: -1,
                            }}
                            active
                            name="heart"
                            onPress={() => {
                              this.removeWishlist(this.props, this);
                            }}
                          />
                        )
                      ) : (
                        <Ionicons
                          style={{
                            color: themeStyle.iconColor,
                            fontSize: 19,
                            marginBottom: -2,
                            marginLeft: -1,
                            marginRight: -1,
                          }}
                          active
                          name="heart-o"
                          onPress={() => {
                            this.addWishlist(this.props, this);
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  ) : null} */}

                  {/* <TouchableOpacity
                    onPress={this.onShare}
                    style={{
                      width: 33,
                      height: 30,
                      backgroundColor: themeStyle.backgroundColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon
                      name={'share'}
                      style={{
                        textAlign: 'center',
                        fontSize: themeStyle.largeSize + 8,
                        color: '#bed13c',
                        paddingRight: 5,
                      }}
                    />
                  </TouchableOpacity> */}
                </View>

                <ProductsBanner
                  productImage={this.state.selectedImages}
                  navigation={this.props.navigation}
                  reset={() => this.setState({visible: false})}
                  objectArray={this.props.navigation.state.params.objectArray}
                />

                <View
                  style={{
                    // backgroundColor: themeStyle.backgroundColor,
                    // backgroundColor: 'green',
                    padding: 8,
                    paddingTop: 1,
                    paddingBottom: 0,
                    // alignItems: 'flex-start',
                    // justifyContent: '',
                    // flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: themeStyle.largeSize - 1,
                      color: themeStyle.productTextColor,
                      fontWeight: Platform.OS === 'android' ? 'bold' : '400',
                      // backgroundColor: 'red',
                    }}>
                    {
                      this.props.navigation.state.params.objectArray
                        .products_name
                    }
                  </Text>
                  {/* <View style={{flexDirection: 'row'}}> */}
                  {this.props.navigation.state.params.objectArray !== null &&
                  this.props.navigation.state.params.objectArray !==
                    undefined ? (
                    this.props.navigation.state.params.objectArray
                      .categories !== null &&
                    this.props.navigation.state.params.objectArray
                      .categories !== undefined ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          backgroundColor: themeStyle.backgroundColor,
                          justifyContent: 'space-between',
                          // backgroundColor: 'red',
                          // padding: 8,
                          // justifyContent: 'center',
                          // alignItems: 'center',
                          // paddingTop: 1,
                          paddingBottom: 0,
                        }}>
                        <View>
                          {this.props.navigation.state.params.objectArray.categories.map(
                            (item) => (
                              <Text
                                style={{
                                  fontSize: themeStyle.smallSize - 1,
                                  color: themeStyle.categoryTextColor,
                                  fontWeight:
                                    Platform.OS === 'android' ? '600' : '400',
                                  // alignSelf: 'flex-start',
                                }}>
                                {item.categories_name + ', '}
                              </Text>
                            ),
                          )}
                        </View>
                        <View>
                          {this.state.cartButton === 'outOfStock' ? (
                            <Text
                              style={{
                                // color: themeStyle.textColor,

                                // fontWeight: '100',
                                color: '#2d79be',

                                fontWeight: 'bold',
                              }}>
                              {
                                this.props.cartItems2.Config.languageJson[
                                  'Out of Stock'
                                ]
                              }
                            </Text>
                          ) : null}
                        </View>
                        <View>
                          {this.state.cartButton === 'addToCart' ? (
                            <Text
                              style={{
                                color: '#2d79be',

                                fontWeight: 'bold',
                              }}>
                              {
                                this.props.cartItems2.Config.languageJson[
                                  'In Stock'
                                ]
                              }
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    ) : null
                  ) : null}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    // justifyContent: 'flex-start',
                  }}>
                  {!this.props.navigation.state.params.objectArray
                    .flash_start_date ? (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        flexDirection: 'row',
                        // backgroundColor: 'red',
                        // width: '30%',
                        // marginTop: 4,
                      }}>
                      {this.props.navigation.state.params.objectArray
                        .discount_price !== null
                        ? this.priceFun(
                            this.state.products_price,
                            'line-through',
                          )
                        : null}

                      {this.props.navigation.state.params.objectArray
                        .discount_price === null
                        ? this.priceFun(this.state.products_price, 'none')
                        : null}
                      {this.props.navigation.state.params.objectArray
                        .discount_price !== null
                        ? this.priceFun(this.state.discount_price, 'none')
                        : null}
                    </View>
                  ) : null}

                  {this.props.navigation.state.params.objectArray
                    .flash_start_date ? (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        flexDirection: 'row',
                      }}>
                      {this.priceFun(this.state.products_price, 'line-through')}

                      {this.priceFun(this.state.flash_price, 'none')}
                    </View>
                  ) : null}
                </View>

                {/* </View> */}

                {/* <View>
                  {this.state.cartButton === 'outOfStock' ? (
                    <Text
                      style={{
                        color: themeStyle.textColor,

                        fontWeight: '100',
                      }}>
                      {
                        this.props.cartItems2.Config.languageJson[
                          'Out of Stock'
                        ]
                      }
                    </Text>
                  ) : null}
                  {this.state.cartButton === 'addToCart' ? (
                    <Text
                      style={{
                        color: themeStyle.textColor,

                        fontWeight: '100',
                      }}>
                      {this.props.cartItems2.Config.languageJson['In Stock']}
                    </Text>
                  ) : null}
                </View> */}

                {/* <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    // justifyContent: 'flex-start',
                  }}>
                  {!this.props.navigation.state.params.objectArray
                    .flash_start_date ? (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        flexDirection: 'row',
                        // backgroundColor: 'red',
                        // width: '30%',
                        // marginTop: 4,
                      }}>
                      {this.props.navigation.state.params.objectArray
                        .discount_price !== null
                        ? this.priceFun(
                            this.state.products_price,
                            'line-through',
                          )
                        : null}

                      {this.props.navigation.state.params.objectArray
                        .discount_price === null
                        ? this.priceFun(this.state.products_price, 'none')
                        : null}
                      {this.props.navigation.state.params.objectArray
                        .discount_price !== null
                        ? this.priceFun(this.state.discount_price, 'none')
                        : null}
                    </View>
                  ) : null}

                  {this.props.navigation.state.params.objectArray
                    .flash_start_date ? (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        flexDirection: 'row',
                      }}>
                      {this.priceFun(this.state.products_price, 'line-through')}

                      {this.priceFun(this.state.flash_price, 'none')}
                    </View>
                  ) : null}

                  <TouchableOpacity
                    style={{}}
                    onPress={() =>
                      this.props.navigation.navigate('RatingAndReviewScreen', {
                        ratingCountArray:
                          this.props.navigation.state.params.objectArray
                            .reviewed_customers === undefined ||
                          this.props.navigation.state.params.objectArray
                            .reviewed_customers === null
                            ? 0
                            : this.props.navigation.state.params.objectArray
                                .reviewed_customers.length,
                        averageRatingArray:
                          this.props.navigation.state.params.objectArray.rating,
                        objectArray:
                          this.props.navigation.state.params.objectArray,
                      })
                    }>
                    <View
                      style={{
                        flexDirection: 'row',
                        padding: 8,
                        paddingBottom: 2,
                        paddingTop: 0,
                        marginTop: 7,
                        alignItems: 'flex-end',
                      }}>
                      {this.props.navigation.state.params.objectArray
                        .reviewed_customers === undefined ||
                      this.props.navigation.state.params.objectArray
                        .reviewed_customers === null ? null : (
                        <Text
                          style={{
                            // padding: 6,
                            paddingHorizontal: 4,
                            fontSize: themeStyle.largeSize - 5,
                            // color: themeStyle.primaryDark,
                            color: themeStyle.categoryTextColor,
                            // paddingTop: 7,
                            fontWeight:
                              Platform.OS === 'android' ? 'bold' : '400',
                          }}>
                          {'('}
                          {
                            this.props.navigation.state.params.objectArray
                              .reviewed_customers.length
                          }
                          {') '}
                          {
                            this.props.cartItems2.Config.languageJson2[
                              'Ratings & Reviews'
                            ]
                          }
                        </Text>
                      )}

                      <Stars
                        disabled
                        default={parseFloat(
                          this.props.navigation.state.params.objectArray.rating,
                        )}
                        count={5}
                        starSize={50}
                        half
                        fullStar={
                          <Icon name={'star'} style={[styles.myStarStyle]} />
                        }
                        emptyStar={
                          <Icon
                            name={'star-outline'}
                            style={[
                              styles.myStarStyle,
                              styles.myEmptyStarStyle,
                            ]}
                          />
                        }
                        halfStar={
                          <Icon
                            name={'star-half'}
                            style={[styles.myStarStyle]}
                          />
                        }
                      />
                    </View>
                  </TouchableOpacity>
                </View> */}

                {/* <View
                  style={{
                    backgroundColor: themeStyle.backgroundColor,
                    padding: 8,
                    paddingTop: 5,
                    paddingBottom: 0,
                  }}>
                  <Text
                    style={{
                      fontSize: themeStyle.mediumSize + 1,
                      color: themeStyle.textColor,
                      fontWeight: Platform.OS === 'android' ? '600' : '400',
                    }}>
                    {this.props.cartItems2.Config.languageJson.Likes + ' ('}
                    {this.props.navigation.state.params.objectArray
                      .products_liked + ')'}
                  </Text>
                </View> */}
                <View
                  style={{
                    borderBottomColor: '#e2e2e2',
                    borderBottomWidth: 1,
                    // width: '75%',
                    marginVertical: 5,
                  }}></View>
                {this.props.navigation.state.params.objectArray
                  .products_description !== undefined &&
                this.props.navigation.state.params.objectArray
                  .products_description !== null &&
                this.props.navigation.state.params.objectArray
                  .products_description !== ''
                  ? this.descriptionFun(
                      this.props.cartItems2.Config.languageJson[
                        'Product Description'
                      ],
                      this.props.navigation.state.params.objectArray
                        .products_description,
                    )
                  : null}

                {this.props.navigation.state.params.objectArray.attributes
                  .length !== 0
                  ? this.descriptionFun(
                      this.props.cartItems2.Config.languageJson[
                        'Techincal details'
                      ],
                      this.props.navigation.state.params.objectArray
                        .products_description,
                    )
                  : null}

                <FlatList
                  style={{backgroundColor: themeStyle.backgroundColor}}
                  data={
                    this.props.navigation.state.params.objectArray.attributes
                  }
                  horizontal={false}
                  extraData={this.state}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={(item) => (
                    <View>
                      <View style={{padding: 10, paddingBottom: 0}}>
                        <Text
                          style={{
                            fontSize: themeStyle.mediumSize + 1,
                            color: themeStyle.textColor,
                          }}>
                          {item.item.option.name}
                        </Text>
                      </View>
                      <FlatList
                        style={{backgroundColor: themeStyle.backgroundColor}}
                        data={item.item.values}
                        horizontal={false}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(item2) => (
                          <View>
                            <ListItem>
                              <TouchableOpacity
                                onPress={() => {
                                  if (
                                    !this.state.tick[
                                      item.item.values[item2.index]
                                        .products_attributes_id
                                    ]
                                  ) {
                                    this.setState({SpinnerTemp: true}, () =>
                                      this.fillAttributes(
                                        item2.item,
                                        item.item.option.id,
                                        item.item.values[item2.index]
                                          .products_attributes_id,
                                        item.item.values,
                                      ),
                                    );
                                  }
                                }}
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <CheckBox
                                  onPress={() => {
                                    if (
                                      !this.state.tick[
                                        item.item.values[item2.index]
                                          .products_attributes_id
                                      ]
                                    ) {
                                      this.setState({SpinnerTemp: true}, () =>
                                        this.fillAttributes(
                                          item2.item,
                                          item.item.option.id,
                                          item.item.values[item2.index]
                                            .products_attributes_id,
                                          item.item.values,
                                        ),
                                      );
                                    }
                                  }}
                                  checked={
                                    !!this.state.tick[
                                      item.item.values[item2.index]
                                        .products_attributes_id
                                    ]
                                  }
                                />
                                <View style={{padding: 8}}>
                                  <Text
                                    style={{
                                      fontSize: themeStyle.smallSize + 1,
                                      color: themeStyle.textColor,
                                    }}>
                                    {item2.item.value +
                                      ' ' +
                                      item2.item.price_prefix +
                                      item2.item.price +
                                      ' ' +
                                      SyncStorage.get('currency')}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </ListItem>
                          </View>
                        )}
                      />
                    </View>
                  )}
                />
                <View />
              </View>
            )}
          />
        </View>

        {this.state.cartButton === 'addToCart' && !this.state.is_upcomming
          ? this.btnFun(
              'addToCart',
              this.props.cartItems2.Config.languageJson['Add to Cart'],
            )
          : this.state.cartButton === 'outOfStock' && !this.state.is_upcomming
          ? this.btnFun(
              'outOfStock',
              this.props.cartItems2.Config.languageJson['OUT OF STOCK'],
            )
          : this.state.cartButton === 'external' && !this.state.is_upcomming
          ? this.btnFun(
              'external',
              this.props.cartItems2.Config.languageJson['VIEW PRODUCT'],
            )
          : this.btnFun(
              'outOfStock',
              this.props.cartItems2.Config.languageJson2['Up Coming'],
            )}
      </View>
    );
  }
}
/// ////////////////////////////////////////////////
const mapDispatchToProps = (dispatch) => ({
  addItemToCart: (product, attributes) => {
    dispatch({
      type: 'ADD_TO_CARTS',
      product,
      attributes,
    });
  },
  setSpiner: (temp) => {
    dispatch({
      type: 'SET_SPINNER',
      value: temp,
    });
  },
  mySpiner: (temp, index) => {
    dispatch({
      type: 'MY_SPINNER',
      value: temp,
      index1: index,
    });
  },
  removeSpiner: () => {
    dispatch({
      type: 'REMOVE_SPINNER',
    });
  },
  addRecentItems: (productObject) => {
    dispatch({
      type: 'ADD_RECENT',
      product: productObject,
    });
  },
  addWishlistProduct: (productArray) =>
    dispatch({type: 'ADD_WISHLIST_PRODUCTS', product: productArray}),
  removeWishListProduct: (productArray) =>
    dispatch({type: 'REMOVE_WISHLIST_PRODUCTS', product: productArray}),
});
/// ///////////////////////////////////////////////
const mapStateToProps = (state) => ({
  cartItems2: state,
});
/// //////////////////////////////////////////
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigation(ProductDetail));
/// /////////////////////////////////////////////
const styles = StyleSheet.create({
  myStarStyle: {
    color: '#eea532',
    backgroundColor: 'transparent',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
    fontSize: 20,
  },
  myEmptyStarStyle: {
    color: '#cccccc',
    fontSize: 20,
  },
});
