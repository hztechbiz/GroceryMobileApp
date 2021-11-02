import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  ImageBackground
} from 'react-native'
import theme from './Theme.style'
const WIDTH = Dimensions.get('window').width
export default Category1 = props => (
  <TouchableOpacity
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      backgroundColor: theme.backgroundColor,
      margin: 4,
      marginTop: 8,
      marginBottom: 0
    }}
    onPress={() => props.openSubCategories(props.item, props.item.name)}>
    <ImageBackground
      key={props.id}
      style={{
        height: 250,
        width: WIDTH * 0.95
      }}
      loadingStyle={{ size: 'large', color: theme.loadingIndicatorColor }}
      placeholder={false}
      ActivityIndicator={true}
      placeholderStyle={{ width: 0, height: 0 }}
      backgroundColor='transparent'
      color='transparent'
      source={{ uri: theme.url + '/' + props.item.image }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          width: WIDTH * 0.95,
          alignContent: 'center',
          opacity: 0.3,
          backgroundColor: theme.primary
        }}
      />
      <View
        style={{
          height: 250,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          width: WIDTH * 0.95,
          alignContent: 'center',
          zIndex: 9,
          position: 'absolute'
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: theme.largeSize + 8,
            color: '#fff'
          }}>
          {props.item.name}
        </Text>
        <Text
          style={{
            fontSize: theme.largeSize,
            color: '#fff',
            fontWeight: '500'
          }}>{`${props.item.total_products} ${props.products}`}</Text>
      </View>
    </ImageBackground>
  </TouchableOpacity>
)
