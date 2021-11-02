import SyncStorage from 'sync-storage';
import {I18nManager} from 'react-native';
import * as global from '../../common/GlobalLanguageJson';
import theme from '../../common/Theme.style';

const initialState = {
  languageJson2:
    SyncStorage.get('languageCode') === 'en'
      ? global.a2
      : SyncStorage.get('languageCode') === 'ar'
      ? global.a1
      : null,
  languageJson: '',
  url: theme.url.startsWith('https')
    ? theme.url
    : theme.url.replace('http', 'https'),
  bannersUrl: `${
    theme.url.startsWith('https')
      ? theme.url
      : theme.url.replace('http', 'https')
  }/api/reactappsettings/react_get_all_banners/?insecure=cool`,
  showLoginForm: '',
  enablePhoneLogin: '',
  phoneAuthWithFirebase: '',
  consumerKey: theme.consumerKey, // Your consumer secret
  consumerSecret: theme.consumerSecret, // Your consumer secret
  showIntroPage: 1, // show/hide intro page value 1 for show, 0 for hide
  appInProduction: false, /// ///////////////////////////////////////////////////////////////////// in production
  languageCode: SyncStorage.get('languageCode'), // default language of app
  languageDirection: 'ltr', // default direction of app
  appDirection: 'ltr', // application direction
  currency: SyncStorage.get('currency'),
  productsArguments: Object.create({
    lang: I18nManager.isRTL ? 'ar' : 'en',
    currency:
      SyncStorage.get('currencyCode') === undefined
        ? theme.defaultCurrencyCode
        : SyncStorage.get('currencyCode'),
  }), // additional product arguments for query

  langId:
    SyncStorage.get('langId') === undefined ? 1 : SyncStorage.get('langId'),
  loader: 'dots',
  newProductDuration: 20,
  cartButton: true, // 1 : show and 0 : hide
  card_style: 1,
  banner_style: 1,
  currencyPos: SyncStorage.get('currencyPos'),
  address: '',
  fbId: '',
  email: '',
  latitude: '',
  longitude: '',
  phoneNo: '',
  notifText: '',
  notifTitle: '',
  notifDuration: '',
  footerShowHide: '',
  homePage: 1,
  categoryPage: 1,
  siteUrl: '',
  appName: '',
  packgeName: 1,
  introPage: 1,
  myOrdersPage: 1,
  newsPage: 1,
  wishListPage: 1,
  shippingAddressPage: 1,
  aboutUsPage: 1,
  contactUsPage: 1,
  editProfilePage: 1,
  settingPage: 1,
  rateApp: 1,
  shareApp: 1,
  fbButton: 1,
  googleButton: 1,
  notificationType: '',
  privacyPolicy: '',
  termServices: '',
  aboutUs: '',
  refundPolicy: '',
  filterMaxPrice: 1000,
  guestCheckOut: true,
  checkOutPage: 1,
  defaultIcons: false,
  orderCancelButton: false,
  addressPage: true,
  downloadPage: true,
  cancelOrderTime: 0,
  showVendorInfo: false, // for dokan plugin
  showWcVendorInfo: false,
  multiLanguage: false,
  multiCurrency: false,
  appSettings: {},
  enableGeoFencing: false,
  enableDeliveryTracking: false,
  enableWpPointReward: false,
  trackingUrl: '',
  currentSettings: 1,
  about_page_id: 286,
  privacy_page_id: 286,
  refund_page_id: 286,
  terms_page_id: 286,
  vendorEnable: '0',
  orderDetails: {
    guest_status: 1,
    email: '',
    tax_zone_id: '',
    delivery_firstname: '',
    delivery_lastname: '',
    delivery_state: '',
    delivery_city: '',
    delivery_postcode: '',
    delivery_zone: '',
    delivery_country: '',
    delivery_country_id: '',
    delivery_street_address: '',
    delivery_country_code: '',
    delivery_phone: '',

    billing_firstname: '',
    billing_lastname: '',
    billing_state: '',
    billing_city: '',
    billing_postcode: '',
    billing_zone: '',
    billing_country: '',
    billing_country_id: '',
    billing_street_address: '',
    billing_country_code: '',
    billing_phone: '',
    total_tax: '',
    shipping_cost: '',
    shipping_method: '',
    payment_method: '',
    comments: '',
  },
};

