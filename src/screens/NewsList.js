import React, { Component } from 'react'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { View, FlatList, Platform } from 'react-native'
import { connect } from 'react-redux'
import NewsCard from '../common/NewsCard'
import SyncStorage from 'sync-storage'
import { getUrl, postHttp } from '../common/WooComFetch'
import ThemeStyle from '../common/Theme.style'
import { UIActivityIndicator } from 'react-native-indicators'
class RewardPoints extends Component {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    return {
      headerTitle: headerStyle,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerRight: null,
      gestureEnabled: false,
      drawerLockMode: 'locked-closed',
      headerTitleAlign: 'center',

      headerTintColor: ThemeStyle.headerTintColor,
      headerStyle: {
        backgroundColor: ThemeStyle.primary
      },
      headerTitleStyle: {
        fontWeight: Platform.OS === 'android' ? 'bold' : 'normal'
      },
      headerForceInset: { top: 'never', vertical: 'never' }
    }
  }

  componentDidMount () {
    this.getPosts()
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson2['News List']
    })
  }

  constructor (props) {
    super(props)
    this.state = {
      page2: 0,
      posts: [],
      name: this.props.navigation.state.params.data.name,
      id: this.props.navigation.state.params.data.id,
      refreshing: false
    }
  }

  //= ===========================================================================================
  // getting list of posts
  getPosts = async () => {
    const formData = new FormData()

    formData.append('categories_id', this.state.id)
    formData.append('page_number', this.state.page2)
    formData.append(
      'language_id',
      SyncStorage.get('langId') === undefined ? 1 : SyncStorage.get('langId')
    )
    formData.append(
      'currency_code',
      this.props.isLoading.Config.productsArguments.currency
    )

    const data = await postHttp(getUrl() + '/api/' + 'getallnews', formData)
    if (this.state.page2 === 0) {
      this.state.posts = []
      this.setState({ refreshing: false })
    }
    if (data.success === '1') {
      this.state.page2++
      data.news_data.forEach((value, index) => {
        this.state.posts.push(value)
      })
    }
    if (data.news_data.length < 9) {
      this.setState({ refreshing: false })
      if (this.state.posts.length !== 0) {
      }
    }

    this.setState({})
  }

  //= ===========================================================================================
  convertHtmlTag = htmlprice => {
    const str = htmlprice
    return str.replace(/<[^>]*>/g, '')
  }

  /// ///////////////////////////////////
  renderFooter = () => (
    <View
      style={{
        marginBottom: 30,
        marginTop: 10,
        alignItems: 'center',
        alignSelf: 'center',
        alignContent: 'center'
      }}>
      {this.state.refreshing && this.state.posts.length !== 0 ? (
        <View
          style={{
            marginTop: 30
          }}>
          <UIActivityIndicator
            size={27}
            count={12}
            color={ThemeStyle.loadingIndicatorColor}
          />
        </View>
      ) : null}
    </View>
  )

  renderSeparator = () => (
    <View style={{ height: 1, width: '100%', backgroundColor: '#ddd' }} />
  )

  openSubCategories = data => {
    this.props.navigation.navigate('NewsDetails', {
      data
    })
  }

  temp = () => {
    this.setState({ refreshing: true, page2: this.state.page2 + 1 }, () => {
      this.getPosts()
    })
  }

  render () {
    return this.state.posts.length === 0 ? (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: ThemeStyle.backgroundColor
        }}>
        <UIActivityIndicator
          size={27}
          style={{ height: 20, marginTop: 30, alignSelf: 'center' }}
          color={ThemeStyle.loadingIndicatorColor}
        />
      </View>
    ) : (
      <View style={{ backgroundColor: ThemeStyle.backgroundColor, flex: 1 }}>
        <FlatList
          data={this.state.posts}
          tabLabel={{
            label: this.props.isLoading.Config.languageJson.newest
          }}
          showsVerticalScrollIndicator={false}
          vertical
          listKey={'123'}
          extraData={this.state}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={this.renderSeparator}
          renderItem={item => (
            <NewsCard
              item={item.item}
              id={item.index}
              html={this.convertHtmlTag(item.item.news_description)}
              image={item.item.image === null ? '' : item.item.image}
              openSubCategories={(t, n) => this.openSubCategories(t, n)}
            />
          )}
          onEndReachedThreshold={10}
          ListFooterComponent={() => this.renderFooter()}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false
          }}
          onEndReached={() => {
            if (!this.onEndReachedCalledDuringMomentum) {
              this.temp()
              this.onEndReachedCalledDuringMomentum = true
            }
          }}
        />
      </View>
    )
  }
}
const mapStateToProps = state => ({
  isLoading: state
})

export default connect(mapStateToProps, null)(RewardPoints)
