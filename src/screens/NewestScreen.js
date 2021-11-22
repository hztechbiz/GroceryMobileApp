import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  I18nManager,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';
import {CardStyleInterpolators} from 'react-navigation-stack';
import {withNavigation} from 'react-navigation';
import {ActionSheet, Picker, Icon} from 'native-base';
import Font_Awesome from 'react-native-vector-icons/FontAwesome';
import Font_Awesome_2 from 'react-native-vector-icons/FontAwesome5';

import {connect} from 'react-redux';
import WooComFetch, {getUrl} from '../common/WooComFetch';
import FlatListViewShop from '../common/FlatListViewShop';
import SyncStorage from 'sync-storage';
import themeStyle from '../common/Theme.style';
import Spinner from 'react-native-loading-spinner-overlay';
import {createSelector} from 'reselect';
const CANCEL_INDEX = 9;
const WIDTH = Dimensions.get('window').width;
class Newest extends PureComponent {
  static navigationOptions = (props) => {
    const headerStyle = props.navigation.getParam('headerTitle');
    return {
      headerTitle: headerStyle,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerStyle: {
        backgroundColor: themeStyle.primary,
      },
      headerTitleAlign: 'left',
      headerForceInset: {top: 'never', vertical: 'never'},
      headerTintColor: themeStyle.headerTintColor,
      gesturesEnabled: false,
      headerTitleStyle: {
        fontWeight: Platform.OS === 'android' ? 'bold' : 'normal',
      },
      gesturesDirection: 'inverted',
      headerLeft: (
        <Icon
          onPress={() => props.navigation.pop()}
          name={!I18nManager.isRTL ? 'arrow-back' : 'arrow-forward'}
          style={{
            color: themeStyle.primaryContrast,
            fontSize: 25,
            padding: 5,
            paddingLeft: 16,
            paddingRight: 16,
            marginRight: 16,
          }}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      queryAttributes: '',
      attributes: [],
      tempAttributes: [],
      selectedAttributes: [],
      scrollTopButton: false,
      activityIndicatorTemp: true,
      idArray: [],
      products: [],
      SpinnerTemp: false,
      indexTemp: 'newest',
      tempmYarray: [0, 500],
      tempmYarray2: [0, 500],
      sortArray: [
        this.props.language.Newest,
        this.props.language['A - Z'],
        this.props.language['Z - A'],
        this.props.language['Price : high - low'],
        this.props.language['Price : low - high'],
        this.props.language['Top Seller'],
        this.props.language['Special Products'],
        this.props.language['Most Liked'],
        this.props.language.Cancel,
      ],
      selectedTab:
        this.props.navigation.dangerouslyGetParent() !== undefined
          ? this.props.navigation.dangerouslyGetParent() !== null &&
            this.props.navigation.dangerouslyGetParent() !== undefined
            ? this.props.navigation.dangerouslyGetParent().state.params.id
            : ''
          : '',
      categoryId:
        this.props.navigation.dangerouslyGetParent() !== undefined
          ? this.props.navigation.dangerouslyGetParent() !== null &&
            this.props.navigation.dangerouslyGetParent() !== undefined
            ? this.props.navigation.dangerouslyGetParent().state.params.id
            : ''
          : '',
      categoryName:
        this.props.navigation.dangerouslyGetParent() !== undefined
          ? this.props.navigation.dangerouslyGetParent() !== null &&
            this.props.navigation.dangerouslyGetParent() !== undefined
            ? this.props.navigation.dangerouslyGetParent().state.params.name
            : ''
          : '',
      sortOrder:
        this.props.navigation.dangerouslyGetParent() !== undefined
          ? this.props.navigation.dangerouslyGetParent() !== null &&
            this.props.navigation.dangerouslyGetParent() !== undefined
            ? this.props.navigation.dangerouslyGetParent().state.params
                .sortOrder
            : 'newest'
          : 'newest',
      page: 0,
      applyFilter: false,
      tempApply: false,
      filters: [],
      selectedFilters: [],
      maxAmount: 500,
      minAmount: 0,
      price: {lower: 0, upper: 500},
      priceData: {lower: 0, upper: 500},
      side: 'right',
      productView: 'grid',
      on_sale: '',
      featured: '',
      filterOnSale: false,
      filterFeatured: false,
      loadingServerData: true,
      type:
        this.props.navigation.dangerouslyGetParent() !== undefined
          ? this.props.navigation.dangerouslyGetParent() !== null &&
            this.props.navigation.dangerouslyGetParent() !== undefined
            ? this.props.navigation.dangerouslyGetParent().state.params
                .sortOrder
            : ''
          : '',
      listOfFilteredIdsFromCustom: [],
      wrapperCondition: false,
      wrapperConditionDrawer: false,
      saleTemp: true,
      featuredTemp: true,
      radioButton: [],
      emptyBox: [],
      selected: 'key0',
      modalVisible: false,
      tempBox: [],
    };
  }

  componentDidMount() {
    this.child = '';
    this.props.navigation.setParams({
      minAmount: 0,
      maxAmount: 500,
      tempmYarray: [0, 500],
      tempmYarray2: [0, 500],
      applyFilter2: this.state.applyFilter,
      singaleRow2: (p, n) => this.singaleRow2(p, n),
      onChangeRange: (obj) => this.onChangeRange(obj),
      resetFilters: () => this.resetFilters(),
      applyFilters: () => this.applyFilters(),
    });

    if (this.props.navigation.dangerouslyGetParent() !== undefined) {
      if (
        this.props.navigation.dangerouslyGetParent() !== null &&
        this.props.navigation.dangerouslyGetParent() !== undefined
      ) {
        if (
          this.props.navigation.dangerouslyGetParent().state.params.sortOrder ==
          'newest'
        ) {
          this.state.selected = 'key0';
        } else if (
          this.props.navigation.dangerouslyGetParent().state.params.sortOrder ==
          'special'
        ) {
          this.state.selected = 'key6';
        } else if (
          this.props.navigation.dangerouslyGetParent().state.params.sortOrder ==
          'top seller'
        ) {
          this.state.selected = 'key5';
        } else if (
          this.props.navigation.dangerouslyGetParent().state.params.sortOrder ==
          'most liked'
        ) {
          this.state.selected = 'key7';
        }
      }
    }
    this.state.indexTemp = this.state.sortOrder =
      this.props.navigation.dangerouslyGetParent() !== undefined
        ? this.props.navigation.dangerouslyGetParent() !== null &&
          this.props.navigation.dangerouslyGetParent() !== undefined
          ? this.props.navigation.dangerouslyGetParent().state.params.sortOrder
          : 'newest'
        : 'newest';
    this.setState({activityIndicatorTemp: false});
    this.props.navigation.setParams({
      headerTitle: this.props.language.Shop,
    });
    this.getProducts();
    this.getFilters(this.state.categoryId);
  }

  applyFilters() {
    this.state.applyFilter = true;
    this.state.page = 0;
    this.props.navigation.closeDrawer();
    this.setState({products: []}, () => {
      this.getProducts();
    });
  }

  resetFilters() {
    this.state.price.lower = 0;
    this.setState(
      {
        SpinnerTemp: true,
        tempApply: false,
        filterFeatured: false,
        filters: [],
        idArray: [],
        price: this.state.price,
        selectedFilters: [],
        applyFilter: false,
        products: [],
        page: 0,
      },
      () => {
        this.getProducts();
        this.getFilters(this.state.selectedTab);
      },
    );
  }

  removeFilters() {
    this.state.price.lower = 0;
    this.setState(
      {
        applyFilter: false,
        tempApply: false,
        products: [],
        page: 0,
        sortOrder: 'newest',
        selected: 'key0',
        indexTemp: 'newest',
      },
      () => {
        this.getProducts();
        this.getFilters(this.state.selectedTab);
      },
    );
  }

  getFilters = async (id) => {
    var dat = {};
    dat.categories_id = id;
    dat.language_id =
      SyncStorage.get('langId') === undefined ? 1 : SyncStorage.get('langId');
    dat.currency_code = this.props.currency;
    const data = await WooComFetch.postHttp(
      getUrl() + '/api/' + 'getfilters',
      dat,
    );
    if (data.success == 1) this.state.filters = data.data.filters;
    this.state.filters.map((item) => {
      item.values.map((item) => {
        this.state.idArray[item.value_id] = false;
      });
    });
    if (data.data.maxPrice === '' || data.data.maxPrice === undefined) {
      this.state.price.upper = 500;
    } else this.state.price.upper = data.data.maxPrice;
    this.state.tempmYarray[0] = this.state.price.lower;
    this.state.tempmYarray[1] = this.state.price.upper;
    this.state.tempmYarray2[0] = this.state.price.lower;
    this.state.tempmYarray2[1] = this.state.price.upper;
    this.props.navigation.setParams({
      minAmount: this.state.price.lower,
      maxAmount: this.state.price.upper,
      tempmYarray: this.state.tempmYarray,
      tempmYarray2: this.state.tempmYarray2,
      attributes: this.state.filters,
      applyFilter2: this.state.applyFilter,
    });
    this.setState({
      price: this.state.price,
      filters: this.state.filters,
      minAmount: this.state.price.lower,
      maxAmount: data.data.maxPrice,
      SpinnerTemp: false,
    });
  };

  getProducts = async () => {
    var dat = {};
    if (SyncStorage.get('customerData') != null) {
      dat.customers_id = SyncStorage.get('customerData').customers_id;
    }
    if (this.state.applyFilter == true) {
      dat.filters = this.state.selectedFilters;
      dat.price = {
        minPrice: this.state.price.lower,
        maxPrice: this.state.price.upper,
      };
    }
    dat.categories_id = this.state.selectedTab;
    dat.page_number = this.state.page;
    dat.type = this.state.sortOrder;
    dat.language_id =
      SyncStorage.get('langId') === undefined ? 1 : SyncStorage.get('langId');
    dat.currency_code = this.props.currency;
    const data = await WooComFetch.postHttp(
      getUrl() + '/api/' + 'getallproducts',
      dat,
    );
    if (this.state.page == 0) {
      this.state.products = [];
    }
    if (data.success == 1) {
      this.state.page++;
      var prod = data.data.product_data;
      for (const value of prod) {
        this.state.products.push(value);
      }
    }
    this.state.tempmYarray[0] = this.state.price.lower;
    this.state.tempmYarray[1] = this.state.price.upper;
    this.state.tempmYarray2[0] = this.state.price.lower;
    this.state.tempmYarray2[1] = this.state.price.upper;
    this.props.navigation.setParams({
      tempmYarray: this.state.tempmYarray,
      tempmYarray2: this.state.tempmYarray2,
      attributes: this.state.filters,
      applyFilter2: this.state.applyFilter,
    });

    if (data.success == 0) {
      this.setState({tempApply: true, SpinnerTemp: false});
    }
    if (data.success == 1) {
      if (this.state.products.length > 0) {
        this.setState({tempApply: false, SpinnerTemp: false});
      } else this.setState({tempApply: true, SpinnerTemp: false});
    }
  };

  // changing tab
  changeTab(c) {
    this.state.applyFilter = false;
    this.state.page = 0;
    if (c == '') this.state.selectedTab = c;
    else this.state.selectedTab = c.id;
    this.getProducts();
    this.getFilters(this.state.selectedTab);
  }

  onValueChange(value) {
    if (value === 'key0') {
      this.getSortProducts('Newest');
    } else if (value === 'key1') {
      this.getSortProducts('A - Z');
    } else if (value === 'key2') {
      this.getSortProducts('Z - A');
    } else if (value === 'key3') {
      this.getSortProducts('high to low');
    } else if (value === 'key4') {
      this.getSortProducts('low to high');
    } else if (value === 'key5') {
      this.getSortProducts('Top Seller');
    } else if (value === 'key6') {
      this.getSortProducts('Special Products');
    } else if (value === 'key7') {
      this.getSortProducts('Most Liked');
    }
    this.setState({
      selected: value,
      applyFilter: true,
    });
  }

  onChangeRange(obj) {
    this.setState({
      price: obj,
      tempApply: false,
    });
  }

  getSortProducts(value) {
    this.state.indexTemp = value;
    if (value == 'Newest') value = 'newest';
    else if (value == 'A - Z') value = 'a to z';
    else if (value == 'Z - A') value = 'z to a';
    else if (value == 'high to low') value = 'high to low';
    else if (value == 'low to high') value = 'low to high';
    else if (value == 'Top Seller') value = 'top seller';
    else if (value == 'Special Products') value = 'special';
    else if (value == 'Most Liked') value = 'most liked';
    // else value = value

    if (value == this.state.sortOrder) return 0;
    else {
      this.state.sortOrder = value;
      this.setState(
        {products: [], tempApply: false, page: 0, sortOrder: value},
        () => {
          this.getProducts();
        },
      );
    }
  }

  changeLayout = () => {
    if (this.state.productView === 'list') {
      this.setState({productView: 'grid'}, () => {
        this.child.showAlert();
      });
    } else {
      this.setState({productView: 'list'}, () => {
        this.child.showAlert();
      });
    }
  };

  //= ======================================================================================
  checkAttributeSelected(fValue, fName, keyword, id) {
    if (!fValue == true) {
      this.state.selectedFilters.push({name: fName, value: keyword});
    } else {
      this.state.selectedFilters.forEach((value, index) => {
        if (value.value == keyword) {
          this.state.selectedFilters.splice(index, 1);
        }
      });
    }
    if (fValue === true) {
      this.state.idArray[id] = false;
    } else {
      this.state.idArray[id] = true;
    }
    this.state.tempmYarray[0] = this.state.price.lower;
    this.state.tempmYarray[1] = this.state.price.upper;
    this.state.tempmYarray2[0] = this.state.price.lower;
    this.state.tempmYarray2[1] = this.state.price.upper;
    this.props.navigation.setParams({
      tempmYarray: this.state.tempmYarray,
      tempmYarray2: this.state.tempmYarray2,
      applyFilter2: this.state.applyFilter,
    });
    this.setState({idArray: this.state.idArray});
  }

  /// /////////////////////////////
  singaleRow2(a, v) {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          padding: 6,
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          // style={[(backgroundColor: 'red')]}
          onPress={() => {
            this.checkAttributeSelected(
              this.state.idArray[v.value_id],
              a.option.name,
              v.value,
              v.value_id,
            );
          }}>
          <View
            style={{
              justifyContent: 'space-around',
              padding: 3,
              flexDirection: 'row',
            }}>
            <Icon
              name={
                this.state.idArray[v.value_id]
                  ? 'radio-button-on'
                  : 'radio-button-off'
              }
              style={{color: '#51688F', fontSize: 22, paddingRight: 20}}
            />
            <Text
              style={{
                paddingRight: 5,
                fontSize: themeStyle.mediumSize,
                paddingTop: 2,
                color: themeStyle.textColor,
              }}>
              {v.value}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const BUTTONS = this.state.sortArray;
    return this.state.activityIndicatorTemp ? (
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
      <View style={styles.container}>
        <View
          style={{
            alignItems: 'flex-start',
            flex: 1,
            backgroundColor: themeStyle.backgroundColor,
            // backgroundColor: 'red',
          }}>
          <Spinner
            visible={this.state.SpinnerTemp}
            textStyle={styles.spinnerTextStyle}
          />
          {/* //////////////DRawer///////// */}
          {/* ///////////////////////////////////////////////////////////////// */}
          <View
            style={{
              height: 150,
              width: WIDTH,
              marginBottom: 3,
              // marginTop: 5,
              backgroundColor: '#f5fafe',
            }}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={this.props.allCategories}
              extraData={this.state}
              horizontal
              style={{
                borderColor: themeStyle.textColor,

                // backgroundColor: themeStyle.backgroundColor,
                // backgroundColor: '#f5fafe',
                // backgroundColor: 'red',
                // elevation: 5,
                shadowOffset: {width: 5, height: 6},
                shadowColor: '#000',
                shadowOpacity: 0.9,
                // marginTop: 6,
                // marginVertical: 100,
                // marginTop: 10,
                // justifyContent: 'center',
                // alignItems: 'center',
              }}
              ListHeaderComponent={
                this.props.allCategories !== null ? (
                  // <TouchableOpacity
                  //   disabled={
                  //     this.state.selectedTab === '' ||
                  //     this.state.selectedTab === undefined
                  //   }
                  //   onPress={() =>
                  //     this.setState({products: [], tempApply: false}, () => {
                  //       this.changeTab('');
                  //     })
                  //   }
                  //   style={{
                  //     borderBottomColor:
                  //       this.state.selectedTab === '' ||
                  //       this.state.selectedTab === undefined
                  //         ? '#ed1c24'
                  //         : themeStyle.textColor,
                  //     borderBottomWidth:
                  //       this.state.selectedTab === '' ||
                  //       this.state.selectedTab === undefined
                  //         ? 2
                  //         : 0,
                  //   }}>
                  //   <Text
                  //     style={{
                  //       padding: 12,
                  //       paddingLeft: 16,
                  //       paddingRight: 16,
                  //       fontFamily: 'Roboto',
                  //       fontSize: 14,
                  //       fontWeight: '400',
                  //       color:
                  //         this.state.selectedTab === '' ||
                  //         this.state.selectedTab === undefined
                  //           ? '#404040'
                  //           : '#939596',
                  //     }}>
                  //     {this.props.language.All}
                  //   </Text>
                  // </TouchableOpacity>
                  <></>
                ) : null
              }
              keyExtractor={(item, index) => index.toString()}
              renderItem={(item) => (
                <TouchableOpacity
                  disabled={this.state.selectedTab === item.item.id}
                  onPress={() =>
                    this.setState({products: [], tempApply: false}, () => {
                      this.changeTab(item.item);
                      console.log(item.item, 'items..........');
                    })
                  }
                  style={{
                    borderBottomColor:
                      this.state.selectedTab === item.item.id
                        ? '#ed1c24'
                        : themeStyle.textColor,
                    borderBottomWidth:
                      this.state.selectedTab === item.item.id ? 2 : 0,
                    // paddingVertical: 10,
                  }}>
                  <View
                    style={{
                      // backgroundColor: 'pink',
                      alignItems: 'center',
                      paddingVertical: 25,
                      // backgroundColor: '#f5fafe',
                      // paddingHorizontal: ,
                    }}>
                    <View
                      style={{
                        backgroundColor: 'white',
                        padding: 5,
                        elevation: 10,
                        borderRadius: 10,
                      }}>
                      <Image
                        style={{
                          width: 65,
                          height: 65,
                          // alignSelf: 'center',
                          // borderRadius: 10,
                        }}
                        source={{
                          uri: themeStyle.image_url + '/' + item.item.image,
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        // padding: 12,
                        // paddingLeft: 16,
                        // paddingRight: 16,
                        paddingVertical: 10,
                        paddingHorizontal: 10,

                        fontWeight: '400',
                        fontFamily: 'Roboto',
                        fontSize: 14,
                        width: 100,
                        textAlign: 'center',
                        color:
                          this.state.selectedTab === item.item.id
                            ? '#404040'
                            : '#939596',
                      }}
                      numberOfLines={1}>
                      {item.item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              height: 44,
              // backgroundColor: themeStyle.backgroundColor,
              // backgroundColor: 'pink',
              backgroundColor: '#f5fafe',

              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
              // shadowOffset: {width: 1, height: -11},
              // shadowColor: '#000',
              // shadowOpacity: 0.3,
              // elevation: 15,
              width: '100%',
            }}>
            <View
              style={{
                backgroundColor: '#f5fafe',
                // backgroundColor: 'yellow',
              }}>
              <View>
                {Platform.OS === 'android' ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      // backgroundColor: 'pink',
                    }}>
                    <Text
                      style={{
                        fontSize: 13,
                        paddingBottom: 0,
                        paddingLeft:
                          Platform.OS === 'ios'
                            ? 2
                            : I18nManager.isRTL
                            ? 32
                            : 7,
                        // paddingRight:
                        //   Platform.OS === 'ios'
                        //     ? 2
                        //     : I18nManager.isRTL
                        //     ? 8
                        //     : 13,
                        color: themeStyle.textColor,
                        textAlign:
                          Platform.OS === 'ios'
                            ? 'left'
                            : !I18nManager.isRTL
                            ? 'left'
                            : 'right',
                      }}>
                      {this.props.language['Sort Products']}
                      {':'}
                    </Text>
                    <Picker
                      note
                      mode="dropdown"
                      style={{
                        color: themeStyle.otherBtnsColor,
                        paddingLeft: 1,
                        width: 75,
                        height: 28,
                        backgroundColor: themeStyle.backgroundColor,
                        // backgroundColor: 'yellow',
                      }}
                      itemTextStyle={{color: '#788ad2'}}
                      selectedValue={this.state.selected}
                      onValueChange={this.onValueChange.bind(this)}>
                      <Picker.Item
                        label={this.props.language.Newest}
                        value="key0"
                      />
                      <Picker.Item
                        label={this.props.language['A - Z']}
                        value="key1"
                      />
                      <Picker.Item
                        label={this.props.language['Z - A']}
                        value="key2"
                      />
                      <Picker.Item
                        label={this.props.language['Price : high - low']}
                        value="key3"
                      />
                      <Picker.Item
                        label={this.props.language['Price : low - high']}
                        value="key4"
                      />
                      <Picker.Item
                        label={this.props.language['Top Seller']}
                        value="key5"
                      />
                      <Picker.Item
                        label={this.props.language['Special Products']}
                        value="key6"
                      />
                      <Picker.Item
                        label={this.props.language['Most Liked']}
                        value="key7"
                      />
                    </Picker>
                    <View>
                      <Font_Awesome
                        name={'angle-down'}
                        style={{
                          color: themeStyle.otherBtnsColor,
                          // color: 'red',
                          fontSize: 18,
                          paddingTop: 4,
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={{
                      paddingTop: 2,
                      paddingLeft: 3,
                      width: 100,
                      backgroundColor: themeStyle.backgroundColor,
                      // backgroundColor: 'red',
                    }}
                    onPress={() =>
                      ActionSheet.show(
                        {
                          options: BUTTONS,
                          cancelButtonIndex: CANCEL_INDEX,
                        },
                        (buttonIndex) => {
                          if (buttonIndex === 0) {
                            this.getSortProducts('Newest');
                          } else if (buttonIndex === 1) {
                            this.getSortProducts('A - Z');
                          } else if (buttonIndex === 2) {
                            this.getSortProducts('Z - A');
                          } else if (buttonIndex === 3) {
                            this.getSortProducts('high to low');
                          } else if (buttonIndex === 4) {
                            this.getSortProducts('low to high');
                          } else if (buttonIndex === 5) {
                            this.getSortProducts('Top Seller');
                          } else if (buttonIndex === 6) {
                            this.getSortProducts('Special Products');
                          } else if (buttonIndex === 7) {
                            this.getSortProducts('Most Liked');
                          } else if (buttonIndex === 8) {
                            this.setState({
                              clicked: BUTTONS[buttonIndex],
                              applyFilter: true,
                            });
                          }
                        },
                      )
                    }>
                    <View
                      style={{
                        borderColor: 'transparent',
                        width: 150,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: themeStyle.otherBtnsColor,
                          fontSize: 16,
                        }}
                        numberOfLines={1}>
                        {this.props.language[this.state.indexTemp]}
                      </Text>
                      <View>
                        <Icon
                          name={'md-arrow-up'}
                          style={{
                            color: themeStyle.otherBtnsColor,
                            marginLeft: 5,
                            fontSize: 19,
                          }}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View
              style={{
                borderColor: themeStyle.backgroundColor,
                alignItems: 'center',
                height: 44,
                // backgroundColor: 'pink',
                // backgroundColor: 'red',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity onPress={() => this.changeLayout()}>
                <Icon
                  name={
                    this.state.productView === 'grid' ? 'md-list' : 'md-apps'
                  }
                  size={10}
                  style={{color: '#205a8e', marginRight: 15}}
                />
              </TouchableOpacity>

              {this.state.applyFilter ? (
                <TouchableOpacity onPress={() => this.removeFilters()}>
                  <Icon
                    name={'md-refresh'}
                    size={10}
                    style={{color: themeStyle.textColor, marginRight: 15}}
                  />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                onPress={() => this.props.navigation.openDrawer()}>
                <Icon
                  name={'md-funnel'}
                  size={10}
                  style={{color: '#205a8e', marginRight: 9}}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{marginBottom: 30}}>
            <FlatListViewShop
              dataSource={this.state.products}
              products={this.props.language.Products}
              allCategories={this.props.allCategories}
              props={this.props}
              state={this.state}
              onRef={(ref) => (this.child = ref)}
              page={this.state.page}
              functionPropNameHere={() => this.getProducts()}
              sortArray={this.state.sortArray}
              productView={this.state.productView}
              applyFilter={this.state.tempApply}
            />
          </View>
          {/* /////////////////products///////////////////////// */}
        </View>
      </View>
    );
  }
}
/// ///////////////////////////////////////////////
const getLanguage = (state) => state.Config.languageJson;
const getAllCategories = (state) => state.cartItems.allCategories;
const getCurrency = (state) => state.Config.productsArguments.currency;

const getLanguageFun = createSelector([getLanguage], (getLanguage) => {
  return getLanguage;
});
const getAllCategoriesProducts = createSelector(
  [getAllCategories],
  (getAllCategories) => {
    return getAllCategories;
  },
);
const getCurrencyFun = createSelector([getCurrency], (getCurrency) => {
  return getCurrency;
});

const mapStateToProps = (state) => {
  return {
    currency: getCurrencyFun(state),
    allCategories: getAllCategoriesProducts(state),
    language: getLanguageFun(state),
    cartItems2: state,
  };
};

/// //////////////////////////////////////////
export default connect(mapStateToProps, null)(withNavigation(Newest));
/// /////////////////////////////////////////////
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeStyle.backgroundColor,
  },
});
