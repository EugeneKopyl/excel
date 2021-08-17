import {DomListener} from './DomListener';

export class ExcelComponent extends DomListener {
    constructor($root, options = {}) {
        super($root, options.listeners)
        this.name = options.name || ''
        this.store = options.store
        this.subscribe = options.subscribe || []
        this.emitter = options.emitter
        this.unsubscribers = []

        this.prepare()
    }

    prepare() {}

    toHTML() {
        return ''
    }

    $emit(event, ...args) {
        const unsub = this.emitter.emit(event, ...args)
        this.unsubscribers.push(unsub)
    }

    $on(event, fn) {
        this.emitter.subscribe(event, fn)
    }

    $dispatch(action) {
        this.store.dispatch(action)
    }

    storeChanged() {}

    isWatching(key) {
        return this.subscribe.includes(key)
    }

    init() {
        this.initDomListeners()
    }

    destroy() {
        this.removeDomListeners()
        this.unsubscribers.forEach( (unsub) => unsub())
    }
}
