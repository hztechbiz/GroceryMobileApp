import React from 'react'
import { View, TouchableOpacity, Text, Platform } from 'react-native'
import ImageLoad from '../RnImagePlaceH'
import { Icon } from 'native-base'
import Timer from '../Timer'
import Ionicons from 'react-native-vector-icons/FontAwesome'
import theme from '../Theme.style'
export default CardOne = ({ props, widthPic, t, s, btnWidth }) => (
  <View
    style={{
      backgroundColor: theme.backgroundColor,
      width: widthPic * 0.96,
      margin: 5,
      marginBottom: 5,
      marginLeft: 7,
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
              borderRadius: 30 / 2
            }}
            source={{ uri: theme.url + '/' + props.objectArray.products_image }}>
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
              justifyContent: 'center',
              alignSelf: 'center',
              padding: 1,
              margin: 1,
              marginBottom: 0,
              paddingBottom: 0,
              paddingTop: 0,
              marginTop: 0,
              width: widthPic
            }}>
            <Text
              style={{
                fontSize: theme.mediumSize,
                fontFamily: 'Roboto',
                textAlign: 'center',
                color: theme.textColor,
                margin: 0,
                padding: 5,
                paddingTop: Platform.OS === 'android' ? 1 : 2,
                paddingBottom: 0,
                marginBottom: 0,
                fontWeight: '400',
                width: widthPic
              }}
              numberOfLines={1}>
              {props.objectArray.products_name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme.backgroundColor,
              marginBottom: 2
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
                  'none',
                  false
                )}
              </View>
            ) : null}

            {props.objectArray.flash_price === undefined ? (
              <View style={{ flexDirection: 'row' }}>
                {props.objectArray.discount_price === null
                  ? t.priceFun(
                    theme.mediumSize - 1,
                    props.objectArray.products_price,
                    'none',
                    false
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
                    'none',
                    false
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
/// /////////////////////////////////////////////
