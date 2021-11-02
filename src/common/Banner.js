import React, { PureComponent } from 'react'
import { Dimensions, StyleSheet, View, TouchableOpacity } from 'react-native'
import Loader from 'react-native-easy-content-loader'
import { createSelector } from 'reselect'
import SwiperBanner2 from '../common/SwiperBanner2'
import SwiperBanner3 from '../common/SwiperBanner3'
import { getUrl, postHttp } from '../common/WooComFetch'
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay'
import Toast from 'react-native-easy-toast'
import theme from './Theme.style'
import SwiperFlatList from 'react-native-swiper-flatlist'
import Image from 'react-native-scalable-image'
const WIDTH = Dimensions.get('window').width
class SwiperBanner extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      loading: false,
      SpinnerTemp: false
    }
  }

  async getOneProduct (value) {
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

  onClickFun = (val) => {
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
  }

  bannersRender () {
    return this.props.banners.length > 0
      ? this.props.banners.map((val, key) => (
        <TouchableOpacity
          onPress={this.onClickFun.bind(this, val)}>
          <Image
            placeholder={false}
            key={key}
            resizeMode={'contain'}
            width={Dimensions.get('window').width}
            source={{
              uri:
                  val.image !== undefined
                    ? theme.url + '/' + val.image.toString().startsWith('https')
                      ? theme.url + '/' + val.image.toString()
                      : theme.url +
                        '/' +
                        val.image.toString().replace('http', 'https')
                    : ''
            }}
          />
        </TouchableOpacity>
      ))
      : null
  }

  render () {
    let { loading } = this.state
    if (this.props.banners !== undefined) {
      if (this.props.banners.length > 0) {
        loading = false
      } else {
        loading = true
      }
    }
    return this.props.banners !== undefined ? (
      <View>
        <Spinner visible={this.state.SpinnerTemp} />
        <Toast
          ref='toast'
          style={{ backgroundColor: theme.otherBtnsColor }}
          position='top'
          positionValue={200}
          fadeOutDuration={1000}
          textStyle={{ color: '#fff', fontSize: 15 }}
        />
        <Loader
          active
          secondaryColor='rgba(208, 205, 205, 1)'
          primaryColor='rgba(218, 215, 215, 1)'
          animationDuration={400}
          loading={loading}
          containerStyles={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
            width: WIDTH,
            shadowOffset: { width: 1, height: 1 },
            shadowColor: theme.textColor,
            shadowOpacity: 0.5,
            elevation: 3,
            alignSelf: 'center',
            paddingTop: 0,
            marginTop: 0
          }}
          pRows={0}
          titleStyles={{
            height: 200,
            width: WIDTH,
            alignSelf: 'center',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <View>
            {this.props.bannerSelect === 3 ? (
              this.props.banners.length > 0 ? (
                <SwiperBanner2
                  banners={this.props.banners}
                  navigation={this.props.navigation}
                />
              ) : null
            ) : null}
            {this.props.bannerSelect === 2 ? (
              <SwiperBanner3
                navigation={this.props.navigation}
                currency={this.props.currency}
                language={this.props.language}
                banners={this.props.banners}/>
            ) : null}
            {this.props.bannerSelect === 1 ? (
              <View style={styles.container}>
                <SwiperFlatList
                  autoplay={theme.autoplay}
                  autoplayDelay={theme.autoplayDelay}
                  autoplayLoop={theme.autoplayLoop}
                  index={0}
                  showPagination
                  paginationDefaultColor={'rgba(0,0,0,0.2)'}
                  paginationActiveColor={theme.otherBtnsColor}
                  paginationStyleItem={{
                    width: 8,
                    height: 8,
                    marginLeft: 3,
                    marginRight: 3,
                    marginBottom: -5
                  }}>
                  {this.bannersRender()}
                </SwiperFlatList>
              </View>
            ) : null}
            {this.props.bannerSelect === 4 ? (
              <View style={styles.container}>
                <SwiperFlatList
                  autoplay={theme.autoplay}
                  autoplayDelay={theme.autoplayDelay}
                  autoplayLoop={theme.autoplayLoop}
                  index={0}
                  showPagination
                  paginationDefaultColor={'rgba(0,0,0,0.2)'}
                  paginationActiveColor={theme.otherBtnsColor}
                  paginationStyleItem={{
                    width: 15,
                    borderRadius: 5 / 2,
                    height: 7,
                    marginLeft: 3,
                    marginRight: 3,
                    marginBottom: -5
                  }}>
                  {this.bannersRender()}
                </SwiperFlatList>
              </View>
            ) : null}
            {/* ///////////////////////////////////// */}
            {this.props.bannerSelect === 5 ? (
              <View style={(styles.container, { marginBottom: 26 })}>
                <SwiperFlatList
                  autoplay={theme.autoplay}
                  autoplayDelay={theme.autoplayDelay}
                  autoplayLoop={theme.autoplayLoop}
                  index={0}
                  showPagination
                  paginationActiveColor={theme.otherBtnsColor}
                  paginationDefaultColor={'rgba(0,0,0,0.2)'}
                  paginationStyleItem={{
                    width: 8,
                    height: 8,
                    margin: 1,
                    marginLeft: 3,
                    marginRight: 3
                  }}
                  paginationStyle={{ flexDirection: 'row', marginBottom: -20 }}>
                  {this.bannersRender()}
                </SwiperFlatList>
              </View>
            ) : null}
            {this.props.bannerSelect === 6 ? (
              <View style={styles.container}>
                <SwiperFlatList
                  autoplay={theme.autoplay}
                  autoplayDelay={theme.autoplayDelay}
                  autoplayLoop={theme.autoplayLoop}
                  paginationActiveColor={theme.otherBtnsColor}
                  paginationDefaultColor={'rgba(0,0,0,0.2)'}
                  index={0}
                  showPagination
                  paginationStyleItem={{ width: 6, height: 15, margin: 2 }}
                  paginationStyle={{
                    flexDirection: 'column-reverse',
                    width: 15,
                    right: 5,
                    top: 22
                  }}>
                  {this.bannersRender()}
                </SwiperFlatList>
              </View>
            ) : null}
          </View>
        </Loader>
      </View>
    ) : (
      <View></View>
    )
  }
}
const getLanguage = (state) => state.Config.languageJson['No Products Found']
const getKeyword = (state) => state.sharedData.banners
const getCurrency = (state) => state.Config.productsArguments.currency
const getLanguageFun = createSelector(
  [getLanguage],
  (getLanguage) => {
    return getLanguage
  }
)
const getCurrenctFun = createSelector(
  [getCurrency],
  (getCurrency) => {
    return getCurrency
  }
)
const getBannersFun = createSelector(
  [getKeyword],
  (getKeyword) => {
    return getKeyword
  }
)
const mapStateToProps = state => {
  return {
    banners: getBannersFun(state),
    currency: getCurrenctFun(state),
    language: getLanguageFun(state)

  }
}

export default connect(mapStateToProps, null)(SwiperBanner)

export const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor
  },
  child: {
    height: height * 0.5,
    width,
    justifyContent: 'center'
  },
  text: {
    fontSize: width * 0.5,
    textAlign: 'center'
  }
})
