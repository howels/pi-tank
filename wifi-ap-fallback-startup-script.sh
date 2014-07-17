#!/bin/bash
# RPi Network Conf Bootstrapper

#function to create the ad-hoc network
createAdHocNetwork() {
        echo "Stopping interface hotplug service"
        sudo /etc/init.d/ifplugd stop
        echo "Creating ad-hoc network"
        sudo ifconfig wlan0 down
        sudo iwconfig wlan0 mode ad-hoc
        sudo iwconfig wlan0 key aaaaa11111 #WEP key
        sudo iwconfig wlan0 essid "pi-tank" #SSID
        sudo ifconfig wlan0 10.0.0.200 netmask 255.255.255.0 up
        sudo /usr/sbin/dhcpd wlan0
        echo "Ad-hoc network created"
}

createAccessPoint() {
	echo "Stopping interface hotplug service"
	sudo /etc/init.d/ifplugd stop
	echo "Configuring WLAN interface"
	sudo ifconfig wlan0 down
	sudo ifconfig wlan0 10.0.0.200/24 netmask 255.255.255.0 up
	sudo /usr/sbin/dhcpd wlan0
	echo "Enabling HostAPD"
	sudo /etc/init.d/hostapd start
}

test() {
	"$@"
	local status=$?
	if [ $status -ne 0 ]; then
		echo "error with $1" >&2
	fi
	return $status
}


echo "================================="
echo "RPi Network Conf Bootstrapper 0.1"
echo "================================="
echo "Scanning for known WiFi networks"
ssids=( 'DUMBASS' 'MyOtherWlan' )
connected=false
for ssid in "${ssids[@]}"
do
	if iwlist wlan0 scan | grep $ssid > /dev/null ; then
		echo "First WiFi in range has SSID:" $ssid
		echo "Starting supplicant for WPA/WPA2"
		wpa_supplicant -B -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf > /dev/null 2>&1
		echo "Obtaining IP from DHCP"
		if dhclient -1 wlan0; then
			echo "Connected to WiFi"
			connected=true
			break
		else
			echo "DHCP server did not respond with an IP lease (DHCPOFFER)"
			wpa_cli terminate
			break
		fi
	else
		echo "Not in range, WiFi with SSID:" $ssid
	fi
done

if [ $connected == false ]; then
	#uncomment to use adhoc instead
	#createAdHocNetwork
	createAccessPoint
fi

exit 0
