import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  I18nManager,
  Platform,
} from 'react-native';
import ImageLoad from '../RnImagePlaceH';
import Timer from '../Timer';
import {Icon} from 'native-base';
import Ionicons from 'react-native-vector-icons/FontAwesome';
import theme from '../Theme.style';
import ThemeStyle from '../Theme.style';
import Counter from '../Counter';
import {NavigationEvents} from 'react-navigation';

export default CardOne = ({props, widthPic, t, s, btnWidth}) => {
  let [incdecquantity, setIncdecquantity] = useState(1);
  // 1st View
  return (
    <View
      style={{
        // backgroundColor: theme.backgroundColor,
        width: widthPic,
        // width: '100%',
        // shadowOffset: {width: 1, height: 1},
        // shadowColor: theme.textColor,
        // shadowOpacity: 0.3,
        // height: '20%',
        // elevation: 3,
        margin: 5,
        marginBottom: 8,
        padding: 6,
        // backgroundColor: 'red',
        backgroundColor: 'transparent',
        justifyContent: 'center',
      }}>
      {/* /// ///////////////////////////////////////////////////// 2nd View*/}
      <View
        style={{
          // YELLOW-
          // backgroundColor: theme.backgroundColor,
          // backgroundColor: 'yellow',
          backgroundColor: '#FFF',
          padding: 5,
          // ZZwidth: '100%',
        }}>
        {t.newMethod3(props, t) === 1 ? (
          t.props.recentViewedProducts && props.recent ? (
            <TouchableOpacity
              style={{
                width: btnWidth,
                shadowOffset: {width: 1, height: 1},
                shadowColor: theme.textColor,
                shadowOpacity: 0.5,
                elevation: 3,
                position: 'absolute',
                bottom: 4,
                left: 5,
              }}
              onPress={() => t.removeRecent(props, t)}>
              <View
                style={{
                  alignItems: 'center',
                  height: Platform.OS === 'android' ? 30 : 28,
                  width: btnWidth,
                  justifyContent: 'center',
                  // backgroundColor: 'theme.removeBtnColor',
                  padding: 15,
                }}>
                <Text
                  style={{
                    color: theme.removeBtnTextColor,
                    fontSize: theme.mediumSize + 1,

                    fontWeight: '500',
                  }}>
                  {t.props.language.Remove}
                </Text>
              </View>
            </TouchableOpacity>
          ) : props.removeButton ? (
            <TouchableOpacity
              style={{
                width: btnWidth,
                shadowOffset: {width: 1, height: 1},
                shadowColor: theme.textColor,
                shadowOpacity: 0.5,
                elevation: 3,
                position: 'absolute',
                bottom: 4,
                left: 5,
              }}
              onPress={() => t.removeWishlist(props, t)}>
              <View
                style={{
                  alignItems: 'center',
                  height: Platform.OS === 'android' ? 30 : 28,
                  width: btnWidth,
                  justifyContent: 'center',

                  // backgroundColor: theme.removeBtnColor,
                  // backgroundColor: 'yellow',
                }}>
                <Text
                  style={{
                    color: theme.removeBtnTextColor,
                    fontSize: theme.mediumSize + 1,
                    fontWeight: '500',
                  }}>
                  {t.props.language.Remove}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null
        ) : null}
        {t.newMethod3(props, t) === 1 ? (
          <>
            <View
              style={{
                width: widthPic,
                zIndex: 2,
                position: 'absolute',
              }}>
              <Icon
                style={{
                  paddingTop: 90,
                  color: 'green',
                  fontSize: 30,
                  alignSelf: 'center',
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
          </>
        ) : null}

        {/* Third View */}
        <View
          style={{
            // PURPLE-
            // backgroundColor: theme.backgroundColor,
            // backgroundColor: 'purple',
            backgroundColor: '#ffffff',
            // borderRadius: 5,
            // elevation: 3,
            // padding: 10,
            opacity: t.newMethod3(props, t) === 1 ? 0.1 : 1,
          }}>
          <TouchableOpacity
            style={{flex: 2, padding: 10}}
            onPress={() =>
              props.navigation.push('ProductDetails', {
                objectArray: props.objectArray, //
              })
            }>
            {/* Image View */}
            <View
              style={{
                // RED-
                backgroundColor: 'red',
                backgroundColor: '#FFF',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                //elevation: 4,
                width: 140,
                // padding: 5,
                borderRadius: 10,
                height: 100,

                // paddingVertical: 20,
              }}>
              <ImageLoad
                style={{
                  // height: widthPic,
                  // width: widthPic,
                  height: 100,
                  width: 140,
                  backgroundColor: 'rgb(236, 236, 236)',
                  borderRadius: 5,
                  alignSelf: 'center',
                }}
                source={{
                  uri: theme.url + '/' + props.objectArray.products_image,
                }}></ImageLoad>
            </View>
            {t.checkProductNew(props) ? (
              <ImageLoad
                placeholder={false}
                ActivityIndicator={true}
                resizeMode={'cover'}
                key={props.objectArray.id}
                style={{
                  height: 38,
                  zIndex: 6,
                  width: 38,
                  fontSize: 13,
                  left: 0,

                  color: '#fff',
                  position: 'absolute',
                  backgroundColor: 'rgb(236, 236, 236)',
                }}
                backgroundColor={'transparent'}
                isShowActivity={false}
                loadingStyle={{
                  size: 'large',
                  color: theme.loadingIndicatorColor,
                }}
                placeholderStyle={{
                  height: 40,
                  width: 40,
                  backgroundColor: 'transparent',
                }}
                source={require('../../images/badge_new.png')}
              />
            ) : null}

            {props.objectArray.discount_price != null ? (
              <View
                style={{
                  backgroundColor: theme.otherBtnsColor,
                  zIndex: 16,
                  textAlign: 'center',
                  padding: 3,
                  paddingBottom: 1,
                  paddingTop: 1,
                  right: -8,
                  top: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  fontWeight: '400',
                  borderRadius: 2,
                }}>
                <Text
                  style={{
                    color: theme.otherBtnsText,
                    padding: 1,
                    zIndex: 2,
                    fontSize: 11,
                  }}>
                  {t.pDiscount(props) + ' ' + t.props.language.OFF}
                </Text>
              </View>
            ) : null}
            {props.objectArray.featured ? (
              <View
                style={{
                  backgroundColor: theme.otherBtnsColor,
                  zIndex: 6,
                  textAlign: 'center',
                  padding: 3,
                  paddingBottom: 1,
                  paddingTop: 1,
                  right: 0,
                  top: !props.objectArray.on_sale ? 0 : 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  fontWeight: '400',
                  borderRadius: 2,
                }}>
                <Text style={{color: theme.otherBtnsText, fontSize: 11}}>
                  {t.props.language.FEATURED}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
          {/* ..................................... Content View ..........................................*/}
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignSelf: 'center',
              padding: 1,
              margin: 1,
              marginBottom: 0,
              paddingBottom: 5,
              paddingTop: 5,
              marginTop: 0,
              width: widthPic,
              // backgroundColor: '#f5fafe',
              backgroundColor: ThemeStyle.backgroundColor,
            }}>
            {/* ................................Product Name View */}
            <View
              style={{
                // backgroundColor: 'yellow',
                // backgroundColor: ThemeStyle.backgroundColor,
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: '100%',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Roboto',
                  writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
                  color: theme.textColor,
                  // padding: 5,
                  paddingLeft: 5,
                  fontWeight: 'bold',
                  color: '#404040',
                  textTransform: 'capitalize',
                  //paddingTop: Platform.OS === 'android' ? 1 : 2,
                  // paddingBottom: 1,
                  // marginBottom: 0,
                }}
                numberOfLines={1}>
                {props.objectArray.products_name}
              </Text>
            </View>
            {/* .......................Product Price View */}
            <View
              style={{
                // backgroundColor: 'transparent',
                // backgroundColor: 'purple',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginBottom:
                  props.objectArray.flash_price === undefined ? 0 : 2,
                //padding: 5,
                paddingTop: 0,
                paddingBottom: 2,
                marginTop: 2,
              }}>
              {props.objectArray.flash_price !== undefined ? (
                <View
                  style={{
                    flexDirection: 'row',
                    // backgroundColor: 'pink',
                    width: '100%',
                    justifyContent: 'center',
                  }}>
                  {t.priceFun(
                    theme.mediumSize - 1,
                    props.objectArray.products_price,
                    'line-through',
                  )}
                  {t.priceFun(
                    theme.mediumSize - 1,
                    props.objectArray.flash_price,
                    'none',
                  )}
                </View>
              ) : null}

              {props.objectArray.flash_price === undefined ? (
                // Recently Viewed Cart Price View
                <View style={{flexDirection: 'row'}}>
                  {props.objectArray.discount_price === null
                    ? t.priceFun(
                        theme.mediumSize - 1,
                        props.objectArray.products_price,
                        'none',
                      )
                    : null}
                  {props.objectArray.discount_price !== null
                    ? t.priceFun(
                        theme.mediumSize - 1,
                        props.objectArray.products_price,
                        'line-through',
                      )
                    : null}
                  {props.objectArray.discount_price !== null &&
                  props.objectArray.discount_price !== undefined
                    ? t.priceFun(
                        theme.mediumSize - 1,
                        props.objectArray.discount_price,
                        'none',
                      )
                    : null}
                </View>
              ) : null}
              {/* {props.objectArray.flash_price === undefined ? (
              // Recently Viewed Cart Icon View
              <View>
                {t.checkWishList(props, t) === 1 ? (
                  props.removeButton ? (
                    <Icon
                      style={{
                        color: theme.wishHeartBtnColor,
                        fontSize: 17,
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
                        fontSize: 17,
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
                      fontSize: Platform.OS === 'ios' ? 14 : 13,
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
            ) : null} */}
            </View>
            {props.removeButton ? (
              <TouchableOpacity
                style={{
                  margin: 5,
                  width: btnWidth,
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
                onPress={() => t.removeWishlist(props, t)}>
                <View
                  style={{
                    padding: 5,
                    margin: 5,
                    width: btnWidth,

                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: 0,
                    marginBottom: 0,
                    backgroundColor: theme.removeBtnColor,
                    // backgroundColor: 'yellow',
                  }}>
                  <Text
                    style={{
                      color: theme.removeBtnTextColor,
                      // color: 'black',
                      fontSize: theme.mediumSize + 1,
                      fontWeight: '500',
                      // padding: 10,
                    }}>
                    {t.props.language.Remove}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : t.props.cartButton ? (
              t.props.recentViewedProducts && props.recent ? null : props
                  .objectArray.products_type === 0 &&
                props.objectArray.defaultStock <= 0 &&
                // eslint-disable-next-line eqeqeq
                props.inventory == 1 ? (
                <TouchableOpacity
                  style={{
                    // margin: 5,
                    width: btnWidth,
                    marginBottom: 3,
                    marginTop: 0,
                    top: -3,
                    borderRadius: 5,
                    // justifyContent: 'center',
                    alignItems: 'flex-end',
                    right: 7,
                    position: 'absolute',
                  }}>
                  {/* Out of Stock Button View */}
                  <View
                    style={{
                      padding: 6,
                      margin: 5,
                      width: btnWidth,
                      width: 90,
                      // justifyContent: 'center',
                      alignItems: 'center',
                      // alignSelf: 'center',
                      marginBottom: 0,
                      borderRadius: 5,
                      // backgroundColor: theme.outOfStockBtnColor,
                      backgroundColor: 'red',
                    }}>
                    <Text
                      style={{
                        color: theme.outOfStockBtnTextColor,
                        // fontSize: theme.mediumSize + 1,
                        fontSize: 10,
                        fontWeight: '500',
                      }}>
                      {t.props.language['OUT OF STOCK']}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : t.props.dataName === 'Flash' ? (
                <Timer
                  props={t.props}
                  languageJson2={t.props.language2}
                  widthPic={widthPic}
                  t={t}
                  text={null}
                  objectArray={props.objectArray}
                  s={s}
                  btnWidth={btnWidth}></Timer>
              ) : props.objectArray.products_type === 0 ? (
                <>
                  <TouchableOpacity
                    style={{
                      // margin: 5,
                      // width: btnWidth,
                      width: 70,
                      marginBottom: 3,
                      marginTop: 0,
                      top: -1,
                      right: 7,
                      borderRadius: 5,
                      // justifyContent: 'center',
                      alignItems: 'flex-end',
                      // backgroundColor:'yellow',
                      // alignSelf: 'center',
                      // shadowOffset: {width: 1, height: 1},
                      // shadowColor: theme.textColor,
                      // shadowOpacity: 0.5,
                      // elevation: 3,
                      position: 'absolute',
                    }}
                    onPress={() => {
                      if (t.newMethod3(props, t) !== 1) {
                        t.newMethod6(props, t, incdecquantity);
                      }
                    }}>
                    <View
                      style={{
                        padding: 5,
                        //margin: 5,
                        // width: btnWidth,
                        width: 80,
                        // backgroundColor: theme.addToCartBtnColor,
                        backgroundColor: 'green',
                        // justifyContent: 'center',
                        alignItems: 'center',
                        // alignSelf: 'center',
                        // marginTop: -27,
                        borderRadius: 5,
                      }}>
                      <Text
                        style={{
                          color: theme.addToCartBtnTextColor,
                          // fontSize: theme.mediumSize + 1,
                          fontSize: 10,
                          fontWeight: '500',
                        }}>
                        {t.props.language['Add to Cart']}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {t.newMethod3(props, t) !== 1 ? (
                    <View
                      style={{
                        alignItems: 'center',
                      }}>
                      <Counter
                        width={32}
                        height={1}
                        minimumValue={1}
                        initialValue={1}
                        onIncrement={() => {
                          console.log(incdecquantity);
                          setIncdecquantity(incdecquantity + 1);
                          //t.qunatityPlus(props, t, 1);
                        }}
                        onDecrement={() => {
                          setIncdecquantity(incdecquantity - 1);
                          //t.qunatityMinus(props, t, 1);
                        }}
                      />
                    </View>
                  ) : null}
                </>
              ) : props.objectArray.products_type === 1 ||
                props.objectArray.products_type === 2 ||
                props.objectArray.products_type === 3 ? (
                <TouchableOpacity
                  style={{
                    margin: 5,
                    width: btnWidth,
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
                    // requestAnimationFrame(() => {
                    if (t.newMethod3(props, t) !== 1) {
                      props.navigation.push('ProductDetails', {
                        objectArray: props.objectArray, //
                      });
                    }
                    // })
                  }}>
                  <View
                    style={{
                      padding: 5,
                      margin: 5,
                      width: btnWidth,
                      backgroundColor: theme.detailsBtnColor,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      marginTop: 0,
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

            {t.props.recentViewedProducts && props.recent ? (
              <TouchableOpacity
                style={{
                  // margin: 5,
                  width: btnWidth,
                  marginBottom: 3,
                  marginTop: 0,
                  top: 3,
                  right: 0,
                  // justifyContent: 'center',
                  alignItems: 'flex-end',
                  // alignSelf: 'center',
                  // shadowOffset: {width: 1, height: 1},
                  // shadowColor: theme.textColor,
                  // shadowOpacity: 0.5,
                  elevation: 3,
                  position: 'absolute',
                }}
                onPress={() => t.removeRecent(props, t)}>
                <View
                  style={{
                    padding: 5,
                    width: 70,

                    // justifyContent: 'center',
                    alignItems: 'center',
                    // alignSelf: 'center',
                    marginTop: 0,
                    borderRadius: 5,
                    marginBottom: 0,
                    backgroundColor: theme.removeBtnColor,
                  }}>
                  <Text
                    style={{
                      color: theme.removeBtnTextColor,
                      fontSize: 10,
                      fontWeight: '500',
                    }}>
                    {t.props.language.Remove}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>

          <NavigationEvents
            onDidFocus={() => {
              console.log(incdecquantity, 'onDidFocus');
              setIncdecquantity(1);
            }}
          />
        </View>
      </View>
    </View>
  );
};
