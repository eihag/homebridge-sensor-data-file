var fs = require('fs');
var Service, Characteristic;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-sensor-data-file", "SensorDataFile", SensorDataFileAccessory);
};

function SensorDataFileAccessory(log, config) {
    this.log = log;
    this.name = config["name"];
    this.temperatureFilePath = config["temperatureFilePath"];
    this.humidityFilePath = config["humidityFilePath"];
    this.batteryFilePath = config["batteryFilePath"];
    this.manufacturer = config["manufacturer"];
    this.model = config["model"];
    this.serialNumber = config["serialNumber"];
    this.batteryWarningThreshold = config["batteryWarningThreshold"];
}


SensorDataFileAccessory.prototype.getServices = function () {
   var services = [],
            infoService = new Service.AccessoryInformation();

   infoService
      .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
      .setCharacteristic(Characteristic.Model, this.model)
      .setCharacteristic(Characteristic.SerialNumber, this.serialNumber);
    services.push(infoService);

   var tempService = new Service.TemperatureSensor(this.name);
   tempService.getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', this.getTemperature.bind(this));

   tempService.getCharacteristic(Characteristic.StatusLowBattery)
      .on('get', this.getBatteryStatusLowBattery.bind(this));
   services.push(tempService);

    if (this.humidityFilePath) {
       var humidityService = new Service.HumiditySensor(this.name);
       humidityService
          .getCharacteristic(Characteristic.CurrentRelativeHumidity)
          .setProps({minValue: 0, maxValue: 100})
          .on('get', this.getHumidity.bind(this));
       services.push(humidityService);
    }

   var battService = new Service.BatteryService(this.name);
    battService.getCharacteristic(Characteristic.BatteryLevel)
      .setProps({minValue: 0, maxValue: 100})
      .on('get', this.getBatteryLevel.bind(this));

   battService.getCharacteristic(Characteristic.StatusLowBattery)
      .on('get', this.getBatteryStatusLowBattery.bind(this));
   services.push(battService);

   return services;
};


SensorDataFileAccessory.prototype.getTemperature = function(callback) {
  this.log("get temperature");
  readFile(this.temperatureFilePath,callback);
}

SensorDataFileAccessory.prototype.getHumidity = function(callback) {
  this.log("get humidity");
  readFile(this.humidityFilePath,callback);
}

SensorDataFileAccessory.prototype.getBatteryLevel = function(callback) {
  this.log("get batteryLevel");
  readFile(this.batteryFilePath,callback); 
}

SensorDataFileAccessory.prototype.getBatteryStatusLowBattery = function(callback) {
  var that = this
  this.log("get getBattStatusLowBattery");
  readFile(this.batteryFilePath, function(err,data) {
    if (err) {
      callback(err)
      return
    }
    callback(null, (data<that.batteryWarningThreshold))  
  })
}


function readFile(filePath, callback) {
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) {
      console.log("Error reading file: ",err);
      callback(err);
      return
    }
    callback(null, parseFloat(data))
  })
}





