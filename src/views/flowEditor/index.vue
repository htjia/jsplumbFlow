<template>
  <PageHeaderLayout :has_back="true" :has_refresh="true" :has_save="true">
    <!--<el-dialog-->
    <!--:close-on-click-modal="false"-->
    <!--:visible.sync="addDialogVisible"-->
    <!--class="flow-dialog"-->
    <!--title="流程绘制"-->
    <!--fullscreen-->
    <!--@close="closeDialog"-->
    <!--&gt;-->
    <!--</el-dialog>-->
    <div v-if="easyFlowVisible">
      <div class="body-container">
        <!--左侧可以拖动的菜单-->
        <div ref="nodeMenu" :span="4" class="node-menu">
          <node-menu :is-kmeans="isKmeans" @addNode="addNode"/>
        </div>
        <div v-loading="runLoading" element-loading-text="正在运行中，请稍后..." class="right-container">
          <div class="flowContainerBox">
            <div id="flowContainer" ref="flowContainer" class="container">
              <template v-for="node in data.nodeList">
                <flow-node
                  v-show="node.show"
                  :id="node.id"
                  :node="node"
                  :key="node.id"
                  @deleteNode="deleteNode"
                  @editNode="editNode"
                  @changeNodeSite="changeNodeSite"
                  @nodeRightMenu="nodeRightMenu"
                  @clickNode="clickNode"/>
              </template>
            </div>
          </div>
        </div>
        <div class="log-container">
          <span :class="{'active-log': logActive === 1}" class="log-tabs" style="margin-left: 10px" @click="tabClick(1)"><svg-icon icon-class="rwrz" style="font-size: 15px"/> 日志</span>
          <span :class="{'active-log': logActive === 2}" class="log-tabs" @click="tabClick(2)"> 总览</span>
          <div v-if="showLog" class="handle-btn" @click="setShowLog"><i class="el-icon-caret-bottom"/> 关闭</div>
          <div v-if="!showLog" class="handle-btn" @click="setShowLog"><i class="el-icon-caret-top"/> 展开</div>
          <div v-if="showLog && logActive === 1" id="logContainer" class="log-content">
            <div v-for="(item, index) in logMessage" :key="index">
              <span style="display: inline-block;width: 5px;height: 5px;background: #6a939c;border-radius: 50%;margin-right: 5px"/>
              <span v-text="item"/>
            </div>
          </div>
          <div v-if="showLog && logActive === 2" class="log-content">
            <div v-if="table === '1'">
              <div style="height: 100%;width: 300px;float: left;">
                <chart :options="options" width="300px" height="100%"/>
              </div>
              <div style="height: 285px;margin-left: 320px;">
                <el-table
                  :data="logTableList"
                  style="margin-top: 5px"
                  height="280"
                  element-loading-text="拼命加载中"
                  border
                  fit
                >
                  <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item" :prop="item" align="center"/>
                </el-table>
              </div>
            </div>
            <el-table
              v-if="table !== '1'"
              :data="logTableList"
              style="margin-top: 5px"
              height="280"
              element-loading-text="拼命加载中"
              border
              fit
            >
              <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item" :prop="item" align="center" show-overflow-tooltip/>
            </el-table>
          </div>
        </div>
      </div>
      <flow-node-form1 ref="nodeForm1" :edit-dialog-visible="editDialogVisible" @tableChange="tableChange" @dialogClose="dialogClose"/>
      <flow-node-form2 ref="nodeForm2" :edit-dialog-visible="editDialogVisible2" @dialogClose="dialogClose"/>
      <flow-node-form3 ref="nodeForm3" :edit-dialog-visible="editDialogVisible3" @dialogClose="dialogClose"/>
      <flow-node-form4 ref="nodeForm4" :edit-dialog-visible="editDialogVisible4" @dialogClose="dialogClose"/>
      <flow-node-form5 ref="nodeForm5" :edit-dialog-visible="editDialogVisible5" @dialogClose="dialogClose"/>
      <flow-node-form6 ref="nodeForm6" :edit-dialog-visible="editDialogVisible6" @dialogClose="dialogClose"/>
      <clean-form7 ref="cleanForm1_7" :edit-dialog-visible="editDialogCleanForm7" @dialogClose="dialogClose"/>
      <clean-form8 ref="cleanForm1_8" :edit-dialog-visible="editDialogCleanForm8" @dialogClose="dialogClose"/>
      <clean-form9 ref="cleanForm1_9" :edit-dialog-visible="editDialogCleanForm9" @dialogClose="dialogClose"/>
      <clean-form10 ref="cleanForm1_10" :edit-dialog-visible="editDialogCleanForm10" @dialogClose="dialogClose"/>
      <flow-node-form7 ref="nodeForm7" :edit-dialog-visible="editDialogVisible7" @dialogClose="dialogClose"/>
      <flow-node-form8 ref="nodeForm8" :edit-dialog-visible="editDialogVisible8" :table="table" @dialogClose="dialogClose"/>
      <flow-node-form9 ref="nodeForm9" :edit-dialog-visible="editDialogVisible9" :table="table" @dialogClose="dialogClose"/>
      <flow-node-form10 ref="nodeForm10" :edit-dialog-visible="editDialogVisible10" :table="table" @dialogClose="dialogClose"/>
      <flow-node-form11 ref="nodeForm11" :edit-dialog-visible="editDialogVisible11" :table="table" @dialogClose="dialogClose"/>
      <flow-node-form12 ref="nodeForm12" :edit-dialog-visible="editDialogVisible12" :table="table" @dialogClose="dialogClose"/>
      <flow-node-form13 ref="nodeForm13" :edit-dialog-visible="editDialogVisible13" :table="table" @dialogClose="dialogClose"/>
      <flow-node-form14 ref="nodeForm14" :edit-dialog-visible="editDialogVisible14" :table="table" @dialogClose="dialogClose"/>
      <flow-node-form15 ref="nodeForm15" :edit-dialog-visible="editDialogVisible15" :table="table" :add-table-name="tableName" :is-change="isChange" @dialogClose="dialogClose"/>
      <!-- 流程数据详情 -->
      <!--<flow-info v-if="flowInfoVisible" ref="flowInfo" :data="data"></flow-info>-->
    </div>
  </PageHeaderLayout>
