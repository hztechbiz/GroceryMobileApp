import React, { PureComponent } from 'react'
import { Text, View, FlatList, TextInput, Platform } from 'react-native'
import { UIActivityIndicator } from 'react-native-indicators'
import SyncStorage from 'sync-storage'
import WooComFetch, { getUrl } from './WooComFetch'
import theme from './Theme.style'
import { connect } from 'react-redux'
import { CardStyleInterpolators } from 'react-navigation-stack'
class MyProject extends PureComponent {
    static navigationOptions = ({ navigation }) => {
      const headerStyle = navigation.getParam('headerTitle')
      return {
        headerTitle: headerStyle,
        headerForceInset: { top: 'never', vertical: 'never' },
        headerTintColor: theme.headerTintColor,
        headerStyle: {
          backgroundColor: theme.primary
        },
        headerTitleStyle: {
          fontWeight: Platform.OS === 'android' ? 'bold' : 'normal'
        },
        headerTitleAlign: 'center',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
      }
    }

    constructor (props) {
      super(props)
      this.state = {
        isLoading: true,
        text: '',
        arrayholder: [],
        dataSource: []
      }
    }

    componentDidMount () {
      this.getLang()
      this.props.navigation.setParams({
        headerTitle: this.props.cartItems2.Config.languageJson2.Search
      })
    }

  getLang = async () => {
    var dat = { type: 'null' }
    const data = await WooComFetch.postHttp(
      getUrl() + '/api/' + 'getcountries',
      dat
    )
    this.setState(
      {
        isLoading: false,
        dataSource: data.data.data
      },
      () => {
        this.setState({ arrayholder: data.data.data })
      }
    )
  }

  GetListViewItem (c) {
    const tempdata = SyncStorage.get('tempdata')
    const orderDetails = SyncStorage.get('orderDetails')

    if (this.props.navigation.state.params.page === 'shipping') {
      orderDetails.delivery_country = c.countries_name
      orderDetails.delivery_country_code = c.countries_id
      orderDetails.delivery_country_id = c.countries_id
      orderDetails.delivery_zone = null
      orderDetails.delivery_state = null
      SyncStorage.set('orderDetails', orderDetails)
    } else if (this.props.navigation.state.params.page === 'editShipping') {
      tempdata.entry_country_id = c.countries_id
      tempdata.entry_country_name = c.countries_name
      tempdata.entry_country_code = c.countries_id
      tempdata.entry_zone = null
      SyncStorage.set('tempdata', tempdata)
    } else {
      orderDetails.billing_country = c.countries_name
      orderDetails.billing_country_code = c.countries_id
      orderDetails.billing_country_id = c.countries_id
      orderDetails.billing_zone = null
      orderDetails.billing_state = null
      SyncStorage.set('orderDetails', orderDetails)
    }

    this.setState({ text: c.countries_name })
    this.props.navigation.state.params.onGoBack(
      c.countries_name,
      this.props.navigation.state.params.onSelectionBase,
      c.countries_id,
      'country'
    )
    this.props.navigation.goBack()
  }

  SearchFilterFunction (text) {
    const newData = this.state.arrayholder.filter(item => {
      const itemData = item.countries_name.toUpperCase()
      const textData = text.toUpperCase()
      return itemData.indexOf(textData) > -1
    })
    this.setState({
      dataSource: newData,
      text
    })
  }

  ListViewItemSeparator = () => (
    <View
      style={{
        height: 0.5,
        width: '100%',
        backgroundColor: theme.backgroundColor
      }}
    />
  )

  render () {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            paddingTop: 20,
            color: theme.loadingIndicatorColor,
            backgroundColor: theme.backgroundColor
          }}>
          <UIActivityIndicator color={theme.loadingIndicatorColor} size={27} />
        </View>
      )
    }
    return (
      <View style={{
        justifyContent: 'center',
        flex: 1,
        padding: 7,
        backgroundColor: theme.backgroundColor
      }}>
        <TextInput
          style={{
            textAlign: 'center',
            height: 40,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 7,
            backgroundColor: theme.backgroundColor,
            color: theme.textColor
          }}
          onChangeText={text => this.SearchFilterFunction(text)}
          value={this.state.text}
          underlineColorAndroid='transparent'
          placeholder='Search Here'
          placeholderTextColor={'gray'}
        />

        <FlatList
          data={this.state.dataSource}
          showsVerticalScrollIndicator={false}
          renderSeparator={this.ListViewItemSeparator}
          renderItem={({ item }) => (
            <Text
              style={{
                fontSize: 17,
                padding: 10,
                color: theme.textColor
              }}
              onPress={this.GetListViewItem.bind(this, item)}>
              {item.countries_name}
            </Text>
          )}
          enableEmptySections
          style={{ marginTop: 10 }}
        />
      </View>
    )
  }
}
const mapStateToProps = state => ({
  cartItems2: state
})

export default connect(mapStateToProps, null)(MyProject)
