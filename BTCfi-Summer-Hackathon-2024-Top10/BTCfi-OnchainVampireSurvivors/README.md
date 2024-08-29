# OnchainVampireSurvivors
![Alt text](https://github.com/CatKevin/OnchainVampireSurvivors/blob/core/images/logo.png?raw=true)
## Inspiration

I used to be obsessed with a very popular game called "Vampire Survivor" which can be played on Steam. I was addicted to this game some time ago. I would play it for at least half an hour, or even several hours each time.
I searched hard on web3 and couldn't find similar games, or even fun games. Aside from Dark Forest, most of the web3 games I've seen are boring airdrops or hype (or maybe I just don't find interesting games). However, if my guess is correct, this will lead to people only making money through web3 games and then maybe reopening steam after get off work.
I think only interesting web3 games are likely to be widely used, while games that rely solely on token airdrop or "play to earn" models will be difficult to maintain.

## What it does
OnchainVampireSurvivors is a time survival game with minimal gameplay and roguelite elements. It uses ThirdWeb technology to allow players to use various methods, such as commonly used social accounts (Google, Apple, Facebook), email, mobile phone number, passkey and more than 350 web3 wallets.
The game uses a unique algorithm mechanism to optimize the game value, so that players can immerse themselves in a state of continuous tension and excitement. I created a specific algorithm in the smart contract and created an on-chain ranking list, which is very likely to reduce gas consumption without affecting the sorting efficiency. At the same time, I also simply implemented a unique lottery mechanism for players to draw cards.

![Alt text](https://github.com/CatKevin/OnchainVampireSurvivors/blob/core/images/2.png?raw=true)

Using the introduction of the original Vampire Survivors game to explain the game values ​​of OnchainVampireSurvivors: Monsters are everywhere, and you are nowhere to escape. All you can do is survive as long as possible until death inevitably ends your struggle. Collect gold in each run to buy upgrades and help the next survivor.

![Alt text](https://github.com/CatKevin/OnchainVampireSurvivors/blob/core/images/7.png?raw=true)

[Click to play OnchainVampireSurvivors](https://catkevin.github.io/OnchainVampireSurvivors-core-demo/)

Tips: Please use chrome browser to open.


## How to play it

### 1、Loading Scene
- Wait for the progress bar to end, select the wallet you want to interact with or log in with your social account, and then start the game
  
![Alt text](https://github.com/CatKevin/OnchainVampireSurvivors/blob/core/images/1.png?raw=true)

### 2、Home Scene
- On the homepage, you can see various game data, such as the number of gold coins and diamonds, network icon, wallet address, etc., as well as game characters and weapons, and of course the scrolling background and LOGO I drew specifically for Core Blockchain network.
- The five buttons on the right have different functions: Home, Weapons, Characters, Lottery, and Onchain Rankings.
- Click the Start Game button, you need to pay 0.01 tCORE for the gas token, then wait for a moment and enter the game after the transaction is completed.
- When you start the game, you need to pay 0.01 tCORE as the ticket fee to participate in the game, and this fee will be directly distributed to outstanding players in the current ranking as a game incentive. (If you can maintain a high ranking, it means you can earn a huge amount of tCORE tokens)

![Alt text](https://github.com/CatKevin/OnchainVampireSurvivors/blob/core/images/2.png?raw=true)

#### 2.1 Weapon Page
- Players can select, purchase and upgrade weapons on this page.
- You can get gold coins by purchasing, drawing prizes and participating in games.
- You can only get diamonds and get cooler and more advanced weapons through lottery. (lottery is one of the easiest ways to get high-level weapons)

![Alt text](https://github.com/CatKevin/OnchainVampireSurvivors/blob/core/images/3.png?raw=true)

#### 2.2 Characters/Skins Page

- Players can purchase and upgrade game characters on this page. 
- I have drawn many characters of this type, but due to time constraints, I only show four characters here.

![Alt text](https://github.com/CatKevin/OnchainVampireSurvivors/blob/core/images/4.png?raw=true)

#### 2.3 Lottery Page

- Players need to pay 0.04 tCORE to participate in the lottery, and can draw gold coins, diamonds and advanced weapons.
- A VRF random extraction function is implemented to ensure the fairness and randomness of the lottery.
- If you want to experience the Howitzer and Gatling as soon as possible, please come and participate in our lucky draw!

![Alt text](https://github.com/CatKevin/OnchainVampireSurvivors/blob/core/images/5.png?raw=true)

#### 2.4 Onchain ranking page
- Here you can see the player ranking data, and you can see kills and time of each item.
- At the bottom you can view the update time of the current chain's ranking.
- This ranking list can be scrolled up and down, and currently stores the top ten data of rankings.

![Alt text](https://github.com/CatKevin/OnchainVampireSurvivors/blob/core/images/6.png?raw=true)

### 3、Game Scene
- After entering the game, players can use the "W", "S", "A" and "D" keys on the computer keyboard to control the character's movement up, down, left and right.（You can see this keyboard button in the lower right corner of the page）
- By controlling the player to avoid monsters, use weapons to kill monsters, then extract experience points, and obtain more interesting skills through upgrades.

![Alt text](https://github.com/CatKevin/OnchainVampireSurvivors/blob/core/images/7.png?raw=true)

- You can click on the avatar in the upper left corner to view the attributes of the current character.
- The top of the screen shows the character's level and skills.
- There is a bombing button and a magnet button on the right, which can bomb monsters and absorb experience points globally respectively. But it can only be used once per game!
- The rest is up to you to experience! I designed a very interesting algorithm to control the generation of monsters, so that players are always in a state of tension and immersed in the game.
- This is why I developed the game! I hope the game can bring happiness to everyone, not boring airdrops.
  
![Alt text](https://github.com/CatKevin/OnchainVampireSurvivors/blob/core/images/10.png?raw=true)

- On the game settlement page, you need to click the Submit button to spread this valuable game data to Core Blockchain network, so that players around the world can see your outstanding performance!!

![Alt text](https://github.com/CatKevin/OnchainVampireSurvivors/blob/core/images/9.png?raw=true)



## How we built it
I completed this project during this days. The time was very tight and the workload was huge because it involved game planning, art, gameplay mechanisms and algorithms, as well as smart contracts and interaction logic with the Core Blockchain network.

### 1、logo
I use Photoshop to draw the game logo and most of the game assets
![Alt text](https://github.com/CatKevin/OnchainVampireSurvivors/blob/core/images/logo.png?raw=true)

### 2、Gaming
I used Photoshop to draw most of the game UI. I used cocos as the game engine, implemented various game mechanisms and algorithms, and completed the complete game logic. It took a lot of time to realize a complete game. I think most of the time was spent on designing game art and implementing game logic.

### 3、ThirdWeb
I use ThirdWeb technology to greatly reduce the entry threshold for web2 players. Players may not need to create their own wallets, they only need their own social accounts (such as Google, Apple, Facebook, etc.) or email and mobile phone numbers to enter the game. Of course, it also supports the use of most wallets such as metamask to enter the game.

### 4、Hardhat and smart contract
I used hardhat to write the game's smart contract, which was designed to store various game data, including player assets, weapons, character skins, etc., to ensure the transparency and security of player data. 
At the same time, a specific algorithm was designed to calculate and store the on-chain rankings to ensure the fairness of competition and incentives among game players. I use a unique algorithm to handle the player's lottery activities, so that the lottery process can happen on the chain! I designed a very smooth interactive page to make players feel involved!
Then, combined with ThirdWeb technology, the smart contract was deployed to the Core Blockchain testnet.


## Challenges we ran into
Due to the limitations of the game engine, I couldn't use ThirdWeb SDK or Web3 SDK. I think about it for a long time, about a week, and write a react project to expose the API to the game engine. It allows me to successfully complete various functions supported by ThirdWeb in the game engine!

## Accomplishments that we're proud of
- I completed most of the game logic within the time limit.
- I implemented specific algorithms to keep gamers immersed in the game, or at least give them a constant sense of tension and excitement.
- Successfully deployed the smart contract to the Core Blockchain testnet. The Core Blockchain testnet is very fast and the experience is great!

## What we learned
- How to use game engines to realize your ideas
- How to write smart contracts using a hardhat
- How to deploy smart contracts to the Core Blockchain testnet

## What's next for OnchainVampireSurvivors
- Design more interesting game UI.
- Improve the reward mechanism so that more top-ranked players can be reasonably allocated more rewards according to the algorithm, thereby increasing player enthusiasm.
- Currently weapons and character skins are pre-designed. I would like to introduce generative AI technology so that players can draw or generate assets such as weapons and character skins by themselves, which will greatly increase the randomness and fun of the game.
- Deploy it on Core Blockchain Mainnet.



## Thank you for reading
Thank you for your patience in reading this document. It is very long and took you a lot of time! Thank you very much!
Of course, you are welcome to try my game! Feel the joy of roguelike game!

[Click to play OnchainVampireSurvivors](https://catkevin.github.io/OnchainVampireSurvivors-core-demo/)
