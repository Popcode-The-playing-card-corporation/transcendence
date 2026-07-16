import anouar from "../../../public/avatars/avatar8.jpg"
import kilian from "../../../public/avatars/avatar7.jpg"
import alex from "../../../public/avatars/avatar5.jpg"
import cyril from "../../../public/avatars/avatar26.webp"
import dana from "../../../public/avatars/avatar6.jpg"
import { FaGithub, FaLinkedin } from "react-icons/fa"

export default function AboutPage() {
  return (
    <div className="pt-8">
      <div id="aboutPopcards">
        <h2 className="text-center">About Popcards</h2>
        <br />
        <p className="text-justify md:mx-30">
          Popcards is our team's implementation of the Ecole 42 common core final project ft_transcendence. It is a way for us to show off not only what we have learnt over the past two years, but also demonstrate our creativity, ability to learn, and teamwork. The subject of ft_transcendence gives us the freedom to create an original project while meeting specific requirements as stated by the subject.
        </p>
        <br /><br />
      </div>
      <div id="whatIsPopcards">
        <h2 className="text-center">What is Popcards</h2>
        <br />
        <p className="text-justify md:mx-30">
          Being avid fans of card games, our team decided to create an online multiplayer platform to play the Swiss card game "La Misère". To accompany this card game, we have included social networking features, such as friend requests, leaderboards, friend profiles and more. To improve the game experience users can create custom game lobbies with customizable settings to provide a tailored experience. Users can authenticate securely either with a username and password or with OAuth via Google, Github, or the 42 Network.
          <br /> <br />
          Some of the key features that we would like to highlight are: Realtime Online Multiplayer, Secure Login with OAuth, Personalized Profiles, Friend and Relationship Management, Realtime Notifications, Match History, Statistics, and Elo Tracking.
        </p>
        <br /><br />
      </div>
      <div id="meetTheTeam">
        <h2 className="text-center">Meet the team</h2>
        <br />
        <p className="text-justify md:mx-30">
          The Popcode team has been together since the beginning of their 42 journey. Enjoying lunch together nearly every day, the formation into a project team occurred naturally. Having a tradition of sharing popcorn around the work space, the identity of our team was easily decided. Our first project as a team is Popcards, inspired by our daily card games we decided to bring one of our favourite card games to the online world.
        </p>
        <br />
        <h3 className="text-center">Individual Profiles</h3>
        <div className="flex flex-wrap gap-3 justify-center">
          <div className="bordered border w-60">
            <h4 className="pb-4"><strong>Cyril aka cgoldens</strong></h4>
            <div className="flex justify-center mb-3 ">
              <img src={cyril} className="w-40 rounded-2xl" />
            </div>
            <p className="mb-3">Tech Lead</p>
            <p className="mb-3">
              Fun fact: I became a beekeeper because I wanted to make homemade mead.
            </p>
            <div className="flex gap-2 justify-center">
              <a className="text-xl hover:scale-110" href="https://www.linkedin.com/in/cyril-goldenschue/" target="_blank">
                <FaLinkedin />
              </a>
              <a className="text-xl hover:scale-110" href="https://github.com/Cyraullie" target="_blank">
                <FaGithub />
              </a>
            </div>
          </div>

          <div className="bordered border w-60">
            <h4 className="pb-4"><strong>Alex aka atomasi</strong></h4>
            <div className="flex justify-center mb-3 ">
              <img src={alex} className="w-40 rounded-2xl" />
            </div>
            <p className="mb-3">Product Owner</p>
            <p className="mb-3">
              Fun fact: I wanted to try out a cool button on an app and I accidentally won an online auction.
            </p>
            <div className="flex gap-2 justify-center">
              <a className="text-xl hover:scale-110" href="https://www.linkedin.com/in/alexandre-tomasi-69b26616b/" target="_blank">
                <FaLinkedin />
              </a>
              <a className="text-xl hover:scale-110" href="https://github.com/Crealex" target="_blank">
                <FaGithub />
              </a>
            </div>
          </div>

          <div className="bordered border w-60">
            <h4 className="pb-4"><strong>Kilian aka ktintim -</strong></h4>
            <div className="flex justify-center mb-3 ">
              <img src={kilian} className="w-40 rounded-2xl" />
            </div>
            <p className="mb-3">Happiness Manager</p>
            <p className="mb-3">
              Fun fact: I really wanted to use C++ for the backend but they didn't let me, I had to use Python instead :( .
            </p>
            <div className="flex gap-2 justify-center">
              <a className="text-xl hover:scale-110" href="https://github.com/Kenviro" target="_blank">
                <FaGithub />
              </a>
            </div>
          </div>

          <div className="bordered border w-60">
            <h4 className="pb-4"><strong>Dana aka dvauthey</strong></h4>
            <div className="flex justify-center mb-3 ">
              <img src={dana} className="w-40 rounded-2xl" />
            </div>
            <p className="mb-3">Art Director</p>
            <p className="mb-3">
              Fun fact: Sometimes I think I'm just a diversity hire, I don't know why...
            </p>
            <div className="flex gap-2 justify-center">
              <a className="text-xl hover:scale-110" href="https://github.com/neoo-n" target="_blank">
                <FaGithub />
              </a>
            </div>
          </div>

          <div className="bordered border w-60">
            <h4 className="pb-4"><strong>Anouar aka akabbaj</strong></h4>
            <div className="flex justify-center mb-3 ">
              <img src={anouar} className="w-40 rounded-2xl" />
            </div>
            <p className="mb-3">Project Manager</p>
            <p className="mb-3">
              Fun fact: I grew up sailing in Hong Kong and have been teaching the sport ever since.
            </p>
            <div className="flex gap-2 justify-center">
              <a className="text-xl hover:scale-110" href="https://www.linkedin.com/in/anouar-kabbaj/" target="_blank">
                <FaLinkedin />
              </a>
              <a className="text-xl hover:scale-110" href="https://github.com/Wildnachos" target="_blank">
                <FaGithub />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
