function createUtils (lib, mylib) {
  'use strict';
  mylib.spawnDescriptorToPorts = function (desc) {
    return [
      {port: desc.httpport, ipaddress: desc.ipaddress},
      {port: desc.tcpport, ipaddress: desc.ipaddress},
      {port: desc.wsport, ipaddress: desc.ipaddress}
    ];
  };
}
module.exports = createUtils;