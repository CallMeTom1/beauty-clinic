export enum AppNode {
    HOME = '',
    PUBLIC = '',
    REDIRECT_TO_PUBLIC = AppNode.PUBLIC,
    REDIRECT_TO_AUTHENTICATED = AppNode.HOME,
    ACCOUNT= 'account',
    ADMIN= 'admin',
    SIGNIN=`signin`,
    SIGNUP=`signup`,
    PROFILE=`profile`,
    EDIT_PROFILE=`edit-profile`,
    MY_ORDERS=`my-orders`,
    CARE=`care`,
    DIAGNOSTIC=`diagnostique-gratuit`,
    EPIL_LASER=`epilation-laser`,
    CONTACT=`contact`,
    BUSINESS_HOURS= `business-hours`,
    HOLIDAY= `holiday`,
    CATEGORY_PRODUCT=`product-category`,
    PRODUCT=`produits`,
    APPOINTMENT= `appointment`,

    CUSTOMER= `customer`,
    FALL_BACK = '**',

    CART= 'cart',
    ORDER = 'order',
    CONFIRM_ORDER = 'cart/order/confirm-order',

    CLINIC = 'clinic',

    //admin link
    MANAGE_CARE=`admin/care`,
    MANAGE_CARE_CATEGORY=`admin/care-category` ,
    MANAGE_PRODUCT=`admin/produits`,
    MANAGE_ORDER=`admin/order`,

    MANAGE_PRODUCT_CATEGORY=`admin/product-category` ,
    DASHBOARD= `admin`,
    MANAGE_APPOINTMENT= `admin/appointment`,
    MANAGE_CUSTOMER= `admin/customer`,
    MANAGE_CLINIC = `admin/clinic`,
    MANAGE_BUSINESS_HOURS= `admin/business-hours`,
    MANAGE_HOLIDAY= `admin/holiday`,
    MANAGE_CATEGORY_PRODUCT=`admin/category-product`

}
