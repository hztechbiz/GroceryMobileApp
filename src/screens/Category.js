import React, { PureComponent } from 'react'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { Platform } from 'react-native'
import Category1Screen from './Category1Screen'
import Category2Screen from './Category2Screen'
import Category3Screen from './Category3Screen'
import Category4Screen from './Category4Screen'
import Category5Screen from './Category5Screen'
import Category6Screen from './Category6Screen'
import { connect } from 'react-redux'
import theme from '../common/Theme.style'
import ShoppingCartIcon from '../common/ShoppingCartIcon'
import MenuIcon from '../common/MenuIcon'
class Category extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    return {
      headerLeft: () => <MenuIcon navigation={navigation} />,
      headerTitle: headerStyle,
      headerRight: () => <ShoppingCartIcon navigation={navigation} />,
      headerTintColor: theme.headerTintColor,
      headerStyle: {
        backgroundColor: theme.primary
      },
      headerTitleAlign: 'center',
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      gestureEnabled: true,
      gesturesDirection: 'inverted',
      headerTitleStyle: {
        fontWeight: Platform.OS === 'android' ? 'bold' : 'normal'
      },
      headerForceInset: { top: 'never', vertical: 'never' }
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.mystore.Config.languageJson.Categories
    })
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return this.props.mystore.Config.categoryPage === 1 ? (
      <Category1Screen navigation={this.props.navigation} />
    ) : this.props.mystore.Config.categoryPage === 2 ? (
      <Category2Screen navigation={this.props.navigation} />
    ) : this.props.mystore.Config.categoryPage === 3 ? (
      <Category3Screen navigation={this.props.navigation} />
    ) : this.props.mystore.Config.categoryPage === 4 ? (
      <Category4Screen navigation={this.props.navigation} />
    ) : this.props.mystore.Config.categoryPage === 5 ? (
      <Category5Screen navigation={this.props.navigation} />
    ) : this.props.mystore.Config.categoryPage === 6 ? (
      <Category6Screen navigation={this.props.navigation} />
    ) : (
      <Category1Screen />
    )
  }
}
const mapStateToProps = state => ({
  mystore: state
})
export default connect(mapStateToProps, null)(Category)
