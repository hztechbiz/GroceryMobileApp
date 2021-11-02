import React, { PureComponent } from 'react'
import { CardStyleInterpolators } from 'react-navigation-stack'
import {
  View,
  FlatList,
  I18nManager,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native'
import { UIActivityIndicator } from 'react-native-indicators'
import Spinner from 'react-native-loading-spinner-overlay'
import { getHttp, getUrl } from '../common/WooComFetch'
import { Container, Content, ListItem, CheckBox, Text, Body } from 'native-base'
import SyncStorage from 'sync-storage'
import RNRestart from 'react-native-restart'
import { connect } from 'react-redux'
import themeStyle from '../common/Theme.style'
import ShoppingCartIcon from '../common/ShoppingCartIcon'
class Language extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    return {
      headerTitle: headerStyle,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
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
    }
  }

  getListOfLanguage = async () => {
    const json = await getHttp(getUrl() + '/api/' + 'getlanguages', {})
    for (const val of json.data.languages) {
      if (val.languages_id === SyncStorage.get('langId')) {
        this.state.tick[val.languages_id] = true
      }
    }
    this.setState({
      languages: json.data.languages,
      isLoading: false,
      tick: this.state.tick
    })
  }

  async componentDidMount () {
    this.getListOfLanguage()
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson['Select Language']
    })
  }

  constructor (props) {
    super(props)

    this.state = {
      languages: '',
      selectedLanguage: '',
      translate: '',
      prviousLanguageId: 0,
      temp: 0,
      tick: [],
      isLoading: true,
      SpinnerTemp: false
    }
    this.state.tick[SyncStorage.get('langId')] = true
  }

  /// //////////////////////////////////////////
  updateLanguage (item) {
    if (
      item != undefined &&
      this.state.prviousLanguageId != item.languages_id
    ) {
      SyncStorage.set('langId', item.languages_id)
      SyncStorage.set('languageCode', item.code)
      SyncStorage.set('wishListProducts', [])
      SyncStorage.set('recentViewedProducts', [])
      SyncStorage.set('cartProducts', [])
      this.state.tick = []
      this.state.tick[item.languages_id] = true

      if (item.code === 'ar') {
        I18nManager.forceRTL(true)
      } else {
        I18nManager.forceRTL(false)
      }
      this.setState({ temp: 0 })
      this.props.getTranslationData(item.languages_id, this)
    } else {
      this.setState({ SpinnerTemp: false })
    }
  }

  render () {
    return this.state.isLoading ? (
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
      <Container style={{ backgroundColor: themeStyle.backgroundColor }}>
        <Spinner visible={this.state.SpinnerTemp} />
        <View style={{ backgroundColor: themeStyle.backgroundColor }}>
          <FlatList
            style={{ backgroundColor: themeStyle.backgroundColor }}
            data={this.state.languages}
            horizontal={false}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            renderItem={item => (
              <View>
                <ListItem>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ SpinnerTemp: true }, () =>
                        this.updateLanguage(item.item)
                      )
                    }}
                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      key={0}
                      style={{ width: 28, height: 28 }}
                      loadingStyle={{
                        size: 'large',
                        color: themeStyle.loadingIndicatorColor
                      }}
                      resizeMode={'contain'}
                      placeholder={false}
                      ActivityIndicator={true}
                      placeholderStyle={{ width: 0, height: 0 }}
                      source={{ uri: themeStyle.url + '/' + item.item.image }}
                    />
                    <Body>
                      <Text style={{
                        fontSize: themeStyle.mediumSize,
                        color: themeStyle.textColor
                      }}>{item.item.name}</Text>
                    </Body>
                    <CheckBox
                      onPress={() => {
                        this.setState({ SpinnerTemp: true }, () =>
                          this.updateLanguage(item.item)
                        )
                      }}
                      checked={!!this.state.tick[item.item.languages_id]}
                    />
                  </TouchableOpacity>
                </ListItem>
              </View>
            )}
          />
        </View>
      </Container>
    )
  }
}
/// ///////////////////////////////////////
const mapDispatchToProps = dispatch => ({
  getTranslationData: (id, t) => {
    dispatch(async dispatch => {
      const json = await getHttp(
        getUrl() + '/api/' + 'applabels3?lang=' + id,
        {}
      )
      t.setState({ SpinnerTemp: false })
      dispatch({
        type: 'languageSettings',
        payload: json.data
      })
      RNRestart.Restart()
    })
  }
})
const mapStateToProps = state => ({
  isLoading: state
})

export default connect(mapStateToProps, mapDispatchToProps)(Language)
