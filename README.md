#Pre-Qualified Vendor Pool for Digital Services – Agile Development (PQVP DS-AD) Prototype
This readme.md file contains a description of the project. It includes a link to the installation instructions contained in the installation.md file. Documents pertaining to the development process, such as meeting notes and other artifacts, have been published in the iFishDigitalServicesPlaybook directory within the project’s GitHub repository.

##Prototype URL
http://adpq.ifgcloud.com

##Product Information
Developed by: The iFish Group, Inc. 
Developed for: State of California Department of Technology Statewide Technology Procurement Project
Name: Pre-Qualified Vendor Pool for Digital Services – Agile Development (PQVP DS-AD)
Contract ID: RFI # CDT–ADPQ–0117

##Synopsis
The PQVP DS-AD Application allows California residents to establish and manage their profile and receive emergency and non-emergency notifications via email, Short Message Service (SMS), and/or push notification based on the location and contact information provided in their profile and/or the geo-location of their cellphone if they have opted in for this service. In addition, the application provides the authorized administrative users with the ability to publish notifications and track, and analyze and visualize related data.

##Technical Approach
The following technical approach was used to create the Working Prototype. This approach followed the US Digital Services Playbook which is available online at: <https://playbook.cio.gov>

###a. Assigned Product Leader
The iFish Group (IFG) assigned one leader, Clark Cunningham, who had the authority and responsibility for the quality of the prototype submitted.  

###b. Multidisciplinary Team
A core group of iFish Group, LLC. staff worked collaboratively to develop the PQVP DS-AD Application. Team members included:

* Clark Cunningham: Product Manager, Technical Architect, Agile Coach
* Ernie Lopez:  Business Analyst, Visual Designer, Frontend Web Developer
* Fernando Cabrera:  Technical Architect, Backend Web Developer
* Thomas Weitzel: Interaction Designer/User Researcher/Usability Tester, Writer/Content Designer/Content Strategist
* Paul Venable:  DevOps Engineer
* Frank Ono:  Product Manager, Security Engineer
* Scott Schriber:  Delivery Manager, Agile Coach

###c. Understanding what People Need
In order to ensure that the PQVP DS-AD Application meets peoples’ needs, community stakeholders who represent potential actual users of the prototype and the given the dataset have been involved in the prototype development and design process. People involved included:

* Marcie L. - Sacramento Area resident who lives close to a river. Was subject to flood warning evacuations earlier in 2017. Prior to 2017, was not subscribed to an emergency notification service. As a result of flooding dangers, she signed up to a service for alerts in early 2017.

###d. User-Centric Design Techniques and Tools
The iFish Group, LLC. utilizes a tailored Agile development methodology which is centered around User-Centered Design (UCD). 

In the initial design process, personas (representing generic types of potential user) and scenarios (representing potential use cases of the application) are
identified. For each persona and scenario, a user story is generated which complies with our Agile development process.

Each user story includes a testable description of the distinct, granular, verifiable activities that people along with the acceptance criteria.

A workflow consists of multiple related user stories that operate together to achieve a specific purpose or business process. Workflows are described using User Role Maps and Process Maps which are frequently visualized using Universal Markup Language (UML) notation and swim lane diagrams. 

User stories that are subject to authorization restriction clustered into User Roles and implemented using a Role Based Access Control (RBAC) approach. 

###e. GitHub Repository
GitHub was used as a repository to document code commits and publish software at the following location: <https://github.com/theifishgroup/chhs-prototype>

###f. RESTful API Documentation
Swagger is used to document all RESTful API. The Swagger documentation is available at: <https://app.swaggerhub.com/api/igfernando/adpq-ifishgroup/1.0.0>

###g. Section 508 and WCAG 2.0
The application is designed to meet and exceed accessibility guidelines to ensure access for people with physical, sensory, or cognitive disabilities. This includes adherence to Section 508 of the Americans with Disabilities Act and Web Content Accessibility Guidelines (WCAG) standards, in accordance with the U.S. Web Design Standards (https://standards.usa.gov/). The Web Accessibility Evaluation Tool (http://wave.webaim.org/) was used to assess compliance.

###h. Design Style Guide and Pattern Library
For development, a combination of the U.S. Web Design Standards (https://standards.usa.gov/) and Bootstrap (http://getbootstrap.com/) Themes and Templates were employed to construct the application. Bootstrap is an HTML5, CSS3 and JS framework for developing responsive projects compatible with both desktop and mobile environments.

###i. Performed Usability Tests with People
People who participated in the application development process as community stakeholders performed usability testing upon successful completion of the application in the test environment. Users were asked to perform User Stories and provide
qualitative feedback regarding the application including usability, intuitiveness, usefulness and overall experience. Feedback was integrated and informed the subsequent work or versions of the prototype.

###j. Iterative Approach 
An iterative approach was utilized where feedback informed subsequent work or versions of the Prototype. 

###k. Responsive Multi-Device Design
The prototype was created to work on multiple devices, and presents a responsive design. It was tested on Google Chrome, Windows Edge, and Chrome for Android on mobile devices.

###l. Open-Source Technologies
Utilized five (5) modern and open-source technologies which include:
* MongoDB (https://www.mongodb.com/community)
* Bootstrap (http://getbootstrap.com/)
* Sikuli (http://www.sikuli.org/)
* The Web Accessibility Evaluation Tool (http://wave.webaim.org/)
* Jenkins (https://jenkins.io/)

* Docker (https://www.docker.com/) 


* HTML5


* CSS3


* JavaScript
(JS)


 


###m. IaaS
and PaaS Environments


The
prototype was deployed a private cloud but has been containerized using Docker
(https://www.docker.com/) for seamless
deployment into an Infrastructure as a Service (IaaS) or Platform as Service (PaaS)
provider such as the Amazon Cloud.


###n. Automated
Unit Testing


The
prototype was tested using automated unit tests. For all back end processing
accomplished via the business logic tier, code was remotely executed and the
return data validated programmatically. For Front End testing, testing was
performed using Sikuli (http://www.sikuli.org/).



 


###o. Continuous Integration


Jenkins (https://jenkins.io/) is a leading open source
automation server which provides hundreds of plugins to support building,
deploying and automating any project. This platform was used to automate the running of tests and continuously deployed their code to their IaaS or PaaS provider.


 


###p. Configuration Management


Setup
or used configuration management;


 


###q. Continuous Monitoring


Setup or used
continuous monitoring;


 


###r. Open
Source Container


Docker (https://www.docker.com) is an open platform
for developers and sysadmins to build, ship, and run distributed applications,
whether on laptops, data center VMs, or the cloud. The prototype is
containerized using this operating-system-level virtualization software.


 


###s.
Installing Instructions


Please see
the project’s Installation.md file for the detailed documentation of the steps
necessary to install and run the prototype on another machine.


 


##t. Open License


The Prototype
and underlying platforms used to create and run the prototype are openly
licensed and free of charge.


Product:
PQVP DS-AD Application


Copyright ©
2017, iFish Group, LLC.


 


Prototype and
underlying platforms used to create and run the PQVP DS-AD Application are
openly


licensed and
free of charge. 


 


This program
is free software: you can redistribute it and/or modify it under the terms of
the GNU General Public License as published by the Free Software Foundation,
either version 3 of the License, or


(at your
option) any later version.


 


This program
is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE.  See the


GNU General
Public License for more details.


 


You should
have received a copy of the GNU General Public License along with this
program.  If not, see
<http://www.gnu.org/licenses/>.


