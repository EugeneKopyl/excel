import {DomListener} from './DomListener';

export class ExcelComponent extends DomListener {
    constructor($root, options = {}) {
        super($root, options.listeners)
        this.name = options.name || ''
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

    init() {
        this.initDomListeners()
    }

    destroy() {
        this.removeDomListeners()
        this.unsubscribers.forEach( (unsub) => unsub())
    }
}
