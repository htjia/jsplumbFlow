<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="showDiaLogs"
    title="预览"
    width="100vw"
    style="overflow-x: hidden;"
    class="viewsh"
    @close="closeDialog()">
    <div style="width: 100%; padding-left: 10px; padding-right: 10px;">
      <div v-if="viewList.length > 1" class="table-top-btn-group" style="margin-top: 10px">
        <div
          v-for="(item, index) in viewList"
          :key="item.id"
          :class="{ 'active': isActives === index }"
          class="gettab"
          style="width: 80px;text-align:center"
          @click="navClicks(index)"
        >
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
    <div v-if="showDiaLogs" :style="{ background: viewList[isActives].background}" class="viewss">
      <grid-layout
        v-if="!isview"
        :layout.sync="viewList[isActives].layout"
        :col-num="24"
        :is-draggable="false"
        :is-resizable="false"
        :vertical-compact="false"
        :use-css-transforms="true"
        :row-height="32"
      >
        <grid-item
          v-for="(item, index) in viewList[isActives].layout"
          :key="index"
          :static="item.static"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          class="echarts_boxs"
        >
          <div v-show="viewList[isActives].layout[index].title.show" :style="{ color: viewList[isActives].layout[index].title.textStyle.color,fontSize: viewList[isActives].layout[index].title.textStyle.fontSize + 'px', textAlign: viewList[isActives].layout[index].title.left }" style="padding-right: 20px;width: 100%;position:absolute;top:10px;left:10px">{{ viewList[isActives].layout[index].title.text }}</div>
          <div style="position: absolute;top: 10px;right: 10px;z-index: 999;">
            <el-tooltip effect="dark" content="过滤条件" placement="top">
              <el-dropdown v-if="item.isSearch" :hide-on-click="false" trigger="click" class="dosnw" style="float:right;" @visible-change="getinfo(item, index)">
                <el-button type="danger" size="mini" class="updateico" style="display: block;color: #009494 !important; font-size: 16px">
                  <svg-icon icon-class="shauixuan"/>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(items, index) in item.condList" :key="index" class="dlitem" style="width: 180px;padding-left: 10px;padding-right: 10px;">
                    <div :title="items.name" class="divlc" style="width: 60px">{{ items.name }}</div>
                    <el-select v-if="items.type === 'duliang'" v-model="items.conditions" placeholder="条件" size="mini" class="setsele" style="width: 44px;" @change="updateGLs()">
                      <el-option
                        v-for="item in condLists"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"/>
                    </el-select>
                    <el-select v-if="items.type === 'weidu'" v-model="items.conditions" placeholder="条件" size="mini" class="setsele" style="width: 44px;" @change="updateGLs()">
                      <el-option
                        v-for="item in condList"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"/>
                    </el-select>
                    <el-select v-if="items.type === 'weidu' && items.wedulist !== undefined" v-model="items.value" placeholder="值" size="mini" class="setsele" style="width: 44px;" @change="updateGLs()">
                      <el-option
                        v-for="item in items.wedulist"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"/>
                    </el-select>
                    <el-input v-if="items.type === 'duliang'" v-model="items.value" type="text" class="setseles" style="margin-left: 3px;width: 44px;" placeholder="值" @keyup.native="updateGLs()"/>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-tooltip>
            <el-tooltip effect="dark" content="还原联动" placement="top">
              <el-button v-if="item.ldList !== undefined && item.ldList.length > 0" type="danger" size="mini" class="updateico" style="float:right;margin-right: 8px;display: block;color: #009494 !important; font-size: 16px" @click="resetLD(index)">
                <svg-icon icon-class="quxiaold"/>
              </el-button>
            </el-tooltip>
          </div>
          <div v-if="!item.isError" :style="{ height: ((32 * item.h) + 20) + 'px',width: (screenWidth / 24 * item.w) + 'px' }" style="padding-top:5px" @click="getinfo(item, index)">
            <chart v-loading="listLoading" v-if="item.type === 'bar' || item.type === 'zuhe' || item.type === 'loudou' || item.type === 'duidie' || item.type === 'line' || item.type === 'pie' || item.type === 'tiao' || item.type === 'scatter'" :id="item.type + item.i + 'x'" :options="item.options" :style="{ height: ((32 * item.h) + 30) + 'px', width: (screenWidth / 24 * item.w) + 'px' }" style="padding: 10px" @chartAllClick="chartAllClick"/>
            <el-table
              v-loading="listLoading"
              v-if="item.type === 'table'"
              :data="item.options.list"
              :id="item.type + item.i + 'x'"
              row-key="index"
              class="tablesty"
              style="margin-top:20px;"
              height="calc(100% - 20px)"
              border
              fit>
              <el-table-column v-for="(item, index) in item.options.title" :key="index" :prop="item.key" :label="item.keyname" :width="item.width" align="center"/>
            </el-table>
            <el-pagination
              v-if="item.type === 'table' && viewList[isActives].layout[index].pageInfo.show"
              :current-page="viewList[isActives].layout[index].pageInfo.pageNum"
              :page-size="parseInt(viewList[isActives].layout[index].pageInfo.pageSize + '')"
              :total="viewList[isActives].layout[index].pageInfo.totalPage"
              :page-sizes="[viewList[isActives].layout[index].pageInfo.pageSize]"
              class="pagination"
              layout="total, prev, pager, next, jumper"
              @size-change="sizeChange"
              @current-change="currentChange"
            />
            <div v-if="item.type === 'search'" :style="{ height: (32 * item.h) + 'px',width: '100%' }">
              <div v-for="(itemse, indexs) in item.searchinput" :key="indexs" :style="{width: itemse.span + 'px'}" class="searchovs">
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
              </div>
              <el-button type="primary" class="searchbut" size="mini" @click="searchByFilter('view')">查询</el-button>
            </div>
            <div v-loading="listLoading" v-if="item.type === 'tstab'" :id="item.type + item.i + 'x'" :style="{ height: 32 * item.h + 'px', width: (clientWidth / 12 * item.w) + 'px' }" class="rulte" style="padding-top:20px;">
              &nbsp;
            </div>
            <div v-if="item.type === 'leida'" :style="{ height: ((32 * item.h) + 30) + 'px',width: '100%'}" style="overflow: auto">
              <chart v-loading="listLoading" v-for="(itemlieda, leidaindex) in item.options" :key="leidaindex" :id="item.type + item.i + leidaindex + 'x'" :options="itemlieda" :style="{ height: ((32 * item.h) + 30) + 'px', width:((32 * item.h) + 60) + 'px' }" style="float: left"/>
            </div>
          </div>
          <div v-if="item.isError" :style="{ height: ((32 * item.h) + 20) + 'px',width: '100%' }" style="padding-top: 30px;padding-left:10px;padding-right:10px" @click="getinfo(item, index)">
            <svg-icon icon-class="wfhzt" class="icofon" style="margin-right: 10px;color: #ccc;width: 100%;height: calc(100% - 50px);"/>
            <div style="width:100%;text-align:center;color:#999;margin-top: 10px">数据错误，无法展示!</div>
          </div>
        </grid-item>
      </grid-layout>
    </div>
  </el-dialog>
</template>
<script src="./view.js"></script>

<style scoped>
@import url(index.css);
</style>
