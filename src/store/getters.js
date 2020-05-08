const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  hasBack: state => state.app.hasBack,
  hasRefresh: state => state.app.hasRefresh,
  hasSave: state => state.app.hasSave,
  hasDownload: state => state.app.hasDownload,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters
