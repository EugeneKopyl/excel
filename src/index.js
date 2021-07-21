import './scss/index.scss'
import {Excel} from './components/excel/Excel';
import {Table} from './components/table/Table';
import {Header} from './components/header/Header';
import {Toolbar} from './components/toolbar/Toolbar';
import {Formula} from './components/formula/Formula';

const excel = new Excel('#app', {
    components: [Header, Toolbar, Formula, Table]
})

excel.render()
