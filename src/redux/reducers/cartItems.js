import SyncStorage from 'sync-storage'
import { getUrl, postHttp } from '../../common/WooComFetch'
const initialState = {
  wishListProducts: [],
  recentViewedProducts: [],
  tempArr: [],
  cartProductArray: [],
  cartquantity: 0,
  subTotal: [],
  totalSumPrice: 0,
  spinerTemp: false,
  indicatorTemp: false,
  spinnerArray: [],
  removerecentCondition: false,
  onScreen: false,
  couponArray: [],
  allCategories: [],
  categories: [],
  subCategories: [],
  sectionlist: [],
  productDeleteId: 0,
  productErrorMsg: '',
  check: false
}
/// /////////////////////////
removeHtmlEntites = value => {
  const multiple = {
    '&nbsp;': ' ',
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&apos;': "'",
    '&cent;': '¢',
    '&pound;': '£',
    '&yen;': '¥',
    '&euro;': '€',
    '&copy;': '©',
    '&reg;': '®',
    '&#160;': ' ',
    '&#60;': '<',
    '&#62;': '>',
    '&#38;': '&',
    '&#34;': '"',
    '&#39;': "'",
    '&#162;': '¢',
    '&#163;': '£',
    '&#165;': '¥',
    '&#8364;': '€',
    '&#169;': '©',
    '&#174;': '®'
  }
  for (const char in multiple) {
    const before = char
    const after = multiple[char]
    const pattern = new RegExp(before, 'g')
    value = value.replace(pattern, after)
  }
  return value
}
/// ////////////////////////////////////////////////////////////
getAllCategories = async (page, state, formData) => {
  state.allCategories = []
  state.categories = []
  const data = await postHttp(getUrl() + '/api/' + 'allcategories', formData)
  const dat = data.data

  for (const value of dat) {
    value.name = value.categories_name
    value.id = value.categories_id
    state.allCategories.push(value)
    if (value.parent_id === 0) {
      state.categories.push(value)
    } else {
      state.subCategories.push(value)
    }
  }
  if (dat.length === 0) {
  }
  if (state.categories === undefined || state.categories.length === 0) {
  } else {
    let CHILD = []
    state.categories.map(key => {
      for (const value of state.allCategories) {
        if (value.parent_id === key.categories_id) {
          CHILD.push(value)
        }
      }
      state.sectionlist.push({
        data: CHILD,
        parent: key
      })
      CHILD = []
    })
  }
}
/// /////////////////////////////////////////////////////////////////

saveLocalDataIntoArrays = state => {
  state.cartProductArray = [] /// //////////////////////////////////////////////last change
  const val = SyncStorage.getAllKeys().includes('cartProducts')
  if (val != null) {
    const tempArray = SyncStorage.get('cartProducts')
    if (tempArray != null) {
      tempArray.map(row => {
        state.cartProductArray.push(row)
        this.cartTotalItems(state)
        this.productsTotal(state)
      })
    }
  }
}

/// /////////////////////////////////////////////////
removeWishList = (p, state) => {
  state.wishListProducts.forEach((value, index) => {
    if (value.id === p.id) {
      state.wishListProducts.splice(index, 1)
      SyncStorage.set('wishListProducts', state.wishListProducts)
    }
  })
}
addWishList = (p, state) => {
  state.wishListProducts.push(p)
  SyncStorage.set('wishListProducts', state.wishListProducts)
}
/// ////////////////////////////////////////////////

// adding into recent array products
addToRecent = (p, state) => {
  if (state.recentViewedProducts === undefined) {
    state.recentViewedProducts.push(p)
    state.tempArr.push(p.products_id)
    SyncStorage.set('recentViewedProducts', state.tempArr)
  } else {
    let found = false
    for (const value of state.recentViewedProducts) {
      if (value.id === p.id) {
        found = true
      }
    }
    if (found === false) {
      state.recentViewedProducts.push(p)
      state.tempArr.push(p.products_id)
      SyncStorage.set('recentViewedProducts', state.tempArr)
    }
  }
}
// removing from recent array products
removeRecent = (p, state) => {
  state.recentViewedProducts.forEach((value, index) => {
    if (value.id === p.id) {
      state.recentViewedProducts.splice(index, 1)
      SyncStorage.set('recentViewedProducts', state.recentViewedProducts)
    }
  })
}

