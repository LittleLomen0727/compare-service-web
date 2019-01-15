import * as types from './types/mutation-types'

export default {
  [types.UPDATE_PAGE_LOADING] (state, status) {
    state.pageLoading = status
  },
  [types.UPDATE_SHOW_COMPARING] (state, status) {
    state.showComparing = status
  }
}
