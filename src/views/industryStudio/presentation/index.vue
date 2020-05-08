<template>
  <PageHeaderLayout :has_back="true">
    <el-row id="contens">
      <el-col v-loading="listLoading" :span="4" class="autoheight" style="width: 190px;border-top: 8px solid #e5e5e5;">
        <div id="sdf" class="biao-title">
          数据表
        </div>
        <div class="searchs">
          <el-input v-model="searchKey" size="mini" style="width:70%" suffix-icon="el-icon-search" placeholder="搜索数据表"/>
          <el-tooltip effect="dark" content="表排序" placement="top">
            <el-dropdown trigger="click" @command="sortClick">
              <el-button class="updateico" title="图表" style="font-size: 18px;position: relative;top: 3px;" size="mini" type="primary">
                <svg-icon icon-class="paixu" class="icofon sethover" style="margin-right: 10px;color: #526276"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  按首字母A-Z
                </el-dropdown-item>
                <el-dropdown-item>
                  按首字母Z-A
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-tooltip>
          <el-tooltip effect="dark" content="选择数据库表" placement="top">
            <el-button type="success" size="small" class="updateico" style="font-size: 18px;position: relative;top: 3px;margin-left: -5px;" @click="openTab()">
              <svg-icon icon-class="addsjy" class="icofon sethover" style="color: #526276;margin-right: 0px"/>
            </el-button>
          </el-tooltip>
        </div>
        <div style="height: calc(100vh - 198px);overflow: auto">
          <div class="tabs">
            <div v-for="(item, index) of list" v-if="item.tableName.indexOf(searchKey) > -1" :key="item.id" :class="tabsInfo === item.tableName ? 'isacts' : ''" class="tablist">
              <div style="float: left" @click="getTablistkey(item)"><svg-icon icon-class="tablexx" class="icofon"/></div>
              <el-tooltip :content="item.tableName" effect="dark" placement="top">
                <div class="fontst" @click="getTablistkey(item)">{{ item.tableName }}</div>
              </el-tooltip>
              <el-button type="danger" class="btnnone" icon="el-icon-close" size="mini" @click="removeTablistkey(index)"/>
            </div>
          </div>
          <div ref="tool" style="background-color: #66a6e0;">
            <el-menu v-if="menuList.length !== 0" :default-openeds="defaultOpenedsx" mode="vertical" background-color="#FFF" active-text-color="#009494" class="itemset">
              <el-submenu v-for="(menu, index) in menuList" :index="menu.id" :key="menu.id" :class="(index === 1 && menuList[0].children.length > 0) ? 'patop' : ''" class="setback menuleft">
                <!--一级菜单名称、不可拖拽 -->
                <template slot="title">
                  <span>{{ menu.name }}</span>
                </template>
                <!--一级菜单子菜单、可拖拽菜单-->
                <el-menu-item-group v-if="menu.children.length > 0" style="overflow:auto">
                  <draggable
                    v-model="menu.children"
                    :options="dragOptions1"
                    :move="onMove"
                    class="list-group list-groupx"
                    element="div"
                    @start="isDragging = true"
                    @end="rightEnd">
                    <el-menu-item
                      v-for="son in menu.children"
                      :key="son.id"
                      :index="son.id"
                      :type="son.type"
                      style="height: 26px !important;line-height: 26px !important;padding-left: 20px;min-width: 180px;padding-right: 0px"
                    >
                      <div style="margin-right:5px;float:left">
                        <svg-icon v-if="son.columnType.indexOf('varchar') > -1 || son.columnType.indexOf('text') > -1" :style="{ color: son.type === 'weidu' ? '#009494' : '#E6A23C' }" icon-class="zifux" class="icofon" style="font-size: 16px;margin-right: 5px"/>
                        <svg-icon v-if="son.columnType.indexOf('date') > -1 || son.columnType.indexOf('time') > -1" :style="{ color: son.type === 'weidu' ? '#009494' : '#E6A23C' }" icon-class="riqixing" class="icofon" style="font-size: 16px;margin-right: 5px"/>
                        <svg-icon v-if="son.columnType.indexOf('double') > -1 || son.columnType.indexOf('float') > -1" :style="{ color: son.type === 'weidu' ? '#009494' : '#E6A23C' }" icon-class="xiaoshux" class="icofon" style="font-size: 16px;margin-right: 5px"/>
                        <svg-icon v-if="son.columnType.indexOf('int') > -1" :style="{ color: son.type === 'weidu' ? '#009494' : '#E6A23C' }" icon-class="zhengshux" class="icofon" style="font-size: 16px;margin-right: 5px"/>
                      </div>
                      <el-tooltip :content="son.name" effect="dark" placement="right">
                        <div class="sonname">{{ son.name }}</div>
                      </el-tooltip>
                    </el-menu-item>
                  </draggable>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </div>
        </div>
      </el-col>
      <el-col v-loading="listLoading" :span="4" class="autoheight" style="width: 215px;border-top: 8px solid #e5e5e5;">
        <div class="biao-title">
          <span v-if="isTabelActive > -1">图表设置</span>
          <span v-if="isTabelActive < 0">报告设置</span>
        </div>
        <div v-if="isTabelActive < 0" class="centbg">
          <div class="bg-cont">
            页面背景：
          </div>
          <el-color-picker v-model="substrateFindOptions[isActive].background" class="bg-set" show-alpha @change="pageinfo()"/>
        </div>
        <div v-if="isTabelActive < 0" class="centbg">
          <div class="bg-cont">
            辅助线：
          </div>
          <el-checkbox v-model="substrateFindOptions[isActive].isAuxiliary" class="bg-set" style="margin-top: -15px;margin-right: 15px;" @change="setfuzhu()"/>
        </div>
        <el-menu v-if="isTabelActive > -1" :default-openeds="defaultOpenedsx" background-color="#FFF" active-text-color="#009494" class="itemset stsin" style="height: calc(100vh - 147px);overflow: auto;">
          <div v-if="substrateFindOptions[isActive].layout[isTabelActive].type === 'bar' || substrateFindOptions[isActive].layout[isTabelActive].type === 'tiao' || substrateFindOptions[isActive].layout[isTabelActive].type === 'duidie'">
            <el-submenu v-for="menu in barList" :index="menu.id" :key="menu.id" class="setback">
              <!--一级菜单名称、不可拖拽 -->
              <template slot="title">
                <span>{{ menu.name }}</span>
              </template>
              <!--一级菜单子菜单、可拖拽菜单-->
              <el-menu-item-group style="overflow:auto">
                <div v-if="menu.name === '数据' && substrateFindOptions[isActive].layout[isTabelActive].type === 'bar'" class="infotab" style="margin-top: -15px">
                  <div style="padding-left: 10px;">X轴</div>
                  <div class="divcont">
                    <span v-if="menu.childrenx.length === 0">请拖入维度</span>
                    <draggable
                      v-model="menu.childrenx"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groups"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getlogbarwd"
                    >
                      <div v-for="(items, index) in menu.childrenx" :key="index">
                        <span v-if="index === 0">{{ items.name }}</span>
                        <el-select v-if="items.columnType.indexOf('time') > -1 || items.columnType.indexOf('date') > -1" v-model="items.key" placeholder="日期" size="mini" class="setsele selectst" style="float:right" @change="updateDL(index)">
                          <el-option
                            v-for="item in dataWDList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                      </div>
                    </draggable>
                  </div>
                </div>
                <div v-if="menu.name === '数据' && substrateFindOptions[isActive].layout[isTabelActive].type === 'bar'" class="infotab">
                  <div style="padding-left: 10px;">Y轴</div>
                  <div class="divcontdl">
                    <draggable
                      v-model="menu.childreny"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groupsdl"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getlogbardl"
                    >
                      <span v-if="menu.childreny.length === 0">请拖入度量</span>
                      <div v-for="(items, index) in menu.childreny" :key="index" class="dlitem">
                        <div :title="items.name" class="divlc">{{ items.name }}</div>
                        <el-select v-model="items.key" placeholder="函数" size="mini" class="setsele selectst" @change="updateDL(index)">
                          <el-option
                            v-for="item in aggregateFunList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-button type="danger" size="mini" class="updateico delst" style="padding-top: 3px;" icon="el-icon-close" @click="deleteItems(index)"/>
                      </div>
                    </draggable>
                  </div>
                </div>
                <div v-if="menu.name === '数据' && substrateFindOptions[isActive].layout[isTabelActive].type === 'duidie'" class="infotab" style="margin-top: -15px">
                  <div style="padding-left: 10px;">X轴</div>
                  <div class="divcont">
                    <span v-if="menu.childrenx.length === 0">请拖入维度</span>
                    <draggable
                      v-model="menu.childrenx"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groups"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getlogbarwd"
                    >
                      <div v-for="(items, index) in menu.childrenx" :key="index">
                        <span v-if="index === 0">{{ items.name }}</span>
                        <el-select v-if="items.columnType.indexOf('time') > -1 || items.columnType.indexOf('date') > -1" v-model="items.key" placeholder="日期" size="mini" class="setsele selectst" style="float:right" @change="updateDL(index)">
                          <el-option
                            v-for="item in dataWDList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                      </div>
                    </draggable>
                  </div>
                </div>
                <div v-if="menu.name === '数据' && substrateFindOptions[isActive].layout[isTabelActive].type === 'duidie'" class="infotab">
                  <div style="padding-left: 10px;">Y轴</div>
                  <div class="divcontdl">
                    <draggable
                      v-model="menu.childreny"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groupsdl"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getlogbardl"
                    >
                      <span v-if="menu.childreny.length === 0">请拖入度量</span>
                      <div v-for="(items, index) in menu.childreny" :key="index" class="dlitem">
                        <div :title="items.name" class="divlc">{{ items.name }}</div>
                        <el-select v-model="items.key" placeholder="函数" size="mini" class="setsele selectst" @change="updateDL(index)">
                          <el-option
                            v-for="item in aggregateFunList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-button type="danger" size="mini" class="updateico delst" style="padding-top: 3px;" icon="el-icon-close" @click="deleteItems(index)"/>
                      </div>
                    </draggable>
                  </div>
                </div>
                <div v-if="menu.name === '数据' && substrateFindOptions[isActive].layout[isTabelActive].type === 'tiao'" class="infotab" style="margin-top: -15px">
                  <div style="padding-left: 10px;">X轴</div>
                  <div class="divcontdl">
                    <draggable
                      v-model="menu.childreny"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groupsdl"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getlogbardl"
                    >
                      <span v-if="menu.childreny.length === 0">请拖入度量</span>
                      <div v-for="(items, index) in menu.childreny" :key="index" class="dlitem">
                        <div :title="items.name" class="divlc">{{ items.name }}</div>
                        <el-select v-model="items.key" placeholder="函数" size="mini" class="setsele selectst" @change="updateDL(index)">
                          <el-option
                            v-for="item in aggregateFunList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-button type="danger" size="mini" class="updateico delst" style="padding-top: 3px;" icon="el-icon-close" @click="deleteItems(index)"/>
                      </div>
                    </draggable>
                  </div>
                </div>
                <div v-if="menu.name === '数据' && substrateFindOptions[isActive].layout[isTabelActive].type === 'tiao'" class="infotab">
                  <div style="padding-left: 10px;">Y轴</div>
                  <div class="divcont">
                    <span v-if="menu.childrenx.length === 0">请拖入维度</span>
                    <draggable
                      v-model="menu.childrenx"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groups"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getlogbarwd"
                    >
                      <div v-for="(items, index) in menu.childrenx" :key="index">
                        <span v-if="index === 0">{{ items.name }}</span>
                        <el-select v-if="items.columnType.indexOf('time') > -1 || items.columnType.indexOf('date') > -1" v-model="items.key" placeholder="日期" size="mini" class="setsele selectst" style="float:right" @change="updateDL(index)">
                          <el-option
                            v-for="item in dataWDList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                      </div>
                    </draggable>
                  </div>
                </div>
                <div v-if="menu.name === '过滤'" class="infotab" style="margin-top: -15px">
                  <div style="padding-left: 10px;">过滤条件</div>
                  <div class="divcontdl">
                    <draggable
                      v-model="menu.children"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groupsdl"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getConditions"
                    >
                      <span v-if="menu.children.length === 0">请拖入过滤条件</span>
                      <div v-for="(items, index) in menu.children" :key="index" class="dlitem">
                        <div :title="items.name" class="divlc" style="width: 58px">{{ items.name }}</div>
                        <el-select v-if="items.type === 'duliang'" v-model="items.conditions" placeholder="条件" size="mini" class="setsele selectst" style="width: 44px;" @change="updateGL()">
                          <el-option
                            v-for="item in condLists"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-select v-if="items.type === 'weidu'" v-model="items.conditions" placeholder="条件" size="mini" class="setsele selectst" style="width: 44px;" @change="updateGL()">
                          <el-option
                            v-for="item in condList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-select v-if="items.type === 'weidu' && items.wedulist !== undefined" v-model="items.value" placeholder="值" size="mini" class="setsele selectst" style="width: 40px;" @change="updateGL()">
                          <el-option
                            v-for="item in items.wedulist"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-input v-if="items.type === 'duliang'" v-model="items.value" type="text" class="setseles selectst" style="margin-left: 3px;width: 40px;" placeholder="值" @keyup.native="updateGL()"/>
                        <el-button type="danger" size="mini" class="updateico delst" style="padding-top: 3px;" icon="el-icon-close" @click="deleteTJ(index)"/>
                      </div>
                    </draggable>
                  </div>
                  <div>
                    <div class="bg-cont">
                      预览时是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].isSearch" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                </div>
                <div v-if="menu.name === '联动'" class="infotab" style="margin-top: -25px">
                  <div style="margin-top:10px">
                    <div style="text-align: center">
                      <el-select v-model="substrateFindOptions[isActive].layout[isTabelActive].ldList" placeholder="选择联动" size="mini" class="ldsty" style="width: 188px;" filterable multiple collapse-tags @change="setfuzhu()">
                        <el-option
                          v-for="item in ldList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"/>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '限制条数'" class="infotab" style="margin-top: -25px">
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      限制条数
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="pageSize" type="number" style="width: 100px" size="mini" @keyup.native="isshowpage()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '标题'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].title.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      文本
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="substrateFindOptions[isActive].layout[isTabelActive].title.text" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].title.show" type="text" style="width: 135px" size="mini" @keyup.native="setfuzhu()"/>
                    </div>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      位置
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'left' ? 'iscat' : ''" class="btngroup" title="居左" style="font-size: 14px" size="mini" type="primary" @click="settitlect('left')">
                          <svg-icon icon-class="fb_jz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'center' ? 'iscat' : ''" title="居中" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('center')">
                          <svg-icon icon-class="fb_spjz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'right' ? 'iscat' : ''" title="居右" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('right')">
                          <svg-icon icon-class="fb_jy" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div style="margin-top: 10px;margin-bottom: -10px;">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      字体
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="substrateFindOptions[isActive].layout[isTabelActive].title.textStyle.fontSize" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].title.show" type="text" style="width: 50px;position: relative;top: -8px;" size="mini"/>
                      <el-color-picker v-model="substrateFindOptions[isActive].layout[isTabelActive].title.textStyle.color" class="bg-sets" style="margin-top: 0px;"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '图形'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      滚动条：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.dataZoom[0].show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 10px;margin-right: 10px;">
                      起始位置
                    </div>
                    <div style="width: 100px;margin-left: 85px;text-align: right;">
                      <el-slider v-model="substrateFindOptions[isActive].layout[isTabelActive].options.dataZoom[0].start" @change="setfuzhu()"/>
                    </div>
                  </div>
                  <div>
                    <div class="bg-cont" style="float: left;margin-top: 10px;margin-right: 10px;">
                      结束位置
                    </div>
                    <div style="width: 100px;margin-left: 80px;text-align: right;">
                      <el-slider v-model="substrateFindOptions[isActive].layout[isTabelActive].options.dataZoom[0].end" :disabled="substrateFindOptions[isActive].layout[isTabelActive].options.dataZoom[0].start >= substrateFindOptions[isActive].layout[isTabelActive].options.dataZoom[0].end" @change="setfuzhu()"/>
                    </div>
                  </div>
                <!-- <div v-for="(items, index) in substrateFindOptions[isActive].layout[isTabelActive].options.series" :key="index" style="margin-top: 10px;">
                  <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                    柱状图颜色
                  </div>
                  <el-color-picker v-model="items.itemStyle.color" class="bg-sets" style="margin-top: 0px;"/>
                </div>
                <div v-for="(items, index) in substrateFindOptions[isActive].layout[isTabelActive].options.series" :key="index" style="margin-top: 10px;">
                  <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                    柱状图最大宽度
                  </div>
                  <el-input v-model="items.barMaxWidth" type="text" style="width: 50px;position: relative;" size="mini"/>
                </div> -->
                </div>
                <div v-if="menu.name === '图例'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.legend.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      排列
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.top === 'top' ? 'iscat' : ''" title="顶部" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelgs('top')">
                          <svg-icon icon-class="fb_dingb" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.top === 'bottom' ? 'iscat' : ''" title="底部" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelgs('bottom')">
                          <svg-icon icon-class="fb_dib" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      位置
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.left === 'left' ? 'iscat' : ''" title="居左" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelg('left')">
                          <svg-icon icon-class="fb_jz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.left === 'center' ? 'iscat' : ''" title="居中" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelg('center')">
                          <svg-icon icon-class="fb_spjz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.left === 'right' ? 'iscat' : ''" title="居右" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelg('right')">
                          <svg-icon icon-class="fb_jy" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div v-for="(items, index) in substrateFindOptions[isActive].layout[isTabelActive].options.series" :key="index" style="margin-top: 10px;margin-bottom: -10px;">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      名称
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-input v-model="items.name" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].options.legend.show" type="text" style="position: relative;top: -8px;width: 95px" size="mini" @keyup.native="setitem()"/>
                      <el-color-picker v-model="items.itemStyle.color" class="bg-sets" style="margin-top: 0px;" @change="setitem()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '提示'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.tooltip.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 5px;margin-right: 10px;">
                      显示方式：
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group style="padding-left: 20px">
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.tooltip.triggerOn === 'click' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitletip('click')">点击</el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.tooltip.triggerOn === 'mousemove' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitletip('mousemove')">滑动</el-button>
                      </el-button-group>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '格式'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      数据标签：
                    </div>
                    <el-checkbox v-model="dataIsShow" class="bg-set" style="margin-top:-15px" @change="setDataiS()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 5px;margin-right: 10px;">
                      显示方式：
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group style="padding-left: 20px">
                        <el-button :class="dataposition === 'inside' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitledat('inside')">内部</el-button>
                        <el-button v-if="substrateFindOptions[isActive].layout[isTabelActive].type === 'bar'" :class="dataposition === 'top' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitledat('top')">外部</el-button>
                        <el-button v-if="substrateFindOptions[isActive].layout[isTabelActive].type === 'tiao'" :class="dataposition === 'right' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitledat('right')">外部</el-button>
                      </el-button-group>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '网格'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      横向：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.yAxis.splitLine.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont">
                      纵向：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.xAxis.splitLine.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                </div>
              </el-menu-item-group>
            </el-submenu>
          </div>
          <div v-if="substrateFindOptions[isActive].layout[isTabelActive].type === 'line'">
            <el-submenu v-for="menu in lineList" :index="menu.id" :key="menu.id" class="setback">
              <!--一级菜单名称、不可拖拽 -->
              <template slot="title">
                <span>{{ menu.name }}</span>
              </template>
              <!--一级菜单子菜单、可拖拽菜单-->
              <el-menu-item-group style="overflow:auto">
                <div v-if="menu.name === '数据'" class="infotab" style="margin-top: -15px">
                  <div style="padding-left: 10px;">X轴</div>
                  <div class="divcont">
                    <span v-if="menu.childrenx.length === 0">请拖入维度</span>
                    <draggable
                      v-model="menu.childrenx"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groups"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getlogbarwd"
                    >
                      <div v-for="(items, index) in menu.childrenx" :key="index">
                        <span v-if="index === 0">{{ items.name }}</span>
                        <el-select v-if="items.columnType.indexOf('time') > -1 || items.columnType.indexOf('date') > -1" v-model="items.key" placeholder="日期" size="mini" class="setsele selectst" style="float:right" @change="updateDL(index)">
                          <el-option
                            v-for="item in dataWDList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                      </div>
                    </draggable>
                  </div>
                </div>
                <div v-if="menu.name === '数据'" class="infotab">
                  <div style="padding-left: 10px;">Y轴</div>
                  <div class="divcontdl">
                    <draggable
                      v-model="menu.childreny"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groupsdl"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getlogbardl"
                    >
                      <span v-if="menu.childreny.length === 0">请拖入度量</span>
                      <div v-for="(items, index) in menu.childreny" :key="index" class="dlitem">
                        <div :title="items.name" class="divlc">{{ items.name }}</div>
                        <el-select v-model="items.key" placeholder="函数" size="mini" class="setsele selectst" @change="updateDL(index)">
                          <el-option
                            v-for="item in aggregateFunList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-button type="danger" size="mini" class="updateico delst" style="padding-top: 3px;" icon="el-icon-close" @click="deleteItems(index)"/>
                      </div>
                    </draggable>
                  </div>
                </div>
                <div v-if="menu.name === '过滤'" class="infotab" style="margin-top: -15px">
                  <div style="padding-left: 10px;">过滤条件</div>
                  <div class="divcontdl">
                    <draggable
                      v-model="menu.children"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groupsdl"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getConditions"
                    >
                      <span v-if="menu.children.length === 0">请拖入过滤条件</span>
                      <div v-for="(items, index) in menu.children" :key="index" class="dlitem">
                        <div :title="items.name" class="divlc" style="width: 58px">{{ items.name }}</div>
                        <el-select v-if="items.type === 'duliang'" v-model="items.conditions" placeholder="条件" size="mini" class="setsele selectst" style="width: 44px;" @change="updateGL()">
                          <el-option
                            v-for="item in condLists"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-select v-if="items.type === 'weidu'" v-model="items.conditions" placeholder="条件" size="mini" class="setsele selectst" style="width: 44px;" @change="updateGL()">
                          <el-option
                            v-for="item in condList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-select v-if="items.type === 'weidu' && items.wedulist !== undefined" v-model="items.value" placeholder="值" size="mini" class="setsele selectst" style="width: 40px;" @change="updateGL()">
                          <el-option
                            v-for="item in items.wedulist"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-input v-if="items.type === 'duliang'" v-model="items.value" type="text" class="setseles selectst" style="margin-left: 3px;width: 40px;" placeholder="值" @keyup.native="updateGL()"/>
                        <el-button type="danger" size="mini" class="updateico delst" style="padding-top: 3px;" icon="el-icon-close" @click="deleteTJ(index)"/>
                      </div>
                    </draggable>
                  </div>
                  <div>
                    <div class="bg-cont">
                      预览时是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].isSearch" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                </div>
                <div v-if="menu.name === '联动'" class="infotab" style="margin-top: -25px">
                  <div style="margin-top:10px">
                    <div style="text-align: center">
                      <el-select v-model="substrateFindOptions[isActive].layout[isTabelActive].ldList" placeholder="选择联动" size="mini" class="ldsty" style="width: 188px;" filterable multiple collapse-tags @change="setfuzhu()">
                        <el-option
                          v-for="item in ldList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"/>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '限制条数'" class="infotab" style="margin-top: -25px">
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      限制条数
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="pageSize" type="number" style="width: 100px" size="mini" @keyup.native="isshowpage()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '标题'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].title.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      文本
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="substrateFindOptions[isActive].layout[isTabelActive].title.text" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].title.show" type="text" style="width: 135px" size="mini" @keyup.native="setfuzhu()"/>
                    </div>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      位置
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'left' ? 'iscat' : ''" title="居左" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('left')">
                          <svg-icon icon-class="fb_jz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'center' ? 'iscat' : ''" title="居中" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('center')">
                          <svg-icon icon-class="fb_spjz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'right' ? 'iscat' : ''" title="居右" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('right')">
                          <svg-icon icon-class="fb_jy" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div style="margin-top: 10px;margin-bottom: -10px;">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      字体
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="substrateFindOptions[isActive].layout[isTabelActive].title.textStyle.fontSize" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].title.show" type="text" style="width: 50px;position: relative;top: -8px;" size="mini" @keyup.native="setfuzhu()"/>
                      <el-color-picker v-model="substrateFindOptions[isActive].layout[isTabelActive].title.textStyle.color" class="bg-sets" style="margin-top: 0px;" @change="setfuzhu()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '图形'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      滚动条：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.dataZoom[0].show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 10px;margin-right: 10px;">
                      起始位置
                    </div>
                    <div style="width: 100px;margin-left: 85px;text-align: right">
                      <el-slider v-model="substrateFindOptions[isActive].layout[isTabelActive].options.dataZoom[0].start" @change="setfuzhu()"/>
                    </div>
                  </div>
                  <div>
                    <div class="bg-cont" style="float: left;margin-top: 10px;margin-right: 10px;">
                      结束位置
                    </div>
                    <div style="width: 100px;margin-left: 80px;text-align: right">
                      <el-slider v-model="substrateFindOptions[isActive].layout[isTabelActive].options.dataZoom[0].end" :disabled="substrateFindOptions[isActive].layout[isTabelActive].options.dataZoom[0].start >= substrateFindOptions[isActive].layout[isTabelActive].options.dataZoom[0].end" @change="setfuzhu()"/>
                    </div>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 5px;margin-right: 10px;">
                      折线样式：
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group style="padding-left: 20px">
                        <el-button :class="!lineFlag ? 'iscat' : ''" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitleline(false)">折线</el-button>
                        <el-button :class="lineFlag ? 'iscat' : ''" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitleline(true)">曲线</el-button>
                      </el-button-group>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '图例'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.legend.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      排列
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.top === 'top' ? 'iscat' : ''" title="顶部" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelgs('top')">
                          <svg-icon icon-class="fb_dingb" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.top === 'bottom' ? 'iscat' : ''" title="底部" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelgs('bottom')">
                          <svg-icon icon-class="fb_dib" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      位置
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.left === 'left' ? 'iscat' : ''" title="居左" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelg('left')">
                          <svg-icon icon-class="fb_jz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.left === 'center' ? 'iscat' : ''" title="居中" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelg('center')">
                          <svg-icon icon-class="fb_spjz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.left === 'right' ? 'iscat' : ''" title="居右" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelg('right')">
                          <svg-icon icon-class="fb_jy" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div v-for="(items, index) in substrateFindOptions[isActive].layout[isTabelActive].options.series" :key="index" style="margin-top: 10px;margin-bottom: -10px;">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      名称
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-input v-model="items.name" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].options.legend.show" type="text" style="position: relative;top: -8px;width: 95px" size="mini" @keyup.native="setitem()"/>
                      <el-color-picker v-model="items.itemStyle.color" class="bg-sets" style="margin-top: 0px;" @change="setitem()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '提示'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.tooltip.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 5px;margin-right: 10px;">
                      显示方式：
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group style="padding-left: 20px">
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.tooltip.triggerOn === 'click' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitletip('click')">点击</el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.tooltip.triggerOn === 'mousemove' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitletip('mousemove')">滑动</el-button>
                      </el-button-group>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '格式'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      数据标签：
                    </div>
                    <el-checkbox v-model="dataIsShow" class="bg-set" style="margin-top:-15px" @change="setDataiS()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 5px;margin-right: 10px;">
                      显示方式：
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group style="padding-left: 20px">
                        <el-button :class="dataposition === 'inside' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitledat('inside')">内部</el-button>
                        <el-button v-if="substrateFindOptions[isActive].layout[isTabelActive].type === 'bar'" :class="dataposition === 'top' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitledat('top')">外部</el-button>
                        <el-button v-if="substrateFindOptions[isActive].layout[isTabelActive].type === 'tiao'" :class="dataposition === 'right' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitledat('right')">外部</el-button>
                      </el-button-group>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '网格'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      横向：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.yAxis.splitLine.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont">
                      纵向：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.xAxis.splitLine.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                </div>
              </el-menu-item-group>
            </el-submenu>
          </div>
          <div v-if="substrateFindOptions[isActive].layout[isTabelActive].type === 'pie'">
            <el-submenu v-for="menu in pieList" :index="menu.id" :key="menu.id" class="setback">
              <!--一级菜单名称、不可拖拽 -->
              <template slot="title">
                <span>{{ menu.name }}</span>
              </template>
              <!--一级菜单子菜单、可拖拽菜单-->
              <el-menu-item-group style="overflow:auto">
                <div v-if="menu.name === '数据'" class="infotab" style="margin-top: -15px">
                  <div style="padding-left: 10px;">维度</div>
                  <div class="divcont">
                    <span v-if="menu.childrenx.length === 0">请拖入维度</span>
                    <draggable
                      v-model="menu.childrenx"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groups"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getlogbarwd"
                    >
                      <div v-for="(items, index) in menu.childrenx" :key="index">
                        <span v-if="index === 0">{{ items.name }}</span>
                        <el-select v-if="items.columnType.indexOf('time') > -1 || items.columnType.indexOf('date') > -1" v-model="items.key" placeholder="日期" size="mini" class="setsele selectst" style="float:right" @change="updateDL(index)">
                          <el-option
                            v-for="item in dataWDList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                      </div>
                    </draggable>
                  </div>
                </div>
                <div v-if="menu.name === '数据'" class="infotab">
                  <div style="padding-left: 10px;">度量</div>
                  <div class="divcontdl">
                    <draggable
                      v-model="menu.childreny"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groupsdl"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getlogbardl"
                    >
                      <span v-if="menu.childreny.length === 0">请拖入度量</span>
                      <div v-for="(items, index) in menu.childreny" :key="index">
                        <div :title="items.name" class="divlc" style="width: 58px">{{ items.name }}</div>
                        <el-select v-model="items.key" placeholder="函数" size="mini" class="setsele selectst" @change="updateDL(index)">
                          <el-option
                            v-for="item in aggregateFunList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                      </div>
                    </draggable>
                  </div>
                </div>
                <div v-if="menu.name === '过滤'" class="infotab" style="margin-top: -15px">
                  <div style="padding-left: 10px;">过滤条件</div>
                  <div class="divcontdl">
                    <draggable
                      v-model="menu.children"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groupsdl"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getConditions"
                    >
                      <span v-if="menu.children.length === 0">请拖入过滤条件</span>
                      <div v-for="(items, index) in menu.children" :key="index" class="dlitem">
                        <div :title="items.name" class="divlc" style="width: 58px">{{ items.name }}</div>
                        <el-select v-if="items.type === 'duliang'" v-model="items.conditions" placeholder="条件" size="mini" class="setsele selectst" style="width: 44px;" @change="updateGL()">
                          <el-option
                            v-for="item in condLists"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-select v-if="items.type === 'weidu'" v-model="items.conditions" placeholder="条件" size="mini" class="setsele selectst" style="width: 44px;" @change="updateGL()">
                          <el-option
                            v-for="item in condList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-select v-if="items.type === 'weidu' && items.wedulist !== undefined" v-model="items.value" placeholder="值" size="mini" class="setsele selectst" style="width: 40px;" @change="updateGL()">
                          <el-option
                            v-for="item in items.wedulist"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-input v-if="items.type === 'duliang'" v-model="items.value" type="text" class="setseles selectst" style="margin-left: 3px;width: 40px;" placeholder="值" @keyup.native="updateGL()"/>
                        <el-button type="danger" size="mini" class="updateico delst" style="padding-top: 3px;" icon="el-icon-close" @click="deleteTJ(index)"/>
                      </div>
                    </draggable>
                  </div>
                  <div>
                    <div class="bg-cont">
                      预览时是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].isSearch" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                </div>
                <div v-if="menu.name === '联动'" class="infotab" style="margin-top: -25px">
                  <div style="margin-top:10px">
                    <div style="text-align: center">
                      <el-select v-model="substrateFindOptions[isActive].layout[isTabelActive].ldList" placeholder="选择联动" size="mini" class="ldsty" style="width: 188px;" filterable multiple collapse-tags @change="setfuzhu()">
                        <el-option
                          v-for="item in ldList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"/>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '限制条数'" class="infotab" style="margin-top: -25px">
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      限制条数
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="pageSize" type="number" style="width: 100px" size="mini" @keyup.native="isshowpage()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '标题'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].title.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      文本
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="substrateFindOptions[isActive].layout[isTabelActive].title.text" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].title.show" type="text" style="width: 135px" size="mini" @keyup.native="setfuzhu()"/>
                    </div>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      位置
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'left' ? 'iscat' : ''" title="居左" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('left')">
                          <svg-icon icon-class="fb_jz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'center' ? 'iscat' : ''" title="居中" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('center')">
                          <svg-icon icon-class="fb_spjz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'right' ? 'iscat' : ''" title="居右" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('right')">
                          <svg-icon icon-class="fb_jy" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div style="margin-top: 10px;margin-bottom: -10px;">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      字体
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="substrateFindOptions[isActive].layout[isTabelActive].title.textStyle.fontSize" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].title.show" type="text" style="width: 50px;position: relative;top: -8px;" size="mini" @keyup.native="setfuzhu()"/>
                      <el-color-picker v-model="substrateFindOptions[isActive].layout[isTabelActive].title.textStyle.color" class="bg-sets" style="margin-top: 0px;" @change="setfuzhu()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '图形'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否顺时针排布:
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.series[0].clockwise" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont">
                      玫瑰形状:
                    </div>
                    <el-checkbox v-model="roseType" class="bg-set" style="margin-top:-15px" @change="roseTypes()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 10px;margin-right: 10px;">
                      起始角度：
                    </div>
                    <div style="width: 110px;margin-left: 80px;text-align: right">
                      <el-slider v-model="defaultRadiusst" @input="setradius()" @change="setfuzhu()"/>
                    </div>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 10px;margin-right: 10px;">
                      半径：
                    </div>
                    <div style="width: 110px;margin-left: 80px;text-align: right">
                      <el-slider v-model="defaultRadius" :min="1" :max="100" @input="setradius()" @change="setfuzhu()"/>
                    </div>
                  </div>

                </div>
                <div v-if="menu.name === '图例'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.legend.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      排列
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.top === 'top' ? 'iscat' : ''" title="顶部" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelgs('top')">
                          <svg-icon icon-class="fb_dingb" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.top === 'bottom' ? 'iscat' : ''" title="底部" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelgs('bottom')">
                          <svg-icon icon-class="fb_dib" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      位置
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.left === 'left' ? 'iscat' : ''" title="居左" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelg('left')">
                          <svg-icon icon-class="fb_jz" class="icofons"/>
                        </el-button>
                        <!-- <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.left === 'center' ? 'iscat' : ''" title="居中" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelg('center')">
                          <svg-icon icon-class="fb_spjz" class="icofons"/>
                        </el-button> -->
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.left === 'right' ? 'iscat' : ''" title="居右" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelg('right')">
                          <svg-icon icon-class="fb_jy" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div v-for="(items, index) in substrateFindOptions[isActive].layout[isTabelActive].options.series[0].data" :key="index" style="margin-top: 10px;margin-bottom: -10px;">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      名称
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-input v-model="items.name" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].options.legend.show" type="text" style="position: relative;top: -8px;width: 95px" size="mini" @keyup.native="setitem()"/>
                      <el-color-picker v-model="items.itemStyle.color" class="bg-sets" style="margin-top: 0px;" @change="setitem()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '提示'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.tooltip.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 5px;margin-right: 10px;">
                      显示方式：
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group style="padding-left: 20px">
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.tooltip.triggerOn === 'click' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitletip('click')">点击</el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.tooltip.triggerOn === 'mousemove' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitletip('mousemove')">滑动</el-button>
                      </el-button-group>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '格式'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      数据标签：
                    </div>
                    <el-checkbox v-model="dataIsShow" class="bg-set" style="margin-top:-15px" @change="setDataiS()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 5px;margin-right: 10px;">
                      显示方式：
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group style="padding-left: 20px">
                        <el-button :class="dataposition === 'inside' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitledat('inside')">内部</el-button>
                        <el-button :class="dataposition === 'outside' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitledat('outside')">外部</el-button>
                      </el-button-group>
                    </div>
                  </div>
                </div>
              </el-menu-item-group>
            </el-submenu>
          </div>
          <div v-if="substrateFindOptions[isActive].layout[isTabelActive].type === 'scatter'">
            <el-submenu v-for="menu in scatterList" :index="menu.id" :key="menu.id" class="setback">
              <!--一级菜单名称、不可拖拽 -->
              <template slot="title">
                <span>{{ menu.name }}</span>
              </template>
              <!--一级菜单子菜单、可拖拽菜单-->
              <el-menu-item-group style="overflow:auto">
                <div v-if="menu.name === '数据'" class="infotab" style="margin-top: -15px">
                  <div style="padding-left: 10px;">X轴</div>
                  <div class="divcontdl">
                    <draggable
                      v-model="menu.childrenx"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groupsdl"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getlogbardl1"
                    >
                      <span v-if="menu.childrenx.length === 0">请拖入度量</span>
                      <div v-for="(items, index) in menu.childrenx" :key="index" class="dlitem">
                        <div :title="items.name" class="divlc" style="width: 58px">{{ items.name }}</div>
                        <el-select v-model="items.key" placeholder="函数" size="mini" class="setsele selectst" @change="updateDL(index)">
                          <el-option
                            v-for="item in aggregateFunList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-button type="danger" size="mini" class="updateico" style="position: relative;color: #F56C6C;top:-2px" icon="el-icon-close" @click="deleteItems1(index)"/>
                      </div>
                    </draggable>
                  </div>
                </div>
                <div v-if="menu.name === '数据'" class="infotab">
                  <div style="padding-left: 10px;">Y轴</div>
                  <div class="divcontdl">
                    <draggable
                      v-model="menu.childreny"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groupsdl"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getlogbardl2"
                    >
                      <span v-if="menu.childreny.length === 0">请拖入度量</span>
                      <div v-for="(items, index) in menu.childreny" :key="index" class="dlitem">
                        <div :title="items.name" class="divlc" style="width: 58px">{{ items.name }}</div>
                        <el-select v-model="items.key" placeholder="函数" size="mini" class="setsele selectst" @change="updateDL(index)">
                          <el-option
                            v-for="item in aggregateFunList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-button type="danger" size="mini" class="updateico" style="position: relative;color: #F56C6C;top:-2px" icon="el-icon-close" @click="deleteItems2(index)"/>
                      </div>
                    </draggable>
                  </div>
                </div>
                <div v-if="menu.name === '过滤'" class="infotab" style="margin-top: -15px">
                  <div style="padding-left: 10px;">过滤条件</div>
                  <div class="divcontdl">
                    <draggable
                      v-model="menu.children"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groupsdl"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getConditions"
                    >
                      <span v-if="menu.children.length === 0">请拖入过滤条件</span>
                      <div v-for="(items, index) in menu.children" :key="index" class="dlitem">
                        <div :title="items.name" class="divlc" style="width: 58px">{{ items.name }}</div>
                        <el-select v-if="items.type === 'duliang'" v-model="items.conditions" placeholder="条件" size="mini" class="setsele selectst" style="width: 44px;" @change="updateGL()">
                          <el-option
                            v-for="item in condLists"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-select v-if="items.type === 'weidu'" v-model="items.conditions" placeholder="条件" size="mini" class="setsele selectst" style="width: 44px;" @change="updateGL()">
                          <el-option
                            v-for="item in condList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-select v-if="items.type === 'weidu' && items.wedulist !== undefined" v-model="items.value" placeholder="值" size="mini" class="setsele selectst" style="width: 40px;" @change="updateGL()">
                          <el-option
                            v-for="item in items.wedulist"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-input v-if="items.type === 'duliang'" v-model="items.value" type="text" class="setseles selectst" style="margin-left: 3px;width: 40px;" placeholder="值" @keyup.native="updateGL()"/>
                        <el-button type="danger" size="mini" class="updateico delst" style="padding-top: 3px;" icon="el-icon-close" @click="deleteTJ(index)"/>
                      </div>
                    </draggable>
                  </div>
                  <div>
                    <div class="bg-cont">
                      预览时是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].isSearch" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                </div>
                <div v-if="menu.name === '限制条数'" class="infotab" style="margin-top: -25px">
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      限制条数
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="pageSize" type="number" style="width: 100px" size="mini" @keyup.native="isshowpage()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '标题'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].title.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      文本
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="substrateFindOptions[isActive].layout[isTabelActive].title.text" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].title.show" type="text" style="width: 135px" size="mini" @keyup.native="setfuzhu()"/>
                    </div>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      位置
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'left' ? 'iscat' : ''" title="居左" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('left')">
                          <svg-icon icon-class="fb_jz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'center' ? 'iscat' : ''" title="居中" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('center')">
                          <svg-icon icon-class="fb_spjz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'right' ? 'iscat' : ''" title="居右" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('right')">
                          <svg-icon icon-class="fb_jy" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div style="margin-top: 10px;margin-bottom: -10px;">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      字体
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="substrateFindOptions[isActive].layout[isTabelActive].title.textStyle.fontSize" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].title.show" type="text" style="width: 50px;position: relative;top: -8px;" size="mini" @change="setfuzhu()"/>
                      <el-color-picker v-model="substrateFindOptions[isActive].layout[isTabelActive].title.textStyle.color" class="bg-sets" style="margin-top: 0px;" @change="setfuzhu()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '图形'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      滚动条：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.dataZoom[0].show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 10px;margin-right: 10px;">
                      起始位置
                    </div>
                    <div style="width: 100px;margin-left: 85px;text-align: right">
                      <el-slider v-model="substrateFindOptions[isActive].layout[isTabelActive].options.dataZoom[0].start" @change="setfuzhu()"/>
                    </div>
                  </div>
                  <div>
                    <div class="bg-cont" style="float: left;margin-top: 10px;margin-right: 10px;">
                      结束位置
                    </div>
                    <div style="width: 100px;margin-left: 80px;text-align: right">
                      <el-slider v-model="substrateFindOptions[isActive].layout[isTabelActive].options.dataZoom[0].end" :disabled="substrateFindOptions[isActive].layout[isTabelActive].options.dataZoom[0].start >= substrateFindOptions[isActive].layout[isTabelActive].options.dataZoom[0].end" @change="setfuzhu()"/>
                    </div>
                  </div>
                  <div>
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      散点大小：
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="substrateFindOptions[isActive].layout[isTabelActive].options.series[0].symbolSize" type="number" style="width: 80px" size="mini" @keyup.native="setfuzhu()"/>
                    </div>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 5px;margin-right: 10px;">
                      颜色：
                    </div>
                    <div style="text-align: right">
                      <el-color-picker v-model="substrateFindOptions[isActive].layout[isTabelActive].options.series[0].itemStyle.color" class="bg-sets" style="margin-top: 0px;" @change="setfuzhu()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '图例'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.legend.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      排列
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.top === 'top' ? 'iscat' : ''" title="顶部" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelgs('top')">
                          <svg-icon icon-class="fb_dingb" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.top === 'bottom' ? 'iscat' : ''" title="底部" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelgs('bottom')">
                          <svg-icon icon-class="fb_dib" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      位置
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.left === 'left' ? 'iscat' : ''" title="居左" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelg('left')">
                          <svg-icon icon-class="fb_jz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.left === 'center' ? 'iscat' : ''" title="居中" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelg('center')">
                          <svg-icon icon-class="fb_spjz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.left === 'right' ? 'iscat' : ''" title="居右" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelg('right')">
                          <svg-icon icon-class="fb_jy" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div v-for="(items, index) in substrateFindOptions[isActive].layout[isTabelActive].options.series" :key="index" style="margin-top: 10px;margin-bottom: -10px;">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      名称
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-input v-model="items.name" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].options.legend.show" type="text" style="position: relative;top: -8px;width: 95px" size="mini" @keyup.native="setitem()"/>
                      <el-color-picker v-model="items.itemStyle.color" class="bg-sets" style="margin-top: 0px;" @change="setitem()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '提示'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.tooltip.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 5px;margin-right: 10px;">
                      显示方式：
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group style="padding-left: 20px">
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.tooltip.triggerOn === 'click' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitletip('click')">点击</el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.tooltip.triggerOn === 'mousemove' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitletip('mousemove')">滑动</el-button>
                      </el-button-group>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '格式'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      数据标签：
                    </div>
                    <el-checkbox v-model="dataIsShow" class="bg-set" style="margin-top:-15px" @change="setDataiS()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 5px;margin-right: 10px;">
                      显示方式：
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group style="padding-left: 20px">
                        <el-button :class="dataposition === 'inside' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitledat('inside')">内部</el-button>
                        <el-button v-if="substrateFindOptions[isActive].layout[isTabelActive].type === 'bar'" :class="dataposition === 'top' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitledat('top')">外部</el-button>
                        <el-button v-if="substrateFindOptions[isActive].layout[isTabelActive].type === 'tiao'" :class="dataposition === 'right' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitledat('right')">外部</el-button>
                      </el-button-group>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '网格'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      横向：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.yAxis.splitLine.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont">
                      纵向：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.xAxis.splitLine.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                </div>
              </el-menu-item-group>
            </el-submenu>
          </div>
          <div v-if="substrateFindOptions[isActive].layout[isTabelActive].type === 'table' || substrateFindOptions[isActive].layout[isTabelActive].type === 'tstab'">
            <el-submenu v-for="menu in tableList" :index="menu.id" :key="menu.id" class="setback">
              <!--一级菜单名称、不可拖拽 -->
              <template slot="title">
                <span>{{ menu.name }}</span>
              </template>
              <!--一级菜单子菜单、可拖拽菜单-->
              <el-menu-item-group style="overflow:auto">
                <div v-if="menu.name === '数据'" class="infotab" style="margin-top: -15px">
                  <div>数据</div>
                  <div class="divcontdl">
                    <draggable
                      v-model="menu.childreny"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groupsdl"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getlogbardl"
                    >
                      <span v-if="menu.childreny.length === 0">请拖入度量或维度</span>
                      <div v-for="(items, index) in menu.childreny" :key="index" class="dlitem">
                        <div :title="items.name" :style="{width: (items.columnType.indexOf('time') > -1 || items.columnType.indexOf('date') > -1) ? '85px' : '145px'}" class="divlc">{{ items.name }}</div>
                        <el-select v-if="items.columnType.indexOf('time') > -1 || items.columnType.indexOf('date') > -1" v-model="items.key" placeholder="日期" size="mini" class="setsele selectst" style="position: relative;" @change="updateDL(index)">
                          <el-option
                            v-for="item in dataWDList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-button type="danger" size="mini" class="updateico" style="position: relative;color: #F56C6C;top:-2px" icon="el-icon-close" @click="deleteItems(index)"/>
                      </div>
                    </draggable>
                  </div>
                </div>
                <div v-if="menu.name === '过滤'" class="infotab" style="margin-top: -15px">
                  <div style="padding-left: 10px;">过滤条件</div>
                  <div class="divcontdl">
                    <draggable
                      v-model="menu.children"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groupsdl"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getConditions"
                    >
                      <span v-if="menu.children.length === 0">请拖入过滤条件</span>
                      <div v-for="(items, index) in menu.children" :key="index" class="dlitem">
                        <div :title="items.name" class="divlc" style="width: 58px">{{ items.name }}</div>
                        <el-select v-if="items.type === 'duliang'" v-model="items.conditions" placeholder="条件" size="mini" class="setsele selectst" style="width: 44px;" @change="updateGL()">
                          <el-option
                            v-for="item in condLists"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-select v-if="items.type === 'weidu'" v-model="items.conditions" placeholder="条件" size="mini" class="setsele selectst" style="width: 44px;" @change="updateGL()">
                          <el-option
                            v-for="item in condList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-select v-if="items.type === 'weidu' && items.wedulist !== undefined" v-model="items.value" placeholder="值" size="mini" class="setsele selectst" style="width: 40px;" @change="updateGL()">
                          <el-option
                            v-for="item in items.wedulist"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-input v-if="items.type === 'duliang'" v-model="items.value" type="text" class="setseles selectst" style="margin-left: 3px;width: 40px;" placeholder="值" @keyup.native="updateGL()"/>
                        <el-button type="danger" size="mini" class="updateico delst" style="padding-top: 3px;" icon="el-icon-close" @click="deleteTJ(index)"/>
                      </div>
                    </draggable>
                  </div>
                  <div>
                    <div class="bg-cont">
                      预览时是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].isSearch" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                </div>
                <div v-if="menu.name === '标题'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].title.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      文本
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="substrateFindOptions[isActive].layout[isTabelActive].title.text" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].title.show" type="text" style="width: 135px" size="mini" @keyup.native="setfuzhu()"/>
                    </div>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      位置
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'left' ? 'iscat' : ''" title="居左" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('left')">
                          <svg-icon icon-class="fb_jz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'center' ? 'iscat' : ''" title="居中" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('center')">
                          <svg-icon icon-class="fb_spjz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'right' ? 'iscat' : ''" title="居右" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('right')">
                          <svg-icon icon-class="fb_jy" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div style="margin-top: 10px;margin-bottom: -10px;">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      字体
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="substrateFindOptions[isActive].layout[isTabelActive].title.textStyle.fontSize" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].title.show" type="text" style="width: 50px;position: relative;top: -8px;" size="mini" @keyup.native="setfuzhu()"/>
                      <el-color-picker v-model="substrateFindOptions[isActive].layout[isTabelActive].title.textStyle.color" class="bg-sets" style="margin-top: 0px;" @change="setfuzhu()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '分页' && substrateFindOptions[isActive].layout[isTabelActive].type === 'table'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].pageInfo.show" class="bg-set" style="margin-top:-15px" @change="isshowpage()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      每页分页数
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="pageSize" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].pageInfo.show" type="number" style="width: 100px" size="mini" @keyup.native="isshowpage()"/>
                    </div>
                  </div>
                </div>
              </el-menu-item-group>
            </el-submenu>
          </div>
          <div v-if="substrateFindOptions[isActive].layout[isTabelActive].type === 'loudou'">
            <el-submenu v-for="menu in pieList" :index="menu.id" :key="menu.id" class="setback">
              <!--一级菜单名称、不可拖拽 -->
              <template slot="title">
                <span>{{ menu.name }}</span>
              </template>
              <!--一级菜单子菜单、可拖拽菜单-->
              <el-menu-item-group style="overflow:auto">
                <div v-if="menu.name === '数据'" class="infotab" style="margin-top: -15px">
                  <div style="padding-left: 10px;">维度</div>
                  <div class="divcont">
                    <span v-if="menu.childrenx.length === 0">请拖入维度</span>
                    <draggable
                      v-model="menu.childrenx"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groups"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getlogbarwd"
                    >
                      <div v-for="(items, index) in menu.childrenx" :key="index">
                        <span v-if="index === 0">{{ items.name }}</span>
                        <el-select v-if="items.columnType.indexOf('time') > -1 || items.columnType.indexOf('date') > -1" v-model="items.key" placeholder="日期" size="mini" class="setsele selectst" style="float:right" @change="updateDL(index)">
                          <el-option
                            v-for="item in dataWDList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                      </div>
                    </draggable>
                  </div>
                </div>
                <div v-if="menu.name === '数据'" class="infotab">
                  <div style="padding-left: 10px;">度量</div>
                  <div class="divcontdl">
                    <draggable
                      v-model="menu.childreny"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groupsdl"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getlogbardl"
                    >
                      <span v-if="menu.childreny.length === 0">请拖入度量</span>
                      <div v-for="(items, index) in menu.childreny" :key="index">
                        <span>{{ items.name }}</span>
                      </div>
                    </draggable>
                  </div>
                </div>
                <div v-if="menu.name === '过滤'" class="infotab" style="margin-top: -15px">
                  <div style="padding-left: 10px;">过滤条件</div>
                  <div class="divcontdl">
                    <draggable
                      v-model="menu.children"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groupsdl"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getConditions"
                    >
                      <span v-if="menu.children.length === 0">请拖入过滤条件</span>
                      <div v-for="(items, index) in menu.children" :key="index" class="dlitem">
                        <div :title="items.name" class="divlc" style="width: 58px">{{ items.name }}</div>
                        <el-select v-if="items.type === 'duliang'" v-model="items.conditions" placeholder="条件" size="mini" class="setsele selectst" style="width: 44px;" @change="updateGL()">
                          <el-option
                            v-for="item in condLists"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-select v-if="items.type === 'weidu'" v-model="items.conditions" placeholder="条件" size="mini" class="setsele selectst" style="width: 44px;" @change="updateGL()">
                          <el-option
                            v-for="item in condList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-select v-if="items.type === 'weidu' && items.wedulist !== undefined" v-model="items.value" placeholder="值" size="mini" class="setsele selectst" style="width: 40px;" @change="updateGL()">
                          <el-option
                            v-for="item in items.wedulist"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-input v-if="items.type === 'duliang'" v-model="items.value" type="text" class="setseles selectst" style="margin-left: 3px;width: 40px;" placeholder="值" @keyup.native="updateGL()"/>
                        <el-button type="danger" size="mini" class="updateico delst" style="padding-top: 3px;" icon="el-icon-close" @click="deleteTJ(index)"/>
                      </div>
                    </draggable>
                  </div>
                  <div>
                    <div class="bg-cont">
                      预览时是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].isSearch" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                </div>
                <div v-if="menu.name === '联动'" class="infotab" style="margin-top: -25px">
                  <div style="margin-top:10px">
                    <div style="text-align: center">
                      <el-select v-model="substrateFindOptions[isActive].layout[isTabelActive].ldList" placeholder="选择联动" size="mini" class="ldsty" style="width: 188px;" filterable multiple collapse-tags @change="setfuzhu()">
                        <el-option
                          v-for="item in ldList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"/>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '限制条数'" class="infotab" style="margin-top: -25px">
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      限制条数
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="pageSize" type="number" style="width: 100px" size="mini" @keyup.native="isshowpage()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '标题'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].title.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      文本
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="substrateFindOptions[isActive].layout[isTabelActive].title.text" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].title.show" type="text" style="width: 135px" size="mini" @keyup.native="setfuzhu()"/>
                    </div>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      位置
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'left' ? 'iscat' : ''" title="居左" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('left')">
                          <svg-icon icon-class="fb_jz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'center' ? 'iscat' : ''" title="居中" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('center')">
                          <svg-icon icon-class="fb_spjz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'right' ? 'iscat' : ''" title="居右" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('right')">
                          <svg-icon icon-class="fb_jy" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div style="margin-top: 10px;margin-bottom: -10px;">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      字体
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="substrateFindOptions[isActive].layout[isTabelActive].title.textStyle.fontSize" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].title.show" type="text" style="width: 50px;position: relative;top: -8px;" size="mini" @keyup.native="setfuzhu()"/>
                      <el-color-picker v-model="substrateFindOptions[isActive].layout[isTabelActive].title.textStyle.color" class="bg-sets" style="margin-top: 0px;" @change="setfuzhu()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '图例'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.legend.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      排列
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.top === 'top' ? 'iscat' : ''" title="顶部" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelgs('top')">
                          <svg-icon icon-class="fb_dingb" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.top === 'bottom' ? 'iscat' : ''" title="底部" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelgs('bottom')">
                          <svg-icon icon-class="fb_dib" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      位置
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.left === 'left' ? 'iscat' : ''" title="居左" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelg('left')">
                          <svg-icon icon-class="fb_jz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.left === 'center' ? 'iscat' : ''" title="居中" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelg('center')">
                          <svg-icon icon-class="fb_spjz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.left === 'right' ? 'iscat' : ''" title="居右" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelg('right')">
                          <svg-icon icon-class="fb_jy" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div v-for="(items, index) in substrateFindOptions[isActive].layout[isTabelActive].options.series[0].data" :key="index" style="margin-top: 10px;margin-bottom: -10px;">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      名称
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-input v-model="items.name" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].options.legend.show" type="text" style="position: relative;top: -8px;width: 95px" size="mini" @keyup.native="setitem()"/>
                      <el-color-picker v-model="items.itemStyle.color" class="bg-sets" style="margin-top: 0px;" @change="setitem()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '提示'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.tooltip.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 5px;margin-right: 10px;">
                      显示方式：
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group style="padding-left: 20px">
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.tooltip.triggerOn === 'click' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitletip('click')">点击</el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.tooltip.triggerOn === 'mousemove' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitletip('mousemove')">滑动</el-button>
                      </el-button-group>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '格式'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      数据标签：
                    </div>
                    <el-checkbox v-model="dataIsShow" class="bg-set" style="margin-top:-15px" @change="setDataiS()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 5px;margin-right: 10px;">
                      显示方式：
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group style="padding-left: 20px">
                        <el-button :class="dataposition === 'inside' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitledat('inside')">内部</el-button>
                        <el-button :class="dataposition === 'outside' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitledat('outside')">外部</el-button>
                      </el-button-group>
                    </div>
                  </div>
                </div>
              </el-menu-item-group>
            </el-submenu>
          </div>
          <div v-if="substrateFindOptions[isActive].layout[isTabelActive].type === 'zuhe'">
            <el-submenu v-for="menu in zuheList" :index="menu.id" :key="menu.id" class="setback">
              <!--一级菜单名称、不可拖拽 -->
              <template slot="title">
                <span>{{ menu.name }}</span>
              </template>
              <!--一级菜单子菜单、可拖拽菜单-->
              <el-menu-item-group style="overflow:auto">
                <div v-if="menu.name === '数据'" class="infotab" style="margin-top: -15px">
                  <div style="padding-left: 10px;">X轴</div>
                  <div class="divcont">
                    <span v-if="menu.childrenx.length === 0">请拖入维度</span>
                    <draggable
                      v-model="menu.childrenx"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groups"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getlogbarwd"
                    >
                      <div v-for="(items, index) in menu.childrenx" :key="index">
                        <span v-if="index === 0">{{ items.name }}</span>
                        <el-select v-if="items.columnType.indexOf('time') > -1 || items.columnType.indexOf('date') > -1" v-model="items.key" placeholder="日期" size="mini" class="setsele selectst" style="float:right" @change="updateDL(index)">
                          <el-option
                            v-for="item in dataWDList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                      </div>
                    </draggable>
                  </div>
                </div>
                <div v-if="menu.name === '数据'" class="infotab">
                  <div style="padding-left: 10px;">Y轴(折线)</div>
                  <div class="divcontdl">
                    <draggable
                      v-model="menu.childreny1"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groupsdl"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getlogbardlX"
                    >
                      <span v-if="menu.childreny1.length === 0">请拖入度量</span>
                      <div v-for="(items, index) in menu.childreny1" :key="index" class="dlitem">
                        <span :title="items.name">{{ items.name }}</span>
                        <el-select v-model="items.key" placeholder="函数" size="mini" style="width: 60px" class="setsele" @change="updateDL(index)">
                          <el-option
                            v-for="item in aggregateFunList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-button type="danger" size="mini" class="updateico" style="position: relative;color: #F56C6C;top:-2px" icon="el-icon-close" @click="deleteItemsx(index)"/>
                      </div>
                    </draggable>
                  </div>
                </div>
                <div v-if="menu.name === '数据'" class="infotab">
                  <div style="padding-left: 10px;">Y轴(柱状)</div>
                  <div class="divcontdl">
                    <draggable
                      v-model="menu.childreny"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groupsdl"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getlogbardl"
                    >
                      <span v-if="menu.childreny.length === 0">请拖入度量</span>
                      <div v-for="(items, index) in menu.childreny" :key="index" class="dlitem">
                        <span :title="items.name">{{ items.name }}</span>
                        <el-select v-model="items.key" placeholder="函数" size="mini" style="width: 60px" class="setsele" @change="updateDL(index)">
                          <el-option
                            v-for="item in aggregateFunList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-button type="danger" size="mini" class="updateico" style="position: relative;color: #F56C6C;top:-2px" icon="el-icon-close" @click="deleteItems(index)"/>
                      </div>
                    </draggable>
                  </div>
                </div>
                <div v-if="menu.name === '过滤'" class="infotab" style="margin-top: -15px">
                  <div style="padding-left: 10px;">过滤条件</div>
                  <div class="divcontdl">
                    <draggable
                      v-model="menu.children"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groupsdl"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getConditions"
                    >
                      <span v-if="menu.children.length === 0">请拖入过滤条件</span>
                      <div v-for="(items, index) in menu.children" :key="index" class="dlitem">
                        <div :title="items.name" class="divlc" style="width: 58px">{{ items.name }}</div>
                        <el-select v-if="items.type === 'duliang'" v-model="items.conditions" placeholder="条件" size="mini" class="setsele selectst" style="width: 44px;" @change="updateGL()">
                          <el-option
                            v-for="item in condLists"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-select v-if="items.type === 'weidu'" v-model="items.conditions" placeholder="条件" size="mini" class="setsele selectst" style="width: 44px;" @change="updateGL()">
                          <el-option
                            v-for="item in condList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-select v-if="items.type === 'weidu' && items.wedulist !== undefined" v-model="items.value" placeholder="值" size="mini" class="setsele selectst" style="width: 40px;" @change="updateGL()">
                          <el-option
                            v-for="item in items.wedulist"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-input v-if="items.type === 'duliang'" v-model="items.value" type="text" class="setseles selectst" style="margin-left: 3px;width: 40px;" placeholder="值" @keyup.native="updateGL()"/>
                        <el-button type="danger" size="mini" class="updateico delst" style="padding-top: 3px;" icon="el-icon-close" @click="deleteTJ(index)"/>
                      </div>
                    </draggable>
                  </div>
                  <div>
                    <div class="bg-cont">
                      预览时是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].isSearch" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                </div>
                <div v-if="menu.name === '限制条数'" class="infotab" style="margin-top: -25px">
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      限制条数
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="pageSize" type="number" style="width: 100px" size="mini" @keyup.native="isshowpage()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '联动'" class="infotab" style="margin-top: -25px">
                  <div style="margin-top:10px">
                    <div style="text-align: center">
                      <el-select v-model="substrateFindOptions[isActive].layout[isTabelActive].ldList" placeholder="选择联动" size="mini" class="ldsty" style="width: 188px;" filterable multiple collapse-tags @change="setfuzhu()">
                        <el-option
                          v-for="item in ldList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"/>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '标题'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].title.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      文本
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="substrateFindOptions[isActive].layout[isTabelActive].title.text" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].title.show" type="text" style="width: 135px" size="mini" @keyup.native="setfuzhu()"/>
                    </div>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      位置
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'left' ? 'iscat' : ''" title="居左" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('left')">
                          <svg-icon icon-class="fb_jz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'center' ? 'iscat' : ''" title="居中" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('center')">
                          <svg-icon icon-class="fb_spjz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'right' ? 'iscat' : ''" title="居右" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('right')">
                          <svg-icon icon-class="fb_jy" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div style="margin-top: 10px;margin-bottom: -10px;">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      字体
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="substrateFindOptions[isActive].layout[isTabelActive].title.textStyle.fontSize" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].title.show" type="text" style="width: 50px;position: relative;top: -8px;" size="mini" @keyup.native="setfuzhu()"/>
                      <el-color-picker v-model="substrateFindOptions[isActive].layout[isTabelActive].title.textStyle.color" class="bg-sets" style="margin-top: 0px;" @change="setfuzhu()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '图形'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      滚动条：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.dataZoom[0].show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 10px;margin-right: 10px;">
                      起始位置
                    </div>
                    <div style="width: 100px;margin-left: 85px;text-align: right">
                      <el-slider v-model="substrateFindOptions[isActive].layout[isTabelActive].options.dataZoom[0].start" @change="setfuzhu()"/>
                    </div>
                  </div>
                  <div>
                    <div class="bg-cont" style="float: left;margin-top: 10px;margin-right: 10px;">
                      结束位置
                    </div>
                    <div style="width: 100px;margin-left: 80px;text-align: right">
                      <el-slider v-model="substrateFindOptions[isActive].layout[isTabelActive].options.dataZoom[0].end" :disabled="substrateFindOptions[isActive].layout[isTabelActive].options.dataZoom[0].start >= substrateFindOptions[isActive].layout[isTabelActive].options.dataZoom[0].end" @change="setfuzhu()"/>
                    </div>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 5px;margin-right: 10px;">
                      折线样式：
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group style="padding-left: 20px">
                        <el-button :class="!lineFlag ? 'iscat' : ''" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitleline(false)">折线</el-button>
                        <el-button :class="lineFlag ? 'iscat' : ''" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitleline(true)">曲线</el-button>
                      </el-button-group>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '图例'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.legend.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      排列
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.top === 'top' ? 'iscat' : ''" title="顶部" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelgs('top')">
                          <svg-icon icon-class="fb_dingb" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.top === 'bottom' ? 'iscat' : ''" title="底部" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelgs('bottom')">
                          <svg-icon icon-class="fb_dib" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      位置
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.left === 'left' ? 'iscat' : ''" title="居左" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelg('left')">
                          <svg-icon icon-class="fb_jz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.left === 'center' ? 'iscat' : ''" title="居中" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelg('center')">
                          <svg-icon icon-class="fb_spjz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.legend.left === 'right' ? 'iscat' : ''" title="居右" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelg('right')">
                          <svg-icon icon-class="fb_jy" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div v-for="(items, index) in substrateFindOptions[isActive].layout[isTabelActive].options.series" :key="index" style="margin-top: 10px;margin-bottom: -10px;">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      名称
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-input v-model="items.name" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].options.legend.show" type="text" style="position: relative;top: -8px;width: 95px" size="mini" @keyup.native="setitem()"/>
                      <el-color-picker v-model="items.itemStyle.color" class="bg-sets" style="margin-top: 0px;" @change="setitem()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '提示'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.tooltip.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 5px;margin-right: 10px;">
                      显示方式：
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group style="padding-left: 20px">
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.tooltip.triggerOn === 'click' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitletip('click')">点击</el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].options.tooltip.triggerOn === 'mousemove' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitletip('mousemove')">滑动</el-button>
                      </el-button-group>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '格式'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      数据标签：
                    </div>
                    <el-checkbox v-model="dataIsShow" class="bg-set" style="margin-top:-15px" @change="setDataiS()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 5px;margin-right: 10px;">
                      显示方式：
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group style="padding-left: 20px">
                        <el-button :class="dataposition === 'inside' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitledat('inside')">内部</el-button>
                        <el-button v-if="substrateFindOptions[isActive].layout[isTabelActive].type === 'bar'" :class="dataposition === 'top' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitledat('top')">外部</el-button>
                      </el-button-group>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '网格'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      横向：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.yAxis[0].splitLine.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont">
                      纵向：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].options.xAxis[0].splitLine.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                </div>
              </el-menu-item-group>
            </el-submenu>
          </div>
          <div v-if="substrateFindOptions[isActive].layout[isTabelActive].type === 'search' && isSearchActive > -1">
            <el-submenu v-for="menu in searchList" :index="menu.id" :key="menu.id" class="setback">
              <!--一级菜单名称、不可拖拽 -->
              <template slot="title">
                <span>{{ menu.name }}</span>
              </template>
              <!--一级菜单子菜单、可拖拽菜单-->
              <el-menu-item-group style="overflow:auto">
                <div v-if="menu.name === '名称' && substrateFindOptions[isActive].layout[isTabelActive].searchinput[isSearchActive].type !== 'single'" class="infotab" style="margin-top: -25px">
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      名称:
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="substrateFindOptions[isActive].layout[isTabelActive].searchinput[isSearchActive].text" type="text" style="width: 135px" size="mini" @keyup.native="setfuzhu()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '名称' && substrateFindOptions[isActive].layout[isTabelActive].searchinput[isSearchActive].type === 'single'" class="infotab" style="margin-top: -25px">
                  <div v-for="(menus, inds) in substrateFindOptions[isActive].layout[isTabelActive].searchinput[isSearchActive].list" :key="inds" style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      名称
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="substrateFindOptions[isActive].layout[isTabelActive].searchinput[isSearchActive].list[inds].text" type="text" style="width: 110px" size="mini" @keyup.native="setfuzhu()"/>
                      <el-button v-if="substrateFindOptions[isActive].layout[isTabelActive].searchinput[isSearchActive].list.length>1" type="danger" size="mini" class="updateico deletebtns" icon="el-icon-close" style="" @click="handleDelete(inds)"/>
                    </div>
                  </div>
                  <div class="addradio">
                    <el-button type="primary" size="mini" @click="handleAdd"><svg-icon icon-class="add"/> 新增单选框</el-button>
                  </div>
                </div>
                <div v-if="menu.name === '属性'" class="infotab" style="margin-top: -15px">
                  <div>
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      宽度:
                    </div>
                    <el-input v-model="substrateFindOptions[isActive].layout[isTabelActive].searchinput[isSearchActive].span" type="number" style="width: 135px" size="mini" @keyup.native="setfuzhu()"/>
                  </div>
                  <div v-if="substrateFindOptions[isActive].layout[isTabelActive].searchinput[isSearchActive].type === 'select'" style="margin-top: 15px">
                    <div style="padding-left: 10px;">下拉列表</div>
                    <div class="divcontdl">
                      <draggable
                        v-model="menu.children"
                        :options="dragOptions2"
                        :move="onMove"
                        class="list-groupsdl"
                        element="div"
                        @start="rightStart"
                        @end="rightEnd"
                        @change="getConditions"
                      >
                        <span v-if="menu.children.length === 0">请拖入下拉列表</span>
                        <div v-for="(items, index) in menu.children" :key="index" class="dlitem" style="margin-top: -8px;">
                          <div :title="items.name" class="divlc" style="width: 80px">{{ items.name }}</div>
                          <el-select v-if="items.type === 'duliang'" v-model="items.conditions" placeholder="条件" size="mini" class="setsele selectst" style="width: 44px;" @change="updateGL()">
                            <el-option
                              v-for="item in condLists"
                              :key="item.key"
                              :label="item.name"
                              :value="item.key"/>
                          </el-select>
                          <el-select v-if="items.type === 'weidu'" v-model="items.conditions" placeholder="条件" size="mini" class="setsele selectst" style="width: 44px;" @change="updateSearchGL()">
                            <el-option
                              v-for="item in condList"
                              :key="item.key"
                              :label="item.name"
                              :value="item.key"/>
                          </el-select>
                          <el-select v-if="items.type === 'weidu' && items.wedulist !== undefined" v-model="items.value" placeholder="值" size="mini" class="setsele selectst" style="width: 45px;" @change="updateSearchGL()">
                            <el-option
                              v-for="item in items.wedulist"
                              :key="item.key"
                              :label="item.name"
                              :value="item.key"/>
                          </el-select>
                          <el-input v-if="items.type === 'duliang'" v-model="items.value" type="text" class="setseles selectst" style="margin-left: 3px;width: 45px;" placeholder="值" @keyup.native="updateSearchGL()"/>
                        </div>
                      </draggable>
                    </div>
                  </div>
                  <div v-if="substrateFindOptions[isActive].layout[isTabelActive].searchinput[isSearchActive].type !== 'select'" style="margin-top: 15px">
                    <div style="padding-left: 10px;">关联数据</div>
                    <div class="divcontdl">
                      <draggable
                        v-model="menu.children"
                        :options="dragOptions2"
                        :move="onMove"
                        class="list-groupsdl"
                        element="div"
                        @start="rightStart"
                        @end="rightEnd"
                        @change="getConditions"
                      >
                        <span v-if="menu.children.length === 0">请拖入关联数据</span>
                        <div v-for="(items, index) in menu.children" :key="index" class="dlitem" style="margin-top: -8px;">
                          <div :title="items.name" class="divlc" style="width: 170px; text-align: center">{{ items.name }}</div>
                        </div>
                      </draggable>
                    </div>
                  </div>
                  <div v-if="substrateFindOptions[isActive].layout[isTabelActive].searchinput[isSearchActive].type === 'single'" style="margin-top: 15px">
                    <div style="padding-left: 10px;">参数值</div>
                    <div v-for="(menus, inds) in substrateFindOptions[isActive].layout[isTabelActive].searchinput[isSearchActive].list" :key="inds" style="margin-top:10px">
                      <div class="bg-cont csh" style="float: left;margin-top: 7px;margin-right: 10px;">
                        {{ substrateFindOptions[isActive].layout[isTabelActive].searchinput[isSearchActive].list[inds].text }}
                      </div>
                      <div style="text-align: right">
                        <el-input v-model="substrateFindOptions[isActive].layout[isTabelActive].searchinput[isSearchActive].list[inds].label" type="text" style="width: 100px" size="mini" @keyup.native="setfuzhu()"/>
                      </div>
                    </div>
                  </div>
                  <div v-if="substrateFindOptions[isActive].layout[isTabelActive].searchinput[isSearchActive].type === 'date' || substrateFindOptions[isActive].layout[isTabelActive].searchinput[isSearchActive].type === 'range'" style="margin-top: 15px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      格式:
                    </div>
                    <el-select v-model="substrateFindOptions[isActive].layout[isTabelActive].searchinput[isSearchActive].ts" placeholder="日期类型" style="width: 135px" size="mini" @change="setfuzhu()">
                      <el-option
                        v-for="item in dataLists"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"/>
                    </el-select>
                  </div>
                </div>
              </el-menu-item-group>
            </el-submenu>
          </div>
          <div v-if="substrateFindOptions[isActive].layout[isTabelActive].type === 'leida'">
            <el-submenu v-for="menu in leidaList" :index="menu.id" :key="menu.id" class="setback">
              <!--一级菜单名称、不可拖拽 -->
              <template slot="title">
                <span>{{ menu.name }}</span>
              </template>
              <!--一级菜单子菜单、可拖拽菜单-->
              <el-menu-item-group style="overflow:auto">
                <div v-if="menu.name === '数据'" class="infotab" style="margin-top: -15px">
                  <div style="padding-left: 10px;">X轴</div>
                  <div class="divcont">
                    <draggable
                      v-model="menu.childrenx"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groupsdl"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getlogbarwd"
                    >
                      <span v-if="menu.childrenx.length === 0">请拖入维度</span>
                      <div v-for="(items, index) in menu.childrenx" :key="index" class="dlitem">
                        <span :title="items.name">{{ items.name }}</span>
                        <el-select v-if="items.columnType.indexOf('time') > -1 || items.columnType.indexOf('date') > -1" v-model="items.key" placeholder="日期" size="mini" class="setsele selectst" style="float:right" @change="updateDL(index)">
                          <el-option
                            v-for="item in dataWDList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-button type="danger" size="mini" class="updateico" style="position: relative;color: #F56C6C;top:-2px" icon="el-icon-close" @click="deleteItemswd(index)"/>
                      </div>
                    </draggable>
                  </div>
                </div>
                <div v-if="menu.name === '数据'" class="infotab">
                  <div style="padding-left: 10px;">Y轴</div>
                  <div class="divcontdl">
                    <draggable
                      v-model="menu.childreny"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groupsdl"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getlogbardl"
                    >
                      <span v-if="menu.childreny.length === 0">请拖入度量</span>
                      <div v-for="(items, index) in menu.childreny" :key="index" class="dlitem">
                        <span :title="items.name">{{ items.name }}</span>
                        <el-select v-model="items.key" placeholder="函数" size="mini" style="width: 60px" class="setsele" @change="updateDL(index)">
                          <el-option
                            v-for="item in aggregateFunList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-button type="danger" size="mini" class="updateico" style="position: relative;color: #F56C6C;top:-2px" icon="el-icon-close" @click="deleteItems(index)"/>
                      </div>
                    </draggable>
                  </div>
                </div>
                <div v-if="menu.name === '过滤'" class="infotab" style="margin-top: -15px">
                  <div style="padding-left: 10px;">过滤条件</div>
                  <div class="divcontdl">
                    <draggable
                      v-model="menu.children"
                      :options="dragOptions2"
                      :move="onMove"
                      class="list-groupsdl"
                      element="div"
                      @start="rightStart"
                      @end="rightEnd"
                      @change="getConditions"
                    >
                      <span v-if="menu.children.length === 0">请拖入过滤条件</span>
                      <div v-for="(items, index) in menu.children" :key="index" class="dlitem">
                        <div :title="items.name" class="divlc" style="width: 58px">{{ items.name }}</div>
                        <el-select v-if="items.type === 'duliang'" v-model="items.conditions" placeholder="条件" size="mini" class="setsele selectst" style="width: 44px;" @change="updateGL()">
                          <el-option
                            v-for="item in condLists"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-select v-if="items.type === 'weidu'" v-model="items.conditions" placeholder="条件" size="mini" class="setsele selectst" style="width: 44px;" @change="updateGL()">
                          <el-option
                            v-for="item in condList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-select v-if="items.type === 'weidu' && items.wedulist !== undefined" v-model="items.value" placeholder="值" size="mini" class="setsele selectst" style="width: 40px;" @change="updateGL()">
                          <el-option
                            v-for="item in items.wedulist"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                        <el-input v-if="items.type === 'duliang'" v-model="items.value" type="text" class="setseles selectst" style="margin-left: 3px;width: 40px;" placeholder="值" @keyup.native="updateGL()"/>
                        <el-button type="danger" size="mini" class="updateico delst" style="padding-top: 3px;" icon="el-icon-close" @click="deleteTJ(index)"/>
                      </div>
                    </draggable>
                  </div>
                  <div>
                    <div class="bg-cont">
                      预览时是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].isSearch" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                </div>
                <div v-if="menu.name === '限制条数'" class="infotab" style="margin-top: -25px">
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      限制条数
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="pageSize" type="number" style="width: 100px" size="mini" @keyup.native="isshowpage()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '联动'" class="infotab" style="margin-top: -25px">
                  <div style="margin-top:10px">
                    <div style="text-align: center">
                      <el-select v-model="substrateFindOptions[isActive].layout[isTabelActive].ldList" placeholder="选择联动" size="mini" class="ldsty" style="width: 188px;" filterable multiple collapse-tags @change="setfuzhu()">
                        <el-option
                          v-for="item in ldList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"/>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '标题'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="substrateFindOptions[isActive].layout[isTabelActive].title.show" class="bg-set" style="margin-top:-15px" @change="setfuzhu()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      文本
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="substrateFindOptions[isActive].layout[isTabelActive].title.text" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].title.show" type="text" style="width: 135px" size="mini" @keyup.native="setfuzhu()"/>
                    </div>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      位置
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'left' ? 'iscat' : ''" title="居左" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('left')">
                          <svg-icon icon-class="fb_jz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'center' ? 'iscat' : ''" title="居中" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('center')">
                          <svg-icon icon-class="fb_spjz" class="icofons"/>
                        </el-button>
                        <el-button :class="substrateFindOptions[isActive].layout[isTabelActive].title.left === 'right' ? 'iscat' : ''" title="居右" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlect('right')">
                          <svg-icon icon-class="fb_jy" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div style="margin-top: 10px;margin-bottom: -10px;">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      字体
                    </div>
                    <div style="text-align: right">
                      <el-input v-model="substrateFindOptions[isActive].layout[isTabelActive].title.textStyle.fontSize" :disabled="!substrateFindOptions[isActive].layout[isTabelActive].title.show" type="text" style="width: 50px;position: relative;top: -8px;" size="mini" @keyup.native="setfuzhu()"/>
                      <el-color-picker v-model="substrateFindOptions[isActive].layout[isTabelActive].title.textStyle.color" class="bg-sets" style="margin-top: 0px;" @change="setfuzhu()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '图形'" class="infotab" style="margin-top: -25px">
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 5px;margin-right: 10px;">
                      图形样式：
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group style="padding-left: 20px">
                        <el-button :class="!lineFlag ? 'iscat' : ''" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitleleida(false)">圆形</el-button>
                        <el-button :class="lineFlag ? 'iscat' : ''" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitleleida(true)">多边</el-button>
                      </el-button-group>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '图例'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="legendShow" class="bg-set" style="margin-top:-15px" @change="setldtl()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      排列
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="legendTop === 'top' ? 'iscat' : ''" title="顶部" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitleld('top')">
                          <svg-icon icon-class="fb_dingb" class="icofons"/>
                        </el-button>
                        <el-button :class="legendTop === 'bottom' ? 'iscat' : ''" title="底部" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitleld('bottom')">
                          <svg-icon icon-class="fb_dib" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      位置
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group>
                        <el-button :class="legendLeft === 'left' ? 'iscat' : ''" title="居左" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelds('left')">
                          <svg-icon icon-class="fb_jz" class="icofons"/>
                        </el-button>
                        <el-button :class="legendLeft === 'center' ? 'iscat' : ''" title="居中" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelds('center')">
                          <svg-icon icon-class="fb_spjz" class="icofons"/>
                        </el-button>
                        <el-button :class="legendLeft === 'right' ? 'iscat' : ''" title="居右" class="btngroup" style="font-size: 14px" size="mini" type="primary" @click="settitlelds('right')">
                          <svg-icon icon-class="fb_jy" class="icofons"/>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                  <div v-for="(items, index) in substrateFindOptions[isActive].layout[isTabelActive].options" :key="index" style="margin-top: 10px;">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      图{{ index + 1 }}名称
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-input v-model="items.series.name" type="text" style="position: relative;width: 95px" size="mini" @keyup.native="setitem()"/>
                      <!-- <el-color-picker v-model="items.series[0].itemStyle.color" class="bg-sets" style="margin-top: 0px;" @change="setitem()"/> -->
                    </div>
                  </div>
                  <div v-for="(csitems, csindex) in substrateFindOptions[isActive].layout[isTabelActive].options[0].radar.indicator" :key="csitems.name + csindex" style="margin-top: 10px;">
                    <div class="bg-cont" style="float: left;margin-top: 7px;margin-right: 10px;">
                      顶点名称
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-input v-model="csitems.name" type="text" style="position: relative;width: 95px" size="mini" @keyup.native="setDdisng()"/>
                    </div>
                    <el-tooltip :content="csitems.name + '最大值'" effect="dark" placement="top" style="margin-top: 10px;">
                      <div class="bg-cont steisw">
                        {{ csitems.name }}最大值
                      </div>
                    </el-tooltip>
                    <div style="padding-top: 3px;text-align: right">
                      <el-input v-model="csitems.max" type="text" style="position: relative;width: 95px" size="mini" @keyup.native="setDdisng()"/>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '提示'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      是否显示：
                    </div>
                    <el-checkbox v-model="tooltipShow" class="bg-set" style="margin-top:-15px" @change="setldtlst()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 5px;margin-right: 10px;">
                      显示方式：
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group style="padding-left: 20px">
                        <el-button :class="tooltipTriggerOn === 'click' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitletip('click')">点击</el-button>
                        <el-button :class="tooltipTriggerOn === 'mousemove' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitletip('mousemove')">滑动</el-button>
                      </el-button-group>
                    </div>
                  </div>
                </div>
                <div v-if="menu.name === '格式'" class="infotab" style="margin-top: -25px">
                  <div>
                    <div class="bg-cont">
                      数据标签：
                    </div>
                    <el-checkbox v-model="dataIsShow" class="bg-set" style="margin-top:-15px" @change="setDataiSld()"/>
                  </div>
                  <div style="margin-top:10px">
                    <div class="bg-cont" style="float: left;margin-top: 5px;margin-right: 10px;">
                      显示方式：
                    </div>
                    <div style="padding-top: 3px;text-align: right">
                      <el-button-group style="padding-left: 20px">
                        <el-button :class="dataposition === 'inside' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitledat('inside')">内部</el-button>
                        <el-button :class="dataposition === 'top' ? 'iscat' : ''" class="btngroup" style="font-size: 12px" size="mini" type="primary" @click="settitledat('top')">外部</el-button>
                      </el-button-group>
                    </div>
                  </div>
                </div>
              </el-menu-item-group>
            </el-submenu>
          </div>
        </el-menu>
      </el-col>
      <el-col id="conentid" :span="16" class="autoheight contbord">
        <div class="titles">
          <span style="margin-left: 15px">
            <span v-if="!isEditpage">{{ pageTitle }}</span>
            <el-input v-if="isEditpage" v-model="pageTitle" type="text" style="width: 150px" size="mini"/>
            <el-button v-if="!isEditpage" icon="el-icon-edit" class="updateico" style="font-size: 14px" size="mini" type="primary" @click="settitle()"/>
            <el-button v-if="isEditpage" icon="el-icon-check" class="updateico" style="font-size: 14px" size="mini" type="primary" @click="updatetitle()"/>
          </span>
          <div style="float: right;margin-right: 15px;padding-top: 3px;">
            <el-tooltip effect="dark" content="保存" placement="top">
              <el-button class="updateico" title="保存" style="font-size: 18px;" size="mini" type="primary" @click="updateSuccess()">
                <svg-icon icon-class="baocun" class="icofon" style="margin-right: 5px"/>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="撤销" placement="top">
              <el-button :disabled="historyIndex < 1" :class="historyIndex < 1 ? 'disse' : ''" class="updateico" title="撤销" style="font-size: 18px;margin-left: 0px;" size="mini" type="primary" @click="goBack()">
                <svg-icon icon-class="chexiao" class="icofon" style="margin-right: 5px"/>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="恢复" placement="top">
              <el-button :disabled="historyIndex === -1 || historyIndex === historyList.length - 1" :class="historyIndex === -1 || historyIndex === historyList.length - 1 ? 'disse' : ''" class="updateico" title="恢复" style="font-size: 18px;margin-left: 0px;" size="mini" type="primary" @click="goForward()">
                <svg-icon icon-class="huifu" class="icofon" style="margin-right: 5px"/>
              </el-button>
            </el-tooltip>
            <el-dropdown trigger="click" class="dosnw" @command="picClick">
              <el-tooltip effect="dark" content="图表" placement="top">
                <el-button class="updateico" title="图表" style="font-size: 18px" size="mini" type="primary">
                  <svg-icon icon-class="biaobiaoxx" class="icofon" style="margin-right: 5px"/>
                </el-button>
              </el-tooltip>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <svg-icon icon-class="zhuzt" class="icofon" style="font-size: 16px;"/>柱状图
                </el-dropdown-item>
                <el-dropdown-item>
                  <svg-icon icon-class="bingtu" class="icofon" style="font-size: 16px;"/>饼图
                </el-dropdown-item>
                <el-dropdown-item>
                  <svg-icon icon-class="zhexiant" class="icofon" style="font-size: 16px;"/>折线图
                </el-dropdown-item>
                <el-dropdown-item>
                  <svg-icon icon-class="tiaoxt" class="icofon" style="font-size: 16px;"/>条形图
                </el-dropdown-item>
                <el-dropdown-item>
                  <svg-icon icon-class="sandiant" class="icofon" style="font-size: 16px;"/>散点图
                </el-dropdown-item>
                <el-dropdown-item>
                  <svg-icon icon-class="duidiet" class="icofon" style="font-size: 16px;"/>堆叠图
                </el-dropdown-item>
                <el-dropdown-item>
                  <svg-icon icon-class="loudout" class="icofon" style="font-size: 16px;"/>漏斗图
                </el-dropdown-item>
                <el-dropdown-item>
                  <svg-icon icon-class="zuhetu" class="icofon" style="font-size: 16px;"/>雷达图
                </el-dropdown-item>
                <el-dropdown-item>
                  <svg-icon icon-class="zuhetu" class="icofon" style="font-size: 16px;"/>组合图
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown trigger="click" class="dosnw" @command="tableClick">
              <el-tooltip effect="dark" content="报表" placement="top">
                <el-button class="updateico" title="报表" style="font-size: 18px" size="mini" type="primary">
                  <svg-icon icon-class="tablexx" class="icofon" style="margin-right: 5px"/>
                </el-button>
              </el-tooltip>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <svg-icon icon-class="pttables" class="icofon" style="font-size: 16px;"/>普通表
                </el-dropdown-item>
                <el-dropdown-item>
                  <svg-icon icon-class="toustable" class="icofon" style="font-size: 16px;"/>透视表
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown trigger="click" class="dosnw" @command="filterClick">
              <el-tooltip effect="dark" content="全局过滤条件" placement="top">
                <el-button class="updateico" title="全局过滤条件" style="font-size: 18px" size="mini" type="primary">
                  <svg-icon icon-class="shauixuan" class="icofon" style="margin-right: 5px"/>
                </el-button>
              </el-tooltip>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <svg-icon icon-class="wenbenk" class="icofon" style="font-size: 16px;"/>文本框
                </el-dropdown-item>
                <el-dropdown-item>
                  <svg-icon icon-class="xialak" class="icofon" style="font-size: 16px;"/>下拉框
                </el-dropdown-item>
                <el-dropdown-item>
                  <svg-icon icon-class="rilixx" class="icofon" style="font-size: 16px;"/>日期
                </el-dropdown-item>
                <el-dropdown-item>
                  <svg-icon icon-class="rilifanw" class="icofon" style="font-size: 16px;"/>时间范围
                </el-dropdown-item>
                <el-dropdown-item>
                  <svg-icon icon-class="danxuank" class="icofon" style="font-size: 16px;"/>单选框
                </el-dropdown-item>
                <el-dropdown-item>
                  <svg-icon icon-class="duoxuank" class="icofon" style="font-size: 16px;"/>多选框
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-tooltip effect="dark" content="预览" placement="top">
              <el-button class="updateico" title="预览" style="font-size: 18px" size="mini" type="primary" @click="view()">
                <svg-icon icon-class="chaxun" class="icofon" style="margin-right: 5px"/>
              </el-button>
            </el-tooltip>
          </div>
        </div>
        <div style="padding-left: 10px;padding-right: 10px">
          <div class="table-top-btn-group">
            <div
              v-for="(item, index) in substrateFindOptions"
              :key="item.id"
              :class="{ 'active': isActive === index, 'esits': item.isEdit }"
              class="gettab"
              @click="navClick(index)"
            >
              <span v-if="!item.isEdit">{{ item.name }}</span>
              <el-input v-if="item.isEdit" :id="'intpu' + index" v-model="item.name" style="width:80px" type="text" size="mini" autofocus="autofocus" @blur="updatetitles(index)"/>
              <el-dropdown trigger="click" class="dosnw sdd" @command="editClick">
                <el-button icon="el-icon-more" class="updateico tran" style="font-size: 12px" size="mini" type="primary"/>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="!item.isEdit">
                    <i :id="'update' + index" class="el-icon-edit"/> 编辑
                  </el-dropdown-item>
                  <el-dropdown-item v-if="!item.isEdit && substrateFindOptions.length > 1">
                    <i :id="'delete' + index" class="el-icon-close"/> 删除
                  </el-dropdown-item>
                  <el-dropdown-item v-if="item.isEdit">
                    <i :id="'save' + index" class="el-icon-check"/> 保存
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <el-button type="danger" class="btnadd" icon="el-icon-plus" size="mini" @click="addPage()"/>
          </div>
        </div>
        <div v-if="clientWidth !== 0" :style="{ background: substrateFindOptions[isActive].background, backgroundImage: substrateFindOptions[isActive].isAuxiliary ? 'linear-gradient(90deg, rgba(0, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%), linear-gradient(rgba(0, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%)' : '', backgroundSize: substrateFindOptions[isActive].isAuxiliary ? '10px 10px' : '' }" class="contdrag">
          <grid-layout
            v-if="!isview"
            :layout.sync="substrateFindOptions[isActive].layout"
            :col-num="24"
            :is-draggable="true"
            :is-resizable="true"
            :vertical-compact="false"
            :use-css-transforms="true"
            :row-height="32"
          >
            <grid-item
              v-for="(item, index) in substrateFindOptions[isActive].layout"
              :key="index"
              :static="item.static"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
              :class="isTabelActive === index ? 'getbord' : ''"
              class="echarts_box"
              @resize="resizeEvents"
              @resized="resizedEvent"
              @moved="setfuzhu"
            >
              <div v-show="substrateFindOptions[isActive].layout[index].title.show" :style="{ color: substrateFindOptions[isActive].layout[index].title.textStyle.color,fontSize: substrateFindOptions[isActive].layout[index].title.textStyle.fontSize + 'px', textAlign: substrateFindOptions[isActive].layout[index].title.left }" style="padding-right: 20px;width: 100%;position:absolute;top:10px;left:10px" @click="getinfo(item, index)">{{ substrateFindOptions[isActive].layout[index].title.text }}</div>
              <el-tooltip effect="dark" content="是否静止" placement="top">
                <el-switch v-model="item.static" size="mini" active-color="#009494" class="issatsi"/>
              </el-tooltip>
              <el-button type="danger" size="mini" class="updateico deletebtn" icon="el-icon-close" style="" @click="deleteItem(index)"/>
              <div v-if="!item.isError" :style="{ height: ((32 * item.h) + 30) + 'px',width: '100%', paddingTop: (item.type === 'search') ? '15px' : '30px' }" style="padding-left:10px;padding-right:10px" @click="getinfo(item, index)">
                <chart v-loading="listLoading" v-if="item.type === 'bar' || item.type === 'zuhe' || item.type === 'loudou' || item.type === 'duidie' || item.type === 'line' || item.type === 'pie' || item.type === 'tiao' || item.type === 'scatter'" :id="item.type + item.i" :options="item.options" :style="{ height: 32 * item.h + 'px', width: (clientWidth / 24 * item.w) + 'px' }" @chartAllClick="chartAllClick"/>
                <el-table
                  v-loading="listLoading"
                  v-if="item.type === 'table'"
                  :data="item.options.list"
                  class="tablesty"
                  height="calc(100% - 10px)"
                  border
                  fit
                  @current-change="getinfo(item, index)"
                  @header-click="getinfo(item, index)">
                  <el-table-column v-for="(item, index) in item.options.title" :key="index" :prop="item.key" :label="item.keyname" :width="item.width" align="center"/>
                </el-table>
                <el-pagination
                  v-if="item.type === 'table' && substrateFindOptions[isActive].layout[index].pageInfo.show"
                  :current-page="substrateFindOptions[isActive].layout[index].pageInfo.pageNum"
                  :page-size="substrateFindOptions[isActive].layout[index].pageInfo.pageSize"
                  :total="substrateFindOptions[isActive].layout[index].pageInfo.totalPage"
                  :page-sizes="[substrateFindOptions[isActive].layout[index].pageInfo.pageSize]"
                  class="pagination"
                  layout="total, prev, pager, next, jumper"
                  @size-change="sizeChange"
                  @current-change="currentChange"
                />
                <div v-if="item.type === 'search'" :style="{ height: (32 * item.h) + 'px',width: '100%' }">
                  <draggable
                    v-model="item.searchinput"
                    :options="dragOptions1"
                    :move="onMove"
                    class="list-group list-groupx"
                    @start="isDragging = true"
                    @end="isDragging = false">
                    <div v-for="(itemse, indexs) in item.searchinput" :key="indexs" :class="isSearchActive === indexs ? 'getbord' : ''" :style="{width: itemse.span + 'px'}" class="searchov">
                      <div v-if="itemse.type === 'input'" class="searchlef" @click="getSearchActive(indexs, itemse.type)">
                        <div class="textclass">{{ itemse.text }}</div>
                        <el-input v-model="itemse['input' + indexs]" type="text" size="mini" style="margin-left: 10px;margin-right: 10px;width: 58%;" placeholder="值"/>
                      </div>
                      <div v-if="itemse.type === 'select'" class="searchlef" @click="getSearchActive(indexs, itemse.type)">
                        <div class="textclass">{{ itemse.text }}</div>
                        <el-select v-model="itemse['select' + indexs]" placeholder="值" size="mini" style="margin-left: 10px;margin-right: 10px;width: 58%;">
                          <el-option
                            v-for="item in itemse.searchList"
                            :key="item.key"
                            :label="item.name"
                            :value="item.key"/>
                        </el-select>
                      </div>
                      <div v-if="itemse.type === 'date'" class="searchlef" @click="getSearchActive(indexs, itemse.type)">
                        <div class="textclass">{{ itemse.text }}</div>
                        <el-date-picker v-if="itemse.ts === 'week'" v-model="itemse['date' + indexs]" :editable="false" :type="itemse.ts" size="mini" style="margin-left: 10px;margin-right: 10px;width: 58%;min-width: 130px;" placeholder="日期" format="yyyy第WW周"/>
                        <el-date-picker v-if="itemse.ts !== 'week'" v-model="itemse['date' + indexs]" :editable="false" :type="itemse.ts" size="mini" style="margin-left: 10px;margin-right: 10px;width: 58%;min-width: 130px;" placeholder="日期" value-format="yyyy-MM-dd"/>
                      </div>
                      <div v-if="itemse.type === 'range'" class="searchlef" @click="getSearchActive(indexs, itemse.type)">
                        <div class="textclass">{{ itemse.text }}</div>
                        <el-date-picker v-if="itemse.ts === 'week'" v-model="itemse['start' + indexs]" :editable="false" :type="itemse.ts" size="mini" class="fwsty" style="margin-left:10px" placeholder="起始" format="yyyy第WW周"/>
                        <el-date-picker v-if="itemse.ts !== 'week'" v-model="itemse['start' + indexs]" :editable="false" :type="itemse.ts" size="mini" class="fwsty" style="margin-left:10px" placeholder="起始" value-format="yyyy-MM-dd"/>
                        <span> ~ </span>
                        <el-date-picker v-if="itemse.ts === 'week'" v-model="itemse['end' + indexs]" :editable="false" :type="itemse.ts" size="mini" class="fwsty" style="margin-right:10px" placeholder="结束" format="yyyy第WW周"/>
                        <el-date-picker v-if="itemse.ts !== 'week'" v-model="itemse['end' + indexs]" :editable="false" :type="itemse.ts" size="mini" class="fwsty" style="margin-right:10px" placeholder="结束" value-format="yyyy-MM-dd"/>
                      </div>
                      <div v-if="itemse.type === 'single'" class="searchlef" @click="getSearchActive(indexs, itemse.type)">
                        <div class="radoix">
                          <el-radio v-for="(radoi, radinx) in itemse.list" :key="radinx" :label="radoi.label" v-model="itemse['radio' + indexs]">{{ radoi.text }}</el-radio>
                        </div>
                      </div>
                      <div v-if="itemse.type === 'checks'" class="searchlef" @click="getSearchActive(indexs, itemse.type)">
                        <div class="checkx">
                          <el-checkbox v-model="itemse['check' + indexs]">{{ itemse.text }}</el-checkbox>
                        </div>
                      </div>
                      <el-button type="danger" size="mini" class="updateico deletebtncheck" icon="el-icon-close" @click="deleteSearch(index, indexs)"/>
                    </div>
                  </draggable>
                  <el-button type="primary" class="searchbut" size="mini" @click="searchByFilter('edit')">查询</el-button>
                </div>
                <div v-loading="listLoading" v-if="item.type === 'tstab'" :id="item.type + item.i" :style="{ height: ((32 * item.h) + 40) + 'px', width: (clientWidth / 12 * item.w) + 'px' }" class="rulte">
                  &nbsp;
                </div>
                <div v-if="item.type === 'leida'" :style="{ height: ((32 * item.h) + 30) + 'px',width: '100%'}" style="overflow: auto">
                  <chart v-loading="listLoading" v-for="(itemlieda, leidaindex) in item.options" :key="leidaindex" :id="item.type + item.i + leidaindex" :options="itemlieda" :style="{ height: ((32 * item.h) + 30) + 'px', width:((32 * item.h) + 60) + 'px' }" style="float: left"/>
                </div>
              </div>
              <div v-if="item.isError" :style="{ height: ((32 * item.h) + 30) + 'px',width: '100%' }" style="padding-top: 30px;padding-left:10px;padding-right:10px" @click="getinfo(item, index)">
                <svg-icon icon-class="wfhzt" class="icofon" style="margin-right: 10px;color: #ccc;width: 100%;height: calc(100% - 50px);"/>
                <div style="width:100%;text-align:center;color:#999;margin-top: 10px">数据错误，无法展示!</div>
              </div>
            </grid-item>
          </grid-layout>
        </div>
      </el-col>
    </el-row>
    <views :row="substrateFindOptions" :client-width="clientWidth" :screen-width="screenWidth" :show-dia-log="showDiaLog" @dialogFalse="dialogFalse"/>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="showtableDiaLog"
      title="添加数据表"
      width="400px"
      class="sts">
      <el-row style="margin-top: -15px;padding: 10px">
        <el-col :span="24" style="margin-bottom: 15px;margin-top: -10px;">
          <el-select v-model="resid" placeholder="选择数据表" size="small" style="width: 340px;" @change="getTablist()">
            <el-option
              v-for="item in resList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-col>
        <el-col :span="24">
          <el-table
            :data="retablist"
            style="width: 100%;"
            max-height="300px"
            border
            fit
            @selection-change="handleSelect"
          >
            <el-table-column type="selection" align="center" width="55"/>
            <el-table-column label="表名称" align="center" prop="tableName"/>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer" style="margin-top: -20px;text-align: right;width: 100%;padding-right: 10px;">
        <el-button type="primary" size="small" @click="confirms()">确 定</el-button>
        <el-button type="default" size="small" @click="showtableDiaLog = false">取 消</el-button>
      </div>
    </el-dialog>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
@import url(index.css);
</style>
