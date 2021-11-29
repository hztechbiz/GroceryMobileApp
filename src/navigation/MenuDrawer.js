import React, {PureComponent} from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  View,
  Text,
  UIManager,
  TouchableOpacity,
  Platform,
  Dimensions,
  StatusBar,
  ImageBackground,
  FlatList,
  I18nManager,
} from 'react-native';
import {ListItem, Icon} from 'native-base';
import theme from '../common/Theme.style.js';
import RateUsButton from '../screens/RateUs';
import ShareAppButton from '../screens/ShareApp';
import ExpandableListView from './ExpandableListView';
import {connect} from 'react-redux';
import SyncStorage from 'sync-storage';
import ImageLoad from '../common/RnImagePlaceH';
const pageNumbers = [1];
const WIDTH = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
const DrawerWidth2 = WIDTH * 0.78;

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <StatusBar backgroundColor={backgroundColor} {...props} />
  </View>
);
class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {AccordionData: [], orientation: ''};
  }

  getOrientation = () => {
    if (Dimensions.get('window').width < Dimensions.get('window').height) {
      this.setState({orientation: 'portrait'});
    } else {
      this.setState({orientation: 'landscape'});
    }
  };

  componentDidMount() {
    // console.log(this.props.isLoading.Config, 'props');
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    let array = [];
    // array = [
    //   {
    //     expanded: false,
    //     categoryName: {
    //       id: 3,
    //       name: 'SHOP',
    //       iconName: 'cart',
    //       // jsonName: this.props.isLoading.Config.languageJson.Shop,
    //       jsonName: 'Shop',
    //       imageName: require('../images/LeftMenuIcon/shop.png'),
    //       imageShow: !this.props.isLoading.Config.defaultIcons,
    //       subCategory: [
    //         {
    //           id: 7,
    //           // jsonName: this.props.isLoading.Config.languageJson.Newest,
    //           jsonName: 'Newest',

    //           name: 'NEWEST',
    //           iconName: 'open',
    //           imageName: require('../images/LeftMenuIcon/minus.png'),
    //         },
    //         // {
    //         //   id: 8,
    //         //   jsonName: this.props.isLoading.Config.languageJson.Deals,
    //         //   name: 'DEALS',
    //         //   iconName: 'shirt',
    //         //   imageName: require('../images/LeftMenuIcon/minus.png'),
    //         // }, // open arrow-dropup-circle
    //         {
    //           id: 9,
    //           // jsonName: this.props.isLoading.Config.languageJson['Top Seller'],
    //           jsonName: 'Top Seller',
    //           name: 'TOPSELLER',
    //           iconName: 'star',
    //           imageName: require('../images/LeftMenuIcon/minus.png'),
    //         }, // open arrow-dropup-circle
    //         {
    //           id: 10,
    //           // jsonName: this.props.isLoading.Config.languageJson['Most Liked'],
    //           jsonName: 'Most Liked',
    //           name: 'MOSTLIKED',
    //           iconName: 'star',
    //           imageName: require('../images/LeftMenuIcon/minus.png'),
    //         },
    //       ],
    //     },
    //   },
    // ];
    this.setState({AccordionData: [...array]});
    this.getOrientation();
    Dimensions.addEventListener('change', this.getOrientation);
  }

  componentWillUnmount() {
    this.orientation = null;
    this.AccordionData = null;
    Dimensions.removeEventListener('change', this.getOrientation);
  }

  updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...this.state.AccordionData];
    array[index].expanded = !array[index].expanded;
    this.setState(() => ({
      AccordionData: array,
    }));
  };

  navCatFun = (item) => {
    console.log(item, 'test');
    const string = item;
    const newString = string.replace(/\s+/g, ''); // "thiscontainsspaces"
    this.props.navigation.navigate(newString);
  };

  categoryFun(text, iconName, tempNo, imageTemp, globalText) {
    return (
      <ListItem noIndent={true}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={
            tempNo === 0
              ? this.navCatFun.bind(this, text)
              : this.navCatFun.bind(this, `${text} ${tempNo}`)
          }>
          <View
            style={{
              width: WIDTH * 0.4,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            {!this.props.isLoading.Config.defaultIcons ? (
              <ImageLoad
                key={0}
                style={{
                  width: 22,
                  height: 22,
                  marginRight: I18nManager.isRTL ? 8 : 4,
                  marginLeft: 0,
                }}
                loadingStyle={{size: 'large', color: theme.primary}}
                placeholder={false}
                ActivityIndicator={true}
                placeholderStyle={{width: 0, height: 0}}
                source={imageTemp}
              />
            ) : (
              <Icon
                name={iconName}
                size={20}
                style={{
                  color: theme.textColor,
                  fontSize: 19,
                  padding: 1,
                  paddingLeft: 4,
                  paddingRight: I18nManager.isRTL
                    ? Platform.OS === 'ios'
                      ? 10
                      : 3
                    : 0,
                }}
              />
            )}
            <Text
              style={{
                textAlign: 'left',
                color: theme.textColor,
                fontSize: theme.mediumSize,
                marginLeft: I18nManager.isRTL
                  ? Platform.OS === 'ios'
                    ? 0
                    : 7
                  : 9,
              }}>
              {globalText}
            </Text>
          </View>
        </TouchableOpacity>
      </ListItem>
    );
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: theme.backgroundColor,
        }}>
        <MyStatusBar
          backgroundColor={theme.StatusBarColor}
          barStyle={theme.barStyle}
        />
        {/* <View
          style={{
            height: Platform.OS === 'ios' ? Height * 0.067 : 56,
            backgroundColor: theme.primary,
            borderWidth: Platform.OS === 'ios' ? 0.3 : 0,
          }}> */}
        {/* <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 5,
              paddingTop: 4,
            }}>
            <View style={{justifyContent: 'flex-start'}}>
              <Text style={styles.headerText}>
                {this.props.isLoading.Config.languageJson.Menu}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              {!this.props.isLoading.Config.multiLanguage ? (
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Language')}>
                  <View
                    style={{
                      borderColor: theme.primaryContrast,
                      alignItems: 'center',
                    }}>
                    <View
                      style={[
                        {
                          padding: 5,
                          paddingRight: 2,
                          paddingBottom: Platform.OS === 'android' ? 15 : 3,
                        },
                        Platform.OS === 'android' ? styles.iconContainer : null,
                      ]}>
                      <Icon style={styles.headerIcon} name="globe" />
                    </View>
                  </View>
                </TouchableOpacity>
              ) : null}
              {!this.props.isLoading.Config.multiCurrency ? (
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Currency')}>
                  <View
                    style={{
                      borderColor: theme.primaryContrast,
                      alignItems: 'center',
                    }}>
                    <View
                      style={[
                        {
                          padding: 5,
                          paddingLeft: Platform.OS === 'ios' ? 15 : 5,
                          paddingBottom: Platform.OS === 'android' ? 15 : 3,
                        },
                        Platform.OS === 'android' ? styles.iconContainer : null,
                      ]}>
                      <Icon style={styles.headerIcon} name="logo-usd" />
                    </View>
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
          </View> */}
        {/* </View> */}

        <TouchableOpacity
          onPress={() => {
            SyncStorage.set('cartScreen', 0);
            if (
              SyncStorage.get('customerData') !== '' &&
              !SyncStorage.get('gustLogin')
            ) {
              this.props.navigation.navigate('SETTINGS');
            } else {
              SyncStorage.set('drawerLogin', true);
              this.props.navigation.navigate('LOGIN');
            }
          }}>
          <ImageBackground
            style={{
              height: Platform.OS === 'ios' ? 95 : 97,

              width: DrawerWidth2,
              backgroundColor: 'transparent',
            }}
            source={require('../images/icons_stripe.png')}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                height: Platform.OS === 'ios' ? 95 : 97,
                width: DrawerWidth2,
                alignContent: 'center',
                opacity: 0.85,
                backgroundColor: theme.primaryDark,
                zIndex: 9,
                position: 'absolute',
              }}
            />
            <View style={styles.textImageContainer}>
              {SyncStorage.get('gustLogin') ||
              SyncStorage.get('customerData') === '' ||
              SyncStorage.get('customerData').avatar === undefined ||
              SyncStorage.get('customerData').avatar === null ? (
                <ImageLoad
                  key={0}
                  backgroundColor="transparent"
                  color="transparent"
                  style={{width: 55, height: 55}}
                  loadingStyle={{size: 'large', color: theme.primary}}
                  placeholderSource={require('../images/userImage.png')}
                  placeholderStyle={{width: 55, height: 55}}
                  source={require('../images/userImage.png')}
                  borderRadius={55 / 2}
                />
              ) : (
                <ImageLoad
                  key={0}
                  style={{width: 55, height: 55}}
                  loadingStyle={{size: 'large', color: theme.primary}}
                  placeholderSource={require('../images/placeholder.png')}
                  placeholderStyle={{width: 55, height: 55}}
                  source={{
                    uri:
                      theme.image_url +
                      '/' +
                      SyncStorage.get('customerData').avatar,
                  }}
                  borderRadius={55 / 2}
                />
              )}
              <View style={{flex: 1, flexDirection: 'column', paddingLeft: 10}}>
                {SyncStorage.get('gustLogin') ||
                SyncStorage.get('customerData') === '' ? (
                  <View style={{alignItems: 'flex-start'}}>
                    <Text
                      style={{
                        fontSize: theme.mediumSize,
                        fontWeight: '600',
                        color: theme.primaryContrast,
                      }}>
                      {
                        this.props.isLoading?.Config?.languageJson[
                          'Login & Register'
                        ]
                      }{' '}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: theme.primaryContrast,
                        fontWeight: '400',
                      }}>
                      {
                        this.props.isLoading.Config.languageJson[
                          'Please login or create an account for free'
                        ]
                      }
                    </Text>
                  </View>
                ) : (
                  <View style={{alignItems: 'flex-start'}}>
                    <Text
                      style={{
                        fontSize: theme.mediumSize,
                        fontWeight: '600',
                        color: theme.primaryContrast,
                      }}>
                      {`${SyncStorage.get('customerData').first_name} ${
                        SyncStorage.get('customerData').last_name
                      }`}{' '}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: theme.primaryContrast,
                        fontWeight: '400',
                      }}>
                      {SyncStorage.get('customerData').email}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
          }}>
          <FlatList
            data={pageNumbers}
            showsVerticalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{backgroundColor: theme.backgroundColor}}
            keyExtractor={(pageNumber) => pageNumber.toString()}
            extraData={this.state}
            renderItem={() => (
              <View>
                {this.props.isLoading.Config.homePage
                  ? this.categoryFun(
                      'HOME',
                      'home',
                      this.props.isLoading.Config.homePage,
                      require('../images/LeftMenuIcon/home.png'),
                      this.props.isLoading.Config.languageJson.Home,
                    )
                  : null}
                {this.props.isLoading.Config.categoryPage
                  ? this.categoryFun(
                      'NEWEST',
                      'apps',
                      '',
                      require('../images/LeftMenuIcon/apps.png'),
                      this.props.isLoading.Config.languageJson.Categories,
                    )
                  : null}

                {this.state.AccordionData.map((item, key) => (
                  <ExpandableListView
                    key={item.categoryName.id}
                    onClickFunction={this.updateLayout.bind(this, key)}
                    item={item}
                    navigation={this.props.navigation}
                    count={key}
                  />
                ))}
                {/* ////////////////////////////////////////// */}
                {/* {this.props.isLoading.Config.wishListPage
                  ? this.categoryFun(
                      'MY FAVORITES',
                      'heart',
                      0,
                      require('../images/LeftMenuIcon/heart.png'),
                      this.props.isLoading.Config.languageJson['My Wish List'],
                    )
                  : null} */}
                {this.props.isLoading.Config.editProfilePage &&
                SyncStorage.get('customerData') !== '' &&
                !SyncStorage.get('gustLogin')
                  ? this.categoryFun(
                      'EDIT PROFILE',
                      'lock',
                      0,
                      require('../images/LeftMenuIcon/lock.png'),
                      this.props.isLoading.Config.languageJson['Edit Profile'],
                    )
                  : null}
                {SyncStorage.get('customerData') !== '' &&
                !SyncStorage.get('gustLogin')
                  ? this.categoryFun(
                      'ADDRESSES',
                      'locate',
                      0,
                      require('../images/LeftMenuIcon/locate.png'),
                      this.props.isLoading.Config.languageJson.Address,
                    )
                  : null}
                {this.props.isLoading.Config.myOrdersPage &&
                SyncStorage.get('customerData') !== '' &&
                !SyncStorage.get('gustLogin')
                  ? this.categoryFun(
                      'MY ORDERS',
                      'list-box',
                      0,
                      require('../images/LeftMenuIcon/list-box.png'),
                      this.props.isLoading.Config.languageJson['My Orders'],
                    )
                  : null}

                {this.props.isLoading.Config.contactUsPage
                  ? this.categoryFun(
                      'CONTACT US',
                      'contacts',
                      0,
                      require('../images/LeftMenuIcon/contacts.png'),
                      this.props.isLoading.Config.languageJson['Contact Us'],
                    )
                  : null}
                {/* {this.props.isLoading.Config.aboutUsPage
                  ? this.categoryFun(
                      'ABOUT',
                      'alert',
                      0,
                      require('../images/LeftMenuIcon/alert.png'),
                      this.props.isLoading.Config.languageJson['About Us'],
                    )
                  : null} */}

                {/* {this.props.isLoading.Config.newsPage
                  ? this.categoryFun(
                      'NEWS',
                      'paper',
                      0,
                      require('../images/LeftMenuIcon/paper.png'),
                      this.props.isLoading.Config.languageJson.News,
                    )
                  : null} */}
                {/* {this.props.isLoading.Config.introPage
                  ? this.categoryFun(
                      'INTRO',
                      'reorder',
                      0,
                      require('../images/LeftMenuIcon/reorder.png'),
                      this.props.isLoading.Config.languageJson.Intro,
                    )
                  : null} */}
                {/* {this.props.isLoading.Config.shareApp ? (
                  <ShareAppButton
                    packageName={this.props.isLoading.Config.packgeName}
                    value="menu"
                    fontSize={21}
                    defaultIcons={this.props.isLoading.Config.defaultIcons}
                    imageTemp={require('../images/LeftMenuIcon/share.png')}
                    text={this.props.isLoading.Config.languageJson.Share}
                    iconName={'share'}
                    style={{
                      fontSize: theme.smallSize,
                      paddingRight: 8,
                      paddingLeft: 8,
                    }}
                    appleId={this.props.isLoading.Config.packgeName}
                  />
                ) : null} */}
                {/* {this.props.isLoading.Config.rateApp ? (
                  <RateUsButton
                    value="menu"
                    imageTemp={require('../images/LeftMenuIcon/star.png')}
                    text={this.props.isLoading.Config.languageJson['Rate Us']}
                    iconName={'star'}
                    fontSize={21}
                    defaultIcons={this.props.isLoading.Config.defaultIcons}
                    appleId={this.props.isLoading.Config.packgeName}
                  />
                ) : null} */}
                {this.props.isLoading.Config.settingPage
                  ? this.categoryFun(
                      'SETTINGS',
                      'settings',
                      0,
                      require('../images/LeftMenuIcon/settings.png'),
                      this.props.isLoading.Config.languageJson.Settings,
                    )
                  : null}
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : 0;
const mapStateToProps = (state) => ({
  isLoading: state,
});

export default connect(mapStateToProps, null)(App);
const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  tabComponents: {
    flexDirection: 'row',
    alignContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    paddingLeft: 13,
  },
  textImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    height: Platform.OS === 'ios' ? 103 : 97,

    width: DrawerWidth2,
    zIndex: 9,
    position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    padding: 15,
  },
  headerText: {
    textAlign:
      Platform.OS === 'ios' ? 'left' : I18nManager.isRTL ? 'right' : 'left',
    color: theme.headerTintColor,
    fontSize: 21,
    padding: 10,
    paddingTop: Platform.OS === 'ios' ? 8 : 10,
    alignSelf: 'center',
  },
  headerIcon: {
    color: theme.headerIconsColor,
    paddingTop: Platform.OS === 'ios' ? 0 : 10,
    fontSize: 23,
  },
  iconContainer: {
    paddingLeft: 10,
    paddingTop: 10,
    marginRight: 5,
  },
});
