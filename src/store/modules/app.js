import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    hasBack: false,
    hasRefresh: false,
    hasSave: false,
    hasDownload: false
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_BACK: (state, hasBack) => {
      state.hasBack = hasBack
    },
    Set_Refresh: (state, hasRefresh) => {
      state.hasRefresh = hasRefresh
    },
    Set_Save: (state, hasSave) => {
      state.hasSave = hasSave
    },
    SET_DOWNLOAD: (state, hasDownload) => {
      state.hasDownload = hasDownload
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    SetBack({ commit }, hasBack) {
      commit('SET_BACK', hasBack)
    },
    SetRefresh({ commit }, hasRefresh) {
      commit('Set_Refresh', hasRefresh)
    },
    SetSave({ commit }, hasSave) {
      commit('Set_Save', hasSave)
    },
    SetDownload({ commit }, hasDownload) {
      commit('SET_DOWNLOAD', hasDownload)
    }
  }
}

export default app
