import React from 'react'
import { View, StyleSheet, Platform, TouchableOpacity, Share, Alert } from 'react-native'
import { withNavigation } from 'react-navigation'
import RateUsButton from '../screens/RateUs'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import theme from './Theme.style'
const onShare = async props => {
  try {
    const result = await Share.share({
      message: `https://play.google.com/store/apps/details?id=${props.cartItems2.Config.packgeName}`
    })

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
      } else {
      }
    } else if (result.action === Share.dismissedAction) {
    }
  } catch (error) {
    Alert.alert(error.message)
  }
}
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
    <TouchableOpacity onPress={() => onShare(props)}>
      <View
        style={{
          alignItems: 'center',
          height: 40
        }}>
        <View
          style={[
            { padding: 5, paddingRight: 12, paddingTop: 2 },
            Platform.OS === 'android' ? styles.iconContainer : null
          ]}>
          <Icon
            name='md-share'
            style={{ color: theme.headerIconsColor, fontSize: 20 }}
          />
        </View>
      </View>
    </TouchableOpacity>

    <RateUsButton
      text={'text'}
      iconName={'md-star-half'}
      appleId={props.cartItems2.Config.packgeName}
    />
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
