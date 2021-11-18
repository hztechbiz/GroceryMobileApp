import React from 'react'
import { View, TouchableOpacity, Text, Platform } from 'react-native'
import ImageLoad from '../RnImagePlaceH'
import Ionicons from 'react-native-vector-icons/FontAwesome'
import { Icon } from 'native-base'
import theme from '../Theme.style'
import Timer from '../Timer'
export default CardOne = ({ props, widthPic, t, btnWidth, s }) => (
  <View
    style={{
      backgroundColor: theme.backgroundColor,
      width: widthPic,
      shadowOffset: { width: 1, height: 1 },
      shadowColor: theme.textColor,
      shadowOpacity: 0.3,
      elevation: 3,
      margin: 5,
      marginBottom: 8,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0
    }}>
    {/* /// ///////////////////////////////////////////////////// 2nd */}
    <View
      style={{
        backgroundColor: theme.backgroundColor,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0
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
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0
        }}>
        <TouchableOpacity
          style={{
            flex: 2,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0
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
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0
            }}
            source={{
              uri: theme.image_url + '/' + props.objectArray.products_image
            }}></ImageLoad>
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignSelf: 'center',
            paddingTop: 0,
            marginTop: 0,
            width: widthPic
          }}>
          <Text
            style={{
              fontSize: theme.mediumSize,
              fontFamily: 'Roboto',
              textAlign: 'center',
              color: '#2D2D2D',
              margin: 0,
              padding: 5,
              paddingTop: Platform.OS === 'android' ? 3 : 4,
              paddingBottom: 3,
              marginBottom: 0,
              fontWeight: '400',
              width: widthPic
            }}
            numberOfLines={1}>
            {props.objectArray.products_name}
          </Text>

          <View
            style={{
              backgroundColor: 'transparent',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 0,
              marginBottom: props.objectArray.flash_price === undefined ? 0 : 2,
              padding: 5,
              paddingLeft: 6,
              paddingTop: 0,
              paddingBottom: 1
            }}>
            {props.objectArray.flash_price === undefined ? (
              <View>
                {t.checkWishList(props, t) === 1 ? (
                  props.removeButton ? (
                    <Icon
                      style={{
                        color: theme.wishHeartBtnColor,
                        fontSize: 17
                      }}
                      active
                      name='heart'
                      onPress={() => {
                        if (t.newMethod3(props, t) !== 1) {
                          t.removeWishlist(props, t)
                        }
                      }}
                    />
                  ) : (
                    <Icon
                      style={{
                        color: theme.wishHeartBtnColor,
                        fontSize: 17
                      }}
                      active
                      name='heart'
                      onPress={() => {
                        if (t.newMethod3(props, t) !== 1) {
                          t.removeWishlist(props, t)
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
                      marginBottom: Platform.OS === 'ios' ? 2 : 2
                    }}
                    active
                    name='heart-o'
                    onPress={() => {
                      if (t.newMethod3(props, t) !== 1) {
                        t.addWishlist(props, t)
                      }
                    }}
                  />
                )}
              </View>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              {props.objectArray.flash_price !== undefined ? (
                <View style={{ marginLeft: 5 }}>
                  {t.priceFun(
                    theme.mediumSize - 1,
                    props.objectArray.flash_price,
                    'none'
                  )}
                </View>
              ) : null}

              {props.objectArray.flash_price === undefined ? (
                <View style={{ marginLeft: 5 }}>
                  {props.objectArray.discount_price === null
                    ? t.priceFun(
                      theme.mediumSize - 1,
                      props.objectArray.products_price,
                      'none'
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
            </View>
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
                      onPress={() => {
                        t.newMethod6(props, t)
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
                          if (t.newMethod3(props, t) !== 1) {
                            props.navigation.push('ProductDetails', {
                              objectArray: props.objectArray //
                            })
                          }
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
