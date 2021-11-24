import React from 'react';
import {View, Text, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import {withNavigation} from 'react-navigation';
import {connect} from 'react-redux';
import {Icon} from 'native-base';
import Font_Awesome_basket from 'react-native-vector-icons/FontAwesome5';
import theme from './Theme.style';
import SyncStorage from 'sync-storage';
const ShoppingCartIcon = (props) =>
  !SyncStorage.get('bottom') ? (
    <View
      style={[
        {
          padding: 5,
          paddingTop: Platform.OS === 'ios' ? 20 : 5,
          paddingRight: 6,
          // backgroundColor: 'red',
        },
        styles.maincontainer,
      ]}>
      <TouchableOpacity onPressOut={() => props.navigation.navigate('Search')}>
        <View
          style={{
            alignItems: 'center',
            height: 40,
          }}>
          <View
            style={[
              {padding: 5, paddingRight: 9, paddingTop: 2},
              Platform.OS === 'android' ? styles.iconContainer : null,
            ]}>
            <Icon
              name="search"
              style={{color: theme.primaryContrast, fontSize: 22}}
            />
          </View>
        </View>
      </TouchableOpacity>

      {/* <View
        style={{borderColor: '#3180c6', borderWidth: 0.5, height: 25}}></View> */}

      <View
        style={{borderColor: '#7a4acd', borderWidth: 0.5, height: 25}}></View>

      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Cart');
        }}>
        <View
          style={{
            alignItems: 'center',
            height: 43,
            // marginRight: 5,
            marginTop: 2,
            // backgroundColor: 'pink',
          }}>
          <View
            style={[
              {padding: 8},
              Platform.OS === 'android' ? styles.iconContainer : null,
            ]}>
            <View
              style={{
                position: 'absolute',
                height: 19,
                width: 25,
                borderRadius: 20,
                // backgroundColor: theme.primaryContrast,
                backgroundColor: '#ed1c24',
                right: -12,
                bottom: 30,
                // padding: 12,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000,
              }}>
              <Text
                style={{
                  // color: theme.primary,
                  color: '#fff',
                  fontWeight: '500',
                  alignSelf: 'center',
                }}>
                {props.cartquantity}
              </Text>
            </View>
            <Font_Awesome_basket
              name="shopping-basket"
              style={{color: theme.primaryContrast, fontSize: 20}}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  ) : null;

const mapStateToProps = (state) => ({
  cartquantity: state.cartItems.cartquantity,
});
export default connect(mapStateToProps, null)(ShoppingCartIcon);

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    paddingLeft: 10,
    paddingTop: 10,
    marginRight: 5,
  },
});
