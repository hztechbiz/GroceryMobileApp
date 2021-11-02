import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
  Dimensions,
  Platform,
  TouchableOpacity
} from 'react-native'
import { UIActivityIndicator } from 'react-native-indicators'
import { CardStyleInterpolators } from 'react-navigation-stack'
import SyncStorage from 'sync-storage'
import Stars from 'react-native-stars'
import Spinner from 'react-native-loading-spinner-overlay'
import Toast from 'react-native-easy-toast'
import { Icon } from 'native-base'
import Dialog, { DialogContent, DialogTitle } from 'react-native-popup-dialog'
import { connect } from 'react-redux'
import WooComFetch, { getUrl, getHttp } from '../common/WooComFetch'
import ImageLoad from '../common/RnImagePlaceH'
import themeStyle from '../common/Theme.style'
const Width2 = Dimensions.get('window').width
class RatingScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    return {
      headerTitle: headerStyle,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerRight: null,
      drawerLockMode: 'locked-closed',
      headerTitleAlign: 'center',
      headerTintColor: themeStyle.headerTintColor,
      headerStyle: {
        backgroundColor: themeStyle.primary
      },
      headerTitleStyle: {
        fontWeight: Platform.OS === 'android' ? 'bold' : 'normal'
      },
      headerForceInset: { top: 'never', vertical: 'never' },
      gestureEnabled: true
    }
  }

  componentDidMount () {
    this.getProductReviews()
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson2.Reviews
    })
  }

  /// /////////////////
  constructor (props) {
    super(props)
    this.state = {
      reviews: [],
      visible: false,
      id: this.props.navigation.state.params.objectArray.products_id,
      average: 0,
      activityIndicatorTemp: true,
      name: '',
      email: '',
      description: '',
      nonce: '',
      rating: 1,
      spinnerTemp: false
    }
  }

  //= ==============================================================================================================================
  // <!-- 2.0 updates -->
  getProductReviews = async () => {
    const tempId =
      SyncStorage.get('langId') === undefined ? 1 : SyncStorage.get('langId')
    const json = await getHttp(
      getUrl() +
        '/api/' +
        'getreviews?languages_id=' +
        tempId +
        '&products_id=' +
        this.state.id
    )
    this.state.reviews = json.data.data
    let total = 0
    for (const value of this.state.reviews) {
      total = total + value.rating
    }
    this.state.average = total / this.state.reviews.length
    if (this.state.reviews.length === 0) this.state.average = 0
    this.setState({
      reviews: json.data.data,
      activityIndicatorTemp: false,
      spinnerTemp: false
    })
  }

  /// /////////////////////////////////
  addComment = async () => {
    var dat = {}
    this.setState({ spinnerTemp: true })
    dat.products_id = this.state.id
    dat.customers_id = SyncStorage.get('customerData').id
    dat.customers_name =
      SyncStorage.get('customerData').first_name +
      ' ' +
      SyncStorage.get('customerData').last_name
    dat.reviews_rating = this.state.rating
    dat.languages_id =
      SyncStorage.get('langId') === undefined ? 1 : SyncStorage.get('langId')
    dat.reviews_text = this.state.description
    const json = await WooComFetch.postHttp(
      getUrl() + '/api/' + 'givereview',
      dat
    )

    if (json.data.success == 1) {
      this.refs.toast.show(json.data.message)
    } else {
      this.refs.toast.show(json.data.message)
    }
    this.getProductReviews()
    this.setState({
      spinnerTemp: false,
      name: '',
      email: '',
      description: '',
      rating: 1
    })
  }

  renderSeparator = () => (
    <View style={{ height: 1, width: '100%', backgroundColor: '#ddd' }} />
  )

  canBeSubmitted () {
    const { rating, description } = this.state
    return rating > 0 && description.length > 0
  }

  render () {
    const isEnabled = this.canBeSubmitted()
    return this.state.activityIndicatorTemp ? (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: themeStyle.backgroundColor
        }}>
        <UIActivityIndicator
          size={27}
          color={themeStyle.loadingIndicatorColor}
        />
      </View>
    ) : (
      <View style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: themeStyle.backgroundColor,
        paddingTop: 20
      }}>
        <Spinner
          visible={this.state.spinnerTemp}
          textStyle={styles.spinnerTextStyle}
        />
        <Toast
          ref='toast'
          style={{ backgroundColor: '#c1c1c1' }}
          position='bottom'
          positionValue={200}
          fadeOutDuration={7000}
          textStyle={{ color: themeStyle.textColor, fontSize: 15 }}
        />
        <Stars
          disabled
          default={parseFloat(
            this.props.navigation.state.params.averageRatingArray
          )}
          count={5}
          starSize={60}
          half
          fullStar={<Icon name={'star'} style={[styles.myStarStyle]} />}
          emptyStar={
            <Icon
              name={'star-outline'}
              style={[styles.myStarStyle, styles.myEmptyStarStyle]}
            />
          }
          halfStar={<Icon name={'star-half'} style={[styles.myStarStyle]} />}
        />
        <View>
          <Text
            style={{
              fontSize: 30,
              color: themeStyle.textColor
            }}>{`${this.props.navigation.state.params.averageRatingArray}`}</Text>
        </View>

        <View
          style={{
            backgroundColor: themeStyle.backgroundColor,
            padding: 8,
            flexDirection: 'row'
          }}>
          <Icon
            name={'person'}
            style={{
              color: themeStyle.otherBtnsColor,
              fontSize: 35,
              paddingRight: 5,
              paddingLeft: 5
            }}
          />
          <Text
            style={{
              fontSize: 22,
              color: themeStyle.otherBtnsText,
              paddingLeft: 15,
              paddingTop: 5
            }}>
            {`${`${this.state.reviews.length} ${this.props.isLoading.Config.languageJson2.rating}`} `}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (
              SyncStorage.get('customerData') === null ||
              SyncStorage.get('customerData') === undefined ||
              SyncStorage.get('customerData') === ''
            ) {
              SyncStorage.set('cartScreen', 1)
              this.props.navigation.push('LoginScreen')
            } else {
              this.setState({ visible: true })
            }
          }}
          style={{ backgroundColor: themeStyle.otherBtnsColor }}
        >
          <Text style={{
            color: themeStyle.otherBtnsText,
            fontSize: themeStyle.largeSize,
            padding: 8
          }}>
            {this.props.isLoading.Config.languageJson2['Rate Product']}
          </Text>
        </TouchableOpacity>

        <FlatList
          data={
            this.state.reviews !== undefined &&
            this.state.reviews !== null &&
            this.state.reviews.toString() !== 'NaN'
              ? this.state.reviews
              : []
          }
          showsVerticalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ backgroundColor: themeStyle.backgroundColor }}
          style={{ marginTop: 30 }}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={this.renderSeparator}
          extraData={this.state}
          renderItem={item => (
            <View style={{
              justifyContent: 'flex-start',
              alignItems: 'center',
              backgroundColor: themeStyle.backgroundColor,
              width: Width2,
              padding: 8,
              borderColor: 'gray',
              flexDirection: 'row',
              marginBottom: 5
            }}>
              <ImageLoad
                key={item.index}
                style={{
                  height: 45,
                  width: 45,
                  borderRadius: 45 / 2,
                  overflow: 'hidden',
                  marginRight: 8
                }}
                loadingStyle={{ size: 'large', color: themeStyle.primary }}
                placeholder={false}
                ActivityIndicator={true}
                placeholderStyle={{ width: 0, height: 0 }}
                backgroundColor='transparent'
                color='transparent'
                source={require('../images/avatar.png')}
              />

              <View
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  backfaceVisibility: 'hidden',
                  backgroundColor: themeStyle.backgroundColor,
                  alignContent: 'center',
                  width: Width2 * 0.8,
                  padding: 8,
                  paddingLeft: 4,
                  paddingTop: 10
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: themeStyle.textColor,
                    fontSize: themeStyle.largeSize,
                    paddingLeft: 1
                  }}>
                  {item.item.first_name + ' ' + item.item.last_name}
                </Text>
                <View
                  style={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    backfaceVisibility: 'hidden',
                    backgroundColor: themeStyle.backgroundColor,
                    alignContent: 'center',
                    flexDirection: 'row'
                  }}>
                  <Stars
                    disabled
                    default={parseFloat(item.item.rating)}
                    count={5}
                    half
                    fullStar={
                      <Icon
                        name={'star'}
                        style={{
                          color: '#eea532',
                          backgroundColor: 'transparent',
                          fontSize: 23
                        }}
                      />
                    }
                    emptyStar={
                      <Icon
                        name={'star-outline'}
                        style={{
                          color: '#eea532',
                          backgroundColor: 'transparent',
                          fontSize: 23
                        }}
                      />
                    }
                    halfStar={
                      <Icon
                        name={'star-half'}
                        style={{
                          color: '#eea532',
                          backgroundColor: 'transparent',
                          fontSize: 23
                        }}
                      />
                    }
                  />

                  <Text style={{ color: themeStyle.textColor, paddingLeft: 20 }}>
                    {item.item.created_at.substr(
                      0,
                      item.item.created_at.indexOf(' ')
                    )}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: themeStyle.mediumSize,
                    paddingLeft: 4,
                    color: themeStyle.textColor
                  }}>{`${item.item.comments}`}</Text>
              </View>
            </View>
          )}
        />

        <Dialog
          visible={this.state.visible}
          onTouchOutside={() => {
            this.setState({ visible: false })
          }}
          dialogTitle={
            <DialogTitle
              style={{
                backgroundColor: themeStyle.primary,
                color: themeStyle.textColor,
                width: 300
              }}
              textStyle={{ color: '#fff', fontSize: 20 }}
              title={this.props.isLoading.Config.languageJson2['Rate Product']}
            />
          }>
          <DialogContent style={{ backgroundColor: themeStyle.backgroundColor }}>
            <View style={{ padding: 8, backgroundColor: themeStyle.backgroundColor }}>
              <Stars
                default={parseFloat(1)}
                update={val => {
                  this.setState({ rating: val })
                }}
                count={5}
                starSize={60}
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

            <View
              style={{
                backgroundColor: themeStyle.backgroundColor,
                flexDirection: 'row',
                justifyContent: 'space-around',
                margin: 4
              }}>
              <Icon name={'chatbubbles'} style={[styles.myStarStyle2]} />
              <TextInput
                value={this.state.description}
                onChangeText={text => this.setState({ description: text })}
                placeholder={
                  this.props.isLoading.Config.languageJson['Your Messsage']
                }
                placeholderTextColor={'#c1c1c1'}
                style={[styles.input, { color: themeStyle.textColor }]}
              />
            </View>
            <View style={{ paddingLeft: 160, paddingTop: 5, backgroundColor: themeStyle.backgroundColor }}>
              <Button
                disabled={!isEnabled}
                onPress={() => {
                  this.setState({ visible: false }, () => this.addComment())
                }}
                title={this.props.isLoading.Config.languageJson2['Rate It']}
                color={themeStyle.primary}
              />
            </View>
          </DialogContent>
        </Dialog>
      </View>
    )
  }
}
const mapStateToProps = state => ({
  isLoading: state
})

export default connect(mapStateToProps, null)(RatingScreen)

const styles = StyleSheet.create({
  myStarStyle: {
    color: themeStyle.primary,
    backgroundColor: 'transparent',
    fontSize: 35,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  myStarStyle2: {
    color: '#979393',
    backgroundColor: 'transparent',
    fontSize: 28,
    paddingTop: 5,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  myEmptyStarStyle: {
    color: '#e0e0e0'
  },
  input: {
    width: 200,
    height: 40
  }
})