firstSetting = (state) => {
  // 1
  SyncStorage.set('tempdata', {});
  SyncStorage.set('orderDetails', state.orderDetails);
  if (SyncStorage.get('languageCode') === undefined) {
    if (I18nManager.isRTL) {
      SyncStorage.set('currencyPos', 'right');
      SyncStorage.set('languageDirection', 'rtl');
    } else {
      SyncStorage.set('currencyPos', 'right');
      SyncStorage.set('languageDirection', 'ltr');
    }
    SyncStorage.set(
      'languageCode',
      I18nManager.isRTL ? theme.rtllanguageCode : theme.ltrlanguageCode,
    );
    SyncStorage.set('currency', theme.defaultCurrencySymbol);
    SyncStorage.set('currencyCode', theme.defaultCurrencyCode);
    SyncStorage.set('decimals', theme.priceDecimals);
    SyncStorage.set('defaultIcons', false);
    SyncStorage.set('cartProducts', null);
    SyncStorage.set('bottom', theme.bottomNavigation);
    SyncStorage.set('backgroundColor', theme.backgroundColor);
    SyncStorage.set('textColor', theme.textColor);
    SyncStorage.set('textContrast', theme.textContrast);
    SyncStorage.set('langId', I18nManager.isRTL ? '0' : '1');
  }
};

siteSetting = (state) => {
  state.appSettings = JSON.parse(SyncStorage.get('appSettings'));
  this.defaultSettings(state);
};

storeData = (state) => {
  SyncStorage.set('appSettings', state);
};
defaultSettings = (state) => {
  state.fbId = state.appSettings.facebook_app_id;
  state.newProductDuration = state.appSettings.new_product_duration;
  state.notifText = state.appSettings.notification_text;
  state.notifTitle = state.appSettings.notification_title;
  state.notifDuration = state.appSettings.notification_duration;
  state.googleButton = parseInt(state.appSettings.google_login);
  state.notificationType = state.appSettings.default_notification;
  state.homePage = parseInt(state.appSettings.home_style);
  state.categoryPage = parseInt(state.appSettings.category_style);
  state.introPage = parseInt(state.appSettings.intro_page);
  state.myOrdersPage = parseInt(state.appSettings.my_orders_page);
  state.packgeName = state.appSettings.package_name;
  state.latitude = parseFloat(state.appSettings.latitude);
  state.longitude = parseFloat(state.appSettings.longitude);
  state.newsPage = parseInt(state.appSettings.news_page);
  state.wishListPage = parseInt(state.appSettings.wish_list_page);
  state.shippingAddressPage = parseInt(state.appSettings.shipping_address_page);
  state.aboutUsPage = parseInt(state.appSettings.about_us_page);
  state.contactUsPage = parseInt(state.appSettings.contact_us_page);
  state.editProfilePage = parseInt(state.appSettings.edit_profile_page);
  state.fbButton = parseInt(state.appSettings.facebook_login);
  state.orderCancelButton = state.appSettings.cancel_order_button === '1';
  state.address = `${state.appSettings.address}, ${state.appSettings.city}, ${state.appSettings.state} ${state.appSettings.zip}, ${state.appSettings.country}`;
  state.trackingUrl = state.appSettings.tracking_url;
  state.email = state.appSettings.order_email;
  state.phoneNo = state.appSettings.phone_no;
  state.cancelOrderTime = parseInt(state.appSettings.cancel_order_hours);
  state.about_page_id = parseInt(state.appSettings.about_page_id);
  state.privacy_page_id = parseInt(state.appSettings.privacy_page_id);
  state.refund_page_id = parseInt(state.appSettings.refund_page_id);
  state.terms_page_id = parseInt(state.appSettings.terms_page_id);
  state.settingPage = parseInt(state.appSettings.setting_page);
  state.cartButton = parseInt(state.appSettings.card_style) === 1;
  state.cartButton = parseInt(state.appSettings.cart_button) === 1;
  state.showLoginForm = true;
  state.enablePhoneLogin = state.appSettings.phone_login === '1';
  state.phoneAuthWithFirebase =
    state.appSettings.phone_verificatio_type === 'firebase';
  state.card_style = parseInt(state.appSettings.card_style);
  state.banner_style = parseInt(state.appSettings.banner_style);
  state.footerShowHide = parseInt(state.appSettings.footer_button);
  state.addressPage = state.appSettings.bill_ship_info == '1';
  state.downloadPage = state.appSettings.downloads == '1';
  state.multiLanguage = state.appSettings.wpml_enabled === '1';
  state.siteUrl = state.appSettings.external_website_link;
  state.checkOutPage = parseInt(state.appSettings.one_page_checkout);
  state.multiCurrency = state.appSettings.wp_multi_currency === '1';
  state.showVendorInfo = state.appSettings.mvf_enabled == '1';
  state.showVendorInfo = state.appSettings.mvf_enabled == '1';
  state.showWcVendorInfo = state.appSettings.mvf_enabled == '2';
  state.vendorEnable = state.appSettings.mvf_enabled;
  state.enableGeoFencing = state.appSettings.geo_fencing == '1';
  state.enableDeliveryTracking = state.appSettings.delivery_tracking == '1';
  state.enableWpPointReward = state.appSettings.wp_point_reward == '1';
  state.rateApp = state.appSettings.rate_app;
  state.inventory = state.appSettings.Inventory;
  state.shareApp = state.appSettings.share_app;
  state.defaultIcons = state.appSettings.app_icon_image === 'icon'; /// //////////////////////////////////////////
  SyncStorage.set('defaultIcons', state.appSettings.app_icon_image === 'icon');
  state.currentSettings = state.appSettings.update_order;
};

