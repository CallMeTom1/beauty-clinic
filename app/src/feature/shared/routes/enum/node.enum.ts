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

    APPOINTMENT= `appointment`,
    CUSTOMER= `customer`,
    FALL_BACK = '**',

    //admin link
    MANAGE_CARE=`admin/care`,
    DASHBOARD= `admin`,
    MANAGE_APPOINTMENT= `admin/appointment`,
    MANAGE_CUSTOMER= `admin/customer`,

}
