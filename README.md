# homebridge-sensor-data-file

This is a simple plugin for [homebridge](https://github.com/nfarina/homebridge) which makes it possible to expose a
 * a temperature sensor service and
 * a battery level service.

Values are read from files on disk.


Cloned from: https://github.com/bahlo/homebridge-temperature-file and extended for multiple services.



## Example config

```json
    {
      "accessory": "SensorDataFile",
      "name": "Pool Sensor",
      "manufacturer" : "TFA",
      "model" : "Venice",
      "serialNumber" : "12345",
      "batteryWarningThreshold" : 25.0,
      "description": "Swimming Pool temperature sensor",
      "temperatureFilePath": "/tmp/pool-temperature",
      "batteryFilePath": "/tmp/pool-temperature-battery"
    }
```
See "raspberry-pi-homebridge-config" sub-project for complete sample config.

## Local dev
In the local module directory:
<pre>
$ cd homebridge-sensor-data-file
$ npm link
</pre>
In the directory of the project to use the module:

<pre>
$ cd project
$ npm link homebridge-sensor-data-file
</pre>

## Local package and deploy
<pre>
npm pack
scp homebridge-sensor-data-file-1.0.0.tgz rpi1:
ssh rpi1
npm install -g homebridge-sensor-data-file-1.0.0.tgz
</pre>
will install in /usr/local/lib/node_modules