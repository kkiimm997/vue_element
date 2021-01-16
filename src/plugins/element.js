import Vue from 'vue'
import { Button } from 'element-ui'
import {Form, FormItem, Input} from 'element-ui'
import { Message, header, container, aside, main,Menu,Submenu,MenuItemGroup,MenuItem,Breadcrumb,BreadcrumbItem, Card} from 'element-ui'
import {Row,
  Col, 
  Table, 
  TableColumn, 
  Switch, 
  Tooltip, 
  Pagination,
  Dialog, 
  MessageBox, 
  Tag, 
  Tree, 
  Select, 
  Option, 
  Cascader, 
  Alert, 
  Tabs,
  TabPane,
  Steps,
  Step,
  CheckboxGroup,
  Checkbox,
  Upload,
  Image,Timeline, TimelineItem} from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input).use(header).use(container).use(aside).use(main).use(Menu).use(Submenu).use(MenuItemGroup).use(MenuItem).use(Breadcrumb).use(BreadcrumbItem).use(Card)
Vue.use(Row).use(Col).use(Table).use(TableColumn).use(Switch).use(Tooltip).use(Pagination).use(Dialog).use(Tag).use(Select).use(Option)
Vue.use(Tree).use(Cascader).use(Alert).use(Tabs).use(TabPane).use(Steps).use(Step).use(Checkbox).use(CheckboxGroup).use(Upload).use(Image).use(Timeline).use(TimelineItem)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm