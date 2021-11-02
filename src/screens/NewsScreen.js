import React, { Component } from 'react'
import { CardStyleInterpolators } from 'react-navigation-stack'
import {
  View,
  FlatList,
  SafeAreaView,
  Dimensions,
  Text,
  Platform
} from 'react-native'
import { UIActivityIndicator } from 'react-native-indicators'
import { getUrl, postHttp } from '../common/WooComFetch'
import { connect } from 'react-redux'
import Banner from '../common/NewsBanner'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TabBar from 'react-native-underline-tabbar'
import NewsCard from '../common/NewsCard'
import CategoriesNews from '../common/CategoriesNews'
import ShoppingCartIcon from '../common/ShoppingCartIcon'
import themeStyle from '../common/Theme.style'
import { Icon } from 'native-base'
import SyncStorage from 'sync-storage'
const { width } = Dimensions.get('window')
class News extends Component {
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

  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson.News
    })
  }

  constructor (props) {
    super(props)
    this.state = {
      page2: 0,
      newsBannerData: [],
      featuredPosts: [],
      categories: [],
      page: 0,
      posts: [],
      refreshing: false,
      categories2: [],
      checkData: false
    }
    this.getFeatured()
    this.getPosts()
    this.getCategories()
  }

  getFeatured = async () => {
    const formData = new FormData()
    formData.append('is_feature', 1)
    formData.append(
      'language_id',
      SyncStorage.get('langId') === undefined ? 1 : SyncStorage.get('langId')
    )
    formData.append(
      'currency_code',
      this.props.isLoading.Config.productsArguments.currency
    )
    const data = await postHttp(getUrl() + '/api/' + 'getallnews', formData)
    this.setState({ featuredPosts: data.news_data })
  }

  //= ===========================================================================================
  // getting list of posts
  getPosts = async () => {
    const formData = new FormData()
    formData.append('customers_id', '1')
    formData.append('page_number', this.state.page)
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
      this.setState({ refreshing: false, checkData: !(this.state.posts.length > 0) })
    }
    if (data.success == 1) {
      this.state.page++
      data.news_data.forEach((value, index) => {
        this.state.posts.push(value)
      })
    }
    if (data.news_data.length < 9) {
      this.setState({ refreshing: false, checkData: !(this.state.posts.length > 0) })
      if (this.state.posts.length != 0) {
      }
    }
    this.setState({ checkData: !(this.state.posts.length > 0) })
  }
  // ======================================== tab newest categories ===============================================================================

  getCategories = async () => {
    const formData = new FormData()
    formData.append('page_number', this.state.page2)
    formData.append(
      'language_id',
      SyncStorage.get('langId') === undefined ? 1 : SyncStorage.get('langId')
    )
    formData.append(
      'currency_code',
      this.props.isLoading.Config.productsArguments.currency
    )
    const data = await postHttp(
      getUrl() + '/api/' + 'allnewscategories',
      formData
    )
    if (this.state.page2 == 0) {
      this.state.categories = []
    }
    if (data.success == 1) {
      this.state.page2++
      data.data.forEach((value, index) => {
        this.state.categories.push(value)
      })
      this.getCategories()
    }
    if (data.data.length < 9) {
      if (this.categories.length != 0) {
      }
    }
    this.setState({})
  }

  //= ===========================================================================================
  convertHtmlTag = htmlprice => {
    const str = htmlprice
    return str.replace(/<[^>]*>/g, '')
  }

  /// ////
  renderSeparator = () => (
    <View style={{ height: 1, width: '100%', backgroundColor: '#ddd' }} />
  )

  openSubCategories = data => {
    this.props.navigation.navigate('NewsDetails', {
      data
    })
  }

  openSubCategories2 = data => {
    this.props.navigation.navigate('newsList', {
      data
    })
  }

  temp = () => {
    this.setState({ refreshing: true, page2: this.state.page2 + 1 }, () => {
      this.getPosts()
    })
  }

  //= ===========================================================================================
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
            height: 20,
            marginTop: 25
          }}>
          <UIActivityIndicator
            size={27}
            count={12}
            color={themeStyle.loadingIndicatorColor}
          />
        </View>
      ) : null}
    </View>
  )

  render () {
    return (
      this.state.checkData ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
            backgroundColor: themeStyle.backgroundColor
          }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
              alignSelf: 'center'
            }}>
            <Icon
              name={'logo-dropbox'}
              style={{ color: 'gray', fontSize: 80 }}
            />
            <Text style={{ fontSize: themeStyle.largeSize + 2, color: themeStyle.textColor }}>
              {this.props.isLoading.Config.languageJson['No Products Found']}
            </Text>
          </View>
        </View>
      )
        : this.state.posts.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: themeStyle.backgroundColor
            }}>
            <UIActivityIndicator
              color={themeStyle.loadingIndicatorColor}
              size={27}
              style={{ height: 20, marginTop: 30, alignSelf: 'center' }}
            />
          </View>
        ) : (
          <SafeAreaView
            style={{ flex: 1, backgroundColor: themeStyle.backgroundColor }}>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: themeStyle.backgroundColor
            }}>
              <Banner
                newsBannerData={this.state.featuredPosts}
                navigation={this.props.navigation}
                news={true}
              />
            </View>
            {/* Shop */}
            <View style={{
              flex: 1,
              backgroundColor: themeStyle.backgroundColor

            }}>
              <ScrollableTabView
                tabBarActiveTextColor={themeStyle.primaryDark}
                ref={tabView => {
                  this.tabView = tabView
                }}
                renderTabBar={() => (
                  <TabBar
                    style={{
                      alignItems: 'center',
                      flexDirection: 'column'
                    }}
                    underlineColor={themeStyle.primaryDark}
                    inactiveTextColor='#A9A9A9'
                    backgroundColor={themeStyle.backgroundColor}
                    tabMargin={40}
                    tabBarStyle={{ height: 48, marginTop: 0, paddingTop: 10 }}
                    tabBarTextStyle={{ fontSize: 18 }}
                  />
                )}>
                <FlatList
                  data={this.state.posts}
                  tabLabel={{
                    label: this.props.isLoading.Config.languageJson.newest
                  }}
                  vertical
                  listKey={'123'}
                  extraData={this.state}
                  showsVerticalScrollIndicator={false}
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
                  onEndReachedThreshold={0.8}
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
                {this.state.categories.length === 0 ? (
                  <View
                    tabLabel={{
                      label: this.props.isLoading.Config.languageJson.Categories
                    }}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    <UIActivityIndicator
                      color={themeStyle.loadingIndicatorColor}
                      size={27}
                      style={{ height: 20, marginTop: 30, alignSelf: 'center' }}
                    />
                  </View>
                ) : (
                  <FlatList
                    data={this.state.categories}
                    tabLabel={{
                      label: this.props.isLoading.Config.languageJson.Categories
                    }}
                    showsVerticalScrollIndicator={false}
                    vertical
                    listKey={'abcdasd'}
                    extraData={this.state}
                    contentContainerStyle={{ paddingLeft: width * 0.008 }}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                    renderItem={item => (
                      <CategoriesNews
                        item={item.item}
                        id={item.index}
                        posts2={this.state.posts}
                        posts={this.state.categories}
                        image={item.item.image === null ? '' : item.item.image}
                        openSubCategories2={t => this.openSubCategories2(t)}
                      />
                    )}
                  />
                )}
              </ScrollableTabView>
            </View>
          </SafeAreaView>
        )
    )
  }
}
const mapStateToProps = state => ({
  isLoading: state
})

export default connect(mapStateToProps, null)(News)
