import React from 'react'
import { View, TouchableOpacity, Text, Platform } from 'react-native'
import ImageLoad from '../RnImagePlaceH'
import { Icon } from 'native-base'
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
      borderTopLeftRadius: 15 / 2,
      borderTopRightRadius: 15 / 2
    }}>
    {t.newMethod3(props, t) === 1 ? (
      <View
        style={{
          width: widthPic,
          zIndex: 2,
          position: 'absolute'
        }}>
        <Icon
          style={{
            paddingTop: widthPic * 0.5,
            color: 'green',
            fontSize: 30,
            alignSelf: 'center'
          }}
          name='checkmark-circle'
          size={40}
          onPress={() =>
            props.navigation.push('ProductDetails', {
              objectArray: props.objectArray //
            })
          }
        />
      </View>
    ) : null}
    {t.newMethod3(props, t) === 1 ? (
      t.props.recentViewedProducts && props.recent ? (
        <TouchableOpacity
          style={{
            width: btnWidth / 2,
            shadowOffset: { width: 1, height: 1 },
            shadowColor: theme.textColor,
            shadowOpacity: 0.5,
            elevation: 3,
            position: 'absolute',
            bottom: 0,
            right: 0
          }}
          onPress={() => t.removeRecent(props, t)}>
          <View
            style={{
              padding: 5,
              margin: 5,
              width: btnWidth / 2,
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
                fontSize: theme.smallSize - 2,
                fontWeight: '500'
              }}>
              {t.props.language.Remove}
            </Text>
          </View>
        </TouchableOpacity>
      ) : props.removeButton ? (
        <TouchableOpacity
          style={{
            width: btnWidth / 2,
            shadowOffset: { width: 1, height: 1 },
            shadowColor: theme.textColor,
            shadowOpacity: 0.5,
            elevation: 3,
            position: 'absolute',
            bottom: 0,
            right: 0
          }}
          onPress={() => t.removeWishlist(props, t)}>
          <View
            style={{
              padding: 5,
              margin: 5,
              width: btnWidth / 2,
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
                fontSize: theme.smallSize - 2,
                fontWeight: '500'
              }}>
              {t.props.language.Remove}
            </Text>
          </View>
        </TouchableOpacity>
      ) : null
    ) : null}
    {/* /// ///////////////////////////////////////////////////// 2nd */}
    <View
      style={{
        backgroundColor: theme.backgroundColor,
        borderTopLeftRadius: 15 / 2,
        borderTopRightRadius: 15 / 2,
        opacity: t.newMethod3(props, t) === 1 ? 0.1 : 1
      }}>
      <View
        style={{
          backgroundColor: theme.backgroundColor,
          borderTopLeftRadius: 15 / 2,
          borderTopRightRadius: 15 / 2
        }}>
        <TouchableOpacity
          style={{
            flex: 2,
            borderTopLeftRadius: 15 / 2,
            borderTopRightRadius: 15 / 2
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
              borderTopLeftRadius: 15 / 2,
              borderTopRightRadius: 15 / 2
            }}
            source={{
              uri: theme.url + '/' + props.objectArray.products_image
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
              paddingLeft: 3,
              paddingTop: 2,
              width: widthPic
              // paddingLeft: 1
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
            <View>
              {t.props.recentViewedProducts && props.recent ? null : props
                .objectArray.products_type === 0 &&
                props.objectArray.defaultStock <= 0 &&
                !props.removeButton &&
                t.props.dataName !== 'Flash' &&
                // eslint-disable-next-line eqeqeq
                props.inventory == 1 ? (
                  <TouchableOpacity
                    style={{
                      width: btnWidth / 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      shadowOffset: { width: 1, height: 1 },
                      shadowColor: theme.textColor,
                      shadowOpacity: 0.5,
                      elevation: 3
                    }}>
                    <View
                      style={{
                        padding: 5,
                        margin: 5,
                        width: btnWidth / 2,

                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        marginTop: 0,
                        marginBottom: 0,
                        backgroundColor: theme.outOfStockBtnColor
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          color: theme.outOfStockBtnTextColor,
                          fontSize: theme.smallSize - 2,
                          fontWeight: '500'
                        }}>
                        {t.props.language['Out of Stock']}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : t.props.dataName === 'Flash' ? (
                  null
                ) : props.objectArray.products_type === 0 &&
                !props.removeButton &&
                t.props.dataName !== 'Flash' ? (
                    <TouchableOpacity
                      style={{
                        width: btnWidth / 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        shadowOffset: { width: 1, height: 1 },
                        shadowColor: theme.textColor,
                        shadowOpacity: 0.5,
                        elevation: 3
                      }}
                      onPress={() => {
                        if (t.newMethod3(props, t) !== 1) {
                          t.newMethod6(props, t)
                        }
                      }}>
                      <View
                        style={{
                          padding: 5,
                          margin: 5,
                          width: btnWidth / 2,
                          backgroundColor: theme.primary,
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                          marginTop: 0,
                          marginBottom: 0
                        }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            color: theme.addToCartBtnTextColor,
                            fontSize: theme.smallSize - 2,
                            fontWeight: '500'
                          }}>
                          {t.props.language['Add to Cart']}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : props.objectArray.products_type === 1 ||
                props.objectArray.products_type === 2 ||
                props.objectArray.products_type === 3 ||
                  !props.removeButton ? (
                      <TouchableOpacity
                        style={{
                          width: btnWidth / 2,
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                          shadowOffset: { width: 1, height: 1 },
                          shadowColor: theme.textColor,
                          shadowOpacity: 0.5,
                          elevation: 3
                        }}
                        onPress={() => {
                          if (t.newMethod3(props, t) !== 1) {
                            props.navigation.push('ProductDetails', {
                              objectArray: props.objectArray //
                            })
                          }
                        }}>
                        <View
                          style={{
                            padding: 5,
                            margin: 5,
                            width: btnWidth / 2,
                            backgroundColor: theme.primary,
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            marginTop: 0,
                            marginBottom: 0
                          }}>
                          <Text
                            numberOfLines={1}
                            style={{
                              color: theme.detailsBtnTextColor,
                              fontSize: theme.smallSize - 2,
                              fontWeight: '500'
                            }}>
                            {t.props.language2.Details}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ) : null}

              {t.props.recentViewedProducts &&
              props.recent &&
              t.props.dataName !== 'Flash' ? (
                  <TouchableOpacity
                    style={{
                      width: btnWidth / 2,
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
                        width: btnWidth / 2,
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
                          fontSize: theme.smallSize - 2,
                          fontWeight: '500'
                        }}>
                        {t.props.language.Remove}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
              {props.removeButton && t.props.dataName !== 'Flash' ? (
                <TouchableOpacity
                  style={{
                    width: btnWidth / 2,
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
                      width: btnWidth / 2,
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
                        fontSize: theme.smallSize - 2,
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
    </View>

    {t.props.dataName === 'Flash' ? (
      <View style={{ marginTop: 5 }}>
        <Timer
          props={t.props}
          widthPic={widthPic}
          t={t}
          text={null}
          objectArray={props.objectArray}
          s={s}
          btnWidth={btnWidth}></Timer>
      </View>
    ) : null}
  </View>
)
