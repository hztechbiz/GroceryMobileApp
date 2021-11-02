import React from 'react'
import { View, Image } from 'react-native'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { Icon } from 'native-base'
import ThemeStyle from './Theme.style'
const ShoppingCartIcon = props => (
  <View>
    {!props.cartItems2.Config.defaultIcons ? (
      <Image
        key={0}
        style={{ width: 25, height: 25 }}
        loadingStyle={{ size: 'large', color: ThemeStyle.primary }}
        placeholderStyle={{ width: 25, height: 25 }}
        source={props.imageTemp}
      />
    ) : (
      <Icon name={props.iconName} style={{ color: props.color, fontSize: 23 }} />
    )}
  </View>
)

const mapStateToProps = state => ({
  cartItems2: state
})
export default connect(mapStateToProps, null)(withNavigation(ShoppingCartIcon))
