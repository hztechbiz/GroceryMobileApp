import React from 'react'
import { View, TouchableOpacity, Text, Platform } from 'react-native'
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
      borderRadius: 20 / 2
    }}>
    {/* /// ///////////////////////////////////////////////////// 2nd */}
    <View
      style={{
        backgroundColor: theme.backgroundColor,
        borderRadius: 20 / 2
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
          borderRadius: 20 / 2
        }}>
        <TouchableOpacity
          style={{
            flex: 2,
            borderRadius: 20 / 2
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
            source={{ uri: theme.url + '/' + props.objectArray.products_image }}>
          </ImageLoad>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: theme.backgroundColor,
              padding: 6,
              width: 65,
              borderBottomRightRadius: 15,
              borderTopRightRadius: 12,
              borderTopLeftRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -1,
              position: 'absolute'
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
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            padding: 1,
            margin: 1,
            marginBottom: 0,
            paddingBottom: 3,
            paddingTop: 2,
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
                    paddingTop: 0,
                    paddingBottom: 2
                  }}>
                  <Text
                    style={{
                      fontSize: theme.mediumSize - 3,
                      fontFamily: 'Roboto',
                      textAlign: 'center',
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