/// /////////////////////////////////////////////////
convertHtmlTag = htmlprice => {
  let s = htmlprice
  s = s.replace(/<del>/, '<s>')
  s = s.replace(/<\/del>/, '</s>')
  return s
}
// adding into cart array products
/// /////////////
addToCart = (state, product, attArray, t, productQuantity) => {
  let attributesArray = attArray
  if (attArray.length === 0 || attArray == null) {
    attributesArray = []
    if (product.attributes !== undefined) {
      product.attributes.forEach((value, index) => {
        const att = {
          products_options_id: value.option.id,
          products_options: value.option.name,
          products_options_values_id: value.values[0].id,
          options_values_price: value.values[0].price,
          price_prefix: value.values[0].price_prefix,
          products_options_values: value.values[0].value,
          name:
            value.values[0].value +
            ' ' +
            value.values[0].price_prefix +
            value.values[0].price +
            ' ' +
            SyncStorage.get('currency')
        }
        attributesArray.push(att)
      })
    }
  }
  let pprice = product.products_price
  let onSale = false
  if (product.discount_price != null) {
    pprice = product.discount_price
    onSale = true
  }
  if (product.flash_price != null) {
    pprice = product.flash_price
  }
  const finalPrice =
    t.calculateFinalPriceService(attributesArray) + parseFloat(pprice)
  const obj = {
    cart_id: parseInt(product.products_id.toString() + state.cartProductArray.length.toString()),
    products_id: product.products_id,
    manufacture: product.manufacturers_name,
    customers_basket_quantity: 1,
    final_price: finalPrice,
    model: product.products_model,
    categories: product.categories,
    weight: product.products_weight,
    on_sale: onSale,
    unit: product.products_weight_unit,
    image: product.products_image,
    attributes: attributesArray,
    products_name: product.products_name,
    price: pprice,
    subtotal: finalPrice,
    total: finalPrice
  }
  state.cartProductArray.push(obj)
  t.cartTotalItems(state)
  SyncStorage.set('cartProducts', state.cartProductArray)
}

/// ////////////////////////

calculateFinalPriceService = attArray => {
  let total = 0
  attArray.forEach((value, index) => {
    const attPrice = parseFloat(value.options_values_price)
    if (value.price_prefix === '+') {
      total += attPrice
    } else {
      total -= attPrice
    }
  })
  return total
}
/// //////////////////////
alreadyInCart = (state, p, vId, quantity) => {
  let count = 0
  for (const value of state.cartProductArray) {
    if (p.type !== 'variable' && value.product_id === Number(p.id)) {
      count++
      value.quantity = Number(value.quantity) + Number(quantity)
    } else if (
      value.product_id == Number(p.id) &&
      value.variation_id == Number(p.id)
    ) {
      count++
      value.quantity = Number(value.quantity) + Number(quantity)
    }
  }
  this.cartTotalItems(state)
  this.productsTotal(state)
  SyncStorage.set('cartProducts', state.cartProductArray)
  if (count !== 0) return true
  return false
}

/// ////////////////////////
checkCart = (state, p, quantity) => {
  let name = null
  let onlyOneAllowed = true
  let quantityCheck = true
  // check for only one item is allowed
  for (const value of state.cartProductArray) {
    if (value.sold_individually == true && p.id == value.product_id) {
      onlyOneAllowed = false
      name = value.name
    }
  }
  if (onlyOneAllowed === false) console.log("'Only One Item Allowed'")
  if (quantity == null) quantity = 1

  if (p.stock_quantity == null || p.stock_quantity > quantity) {
    quantityCheck = true
  } else if (p.stock_quantity < quantity) {
    quantityCheck = false
  }

  if (onlyOneAllowed && quantityCheck) return true
  return false
}

