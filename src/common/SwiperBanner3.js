import React from 'react'
import { Animated, Dimensions, TouchableOpacity, View } from 'react-native'
import { ParallaxSwiper, ParallaxSwiperPage } from './index'
import Spinner from 'react-native-loading-spinner-overlay'
import Toast from 'react-native-easy-toast'
import { getUrl, postHttp } from '../common/WooComFetch'
import theme from './Theme.style'
import Image from 'react-native-scalable-image'
const { width } = Dimensions.get('window')

export default class App extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      SpinnerTemp: false
    }
  }

  myCustomAnimatedValue = new Animated.Value(0)

  getPageTransformStyle = index => ({
    transform: [
      {
        scale: this.myCustomAnimatedValue.interpolate({
          inputRange: [
            (index - 1) * (width + 8), // Add 8 for dividerWidth
            index * (width + 8),
            (index + 1) * (width + 8)
          ],
          outputRange: [0, 1, 0],
          extrapolate: 'clamp'
        }, { useNativeDriver: true })
      },
      {
        rotate: this.myCustomAnimatedValue.interpolate({
          inputRange: [
            (index - 1) * (width + 8),
            index * (width + 8),
            (index + 1) * (width + 8)
          ],
          outputRange: ['180deg', '0deg', '-180deg'],
          extrapolate: 'clamp'
        }, { useNativeDriver: true })
      }
    ]
  })

  // getting single product data
  getOneProduct = async value => {
    this.setState({ SpinnerTemp: true })
    const formData = new FormData()
    formData.append('language_id', '1')
    formData.append('products_id', value)
    formData.append('currency_code', '1')
    formData.append(
      'currency_code',
      this.props.currency
    )
    const json2 = await postHttp(
      getUrl() + '/api/' + 'getallproducts',
      formData
    )
    if (json2.success !== '1') {
      this.setState({ SpinnerTemp: false })
      this.refs.toast.show(
        json2.message +
          this.props.language
      )
    } else {
      this.setState({ SpinnerTemp: false })
      this.props.navigation.navigate('ProductDetails', {
        objectArray: json2.product_data[0] //
      })
    }
    this.setState({ SpinnerTemp: false })
  }

  render () {
    return (
      <View>
        <Spinner visible={this.state.SpinnerTemp} />
        <Toast
          ref='toast'
          style={{
            backgroundColor: theme.otherBtnsColor,
            position: 'absolute',
            top: -39,
            zIndex: 12
          }}
          position='top'
          positionValue={200}
          fadeOutDuration={1000}
          textStyle={{ color: '#fff', fontSize: 15 }}
        />

        <ParallaxSwiper
          speed={0.5}
          animatedValue={this.myCustomAnimatedValue}
          dividerWidth={8}
          dividerColor={theme.textColor}
          backgroundColor={theme.textColor}
          showProgressBar={true}
          progressBarBackgroundColor='rgba(0,0,0,0.25)'
          progressBarValueBackgroundColor={theme.otherBtnsColor}
          progressBarThickness={4}>
          {this.props.banners.length > 0
            ? this.props.banners.map((val, key) => (
              <ParallaxSwiperPage
                scrollToIndex={0}
                BackgroundComponent={
                  <TouchableOpacity
                    onPress={() => {
                      if (val.type === 'category') {
                        this.props.navigation.navigate('NewestScreen', {
                          id: parseInt(val.url),
                          name: '',
                          sortOrder: val.type
                        })
                      } else if (val.type === 'product') {
                        this.getOneProduct(parseInt(val.url))
                      } else {
                        this.props.navigation.navigate('NewestScreen', {
                          id: parseInt(val.url),
                          name: '',
                          sortOrder: val.type
                        })
                      }
                    }}>
                    <Image
                      placeholder={false}
                      ActivityIndicator={true}
                      key={key}
                      width={Dimensions.get('window').width}
                      loadingStyle={{
                        size: 'large',
                        color: theme.loadingIndicatorColor
                      }}
                      placeholderStyle={{ width: 0, height: 0 }}
                      source={{
                        uri:
                            val.image !== undefined
                              ? theme.url +
                                '/' +
                                val.image.toString().startsWith('https')
                                ? theme.url + '/' + val.image.toString()
                                : theme.url +
                                  '/' +
                                  val.image.toString().replace('http', 'https')
                              : ''
                      }}
                    />
                  </TouchableOpacity>
                }
              />
            ))
            : null}
        </ParallaxSwiper>
      </View>
    )
  }
}
