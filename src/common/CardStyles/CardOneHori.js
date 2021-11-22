import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  I18nManager,
  Platform,
  Dimensions,
} from 'react-native';
import ImageLoad from '../RnImagePlaceH';
import {Icon} from 'native-base';
import Ionicons from 'react-native-vector-icons/FontAwesome';
import Shopicon from 'react-native-vector-icons/FontAwesome5';
import Shopicons from 'react-native-vector-icons/MaterialIcons';
import theme from '../Theme.style';
const WIDTH = Dimensions.get('window').width;
export default CardOne = ({props, widthPic, t, s, btnWidth}) => (
  <View
    style={{
      backgroundColor: theme.backgroundColor,
      width: widthPic,
      shadowOffset: {width: 1, height: 1},
      shadowColor: theme.textColor,
      shadowOpacity: 0.3,
      // elevation: 7,
      margin: 5,
      marginBottom: 8,
    }}>
    {/* /// ///////////////////////////////////////////////////// 2nd */}
    <View
      style={{
        backgroundColor: theme.backgroundColor,
        flexDirection: 'row',
      }}>
      {t.newMethod3(props, t) === 1 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            width: WIDTH,
            alignContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            zIndex: 6,
            position: 'absolute',
          }}>
          <Icon
            style={{
              color: '#641ae4',
            }}
            name="checkmark-circle"
            size={40}
            onPress={() =>
              props.navigation.push('ProductDetails', {
                objectArray: props.objectArray, //
              })
            }
          />
        </View>
      ) : null}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          width: WIDTH,
          // backgroundColor: theme.backgroundColor,
          backgroundColor: '#f5fafe',
          // backgroundColor: 'gray',
          shadowOffset: {width: 1, height: 1},
          shadowColor: theme.textColor,
          elevation: 0, //card_elevation
          padding: 5,
          opacity: t.newMethod3(props, t) === 1 ? 0.1 : 1,
        }}>
        <TouchableOpacity
          style={{width: 90, marginRight: 8}}
          onPress={() =>
            props.navigation.push('ProductDetails', {
              objectArray: props.objectArray, //
            })
          }>
          <ImageLoad
            key={props.objectArray.id}
            style={{
              height: 105,
              width: 105,
              borderRadius: 6,
              elevation: 5,
              backgroundColor: 'rgb(236, 236, 236)',
            }}
            loadingStyle={{size: 'large', color: theme.loadingIndicatorColor}}
            placeholderStyle={{width: 0, height: 0}}
            source={{
              uri: theme.image_url + '/' + props.objectArray.products_image,
            }}></ImageLoad>
        </TouchableOpacity>

        <View
          style={{
            flex: 2,
            padding: 8,
            paddingLeft: 1,
            paddingBottom: 0,
            marginLeft: 25,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginLeft: 0,
            }}>
            <View style={{width: WIDTH * 0.54}}>
              <Text
                style={{
                  fontSize: theme.mediumSize + 1,
                  fontFamily: 'Roboto',
                  writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
                  color: theme.textColor,
                  margin: 0,
                  padding: 5,
                  paddingTop: Platform.OS === 'android' ? 1 : 2,
                  paddingBottom: 1,
                  marginBottom: 0,
                  textTransform: 'capitalize',
                  fontWeight: 'bold',
                }}
                numberOfLines={1}>
                {props.objectArray.products_name}
              </Text>
            </View>
            {props.objectArray.discount_price ? (
              <View
                style={{
                  alignContent: 'flex-end',
                  alignItems: 'flex-end',
                }}>
                <Text
                  style={{
                    fontSize: theme.smallSize + 1,
                    backgroundColor: theme.otherBtnsColor,
                    color: theme.saleTextColor,
                    margin: 1,
                    padding: 2,
                    zIndex: 3,
                    position: 'absolute',
                  }}>
                  {t.pDiscount(props) + ' ' + t.props.language.OFF}
                </Text>
              </View>
            ) : null}
          </View>
          <View
            style={{
              marginTop: 2,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 0,
              marginLeft: 5,
            }}>
            <View>
              {props.objectArray.flash_price !== undefined ? (
                <View style={{flexDirection: 'row'}}>
                  {t.priceFun(
                    theme.mediumSize,
                    props.objectArray.products_price,
                    'line-through',
                  )}
                  {t.priceFun(
                    theme.mediumSize,
                    props.objectArray.flash_price,
                    'none',
                  )}
                </View>
              ) : null}

              {props.objectArray.flash_price === undefined ? (
                <View style={{flexDirection: 'row'}}>
                  {props.objectArray.discount_price === null
                    ? t.priceFun(
                        theme.mediumSize,
                        props.objectArray.products_price,
                        'none',
                      )
                    : null}
                  {props.objectArray.discount_price !== null
                    ? t.priceFun(
                        theme.mediumSize,
                        props.objectArray.products_price,
                        'line-through',
                      )
                    : null}
                  {props.objectArray.discount_price !== null &&
                  props.objectArray.discount_price !== undefined
                    ? t.priceFun(
                        theme.mediumSize,
                        props.objectArray.discount_price,
                        'none',
                      )
                    : null}
                </View>
              ) : null}
            </View>
            <View>
              {t.checkWishList(props, t) === 1 ? (
                props.removeButton ? (
                  <Icon
                    style={{
                      color: theme.wishHeartBtnColor,
                      fontSize: 20,
                    }}
                    active
                    name="heart"
                    onPress={() => {
                      if (t.newMethod3(props, t) !== 1) {
                        t.removeWishlist(props, t);
                      }
                    }}
                  />
                ) : (
                  <Icon
                    style={{
                      color: theme.wishHeartBtnColor,
                      fontSize: 20,
                    }}
                    active
                    name="heart"
                    onPress={() => {
                      if (t.newMethod3(props, t) !== 1) {
                        t.removeWishlist(props, t);
                      }
                    }}
                  />
                )
              ) : (
                <Ionicons
                  style={{
                    color: theme.wishHeartBtnColor,
                    fontSize: Platform.OS === 'ios' ? 17 : 18,
                    marginTop: Platform.OS === 'ios' ? 3 : 2,
                    marginBottom: Platform.OS === 'ios' ? 2 : 2,
                  }}
                  active
                  name="heart-o"
                  onPress={() => {
                    if (t.newMethod3(props, t) !== 1) {
                      t.addWishlist(props, t);
                    }
                  }}
                />
              )}
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingRight: 0,
              marginLeft: -5,
              paddingTop: 0,
              paddingBottom: 0,
              marginBottom: -6,
              margin: 0,
            }}>
            {props.objectArray.products_type === 0 &&
            props.objectArray.defaultStock <= 0 &&
            // eslint-disable-next-line eqeqeq
            props.inventory == 1 ? (
              <TouchableOpacity
                style={{
                  // margin: 5,
                  marginLeft: 8,
                  width: btnWidth / 3,
                  marginBottom: 3,
                  marginTop: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  shadowOffset: {width: 1, height: 1},
                  shadowColor: theme.textColor,
                  shadowOpacity: 0.5,
                  elevation: 3,
                }}>
                <View
                  style={{
                    // padding: 5,
                    // margin: 5,
                    width: btnWidth / 3.1,
                    backgroundColor: 'transparent',
                    borderWidth: 1.7,
                    borderColor: '#ed1c24',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: -14,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 0,
                    borderRadius: 7,
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                  }}>
                  <Text
                    style={{
                      // color: theme.outOfStockBtnTextColor,
                      color: '#ed1c24',
                      fontSize: theme.mediumSize - 3,
                      fontWeight: '500',
                      textTransform: 'capitalize',
                      paddingLeft: 8,
                    }}
                    numberOfLines={1}>
                    {t.props.language['OUT OF STOCK']}
                  </Text>
                  <View
                    style={{
                      height: '100%',
                      width: '26%',
                      backgroundColor: '#ed1c24',
                      borderRadius: 15,
                      alignSelf: 'flex-end',
                    }}>
                    <Shopicons
                      style={{
                        alignSelf: 'center',
                        marginVertical: 6,
                        padding: 2,
                        alignItems: 'center',
                      }}
                      name="remove-shopping-cart"
                      type="evilicon"
                      color="#ffff"
                      size={11}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ) : props.objectArray.products_type === 0 && props.addToCart ? (
              <TouchableOpacity
                style={{
                  // margin: 9,
                  marginLeft: 8,
                  width: btnWidth / 3,
                  marginBottom: 3,
                  marginTop: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  shadowOffset: {width: 1, height: 1},
                  shadowColor: theme.textColor,
                  shadowOpacity: 0.5,
                  elevation: 3,
                }}
                onPress={() => {
                  if (t.newMethod3(props, t) !== 1) {
                    t.newMethod6(props, t);
                  }
                }}>
                <View
                  style={{
                    // padding: 2,
                    // paddingVertical: 2,
                    // margin: 5,
                    width: btnWidth / 3.1,
                    // backgroundColor: theme.addToCartBtnColor,
                    backgroundColor: 'transparent',
                    borderWidth: 1.7,
                    borderColor: '#641ae4',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: -14,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 0,
                    borderRadius: 7,
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                  }}>
                  <Text
                    style={{
                      // color: theme.addToCartBtnTextColor,
                      color: '#641ae4',
                      fontSize: theme.mediumSize - 3,
                      fontWeight: '500',
                      textTransform: 'capitalize',
                      paddingLeft: 8,
                    }}>
                    {t.props.language['Add to Cart']}
                  </Text>
                  <View
                    style={{
                      height: '100%',
                      width: '26%',
                      backgroundColor: '#641ae4',
                      borderRadius: 15,
                      alignSelf: 'flex-end',
                    }}>
                    <Shopicon
                      style={{
                        alignSelf: 'center',
                        marginVertical: 6,
                        padding: 3,
                        alignItems: 'center',
                      }}
                      name="shopping-basket"
                      type="evilicon"
                      color="#ffff"
                      size={9}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ) : t.props.cartButton ? (
              props.objectArray.products_type === 1 ||
              props.objectArray.products_type === 2 ||
              props.objectArray.products_type === 3 ? (
                <TouchableOpacity
                  style={{
                    margin: 5,
                    width: btnWidth / 3,
                    marginBottom: 0,
                    marginTop: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    shadowOffset: {width: 1, height: 1},
                    shadowColor: theme.textColor,
                    shadowOpacity: 0.5,
                    elevation: 3,
                  }}
                  onPress={() => {
                    if (t.newMethod3(props, t) !== 1) {
                      props.navigation.push('ProductDetails', {
                        objectArray: props.objectArray, //
                      });
                    }
                  }}>
                  <View
                    style={{
                      padding: 5,
                      margin: 5,
                      width: btnWidth / 3,
                      backgroundColor: theme.detailsBtnColor,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      marginTop: -14,
                      marginBottom: 0,
                    }}>
                    <Text
                      style={{
                        color: theme.detailsBtnTextColor,
                        fontSize: theme.mediumSize + 1,
                        fontWeight: '500',
                      }}>
                      {t.props.language2.DETAILS}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null
            ) : null}
          </View>
        </View>
      </View>
    </View>
  </View>
);
