import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import {createSelector} from 'reselect';
import {Icon} from 'native-base';
import CardTem from './CardTemplate';
import WooComFetch from '../common/WooComFetch';
import {connect} from 'react-redux';
import Loader from 'react-native-easy-content-loader';
import themeStyle from './Theme.style';
const WIDTH = Dimensions.get('window').width;
class FlatListView extends Component {
  mounted = false;
  constructor(props) {
    super(props);
    this.state = {
      objectArray: [],
      isLoading: true,
      SpinnerTemp: false,
      recent: false,
      loading: false,
      timeValue: 400,
    };
  }

  /// //////
  static getDerivedStateFromProps(props) {
    if (props.dataName === 'RecentlyViewed') {
      return {
        isLoading: false,
        SpinnerTemp: false,
        recent: true,
        objectArray: props.recentViewedProducts,
      };
    }
    if (
      props.dataName === 'Newest' ||
      props.dataName === 'Flash' ||
      props.dataName === 'Deals' ||
      props.dataName === 'Featured' ||
      props.dataName === 'Vendors'
    ) {
      if (
        props.tabArray !== undefined &&
        props.tabArray !== null &&
        props.tabArray.toString() !== 'NaN'
      ) {
        return {
          objectArray: props.tabArray,
        };
      } else {
        return {
          objectArray: [],
        };
      }
    }
    return null;
  }

  /// //////////////////////////////////
  componentWillUnmount() {
    this.mounted = false;
    this.state.objectArray = [];
  }

  /// //////////////////////////////
  componentDidMount() {
    this.mounted = true;
    if (this.props.dataName === 'Flash' && this.props.tabArray !== undefined) {
      this.state.objectArray = this.props.tabArray;
      this.setState({});
    }
    if (this.props.dataName === 'Newest' && this.props.tabArray !== undefined) {
      this.state.objectArray = this.props.tabArray;
      this.setState({});
    }
    if (this.props.dataName === 'Deals' && this.props.tabArray !== undefined) {
      this.state.objectArray = this.props.tabArray;
      this.setState({});
    }
    if (
      this.props.dataName === 'Featured' &&
      this.props.tabArray !== undefined
    ) {
      this.state.objectArray = this.props.tabArray;
      this.setState({});
    }
    if (
      this.props.dataName === 'Vendors' &&
      this.props.tabArray !== undefined
    ) {
      this.state.objectArray = this.props.tabArray;
      this.setState({});
    }

    if (this.props.dataName === 'Releated') {
      this.setState({
        SpinnerTemp: true,
      });
      this.getReleated();
    }
    if (this.props.dataName === 'RecentlyViewed') {
      this.setState({
        SpinnerTemp: true,
      });
      this.getRecentlyViewed();
    }
  }

  getRecentlyViewed = () => {
    const json = this.props.recentViewedProducts;
    this.getRecentData(json, true, true);
  };

  getReleated = async () => {
    try {
      const json2 = await WooComFetch.getReleatedProducts(
        this.props.relatedIdsArray,
        this.props.productsArguments,
      );
      if (json2 !== undefined && json2 !== null && json2.toString() !== 'NaN') {
        this.newMethod2(json2, true, false);
      } else {
        this.newMethod2([], true, false);
      }
    } catch (err) {}
  };

  getData = (j, temp, re) => {
    this.state.objectArray = [];
    this.state.objectArray = j;
    if (this.mounted) {
      this.setState({
        isLoading: false,
        SpinnerTemp: false,
        recent: re,
        loading: false,
        timeValue: 400,
      });
    }
  };

  getRecentData = (j, temp, re) => {
    if (this.mounted) {
      this.setState({
        isLoading: false,
        SpinnerTemp: false,
        recent: re,
        objectArray: j,
      });
    }
  };

  newMethod2(j, temp, recent) {
    this.getData(j, temp, recent);
  }

