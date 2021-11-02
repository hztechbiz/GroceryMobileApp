import React from 'react'
import { View, TouchableOpacity, Text, Dimensions } from 'react-native'
import ImageLoad from './RnImagePlaceH'
import theme from './Theme.style'
const WIDTH = Dimensions.get('window').width
export default Category5 = props => (
  <TouchableOpacity
    style={{
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: props.header ? '#d3d3d3' : theme.backgroundColor,
      width: WIDTH,
      padding: 8,
      borderColor: 'gray',
      flexDirection: 'row'
    }}
    onPress={() => props.openSubCategories(props.item, props.item.name)}>
    <View
      style={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backfaceVisibility: 'hidden',
        backgroundColor: props.header ? '#d3d3d3' : theme.backgroundColor,
        alignContent: 'center'
      }}>
      <Text
        style={{
          fontSize: props.header ? theme.largeSize : theme.mediumSize,
          color: theme.backgroundColor,
          fontWeight: props.header ? 'bold' : '600'
        }}>
        {props.item.name}
      </Text>
      {!props.header ? (
        <Text
          style={{
            color: theme.textColor,
            fontSize: theme.smallSize,
            paddingTop: 3,
            fontWeight: '400'
          }}>{`${props.item.total_products} ${props.products}`}</Text>
      ) : null}
    </View>
    <ImageLoad
      key={props.id}
      style={{
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        overflow: 'hidden',
        marginRight: 8
      }}
      loadingStyle={{ size: 'large', color: theme.loadingIndicatorColor }}
      placeholder={false}
      ActivityIndicator={true}
      placeholderStyle={{ width: 0, height: 0 }}
      backgroundColor='transparent'
      color='transparent'
      source={{ uri: theme.url + '/' + props.item.image }}
    />
  </TouchableOpacity>
)
