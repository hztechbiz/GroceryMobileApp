import React, { PureComponent } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  I18nManager,
  Platform
} from 'react-native'
import { ListItem, Icon } from 'native-base'
import { connect } from 'react-redux'
import ImageLoad from '../common/RnImagePlaceH'
import themeStyle from '../common/Theme.style'

class ExpandableListView extends PureComponent {
  constructor () {
    super()
    this.state = {
      layoutHeight: 0,
      dropdownValue: 0,
      dropdownValue1: [0, 0, 0]
    }
  }

  static getDerivedStateFromProps (props) {
    if (props.item.expanded) {
      return {
        layoutHeight: null
      }
    } else {
      return {
        layoutHeight: 0
      }
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.layoutHeight !== nextState.layoutHeight) {
      return true
    }
    return false
  }

  showSelectedCategory = item => {
    // subcategory
    // Write your code here which you want to execute on sub category selection.
    const string = item
    const newString = string.replace(/\s+/g, '') // "thiscontainsspaces"
    if (newString === 'HOME3') {
      this.props.navigation.navigate('Home3Screen', {
        id: undefined,
        name: undefined, /// ////////////////////////////////////////////////
        sortOrder:
          newString === 'NEWEST'
            ? 'Newest'
            : newString === 'DEALS'
              ? 'special'
              : newString === 'TOPSELLER'
                ? 'top seller'
                : 'most liked'
      })
    } else if (
      newString === 'NEWEST' ||
      newString === 'DEALS' ||
      newString === 'TOPSELLER' ||
      newString === 'MOSTLIKED'
    ) {
      this.props.navigation.navigate('NewestScreen', {
        id: undefined,
        name: undefined, /// ////////////////////////////////////////////////
        sortOrder:
          newString === 'NEWEST'
            ? 'Newest'
            : newString === 'DEALS'
              ? 'special'
              : newString === 'TOPSELLER'
                ? 'top seller'
                : 'most liked'
      })
    } else if (newString !== 'HOME3') {
      this.props.navigation.navigate(newString)
    }
  }

  dropdownValueFun = () => {}

  render () {
    if (this.state.dropdownValue1[this.props.count] === 0) {
      this.state.dropdownValue1[this.props.count] = 1
    } else {
      this.state.dropdownValue1[this.props.count] = 0
    }
    return (
      <View
        style={{
          padding: 0
        }}>
        <ListItem noIndent={true}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={this.dropdownValueFun}
            onPress={this.props.onClickFunction}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: themeStyle.backgroundColor
            }}>
            <View style={styles.tabComponents}>
              {!this.props.isLoading.Config.defaultIcons ? (
                <ImageLoad
                  key={0}
                  style={{
                    width: 18,
                    height: 18,
                    marginRight: I18nManager.isRTL ? 8 : 0,
                    marginLeft: 3
                  }}
                  loadingStyle={{ size: 'large', color: themeStyle.primary }}
                  placeholder={false}
                  ActivityIndicator={true}
                  placeholderStyle={{ width: 0, height: 0 }}
                  source={this.props.item.categoryName.imageName}
                />
              ) : (
                <Icon
                  name={this.props.item.categoryName.iconName}
                  size={20}
                  style={{
                    color: themeStyle.textColor,
                    fontSize: 19,
                    paddingLeft: I18nManager.isRTL
                      ? Platform.OS === 'ios'
                        ? 3
                        : 11
                      : 3,
                    paddingRight: I18nManager.isRTL
                      ? Platform.OS === 'ios'
                        ? 3
                        : 3
                      : 2
                  }}
                />
              )}

              <Text style={{
                textAlign: 'left',
                color: themeStyle.textColor,
                fontSize: themeStyle.mediumSize,
                paddingLeft: 7
              }}>
                {this.props.item.categoryName.jsonName}{' '}
              </Text>
            </View>

            <Icon
              name={
                this.state.dropdownValue1[this.props.count] === 0
                  ? 'arrow-dropup'
                  : 'arrow-dropdown'
              }
              style={{
                color: themeStyle.textColor,
                paddingRight: 12,
                paddingLeft: 12,
                fontSize: 19
              }}
            />
          </TouchableOpacity>
        </ListItem>
        <View style={{ height: this.state.layoutHeight, overflow: 'hidden' }}>
          {this.props.item.categoryName.subCategory.map((item, key) => (
            <View key={key}>
              <ListItem noIndent={true}>
                <TouchableOpacity
                  key={key}
                  activeOpacity={0.8}
                  onPress={this.showSelectedCategory.bind(this, item.name)}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: themeStyle.backgroundColor
                  }}>
                  <View style={styles.tabComponents}>
                    {!this.props.isLoading.Config.defaultIcons ? (
                      <ImageLoad
                        key={0}
                        style={{
                          width: 18,
                          height: 18,
                          marginRight: I18nManager.isRTL ? 8 : 8,
                          marginLeft: 8
                        }}
                        loadingStyle={{
                          size: 'large',
                          color: themeStyle.primary
                        }}
                        placeholderSource={require('../images/placeholder.png')}
                        placeholderStyle={{
                          width: 18,
                          height: 18,
                          marginRight: I18nManager.isRTL
                            ? 8
                            : Platform.OS === 'android'
                              ? 8
                              : 0,
                          marginLeft: Platform.OS === 'android' ? 8 : 0
                        }}
                        source={item.imageName}
                      />
                    ) : (
                      <Icon
                        name={item.iconName}
                        size={20}
                        style={{
                          color: themeStyle.textColor,
                          paddingLeft: I18nManager.isRTL ? 8 : 8,
                          paddingRight: I18nManager.isRTL ? 8 : 8,
                          fontSize: 19
                        }}
                      />
                    )}

                    <Text style={[{
                      textAlign: 'left',
                      color: themeStyle.backgroundColor,
                      fontSize: themeStyle.smallSize,
                      paddingLeft: 8
                    }, { color: themeStyle.textColor }]}>{item.jsonName}</Text>
                  </View>
                </TouchableOpacity>
              </ListItem>
            </View>
          ))}
        </View>
      </View>
    )
  }
}
const mapStateToProps = state => ({
  isLoading: state
})

export default connect(mapStateToProps, null)(ExpandableListView)
const styles = StyleSheet.create({
  tabComponents: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'space-between',
    alignItems: 'center'
  }
})
