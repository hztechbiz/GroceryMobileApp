import React from 'react'
import { Icon } from 'native-base'
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import theme from '../common/Theme.style'
import SyncStorage from 'sync-storage'
const MenuIcon = props =>
  !SyncStorage.get('bottom') ? (
    <TouchableOpacity
      onPress={() => {
        props.navigation.openDrawer()
      }}>
      <View
        style={{
          alignItems: 'center'
        }}>
        <View
          style={[
            { padding: 3 },
            Platform.OS === 'android' ? styles.iconContainer : null
          ]}>
          <Icon
            style={{
              paddingLeft: 6,
              color: theme.headerIconsColor,
              fontSize: 22
            }}
            name='md-menu'
          />
        </View>
      </View>
    </TouchableOpacity>
  ) : null
export default MenuIcon
const styles = StyleSheet.create({
  iconContainer: {
    paddingLeft: 10,
    paddingTop: 6,
    marginRight: 5
  }
})
