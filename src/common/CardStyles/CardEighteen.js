import React from 'react'
import { View, TouchableOpacity, Text, Platform, I18nManager } from 'react-native'
import ImageLoad from '../RnImagePlaceH'
import { Icon } from 'native-base'
import Ionicons from 'react-native-vector-icons/FontAwesome'
import theme from '../Theme.style'
import Timer from '../Timer'
export default CardOne = ({ props, widthPic, t, s, btnWidth }) => (
  <View
    style={{
      backgroundColor: theme.backgroundColor,
      width: widthPic,
      margin: 5,
      marginBottom: 5,
      marginLeft: 5,
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
              height: widthPic * 1.1,
              width: widthPic,
              backgroundColor:
                t.props.card_style === 12
                  ? '#fff'
                  : 'rgb(236, 236, 236)',
              borderRadius: 0
            }}
            source={{ uri: theme.image_url + '/' + props.objectArray.products_image }}>
          </ImageLoad>
          {props.objectArray.flash_price === undefined ? (
            <View style={{ right: 7, position: 'absolute', top: 7 }}>
              {t.checkWishList(props, t) === 1 ? (
                props.removeButton ? (
                  <Icon
                    style={{
                      color: '#fff',
                      fontSize: 19
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
                      color: '#fff',
                      fontSize: 19
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
                    color: '#fff',
                    fontSize: 17,
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
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignSelf: 'flex-start',
            padding: 1,
            margin: 0,
            marginBottom: 0,
            paddingBottom: 0,
            paddingTop: 0,
            marginTop: 0,
            width: widthPic,
            backgroundColor: theme.backgroundColor
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              alignSelf: 'center',
              alignItems: 'center',
              padding: 1,
              margin: 1,
              marginBottom: 0,
              paddingBottom: 0,
              paddingTop: 0,
              marginTop: 0,
              width: widthPic,
              flexDirection: 'row'
            }}>
            <Text
              style={{
                fontSize: theme.mediumSize - 1,
                fontFamily: 'Roboto',
                writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
                color: theme.textColor,
                margin: 0,
                padding: 5,
                paddingTop: 0,
                paddingLeft: 3,
                paddingBottom: 0,
                marginBottom: 0,
                fontWeight: '400',
                width: widthPic / 1.2
              }}
              numberOfLines={1}>
              {props.objectArray.products_name}
            </Text>
            <View>
              {/// ///////////////
                props.objectArray.products_type === 0 &&
              props.objectArray.defaultStock <= 0 &&
              // eslint-disable-next-line eqeqeq
              props.inventory == 1 ? (
                    <TouchableOpacity>
                      <Icon
                        style={{
                          color: '#404040',
                          fontSize: 18,
                          marginBottom: -4
                        }}
                        active
                        name='md-add'
                      />
                    </TouchableOpacity>
                  ) : props.objectArray.products_type === 0 ? (
                    <Icon
                      style={{
                        color: '#404040',
                        fontSize: 18,
                        marginBottom: -4
                      }}
                      active
                      name='md-add'
                      onPress={() => {
                        t.newMethod6(props, t) // add to cart
                      }}
                    />
                  ) : props.objectArray.products_type === 1 ||
                props.objectArray.products_type === 2 ||
                props.objectArray.products_type === 3 ? (
                      <Icon
                        style={{
                          color: '#404040',
                          fontSize: 18,
                          marginBottom: -4
                        }}
                        active
                        name='md-add'
                        onPress={() => {
                          props.navigation.push('ProductDetails', {
                            objectArray: props.objectArray //
                          })
                        }}
                      />
                    ) : null}
            </View>
          </View>
        </View>
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
                  paddingBottom: 0
                }}>
                <Text
                  style={{
                    fontSize: theme.mediumSize - 3,
                    fontFamily: 'Roboto',
                    textAlign: 'center',
                    color: '#313131',
                    margin: 0,
                    marginLeft: -4,
                    marginTop: -1,
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
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: theme.backgroundColor,
            width: widthPic,
            paddingLeft: 5,
            marginBottom: 2
          }}>
          {props.objectArray.flash_price !== undefined ? (
            <View style={{ marginLeft: 0 }}>
              {t.priceFun(
                theme.mediumSize - 1,
                props.objectArray.flash_price,
                'none'
              )}
            </View>
          ) : null}

          {props.objectArray.flash_price === undefined ? (
            <View style={{ marginLeft: 0 }}>
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
  </View>
)
/// /////////////////////////////////////////////
