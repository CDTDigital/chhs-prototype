#Pre-Qualified Vendor Pool for Digital Services – Agile Development (PQVP DS-AD) Prototype

##Prototype URL
http://adpq.ifgcloud.com

##Product Information

* **Developed by:** The iFish Group, Inc. (IFG)
* **Developed for:** California Department of Technology Statewide Technology Procurement
* **Project Name:** Pre-Qualified Vendor Pool for Digital Services – Agile Development (PQVP DS-AD)
* **Contract ID:** RFI # CDT_ADPQ_0117

##Testing Notes
A walk-through of the prototype has been recorded and posted [here](https://youtu.be/AVOHbvyp7pY) which demonstrates the use of the system.

>**Please note:** Since a developer license for the Twilio messaging service is utilized by our prototype to send SMS alerts to users, phone numbers must be specifically authorized within our Twilio administration console in order for messages to be sent. For security purposes, the prototype only sends emails to users with valid and authorized phone numbers. If you would like to have your phone number added to allow for the testing of SMS messaging functionality on our prototype demonstration instance, please contact us at https://www.ifishgroup.com/contact-us/. Otherwise, instructions for independent installations can be found in the [installation.md](https://github.com/theifishgroup/chhs-prototype/blob/master/installation.md). 

##Synopsis
The PQVP DS-AD Application allows California residents to establish and manage their profile and receive emergency and non-emergency notifications via email, Short Message Service (SMS), and/or push notification based on the location and contact information provided in their profile and/or the geo-location of their cell phone (if they have opted in for this service). In addition, the application provides the authorized administrative users with the ability to publish notifications and track, and analyze and visualize related data.

This [readme.md](https://github.com/theifishgroup/chhs-prototype/blob/master/README.md) file contains a description of the project. It includes a link to the installation instructions contained in the [installation.md](https://github.com/theifishgroup/chhs-prototype/blob/master/installation.md) file. Documents pertaining to the development process, such as meeting notes and other artifacts, have been published in the [Agile](https://github.com/theifishgroup/chhs-prototype/tree/master/Agile) directory within the project’s GitHub repository.

##Code Flow
In a typical use case, a user connects to the web page User Interface (UI) via HTML pages located in the [Public](https://github.com/theifishgroup/chhs-prototype/tree/master/public) folder. These utilize [JavaScript](https://github.com/theifishgroup/chhs-prototype/tree/master/public/js) (JS) libraries such as the [Bootstrap](https://github.com/theifishgroup/chhs-prototype/blob/master/public/js/bootstrap/bootstrap.min.js) framework. The JS libraries call REST services which are defined in the [application](https://github.com/theifishgroup/chhs-prototype/blob/master/app.js) which make use of [modules](https://github.com/theifishgroup/chhs-prototype/tree/master/ifish_modules) which issue database calls to the MongoDB instance which has been installed and configured within the Docker container.

#Technical Approach
The [IFG Technical Approach](https://github.com/theifishgroup/chhs-prototype/blob/master/Agile/RFI%20CDT-ADPQ-0117-IFG%20Technical%20Approach-FINAL.docx) was used to create the Working Prototype. This approach followed the US Digital Services Playbook which is available online at: https://playbook.cio.gov

##a. Assigned Product Leader
The iFish Group (IFG) assigned one leader, Clark Cunningham, who had the authority and responsibility for the quality of the prototype submitted.  

##b. Multidisciplinary Team
A core group of IFG staff members worked collaboratively to develop the PQVP DS-AD Application. Team members included:

* **Clark Cunningham:** Product Manager, Technical Architect, Agile Coach
* **Ernie Lopez:**  Business Analyst, Visual Designer, Frontend Web Developer
* **Fernando Cabrera:**  Technical Architect, Backend Web Developer
* **Thomas Weitzel:** Interaction Designer/User Researcher/Usability Tester, Writer/Content Designer/Content Strategist
* **Paul Venable:**  DevOps Engineer
* **Frank Ono:**  Security Engineer
* **Scott Schriber:**  Delivery Manager, Agile Coach

For more information about our team and their qualifications: [IFG Team](https://github.com/theifishgroup/chhs-prototype/blob/master/Agile/ADPQ%20IFG%20TEAM-FINAL.docx)

##c. Understanding What People Need
In order to ensure that the PQVP DS-AD Application meets peoples’ needs, community stakeholders who represent potential actual users of the prototype and the given the dataset were involved in the prototype development and design process. As an example, one of the people we involved included:

* **Marcie L.:** Sacramento Area resident who lives near a river.  Earlier in 2017, her residence was subject to flood warning evacuations. Prior to this year, none of her family members had subscribed to an emergency notification service. As a result of flooding dangers, she signed up to a service for alerts in early 2017.

##d. User-Centric Design Techniques and Tools
IFG utilizes a tailored agile development methodology which is centered around User-Centered Design (UCD). 
In the initial design process, we identified personas (representing generic types of potential users) and scenarios (representing potential use cases of the application). For each persona and scenario, we generated a user story that complies with our agile development process.

Each user story includes a testable description of the distinct, granular, verifiable activities of people along with the acceptance criteria.

A workflow consists of multiple related user stories that operate together to achieve a specific purpose or business process. Workflows are described using User Role Maps and Process Maps which are frequently visualized using Universal Markup Language (UML) notation and swim lane diagrams. 

User stories that are subject to authorization restriction clustered into User Roles and implemented using a Role Based Access Control (RBAC) approach. 

##e. GitHub Repository
IFG used GitHub as a repository to document code commits and publish software at the following location: https://github.com/theifishgroup/chhs-prototype 

##f. RESTful API Documentation
IFG used Swagger to document all RESTful API. The Swagger documentation is available at:
https://app.swaggerhub.com/api/igfernando/adpq-ifishgroup/1.0.0

##g. Section 508 and WCAG 2.0
IFG designed the application to meet and exceed accessibility guidelines to ensure access for people with physical, sensory, or cognitive disabilities. This includes adherence to Section 508 of the Americans with Disabilities Act (ADA) and Web Content Accessibility Guidelines (WCAG 2.0) standards, in accordance with the [U.S. Web Design Standards](https://standards.usa.gov/). We used the [Web Accessibility Evaluation Tool](http://wave.webaim.org/) to assess compliance. A number of accessibility issues have been identified, assessed as addressable and documented as bugs to be addressed in future development.

##h. Design Style Guide and Pattern Library
For development, we employed a combination of the [U.S. Web Design Standards](https://standards.usa.gov/) and [Bootstrap](http://getbootstrap.com/) themes and templates to construct the application. Bootstrap is an HTML5, CSS3 and JS framework for developing responsive projects compatible with both desktop and mobile environments.
 
##i. Performed usability tests with people
People who participated in the application development process as community stakeholders performed usability testing upon successful completion of the application in the test environment. Users were asked to perform User Stories and provide qualitative feedback regarding the application including usability, intuitiveness, usefulness and overall experience. We integrated feedback and informed the subsequent work or versions of the prototype.
 
##j. Iterative Approach
IFG used an iterative approach where feedback informed subsequent work or versions of the
Prototype. 

##k. Responsive Multi-Device Design
IFG created the prototype to work on multiple devices. It presents a responsive design that we tested on Google Chrome, Windows Edge, and Chrome for Android on mobile devices.

##l. Open-Source Technologies
IFG utilized more than five (5) modern and open-source technologies. They include:
* **[MongoDB](https://www.mongodb.com/community) –** Database Component
* **[Bootstrap](http://getbootstrap.com/) –** Front-end Framework Component
* **[Sikuli](http://www.sikuli.org/) –** UI Testing Component
* **[The Web Accessibility Evaluation Tool](http://wave.webaim.org/) –** Accessibility Testing Component
* **[GoCD](https://www.gocd.io) –** Continuous Integration Component
* **[Bitbucket](https://bitbucket.org) –** Configuration Management Component
* **[Git](https://github.com) –** Source Control Component
* **[Docker](https://www.docker.com/) –** Containerization Component
* **HTML5 –** Front-end Framework Component
* **CSS3 –** Front-end Framework Component
* **JavaScript (JS) –** Front-end Framework Component

##m. IaaS and PaaS Environments
IFG deployed the prototype to a private cloud, but it has been containerized using [Docker](https://www.docker.com/) for seamless deployment into an Infrastructure as a Service (IaaS) or Platform as Service (PaaS) provider such as the Amazon Cloud. The iFish Group is a IaaS and PaaS provider for many of our clients so we have hosted this prototype on our environment.

##n. Automated Unit Testing
IFG tested the prototype was tested using automated unit tests. For all back end processing accomplished via the business logic tier, code was remotely executed and the return data validated programmatically. Front end testing was performed using [Sikuli](http://www.sikuli.org/). 

##o. Continuous Integration
[GoCD](https://www.gocd.io) is a leading open Continuous Integration/Delivery server that provides hundreds of plugins to support building, deploying and automating any project. IFG used this platform to automate the running of tests. We continuously deployed the code to IFG’s IaaS/PaaS environment.  This is one of our standard corporate suites of tools in use on many other projects

##p.  Configuration Management
IFG utilized [Bitbucket](https://bitbucket.org) with Git plugin, as our source code/Configuration Management tool, as we have in many of our other projects.
 
##q. Continuous Monitoring  
IFG utilized Check MK Monitoring Task plugin for GoCD as our Continuous Monitoring tool, just as in many of our other projects.

##r. Open Source Container
[Docker](https://www.docker.com) is an open platform for developers and sysadmins to build, ship, and run distributed applications, whether on laptops, data center VMs, or the cloud. The prototype is containerized using this operating-system-level virtualization software.

##s. Installing Instructions
Please see the project’s Installation.md file for the detailed documentation of the steps necessary to install and run the prototype on another machine.

##t. Open License
The prototype and underlying platforms used to create and run the prototype are openly licensed and free of charge.
Product: PQVP DS-AD Application
Copyright © 2017, iFish Group, Inc.

Prototype and underlying platforms used to create and run the PQVP DS-AD Application are openly
licensed and free of charge. 

This program is free software: You can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.
