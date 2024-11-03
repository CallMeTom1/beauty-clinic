export enum ApiURI {
  SECURITY_SIGN_IN='account/signin',
  SECURITY_SIGN_UP='account/signup',
  ME='account/me',
  REFRESH_TOKEN = 'account/refresh',
  SIGN_GOOGLE_URL= 'https://localhost:2023/api/account/google/login',
  UPLOAD_PROFILE_IMAGE= 'users/upload-profile-image',
  USER = 'users',
  VERIFY_EMAIL = 'account/verify-email',
  SIGN_OUT = 'account/signout',

  CARE='cares',
  CARE_PUBLISHED='cares/published',
  CARE_UPLOAD_IMAGE='cares/upload-image',

  ADD_CARE='care',
  BUSINESS_HOURS='business-hours',
  HOLIDAY = 'holiday',
  HOLIDAY_INTERVAL = 'holiday/interval',
  APPOINTMENT = 'appointment',
  APPOINTMENT_CREATE_ADMIN = 'appointment/admin-create-appointment',
  APPOINTMENT_CONFIRM = 'appointment/confirm',
  APPOINTMENT_CANCEL = 'appointment/cancel',
  APPOINTMENT_AVAILABLE_DAYS = 'appointment/available-days',
  APPOINTMENT_AVAILABLE_SLOTS = 'appointment/available-slots',
  APPOINTMENT_UPDATE_NOTE = 'appointment/update-note',

  CHANGE_PASSWORD = 'account/change-password',
  RESET_PASSWORD = 'account/reset-password',
  FORGOT_PASSWORD = 'account/forgot-password',

  //PRODUCTS
  PRODUCTS = 'products',
  PRODUCT_PUBLISH = 'products/publish',
  PRODUCT_UNPUBLISH = 'products/unpublish',
  PRODUCT_PUBLISHED = 'products/published',
  PRODUCT_ADD_CATEGORY = 'products/add-category',
  PRODUCT_UPLOAD_IMAGE = 'products/upload-image',
  UPDATE_PRODUCT_CATEGORIES = 'products/update-categories',


  //PRODUCT CATEGORIES
  PRODUCT_CATEGORIES = 'product-categories',
  PRODUCT_CATEGORIES_PUBLISH = 'product-categories/publish',
  PRODUCT_CATEGORIES_UNPUBLISH = 'product-categories/unpublish',
  PRODUCT_CATEGORIES_PUBLISHED = 'product-categories/published',
  PRODUCT_CATEGORIES_UPLOAD_IMAGE = 'product-categories/upload-category-product-image',
  //CART

  CART = 'cart',
  CART_UPDATE_QUANTITY = 'cart/quantity',
  CART_APPLY_PROMO = 'cart/promo',
  CART_REMOVE_PROMO = 'cart/promo',


  //ORDERS
  ORDERS = 'orders',
  ORDERS_LAST = 'orders/last',
  ORDERS_CREATE='orders/create',
  ORDER_SHIPPING_ADDRESS ='orders/shipping-address',
  ORDER_TRACKING_NUMBER ='orders/tracking-number',

  //PAYMENTS
  PAYMENTS = 'payments',

  //PROMO CODES
  PROMO_CODES = 'promo-codes',
  PROMO_CODES_CREATE = 'promo-codes',
  PROMO_CODES_UPDATE = 'promo-codes',
  PROMO_CODES_DELETE = 'promo-codes',

  //CARE CATEGORIES
  CARE_CATEGORY = 'care-category',
  CARE_CATEGORY_IMAGE = 'care-category/upload-image',

  //CARE CATEGORIES
  CARE_SUB_CATEGORY = 'care-sub-category',
  CARE_SUB_CATEGORY_IMAGE = 'care-sub-category/upload-image',

  //BODY ZONES
  BODY_ZONE = 'body-zone',

  //SHIPPING
  SHIPPING_FEES = 'shipping-fees',
  SHIPPING_FEES_UPDATE = 'shipping-fees',

  //REVIEWS
  REVIEWS = 'reviews',


  //WISHLIST

  WISHLIST = 'wishlist',
  WISHLIST_ADD = 'wishlist/add',
  WISHLIST_REMOVE = 'wishlist/remove',

  //CLINIC
  CLINIC = 'clinic',
  CLINIC_UPLOAD_LOGO = 'clinic/upload-logo',

  //Machine
  MACHINE = 'care-machine'


}
