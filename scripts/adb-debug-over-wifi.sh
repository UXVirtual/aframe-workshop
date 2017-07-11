#!/bin/sh
#
# usage : 
#         adb-debug-over-wifi [SERIAL OF THE DEVICE]

device_serial=$1
devices_attached=`adb devices -l | grep -c "device:"`

# check the device 
if [ -z "$device_serial" ]; then
	
	case $devices_attached in 
		0 )
			echo "No device attached"
			exit 1
			;;
		1 )
			echo "No serial given, automatically redirect to the current device"
			device_serial_command=""
			;;
		* )
			echo "More than one device attached, please provide a serial"
			exit 1
			;;
	esac
else
	device_serial_command="-s $device_serial"
fi



# get the device local ip
device_ip=`adb ${device_serial_command} shell ifconfig | grep -A 1 "wlan0" | grep -oE "\b([0-9]{1,3}\.){3}[0-9]{1,3}\b" | grep -m1 ""`
echo "Device IP : ${device_ip}"

# restart adb in tcpip mode
adb ${device_serial_command} tcpip 5555

# wait for the user to disconnect the device
read -p "Unplug your device from USB, then press enter to create the wifi connection" w
adb connect ${device_ip}:5555
echo "Remember to reboot your device when finished!"