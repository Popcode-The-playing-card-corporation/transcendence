
## test data
enter in django container
```
docker exec -it django sh
```
next use 
```
python manage.py seed
```
_This project has been create as part of the 42 curriculum by cgoldens, atomasi, ktintim-, dvauthey, and akabbaj_

# Transcendence

## Description

### Overview
Transcendence is the final project of the Ecole 42 common core. It is a project for students to not only show what they have learnt, but also to demonstrate their ability to learn, adapt, and implement new skills.

As such, the subject for Transcendence gives students the freedom to create an original project, while validating their choice of modules from a selection provided.

### Popcards
The Popcode team has been together since the beginning of their 42 journey. What started as just a daily lunch between students has since become a tight-nit team. 

Throughout our journey at 42 we've gone from sharing lunch, to playing cards, to working together. As we worked together, a tradition of sharing popcorn emergedm hence, our team name and the essence of our website.

Popcards is the product of the Popcode team. It is an online platform to play a card game known as "La Misere", as Swiss card game which became a favourite for our team's lunchtime entertainment.

The following features are implemented on Popcards:
- Account creation (necessary to access many of the website's features)
	- OAuth login for: Google, Github, 42
- Friends management
	- Friend requests
	- Friend deletion
	- blocking/unblocking users
- Realtime updates/notifications
	- Realtime online/offline status changes for friends
	- Notifications of events such as friend requests, game invites, game information
	- Realtime leaderboard updates
	- Realtime updates to friend lists
- The game
	- Join/Create Rooms
	- Private/Public/Friend only rooms
	- Friend invites
	- Modify game settings
	- Add bots to games
	- Elo tracking system


## Instructions

### Prerequisites
- Docker and Docker Compose (v2+)
- Git
- Make
- A secrets folder in `./srcs` containing:
	- `.env` - Please see .env.example for further guidance
	- `django_secret.txt` - Must have a key for django, this can be anything although it is recommended you generate a key using: @Cyril


	- The following secret files must be non-empty. If they contain valid API Secret Keys that correspond to the IDs provided in the .env they will allow OAuth login for their corresponding service.
		- `google_secret.txt`
		- `git_secret.txt`
		- `42_secret.txt`
- To create valid OAuth clients please follow the instructions provided by the related services in order to create a valid client. Once created you will be able to subsitute the correct values in the .env and secret files.
- For SELinux users there may be additional requirements. Please see below.

### Setup
1. Clone the repository:
``` bash
git clone https://github.com/Cyraullie/transcendence.git
cd transcendence
```
2. Build and start all services:
``` bash
make prod
```
This will build the project in docker compose, using the self-signed SSL certificates provided, and start all docker containers.

3. The application will be available at `https://localhost:{NGINX_PORT}` (NGINX_PORT specified in .env, for a normal production version 443 is recommended).
4. For developper features such as clearing the DBs, run `make` to see all commands available.


### SELinux

Certain users with operating systems which use SELinux may run into permissions issues when running the Docker containers. To solve this our recommended solution is to modify the `docker-compose.yml` file, or create a new one.

A template has been provided for this file. The key changes are: `:Z` has been added to bind mounted volumes. Secrets have been converted to bind mounted volumes to allow for this.

We did not use this as our default `docker-compose.yml` as we preferred to implement docker secrets in a clean way as intended, rather than reproducing their behaviour with bind mounts.

There is also a "quick and dirty" method to solve this issue, however it is not a best practice and is not endorsed by the Popcode team. This method **which should only be used for development with permission from your administrator** is to disable SELinux specifically for the docker service. As it is not recommended we will not be providing information on how to do this. 😉

## Resources
An “Instructions” section containing any relevant information about compilation,
installation, and/or execution.

_This project has been create as part of the 42 curriculum by cgoldens, atomasi, ktintim-, dvauthey, and akabbaj_


## Team Information
| Login | Name | Role(s) | Description |
|-------|------|---------|---------|
| cgoldens | Cyril Goldenschue | Tech Lead, Developer | Defined the technical architecture of the project, with a focus on the backend and database. |
| atomasi | Alexandre Tomasi | Product Owner, Developer | Led the definition of the product visions, and led discussions on feature implementation. |
| ktintim- | Kilian Tintim | Happiness Manager, Developer | Supported the Tech Lead in developing the technical architecture. Kept everyone smiling. |
| dvauthey | Dana Vauthey | Art Director, Developer | Defined the artistic vision of the project. Supported the Product Owner to maintain a consistent |
| akabbaj | Anouar Kabbaj | Project Manager, Developer | Supported coordination between frontend and backend. Helped organise team meetings. |

## Project Management

### Organisation
The project was divided into 3 core components. These components were then further subdivided to allow for proper work distribution.
- **Frontend & UI/UX**
	- **Artistic Direction**: Dana took the lead, painstakingly creating the visual assets to be used for the game. Alex collaborated with Dana to create a cohesive style for the application.

	- **UI/UX**: Alex managed the implementation of the React frontend, using technologies such as CSS and typescript. Dana then joined to further assist with the web development in particular with the implementation of the game.

	- **API Connectivity**: Once there was an established structure for the website, Anouar managed connections between the React frontend and the Django backend. First HTTP requests were implemented, then websockets.

- **Backend**
	- **Database management**: Cyril implemented the MariaDB database, ensuring connectivity with the Django backend.

	- **API**: Cyril managed the API from the backend, providing the frontend with structured information from the database. This also included securing endpoints to ensure safe access to the API. Kilian provided support by testing API access, in particular in relation to the game. Websockets were also implemented by Cyril throughout to provide seamless realtime information to the application. Anouar implemented OAuth for Google, Git, and 42.

	- **Game Engine**: Kilian created the game engine, allowing for a game that follows real world rules, while being adaptle to user specifications. This included a scoring system, elo system, and allows for the use of bots with different difficulty levels. The game was then connected to websockets allowing for connectivity to the frontend.

- **DevOps**

	- **Docker & Make**: Initially handled by Cyril, a structure for containerization and deployment was created. Further on in the project Anouar enhanced the structure for a production-ready setup.

The team collaborated by having initial meetings to decide on the general direction for the project. Within subteams further meetings were held when needed. As the project continued there were meetings every 1-2 weeks to ensure the whole team was on the same page. The team largely worked on-site together allowing for regular informal discussions, enhancing cohesion both within team dynamics and for a better overall vision of the project. 


### Tools
- **Version control**: Github
- **Task tracking & resource sharing**: Notion
- **Communication Channels**: Discord, Whatsapp


## Technical Stack

### Frontend
- **React + TypeScript**:
- **Tailwind CSS**:
- **Websockets**:
- **ThreeJS**
- **Daisy**

### Backend
- **Django**:
- **REST**
- **Daphne?**:

### Database
- **MariaDB**:

### Infrastructure
- **Docker + Docker Compose**:
- **NGINX**:

### Other
Procreate


Frontend technologies and frameworks used.
◦ Backend technologies and frameworks used.
◦ Database system and why it was chosen.
◦ Any other significant technologies or libraries.
◦ Justification for major technical choices.


## Database Schema
Visual representation or description of the database structure.
◦ Tables/collections and their relationships.
◦ Key fields and data types


## Features List

| Feature | Description | Implemented by |
| ------- | ----------- | -------------- |
| User Authentication | | Cyril, Alex, Anouar |
| Cookie-based JWT Authentication | | Cyril, Anouar |
| Cookie-based OAuth Authentication | | Anouar |
| Modifiable Site Settings | | Alex |
| User Profiles | | Cyril, Alex, Dana, Anouar |
| Friend Management | | Cyril, Alex, Dana, Anouar |
| Blocked Users Management | | Cyril, Alex, Anouar |
| Leaderboard, Statistics & Game History | | Everyone |
| Realtime Updates & Notifications | | Cyril, Alex, Anouar |
| Handmade custom cards | | Dana |
| Custom Game Engine | | Kilian |
| AI Opponents | | Kilian |
| Customizable Matches | | Kilian |
| Real-time Multiplayer | | Cyril, Kilian |
| Game Lobbies | | Everyone |
| Remote Players | | Cyril, Kilian |

Complete list of implemented features.
◦ Which team member(s) worked on each feature.
◦ Brief description of each feature’s functionality.

## Modules

### Web
| Module | Type | Points | Implementation | Implemented by |
| ------ | ---- | ------ | -------------- | -------------- |

Front framework 1
Back framework 1
Real time features 2
User Interactions 2
ORM? 1
Notification system? 1
Custom Design 1
Search ? 1

### Accessibility
| Module | Type | Points | Implementation | Implemented by |
| ------ | ---- | ------ | -------------- | -------------- |

2 additional browsers? 1


### User Management
| Module | Type | Points | Implementation | Implemented by |
| ------ | ---- | ------ | -------------- | -------------- |

Standard user managmenet and auth 2
Game statistics and match history 1
OAuth 2.0  1



### Artificial Intelligence
| Module | Type | Points | Implementation | Implemented by |
| ------ | ---- | ------ | -------------- | -------------- |

AI Opponents 2

### Gaming and User Experience
| Module | Type | Points | Implementation | Implemented by |
| ------ | ---- | ------ | -------------- | -------------- |

Multiplayer game 2
Remote Players 2
Multiplayer game 2
Game customization? 1
Gamification? 1

### Other

Card design ? 1


## Individual Contributions

### Cyril Goldenschue

### Alexandre Tomasi

### Kilian Tintim

### Dana Vauthey

### Anouar Kabbaj
OAuth
API Connections from Frontend
Realtime updates and notifications using websockets
Online offline detection in backend websockets
Cookie management in backend
Logic for front with logged in states and various states
Devops docker and makefile
Readme

challenges:
being absent/catching up
working between and front - communication
SELinux issues
Refactors accross back and front when changes to DB information or cookies etc.


Detailed breakdown of what each team member contributed.
◦ Specific features, modules, or components implemented by each person.
◦ Any challenges faced and how they were overcome.


## Resources

### Frontend

### Backend

## AI Usage

The README.md is a critical part of your project evaluation. It
should be:
• Clear and well-organized.
• Complete with all required sections.
• Professional and easy to read.
• Honest about contributions and challenges.
A poor or incomplete README can negatively impact your evaluation.


