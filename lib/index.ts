import monitorPerformance from './performance'
import monitorError from './error'
import monitorAjax from './ajax'
import monitorResource from './resource'

declare global {
  interface Window {
    __monitor__: any
  }
}

function Monitor(config: any) {
  this.config = config
}

Monitor.prototype.use = function(plugin: any) {
  const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
  if (installedPlugins.indexOf(plugin) > -1) {
    return this
  }

  if (typeof plugin.install === 'function') {
    plugin.install.call(null, this.config, this)
  } else if (typeof plugin === 'function') {
    plugin.call(null, this.config, this)
  } else {
    console.warn('plugin should be a function or an object with install method')
  }

  installedPlugins.push(plugin)
  return this
}

export default Monitor
window.__monitor__ = function(config: any) {
  return new Monitor(config)
    .use(monitorPerformance)
    .use(monitorError)
    .use(monitorAjax)
    .use(monitorResource)
}
