import React, {PureComponent} from 'react';
import {
  Text,
  View,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  TouchableHighlight,
  I18nManager,
} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';
import Swiper from '../common/Swiper';
import {connect} from 'react-redux';
import ImageLoad from './RnImagePlaceH';
import {Icon} from 'native-base';
import ImageViewer from 'react-native-image-zoom-viewer';
import theme from './Theme.style';
const {width, height} = Dimensions.get('window');
class Banner extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      isLoading: true,
      page: 11,
      refreshing: false,
      loading: true,
      visible: false,
      index: 0,
    };
  }

  static getDerivedStateFromProps(props, state) {
    state.dataSource = [];
    let temp = 0;
    if (typeof props.productImage !== 'string') {
      props.productImage.map((val2) => {
        state.dataSource.push(
          Object.create({
            url:
              val2.image === undefined
                ? theme.image_url + '/' + val2
                : theme.image_url + '/' + val2.image,
            source: require('../images/ProductDetail.png'),
            id: temp,
          }),
        );
        temp++;
      });
    } else {
      state.dataSource.push(
        Object.create({
          url:
            props.productImage === undefined
              ? theme.image_url + '/' + props.productImage
              : theme.image_url + '/' + props.productImage,
          source: require('../images/ProductDetail.png'),
          id: 1,
        }),
      );
    }
    return null;
  }

  componentDidMount() {
    this.state.dataSource = [];
    let temp2 = 0;
    if (typeof this.props.productImage !== 'string') {
      this.props.productImage.map((val2) => {
        this.state.dataSource.push(
          Object.create({
            url:
              val2.image === undefined
                ? theme.image_url + '/' + val2
                : theme.image_url + '/' + val2.image,
            source: require('../images/ProductDetail.png'),
            id: temp2,
          }),
        );
        temp2++;
      });
    } else {
      this.state.dataSource.push(
        Object.create({
          url:
            this.props.productImage === undefined
              ? theme.image_url + '/' + this.props.productImage
              : theme.image_url + '/' + this.props.productImage,
          source: require('../images/ProductDetail.png'),
          id: 1,
        }),
      );
    }

    this.setState({
      isLoading: false,
    });
  }

  checkProductNew = () => {
    const pDate = new Date(this.props.objectArray.products_date_added);
    const date =
      pDate.getTime() +
      this.props.cartItems2.Config.newProductDuration * 86400000;
    const todayDate = new Date().getTime();
    if (date > todayDate) {
      return true;
    }
    return false;
  };

  render() {
    return this.state.isLoading ? (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          height: 200,
          // backgroundColor: 'red',
        }}>
        <UIActivityIndicator size={27} color={theme.loadingIndicatorColor} />
      </View>
    ) : (
      <View>
        <Swiper
          navigation={this.props.navigation}
          type="Home"
          type2="ProductDetails">
          {this.state.dataSource.map((val, key) => (
            <TouchableHighlight
              key={key}
              onPress={() => {
                this.setState({visible: true, index: key});
              }}>
              <View>
                {this.checkProductNew() ? (
                  <Text
                    style={{
                      zIndex: 12,
                      textAlign: 'center',
                      fontSize: theme.mediumSize,
                      left: 0,
                      top: 10,
                      // backgroundColor: 'red',
                      padding: 4,
                      paddingLeft: 6,
                      paddingRight: 6,
                      color: '#fff',
                      position: 'absolute',
                      fontWeight: '600',
                    }}>
                    {this.props.cartItems2.Config.languageJson.New}
                  </Text>
                ) : null}
                <View>
                  <Modal visible={this.state.visible} transparent s>
                    <ImageViewer
                      index={this.state.index}
                      imageUrls={this.state.dataSource}
                      enableSwipeDown
                      onSwipeDown={() => this.setState({visible: false})}
                      renderHeader={() => (
                        <TouchableWithoutFeedback
                          style={{
                            height: 200,
                            width,
                            backgroundColor: theme.textColor,
                            paddingLeft: 80,
                            // borderRadius: 15,
                          }}
                          onPress={() => this.setState({visible: false})}>
                          <Icon
                            onPress={() => this.setState({visible: false})}
                            name={'close'}
                            style={{
                              fontSize: 22,
                              color: '#fff',
                              width,
                              height: 100,
                              left: 0,
                              right: 0,
                              paddingLeft: !I18nManager.isRTL ? 20 : 20,
                              paddingRight: !I18nManager.isRTL ? 2 : 20,
                              paddingTop: !I18nManager.isRTL
                                ? Platform.OS === 'ios'
                                  ? 70
                                  : 70
                                : 70,
                              zIndex: 3,
                              position: 'absolute',
                              top: 0,
                              backgroundColor: 'transparent',
                            }}
                          />
                        </TouchableWithoutFeedback>
                      )}
                    />
                  </Modal>
                  <View
                    style={{
                      // height: height * 0.47,
                      // width:
                      // width: width * 0.89,
                      // backgroundColor: 'red',
                      alignItems: 'center',
                      justifyContent: 'center',
                      // alignContent: 'center',
                      // elevation: 5,
                      padding: 6,
                      // paddingHorizontal: 10,

                      // backgroundColor: 'yellow',
                      backgroundColor: 'white',
                      // borderRadius: 20,
                      // marginLeft: 2,
                      // marginHorizontal: 7,
                    }}>
                    {/* <View
                      style={{
                        // alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // backgroundColor: 'red',
                        // height: height,
                        // width: width / 0.5,
                        width: width,
                        // paddingBottom: 100,
                        // paddingRight: 30,
                      }}> */}
                    <View>
                      <ImageLoad
                        resizeMode={'contain'}
                        key={key}
                        style={{
                          // width: width,

                          // height:
                          //   Platform.OS === 'ios'
                          //     ? theme.singleRowCardWidth + 100
                          //     : theme.singleRowCardWidth + 100,
                          height: height * 0.47,
                          // width:
                          // alignSelf: 'center',
                          width: width * 0.88,

                          backgroundColor: 'white',
                          // backgroundColor: 'green',
                          alignItems: 'center',
                          justifyContent: 'center',
                          elevation: 5,

                          borderRadius: 15,
                        }}
                        loadingStyle={{
                          size: 'large',
                          color: theme.loadingIndicatorColor,
                        }}
                        placeholder={false}
                        ActivityIndicator={true}
                        placeholderStyle={{width: 0, height: 0}}
                        source={{uri: val.url}}
                      />
                    </View>
                  </View>
                  {/* </View> */}
                </View>
              </View>
            </TouchableHighlight>
          ))}
        </Swiper>
      </View>
    );
  }
}

/// ///////////////////////////////////////////////
const mapStateToProps = (state) => ({
  cartItems2: state,
});
/// //////////////////////////////////////////
export default connect(mapStateToProps, null)(Banner);
