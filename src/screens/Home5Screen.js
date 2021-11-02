import React, { PureComponent } from 'react'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { NavigationEvents } from 'react-navigation'
import BottomNav from '../common/BottomNav'
import { connect } from 'react-redux'
import CategoryFlatList from '../common/CategoriesFlatList'
import { Icon } from 'native-base'
import { View, Linking, Platform, TouchableOpacity } from 'react-native'
import SyncStorage from 'sync-storage'
import ShoppingCartIcon from '../common/ShoppingCartIcon'
import MenuIcon from '../common/MenuIcon'
import Spinner from 'react-native-loading-spinner-overlay'
import themeStyle from '../common/Theme.style'
import { UIActivityIndicator } from 'react-native-indicators'
import { postHttp, getUrl } from '../common/WooComFetch'
class Category6 extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: () => <MenuIcon navigation={navigation} />,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    headerTitle: themeStyle.homeTitle,
    headerRight: () => <ShoppingCartIcon navigation={navigation} />,
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
  })

  constructor (props) {
    super(props)
    this.state = {
      activityIndicatorTemp: true,
      SpinnerTemp: false
    }
  }

  getOneProduct = async value => {
    const formData = new FormData()
    formData.append('language_id', '1')
    formData.append('products_id', value)
    formData.append('currency_code', '1')
    formData.append(
      'currency_code',
      this.props.cartItems2.Config.productsArguments.currency
    )
    const json = await postHttp(getUrl() + '/api/' + 'getallproducts', formData)
    this.setState({ SpinnerTemp: false }, () => {
      this.navigate(json.product_data[0])
    })
  }

  handleOpenURL = event => {
    // D
    if (event.url !== '' && event.url !== undefined && event.url !== null) {
      const route = event.url.replace(/.*?:\/\//g, '')
      const id = route.match(/\/([^/]+)\/?$/)[1]
      if (id !== '' && id !== undefined && id !== null) {
        this.setState({ SpinnerTemp: true }, () => {
          this.getOneProduct(id)
        })
      }
    }
  }

  navigate = json => {
    // E
    if (json !== '' && json !== undefined && json !== null) {
      Linking.removeEventListener('url', this.handleOpenURL)
      this.props.navigation.navigate('ProductDetails', { objectArray: json })
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({ activityIndicatorTemp: false })
    }, 1000)
    this.props.navigation.setParams({
      headerTitle: this.props.cartItems2.Config.languageJson.Home
    })
    if (!this.props.cartItems2.sharedData.deepTemp) {
      this.props.cartItems2.sharedData.deepTemp = true
      if (Platform.OS === 'android') {
        const NativeLinking = require('react-native/Libraries/Linking/NativeLinking')
          .default
        NativeLinking.getInitialURL().then(url => {
          if (url !== '' && url !== undefined && url !== null) {
            const route = url.replace(/.*?:\/\//g, '')
            const id = route.match(/\/([^/]+)\/?$/)[1]
            if (id !== '' && id !== undefined && id !== null) {
              this.setState({ SpinnerTemp: true }, () => {
                this.getOneProduct(id)
              })
            }
          }
        })
      } else {
        Linking.addEventListener('url', this.handleOpenURL)
      }
    }
  }

  componentWillUnmount () {
    clearInterval(this.state.activityIndicatorTemp)
    Linking.removeEventListener('url', this.handleOpenURL)
  }

  render () {
    return this.state.activityIndicatorTemp ? (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: themeStyle.backgroundColor
        }}>
        <UIActivityIndicator
          size={27}
          color={themeStyle.loadingIndicatorColor}
        />
      </View>
    ) : (
      <View
        style={{ flex: 1, paddingBottom: SyncStorage.get('bottom') ? 50 : 0 }}>
        <Spinner visible={this.state.SpinnerTemp} />
        {SyncStorage.get('bottom') ? <BottomNav active={0}></BottomNav> : null}
        <NavigationEvents
          onDidFocus={() => {
            this.props.navigation.setParams({
              headerRight: () => <ShoppingCartIcon navigation={this.props.navigation} />
            })
            this.setState({})
          }}
        />
        {this.props.cartItems2.Config.appInProduction ? (
          <TouchableOpacity
            style={{
              zIndex: 5,
              position: 'absolute',
              left: 20,
              bottom: 55,
              alignItems: 'center',
              height: 55,
              width: 55,
              borderRadius: 55 / 2,
              alignSelf: 'center',
              justifyContent: 'center',
              backgroundColor: themeStyle.primary,
              elevation: 10
            }}
            onPress={() => {
              this.props.navigation.navigate('DemoScreen')
            }}>

            <Icon
              name={'md-settings'}
              style={{
                color: themeStyle.primaryContrast,
                paddingTop: Platform.OS === 'ios' ? 2 : 0,
                fontSize: 22
              }}
            />

          </TouchableOpacity>
        ) : null}
        <CategoryFlatList
          dataSource={this.props.cartItems2.cartItems.categories}
          products={this.props.cartItems2.Config.languageJson.Products}
          allCategories={this.props.cartItems2.cartItems.allCategories}
          props={this.props}
          noOfCol={1}
          categoryPage={6}
          separator={false}
        />
      </View>
    )
  }
}
/// ///////////////////////////////////////////////
const mapStateToProps = state => ({
  cartItems2: state
})
/// //////////////////////////////////////////
export default connect(mapStateToProps, null)(Category6)
