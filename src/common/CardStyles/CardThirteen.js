import React from 'react'
import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native'
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
      marginBottom: 8,
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
              backgroundColor: theme.backgroundColor,
              borderRadius: 20 / 2
            }}
            source={{ uri: theme.url + '/' + props.objectArray.products_image }}>
          </ImageLoad>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#EBEBEB',
              borderRadius: 45 / 2,
              height: 45,
              width: 45,
              position: 'absolute',
              right: 5,
              top: 5
            }}>
            {props.objectArray.regular_price !== '' ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                {props.objectArray.flash_price !== undefined ? (
                  <View style={{ flexDirection: 'row' }}>
                    {t.priceFun(
                      theme.smallSize - 3,
                      props.objectArray.products_price,
                      'line-through'
                    )}
                  </View>
                ) : null}

                {props.objectArray.flash_price === undefined ? (
                  <View style={{ flexDirection: 'row' }}>
                    {props.objectArray.discount_price !== null &&
                      props.objectArray.discount_price !== undefined
                      ? t.priceFun(
                        theme.smallSize - 3,
                        props.objectArray.products_price,
                        'line-through'
                      )
                      : null}
                  </View>
                ) : null}
              </View>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              {props.objectArray.flash_price !== undefined ? (
                <View style={{ flexDirection: 'row' }}>
                  {t.priceFun(
                    theme.smallSize - 2,
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
                      theme.smallSize - 2,
                      props.objectArray.products_price,
                      'none',
                      false
                    )
                    : null}

                  {props.objectArray.discount_price !== null
                    ? t.priceFun(
                      theme.smallSize - 2,
                      props.objectArray.discount_price,
                      'none',
                      false
                    )
                    : null}
                </View>
              ) : null}
            </View>
          </View>
          {t.checkProductNew(props) ? (
            <View
              style={{
                backgroundColor: '#1473E6',
                zIndex: 6,
                textAlign: 'center',
                padding: 5,
                borderTopLeftRadius: 0,
                borderBottomRightRadius: 20 / 4,
                borderTopRightRadius: 20 / 4,
                paddingRight: 7,
                left: 0,
                top:
                    props.objectArray.on_sale && props.objectArray.featured
                      ? 55
                      : props.objectArray.on_sale
                        ? 32
                        : 10,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                fontWeight: '400',
                borderRadius: 2
              }}>
              <Text style={{ color: '#fff', fontSize: 8 }}>
                {t.props.language.New}
              </Text>
            </View>
          ) : null}
          {props.objectArray.on_sale ? (
            <View
              style={{
                backgroundColor: '#D50000',
                zIndex: 6,
                textAlign: 'center',
                padding: 4,
                paddingRight: 5,
                borderBottomRightRadius: 20 / 4,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 20 / 4,
                left: 0,
                top: 10,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                fontWeight: '400',
                borderRadius: 2
              }}>
              <Text style={{ color: '#fff', fontSize: 8 }}>
                {t.props.language['On Sale']}
              </Text>
            </View>
          ) : null}
          {props.objectArray.featured ? (
            <View
              style={{
                backgroundColor: '#047800',
                zIndex: 6,
                textAlign: 'center',
                padding: 5,
                borderTopLeftRadius: props.objectArray.on_sale ? 0 : 20 / 4,
                borderBottomRightRadius: 20 / 4,
                borderTopRightRadius: 20 / 4,
                left: 0,
                top: !props.objectArray.on_sale ? 10 : 32,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                fontWeight: '400',
                borderRadius: 2
              }}>
              <Text style={{ color: '#fff', fontSize: 8 }}>
                {t.props.language.Featured}
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
            paddingBottom: 0,
            paddingTop: 1,
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
              paddingTop: Platform.OS === 'android' ? 2 : 3,
              paddingBottom: 0,
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
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 2,
              marginBottom: 0,
              padding: 5,
              paddingLeft: 6,
              paddingTop: 0,
              paddingBottom: 3
            }}>
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
