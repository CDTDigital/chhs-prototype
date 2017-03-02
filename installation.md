#Pre-Qualified Vendor Pool for Digital Services – Agile Development (PQVP DS-AD) Prototype Installation

##Docker
[Docker](https://www.docker.com) is an open platform for developers and sysadmins to build, ship, and run distributed applications, whether on laptops, data center VMs, or the cloud. 

##Docker Run Command on Port 80
To run The iFish Group's prototype from Docker on the default port 80: 

```
docker run --name adpq -p 80:80 -d ifishgroup/adpq:latest
```
##Docker Run Command on Alternate Ports
In addition, if you'd like to run Docker in another port, for example port 8080:
```
docker run --name adpq -p 8080:80 -d ifishgroup/adpq:latest
```
##Twilio
[Twilio](http://www.twilio.com) provides a simple HTTP-based API for sending and receiving phone calls and text messages. In order to send messages, an account must be created and the configuration information passed via Docker command.

##Docker Run Command for Port 8080 with Twilio Integration
If you would like to enable Twilio as the SMS provider, issue the following environment parameters:
```
docker run --name adpq -e TWILIO_ACCOUNT_SID={twilio sid} -e TWILIO_AUTH_TOKEN={twilio token} -e TWILIO_SENDING_NUMBER={10digit twilio} -p 8080:80 -d ifishgroup/adpq:latest
```
##Sending Email
In order to maximize portability, the Prototype sends email without the use of an SMTP server. As a result, many countermeasures intended to block spam can interfere with message delivery. In a production deployment, the Prototype would be configured to send authorized email via an SMTP server.
