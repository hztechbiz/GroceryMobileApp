import React, { PureComponent } from 'react'
import {
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
  Text,
  I18nManager,
  Platform
} from 'react-native'
import { UIActivityIndicator } from 'react-native-indicators'
import CardTem from './CardTemplate'
import { Icon } from 'native-base'
import theme from './Theme.style'
import { connect } from 'react-redux'
const Width = Dimensions.get('window').width

class Fetch extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: [],
      isLoading: true,
      page: 1,
      refreshing: false,
      finalCon: false,
      fabB: false,
      productView: this.props.productView,
      applyFilter: false,
      tempBox: []
    }
  }

  static getDerivedStateFromProps (props, state) {
    if (props.dataSource.length === 0 && props.productView === 'list') {
      return {
        dataSource: props.dataSource,
        isLoading: true,
        finalCon: false,
        productView: 'list',
        applyFilter: props.applyFilter,
        tempBox: []
      }
    }
    if (props.dataSource.length === 0 && props.productView === 'grid') {
      return {
        dataSource: props.dataSource,
        isLoading: true,
        finalCon: false,
        productView: 'grid',
        applyFilter: props.applyFilter,
        tempBox: []
      }
    }
    if (
      props.dataSource.length != 0 &&
      state.dataSource != props.dataSource &&
      props.productView === 'grid'
    ) {
      return {
        dataSource: props.dataSource,
        isLoading: true,
        finalCon: false,
        productView: 'grid',
        applyFilter: props.applyFilter,
        tempBox: []
      }
    } else if (
      props.dataSource.length === 0 &&
      props.page == 1 &&
      props.productView === 'grid'
    ) {
      return {
        dataSource: props.dataSource,
        isLoading: true,
        finalCon: false,
        productView: 'grid',
        applyFilter: props.applyFilter,
        tempBox: []
      }
    } else if (
      props.dataSource.length === 0 &&
      props.page > 1 &&
      props.productView === 'grid'
    ) {
      return {
        refreshing: false,
        finalCon: true,
        productView: 'grid',
        applyFilter: props.applyFilter,
        tempBox: []
      }
    }
    if (
      props.dataSource.length != 0 &&
      state.dataSource != props.dataSource &&
      props.productView === 'list'
    ) {
      return {
        dataSource: props.dataSource,
        isLoading: true,
        finalCon: false,
        productView: 'list',
        applyFilter: props.applyFilter,
        tempBox: []
      }
    } else if (
      props.dataSource.length === 0 &&
      props.page == 1 &&
      props.productView === 'list'
    ) {
      return {
        dataSource: props.dataSource,
        isLoading: true,
        finalCon: false,
        productView: 'list',
        applyFilter: props.applyFilter,
        tempBox: []
      }
    } else if (
      props.dataSource.length === 0 &&
      props.page > 1 &&
      props.productView === 'list'
    ) {
      return {
        refreshing: false,
        finalCon: true,
        productView: 'list',
        applyFilter: props.applyFilter,
        tempBox: []
      }
    }
    return null
  }

  static get options () {
    return {
      topBar: {
        title: {
          text: 'Fetch'
        }
      }
    }
  }

  componentDidMount () {
    this.props.onRef(this)
  }

  componentWillUnmount () {
    this.props.onRef(null)
    clearInterval(this.state.gridCheck)
  }

  showAlert = () => {
    if (this.state.productView === 'list') {
      this.setState({ productView: 'grid', gridCheck: true }, () => {
        setTimeout(() => {
          this.setState({ gridCheck: false })
        }, Math.floor(100 / 360000))
      })
    } else {
      this.setState({ productView: 'list', gridCheck: true }, () => {
        setTimeout(() => {
          this.setState({ gridCheck: false })
        }, Math.floor(100 / 360000))
      })
    }
  }

  renderItem = item =>
    this.state.productView === 'grid' ? (
      <View
        style={{
          marginBottom: 0,
          marginTop: 0
        }}>
        <CardTem
          objectArray={item.item}
          rows={this.props.vertical}
          recent={this.state.recent}
          width={Width * 0.468}
        />
      </View>
    ) : (
      <CardTem
        objectArray={item.item}
        rows={this.props.vertical}
        recent={this.state.recent}
        cardStyle={101}
        addToCart={true}
        width={Width * 0.96}
      />
    )

  renderSeparator = () => (
    <View style={{ height: 1, width: '100%', backgroundColor: '#ddd' }} />
  )

  handleLoadMore = () => {
    if (!this.state.finalCon && this.state.dataSource.length % 10 === 0) {
      this.setState(
        {
          refreshing: true,
          fabB: this.props.dataSource.length > 10
        },
        () => {
          if (this.state.tempBox.includes(this.props.page)) {
          } else {
            this.state.tempBox.push(this.props.page)
            this.props.functionPropNameHere()
          }
        }
      )
    } else if (
      !this.state.finalCon &&
      this.state.dataSource.length % 10 !== 0
    ) {
      this.setState({
        refreshing: false
      })
    }
  }

  renderFooter = () => {
    return (
      <View
        style={{
          marginBottom: 50,
          marginTop: 2,
          alignItems: 'center',
          alignSelf: 'center',
          alignContent: 'center'
        }}>
        {this.state.refreshing && this.state.dataSource.length > 9 ? (
          <View style={{ height: 20, marginTop: 30, marginBottom: 20 }}>
            <UIActivityIndicator
              size={27}
              count={12}
              color={theme.loadingIndicatorColor}
            />
          </View>
        ) : null}
      </View>
    )
  }

  handleScroll (event) {
    if (
      this.state.fabB &&
      event.nativeEvent.contentOffset.y >= 0 &&
      event.nativeEvent.contentOffset.y < 300
    ) {
      this.setState({ fabB: false })
    }
  }

  render () {
    return this.state.applyFilter && this.state.dataSource.length === 0 ? (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          alignContent: 'center',
          marginLeft: !I18nManager.isRTL ? Width * 0.28 : Width * 0.25
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
            alignSelf: 'center'
          }}>
          <Icon name={'logo-dropbox'} style={{ color: 'gray', fontSize: 80 }} />

          <Text style={{ fontSize: theme.largeSize + 2, color: theme.textColor }}>
            {this.props.isLoading.Config.languageJson['No Products Found']}
          </Text>
        </View>
      </View>
    ) : this.state.dataSource.length === 0 || this.state.gridCheck ? (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
          alignSelf: 'center',
          alignItems: 'center'
        }}>
        <UIActivityIndicator
          style={{ paddingLeft: Dimensions.get('window').width * 0.46 }}
          size={27}
          color={theme.loadingIndicatorColor}
        />
      </View>
    ) : (
      <View style={{ flex: 1, width: Width }}>
        {this.state.fabB && this.state.dataSource.length > 9 ? (
          <TouchableOpacity
            style={{
              zIndex: 5,
              position: 'absolute',
              right: 22,
              bottom: 60
            }}
            onPress={() => {
              this.flatListRef.scrollToOffset({
                animated: true,
                offset: 0,
                useNativeDriver: true
              }, {
                useNativeDriver: true
              })
              this.setState({ fabB: false })
            }}>
            <View
              style={{
                alignItems: 'center',
                height: 48,
                width: 48,
                borderRadius: 400,
                alignSelf: 'center',
                justifyContent: 'center',
                backgroundColor: theme.primary
              }}>
              <Icon
                name={'md-arrow-up'}
                style={{
                  color: theme.primaryContrast,
                  paddingTop: Platform.OS === 'ios' ? 2 : 0,
                  fontSize: 22
                }}
              />
            </View>
          </TouchableOpacity>
        ) : null}
        <FlatList
          onScroll={this.handleScroll.bind(this)}
          data={this.state.dataSource}
          showsVerticalScrollIndicator={false}
          renderItem={this.renderItem}
          extraData={this.state}
          key={this.state.productView}
          ref={ref => {
            this.flatListRef = ref
          }}
          style={{
            backgroundColor:
              this.props.isLoading.Config.card_style === 11 ||
              this.props.isLoading.Config.card_style === 12 ||
              this.props.isLoading.Config.card_style === 15
                ? theme.backgroundColor
                : theme.backgroundColor
          }}
          contentContainerStyle={{
            marginLeft: 0,
            marginRight: 0,
            paddingBottom: 0,
            marginBottom: 0,
            paddingTop: 0,
            marginTop: 0,
            backgroundColor:
              this.props.isLoading.Config.card_style === 11 ||
              this.props.isLoading.Config.card_style === 12 ||
              this.props.isLoading.Config.card_style === 15
                ? theme.backgroundColor
                : theme.backgroundColor,
            paddingLeft:
              Width >= 375
                ? Width * 0.006
                : Width >= 360 && Width <= 75
                  ? Width * 0.005
                  : Width * 0.004
          }}
          keyExtractor={(item, index) => index.toString()}
          numColumns={this.state.productView === 'grid' ? 2 : 1}
          ListFooterComponent={() => this.renderFooter()}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false
          }}
          onEndReached={() => {
            if (!this.onEndReachedCalledDuringMomentum) {
              this.handleLoadMore()
              this.onEndReachedCalledDuringMomentum = true
            }
          }}
          onEndReachedThreshold={0.5}
        />
      </View>
    )
  }
}
const mapStateToProps = state => ({
  isLoading: state
})

export default connect(mapStateToProps, null)(Fetch)
