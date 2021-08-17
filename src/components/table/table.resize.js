import {$} from '../../core/dom';

export function resizeHandler($root, e) {
    return new Promise(res => {
        const $resizer = $(e.target)
        const $parent = $resizer.closest('[data-type="resizable"]')
        const coords = $parent.getCoords()
        const type = $resizer.data.resize
        const sideProp = type === 'col' ? 'bottom' : 'right'
        let value

        $resizer.css({
            opacity: 1,
            [sideProp]: '-5000px'
        })

        document.onmousemove = (e) => {
            if (type === 'row') {
                const delta = e.pageY - coords.bottom
                value = coords.height + delta
                $resizer.css({bottom: -delta + 'px'})
            } else if (type === 'col') {
                const delta = e.pageX - coords.right
                value = coords.width + delta
                $resizer.css({right: -delta + 'px'})
            }
        }

        document.onmouseup = () => {
            document.onmousemove = null
            document.onmousedown = null
            if (type === 'row') {
                $parent.css({height: value + 'px'})
            } else if (type === 'col') {
                $parent.css({width: value + 'px'})
                $root.findAll(`[data-col="${$parent.data.col}"]`)
                    .forEach((el) => {
                        el.style.width = value + 'px'
                    })
            }

            res({
                value,
                type,
                id: $parent.data[type]
            })

            $resizer.css({
                opacity: 0,
                bottom: 0,
                right: 0,
            })
        }
    })
}
