import {Dimensions} from 'react-native';
import uuid from 'react-native-uuid';
const WIDTH = Dimensions.get('window').width;
// set card width according to your requirement
const cardWidth = WIDTH * 0.3991;
// cardWidth= WIDTH * 0.4191 // card width for two and half card
// cardWidth= WIDTH * 0.6191 // one and half
// cardWidth= WIDTH * 0.42
const cIp = '192.168.1.' + Math.floor(Math.random() * 99) + 1; // default
const cDid = uuid.v4();
export default {
  /// /////////////////////////////

  url: 'https://starmartonline.pk', //your site URL
  consumerKey: 'cdf716221634121829ea4985fc', // Your consumer secret
  consumerSecret: 'ca9ea115163412182933556608', // Your consumer secret

  webClientIdForGoogleSign:
    '525656277362-uhimqv63papb0lghvaj5qrsnh8iqa8ss.apps.googleusercontent.com', // webClientId For Google SignIn
  /// //// navigation
  homeTitle: 'Becrux',
  bottomNavigation: false,
  // please reset app cache after changing these five values
  defaultCurrencySymbol: '&#36;',
  defaultCurrencyCode: 'USD',
  priceDecimals: 2,
  // by default language for ltr
  ltrlanguageCode: 'en',
  // by default language for rtl
  rtllanguageCode: 'ar',

  // Banners props
  autoplay: true,
  autoplayDelay: 2,
  autoplayLoop: true,
  // StatusBarColor: '#374e02',
  StatusBarColor: '#374e02',

  // --ion-color-primary-shade: #374e02;
  barStyle: 'light-content', // dark-content, default

  headerTintColor: 'rgb(255, 255, 255)',
  headerIconsColor: 'rgb(255, 255, 255)',

  primaryDark: '#374e02',
  primary: '#3e5902',
  primaryContrast: '#ffffff',
  // backgroundColor: '#F2F2F2',// color for card style 11
  // backgroundColor: '#fdfcfa',
  backgroundColor: 'red',
  // backgroundColor: '#fdfdfd',
  textColor: '#000',
  textContrast: '#000',

  google: '#dd4b39',
  facebook: '#3b5998',

  // Button Colors
  addToCartBtnColor: '#3e5902',
  addToCartBtnTextColor: '#fff',
  // addToCartBagBtnColor: '#4E4E4E',
  addToCartBagBtnColor: '#3e5902',

  outOfStockBtnColor: '#D81800',
  outOfStockBtnTextColor: '#fff',

  detailsBtnColor: '#3e5902',
  detailsBtnTextColor: '#fff',
  removeBtnColor: '#D81800',
  removeBtnTextColor: '#fff',
  wishHeartBtnColor: '#3e5902',
  // otherBtnsColor: '#3e5902',
  otherBtnsColor: '#2C79BD',

  otherBtnsText: '#fff',

  saleBackgroundColor: '#3e5902',
  saleTextColor: '#fff',
  featuredBackgroundColor: '#3e5902',
  featuredTextColor: '#fff',
  newBackgroundColor: '#D81800',
  newTextColor: '#fff',

  priceColor: '#000',

  /// ///////// font size

  largeSize: 16,
  mediumSize: 14,
  smallSize: 12,

  /// //////// cartWidth
  singleRowCardWidth: cardWidth,
  twoRowCardWIdth: 0.465,
  loadingIndicatorColor: '#3e5902',
  ipAdress: cIp,
  deviceId: cDid,
};
