#Pre-Qualified Vendor Pool for Digital Services – Agile Development (PQVP DS-AD) Prototype Installation

##Docker
Docker is an open platform for developers and sysadmins to build, ship, and run distributed applications, whether on laptops, data center VMs, or the cloud. Learn more at https://www.docker.com. 

##Docker Run Command on Port 80
To run The iFish Group's prototype from Docker on the default port 80: 

> docker run --name adpq -d ifishgroup/adpq

##Docker Run Command on Alternate Ports
In addition, if you'd like to run Docker in another port, for example port 8080:

> docker run --name adpq -d ifishgroup/adpq -p 8080:80

##Twilio
Twilio provides a simple HTTP-based API for sending and receiving phone calls and text messages. In order to send messages, an account must be created and the configuration information passed via Docker command. Learn more at http://www.twilio.com 

##Docker Run Command for Port 80 with Twilio Integration
If you would like to enable Twilio as the SMS provider, issue the following environment parameters:

> docker run --name adpq -e TWILIO_ACCOUNT_SID=<SID> -e TWILIO_AUTH_TOKEN=<TOKEN> -e TWILIO_SENDING_NUMBER=<10DIGITNUMBER> -d ifishgroup/adpq
