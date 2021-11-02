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
    var dat = { zone_country_id: this.props.navigation.state.params.id }
    const data = await WooComFetch.postHttp(
      getUrl() + '/api/' + 'getzones',
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
      if (c === 'other') {
        orderDetails.delivery_zone = 'other'
        orderDetails.delivery_state = 'other'
        orderDetails.tax_zone_id = null
      } else {
        orderDetails.delivery_zone = c.zone_name
        orderDetails.delivery_state = c.zone_name
        orderDetails.tax_zone_id = c.zone_id
      }
      SyncStorage.set('orderDetails', orderDetails)
    } else if (this.props.navigation.state.params.page === 'editShipping') {
      if (c === 'other') {
        tempdata.entry_zone = 'other'
        tempdata.entry_zone_id = 0
      } else {
        tempdata.entry_zone = c.zone_name
        tempdata.entry_zone_id = c.zone_id
      }
      SyncStorage.set('tempdata', tempdata)
    } else {
      if (c === 'other') {
        orderDetails.billing_zone = 'other'
        orderDetails.billing_state = 'other'
      } else {
        orderDetails.billing_zone = c.zone_name
        orderDetails.billing_state = c.zone_name
      }
      SyncStorage.set('orderDetails', orderDetails)
    }

    this.setState({ text: c.zone_name })
    this.props.navigation.state.params.onGoBack(
      c.zone_name == null || c.zone_name === undefined || c.zone_name === ''
        ? 'other'
        : c.zone_name,
      this.props.navigation.state.params.onSelectionBase,
      c.zone_id,
      'zone'
    )
    this.props.navigation.goBack()
  }

  SearchFilterFunction (text) {
    const newData = this.state.arrayholder.filter(item => {
      const itemData = item.zone_name.toUpperCase()
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
        backgroundColor: theme.textColor
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
            borderColor: '#009688',
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
        {this.state.dataSource.length < 1 ? (
          <Text
            style={{
              fontSize: 17,
              padding: 10,
              color: theme.textColor
            }}
            onPress={this.GetListViewItem.bind(this, 'other')}>
            {'other'}
          </Text>
        ) : null}
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
              {item.zone_name}
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
