import React from 'react'
import { View, StyleSheet, ImageBackground, Alert } from 'react-native'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import {
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Button,
  Icon,
  Body
} from 'native-base'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import HTML from 'react-native-render-html'
import theme from './Theme.style'

SingleComponent = (size, props, widthPic, widthBtn, t) => (
  <Container
    style={{
      paddingLeft: 2,
      height: 240,
      backgroundColor: theme.backgroundColor
    }}>
    <Content
      style={{
        paddingLeft: 2,
        height: 250,
        width: size,
        backgroundColor: theme.backgroundColor
      }}>
      <Card>
        <CardItem
          cardBody
          button
          onPress={() =>
            props.navigation.push('ProductDetails', {
              productImageArray: props.productImage,
              onSale: props.onSale,
              featured: props.featured,
              htmlPrice: props.htmlPrice,
              name: props.name,
              inStock: props.inStock,
              price: props.price,
              description: props.description,
              relatedIdsArray: props.relatedIdsArray,
              storeSallerInforArray: props.storeSallerInforArray,
              ratingCountArray: props.ratingCountArray,
              averageRatingArray: props.averageRatingArray
            })
          }>
          <ImageBackground
            onPress={() => Alert.alert('Image')}
            source={{ uri: props.item }}
            style={{ height: 125, width: widthPic }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                alignContent: 'flex-end',
                alignItems: 'flex-end'
              }}>
              {props.onSale ? (
                <Text
                  style={{
                    fontSize: 11,
                    width: 30,
                    paddingLeft: 1,
                    height: 15,
                    backgroundColor: '#20b2e6',
                    color: '#fff'
                  }}>
                  {this.props.cartItems2.Config.languageJson.SALE}
                </Text>
              ) : null}
              {props.featured ? (
                <Text
                  style={{
                    fontSize: 11,
                    width: 59,
                    paddingLeft: 1,
                    height: 15,
                    backgroundColor: '#20b2e6',
                    color: '#fff'
                  }}>
                  {this.props.cartItems2.Config.languageJson.Featured}
                </Text>
              ) : null}
            </View>
          </ImageBackground>
        </CardItem>

        <CardItem>
          <Body>
            <Text style={{ fontSize: 15, width: 125, height: 20 }}>
              {props.name}
            </Text>
            <Content>
              <View style={styles.outerView}>
                <View style={styles.innerView}>
                  <HTML
                    html={props.htmlPrice}
                    baseFontStyle={{ fontSize: 11 }}
                    containerStyle={{ width: 94, height: 20 }}
                  />
                </View>
                <Icon
                  style={styles.iconStyle}
                  active
                  name='heart'
                  onPress={() => Alert.alert('Heart')}
                />
              </View>
            </Content>

            <Content
              style={{ width: widthBtn, backgroundColor: theme.backgroundColor, paddingTop: 5 }}>
              {props.inStock === false ? (
                <Button
                  block
                  rounded
                  style={{
                    height: 30,
                    width: widthBtn,
                    backgroundColor: '#d62c2c'
                  }}>
                  <Text style={{ fontSize: 13 }}>
                    {this.props.cartItems2.Config.languageJson['Out of Stock']}
                  </Text>
                </Button>
              ) : props.type === 'simple' ? (
                <Button
                  block
                  rounded
                  style={{
                    height: 30,
                    width: widthBtn,
                    backgroundColor: theme.primary
                  }}
                  onPress={() => t.newMethod2(props)}>
                  <Text style={{ fontSize: 13 }}>
                    {this.props.cartItems2.Config.languageJson['Add to Cart']}
                  </Text>
                </Button>
              ) : props.type === 'external' ||
                props.type === 'grouped' ||
                props.type === 'variable' ? (
                  <Button
                    block
                    rounded
                    style={{
                      height: 30,
                      width: widthBtn,
                      backgroundColor: theme.primary
                    }}
                    onPress={() =>
                      props.navigation.push('ProductDetails', {
                        productImageArray: props.productImage,
                        onSale: props.onSale,
                        featured: props.featured,
                        htmlPrice: props.htmlPrice,
                        name: props.name,
                        inStock: props.inStock,
                        price: props.price,
                        description: props.description,
                        relatedIdsArray: props.relatedIdsArray,
                        storeSallerInforArray: props.storeSallerInforArray,
                        ratingCountArray: props.ratingCountArray,
                        averageRatingArray: props.averageRatingArray
                      })
                    }>
                    <Text style={{ fontSize: 13 }}>
                      {this.props.cartItems2.Config.languageJson.DETAILS}
                    </Text>
                  </Button>
                ) : null}
            </Content>
          </Body>
        </CardItem>
      </Card>
    </Content>
  </Container>
)

newMethod2 = props => {
  props.addItemToCart(props.name)
}
const CardTemplate = props => (
  <View>
    {props.rows === false
      ? this.SingleComponent(wp('48.7%'), props, wp('46.9%'), wp('39%'), this)
      : this.SingleComponent(wp('44%'), props, wp('42.1%'), wp('34%'), this)}
  </View>
)

const mapDispatchToProps = dispatch => ({
  addItemToCart: product => dispatch({ type: 'ADD_TO_CART', payload: product })
})

/// ///////////////////////////////////////////////
const mapStateToProps = state => ({
  cartItems2: state
})
/// //////////////////////////////////////////
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(CardTemplate))

const styles = StyleSheet.create({
  container: {
    paddingLeft: 7,
    height: 240,
    backgroundColor: '#f2f2f2'
  },
  Content: {
    paddingLeft: 2,
    height: 250,
    width: wp('44%'),
    backgroundColor: '#f2f2f2'
  },
  outerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'stretch',

    height: 26
  },
  innerView: {
    flexDirection: 'row',
    width: 80,
    backgroundColor: theme.backgroundColor,
    height: 8,
    paddingTop: 5
  },
  iconStyle: {
    paddingLeft: 16,
    color: '#cccccc',
    height: 40,
    paddingBottom: 4
  }
})
