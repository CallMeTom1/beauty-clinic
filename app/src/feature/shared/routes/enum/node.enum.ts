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
    CARE=`care`,
    DIAGNOSTIC=`diagnostique-gratuit`,
    EPIL_LASER=`epilation-laser`,
    CONTACT=`contact`,
    BUSINESS_HOURS= `business-hours`,
    HOLIDAY= `holiday`,
    CATEGORY_PRODUCT=`product-category`,
    PRODUCT=`product`,
    APPOINTMENT= `appointment`,

    CUSTOMER= `customer`,
    FALL_BACK = '**',

    //admin link
    MANAGE_CARE=`admin/care`,
    DASHBOARD= `admin`,
    MANAGE_APPOINTMENT= `admin/appointment`,
    MANAGE_CUSTOMER= `admin/customer`,
    MANAGE_BUSINESS_HOURS= `admin/business-hours`,
    MANAGE_HOLIDAY= `admin/holiday`,
    MANAGE_CATEGORY_PRODUCT=`admin/category-product`

}
