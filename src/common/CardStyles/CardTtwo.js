import React from 'react'
import { View, TouchableOpacity, Text, I18nManager, Platform } from 'react-native'
import ImageLoad from '../RnImagePlaceH'
import theme from '../Theme.style'
import Timer from '../Timer'
import Icon from 'react-native-vector-icons/FontAwesome'
import Counter from '../CounterCard'
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
      marginBottom: 8
    }}>
    {/* /// ///////////////////////////////////////////////////// 2nd */}
    <View
      style={{
        backgroundColor: theme.backgroundColor
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
          backgroundColor: theme.backgroundColor
        }}>
        <TouchableOpacity
          style={{
            flex: 2
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
              backgroundColor: 'rgb(236, 236, 236)'
            }}
            source={{ uri: theme.url + '/' + props.objectArray.products_image }}>
          </ImageLoad>
          {props.objectArray.flash_price === undefined ? (
            <View style={{ right: 7, position: 'absolute', top: 7 }}>
              {t.checkWishList(props, t) === 1 ? (
                props.removeButton ? (
                  <Icon
                    style={{
                      color: '#2E2E2E',
                      fontSize: 19
                    }}
                    active
                    name='heart'
                    onPress={() => {
                      t.removeWishlist(props, t)
                    }}
                  />
                ) : (
                  <Icon
                    style={{
                      color: '#2E2E2E',
                      fontSize: 19
                    }}
                    active
                    name='heart'
                    onPress={() => {
                      t.removeWishlist(props, t)
                    }}
                  />
                )
              ) : (
                <Icon
                  style={{
                    color: '#2E2E2E',
                    fontSize: 17,
                    marginTop: Platform.OS === 'ios' ? 3 : 2,
                    marginBottom: Platform.OS === 'ios' ? 2 : 2
                  }}
                  active
                  name='heart-o'
                  onPress={() => {
                    t.addWishlist(props, t)
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
              fontSize: theme.mediumSize,
              fontFamily: 'Roboto',
              writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
              color: theme.textColor,
              margin: 0,
              padding: 5,
              paddingTop: Platform.OS === 'android' ? 1 : 2,
              paddingBottom: 0,
              marginBottom: 0,
              marginLeft: -2,
              width: widthPic
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
                    paddingBottom: 0
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
                      marginLeft: -4,
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
              paddingBottom: 3
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 2
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

            {/// ///////////////
              props.objectArray.products_type === 0 &&
            props.objectArray.defaultStock <= 0 &&
            // eslint-disable-next-line eqeqeq
            props.inventory == 1 ? (
                  <TouchableOpacity
                    style={{
                      width: 16,
                      height: 17,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      backgroundColor: '#2E2E2E',
                      borderRadius: 16 / 2,
                      marginBottom: 2,
                      marginTop: 3
                    }}>
                    <Text
                      style={{
                        color: '#ffffff',
                        fontSize: theme.largeSize,
                        height: Platform.OS === 'ios' ? 20 : 23
                      }}>
                      {'+'}
                    </Text>
                  </TouchableOpacity>
                ) : props.objectArray.products_type === 0 ? (
                  <Counter
                    width={24}
                    height={1}
                    minimumValue={0}
                    innerRef={stepper => {
                      t.state.stepperArray[props.objectArray.id] = stepper
                    }}
                    initialValue={t.state.counter}
                    onIncrement={() => {
                      t.newMethod6(props, t)
                    }}
                  />
                ) : props.objectArray.products_type === 1 ||
              props.objectArray.products_type === 2 ||
              props.objectArray.products_type === 3 ? (
                    <TouchableOpacity
                      onPress={() => {
                        props.navigation.push('ProductDetails', {
                          objectArray: props.objectArray //
                        })
                      }}>
                      <TouchableOpacity
                        style={{
                          width: 16,
                          height: 17,
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                          backgroundColor: theme.textColor,
                          borderRadius: 16 / 2,
                          marginBottom: 2,
                          marginTop: Platform.OS === 'android' ? 2.5 : 0
                        }}
                        onPress={() => {
                          props.navigation.push('ProductDetails', {
                            objectArray: props.objectArray //
                          })
                        }}>
                        <Text
                          style={{
                            color: '#ffffff',
                            fontSize: theme.largeSize,
                            height: Platform.OS === 'ios' ? 20 : 23
                          }}>
                          {'+'}
                        </Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
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