</template>

<script src="./siteManage.js"></script>

<style scoped>
  .flow-dialog>>> .el-dialog__body{
    padding: 0;
  }
  .body-container>>> .el-loading-spinner {
    top: 30%;
  }
</style>
<style>
  .body-container{
    height: calc(100vh - 127px);
    position: relative;
  }
  .log-tabs{
    padding: 0px 15px;
    display: inline-block;
    line-height: 28px;
    height: 28px;
    background: #bac1ca;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    vertical-align: bottom;
    cursor: pointer;
  }
  .log-tabs.active-log{
    background: #fff;
  }
  .right-container{
    margin-left: 209px;
  }
  .log-container{
    position: absolute;
    bottom: 0;
    left: 0;
    line-height: 35px;
    background: #d6dde6;
    width: 100%;
    border: 1px solid #aec3c3;
    z-index: 2000;
  }
  .handle-btn{
    float: right;
    height: 35px;
    line-height: 35px;
    cursor: pointer;
    margin-right: 10px;
  }
  .log-content{
    height: 300px;
    background: #fff;
    padding: 5px 10px;
    line-height: 25px;
    overflow: auto;
  }
  .flowContainerBox{
    background-size: 10px 10px;
    height: calc(100vh - 165px);
    background-color: #fff;
    /*background-color: #fff;*/
    position: relative;
    overflow: auto;
  }
  #flowContainer {
    /*background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%), linear-gradient(rgba(0, 0, 0, 0.15) 10%, rgba(0, 0, 0, 0) 10%);*/
    background-size: 10px 10px;
    height: calc(100vh - 165px);
    background-color: #fff;
    /*background-color: #fff;*/
    position: relative;
    overflow: auto;
  }
  #flowContainer::-webkit-scrollbar {/*滚动条整体样式*/
    width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 10px;
    -webkit-appearance: none;
  }
  .node-menu{
    float: left;
    width: 200px;
    overflow: auto;
    height: calc(100vh - 165px);
    background: #fff;
    border-right: 1px solid #ddd;
  }
  .labelClass {
    background-color: white;
    padding: 5px;
    opacity: 1;
    border: 1px solid #346789;
    /*border-radius: 10px;*/
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .flow-tooltar {
    padding-left: 10px;
    box-sizing: border-box;
    border: 1px solid #e9e9e9;
    height: 42px;
    line-height: 42px;
    z-index: 3;
    -webkit-box-shadow: 0 8px 12px 0 rgba(0, 52, 107, .04);
    box-shadow: 0 8px 12px 0 rgba(0, 52, 107, .04);
  }
</style>
