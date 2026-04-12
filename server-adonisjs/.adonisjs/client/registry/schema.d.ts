/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'access_token.store': {
    methods: ["POST"]
    pattern: '/api/auth/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['store']>>>
    }
  }
  'access_token.destroy': {
    methods: ["POST"]
    pattern: '/api/auth/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_token_controller').default['destroy']>>>
    }
  }
  'resources.trashed': {
    methods: ["GET","HEAD"]
    pattern: '/api/:org_slug/:resource/trashed'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { org_slug: ParamValue; resource: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/resources_controller').default['trashed']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/resources_controller').default['trashed']>>>
    }
  }
  'resources.restore': {
    methods: ["POST"]
    pattern: '/api/:org_slug/:resource/:id/restore'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue, ParamValue]
      params: { org_slug: ParamValue; resource: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/resources_controller').default['restore']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/resources_controller').default['restore']>>>
    }
  }
  'resources.force_delete': {
    methods: ["DELETE"]
    pattern: '/api/:org_slug/:resource/:id/force-delete'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue, ParamValue]
      params: { org_slug: ParamValue; resource: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/resources_controller').default['forceDelete']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/resources_controller').default['forceDelete']>>>
    }
  }
  'resources.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/:org_slug/:resource'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { org_slug: ParamValue; resource: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/resources_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/resources_controller').default['index']>>>
    }
  }
  'resources.store': {
    methods: ["POST"]
    pattern: '/api/:org_slug/:resource'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { org_slug: ParamValue; resource: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/resources_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/resources_controller').default['store']>>>
    }
  }
  'resources.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/:org_slug/:resource/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue, ParamValue]
      params: { org_slug: ParamValue; resource: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/resources_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/resources_controller').default['show']>>>
    }
  }
  'resources.update': {
    methods: ["PUT"]
    pattern: '/api/:org_slug/:resource/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue, ParamValue]
      params: { org_slug: ParamValue; resource: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/resources_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/resources_controller').default['update']>>>
    }
  }
  'resources.destroy': {
    methods: ["DELETE"]
    pattern: '/api/:org_slug/:resource/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue, ParamValue]
      params: { org_slug: ParamValue; resource: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/resources_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/resources_controller').default['destroy']>>>
    }
  }
}
