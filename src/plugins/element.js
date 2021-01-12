import Vue from 'vue'
import { Button } from 'element-ui'
import {Form, FormItem, Input} from 'element-ui'
import { Message, header, container, aside, main,Menu,Submenu,MenuItemGroup,MenuItem,Breadcrumb,BreadcrumbItem, Card} from 'element-ui'
import {Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox} from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input).use(header).use(container).use(aside).use(main).use(Menu).use(Submenu).use(MenuItemGroup).use(MenuItem).use(Breadcrumb).use(BreadcrumbItem).use(Card)
Vue.use(Row).use(Col).use(Table).use(TableColumn).use(Switch).use(Tooltip).use(Pagination).use(Dialog)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm