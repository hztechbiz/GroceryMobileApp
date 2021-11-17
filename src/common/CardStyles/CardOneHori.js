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
      elevation: 3,
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
              color: 'green',
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
          backgroundColor: theme.backgroundColor,
          shadowOffset: {width: 1, height: 1},
          shadowColor: theme.textColor,
          elevation: 2,
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
              height: 90,
              width: 90,
              backgroundColor: 'rgb(236, 236, 236)',
            }}
            loadingStyle={{size: 'large', color: theme.loadingIndicatorColor}}
            placeholderStyle={{width: 0, height: 0}}
            source={{
              uri: theme.url + '/' + props.objectArray.products_image,
            }}></ImageLoad>
        </TouchableOpacity>

        <View
          style={{
            flex: 2,
            padding: 8,
            paddingLeft: 1,
            paddingBottom: 0,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginLeft: -5,
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
              marginBottom: 14,
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
                  margin: 5,
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
                    padding: 5,
                    margin: 5,
                    width: btnWidth / 3.5,
                    backgroundColor: theme.outOfStockBtnColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: -14,
                    marginBottom: 0,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      color: theme.outOfStockBtnTextColor,
                      fontSize: theme.mediumSize - 3,
                      fontWeight: '500',
                    }}
                    numberOfLines={1}>
                    {t.props.language['OUT OF STOCK']}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : props.objectArray.products_type === 0 && props.addToCart ? (
              <TouchableOpacity
                style={{
                  margin: 5,
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
                    padding: 5,
                    margin: 5,
                    width: btnWidth / 3.5,
                    backgroundColor: theme.addToCartBtnColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: -14,
                    marginBottom: 0,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      color: theme.addToCartBtnTextColor,
                      fontSize: theme.mediumSize - 2,
                      fontWeight: '500',
                    }}>
                    {t.props.language['Add to Cart']}
                  </Text>
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
