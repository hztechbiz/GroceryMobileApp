import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Image
} from 'react-native'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { Icon } from 'native-base'
import theme from './Theme.style'

const ShoppingCartIcon = props => (
  <View
    style={[
      {
        padding: 5,
        paddingTop: Platform.OS === 'ios' ? 20 : 5,
        paddingRight: 6
      },
      styles.maincontainer
    ]}>
    <TouchableWithoutFeedback
      onPress={() => {
        props.navigation.navigate('Cart')
      }}>
      <View
        style={{
          alignItems: 'center',
          height: 43
        }}>
        <View
          style={[
            { padding: 5 },
            Platform.OS === 'android' ? styles.iconContainer : null
          ]}>
          <View
            style={{
              position: 'absolute',
              height: 15,
              width: 17,
              borderRadius: 6,
              backgroundColor: theme.primaryContrast,
              right: -3,
              bottom: 16,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000
            }}>
            <Text
              style={{
                color: theme.primary,
                fontWeight: '500',
                alignSelf: 'center',
                fontSize: 12
              }}>
              {props.cartItems2.cartItems.cartquantity}
            </Text>
          </View>
          {!props.cartItems2.Config.defaultIcons && props.White ? (
            <Image
              key={0}
              style={{ width: 25, height: 25 }}
              loadingStyle={{ size: 'large', color: theme.primary }}
              placeholderStyle={{ width: 25, height: 25 }}
              source={props.imageTemp}
            />
          ) : (
            <Icon
              name={'cart'}
              style={{ color: props.tintColor, fontSize: 23 }}
            />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  </View>
)

const mapStateToProps = state => ({
  cartItems2: state
})
export default connect(mapStateToProps, null)(withNavigation(ShoppingCartIcon))

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  iconContainer: {
    paddingLeft: 10,
    paddingTop: 10,
    marginRight: 5
  }
})
