import React, { PureComponent } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import ShoppingCartIcon3 from '../common/ShoppingCartIcon3'
import BottomIconImage from '../common/BottomIconImage'
import theme from './Theme.style'
const WIDTH = Dimensions.get('window').width
class ShoppingCartIcon extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      selected: [true, false, false, false, false],
      home: this.props.home
    }
  }

  render () {
    return (
      <View
        style={{
          flexDirection: 'row',
          position: 'absolute',
          bottom: 0,
          backgroundColor: theme.backgroundColor,
          width: WIDTH,
          height: 50,
          justifyContent: 'space-evenly',
          alignItems: 'center',
          zIndex: 6
        }}>
        <TouchableOpacity
          style={{ justifyContent: 'center', alignItems: 'center' }}
          onPress={() => {
            if (this.props.active !== 0) this.props.navigation.navigate(this.props.home)
          }}>
          <BottomIconImage
            color={this.props.active === 0 ? theme.primaryDark : '#707070'}
            imageTemp={require('../images/LeftMenuIcon/home.png')}
            iconName={'md-home'}
          />
          <Text
            style={{
              color: this.props.active === 0 ? theme.primaryDark : '#707070',
              fontSize: theme.smallSize
            }}>
            {this.props.isLoading.Config.languageJson.Home}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ justifyContent: 'center', alignItems: 'center' }}
          onPress={() => {
            this.props.navigation.navigate('SearchScreen')
          }}>
          <BottomIconImage
            color={this.props.active === 1 ? theme.primaryDark : '#707070'}
            imageTemp={require('../images/LeftMenuIcon/search.png')}
            iconName={'md-search'}
          />
          <Text
            style={{
              color: this.props.active === 1 ? theme.primaryDark : '#707070',
              fontSize: theme.smallSize
            }}>
            {this.props.isLoading.Config.languageJson.Search}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ justifyContent: 'center', alignItems: 'center' }}
          onPress={() => {
            this.props.navigation.navigate('Categories')
          }}>
          <BottomIconImage
            color={this.props.active === 2 ? theme.primaryDark : '#707070'}
            imageTemp={require('../images/LeftMenuIcon/apps.png')}
            iconName={'md-apps'}
          />
          <Text
            style={{
              color: this.props.active === 2 ? theme.primaryDark : '#707070',
              fontSize: theme.smallSize
            }}>
            {this.props.isLoading.Config.languageJson.Categories}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            marginBottom: 3,
            alignItems: 'center'
          }}
          onPress={() => {
            this.props.navigation.navigate('Cart')
          }}>
          <ShoppingCartIcon3
            tintColor={this.props.active === 3 ? theme.primaryDark : '#707070'}
            White
            imageTemp={require('../images/LeftMenuIcon/shopping-cart-png.png')}
          />
          <Text
            style={{
              color: this.props.active === 3 ? theme.primaryDark : '#707070',
              fontSize: theme.smallSize
            }}>
            {this.props.isLoading.Config.languageJson['My Cart']}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 3
          }}
          onPress={() => {
            this.props.navigation.navigate('SettingsScreen')
          }}>
          <BottomIconImage
            color={this.props.active === 4 ? theme.primaryDark : '#707070'}
            imageTemp={require('../images/LeftMenuIcon/icon-user.png')}
            iconName={'md-person'}
          />
          <Text
            style={{
              color: this.props.active === 4 ? theme.primaryDark : '#707070',
              fontSize: theme.smallSize
            }}>
            {this.props.isLoading.Config.languageJson.Settings}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  isLoading: state
})
export default connect(mapStateToProps, null)(withNavigation(ShoppingCartIcon))
