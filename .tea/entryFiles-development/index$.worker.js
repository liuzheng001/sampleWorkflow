if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');


  var AFAppX = self.AFAppX.getAppContext
    ? self.AFAppX.getAppContext().AFAppX
    : self.AFAppX;
  self.getCurrentPages = AFAppX.getCurrentPages;
  self.getApp = AFAppX.getApp;
  self.Page = AFAppX.Page;
  self.App = AFAppX.App;
  self.my = AFAppX.bridge || AFAppX.abridge;
  self.abridge = self.my;
  self.Component = AFAppX.WorkerComponent || function(){};
  self.$global = AFAppX.$global;
  self.requirePlugin = AFAppX.requirePlugin;
          

if(AFAppX.registerApp) {
  AFAppX.registerApp({
    appJSON: appXAppJson,
  });
}



function success() {
require('../../app');
require('../../components/commonmodal/commonmodal?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../page/index/index?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/trialRecord/trialRecordList/trialRecordList?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/trialRecord/trialRecord?hash=43b899ae6fe4bc371f750bc37a5f535b5f08af49');
require('../../page/index/index?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/selectCustomer/selectCustomer?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/addSampleRecord/addSampleRecord?hash=43b899ae6fe4bc371f750bc37a5f535b5f08af49');
require('../../page/editSampleRecord/editSampleRecord?hash=43b899ae6fe4bc371f750bc37a5f535b5f08af49');
require('../../page/addMachine/addMachine?hash=43b899ae6fe4bc371f750bc37a5f535b5f08af49');
require('../../page/editSampleRecord/sampleList/sampleList?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}