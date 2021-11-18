import React from 'react'
import { View, TouchableOpacity, Text, I18nManager, Platform } from 'react-native'
import ImageLoad from '../RnImagePlaceH'
import theme from '../Theme.style'
import Timer from '../Timer'
export default CardOne = ({ props, widthPic, t, s, btnWidth }) => (
  <View
    style={{
      backgroundColor: theme.backgroundColor,
      width: widthPic,
      shadowOffset: { width: 1, height: 1 },
      shadowColor: theme.textColor,
      shadowOpacity: 0.3,
      elevation: 3,
      margin: 5,
      marginBottom: 5,
      borderTopLeftRadius: 20 / 2,
      borderTopRightRadius: 20 / 2
    }}>
    {/* /// ///////////////////////////////////////////////////// 2nd */}
    <View
      style={{
        backgroundColor: theme.backgroundColor,
        borderTopLeftRadius: 20 / 2,
        borderTopRightRadius: 20 / 2
      }}>
      {t.newMethod3(props, t) === 1 ? (
        t.props.recentViewedProducts && props.recent ? (
          <TouchableOpacity
            style={{
              width: btnWidth,
              shadowOffset: { width: 1, height: 1 },
              shadowColor: theme.textColor,
              shadowOpacity: 0.5,
              elevation: 3,
              position: 'absolute',
              bottom: 4,
              left: 5
            }}
            onPress={() => t.removeRecent(props, t)}>
            <View
              style={{
                alignItems: 'center',
                height: Platform.OS === 'android' ? 30 : 28,
                width: btnWidth,
                justifyContent: 'center',
                backgroundColor: theme.removeBtnColor
              }}>
              <Text
                style={{
                  color: theme.removeBtnTextColor,
                  fontSize: theme.mediumSize + 1,
                  fontWeight: '500'
                }}>
                {t.props.language.Remove}
              </Text>
            </View>
          </TouchableOpacity>
        ) : props.removeButton ? (
          <TouchableOpacity
            style={{
              width: btnWidth,
              shadowOffset: { width: 1, height: 1 },
              shadowColor: theme.textColor,
              shadowOpacity: 0.5,
              elevation: 3,
              position: 'absolute',
              bottom: 4,
              left: 5
            }}
            onPress={() => t.removeWishlist(props, t)}>
            <View
              style={{
                alignItems: 'center',
                height: Platform.OS === 'android' ? 30 : 28,
                width: btnWidth,
                justifyContent: 'center',

                backgroundColor: theme.removeBtnColor
              }}>
              <Text
                style={{
                  color: theme.removeBtnTextColor,
                  fontSize: theme.mediumSize + 1,
                  fontWeight: '500'
                }}>
                {t.props.language.Remove}
              </Text>
            </View>
          </TouchableOpacity>
        ) : null
      ) : null}
      <View
        style={{
          backgroundColor: theme.backgroundColor,
          borderTopLeftRadius: 20 / 2,
          borderTopRightRadius: 20 / 2
        }}>
        <TouchableOpacity
          style={{
            flex: 2,
            borderTopLeftRadius: 20 / 2,
            borderTopRightRadius: 20 / 2
          }}
          onPress={() =>
            props.navigation.push('ProductDetails', {
              objectArray: props.objectArray //
            })
          }>
          <ImageLoad
            key={props.objectArray.id}
            style={{
              height: widthPic,
              width: widthPic,
              backgroundColor: 'rgb(236, 236, 236)',
              borderTopLeftRadius: 20 / 2,
              borderTopRightRadius: 20 / 2
            }}
            source={{ uri: theme.image_url + '/' + props.objectArray.products_image }}>
          </ImageLoad>
          {props.objectArray.discount_price != null ||
            props.objectArray.flash_price != null ? (
              <View
                style={{
                  backgroundColor: theme.saleBackgroundColor,
                  zIndex: 6,
                  textAlign: 'center',
                  padding: 3,
                  paddingBottom: 1,
                  paddingTop: 1,
                  left: 0,
                  top: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  fontWeight: '400',
                  borderRadius: 2,
                  height: 35,
                  width: 37,
                  borderTopLeftRadius: 20 / 2
                }}>
                <Text style={{ color: '#fff', fontSize: 11 }}>
                  {t.pDiscount(props)}
                </Text>
                <Text style={{ color: '#fff', fontSize: 11 }}>
                  {t.props.language.OFF}
                </Text>
              </View>
            ) : null}
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignSelf: 'center',
            padding: 1,
            margin: 1,
            marginBottom: 0,
            paddingBottom: 1,
            paddingTop: 0,
            marginTop: 0,
            width: widthPic
          }}>
          <Text
            style={{
              fontSize: theme.mediumSize,
              fontFamily: 'Roboto',
              writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
              color: theme.textColor,
              margin: 0,
              padding: 5,
              paddingTop: Platform.OS === 'android' ? 1 : 2,
              paddingBottom: 0,
              marginBottom: 0,
              fontWeight: 'bold',
              width: widthPic - 20
            }}
            numberOfLines={1}>
            {props.objectArray.products_name}
          </Text>

          {props.objectArray !== null && props.objectArray !== undefined ? (
            props.objectArray.categories !== null &&
            props.objectArray.categories !== undefined &&
            props.objectArray.categories.length > 0 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: theme.backgroundColor,
                    padding: 8,
                    paddingTop: 1,
                    paddingBottom: 2
                  }}>
                  <Text
                    style={{
                      fontSize: theme.mediumSize - 2,
                      fontFamily: 'Roboto',
                      textAlign:
                      Platform.OS === 'ios'
                        ? 'left'
                        : I18nManager.isRTL
                          ? 'right'
                          : 'left',
                      color: '#6D6D6D',
                      margin: 0,
                      marginLeft: -2,
                      paddingTop: Platform.OS === 'android' ? 0 : 1,
                      paddingBottom: 1,
                      marginBottom: 0
                    }}
                    numberOfLines={1}>
                    {'(' + t.getCategoryName() + ')'}
                  </Text>
                </View>
              ) : null
          ) : null}

          <View
            style={{
              backgroundColor: 'transparent',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 0,
              marginBottom: 0,
              padding: 5,
              paddingLeft: 6,
              paddingTop: 0,
              paddingBottom: 2
            }}>
            {props.objectArray.flash_price !== undefined ? (
              <View style={{ flexDirection: 'row' }}>
                {t.priceFun(
                  theme.mediumSize - 1,
                  props.objectArray.products_price,
                  'line-through'
                )}
                {t.priceFun(
                  theme.mediumSize - 1,
                  props.objectArray.flash_price,
                  'none'
                )}
              </View>
            ) : null}

            {props.objectArray.flash_price === undefined ? (
              <View style={{ flexDirection: 'row' }}>
                {props.objectArray.discount_price === null
                  ? t.priceFun(
                    theme.mediumSize - 1,
                    props.objectArray.products_price,
                    'none'
                  )
                  : null}
                {props.objectArray.discount_price !== null
                  ? t.priceFun(
                    theme.mediumSize - 1,
                    props.objectArray.products_price,
                    'line-through'
                  )
                  : null}
                {props.objectArray.discount_price !== null &&
                props.objectArray.discount_price !== undefined
                  ? t.priceFun(
                    theme.mediumSize - 1,
                    props.objectArray.discount_price,
                    'none'
                  )
                  : null}
              </View>
            ) : null}
            <View>
              {/// ///////////////
                props.objectArray.products_type === 0 &&
              props.objectArray.defaultStock <= 0 &&
              // eslint-disable-next-line eqeqeq
              props.inventory == 1 ? (
                    <TouchableOpacity>
                      {t.imageIcon(
                        props.objectArray.products_type === 0 &&
                      props.objectArray.defaultStock <= 0 &&
                      // eslint-disable-next-line eqeqeq
                      props.inventory == 1
                          ? theme.outOfStockBtnColor
                          : theme.addToCartBagBtnColor,
                        theme.otherBtnsColor,
                        16,
                        14
                      )}
                    </TouchableOpacity>
                  ) : props.objectArray.products_type === 0 ? (
                    <TouchableOpacity
                      style={{}}
                      // onPress={() => {
                      //   if (t.newMethod3(props, t) !== 1) {
                      //   }
                      // }}
                      onPress={() => {
                        t.newMethod6(props, t) // add to cart
                      }}>
                      {t.imageIcon(
                        theme.addToCartBagBtnColor,
                        theme.otherBtnsColor,
                        16,
                        14
                      )}
                    </TouchableOpacity>
                  ) : props.objectArray.products_type === 1 ||
                props.objectArray.products_type === 2 ||
                props.objectArray.products_type === 3 ? (
                      <TouchableOpacity
                        onPress={() => {
                          props.navigation.push('ProductDetails', {
                            objectArray: props.objectArray //
                          })
                        }}>
                        {t.imageIcon(
                          theme.addToCartBagBtnColor,
                          theme.otherBtnsColor,
                          16,
                          14
                        )}
                      </TouchableOpacity>
                    ) : null}
            </View>
          </View>
          {t.props.dataName === 'Flash' ? (
            <Timer
              props={t.props}
              widthPic={widthPic}
              t={t}
              text={null}
              objectArray={props.objectArray}
              s={s}
              btnWidth={btnWidth}></Timer>
          ) : null}
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
                shadowOffset: { width: 1, height: 1 },
                shadowColor: theme.textColor,
                shadowOpacity: 0.5,
                elevation: 3
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
                  backgroundColor: theme.removeBtnColor
                }}>
                <Text
                  style={{
                    color: theme.removeBtnTextColor,
                    fontSize: theme.mediumSize + 1,
                    fontWeight: '500'
                  }}>
                  {t.props.language.Remove}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}

          {t.props.recentViewedProducts && props.recent ? (
            <TouchableOpacity
              style={{
                margin: 5,
                width: btnWidth,
                marginBottom: 3,
                marginTop: 0,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                shadowOffset: { width: 1, height: 1 },
                shadowColor: theme.textColor,
                shadowOpacity: 0.5,
                elevation: 3
              }}
              onPress={() => t.removeRecent(props, t)}>
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
                  backgroundColor: theme.removeBtnColor
                }}>
                <Text
                  style={{
                    color: theme.removeBtnTextColor,
                    fontSize: theme.mediumSize + 1,
                    fontWeight: '500'
                  }}>
                  {t.props.language.Remove}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  </View>
)
