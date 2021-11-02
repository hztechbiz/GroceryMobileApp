import React, { PureComponent } from 'react'
import {
  View,
  Text,
  Platform,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native'

import themeStyle from '../common/Theme.style.js'
import { Icon } from 'native-base'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { ScrollView } from 'react-native-gesture-handler'
const WIDTH = Dimensions.get('window').width
const Height = Dimensions.get('window').height
const DrawerWidth2 = WIDTH * 0.78
const DrawerHeight2 = Height * 0.78
class App extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      attributes: [],
      tempmYarray: [0, 500],
      tempmYarray2: [0, 500],
      maxAmount: 500,
      minAmount: 0,
      price: { lower: 0, upper: 500 }
    }
  }

  butn = text => {
    return text === this.props.cartItems2.Config.languageJson.Reset ? (
      <TouchableOpacity
        disabled={
          this.props.navigation.state.routes[0].routes[0].params !== undefined
            ? !this.props.navigation.state.routes[0].routes[0].params
              .applyFilter2
            : true
        }
        onPress={text => {
          if (this.props.navigation.state.routes[0].routes[0].params !== undefined) {
            if (this.props.navigation.state.routes[0].routes[0].params.applyFilter2) {
              this.props.navigation.state.routes[0].routes[0].params.resetFilters()
            }
          }
        }}>
        <View
          style={{
            alignItems: 'center',
            height: 38,
            width: WIDTH * 0.2,
            backgroundColor: 'transparent',
            justifyContent: 'center'
          }}>
          <Text
            style={{
              textAlign: 'center',
              color:
                this.props.navigation.state.routes[0].routes[0].params !==
                undefined
                  ? this.props.navigation.state.routes[0].routes[0].params
                    .applyFilter2
                    ? themeStyle.primaryDark
                    : 'gray'
                  : 'gray',
              fontSize: themeStyle.mediumSize,
              fontWeight: '500'
            }}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onPress={text => {
          this.props.navigation.state.routes[0].routes[0].params.applyFilters()
        }}>
        <View
          style={{
            alignItems: 'center',
            height: 38,
            width: WIDTH * 0.2,
            backgroundColor: 'transparent',
            justifyContent: 'center'
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: themeStyle.primaryDark,
              fontSize: themeStyle.mediumSize,
              fontWeight: '500'
            }}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  render () {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: themeStyle.backgroundColor,
        elevation: 6,
        shadowColor: themeStyle.textColor,
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 2,
        shadowRadius: 2
      }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              height: Platform.OS === 'android' ? 50 : 50,
              backgroundColor: themeStyle.primary,
              borderWidth: Platform.OS === 'ios' ? 0.3 : 0,
              elevation: 3,
              shadowColor: themeStyle.textColor,
              shadowOffset: {
                width: 0,
                height: 1
              },
              shadowOpacity: 2,
              shadowRadius: 3
            }}>
            <TouchableWithoutFeedback
              onPress={() => this.props.navigation.closeDrawer()}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingLeft: 15
                }}>
                <Icon
                  onPress={() => this.props.navigation.closeDrawer()}
                  name={'md-close'}
                  style={{
                    color: themeStyle.primaryContrast,
                    marginLeft: 5,
                    marginRight: 5
                  }}
                />
                <Text
                  style={{
                    paddingLeft: 20,
                    textAlign: 'center',
                    fontSize: 18,
                    color: themeStyle.primaryContrast
                  }}>
                  {this.props.cartItems2.Config.languageJson.Filters}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTopColor: themeStyle.primary,
              borderTopWidth: 1,
              padding: 8,
              zIndex: 2,
              position: 'absolute',
              bottom: 0,
              width: DrawerWidth2,
              height: DrawerHeight2 * 0.1,
              borderColor: themeStyle.textColor,
              backgroundColor: themeStyle.backgroundColor,
              elevation: 5,
              shadowOffset: { width: 5, height: 6 },
              shadowColor: themeStyle.textColor,
              shadowOpacity: 0.9
            }}>
            {this.butn(this.props.cartItems2.Config.languageJson.Reset, this)}
            {this.butn(this.props.cartItems2.Config.languageJson.Apply, this)}
          </View>
          <View>
            <Text
              style={{
                fontSize: 18,
                color: themeStyle.textColor,
                fontWeight: '700',
                padding: 8,
                alignSelf: 'flex-start'
              }}>
              {' '}
              {`${this.props.cartItems2.Config.languageJson.by} ${this.props.cartItems2.Config.languageJson.Price}`}{' '}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                padding: 5,
                marginLeft: WIDTH * 0.1
              }}>
              <MultiSlider
                sliderLength={Number(WIDTH * 0.56)}
                isMarkersSeparated={true}
                values={[
                  this.props.navigation.state.routes[0].routes[0].toString() !==
                    'NaN' &&
                  this.props.navigation.state.routes[0].routes[0] !==
                    undefined &&
                  this.props.navigation.state.routes[0].routes[0].params !==
                    undefined &&
                  this.props.navigation.state.routes[0].routes[0] !== null
                    ? Number(
                      this.props.navigation.state.routes[0].routes[0].params
                        .tempmYarray[0]
                    )
                    : Number(this.state.tempmYarray[0]),
                  this.props.navigation.state.routes[0].routes[0].toString() !==
                    'NaN' &&
                  this.props.navigation.state.routes[0].routes[0] !==
                    undefined &&
                  this.props.navigation.state.routes[0].routes[0].params !==
                    undefined &&
                  this.props.navigation.state.routes[0].routes[0] !== null
                    ? Number(
                      this.props.navigation.state.routes[0].routes[0].params
                        .tempmYarray[1]
                    )
                    : Number(this.state.tempmYarray[1])
                ]}
                touchDimensions={{
                  height: 200,
                  width: 200,
                  borderRadius: 200 / 2,
                  slipDisplacement: 800
                }}
                markerStyle={{
                  height: 20,
                  width: 20,
                  backgroundColor: themeStyle.primaryDark
                }}
                selectedStyle={{ backgroundColor: themeStyle.primary }}
                unselectedStyle={{ backgroundColor: '#f618' }}
                snapped={false}
                containerStyle={{ paddingTop: 9 }}
                minMarkerOverlapDistance={3}
                customMarkerLeft={e => {
                  return (
                    <View style={{ marginBottom: 13 }}>
                      <TouchableWithoutFeedback
                        style={{ borderRadius: 8, height: 8, width: 8 }}>
                        <Text style={{ fontSize: 10, color: themeStyle.textColor }}>{e.currentValue}</Text>
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback>
                        <Text
                          style={{
                            overflow: 'hidden',
                            borderRadius: 15 / 2,
                            height: 15,
                            width: 15,
                            backgroundColor: themeStyle.primaryDark
                          }}>
                          {''}
                        </Text>
                      </TouchableWithoutFeedback>
                    </View>
                  )
                }}
                customMarkerRight={e => {
                  return (
                    <View style={{ marginBottom: 13 }}>
                      <TouchableWithoutFeedback
                        style={{ borderRadius: 8, height: 8, width: 8 }}>
                        <Text style={{ fontSize: 10, color: themeStyle.textColor }}>{e.currentValue}</Text>
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback>
                        <Text
                          style={{
                            borderRadius: 15 / 2,
                            overflow: 'hidden',
                            height: 15,
                            width: 15,
                            backgroundColor: themeStyle.primaryDark
                          }}>
                          {''}
                        </Text>
                      </TouchableWithoutFeedback>
                    </View>
                  )
                }}
                min={
                  this.props.navigation.state.routes[0].routes[0].toString() ===
                    'NaN' ||
                  this.props.navigation.state.routes[0].routes[0] ===
                    undefined ||
                  this.props.navigation.state.routes[0].routes[0].params ===
                    undefined ||
                  this.props.navigation.state.routes[0].routes[0] === null
                    ? Number(this.state.minAmount)
                    : Number(
                      this.props.navigation.state.routes[0].routes[0].params
                        .minAmount
                    )
                }
                max={
                  this.props.navigation.state.routes[0].routes[0].toString() ===
                    'NaN' ||
                  this.props.navigation.state.routes[0].routes[0] ===
                    undefined ||
                  this.props.navigation.state.routes[0].routes[0].params ===
                    undefined ||
                  this.props.navigation.state.routes[0].routes[0] === null
                    ? Number(this.state.maxAmount)
                    : Number(
                      this.props.navigation.state.routes[0].routes[0].params
                        .maxAmount
                    )
                }
                onValuesChangeFinish={() => {
                  this.props.navigation.state.routes[0].routes[0].params.onChangeRange(
                    Object.create({
                      lower: this.props.navigation.state.routes[0].routes[0]
                        .params.tempmYarray2[0],
                      upper: this.props.navigation.state.routes[0].routes[0]
                        .params.tempmYarray2[1]
                    })
                  )
                }}
                onValuesChange={values => {
                  this.props.navigation.state.routes[0].routes[0].params.tempmYarray2[0] =
                    values[0]
                  this.props.navigation.state.routes[0].routes[0].params.tempmYarray2[1] =
                    values[1]
                }}
              />
            </View>
            <View style={{ height: 1, width: '100%', backgroundColor: '#ddd' }} />
          </View>
          <ScrollView style={{ marginBottom: 20 }}>
            {this.props.navigation.state.routes[0].routes[0].toString() !==
              'NaN' &&
            this.props.navigation.state.routes[0].routes[0] !== undefined &&
            this.props.navigation.state.routes[0].routes[0].params !==
              undefined &&
            this.props.navigation.state.routes[0].routes[0] !== null &&
            this.props.navigation.state.routes[0].routes[0].params
              .attributes !== undefined ? (
                this.props.navigation.state.routes[0].routes[0].params.attributes
                  .length !== 0 ? (
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={
                        this.props.navigation.state.routes[0].routes[0].params
                          .attributes.length === 0
                          ? []
                          : this.props.navigation.state.routes[0].routes[0].params
                            .attributes
                      }
                      ref={ref => {
                        this.flatListRef = ref
                      }}
                      keyExtractor={(_item, index) => index.toString()}
                      ItemSeparatorComponent={() => (
                        <View
                          style={{
                            height: 1,
                            width: '100%',
                            backgroundColor: '#ddd'
                          }}
                        />
                      )}
                      renderItem={item => (
                        <View>
                          <Text
                            style={{
                              fontSize: 18,
                              color: themeStyle.textColor,
                              fontWeight: '700',
                              padding: 8,
                              alignSelf: 'flex-start'
                            }}>
                            {item.item.option.name}
                          </Text>

                          <FlatList
                            data={item.item.values}
                            keyExtractor={(_item, index) => index.toString()}
                            ItemSeparatorComponent={() => (
                              <View
                                style={{
                                  height: 1,
                                  width: '100%',
                                  backgroundColor: '#ddd'
                                }}
                              />
                            )}
                            renderItem={item2 => (
                              <View>
                                {this.props.navigation.state.routes[0].routes[0].params.singaleRow2(
                                  item.item,
                                  item2.item
                                )}
                              </View>
                            )}
                          />
                        </View>
                      )}
                    />
                  ) : null
              ) : null}
          </ScrollView>
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  cartItems2: state
})

export default connect(mapStateToProps, null)(withNavigation(App))
