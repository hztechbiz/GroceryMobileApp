import React from 'react'
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { Icon } from 'native-base'
import theme from './Theme.style'
import SyncStorage from 'sync-storage'
const ShoppingCartIcon = props =>
  !SyncStorage.get('bottom') ? (
    <View
      style={[
        {
          padding: 5,
          paddingTop: Platform.OS === 'ios' ? 20 : 5,
          paddingRight: 6
        },
        styles.maincontainer
      ]}>
      <TouchableOpacity onPressOut={() => props.navigation.navigate('Search')}>
        <View
          style={{
            alignItems: 'center',
            height: 40
          }}>
          <View
            style={[
              { padding: 5, paddingRight: 9, paddingTop: 2 },
              Platform.OS === 'android' ? styles.iconContainer : null
            ]}>
            <Icon
              name='search'
              style={{ color: theme.primaryContrast, fontSize: 22 }}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Cart')
        }}>
        <View
          style={{
            alignItems: 'center',
            height: 43,
            marginRight: 5,
            marginTop: 2
          }}>
          <View
            style={[
              { padding: 5 },
              Platform.OS === 'android' ? styles.iconContainer : null
            ]}>
            <View
              style={{
                position: 'absolute',
                height: 19,
                width: 25,
                borderRadius: 8,
                backgroundColor: theme.primaryContrast,
                right: -8,
                bottom: 20,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000
              }}>
              <Text
                style={{
                  color: theme.primary,
                  fontWeight: '500',
                  alignSelf: 'center'
                }}>
                {props.cartquantity}
              </Text>
            </View>
            <Icon
              name='cart'
              style={{ color: theme.primaryContrast, fontSize: 22 }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  ) : null

const mapStateToProps = state => ({
  cartquantity: state.cartItems.cartquantity
})
export default connect(mapStateToProps, null)(ShoppingCartIcon)

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
