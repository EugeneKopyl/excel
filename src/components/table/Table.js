import {ExcelComponent} from '@core/ExcelComponent';
import {createTable} from './table.template';
import {resizeHandler} from './table.resize';
import {shouldResize} from './table.functions';

export class Table extends ExcelComponent {
    static className = 'excel__table'

    constructor($root) {
        super($root, {
            listeners: ['mousedown', 'mouseup']
        });
    }

    toHTML() {
        return createTable(20)
    }

    onClick(e) {
        console.log('click')
    }

    onMousedown(e) {
        if (shouldResize(e)) {
            resizeHandler(this.$root, e)
        }
    }

    onMouseup(e) {
        console.log()
    }

    onMousemove(e) {
        console.log('mousemove')
    }
}
