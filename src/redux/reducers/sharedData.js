const initialState = {
  banners: [],
  flashSaleProducts: [],
  tab1: [],
  tab2: [],
  tab3: [],
  vendorData: null,
  products: [],
  deepTemp: false
}

const sharedData = (state = initialState, action) => {
  switch (action.type) {
    case 'REMOVE_FLASH_CARD':
      state.flashSaleProducts = state.flashSaleProducts.filter(
        cartItem => cartItem.products_id !== action.product.products_id
      )
      return {
        ...state
      }
    case 'ADD_BANNERS':
      state.banners = action.payload
      return {
        ...state
      }
    case 'ADD_FLASH_PRODUCTS':
      state.flashSaleProducts = action.payload1
      return {
        ...state
      }
    case 'ADD_TOP_SELLER_PRODUCTS':
      state.tab1 = action.payload10
      return {
        ...state
      }
    case 'ADD_Products':
      state.products = action.payload6
      return {
        ...state
      }
    case 'ADD_SPECIAL_PRODUCTS':
      state.tab2 = action.payload2
      return {
        ...state
      }
    case 'ADD_MOST_LIKED_PRODUCTS':
      state.tab3 = action.payload3
      return {
        ...state
      }
    case 'ADD_VENDORS':
      state.vendorData = action.payload4
      return {
        ...state
      }
    default:
      return state
  }
}

export default sharedData
