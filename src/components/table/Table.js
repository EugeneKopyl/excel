import {ExcelComponent} from '@core/ExcelComponent';
import {$} from '@core/dom';
import {createTable} from './table.template';
import {resizeHandler} from './table.resize';
import {isCell, matrix, nextSelector, shouldResize} from './table.functions';
import {TableSelection} from './TableSelection';

export class Table extends ExcelComponent {
    static className = 'excel__table'

    constructor($root, options) {
        super($root, {
            name: 'Table',
            listeners: ['mousedown', 'keydown', 'input'],
            ...options
        });
    }

    prepare() {
        this.selection = new TableSelection()
    }

    init() {
        super.init()

        this.selectCell(this.$root.find('[data-id="0:0"]'))

        this.$on('formula:input', (text) => {
            this.selection.current.text(text)
        })

        this.$on('formula:done', () => {
            this.selection.current.focus()
        })
    }

    selectCell($cell) {
        this.selection.select($cell)
        this.$emit('table:select', $cell)
    }

    toHTML() {
        return createTable(20)
    }

    onMousedown(e) {
        if (shouldResize(e)) {
            resizeHandler(this.$root, e)
        } else if (isCell(e)) {
            const $target = $(e.target)
            if (e.shiftKey) {
                const $cells = matrix( $target, this.selection.current)
                    .map((id) => this.$root.find(`[data-id="${id}"]`))
                this.selection.selectGroup($cells)
            } else {
                this.selection.select($target)
            }
        }
    }

    onKeydown(event) {
        const keys = ['Enter', 'Tab', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown']
        const {key} = event

        if (keys.includes(key) && !event.shiftKey) {
            event.preventDefault()
        }
        const id = this.selection.current.id(true)
        this.selectCell(this.$root.find(nextSelector(key, id)))
    }

    onInput(event) {
        this.$emit('table:input', $(event.target))
    }
}
