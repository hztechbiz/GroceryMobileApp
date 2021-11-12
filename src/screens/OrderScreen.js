import React, {Component} from 'react';
import {CardStyleInterpolators} from 'react-navigation-stack';
import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  Text,
  I18nManager,
  Alert,
} from 'react-native';
import RNPaypal from 'react-native-paypal-lib';
import {UIActivityIndicator} from 'react-native-indicators';
import Toast from 'react-native-easy-toast';
import HTML from 'react-native-render-html';
import ModalWrapper from 'react-native-modal-wrapper';
import Spinner from 'react-native-loading-spinner-overlay';
import WooComFetch, {getUrl, getHttp, postHttp} from '../common/WooComFetch';
import couponProvider from '../common/CouponClass';
import {Icon} from 'native-base';
import SyncStorage from 'sync-storage';
import {connect} from 'react-redux';
import ImageLoad from '../common/RnImagePlaceH';
import themeStyle from '../common/Theme.style';
import stripe from 'tipsi-stripe';
import FIcon from 'react-native-vector-icons/FontAwesome5';
import RazorpayCheckout from 'react-native-razorpay';
import CardTextFieldScreen from '../PaymentMethods/Stripe/scenes/CardTextFieldScreen';
import {StackActions, NavigationActions} from 'react-navigation';
const paytmConfig = {
  MID: 'rxazcv89315285244163',
  WEBSITE: 'WEBSTAGING',
  CHANNEL_ID: 'WAP',
  INDUSTRY_TYPE_ID: 'Retail',
  CALLBACK_URL: 'https://securegw.paytm.in/theia/paytmCallback?ORDER_ID=',
};

class orderScreen extends Component {
  static navigationOptions = ({navigation}) => {
    const headerStyle = navigation.getParam('headerTitle');
    return {
      headerTitle: headerStyle,
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
      gestureEnabled: true,
    };
  };