  render() {
    let {loading, timeValue} = this.state;
    if (this.state.objectArray.length > 0 && loading === false) {
      loading = false;
      timeValue = 400;
    } else {
      loading = true;
      timeValue = 400;
    }

    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        windowSize={50}
        initialNumToRender={10}
        removeClippedSubviews={true}
        legacyImplementation={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={10}
        showsVerticalScrollIndicator={false}
        listKey={(item, index) => `C${index.toString()}`}
        scrollEnabled={!this.props.scrollEnabled}
        contentContainerStyle={{
          backgroundColor:
            this.props.card_style === 11 ||
            this.props.card_style === 12 ||
            this.props.card_style === 15
              ? // ? themeStyle.backgroundColor
                // : themeStyle.backgroundColor,
                '#f5fafe'
              : '#f5fafe',
          justifyContent: 'flex-start',
          alignSelf: 'flex-start',
          alignItems: 'flex-start',
          alignContent: 'flex-start',
          flexDirection: 'row',
          flexGrow: 1,
          // marginRight: 10,
          paddingHorizontal: 20,
          // marginHorizontal: 30,
          // marginRight: 30,
        }}
        data={
          this.state.objectArray.length === 0
            ? ['', '', '']
            : this.state.objectArray
        }
        tabLabel={this.props.tabLabel}
        horizontal={this.props.vertical}
        numColumns={this.props.noOfCol}
        style={{
          paddingLeft: !this.props.vertical
            ? WIDTH >= 375
              ? WIDTH * 0.009
              : WIDTH >= 360 && WIDTH <= 75
              ? WIDTH * 0.008
              : WIDTH * 0.007
            : 0,
        }}
        extraData={this.state}
        keyExtractor={(item, index) => index}
        ListFooterComponent={
          this.props.viewButton && this.props.dataName !== 'Flash' ? (
            <TouchableOpacity
              style={{
                paddingTop: 80,
                justifyContent: 'center',
                margin: 12,
                alignItems: 'center',
              }}
              onPress={() =>
                this.props.navigation.navigate('NewestScreen', {
                  id: this.props.parentId,
                  name: '',
                  sortOrder:
                    this.props.dataName === 'Newest'
                      ? 'top seller'
                      : this.props.dataName === 'Deals'
                      ? 'special'
                      : 'most liked',
                })
              }>
              <View
                style={{
                  alignItems: 'center',
                  height: 38,
                  width: 100,
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: themeStyle.primary,
                    fontSize: themeStyle.smallSize,
                  }}>
                  {this.props.language}
                </Text>
                <Icon
                  name={
                    !I18nManager.isRTL
                      ? 'md-arrow-dropright'
                      : 'md-arrow-dropleft'
                  }
                  style={{
                    color: themeStyle.primary,
                    fontSize: 22,
                    paddingTop: 2,
                    paddingLeft: !I18nManager.isRTL ? 8 : 8,
                    paddingRight: I18nManager.isRTL ? 8 : 8,
                  }}
                />
              </View>
            </TouchableOpacity>
          ) : null
        }
        renderItem={(item) => (
          <Loader
            secondaryColor="rgba(208, 205, 205, 1)"
            primaryColor="rgba(218, 215, 215, 1)"
            animationDuration={timeValue}
            active
            loading={loading}
            containerStyles={{
              backgroundColor: themeStyle.backgroundColor,
              height:
                this.props.card_style === 12
                  ? themeStyle.singleRowCardWidth + 34
                  : this.props.card_style === 10 ||
                    this.props.card_style === 13 ||
                    this.props.card_style === 14 ||
                    this.props.card_style === 16 ||
                    this.props.card_style === 19 ||
                    this.props.card_style === 21 ||
                    this.props.card_style === 7
                  ? themeStyle.singleRowCardWidth + 43
                  : this.props.card_style === 4 ||
                    this.props.card_style === 9 ||
                    this.props.card_style === 5
                  ? themeStyle.singleRowCardWidth + 48
                  : this.props.cartButton ||
                    this.props.card_style === 3 ||
                    this.props.card_style === 8 ||
                    this.props.card_style === 15 ||
                    this.props.card_style === 17 ||
                    this.props.card_style === 18 ||
                    this.props.card_style === 22
                  ? themeStyle.singleRowCardWidth + 65
                  : this.props.card_style === 20
                  ? themeStyle.singleRowCardWidth + 48
                  : themeStyle.singleRowCardWidth + 37,
              width: this.props.vertical
                ? themeStyle.singleRowCardWidth
                : WIDTH * themeStyle.twoRowCardWIdth,
              shadowOffset: {width: 1, height: 1},
              shadowColor: themeStyle.textColor,
              shadowOpacity: 0.5,
              elevation: 3,
              margin: 5,
            }}
            pRows={
              this.props.cartButton ||
              this.props.card_style === 3 ||
              this.props.card_style === 8 ||
              this.props.card_style === 15 ||
              this.props.card_style === 17 ||
              this.props.card_style === 18 ||
              this.props.card_style === 20 ||
              this.props.card_style === 22
                ? 3
                : 2
            }
            pWidth={['100%', '100%', '80%']}
            pHeight={30}
            titleStyles={{
              height: 100,
              width: this.props.vertical
                ? themeStyle.singleRowCardWidth
                : WIDTH * themeStyle.twoRowCardWIdth,
              alignSelf: 'center',
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 0,
              borderWidth: 0,
              flex: 1,
            }}
            paragraphStyles={{
              paddingTop: 6,
              padding: 6,
              flex: 1,
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <CardTem
              objectArray={this.state.objectArray[item.index]}
              index={item.index}
              dataName={this.props.dataName}
              rows={this.props.vertical}
              recent={this.state.recent}
              width={
                this.props.vertical
                  ? this.props.width
                  : WIDTH * themeStyle.twoRowCardWIdth
              }
            />
          </Loader>
        )}
      />
    );
  }
}
const getLanguage = (state) => state.Config.languageJson['Shop More'];
const getCartButton = (state) => state.Config.cartButton;
const getRecent = (state) =>
  JSON.parse(JSON.stringify(state.cartItems.recentViewedProducts));
const getCardStyle = (state) => state.Config.card_style;
const getProductsArguments = (state) => state.Config.productsArguments;
const getWishListProducts = (state) =>
  JSON.parse(JSON.stringify(state.cartItems.wishListProducts));
const getLanguageFun = createSelector([getLanguage], (getLanguage) => {
  return getLanguage;
});
const getCartButtonProducts = createSelector(
  [getCartButton],
  (getCartButton) => {
    return getCartButton;
  },
);
const getWishListProductsFun = createSelector(
  [getWishListProducts],
  (getWishListProducts) => {
    return getWishListProducts;
  },
);
const getRecentProducts = createSelector([getRecent], (getRecent) => {
  return getRecent;
});
const getProductsArgumentsFun = createSelector(
  [getProductsArguments],
  (getProductsArguments) => {
    return getProductsArguments;
  },
);
const getCardStyleFun = createSelector([getCardStyle], (getCardStyle) => {
  return getCardStyle;
});

const mapStateToProps = (state) => {
  return {
    recentViewedProducts: getRecentProducts(state),
    productsArguments: getProductsArgumentsFun(state),
    card_style: getCardStyleFun(state),
    cartButton: getCartButtonProducts(state),
    language: getLanguageFun(state),
    wishListProducts: getWishListProductsFun(state),
  };
};

export default connect(mapStateToProps, null)(FlatListView);
