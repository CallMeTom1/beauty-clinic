import {AppNode} from "./node.enum";

export enum AppRoutes {
  //account
  SIGNIN=`${AppNode.HOME}/${AppNode.ACCOUNT}/connexion`,
  SIGNUP=`${AppNode.HOME}/${AppNode.ACCOUNT}/inscription`,
  RESET_PASSWORD=`${AppNode.HOME}/${AppNode.ACCOUNT}/reinitialiser-mot-de-passe`,
  FORGOT_PASSWORD=`${AppNode.HOME}/${AppNode.ACCOUNT}/mot-de-passe-oublie`,

  //admin
  DASHBOARD = `${AppNode.ADMIN}/dashboard`,
  MANAGE_PRODUCT = `${AppNode.ADMIN}/gerer-les-produits`,
  MANAGE_CARE = `${AppNode.ADMIN}/gerer-les-soins`,
  MANAGE_APPOINTMENT = `${AppNode.ADMIN}/gerer-les-rendez-vous`,
  MANAGE_ORDER = `${AppNode.ADMIN}/gerer-les-commandes`,
  MANAGE_CLINIC = `${AppNode.ADMIN}/gerer-la-clinique`,
  MANAGE_CUSTOMER = `${AppNode.ADMIN}/gerer-les clients`,

  //cart
  CART_ORDER = `/${AppNode.CART}/${AppNode.ORDER}`,
  CART_ORDER_CONFIRM = `/${AppNode.CART}/${AppNode.ORDER}/confirmation`,
  CART_ORDER_SUMMARY = `/${AppNode.CART}/${AppNode.ORDER}/recapitulatif`,

  //home
  CARES = `soins`,
  PRODUCTS = `produits`,

  APPOINTMENT = `/${AppNode.HOME}/rendez-vous`,

  //profile
  MY_INFO = `/${AppNode.PROFILE}/mes-informations`,
  MY_ADDRESS_BOOK = `/${AppNode.PROFILE}/mes-adresses`,
  MY_WISHLIST = `/${AppNode.PROFILE}/mes-favoris`,
  MY_ORDERS = `/${AppNode.PROFILE}/mes-achats`,
  MY_APPOINTMENTS = `/${AppNode.PROFILE}/mes-rendez-vous`,
  TRACK_MY_ORDERS = `/${AppNode.PROFILE}/suivre-mes-commandes`,
  MY_ACCOUNT = `/${AppNode.PROFILE}`,
}