  componentDidMount() {
    this.calculateTotal();
    this.initializePaymentMethods();
    this.props.navigation.setParams({
      headerTitle: this.props.cartItems2.Config.languageJson.Order,
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      customerNotes: '',
      discount: 0,
      productsTotal: 0,
      totalAmountWithDisocunt: 0,
      paymentMethods: [],
      selectedPaymentMethod: '',
      selectedPaymentMethodTitle: '',
      order: {},
      tax: 0,
      loaderTaxCalculating: true,
      loaderPaymentMethods: true,
      wrapperCondition: false,
      wrapperCondition2: false,
      radioButton: [],
      paymentText: '',
      paymentShowCondition: true,
      buttonEnable: false,
      couponArray: [],
      couponApplied: 0,
      tokenFromServer: null,
      token: '',
      couponText: '',
      nonce: '',
      stripeCard: {
        number: '',
        expMonth: 1,
        expYear: 2020,
        cvc: '',
      },
      params: {
        number: '',
        expMonth: 0,
        expYear: 0,
        cvc: '',
      },
      paypalClientId: '',
      paypalEnviroment: '',
      paytmEnviroment: '',
      publicKeyStripe: '',
      razorPayKey: '',
      mid: '',
      method: [],
      orderDetail: JSON.parse(JSON.stringify(SyncStorage.get('orderDetails'))),
      products: JSON.parse(JSON.stringify(SyncStorage.get('cartProducts'))),
    };
  }

  payTmFUn = async () => {
    const dat = {};
    dat.customers_id = SyncStorage.get('customerData').customers_id;
    dat.amount = this.state.totalAmountWithDisocunt;
    const data = await getHttp(
      getUrl() +
        '/api/' +
        'generatpaytmhashes?customers_id=' +
        SyncStorage.get('customerData').customers_id +
        '&amount' +
        this.state.totalAmountWithDisocunt,
    );
    this.runTransaction(
      this.state.totalAmountWithDisocunt.toString(),
      SyncStorage.get('customerData').customers_id.toString(),
      data.data.data.ORDER_ID.toString(),
      SyncStorage.get('customerData').customers_telephone,
      SyncStorage.get('customerData').email,
      data.data.data.CHECKSUMHASH,
      '1587028733',
    );
    this.setState({SpinnerTemp: false});
  };

  runTransaction(amount, customerId, orderId, mobile, email, checkSum) {
    const callbackUrl = `${paytmConfig.CALLBACK_URL}${orderId}`;
    const details = {
      mode: this.state.paytmEnviroment, // 'Staging' or 'Production'
      MID: this.state.mid,
      INDUSTRY_TYPE_ID: paytmConfig.INDUSTRY_TYPE_ID,
      WEBSITE: paytmConfig.WEBSITE,
      CHANNEL_ID: paytmConfig.CHANNEL_ID,
      TXN_AMOUNT: `${amount}`, // String
      ORDER_ID: orderId, // String
      EMAIL: email, // String
      MOBILE_NO: mobile, // String
      CUST_ID: customerId, // String
      CHECKSUMHASH: checkSum, // From your server using PayTM Checksum Utility
      CALLBACK_URL: callbackUrl,
    };
    // Paytm.startPayment(details)
  }

  /// ///
  onPayTmResponse = (resp) => {
    const {STATUS, status, response} = resp;
    if (Platform.OS === 'ios') {
      if (status === 'Success') {
        const jsonResponse = JSON.parse(response);
        const {STATUS} = jsonResponse;

        if (STATUS && STATUS === 'TXN_SUCCESS') {
          // Payment succeed!
        }
      }
    } else {
      if (STATUS && STATUS === 'TXN_SUCCESS') {
        // Payment succeed!
      }
    }
  };

  /// ///////
  paypayMethod = () => {
    RNPaypal.paymentRequest({
      clientId: this.state.paypalClientId,
      environment: RNPaypal.ENVIRONMENT.NO_NETWORK,
      intent: RNPaypal.INTENT.SALE,
      price: this.state.totalAmountWithDisocunt,
      currency:
        this.props.cartItems2.Config.productsArguments.currency.toString(),
      description: 'Total Amount',
      acceptCreditCards: true,
    })
      .then((response) => {
        this.setState({SpinnerTemp: true, token: response.response.id}, () =>
          this.addOrder(),
        );
      })
      .catch((err) => {
        this.refs.toast.show(err.message);
      });
  };

  /// ///////////////////////////////////
  setTokenFun = (token) => {
    this.setState({token: token});
  };

  setParams = (params) => {
    this.setState({params: params});
  };

  calculateTotal = function () {
    let a = 0;
    for (const value of this.state.products) {
      var subtotal = parseFloat(value.total);
      a = a + subtotal;
    }

    const b = parseFloat(this.state.orderDetail.total_tax.toString());
    const c = parseFloat(this.state.orderDetail.shipping_cost.toString());
    this.state.totalAmountWithDisocunt = parseFloat(
      (parseFloat(a.toString()) + b + c).toString(),
    );
    this.calculateDiscount();
  };
  /// ////////////////////////////////////

  calculateDiscount = () => {
    var subTotal = 0;
    var total = 0;
    for (const value of this.state.products) {
      subTotal += parseFloat(value.subtotal);
      total += value.total;
    }
    this.state.productsTotal = subTotal;
    this.state.discount = subTotal - total;
    this.setState({
      discount: this.state.discount,
      productsTotal: this.state.productsTotal,
      couponText: '',
    });
  };

  initializePaymentMethods = async () => {
    var dat = {};
    dat.language_id =
      SyncStorage.get('langId') === undefined ? 1 : SyncStorage.get('langId');
    dat.currency_code = this.props.cartItems2.Config.productsArguments.currency;

    const data = await WooComFetch.postHttp(
      getUrl() + '/api/' + 'getpaymentmethods',
      dat,
    );
    if (data.success == 1) {
      for (const a of data.data.data) {
        if (
          a.method !== 'braintree_card' &&
          a.method !== 'braintree_paypal' &&
          a.method !== 'instamojo' &&
          a.method !== 'hyperpay' &&
          a.method !== 'paytm'
          //  &&
          // a.method !== 'razorpay'
        ) {
          this.state.paymentMethods.push(a);
          this.state.method.push(a.method);
        }

        if (a.method == 'paypal' && a.active == '1') {
          this.state.paypalClientId = a.public_key;
          if (a.environment == 'Test') {
            this.state.paypalEnviroment = 'PayPalEnvironmentSandbox';
          } else this.state.paypalEnviroment = 'PayPalEnvironmentProduction';
        }
        if (a.method == 'stripe' && a.active == '1') {
          this.state.publicKeyStripe = a.public_key;
          stripe.setOptions({
            publishableKey: a.public_key,
          });
        }
        if (a.method == 'paytm' && a.active == '1') {
          this.state.mid = a.public_key;
          if (a.environment == 'Test') this.state.paytmEnviroment = 'Staging';
          else this.state.paytmEnviroment = 'Production';
        }
        if (a.method == 'razorpay' && a.active == '1') {
          this.state.razorPayKey = a.public_key;
        }
      }
    }

    this.setState({paymentShowCondition: false});
  };

  handleCustomPayPress = async (params) => {
    const token = await stripe.createTokenWithCard(params);
    this.setTokenFun(token.tokenId);
  };

  addOrder = async () => {
    if (SyncStorage.get('orderDetails').payment_method === 'stripe') {
      await this.handleCustomPayPress(this.state.params);
    }
    const orderDetail = SyncStorage.get('orderDetails');
    orderDetail.customers_id =
      SyncStorage.get('customerData').customers_id === undefined
        ? 1
        : SyncStorage.get('customerData').customers_id;
    orderDetail.customers_name =
      SyncStorage.get('orderDetails').delivery_firstname +
      ' ' +
      SyncStorage.get('orderDetails').delivery_lastname;
    orderDetail.delivery_name =
      SyncStorage.get('orderDetails').billing_firstname +
      ' ' +
      SyncStorage.get('orderDetails').billing_lastname;
    if (SyncStorage.get('orderDetails').guest_status == 1) {
      orderDetail.email =
        SyncStorage.get('customerData').email === undefined ||
        SyncStorage.get('customerData').email === ''
          ? 'guest@gmail.com'
          : SyncStorage.get('customerData').email;
      orderDetail.customers_telephone =
        SyncStorage.get('orderDetails').delivery_phone === undefined ||
        SyncStorage.get('orderDetails').delivery_phone === ''
          ? '123123231312'
          : SyncStorage.get('orderDetails').delivery_phone;
      orderDetail.delivery_phone =
        SyncStorage.get('orderDetails').delivery_phone === undefined ||
        SyncStorage.get('orderDetails').delivery_phone === ''
          ? '123123231312'
          : SyncStorage.get('orderDetails').delivery_phone;
    } else {
      orderDetail.email =
        SyncStorage.get('customerData').email === undefined ||
        SyncStorage.get('customerData').email === ''
          ? 'guest@gmail.com'
          : SyncStorage.get('customerData').email;
      orderDetail.customers_telephone =
        SyncStorage.get('customerData').customers_telephone === undefined ||
        SyncStorage.get('orderDetails').delivery_phone === ''
          ? '123123231312'
          : SyncStorage.get('customerData').customers_telephone;
      orderDetail.delivery_phone =
        SyncStorage.get('orderDetails').delivery_phone === undefined ||
        SyncStorage.get('orderDetails').delivery_phone === ''
          ? '123123231312'
          : SyncStorage.get('orderDetails').delivery_phone;
    }
    orderDetail.delivery_suburb =
      SyncStorage.get('orderDetails').delivery_state === undefined
        ? '0'
        : SyncStorage.get('orderDetails').delivery_state;
    orderDetail.customers_suburb =
      SyncStorage.get('orderDetails').delivery_state === undefined
        ? '0'
        : SyncStorage.get('orderDetails').delivery_state;
    orderDetail.customers_address_format_id = '1';
    orderDetail.delivery_address_format_id = '1';
    orderDetail.products = this.state.products;
    /// //////////////////////
    // orderDetail.products.map(val => {
    //   if (val.product !== undefined && val.product !== null) {
    //     val.product = undefined
    //   }
    // })
    orderDetail.is_coupon_applied = this.state.couponApplied;
    orderDetail.coupons = this.state.couponArray;
    orderDetail.coupon_amount = this.state.discount;
    orderDetail.totalPrice = this.state.totalAmountWithDisocunt;
    orderDetail.nonce = this.state.token;
    orderDetail.language_id =
      SyncStorage.get('langId') === undefined ? 1 : SyncStorage.get('langId');
    orderDetail.currency_code =
      this.props.cartItems2.Config.productsArguments.currency;
    if (orderDetail.delivery_state === undefined) {
      orderDetail.delivery_state = 'other';
    }
    var dat = orderDetail;
    const data = await WooComFetch.postHttp(
      getUrl() + '/api/' + 'addtoorder',
      dat,
    );
    if (data.success == 1) {
      this.props.cartItems2.cartItems.cartProductArray = [];
      this.props.cartItems2.cartItems.couponArray = [];
      this.props.cartItems2.cartItems.cartquantity = 0;
      SyncStorage.set('cartProducts', []);
      SyncStorage.set('thanksActive', true);
      const resetAction = StackActions.reset({
        key: null,
        index: 1,
        actions: [
          NavigationActions.navigate({routeName: 'CartScreen'}),
          NavigationActions.navigate({routeName: 'ThankUScreen'}),
        ],
      });
      this.props.navigation.dispatch(resetAction);
      this.setState({SpinnerTemp: false}, () =>
        this.props.navigation.navigate('ThankUScreen'),
      );

      this.setState({SpinnerTemp: false}, () =>
        this.props.navigation.dispatch(resetAction),
      );
      this.setState({SpinnerTemp: false});
    }

    if (data.success == 0) {
      this.setState({SpinnerTemp: false}, () => {
        this.props.productDeleteIdFun(
          data.data.products_id,
          data.data.message,
          true,
        );
        const resetAction = StackActions.reset({
          key: null,
          index: 1,
          actions: [
            NavigationActions.navigate({routeName: 'CartScreen'}),
            NavigationActions.navigate({routeName: 'ThankUScreen'}),
          ],
        });
        this.props.navigation.dispatch(resetAction);
        this.setState({SpinnerTemp: false}, () =>
          this.props.navigation.navigate('CartScreen'),
        );
      });
    }
    this.setState({SpinnerTemp: false});
  };

  /// ////////////////////////////////////
  onInit = async () => {
    const json2 = await WooComFetch.getPaymentGateways(
      this.props.cartItems2.Config.productsArguments,
    );
    json2.map((buttonInfo, index) => {
      this.state.radioButton[index] = false;
    });
    this.setState({
      loaderPaymentMethods: false,
      paymentMethods: json2,
      paymentShowCondition: false,
    });
  };

  getProducts() {
    const data = [];
    for (const v of this.props.cartItems2.cartItems.cartProductArray) {
      const obj = {
        quantity: v.quantity,
        product_id: v.product_id,
        total: v.total.toString(),
        price: v.price.toString(),
      };
      if (v.variation_id) Object.assign(obj, {variation_id: v.variation_id});
      data.push(obj);
    }
    return data;
  }

  singaleRow(placeholderText, name, iconValue, paymentIcon, index, id) {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          padding: 6,
          flexDirection: 'row',
          flex: 1,
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: themeStyle.mediumSize,
            color: themeStyle.textColor,
            paddingTop: 3,
          }}>
          {placeholderText}
        </Text>
        {paymentIcon ? (
          <Icon
            onPress={() => {
              this.state.paymentMethods.map((buttonInfo, index) => {
                this.state.radioButton[index] = false;
              });
              this.state.radioButton[index]
                ? (this.state.radioButton[index] = false)
                : (this.state.radioButton[index] = true);
              this.setState({
                radioButton: this.state.radioButton,
                wrapperCondition2: false,
                paymentText: placeholderText,
                selectedPaymentMethod: id,
                buttonEnable: true,
                selectedPaymentMethodTitle: placeholderText,
              });
            }}
            name={
              !this.state.radioButton[index]
                ? 'radio-button-off'
                : 'radio-button-on'
            }
            style={{color: '#4d4d4d', fontSize: 25}}
          />
        ) : iconValue ? (
          <TouchableOpacity
            onPress={() => this.setState({wrapperCondition2: true})}>
            <View
              style={{
                justifyContent: 'space-around',
                padding: 3,
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  paddingRight: 5,
                  fontSize: themeStyle.mediumSize,
                  paddingTop: 2,
                  color: themeStyle.textColor,
                }}>
                {this.state.paymentText}
              </Text>
              <Icon
                name={'arrow-dropdown'}
                style={{color: '#4d4d4d', fontSize: 22}}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <HTML
              html={SyncStorage.get('currency')}
              baseFontStyle={{
                fontSize: themeStyle.mediumSize,
                color: themeStyle.textColor,
              }}
            />
            <Text
              style={{
                textAlign: 'center',
                fontSize: themeStyle.mediumSize,
                color: themeStyle.textColor,
              }}>
              {name}
            </Text>
          </View>
        )}
      </View>
    );
  }

  /// //////////////////////////////////////////
  singaleRow3(placeholderText, name, iconValue, paymentIcon, index, id) {
    return (
      <TouchableOpacity
        style={{
          justifyContent: 'space-between',
          padding: 6,
          flexDirection: 'row',
          flex: 1,
        }}
        onPress={() => {
          const temp = SyncStorage.get('orderDetails');
          temp.payment_method = this.state.method[index];
          SyncStorage.set('orderDetails', temp);
          this.state.paymentMethods.map((buttonInfo, index) => {
            this.state.radioButton[index] = false;
          });
          this.state.radioButton[index]
            ? (this.state.radioButton[index] = false)
            : (this.state.radioButton[index] = true);

          this.setState({
            radioButton: this.state.radioButton,
            wrapperCondition2: false,
            paymentText: placeholderText,
            selectedPaymentMethod: id,
            buttonEnable: true,

            selectedPaymentMethodTitle: placeholderText,
          });
        }}>
        <View
          style={{
            justifyContent: 'space-around',
            padding: 3,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: themeStyle.mediumSize,
              color: themeStyle.textColor,
              paddingTop: 3,
            }}>
            {placeholderText}
          </Text>
        </View>
        <Icon
          onPress={() => {
            const temp = SyncStorage.get('orderDetails');
            temp.payment_method = this.state.method[index];
            SyncStorage.set('orderDetails', temp);
            this.state.paymentMethods.map((buttonInfo, index) => {
              this.state.radioButton[index] = false;
            });
            this.state.radioButton[index]
              ? (this.state.radioButton[index] = false)
              : (this.state.radioButton[index] = true);
            this.setState({
              radioButton: this.state.radioButton,
              wrapperCondition2: false,
              paymentText: placeholderText,
              selectedPaymentMethod: id,
              buttonEnable: true,
              selectedPaymentMethodTitle: placeholderText,
            });
          }}
          name={
            !this.state.radioButton[index]
              ? 'radio-button-off'
              : 'radio-button-on'
          }
          style={{color: '#4d4d4d', fontSize: 25}}
        />
      </TouchableOpacity>
    );
  }

  wraperTouchButton(text, code) {
    return (
      <TouchableOpacity
        style={{paddingTop: 0}}
        onPress={() =>
          this.setState({wrapperCondition: false, couponText: code})
        }>
        <View
          style={{
            alignItems: 'flex-start',
            flexDirection: 'row',
            backgroundColor: 'transparent',
          }}>
          <Icon
            name={'arrow-forward'}
            style={{color: '#4d4d4d', paddingTop: 12, fontSize: 18}}
          />
          <Text
            style={{
              fontSize: themeStyle.mediumSize,
              color: themeStyle.textColor,
              paddingLeft: 10,
              paddingTop: 7,
            }}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  getCoupon = async (code) => {
    this.setState({SpinnerTemp: true});
    var dat = {code: code};
    const data = await postHttp(getUrl() + '/api/' + 'getcoupon', dat);
    if (data.success == 1) {
      const coupon = data.data[0];
      this.applyCouponCart(coupon);
    }
    if (data.success == 0) {
      this.refs.toast.show(data.message);
    }
    // this.refs.toast.show(data.message)
    this.setState({SpinnerTemp: false, couponText: ''});
  };

  deleteCoupon = (code) => {
    this.state.couponArray.forEach((value, index) => {
      if (value.code == code) {
        this.state.couponArray.splice(index, 1);
        return true;
      }
    });

    this.state.products = JSON.parse(
      JSON.stringify(SyncStorage.get('cartProducts')),
    );
    this.state.orderDetail.shipping_cost =
      SyncStorage.get('orderDetails').shipping_cost;

    this.state.couponArray.forEach((value) => {
      if (value.free_shipping == true) {
        SyncStorage.get('orderDetails').shippingName = 'free shipping';
        SyncStorage.get('orderDetails').shippingCost = 0;
      }
      this.state.products = couponProvider.apply(value, this.state.products);
    });
    this.calculateTotal();
    if (this.state.couponArray.length === 0) {
      this.state.couponApplied = 0;
    }
    this.setState({});
  };

  applyCouponCart = (coupon) => {
    if (
      couponProvider.validateCouponService(
        this.refs.toast,
        coupon,
        this.state.products,
        this.state.couponArray,
      ) == false
    ) {
      return 0;
    } else {
      if (coupon.individual_use == 1) {
        this.state.products = JSON.parse(
          JSON.stringify(SyncStorage.get('cartProducts')),
        );
        this.state.couponArray = [];
        this.state.orderDetail.shipping_cost =
          SyncStorage.get('orderDetails').shipping_cost;
      }
      var v = {};
      v.code = coupon.code;
      v.amount = coupon.amount;
      v.product_ids = coupon.product_ids;
      v.exclude_product_ids = coupon.exclude_product_ids;
      v.product_categories = coupon.product_categories;
      v.excluded_product_categories = coupon.excluded_product_categories;
      v.discount = coupon.amount;
      v.individual_use = coupon.individual_use;
      v.free_shipping = coupon.free_shipping;
      v.discount_type = coupon.discount_type;
      this.state.couponArray.push(v);
    }

    if (coupon.free_shipping == 1) {
      this.state.orderDetail.shipping_cost = 0;
    }
    // applying coupon service
    this.state.products = couponProvider.apply(coupon, this.state.products);
    if (this.state.couponArray.length != 0) {
      this.state.couponApplied = 1;
    }
    this.calculateTotal();
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: themeStyle.backgroundColor}}>
        <Spinner
          visible={this.state.SpinnerTemp}
          textStyle={{
            color: themeStyle.loadingIndicatorColor,
            backgroundColor: themeStyle.loadingIndicatorColor,
          }}
        />
        <Toast
          ref="toast"
          style={{backgroundColor: '#c1c1c1'}}
          position="bottom"
          positionValue={200}
          fadeOutDuration={7000}
          textStyle={{color: themeStyle.textColor, fontSize: 15}}
        />
        <ModalWrapper
          style={{
            width: 290,
            height: 310,
            paddingLeft: 24,
            paddingRight: 24,
            backgroundColor: themeStyle.backgroundColor,
          }}
          visible={this.state.wrapperCondition}>
          <Text
            style={{
              fontSize: themeStyle.largeSize,
              padding: 5,
              fontWeight: '600',
              color: themeStyle.textColor,
            }}>
            Demo Coupons{' '}
          </Text>
          <View>
            <View
              style={{
                paddingLeft: 1,
                flexDirection: 'column',
                paddingRight: 2,
              }}>
              {this.wraperTouchButton(
                'Cart Percentage (cp9989). A percentage discount for selected products only',
                'cp9989',
              )}
              {this.wraperTouchButton(
                'Product Fixed (pf8787). A fixed total discount for selected products only',
                'pf8787',
              )}
              {this.wraperTouchButton(
                'Cart Fixed (cf9999). A fixed total discount for the entire cart',
                'cf9999',
              )}
              {this.wraperTouchButton(
                'Product Percentage (pp2233). A percentage discount for selected products only',
                'pp2233',
              )}
            </View>
          </View>
          <TouchableOpacity
            style={{paddingTop: 5}}
            onPress={() => this.setState({wrapperCondition: false})}>
            <View
              style={{
                alignItems: 'flex-start',
                margin: 20,
                backgroundColor: 'transparent',
                justifyContent: 'center',
                paddingLeft: 12,
                marginLeft: 10,
                paddingBottom: 5,
                marginBottom: 0,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: themeStyle.mediumSize,
                  // color: themeStyle.textColor,
                  color: themeStyle.textColor,
                  fontWeight: '600',
                }}>
                {this.props.cartItems2.Config.languageJson.Close}
              </Text>
            </View>
          </TouchableOpacity>
        </ModalWrapper>
        <ModalWrapper
          style={{
            width: 280,
            paddingLeft: 24,
            paddingRight: 24,
            backgroundColor: themeStyle.backgroundColor,
          }}
          visible={this.state.wrapperCondition2}>
          <Text
            style={{
              padding: 10,
              fontSize: themeStyle.largeSize,
              fontWeight: '500',
              paddingTop: 20,
              color: themeStyle.textColor,
            }}>
            {this.props.cartItems2.Config.languageJson.Payment}
          </Text>

          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: '#d9d9d9',
              marginBottom: 12,
            }}
          />

          <View>
            <View
              style={{
                paddingLeft: 1,
                flexDirection: 'column',
                paddingRight: 2,
                // backgroundColor:'red'
              }}>
              <FlatList
                data={this.state.paymentMethods}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                extraData={this.state}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(item) =>
                  item.item.active == 1
                    ? this.singaleRow3(
                        item.item.name,
                        this.state.discount,
                        true,
                        true,
                        item.index,
                        item.item.method,
                      )
                    : null
                }
              />
            </View>
          </View>
          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: '#d9d9d9',
            }}
          />
          <TouchableOpacity
            style={{padding: 10}}
            onPress={() => this.setState({wrapperCondition2: false})}>
            <View
              style={{
                alignItems: 'flex-start',
                padding: 10,
                backgroundColor: 'transparent',
                justifyContent: 'center',
                paddingLeft: 12,
                paddingBottom: 5,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: themeStyle.mediumSize,
                  color: themeStyle.textColor,
                }}>
                {this.props.cartItems2.Config.languageJson.Close}
              </Text>
            </View>
          </TouchableOpacity>
        </ModalWrapper>
        <FlatList
          data={['asd']}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          extraData={this.state}
          ListFooterComponent={
            <View style={{backgroundColor: themeStyle.backgroundColor}}>
              {this.state.buttonEnable ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: '#f5fafe',
                  }}
                  onPress={() => {
                    if (
                      SyncStorage.get('orderDetails').payment_method ===
                      'paypal'
                    ) {
                      this.paypayMethod();
                    }
                    if (
                      SyncStorage.get('orderDetails').payment_method ===
                        'stripe' ||
                      SyncStorage.get('orderDetails').payment_method ===
                        'cod' ||
                      SyncStorage.get('orderDetails').payment_method === 'card'
                    ) {
                      this.setState({SpinnerTemp: true}, () => this.addOrder());
                    }
                    if (
                      SyncStorage.get('orderDetails').payment_method ===
                      'razorpay'
                    ) {
                      this.setState({SpinnerTemp: true}, () => {
                        var options = {
                          description: 'Credits towards consultation',
                          image: 'https://i.imgur.com/3g7nmJC.png',
                          // "currency": "INR",
                          currency:
                            this.props.cartItems2.Config.productsArguments.currency.toString(),
                          key: this.state.razorPayKey,
                          amount: this.state.totalAmountWithDisocunt * 100,
                          name: 'Razor Pay',
                          prefill: {
                            email: SyncStorage.get('customerData').email,
                            contact:
                              SyncStorage.get('customerData')
                                .customers_telephone,
                            name:
                              SyncStorage.get('customerData').first_name +
                              ' ' +
                              SyncStorage.get('customerData').last_name,
                          },
                          theme: {color: themeStyle.primary},
                        };
                        RazorpayCheckout.open(options)
                          .then((data) => {
                            this.setState(
                              {token: data.razorpay_payment_id},
                              () => this.addOrder(),
                            );
                          })
                          .catch((error) => {
                            this.setState({SpinnerTemp: false}, () => {
                              Alert.alert(
                                `Error: ${error.code} | ${error.description}`,
                              );
                            });
                          });
                      });
                    }
                  }}>
                  <View
                    style={{
                      borderColor: '#fff',
                      alignItems: 'center',
                      alignSelf: 'center',
                      height: 55,
                      width: 250,
                      marginVertical: 25,
                      backgroundColor: '#2d79be',
                      borderRadius: 5,
                      flex: 1,
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#FFF',
                        fontSize: themeStyle.mediumSize,
                        fontWeight: '500',
                      }}>
                      {this.props.cartItems2.Config.languageJson.Continue}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
          }
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          renderItem={() => (
            <View
              style={{
                backgroundColor: themeStyle.backgroundColor,
                justifyContent: 'space-between',
                shadowOffset: {width: 1, height: 1},
                shadowColor: themeStyle.textColor,
                shadowOpacity: 0.5,
                elevation: 5,
                flex: 1,
              }}>
              <View
                style={{
                  backgroundColor: '#f5fafe',
                  justifyContent: 'space-between',
                  shadowOffset: {width: 1, height: 1},
                  shadowColor: themeStyle.textColor,
                  shadowOpacity: 0.5,
                  flex: 1,
                  marginTop: 0,
                  marginBottom: 0,
                  borderBottomWidth: 3,
                  borderBottomColor: '#e4ecf2',
                }}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      justifyContent: 'space-between',
                      flex: 1,
                      backgroundColor: '#f5fafe',
                      fontSize: themeStyle.largeSize,
                      fontWeight: 'bold',
                      color: themeStyle.textContrast,
                      // paddingLeft: 25,
                      paddingHorizontal: 20,
                      paddingTop: 14,
                    }}>
                    {
                      this.props.cartItems2.Config.languageJson[
                        'Shipping Address'
                      ]
                    }
                  </Text>

                  <Text
                    style={{
                      justifyContent: 'space-between',
                      padding: 10,
                      flex: 1,
                      fontSize: themeStyle.mediumSize,
                      color: themeStyle.textColor,
                      // paddingLeft: 25,
                      paddingHorizontal: 20,
                    }}>
                    {this.state.orderDetail.delivery_street_address +
                      ', ' +
                      this.state.orderDetail.delivery_city +
                      ', ' +
                      this.state.orderDetail.delivery_state +
                      ',' +
                      this.state.orderDetail.delivery_postcode +
                      ', ' +
                      this.state.orderDetail.delivery_country}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: '#f5fafe',
                  justifyContent: 'space-between',
                  shadowOffset: {width: 1, height: 1},
                  shadowColor: themeStyle.textColor,
                  shadowOpacity: 0.5,
                  flex: 1,
                  // margin: 10,
                  marginBottom: 0,
                  borderBottomWidth: 3,
                  borderBottomColor: '#e4ecf2',
                }}>
                <View
                  style={{
                    justifyContent: 'space-between',

                    flex: 1,
                  }}>
                  <Text
                    style={{
                      justifyContent: 'space-between',
                      flex: 1,
                      backgroundColor: '#f5fafe',
                      fontSize: themeStyle.largeSize,
                      fontWeight: 'bold',
                      paddingHorizontal: 10,
                      paddingTop: 14,
                      paddingHorizontal: 20,
                      color: themeStyle.textContrast,
                    }}>
                    {
                      this.props.cartItems2.Config.languageJson[
                        'Billing Address'
                      ]
                    }
                  </Text>

                  <Text
                    style={{
                      justifyContent: 'space-between',
                      padding: 10,
                      flex: 1,
                      paddingHorizontal: 20,
                      fontSize: themeStyle.mediumSize,
                      color: themeStyle.textColor,
                    }}>
                    {this.state.orderDetail.billing_street_address +
                      ', ' +
                      this.state.orderDetail.billing_city +
                      ', ' +
                      this.state.orderDetail.billing_state +
                      ', ' +
                      this.state.orderDetail.billing_postcode +
                      ', ' +
                      this.state.orderDetail.billing_country}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: '#f5fafe',
                  justifyContent: 'space-between',
                  shadowOffset: {width: 1, height: 1},
                  shadowColor: themeStyle.textColor,
                  shadowOpacity: 0.5,
                  flex: 1,
                  // margin: 10,
                  borderBottomWidth: 3,
                  borderBottomColor: '#e4ecf2',
                  marginBottom: 0,
                }}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      justifyContent: 'space-between',
                      paddingHorizontal: 20,
                      paddingTop: 14,
                      flex: 1,
                      backgroundColor: '#f5fafe',
                      fontSize: themeStyle.largeSize,
                      fontWeight: 'bold',
                      color: themeStyle.textContrast,
                    }}>
                    {
                      this.props.cartItems2.Config.languageJson[
                        'Shipping Address'
                      ]
                    }
                  </Text>

                  <Text
                    style={{
                      justifyContent: 'space-between',
                      padding: 10,
                      flex: 1,
                      paddingHorizontal: 20,
                      fontSize: themeStyle.mediumSize,
                      color: themeStyle.textColor,
                    }}>
                    {this.state.orderDetail.shipping_method}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: themeStyle.backgroundColor,
                  justifyContent: 'space-between',
                  flex: 1,
                  marginBottom: 0,
                  borderBottomWidth: 3,
                  borderBottomColor: '#e4ecf2',
                }}>
                <View
                  style={{
                    justifyContent: 'space-between',

                    flex: 1,
                  }}>
                  <Text
                    style={{
                      justifyContent: 'space-between',
                      padding: 10,
                      paddingHorizontal: 20,
                      flex: 1,
                      backgroundColor: '#f5fafe',
                      fontSize: themeStyle.largeSize,
                      fontWeight: 'bold',
                      color: themeStyle.textContrast,
                    }}>
                    {this.props.cartItems2.Config.languageJson.Products}
                  </Text>

                  <FlatList
                    data={this.state.products}
                    extraData={this.state}
                    listKey={'products'}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(item) => (
                      <View
                        style={{
                          backgroundColor: '#f5fafe',
                        }}>
                        <View
                          style={{
                            backgroundColor: '#FFFF',
                            marginHorizontal: 18,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            marginTop: 8,
                            marginBottom: 20,
                            borderRadius: 9,
                            shadowOffset: {width: 1, height: 0},
                            shadowColor: themeStyle.textColor,
                            shadowOpacity: 0.5,
                            elevation: 8,
                          }}>
                          <View
                            style={{
                              justifyContent: 'space-between',
                              padding: 0,
                              paddingLeft: 3,
                              flexDirection: 'row',
                            }}>
                            <ImageLoad
                              key={item.item.id}
                              style={{height: 90, width: 90}}
                              loadingStyle={{
                                size: 'large',
                                color: themeStyle.loadingIndicatorColor,
                              }}
                              placeholder={false}
                              ActivityIndicator={true}
                              placeholderStyle={{width: 0, height: 0}}
                              source={{
                                uri: themeStyle.url + '/' + item.item.image,
                              }}
                            />
                            <View
                              style={{
                                padding: 0,
                                paddingLeft: 7,
                                flexDirection: 'column',
                                flex: 1,
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={{
                                  color: themeStyle.textColor,
                                  paddingLeft: 8,
                                  fontSize: 15,
                                  fontWeight: 'bold',
                                }}>
                                {item.item.products_name}
                              </Text>
                              <View
                                style={{
                                  width: '100%',
                                  padding: 3,
                                  paddingLeft: 8,
                                  flexDirection: 'row',
                                }}>
                                <Text
                                  style={{
                                    fontSize: themeStyle.mediumSize,
                                    fontWeight: 'normal',
                                    color: themeStyle.textColor,
                                    paddingRight: 3,
                                  }}>
                                  {
                                    this.props.cartItems2.Config.languageJson
                                      .Price
                                  }{' '}
                                  :
                                </Text>

                                <HTML
                                  html={SyncStorage.get('currency')}
                                  baseFontStyle={{
                                    fontSize: themeStyle.mediumSize,
                                    color: 'red',
                                  }}
                                />

                                <Text
                                  style={{
                                    paddingTop: 0,
                                    color: 'red',
                                  }}>
                                  {Number(item.item.price).toFixed(2)}
                                </Text>
                              </View>
                              <View
                                style={{
                                  justifyContent: 'space-between',
                                  padding: 0,
                                  paddingLeft: 8,
                                  flexDirection: 'row',
                                  marginTop: 0,
                                }}>
                                <View style={{flexDirection: 'row'}}>
                                  <Text
                                    style={{
                                      fontSize: themeStyle.mediumSize,
                                      fontWeight: 'normal',
                                      color: themeStyle.textColor,
                                    }}>
                                    {
                                      this.props.cartItems2.Config.languageJson
                                        .Quantity
                                    }{' '}
                                    :
                                  </Text>
                                  <Text style={{paddingLeft: 3, color: '#000'}}>
                                    {item.item.customers_basket_quantity}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <View
                              style={{
                                justifyContent: 'space-between',
                                alignItems: 'flex-end',
                                flexDirection: 'row',
                                height: '87%',
                              }}>
                              <View style={{paddingRight: 5}}>
                                <View>
                                  <Text
                                    style={{
                                      fontSize: themeStyle.largeSize,
                                      fontWeight: 'bold',
                                      color: themeStyle.textColor,
                                      alignSelf: 'flex-end',
                                    }}>
                                    {
                                      this.props.cartItems2.Config.languageJson
                                        .Total
                                    }{' '}
                                  </Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                  <HTML
                                    html={SyncStorage.get('currency')}
                                    baseFontStyle={{
                                      fontSize: themeStyle.largeSize,
                                      color: themeStyle.textColor,
                                    }}
                                  />
                                  <Text
                                    style={{
                                      fontSize: themeStyle.largeSize,
                                      fontWeight: '400',
                                      color: themeStyle.textColor,
                                    }}>
                                    {`${Number(item.item.total).toFixed(2)}`}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>

                          <View
                            style={{
                              padding: 3,
                              paddingLeft: 8,
                              flexDirection: 'row',
                              justifyContent: 'flex-end',
                              flex: 1,
                              alignItems: 'flex-end',
                            }}
                          />
                        </View>
                      </View>
                    )}
                  />
                </View>
              </View>
              <Text
                style={{
                  justifyContent: 'space-between',
                  padding: 10,
                  paddingHorizontal: 24,
                  flex: 1,
                  backgroundColor: '#f5fafe',
                  fontSize: themeStyle.largeSize,
                  fontWeight: 'bold',
                  color: themeStyle.textContrast,
                }}>
                {this.props.cartItems2.Config.languageJson.SubTotal}
              </Text>
              <View
                style={{
                  backgroundColor: '#f5fafe',
                  justifyContent: 'space-between',
                  flex: 1,
                  paddingHorizontal: 10,
                  borderBottomWidth: 3,
                  borderBottomColor: '#e4ecf2',
                }}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    padding: 15,
                    flexDirection: 'row',
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      fontSize: themeStyle.mediumSize,
                      color: themeStyle.textColor,
                    }}>
                    {
                      this.props.cartItems2.Config.languageJson[
                        'Products Price'
                      ]
                    }
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    <HTML
                      html={SyncStorage.get('currency')}
                      baseFontStyle={{
                        fontSize: themeStyle.mediumSize,
                        color: themeStyle.textColor,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: themeStyle.mediumSize,
                        fontWeight: '400',
                        color: themeStyle.textColor,
                      }}>
                      {Number(this.state.productsTotal).toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: 'space-between',
                    padding: 15,
                    paddingTop: 1,
                    flexDirection: 'row',
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      color: themeStyle.textColor,
                      fontSize: themeStyle.mediumSize,
                    }}>
                    {this.props.cartItems2.Config.languageJson.Tax}
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    <HTML
                      html={SyncStorage.get('currency')}
                      baseFontStyle={{
                        fontSize: themeStyle.mediumSize,
                        color: themeStyle.textColor,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: themeStyle.mediumSize,
                        fontWeight: '400',
                        color: themeStyle.textColor,
                      }}>
                      {Number(this.state.orderDetail.total_tax).toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: 'space-between',
                    padding: 15,
                    paddingTop: 1,
                    flexDirection: 'row',
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      color: themeStyle.textColor,
                      fontSize: themeStyle.mediumSize,
                    }}>
                    {this.props.cartItems2.Config.languageJson['Shipping Cost']}
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    <HTML
                      html={SyncStorage.get('currency')}
                      baseFontStyle={{
                        fontSize: themeStyle.mediumSize,
                        color: themeStyle.textColor,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: themeStyle.mediumSize,
                        fontWeight: '400',
                        color: themeStyle.textColor,
                      }}>
                      {Number(this.state.orderDetail.shipping_cost).toFixed(2)}
                    </Text>
                  </View>
                </View>

                {this.state.couponApplied == 1 ? (
                  <View
                    style={{
                      justifyContent: 'space-between',
                      padding: 15,
                      paddingTop: 1,
                      flexDirection: 'row',
                      flex: 1,
                    }}>
                    <Text
                      style={{
                        color: themeStyle.textColor,
                        fontSize: themeStyle.mediumSize,
                      }}>
                      {this.props.cartItems2.Config.languageJson2.Discount}
                    </Text>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                      }}>
                      <HTML
                        html={SyncStorage.get('currency')}
                        baseFontStyle={{
                          fontSize: themeStyle.mediumSize,
                          color: themeStyle.textColor,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: themeStyle.mediumSize,
                          fontWeight: '400',
                          color: themeStyle.textColor,
                        }}>
                        {Number(this.state.discount).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                ) : null}

                <View
                  style={{
                    justifyContent: 'space-between',
                    padding: 15,
                    paddingTop: 1,
                    flexDirection: 'row',
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      color: themeStyle.textColor,
                      fontWeight: 'bold',
                      fontSize: themeStyle.mediumSize,
                    }}>
                    {this.props.cartItems2.Config.languageJson.Total}
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    <HTML
                      html={SyncStorage.get('currency')}
                      baseFontStyle={{
                        fontSize: themeStyle.mediumSize,
                        color: themeStyle.textColor,
                        fontWeight: 'bold',
                      }}
                    />
                    <Text
                      style={{
                        fontSize: themeStyle.mediumSize,
                        fontWeight: 'bold',
                        color: themeStyle.textColor,
                      }}>
                      {Number(this.state.totalAmountWithDisocunt).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  height: 110,
                  backgroundColor: '#f5fafe',
                  justifyContent: 'space-between',
                  flex: 1,
                  paddingHorizontal: 14,
                  borderBottomWidth: 3,
                  borderBottomColor: '#e4ecf2',
                }}>
                {/* <TouchableOpacity
                  style={{paddingTop: 5}}
                  onPress={() => this.setState({wrapperCondition: true})}>
                  <View
                    style={{
                      alignItems: 'flex-start',
                      padding: 10,
                      backgroundColor: 'transparent',
                      justifyContent: 'center',
                      paddingLeft: 12,
                      paddingBottom: 5,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: themeStyle.mediumSize - 2,
                        color: themeStyle.otherBtnsColor,
                        textDecorationLine: 'underline',
                        fontWeight: 'bold',
                      }}>
                      {
                        this.props.cartItems2.Config.languageJson2[
                          'LIST OF COUPON CODES'
                        ]
                      }
                    </Text>
                  </View>
                </TouchableOpacity> */}

                <View
                  style={{
                    justifyContent: 'space-between',
                    padding: 12,
                    flexDirection: 'row',
                    flex: 1,
                    elevation: 9,
                  }}>
                  <TextInput
                    style={{
                      height: 60,
                      borderColor: '#c1c1c1',
                      borderWidth: 1,
                      paddingLeft: 12,
                      flex: 2,
                      marginHorizontal: 0,
                      marginBottom: 25,
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                      color: themeStyle.textColor,
                      borderRadius: 10,
                      backgroundColor: '#ffffff',
                      borderColor: '#ffffff',
                      shadowOffset: {width: 1, height: 0},
                      shadowColor: 'themeStyle.textColor',
                      shadowOpacity: 0.5,
                      // elevation: 5,
                    }}
                    selectionColor="#51688F"
                    placeholder={
                      this.props.cartItems2.Config.languageJson2['coupon code']
                    }
                    placeholderTextColor={'#000'}
                    onChangeText={(couponText) =>
                      this.setState({couponText, errorMessage: ''})
                    }
                    value={this.state.couponText}
                  />

                  <TouchableOpacity
                    disabled={!this.state.couponText}
                    style={{
                      height: '100%',
                      width: '30%',
                      paddingLeft: 5,
                      position: 'absolute',
                      zIndex: 2,
                      right: 25,
                      top: 30,
                    }}
                    onPress={() => this.getCoupon(this.state.couponText)}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          opacity: this.state.couponText ? null : 0.4,
                          backgroundColor: '#ffff',
                          justifyContent: 'center',
                          borderRadius: 10 / 2,
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            // fontSize: themeStyle.mediumSize,
                            fontSize: 17,
                            color: '#ed1c24',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            paddingRight: 10,
                          }}>
                          {this.props.cartItems2.Config.languageJson.Apply}
                        </Text>
                      </View>
                      <View style={{left: 0, right: 0, alignItems: 'flex-end', position: 'absolute', top: 0}}>
                        <FIcon size={20} color="red" name="tag" style={{opacity: this.state.couponText ? null : 0.4,}}/>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={{paddingTop: 5}}
                  onPress={() => this.setState({wrapperCondition: true})}>
                  <View
                    style={{
                      alignItems: 'flex-start',
                      padding: 10,
                      backgroundColor: 'transparent',
                      justifyContent: 'center',
                      paddingLeft: 13,
                      paddingBottom: 10,
                      top: 5,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 15,
                        color: themeStyle.otherBtnsColor,
                        // textDecorationLine: 'underline',
                        fontWeight: 'bold',
                      }}>
                      {
                        this.props.cartItems2.Config.languageJson2[
                          'LIST OF COUPON CODES'
                        ]
                      }
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {this.state.couponArray.length > 0 ? (
                <View
                  style={{
                    backgroundColor: themeStyle.backgroundColor,
                    justifyContent: 'space-between',
                    shadowOffset: {width: 1, height: 1},
                    shadowColor: themeStyle.textColor,
                    shadowOpacity: 0.5,
                    flex: 1,
                    margin: 10,
                    marginTop: 10,
                    marginBottom: 5,
                    elevation: 5,
                  }}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flex: 1,
                    }}>
                    <Text
                      style={{
                        justifyContent: 'space-between',
                        padding: 10,
                        flex: 1,
                        backgroundColor: '#d3d3d3',
                        fontSize: themeStyle.largeSize,
                        fontWeight: '500',
                        color: themeStyle.textContrast,
                      }}>
                      {this.props.cartItems2.Config.languageJson.Coupon}
                    </Text>

                    <FlatList
                      data={this.state.couponArray}
                      extraData={this.state}
                      listKey={'coupon'}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={(item) => (
                        <View
                          style={{
                            backgroundColor: themeStyle.backgroundColor,
                            justifyContent: 'space-between',
                            flex: 1,
                            margin: 10,
                            marginTop: 5,
                            marginBottom: 2,
                          }}>
                          <View
                            style={{
                              justifyContent: 'space-between',
                              padding: 15,
                              flexDirection: 'row',
                              paddingBottom: 0,
                              paddingTop: 15,
                            }}>
                            <Text
                              style={{
                                textAlign: 'center',
                                fontSize: themeStyle.mediumSize,
                                color: themeStyle.textColor,
                              }}>
                              {
                                this.props.cartItems2.Config.languageJson[
                                  'Coupon Code'
                                ]
                              }
                            </Text>
                            <Text
                              style={{
                                textAlign: 'center',
                                fontSize: themeStyle.mediumSize,
                                color: themeStyle.textColor,
                              }}>
                              {item.item.code}
                            </Text>
                          </View>

                          <View
                            style={{
                              justifyContent: 'space-between',
                              padding: 15,
                              flexDirection: 'row',
                              paddingBottom: 0,
                              paddingTop: 12,
                            }}>
                            <Text
                              style={{
                                textAlign: 'center',
                                fontSize: themeStyle.mediumSize,
                                color: themeStyle.textColor,
                              }}>
                              {
                                this.props.cartItems2.Config.languageJson[
                                  'Coupon Amount'
                                ]
                              }
                            </Text>
                            <View
                              style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                              }}>
                              <HTML
                                html={SyncStorage.get('currency')}
                                baseFontStyle={{
                                  fontSize: themeStyle.mediumSize,
                                  color: themeStyle.textColor,
                                }}
                              />
                              <Text
                                style={{
                                  textAlign: 'center',
                                  fontSize: themeStyle.mediumSize,
                                  color: themeStyle.textColor,
                                }}>
                                {item.item.amount}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              justifyContent: 'space-between',
                              padding: 15,
                              paddingTop: 12,
                              flexDirection: 'row',
                              paddingBottom: 0,
                              backgroundColor: themeStyle.backgroundColor,
                            }}>
                            <Text
                              style={{
                                fontSize: themeStyle.mediumSize,
                                color: themeStyle.textColor,
                              }}>
                              {item.item.discount_type === 'fixed_product'
                                ? this.props.cartItems2.Config.languageJson[
                                    'A fixed total discount for selected products only'
                                  ]
                                : null}
                              {item.item.discount_type === 'fixed_cart'
                                ? this.props.cartItems2.Config.languageJson[
                                    'A fixed total discount for the entire cart'
                                  ]
                                : null}
                              {item.item.discount_type === 'percent_product'
                                ? this.props.cartItems2.Config.languageJson[
                                    'A percentage discount for selected products only'
                                  ]
                                : null}
                              {item.item.discount_type === 'percent'
                                ? this.props.cartItems2.Config.languageJson[
                                    'A percentage discount for the entire cart'
                                  ]
                                : null}
                            </Text>
                          </View>

                          <View
                            style={{
                              justifyContent: 'space-between',
                              padding: 12,
                              paddingTop: 8,
                              flexDirection: 'row',
                            }}>
                            <TouchableOpacity
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 6,
                              }}
                              onPress={() => this.deleteCoupon(item.item.code)}>
                              <View
                                style={{
                                  flex: 1,
                                  alignItems: 'center',
                                  backgroundColor: themeStyle.removeBtnColor,
                                  justifyContent: 'center',
                                  padding: 6,
                                  borderRadius: 10,
                                }}>
                                <Text
                                  style={{
                                    textAlign: 'center',
                                    fontSize: themeStyle.mediumSize,
                                    color: 'white',
                                    fontWeight: '500',
                                  }}>
                                  {
                                    this.props.cartItems2.Config.languageJson
                                      .Remove
                                  }
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    />
                  </View>
                </View>
              ) : null}

              <View
                style={{
                  backgroundColor: themeStyle.backgroundColor,
                  justifyContent: 'space-between',
                  shadowOffset: {width: 1, height: 1},
                  shadowColor: themeStyle.textColor,
                  shadowOpacity: 0.5,
                  flex: 1,
                  // marginBottom: 5,
                }}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    backgroundColor: '#f5fafe',
                    borderBottomWidth: 3,
                    borderBottomColor: '#e4ecf2',
                    flex: 1,
                    paddingHorizontal: 13,
                  }}>
                  <Text
                    style={{
                      justifyContent: 'space-between',
                      paddingVertical: 15,
                      flex: 1,
                      paddingLeft: 15,
                      fontSize: themeStyle.largeSize,
                      fontWeight: 'bold',
                      color: themeStyle.textContrast,
                    }}>
                    {this.props.cartItems2.Config.languageJson['Order Notes']}
                  </Text>

                  <TextInput
                    style={{
                      height: 60,
                      borderColor: '#c1c1c1',
                      borderWidth: 1,
                      paddingLeft: 12,
                      marginHorizontal: 13,
                      marginBottom: 25,
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                      color: themeStyle.textColor,
                      borderRadius: 10,
                      backgroundColor: '#ffffff',
                      borderColor: '#ffffff',
                      shadowOffset: {width: 1, height: 0},
                      shadowColor: 'themeStyle.textColor',
                      shadowOpacity: 0.5,
                      elevation: 5,
                    }}
                    selectionColor={'#c1c1c1'}
                    placeholder={`Type Here`}
                    placeholderTextColor={'#000'}
                    onChangeText={(customerNotes) => {
                      this.setState({customerNotes});
                    }}
                    value={this.state.customerNotes}
                  />
                </View>
              </View>

              {this.state.paymentShowCondition ? (
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <UIActivityIndicator
                    size={27}
                    color={themeStyle.loadingIndicatorColor}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => this.setState({wrapperCondition2: true})}
                  style={{
                    backgroundColor: themeStyle.backgroundColor,
                    justifyContent: 'space-between',
                    shadowOffset: {width: 1, height: 1},
                    shadowColor: themeStyle.textColor,
                    shadowOpacity: 0.5,
                    flex: 1,
                    // marginBottom: 15,
                  }}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flex: 1,
                      backgroundColor: '#f5fafe',
                      paddingVertical: 7,
                      paddingHorizontal: 25,
                    }}>
                    <View
                      style={{
                        justifyContent: 'space-between',
                        flex: 1,
                      }}>
                      {this.singaleRow(
                        this.props.cartItems2.Config.languageJson.Payment,
                        Number(this.state.tax).toFixed(2),
                        true,
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              {this.state.paymentText === 'Stripe' ? (
                <CardTextFieldScreen
                  setTokenFun={(t) => this.setTokenFun(t)}
                  setParams={(t) => this.setParams(t)}></CardTextFieldScreen>
              ) : null}
            </View>
          )}
        />
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  cartItems2: state,
});

const mapDispatchToProps = (dispatch) => ({
  productDeleteIdFun: (value, msg, check) => {
    dispatch({
      type: 'OUT_OF_STOCK_PRODUCT',
      productDeleteId: value,
      msg: msg,
      check: check,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(orderScreen);