/// /////////////////////////////
cartTotalItems = state => {
  let total = 0
  for (const value of state.cartProductArray) {
    total += Number(value.customers_basket_quantity)
  }
  state.cartquantity = total
  return total
}
/// ///////////////////////////////
productsTotal = state => {
  let total = 0
  state.cartProductArray.map((val, key) => {
    // subTotal
    state.cartProductArray[key].subTotal = parseFloat(val.quantity * val.price)
    total += parseFloat(state.cartProductArray[key].subTotal)
  })
  state.totalSumPrice = parseFloat(total)
}
/// /////////////////////////////
const cartItems = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_CATEGORIES':
      this.getAllCategories(1, state, action.payload)

      return {
        ...state
      }
    case 'SPLICE':
      state.cartProductArray.splice(action.index, 1)
      return {
        ...state
      }
    /// /////////////////////////////////////////////////
    case 'CART_TOTAL_ITEMS':
      this.cartTotalItems(state)
      return {
        ...state
      }
    /// /////////////////////////////////////////////////
    case 'PRODUCT_TOTAL':
      this.productsTotal(state)
      return {
        ...state
      }
    /// /////////////////////////////////////////////////
    case 'UPDATE_PRODUCTS':
      state.cartProductArray = [action.product]
      return {
        ...state
      }
    /// /////////////////////////////////////////////////
    case 'REMOVE_WISHLIST_PRODUCTS':
      this.removeWishList(action.product, state)
      return {
        ...state
      }
      /// /////////////////////////////////////////////////

    case 'ADD_WISHLIST_PRODUCTS':
      this.addWishList(action.product, state)
      return {
        ...state
      }
    /// /////////////////////////////////////////////////
    case 'REMOVE_RECENT':
      this.removeRecent(action.product, state)
      return {
        ...state
      }
    /// /////////////////////////////////////////////////
    case 'ADD_RECENT':
      this.addToRecent(action.product, state)
      return {
        ...state
      }
    /// /////////////////////////////////////////////////
    case 'SAVE_LOCAL_DATA_INTO_ARRAYS':
      this.saveLocalDataIntoArrays(state)
      return {
        ...state
      }
    /// /////////////////////////////////////////////////
    case 'REMOVE_SPINNER':
      state.spinnerArray.map((val, key) => {
        state.spinnerArray[key] = null
      })
      state.spinnerArray = []
      return {
        ...state
      }
    /// /////////////////////////////////////////////////
    case 'MY_SPINNER':
      state.spinnerArray[action.index1] = action.value
      return {
        ...state
      }
    /// /////////////////////////////////////////////////
    case 'SET_INDICATOR':
      state.indicatorTemp = action.value
      state.onScreen = action.OnScreen
      return {
        ...state
      }
    /// /////////////////////////////////////////////////
    case 'SET_SPINNER':
      state.spinerTemp = action.value
      return {
        ...state
      }
    /// /////////////////////////////////////////////////
    case 'ADD_TO_CARTS':
      this.addToCart(
        state,
        action.product,
        action.attributes,
        this,
        action.productQuantity
      )
      return {
        ...state
      }
      /// /////////////////////////////////////////////////
    case 'CLEAR_RECENT_PRODUCT':
      state.recentViewedProducts = []
      return {
        ...state
      }
      /// /////////////////////////////////////////////////
    case 'OUT_OF_STOCK_PRODUCT':
      state.productDeleteId = action.productDeleteId
      state.productErrorMsg = action.msg
      state.check = action.check
      return {
        ...state
      }
      /// /////////////////////////////////////////////////
    case 'SET_CHECK':
      state.check = false
      return {
        ...state
      }
      /// /////////////////////////////////////////////////
    case 'CLEAR_CART':
      state.cartProductArray = []
      return {
        ...state
      }
    /// /////////////////////////////////////////////////
    case 'ADD_TO_CARTS_QUANTITY':
      state.cartProductArray.map((val, key) => {
        if (val.cart_id === action.product.cart_id) {
          state.cartProductArray[key].quantity++
        }
      })

      this.cartTotalItems(state)
      this.productsTotal(state)
      SyncStorage.set('cartProducts', state.cartProductArray)
      return {
        ...state
      }
    /// /////////////////////////////////////////////////
    case 'REMOVE_TO_CARTS_QUANTITY':
      state.cartProductArray.map((val, key) => {
        if (val.cart_id === action.product.cart_id) {
          state.cartProductArray[key].quantity--
        }
      })

      this.cartTotalItems(state)
      this.productsTotal(state)
      SyncStorage.set('cartProducts', state.cartProductArray)
      return {
        ...state
      }
    /// /////////////////////////////////////////////////
    case 'REMOVE_CARD_FROM_CART':
      state.cartProductArray = state.cartProductArray.filter(
        cartItem => cartItem.cart_id !== action.product.cart_id
      )

      this.cartTotalItems(state)
      this.productsTotal(state)
      SyncStorage.set('cartProducts', state.cartProductArray)
      return {
        ...state
      }
    /// /////////////////////////////////////////////////
  }
  return state
}

export default cartItems
