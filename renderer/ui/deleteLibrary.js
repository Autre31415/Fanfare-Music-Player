module.exports = async () => {
  window.stopPlayback()
  window.resetPlaybackControls()
  window.automaticPlayQueue = []
  window.manualPlayQueue = []
  window.playHistory = []
  window.displayMetadata()
  window.table.clearData()
  delete window.library
  await window.app.triggerRoute({ route: '/addFilesToLibrary' })
}
