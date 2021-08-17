import {ExcelComponent} from '@core/ExcelComponent';
import {$} from '@core/dom';
import {createTable} from './table.template';
import {resizeHandler} from './table.resize';
import {isCell, matrix, nextSelector, shouldResize} from './table.functions';
import {TableSelection} from './TableSelection';
import * as actions from '@/redux/actions'
import {defaultStyles} from '../../constants';
import {parse} from '@core/parse'

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

        this.$on('formula:input', value => {
            this.selection.current.attr('data-value', value).text(parse(value))
            this.updateTextInStore(value)
        })

        this.$on('formula:done', () => {
            this.selection.current.focus()
        })

        this.$on('toolbar:applyStyle', value => {
            this.selection.applyStyle(value)
            this.$dispatch(actions.applyStyle({
                value,
                ids: this.selection.selectedIds
            }))
        })
    }

    selectCell($cell) {
        this.selection.select($cell)
        this.$emit('table:select', $cell)
        const styles = $cell.getStyles(Object.keys(defaultStyles))
        this.$dispatch(actions.changeStyles(styles))
    }

    async resizeTable(e) {
        try {
            const data = await resizeHandler(this.$root, e)
            this.$dispatch(actions.tableResize(data))
        } catch (err) {
            console.warn('resize error', err.message)
        }
    }

    toHTML() {
        return createTable(20, this.store.getState())
    }

    onMousedown(e) {
        if (shouldResize(e)) {
            this.resizeTable(e)
        } else if (isCell(e)) {
            const $target = $(e.target)
            if (e.shiftKey) {
                const $cells = matrix( $target, this.selection.current)
                    .map((id) => this.$root.find(`[data-id="${id}"]`))
                this.selection.selectGroup($cells)
            } else {
                this.selectCell($target)
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

    updateTextInStore(value) {
        this.$dispatch(actions.changeText({
            id: this.selection.current.id(),
            value
        }))
    }

    onInput(event) {
        this.updateTextInStore($(event.target).text())
    }
}
