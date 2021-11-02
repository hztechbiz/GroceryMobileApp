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
      marginBottom: 4,
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
            source={{ uri: theme.url + '/' + props.objectArray.products_image }}>
          </ImageLoad>
          {/// ///////////////
            props.objectArray.products_type === 0 &&
              props.objectArray.defaultStock <= 0 &&
              // eslint-disable-next-line eqeqeq
              props.inventory == 1 ? (
                <TouchableOpacity
                  style={{
                    zIndex: 6,
                    textAlign: 'center',
                    padding: 3,
                    paddingBottom: 1,
                    paddingTop: 1,
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
                    borderColor:
                      props.objectArray.products_type === 0 &&
                      props.objectArray.defaultStock <= 0 &&
                      // eslint-disable-next-line eqeqeq
                      props.inventory == 1
                        ? theme.outOfStockBtnColor
                        : '#FF4E00',
                    backgroundColor:
                      props.objectArray.products_type === 0 &&
                      props.objectArray.defaultStock <= 0 &&
                      // eslint-disable-next-line eqeqeq
                      props.inventory == 1
                        ? theme.outOfStockBtnColor
                        : '#FF4E00',
                    borderRadius: 20
                  }}>
                  {t.imageIcon('#fff', '#fff', 12, 10)}
                </TouchableOpacity>
              ) : props.objectArray.products_type === 0 ? (
                <TouchableOpacity
                  style={{
                    zIndex: 6,
                    textAlign: 'center',
                    padding: 3,
                    paddingBottom: 1,
                    paddingTop: 1,
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
                    borderColor:
                      t.newMethod3(t.props, t) === 1
                        ? theme.otherBtnsColor
                        : '#FF4E00',
                    backgroundColor:
                      t.newMethod3(t.props, t) === 1
                        ? theme.otherBtnsColor
                        : '#FF4E00',
                    borderRadius: 20
                  }}
                  onPress={() => {
                    t.newMethod6(props, t) // add to cart
                  }}
                >
                  {t.imageIcon('#fff', '#fff', 12, 10)}
                </TouchableOpacity>
              ) : props.objectArray.products_type === 1 ||
                props.objectArray.products_type === 2 ||
                props.objectArray.products_type === 3 ? (
                  <TouchableOpacity
                    style={{
                      zIndex: 6,
                      textAlign: 'center',
                      padding: 3,
                      paddingBottom: 1,
                      paddingTop: 1,
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
                      borderColor:
                      t.newMethod3(t.props, t) === 1
                        ? theme.otherBtnsColor
                        : '#FF4E00',
                      backgroundColor:
                      t.newMethod3(t.props, t) === 1
                        ? theme.otherBtnsColor
                        : '#FF4E00',
                      borderRadius: 20
                    }}
                    onPress={() => {
                      if (t.newMethod3(props, t) !== 1) {
                        props.navigation.push('ProductDetails', {
                          objectArray: props.objectArray //
                        })
                      }
                    }}>
                    {t.imageIcon('#fff', '#fff', 12, 10)}
                  </TouchableOpacity>
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
              fontSize: theme.mediumSize - 2,
              fontFamily: 'Roboto',
              writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
              color: theme.textColor,
              margin: 0,
              padding: 5,
              paddingTop: Platform.OS === 'android' ? 1 : 2,
              paddingBottom: 0,
              marginBottom: 0,
              fontWeight: '400',
              width: widthPic - 20
            }}
            numberOfLines={1}>
            {props.objectArray.products_name}
          </Text>

          <View
            style={{
              backgroundColor: 'transparent',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexDirection: 'column',
              marginTop: 2,
              marginBottom: 0,
              padding: 5,
              paddingLeft: 6,
              paddingTop: 0,
              paddingBottom: 3
            }}>
            {props.objectArray.flash_price !== undefined ? (
              <View style={{ flexDirection: 'row', paddingTop: 1 }}>
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
              <View style={{ flexDirection: 'row', paddingTop: 1 }}>
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
            <View style={{ marginTop: 2 }}>
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
    fontSize: 14
  },
  myEmptyStarStyle: {
    color: '#cccccc'
  }
})
