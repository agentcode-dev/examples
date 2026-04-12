import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'access_token.store': { paramsTuple?: []; params?: {} }
    'access_token.destroy': { paramsTuple?: []; params?: {} }
    'resources.trashed': { paramsTuple: [ParamValue,ParamValue]; params: {'org_slug': ParamValue,'resource': ParamValue} }
    'resources.restore': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'org_slug': ParamValue,'resource': ParamValue,'id': ParamValue} }
    'resources.force_delete': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'org_slug': ParamValue,'resource': ParamValue,'id': ParamValue} }
    'resources.index': { paramsTuple: [ParamValue,ParamValue]; params: {'org_slug': ParamValue,'resource': ParamValue} }
    'resources.store': { paramsTuple: [ParamValue,ParamValue]; params: {'org_slug': ParamValue,'resource': ParamValue} }
    'resources.show': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'org_slug': ParamValue,'resource': ParamValue,'id': ParamValue} }
    'resources.update': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'org_slug': ParamValue,'resource': ParamValue,'id': ParamValue} }
    'resources.destroy': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'org_slug': ParamValue,'resource': ParamValue,'id': ParamValue} }
  }
  GET: {
    'resources.trashed': { paramsTuple: [ParamValue,ParamValue]; params: {'org_slug': ParamValue,'resource': ParamValue} }
    'resources.index': { paramsTuple: [ParamValue,ParamValue]; params: {'org_slug': ParamValue,'resource': ParamValue} }
    'resources.show': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'org_slug': ParamValue,'resource': ParamValue,'id': ParamValue} }
  }
  HEAD: {
    'resources.trashed': { paramsTuple: [ParamValue,ParamValue]; params: {'org_slug': ParamValue,'resource': ParamValue} }
    'resources.index': { paramsTuple: [ParamValue,ParamValue]; params: {'org_slug': ParamValue,'resource': ParamValue} }
    'resources.show': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'org_slug': ParamValue,'resource': ParamValue,'id': ParamValue} }
  }
  POST: {
    'access_token.store': { paramsTuple?: []; params?: {} }
    'access_token.destroy': { paramsTuple?: []; params?: {} }
    'resources.restore': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'org_slug': ParamValue,'resource': ParamValue,'id': ParamValue} }
    'resources.store': { paramsTuple: [ParamValue,ParamValue]; params: {'org_slug': ParamValue,'resource': ParamValue} }
  }
  DELETE: {
    'resources.force_delete': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'org_slug': ParamValue,'resource': ParamValue,'id': ParamValue} }
    'resources.destroy': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'org_slug': ParamValue,'resource': ParamValue,'id': ParamValue} }
  }
  PUT: {
    'resources.update': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'org_slug': ParamValue,'resource': ParamValue,'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}