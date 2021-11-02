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
      width: widthPic,
      margin: 5,
      marginBottom: 2,
      borderRadius: 0
    }}>
    {/* /// ///////////////////////////////////////////////////// 2nd */}
    <View
      style={{
        backgroundColor: theme.backgroundColor,
        borderRadius: 0
      }}>
      <View
        style={{
          backgroundColor: theme.backgroundColor,
          borderRadius: 0
        }}>
        <TouchableOpacity
          style={{
            flex: 2,
            borderRadius: 0
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
              borderRadius: 0
            }}
            source={{ uri: theme.url + '/' + props.objectArray.products_image }}>
          </ImageLoad>
          <View
            style={{
              justifyContent: 'center',
              alignContent: 'center',
              flexDirection: 'row',
              position: 'absolute',
              paddingTop: 3,
              width: widthPic,
              bottom: 0
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignSelf: 'center',
                padding: 1,
                margin: 1,
                marginBottom: 0,
                paddingBottom: 1,
                paddingTop: 0,
                marginTop: 0
              }}>
              {props.removeButton ? (
                <TouchableOpacity onPress={() => t.removeWishlist(props, t)}>
                  <View
                    style={{
                      padding: 6,
                      margin: 2,
                      marginRight: 0,
                      width: btnWidth * 0.59,
                      backgroundColor: theme.backgroundColor,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      marginTop: 0,
                      paddingBottom: Platform.OS === 'ios' ? 7 : 5.1,
                      marginBottom: 7
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: theme.textColor,
                        fontSize: theme.mediumSize - 2,
                        fontWeight: '500'
                      }}>
                      {t.props.language.Remove}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : t.props.recentViewedProducts &&
                  props.recent ? null : props.objectArray.products_type === 0 &&
                  props.objectArray.defaultStock <= 0 &&
                  // eslint-disable-next-line eqeqeq
                  props.inventory == 1 ? (
                    <TouchableOpacity
                      style={{
                        margin: 5,
                        width: btnWidth * 0.5,
                        marginBottom: 3,
                        marginTop: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center'
                      }}>
                      <View
                        style={{
                          padding: 6,
                          margin: 5,
                          width: btnWidth * 0.59,
                          backgroundColor: theme.backgroundColor,
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                          marginTop: 0,
                          paddingBottom: 7
                        }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            color: theme.textColor,
                            fontSize: theme.mediumSize - 2,
                            fontWeight: '500'
                          }}>
                          {t.props.language['Out of Stock']}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : props.objectArray.products_type === 0 ? (
                    <TouchableOpacity
                      style={{
                        margin: 5,
                        width: btnWidth * 0.5,
                        marginBottom: 3,
                        marginTop: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center'
                      }}
                      onPress={() => {
                        t.newMethod6(props, t)
                      }}>
                      <View
                        style={{
                          padding: Platform.OS === 'ios' ? 5 : 5.2,
                          margin: 5,
                          width: btnWidth * 0.63,
                          backgroundColor: theme.backgroundColor,
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                          marginTop: 0,
                          flexDirection: 'row',
                          marginLeft: -2
                        }}>
                        <Text
                          numberOfLines={1}
                          style={{
                            color: theme.textColor,
                            fontSize: theme.mediumSize - 3,
                            fontWeight: '500',
                            paddingRight: 3
                          }}>
                          {t.props.language['Add to Cart']}
                        </Text>
                        <Icon
                          style={{
                            color: theme.textColor,
                            fontSize: 16,
                            backgroundColor: theme.backgroundColor,
                            paddingRight: 3
                          }}
                          active
                          name='cart'
                        />
                      </View>
                    </TouchableOpacity>
                  ) : props.objectArray.products_type === 1 ||
                  props.objectArray.products_type === 2 ||
                  props.objectArray.products_type === 3 ? (
                      <TouchableOpacity
                        style={{
                          margin: 5,
                          width: btnWidth * 0.5,
                          marginBottom: 3,
                          marginTop: 0,
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center'
                        }}
                        onPress={() => {
                          props.navigation.push('ProductDetails', {
                            objectArray: props.objectArray //
                          })
                        }}>
                        <View
                          style={{
                            padding: 6,
                            margin: 5,
                            width: btnWidth * 0.59,
                            backgroundColor: theme.backgroundColor,
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            marginTop: 0,
                            paddingBottom: Platform.OS === 'ios' ? 7 : 5
                          }}>
                          <Text
                            numberOfLines={1}
                            style={{
                              color: theme.textColor,
                              fontSize: theme.mediumSize - 2,
                              fontWeight: '500'
                            }}>
                            {t.props.language2.Details}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ) : null}

              {t.props.recentViewedProducts &&
                props.recent ? (
                  <TouchableOpacity
                    style={{
                      margin: 5,
                      width: btnWidth * 0.5,
                      marginBottom: 3,
                      marginTop: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center'
                    }}
                    onPress={() => t.removeRecent(props, t)}>
                    <View
                      style={{
                        padding: 6,
                        margin: 5,
                        width: btnWidth * 0.59,
                        backgroundColor: theme.backgroundColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        marginTop: 0,
                        paddingBottom: Platform.OS === 'ios' ? 7 : 5.2
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          color: theme.textColor,
                          fontSize: theme.mediumSize - 2,
                          fontWeight: '500'
                        }}>
                        {t.props.language.Remove}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
            </View>
            {props.objectArray.flash_price === undefined ? (
              <View>
                {t.checkWishList(props, t) === 1 ? (
                  props.removeButton ? (
                    <Icon
                      style={{
                        color: theme.textColor,
                        fontSize: 16,
                        backgroundColor: theme.backgroundColor,
                        padding: 6,
                        paddingBottom: Platform.OS === 'ios' ? 3 : 4.5,
                        paddingLeft: 8,
                        paddingRight: 8,
                        marginLeft: 3
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
                        color: theme.textColor,
                        fontSize: 16,
                        backgroundColor: theme.backgroundColor,
                        padding: 6,
                        paddingBottom: Platform.OS === 'ios' ? 3 : 4.5,
                        paddingLeft: 8,
                        paddingRight: 8,
                        marginLeft: 3
                      }}
                      active
                      name='heart'
                      onPress={() => {
                        t.removeWishlist(props, t)
                      }}
                    />
                  )
                ) : (
                  <Ionicons
                    style={{
                      color: theme.textColor,
                      fontSize: 16,
                      backgroundColor: theme.backgroundColor,
                      padding: 6,
                      paddingBottom: 5,
                      paddingLeft: 7,
                      paddingRight: 7,
                      marginLeft: 3
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
          </View>
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
          {props.objectArray !== null && props.objectArray !== undefined ? (
            props.objectArray.categories !== null &&
            props.objectArray.categories !== undefined &&
            props.objectArray.categories.length > 0 ? (
                <View
                  style={{
                    backgroundColor: theme.backgroundColor,
                    padding: 8,
                    paddingTop: 1,
                    paddingBottom: 0
                  }}>
                  <Text
                    style={{
                      fontSize: theme.mediumSize - 2,
                      fontFamily: 'Roboto',
                      textAlign: 'center',
                      color: '#313131',
                      margin: 0,
                      marginLeft: -4,
                      marginTop: 0,
                      paddingBottom: 0,
                      marginBottom: 0
                    }}
                    numberOfLines={1}>
                    {t.getCategoryName()}
                  </Text>
                </View>
              ) : null
          ) : null}
          <Text
            style={{
              fontSize: theme.mediumSize - 1,
              fontFamily: 'Roboto',
              textAlign: 'center',
              color: theme.textColor,
              margin: 0,
              padding: 2,
              paddingTop: 0,
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
              marginTop: 0,
              marginBottom: 0,
              padding: 2,
              paddingLeft: 2,
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
          </View>
        </View>
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
