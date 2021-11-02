import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  I18nManager,
  Platform,
  StyleSheet
} from 'react-native'
import ImageLoad from '../RnImagePlaceH'
import Stars from 'react-native-stars'
import Timer from '../Timer'
import { Icon } from 'native-base'
import Ionicons from 'react-native-vector-icons/FontAwesome'
import theme from '../Theme.style'
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
          {props.objectArray.flash_price === undefined ? (
            <View
              style={{
                zIndex: 6,
                textAlign: 'center',
                padding: 1,
                right: 4,
                shadowOffset: { width: 1, height: 1 },
                shadowColor: theme.textColor,
                shadowOpacity: 0.2,
                elevation: 2,
                bottom: -10,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                borderWidth: 5,
                borderColor: '#DE0101',
                backgroundColor: '#DE0101',
                borderRadius: 20
              }}>
              {t.checkWishList(props, t) === 1 ? (
                props.removeButton ? (
                  <Icon
                    style={{
                      color: '#fff',
                      fontSize: 13,
                      paddingLeft: 1,
                      paddingRight: 1,
                      marginBottom: -1
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
                      fontSize: 13,
                      paddingLeft: 1,
                      paddingRight: 1,
                      marginBottom: -1
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
                    fontSize: 13,
                    marginBottom: -2,
                    marginLeft: -1,
                    marginRight: -1
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
              fontSize: theme.mediumSize - 1,
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

          <View
            style={{
              backgroundColor: 'transparent',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 2,
              marginBottom: 0,
              padding: 5,
              paddingLeft: 0,
              paddingTop: 0,
              paddingBottom: 3
            }}>
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
              <Stars
                disabled
                default={parseFloat(props.objectArray.rating)}
                count={5}
                starSize={12}
                half
                fullStar={<Icon name={'star'} style={[styles.myStarStyle]} />}
                emptyStar={
                  <Icon
                    name={'star-outline'}
                    style={[styles.myStarStyle, styles.myEmptyStarStyle]}
                  />
                }
                halfStar={
                  <Icon name={'star-half'} style={[styles.myStarStyle]} />
                }
              />
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
/// /////////////////////////////////////////////
const styles = StyleSheet.create({
  myStarStyle: {
    color: '#FCA800',
    backgroundColor: 'transparent',
    fontSize: 16
  },
  myEmptyStarStyle: {
    color: '#cccccc'
  }
})