saveDefaultCurrency = () => {
  if (SyncStorage.get('appStartFirstTime') === undefined) {
    SyncStorage.set('currencyDefault', SyncStorage.get('currency'));
    SyncStorage.set('currencyCodeDefault', SyncStorage.get('currencyCode'));
    SyncStorage.set('currencyPosDefault', SyncStorage.get('currencyPos'));
    SyncStorage.set('defaultIcons', false);
    SyncStorage.set('appStartFirstTime', 'started');
    SyncStorage.set('customerData', '');
    SyncStorage.set('languageJson', '');
    SyncStorage.set('gustLogin', false);
  }
};

const Config = (state = initialState, action) => {
  switch (action.type) {
    case 'languageSettings':
      state.languageJson = action.payload;
      SyncStorage.set('languageJson', action.payload);
      return {
        ...state,
      };
    case 'bannerChange':
      state.banner_style = action.payload;
      return {
        ...state,
      };
    case 'HOME_CHANGE':
      state.homePage = action.payload;
      return {
        ...state,
      };
    case 'Category_CHANGE':
      state.categoryPage = action.payload;
      return {
        ...state,
      };
    case 'CARD_CHNAGE':
      state.card_style = action.payload;
      return {
        ...state,
      };
    case 'languageJson2':
      state.languageJson2 =
        SyncStorage.get('languageCode') === 'en'
          ? global.a2
          : SyncStorage.get('languageCode') === 'ar'
          ? global.a1
          : null;
      return {
        ...state,
      };
    case 'siteSetting':
      if (SyncStorage.get('languageJson') !== []) {
        state.languageJson = SyncStorage.get('languageJson');
      }
      this.siteSetting(state);
      return {
        ...state,
      };
    case 'siteSetting2':
      state.appSettings = action.payload;
      this.storeData(JSON.stringify(action.payload));
      this.defaultSettings(state);
      return {
        ...state,
      };
    case 'saveDefaultCurrency':
      this.firstSetting(state);
      this.saveDefaultCurrency(state);
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default Config;
