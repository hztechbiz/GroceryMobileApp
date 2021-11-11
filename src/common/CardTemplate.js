import React, {Component} from 'react';
import {View, Image, Text} from 'react-native';
import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import {postHttp, getUrl} from './WooComFetch';
import HTML from 'react-native-render-html';
import SyncStorage from 'sync-storage';
import theme from './Theme.style';
import CardOne from './CardStyles/CardOne';
import CardOneHori from './CardStyles/CardOneHori';
import CardTwo from './CardStyles/CardTwo';
import CardThree from './CardStyles/CardThree';
import CardFour from './CardStyles/CardFour';
import CardFive from './CardStyles/CardFive';
import CardSix from './CardStyles/CardSix';
import CardSeven from './CardStyles/CardSeven';
import CardEight from './CardStyles/CardEight';
import CardNine from './CardStyles/CardNine';
import CardTenth from './CardStyles/CardTenth';
import CardElev from './CardStyles/CardElev';
import CardTwelve from './CardStyles/CardTwelve';
import CardThirteen from './CardStyles/CardThirteen';
import CardFourteen from './CardStyles/CardFourteen';
import CardFifteen from './CardStyles/CardFifteen';
import CardSixteen from './CardStyles/CardSixteen';
import CardSeventeen from './CardStyles/CardSeventeen';
import CardEighteen from './CardStyles/CardEighteen';
import CardNineteen from './CardStyles/CardNineteen';
import CardTwenty from './CardStyles/CardTwenty';
import CardTOne from './CardStyles/CardTOne';
import CardTtwo from './CardStyles/CardTtwo';
import {createSelector} from 'reselect';
class CardTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      isLoading: false,
      page: 11,
      refreshing: false,
      temp1: 0,
      counter: 0,
      stepperArray: [],
      wishListId: 0,
      wishListValue: '0',
      incdecquantity: 1,
    };
    global.SampleVar = false;
  }

  static getDerivedStateFromProps(props, state) {
    if (props.cardStyleE === 22) {
      if (
        state.stepperArray[props.objectArray.id] !== null &&
        state.stepperArray[props.objectArray.id] !== undefined
      ) {
        props.cartProductArrayViewedProducts.map((val, key) => {
          if (
            val.products_id === props.objectArray.id &&
            state.stepperArray.length > 0
          ) {
            state.stepperArray[props.objectArray.id].setValue(val.quantity);
            return {counter: val.quantity};
          }
        });
        let temp = 0;
        props.cartProductArrayViewedProducts.map((cartItem) => {
          if (cartItem.products_id === props.objectArray.id) {
            temp = 1;
          }
        });
        if (state.stepperArray.length > 0 && temp === 0) {
          state.stepperArray[props.objectArray.id].setValue(0);
          return {counter: 0};
        }
        if (
          state.stepperArray.length > 0 &&
          props.cartProductArrayViewedProducts.length === 0
        ) {
          state.stepperArray[props.objectArray.id].setValue(0);
        }
        return {counter: 0};
      }
    } else {
    }
  }

  checkProductNew = (props) => {
    const pDate = new Date(props.objectArray.date_created);
    const date = pDate.getTime() + this.props.newProductDuration * 86400000;
    const todayDate = new Date().getTime();
    if (date > todayDate) {
      return true;
    }
    return false;
  };

  priceFun = (size, name, textDecorationLine, temp) => (
    <View style={{flexDirection: 'row', paddingRight: 5}}>
      <HTML
        html={SyncStorage.get('currency')}
        baseFontStyle={{
          fontSize: size,
          color: temp === false ? '#A20000' : theme.textColor,
          textDecorationLine,
        }}
      />
      <Text
        style={{
          color: temp === false ? '#A20000' : theme.textColor,
          fontSize: size,
          textDecorationLine,
        }}>
        {name.toFixed(2)}
      </Text>
    </View>
  );

  SingleComponent = (props, widthPic, t, s, btnWidth) =>
    this.props.cardStyle === 101 ? (
      <CardOneHori
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 1 ? (
      <CardOne
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 2 ? (
      <CardTwo
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 3 ? (
      <CardThree
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 4 ? (
      <CardFour
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 5 ? (
      <CardFive
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 6 ? (
      <CardSix
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 7 ? (
      <CardSeven
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 8 ? (
      <CardEight
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 9 ? (
      <CardNine
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 10 ? (
      <CardTenth
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 11 ? (
      <CardElev
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 12 ? (
      <CardTwelve
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 13 ? (
      <CardThirteen
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 14 ? (
      <CardFourteen
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 15 ? (
      <CardFifteen
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 16 ? (
      <CardSixteen
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 17 ? (
      <CardSeventeen
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 18 ? (
      <CardEighteen
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 19 ? (
      <CardNineteen
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 20 ? (
      <CardTwenty
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 21 ? (
      <CardTOne
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : this.props.cardStyleE === 22 ? (
      <CardTtwo
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    ) : (
      <CardOne
        props={props}
        widthPic={widthPic}
        t={this}
        s={s}
        btnWidth={btnWidth}
        cartProductArray={this.props.cartProductArrayViewedProducts}
        recentViewedProducts={this.props.recentViewedProducts}
        wishListProducts={this.props.wishListProducts}
        card_style={this.props.cardStyleE}
        newProductDuration={this.props.newProductDuration}
        cartButton={this.props.cartButton}
        inventory={this.props.inventory}
        language={this.props.language}
        language2={this.props.language2}
      />
    );

  /// ////////////////////
  getPer = (r, s) => {
    const a = r / 100;
    const b = r - s;
    return b / a;
  };

  /// ///////////////////
  imageIcon = (bagBtn, otherBtn, h, w) => {
    return (
      <Image
        source={require('../images/shopping_bag.png')}
        style={{
          height: h,
          width: w,
          marginBottom: 2,
          tintColor:
            this.newMethod3(this.props, this) === 1 ? otherBtn : bagBtn,
        }}></Image>
    );
  };

  getCategoryName() {
    if (this.props.objectArray.categories.length != 0) {
      return this.props.objectArray.categories[0].categories_name;
    }
  }

  /// /////////////////
  pDiscount(props) {
    if (props.dataName !== 'Flash') {
      var rtn = '';
      var p1 = parseInt(props.objectArray.products_price);
      var p2 = parseInt(props.objectArray.discount_price);
      if (p1 == 0 || p2 == null || p2 == undefined || p2 == 0) {
        rtn = '';
      }
      var result = Math.abs(((p1 - p2) / p1) * 100);
      result = parseInt(result.toString());
      if (result == 0) {
        rtn = '';
      }
      rtn = result + '%';
      return rtn;
    } else if (props.dataName === 'Flash') {
      let rtn = '';
      const p1 = parseInt(props.objectArray.products_price);
      const p2 = parseInt(props.objectArray.flash_price);
      if (p1 == 0 || p2 == null || p2 == undefined || p2 == 0) {
        rtn = '';
      }
      let result = Math.abs(((p1 - p2) / p1) * 100);
      result = parseInt(result.toString());
      if (result == 0) {
        rtn = '';
      }
      rtn = result + '%';
      return rtn;
    }
  }

  removeWishlist = async (props, t) => {
    t.setState({
      isLoading: true,
      wishListId: props.objectArray.products_id,
      wishListValue: '0',
    });
    const data = {};
    data.liked_customers_id = SyncStorage.get('customerData').customers_id;
    data.liked_products_id = props.objectArray.products_id;
    const data2 = await postHttp(getUrl() + '/api/' + 'unlikeproduct', data);

    if (data2.success == 1) {
      props.objectArray.isLiked = '0';
      props.objectArray = props.objectArray;
      setTimeout(() => {
        props.removeWishListProduct(props.objectArray);
        this.setState({isLoading: false});
      }, Math.floor(100 / 360000));
    }
    setTimeout(() => {
      props.removeWishListProduct(props.objectArray);
      this.setState({isLoading: false});
    }, Math.floor(100 / 360000));
  };

  addWishlist = async (props, t) => {
    if (SyncStorage.get('customerData') === '') {
      props.navigation.navigate('LOGIN');
    } else {
      t.setState({
        isLoading: true,
        wishListId: props.objectArray.products_id,
        wishListValue: '1',
      });
      const data = {};
      data.liked_customers_id = SyncStorage.get('customerData').customers_id;
      data.liked_products_id = props.objectArray.products_id;
      const data2 = await postHttp(getUrl() + '/api/' + 'likeproduct', data);
      if (data2.success == 1) {
        props.objectArray.isLiked = '1';
        setTimeout(() => {
          props.addWishlistProduct(props.objectArray);
          this.setState({isLoading: false});
        }, Math.floor(100 / 360000));
      }
      if (data2.success == 0) {
        setTimeout(() => {
          this.setState({isLoading: false});
        }, Math.floor(100 / 360000));
      }
      setTimeout(() => {
        this.setState({isLoading: false});
      }, Math.floor(100 / 360000));
    }
  };

  /// ///////////////////////////////////////////////////////////
  removeRecent = (props, t) => {
    t.setState({isLoading: true});
    setTimeout(() => {
      props.removeRecentItems(props.objectArray);
      this.setState({isLoading: false});
    }, Math.floor(100 / 360000));
  };

  /// //////////////////////////////////////////////////////////
  // qunatityPlus = (props, t, inc) => {
  //   this.setState({incdecquantity: inc + 1});
  // };

  // qunatityMinus = (props, t, dec) => {
  //   this.setState({incdecquantity: dec - 1});
  // };

  newMethod6 = (props, t, incdecquantity) => {
    console.log(props, incdecquantity, 'newMethod6');
    t.setState({isLoading: true, counter: t.state.counter + 1});
    if (props.cardStyleE === 22) {
      if (
        props.objectArray.quantity === undefined ||
        props.objectArray.quantity === null
      ) {
        props.cartProductArrayViewedProducts.map((val, key) => {
          if (val.products_id === props.objectArray.id) {
            val.quantity = val.quantity + 1;
            props.objectArray.quantity = val.quantity;
          } else {
            props.objectArray.quantity = 1;
          }
        });
      } else {
        props.cartProductArrayViewedProducts.map((val, key) => {
          console.log(val.quantity, 'quantity');
          if (val.products_id === props.objectArray.id) {
            val.quantity = val.quantity + 1;
            props.objectArray.quantity = val.quantity;
          }
        });
      }
      setTimeout(() => {
        t.setTimePassed(props, props.objectArray.quantity, incdecquantity);
      }, Math.floor(100 / 360000));
    } else {
      setTimeout(() => {
        t.setTimePassed(props, 1, incdecquantity);
      }, Math.floor(100 / 360000));
    }
  };

  /// ////////////////////////////////////////////////////////////
  setTimePassed(props, q, incdecquantity) {
    props.addItemToCart(
      props.objectArray,
      q,
      this.props.cardStyleE,
      incdecquantity,
    );
    this.setState({isLoading: false});
  }

  /// ///////////////////////////////////////////////////////////////
  removeCartitems = (props, t) => {
    if (props.cardStyleE === 22) {
      if (
        props.objectArray.quantity === undefined ||
        props.objectArray.quantity === null
      ) {
        let temp2 = 0;
        props.cartProductArrayViewedProducts.map((val, key) => {
          const temp = [];
          for (
            let i = 0;
            i < props.cartProductArrayViewedProducts.length;
            i++
          ) {
            if (val.products_id === props.objectArray.id || temp2 == 1) {
              temp[i] = props.cartProductArrayViewedProducts[i];
              val.quantity = val.quantity - 1;
              props.objectArray.quantity = val.quantity;
            } else {
              temp2 = 1;
            }
          }
          props.cartProductArrayViewedProducts = temp;
        });
      } else {
        let temp2 = 0;
        const temp = [];
        for (let i = 0; i < props.cartProductArrayViewedProducts.length; i++) {
          if (
            props.cartProductArrayViewedProducts[i].products_id ===
              props.objectArray.id ||
            temp2 == 1
          ) {
            temp[i] = props.cartProductArrayViewedProducts[i];
            props.cartProductArrayViewedProducts[i].quantity =
              props.cartProductArrayViewedProducts[i].quantity - 1;
            props.objectArray.quantity =
              props.cartProductArrayViewedProducts[i].quantity;
          } else {
            temp2 = 1;
          }
        }
        props.cartProductArrayViewedProducts = temp;
        return;
      }
      setTimeout(() => {}, Math.floor(100 / 360000));
    }
  };

  /// ////////////////////////////////////////////////////////////
  newMethod3 = (props, t) => {
    let temp = 0;
    props.cartProductArrayViewedProducts.map((row) => {
      if (row.products_id === props.objectArray.products_id) {
        temp = 1;
      }
    });
    if (temp === 1) {
      return 1;
    }
    temp = 0;
    return 0;
  };

  /// ////////////////////////////////////////////////////////////
  checkWishList = (props) => {
    let temp = 0;
    let temp2 = 0;

    props.wishListProducts.map((row) => {
      if (JSON.stringify(row.id) === JSON.stringify(props.objectArray.id)) {
        temp2 = 1;
      }
    });
    if (props.objectArray.isLiked == '1') {
      temp = 1;
    }

    if (temp === 1 || temp2 === 1) {
      return 1;
    }
    temp = 0;
    temp2 = 0;
    return 0;
  };

  /// /////////////////////////////////////////////////////////////
  componentWillUnmount() {
    clearInterval(this.state.isLoading);
  }

  render() {
    const s = this.props.objectArray.price_html;
    return (
      <View>
        <Spinner visible={this.state.isLoading} />

        {this.props.rows === false
          ? this.SingleComponent(
              this.props,
              this.props.width ? this.props.width : theme.singleRowCardWidth,
              this,
              s,
              this.props.width
                ? this.props.width - 10
                : theme.singleRowCardWidth - 10,
            )
          : this.SingleComponent(
              this.props,
              this.props.width ? this.props.width : theme.singleRowCardWidth,

              this,
              s,
              this.props.width
                ? this.props.width - 10
                : theme.singleRowCardWidth - 10,
            )}
      </View>
    );
  }
}

const getRecentViewedProducts = (state) => state.cartItems.recentViewedProducts;
const getLanguage2 = (state) => state.Config.languageJson2;
const getLanguage = (state) => state.Config.languageJson;
const getCartButton = (state) => state.Config.cartButton;
const getInventory = (state) => state.Config.inventory;
const getNewProductDuration = (state) => state.Config.newProductDuration;
const getCardStyle = (state) => state.Config.card_style;
const getWishListProducts = (state) =>
  JSON.parse(JSON.stringify(state.cartItems.wishListProducts));

const getRecentViewedProductsFun = createSelector(
  [getRecentViewedProducts],
  (getRecentViewedProducts) => {
    return getRecentViewedProducts;
  },
);

const getLanguageFun = createSelector([getLanguage], (getLanguage) => {
  return getLanguage;
});
const getLanguageFun2 = createSelector([getLanguage2], (getLanguage2) => {
  return getLanguage2;
});
const getInventoryProducts = createSelector([getInventory], (getInventory) => {
  return getInventory;
});
const getCartButtonProducts = createSelector(
  [getCartButton],
  (getCartButton) => {
    return getCartButton;
  },
);
const getNewProductDurationFun = createSelector(
  [getNewProductDuration],
  (getNewProductDuration) => {
    return getNewProductDuration;
  },
);
const getCardStyleProducts = createSelector([getCardStyle], (getCardStyle) => {
  return getCardStyle;
});
const getWishListProductsFun = createSelector(
  [getWishListProducts],
  (getWishListProducts) => {
    return getWishListProducts;
  },
);

const mapStateToProps = (state) => {
  return {
    cartProductArrayViewedProducts: state.cartItems.cartProductArray,
    wishListProducts: getWishListProductsFun(state),
    cardStyleE: getCardStyleProducts(state),
    newProductDuration: getNewProductDurationFun(state),
    cartButton: getCartButtonProducts(state),
    inventory: getInventoryProducts(state),
    language: getLanguageFun(state),
    language2: getLanguageFun2(state),
    // cartItems2: state,
    recentViewedProducts: getRecentViewedProductsFun(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  addItemToCart: (product, productQuantity, card, incdecquantity) => {
    dispatch({
      type: 'ADD_TO_CARTS',
      product,
      attributes: [],
      productQuantity,
      card,
      incdecquantity,
    });
  },
  removeCardFromCart: (productObject) => {
    dispatch({
      type: 'REMOVE_CARD_FROM_CART',
      product: productObject,
      variation: null,
      metaData: null,
    });
  },
  removeFlashCard: (productObject) => {
    dispatch({
      type: 'REMOVE_FLASH_CARD',
      product: productObject,
    });
  },
  cartTotalItems: () => {
    dispatch({
      type: 'CART_TOTAL_ITEMS',
    });
  },
  removeItemToCart: (productObject, productQuantity) =>
    dispatch({
      type: 'REMOVE_TO_CARTS_QUANTITY',
      product: productObject,
      cartProductQuantity: productQuantity,
      variation: null,
      metaData: null,
    }),
  removeRecentItems: (productArray) =>
    dispatch({type: 'REMOVE_RECENT', product: productArray}),
  addWishlistProduct: (productArray) =>
    dispatch({type: 'ADD_WISHLIST_PRODUCTS', product: productArray}),
  removeWishListProduct: (productArray) =>
    dispatch({type: 'REMOVE_WISHLIST_PRODUCTS', product: productArray}),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigation(CardTemplate));
