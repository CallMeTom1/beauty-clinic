export enum AppNode {
    HOME = '',
    PUBLIC = '',
    REDIRECT_TO_PUBLIC = AppNode.PUBLIC,
    REDIRECT_TO_AUTHENTICATED = AppNode.HOME,
    CART = 'mon-panier',
    CART_ORDER = 'ma-commande',
    PROFILE = 'mon-profil',


    APPOINTMENT ='rendez-vous',

    //account
    ACCOUNT= 'mon-compte',
    ADMIN= 'administrateur',
    SIGNIN=`connexion`,
    SIGNUP=`inscription`,
    RESET_PASSWORD=`reinitialiser-mot-de-passe`,
    FORGOT_PASSWORD=`mot-de-passe-oublie`,

    //profile
    INFO = `mes-informations`,
    ADDRESS_BOOK = `mes-adresses`,
    WISHLIST = `mes-favoris`,
    ORDER = `mes-achats`,
    MY_APPOINTMENT = `mes-rendez-vous`,
    TRACK_ORDERS = `suivre-mes-commandes`,
    MY_ACCOUNT = `mon-compte`,


    MY_ORDERS=`my-orders`,
    CARE=`care`,
    DIAGNOSTIC=`diagnostique-gratuit`,
    EPIL_LASER=`epilation-laser`,
    CONTACT=`contact`,
    BUSINESS_HOURS= `business-hours`,
    HOLIDAY= `holiday`,
    CATEGORY_PRODUCT=`product-category`,
    PRODUCT=`produits`,

    CUSTOMER= `customer`,
    FALL_BACK = '**',
    CONFIRM_ORDER = 'cart/order/confirm-order',


    //admin link
    MANAGE_CARE=`gerer-les-soins`,
    MANAGE_PRODUCT=`gerer-les-produits`,
    MANAGE_ORDER=`gerer-les-commandes`,
    DASHBOARD= `dashboard`,
    MANAGE_APPOINTMENT= `gerer-les-rendez-vous`,
    MANAGE_CUSTOMER= `gerer-les clients`,
    MANAGE_CLINIC = `gerer-la-clinique`,

}
