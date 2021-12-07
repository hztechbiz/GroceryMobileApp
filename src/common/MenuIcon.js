import React from 'react';
import {Icon} from 'native-base';
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import theme from '../common/Theme.style';
import SyncStorage from 'sync-storage';

const MenuIcon = (props) =>
  !SyncStorage.get('bottom') ? (
    <></>
  ) : // <TouchableOpacity
  //   onPress={() => {
  //     props.navigation.openDrawer();
  //   }}
  //   style={{
  //     justifyContent: 'flex-start',
  //     // backgroundColor: 'red',
  //     // height: 80,
  //     // width: 40,
  //     alignItems: 'flex-start',
  //   }}>
  //   {/* <Image
  //     source={require('../images/LeftMenuIcon/drawer.png')}
  //     resizeMode="contain"
  //     style={{backgroundColor: 'green', height: 50, width: 50}}
  //   /> */}
  //   <View
  //     style={
  //       {
  //         // backgroundColor: 'red',
  //         // justifyContent: '',
  //         // alignItems: 'stretch',
  //         // alignItems: 'center',
  //       }
  //     }>
  //     <View
  //       style={[
  //         {paddingTop: 0},

  //         Platform.OS === 'android' ? styles.iconContainer : null,
  //       ]}>
  //       <Image
  //         // source={require('../images/LeftMenuIcon/drawer.png')}
  //         source={require('../images/drawermenu2.png')}
  //         // source={require('../images/drawermenu.png')}
  //         resizeMode="contain"
  //         style={{height: 60, width: 50,marginLeft: 5}}
  //       />
  //       {/* <Icon
  //         style={{
  //           paddingLeft: 6,
  //           color: theme.headerIconsColor,
  //           fontSize: 22
  //         }}
  //         name='md-menu'
  //       /> */}
  //     </View>
  //   </View>
  // </TouchableOpacity>
  null;
export default MenuIcon;
const styles = StyleSheet.create({
  iconContainer: {
    // paddingLeft: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // paddingTop: 10,
    // marginRight: 5,
  },
});
