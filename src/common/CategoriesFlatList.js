import React, { PureComponent } from 'react'
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  I18nManager,
  Dimensions,
  Platform
} from 'react-native'
import { UIActivityIndicator } from 'react-native-indicators'
import theme from './Theme.style'
import Category1Style from './Categories1'
import Category2Style from './Categories2'
import Category3Style from './Categories3'
import Category4Style from './Categories4'
import Category6Style from './Categories6'
import Category61Style from './Categories61'
import Loader from 'react-native-easy-content-loader'
import { Icon } from 'native-base'
const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
export default class FlatListView extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: [],
      isLoading: true,
      page: 11,
      refreshing: false,
      loading: false,
      timeValue: 400
    }
  }

  openSubCategories = (parent, name) => {
    let count = 0
    for (const val of this.props.allCategories) {
      if (val.parent_id === parent.id) {
        count++
      }
    }
    if (count === 0) {
      this.props.props.navigation.navigate('NewestScreen', {
        id: parent.id,
        name,
        sortOrder: 'newest'
      })
    } else {
      this.props.props.navigation.navigate('SubCategory', {
        parentId: parent.id,
        noOfCol: this.props.noOfCol,
        categoryPage: this.props.categoryPage,
        separator: this.props.separator
      })
    }
  }

  openSubCategories2 = (parent, name, noOfCol) => {
    let count = 0
    for (const val of this.props.allCategories) {
      if (val.parent_id === parent.id) {
        count++
      }
    }
    if (count === 0) {
      this.props.props.navigation.navigate('NewestScreen', {
        id: parent.id,
        name,
        sortOrder: 'newest'
      })
    } else {
      this.props.props.navigation.navigate('SubCategory', {
        parentId: parent.id,
        noOfCol,
        categoryPage: this.props.categoryPage,
        separator: this.props.separator
      })
    }
  }

  renderSeparator = () => (
    <View style={{ height: 1, width: '100%', backgroundColor: '#ddd' }} />
  )

  render () {
    let { loading } = this.state
    if (this.props.dataSource.length > 0) {
      loading = false
      this.state.timeValue = 400
    } else {
      loading = true
      this.state.timeValue = 400
    }
    return this.props.dataSource.length === 0 &&
      this.props.categoryPage !== 6 &&
      this.props.categoryPage !== 61 &&
      this.props.categoryPage !== 1 ? (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: theme.backgroundColor
        }}>
          <UIActivityIndicator size={27} color={theme.loadingIndicatorColor} />
        </View>
      ) : (
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={
            this.props.dataSource.length === 0
              ? ['', '', '', '', '', '', '', '', '', '']
              : this.props.dataSource
          }
          tabLabel={this.props.tabLabel}
          horizontal={this.props.vertical}
          numColumns={!this.props.viewButton ? this.props.noOfCol : 2}
          numColumns={this.props.noOfCol}
          contentContainerStyle={{ backgroundColor: theme.backgroundColor }}
          ListFooterComponentStyle={{
            backgroundColor: theme.backgroundColor
          }}
          style={
            this.props.noOfCol === 3
              ? {
                backgroundColor: theme.backgroundColor,
                paddingBottom: this.props.viewButton ? 0 : 10
              }
              : {
                backgroundColor: theme.backgroundColor,
                paddingBottom: this.props.viewButton ? 0 : 10
              }
          }
          ItemSeparatorComponent={
            this.props.separator ? this.renderSeparator : null
          }
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={
            this.props.viewButton ? (
              <View
                style={{
                  position: 'relative',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  marginBottom: 10
                }}>
                <TouchableOpacity
                  style={{ paddingTop: 15 }}
                  onPress={() =>
                    this.props.props.navigation.navigate('NewestScreen', {
                      id: this.props.parentId,
                      name: '',
                      sortOrder: 'newest'
                    })
                  }>
                  <View
                    style={{
                      alignItems: 'center',
                      height: 38,
                      width: 100,
                      justifyContent: 'center',
                      flexDirection: 'row'
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: theme.otherBtnsColor,
                        fontSize: theme.mediumSize + 2,
                        fontWeight: '600'
                      }}>
                      {
                        this.props.props.cartItems2.Config.languageJson[
                          'Shop More'
                        ]
                      }
                    </Text>
                    <Icon
                      name={
                        !I18nManager.isRTL
                          ? 'md-arrow-dropright'
                          : 'md-arrow-dropleft'
                      }
                      style={{
                        color: theme.otherBtnsColor,
                        fontSize: theme.mediumSize + 8,
                        paddingTop: 2,
                        paddingLeft: !I18nManager.isRTL ? 8 : 0,
                        paddingRight: I18nManager.isRTL ? 8 : 0
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            ) : null
          }
          renderItem={item =>
            this.props.categoryPage === 1 &&
          this.props.noOfCol === 3 &&
          item.index < 6 ? (
                <Loader
                  secondaryColor='rgba(208, 205, 205, 1)'
                  primaryColor='rgba(218, 215, 215, 1)'
                  animationDuration={400}
                  loading={loading}
                  containerStyles={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: HEIGHT * 0.19,
                    width: this.props.noShadow ? WIDTH * 0.3 : WIDTH * 0.71,
                    shadowOffset: { width: 1, height: 1 },
                    shadowColor: theme.textColor,
                    shadowOpacity: 0.5,
                    elevation: 3,
                    margin: 5,
                    marginTop: 6,
                    padding: 5,
                    alignSelf: 'center',
                    marginLeft: Platform.OS === 'ios' ? 6 : 5
                  }}
                  pRows={1}
                  pWidth={['100%']}
                  pHeight={12}
                  titleStyles={{
                    height: HEIGHT * 0.11,
                    width: this.props.noShadow ? WIDTH * 0.3 : WIDTH * 0.71,
                    margin: 5,
                    alignSelf: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 0,
                    borderWidth: 0,
                    padding: 5
                  }}>
                  {this.props.dataSource.length > 0 && item.index < 6 ? (
                    <Category1Style
                      item={item.item}
                      id={item.index}
                      noOfCol={2}
                      noShadow={!!this.props.noShadow}
                      sizeChange={!!this.props.sizeChange}
                      products={this.props.products}
                      image={item.item.image === null ? '' : item.item.image.src}
                      openSubCategories={(t, n) => this.openSubCategories2(t, n, 2)}
                    />
                  ) : null}
                </Loader>
              ) : this.props.categoryPage === 1 && this.props.noOfCol !== 3 ? (
                <Loader
                  secondaryColor='rgba(208, 205, 205, 1)'
                  primaryColor='rgba(218, 215, 215, 1)'
                  animationDuration={400}
                  loading={loading}
                  containerStyles={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: HEIGHT * 0.19,
                    width: this.props.noShadow ? WIDTH * 0.43 : WIDTH * 0.471,
                    shadowOffset: { width: 1, height: 1 },
                    shadowColor: theme.textColor,
                    shadowOpacity: 0.5,
                    elevation: 3,
                    margin: 5,
                    marginTop: 6,
                    padding: 5,
                    alignSelf: 'center',
                    marginLeft: Platform.OS === 'ios' ? 6 : 5
                  }}
                  pRows={1}
                  pWidth={['100%']}
                  pHeight={12}
                  titleStyles={{
                    height: HEIGHT * 0.16,
                    width: this.props.noShadow ? WIDTH * 0.43 : WIDTH * 0.471,
                    margin: 5,
                    alignSelf: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 0,
                    borderWidth: 0,
                    padding: 5
                  }}>
                  {this.props.dataSource.length > 0 ? (
                    <Category1Style
                      item={item.item}
                      id={item.index}
                      noShadow={!!this.props.noShadow}
                      sizeChange={!!this.props.sizeChange}
                      products={this.props.products}
                      image={item.item.image === null ? '' : item.item.image.src}
                      openSubCategories={(t, n) => this.openSubCategories2(t, n, 2)}
                    />
                  ) : null}
                </Loader>
              ) : this.props.categoryPage === 3 ? (
                this.props.dataSource.length > 0 ? (
                  <Category3Style
                    item={item.item}
                    id={item.index}
                    products={this.props.products}
                    image={item.item.image === null ? '' : item.item.image.src}
                    openSubCategories={(t, n) => this.openSubCategories(t, n)}
                  />
                ) : null
              ) : this.props.categoryPage === 2 ? (
                this.props.dataSource.length > 0 ? (
                  <Category2Style
                    item={item.item}
                    id={item.index}
                    products={this.props.products}
                    image={item.item.image === null ? '' : item.item.image.src}
                    openSubCategories={(t, n) => this.openSubCategories(t, n)}
                  />
                ) : null
              ) : this.props.categoryPage === 4 ? (
                this.props.dataSource.length > 0 ? (
                  <Category4Style
                    item={item.item}
                    id={item.index}
                    products={this.props.products}
                    image={item.item.image === null ? '' : item.item.image.src}
                    openSubCategories={(t, n) => this.openSubCategories(t, n)}
                  />
                ) : null
              ) : this.props.categoryPage === 6 ? (
                <Loader
                  secondaryColor='rgba(208, 205, 205, 1)'
                  primaryColor='rgba(218, 215, 215, 1)'
                  animationDuration={400}
                  loading={loading}
                  containerStyles={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 250,
                    width: WIDTH * 0.97,
                    shadowOffset: { width: 1, height: 1 },
                    shadowColor: theme.textColor,
                    shadowOpacity: 0.5,
                    elevation: 3,
                    margin: 5,
                    padding: 5,
                    alignSelf: 'center'
                  }}
                  pRows={null}
                  titleStyles={{
                    height: 250,
                    width: WIDTH * 0.97,
                    margin: 5,
                    alignSelf: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 0,
                    borderWidth: 0,
                    padding: 5
                  }}>
                  {this.props.dataSource.length > 0 ? (
                    <Category6Style
                      item={item.item}
                      id={item.index}
                      products={this.props.products}
                      image={item.item.image === null ? '' : item.item.image.src}
                      openSubCategories={(t, n) => this.openSubCategories(t, n)}
                    />
                  ) : null}
                </Loader>
              ) : this.props.categoryPage === 61 ? (
                <Loader
                  secondaryColor='rgba(208, 205, 205, 1)'
                  primaryColor='rgba(218, 215, 215, 1)'
                  animationDuration={400}
                  loading={loading}
                  containerStyles={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: HEIGHT * 0.34,
                    width: WIDTH * 0.43,
                    shadowOffset: { width: 1, height: 1 },
                    shadowColor: theme.textColor,
                    shadowOpacity: 0.5,
                    elevation: 3,
                    margin: 5,
                    padding: 5,
                    alignSelf: 'center'
                  }}
                  pRows={1}
                  pWidth={['100%']}
                  pHeight={8}
                  titleStyles={{
                    height: HEIGHT * 0.28,
                    width: WIDTH * 0.43,
                    margin: 5,
                    alignSelf: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 0,
                    borderWidth: 0,
                    padding: 5
                  }}>
                  {this.props.dataSource.length > 0 ? (
                    <Category61Style
                      item={item.item}
                      id={item.index}
                      products={this.props.products}
                      viewButton={this.props.viewButton}
                      image={item.item.image === null ? '' : item.item.image.src}
                      openSubCategories={(t, n) => this.openSubCategories2(t, n, 2)}
                    />
                  ) : null}
                </Loader>
              ) : null
          }
        />
      )
  }
}
