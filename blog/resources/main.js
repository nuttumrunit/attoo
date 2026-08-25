/*
ZONELOTS cliff notes

Adding posts:
1) Copy the post template file.
2) Write the post content in the file.
3) Add a new object to the "posts" array, containing the post's title (this can include HTML), filename (not including the ".html" extension), and tag list (optional). Sample:
	{
		"title": `{{ POST TITLE }}`,
		"filename": `{{ YYYY-MM-DD-post-title }}`,
		"tags": [`tag 1`, `tag 2`, `tag 3`],
	},

Safe characters to use in tags:
	letters (upper- or lowercase)
	numbers
	? / : @ - . _ ~ ! $ & ' ( ) * + , ; = (question mark, slash, colon, at sign, hyphen-minus, period, underscore, tilde, exclamation mark, dollar, ampersand, apostrophe, left parenthesis, right parenthesis, asterisk, plus, comma, semicolon, equals)
	spaces (will be replaced by hyphens in tag urls)

Adding messages:
Add a new item in the "messages" array, containing the message content (this can include HTML, but should be inline content only)
*/



/* =============
	SETTINGS
============= */

const latestPostsCutoff = 10; // number of blog posts displayed on home page
const messagesOn = true; // whether or not to show a random message in the header

// links listed in header (nav) and footer (contact)
const navLinks = [
{	"name": `Snacks' Blog Box`,	"filename": `index`,	},
{	"name": `About`,		"filename": `about`,	},
{	"name": `Tags`,			"filename": `tags`,		},
{	"name": `Archive`,		"filename": `archive`,	},
{	"name": `Journal`,		"filename": `journal`,	},
];
const contactLinks = [
{	"name": `Back to Home`,	"url": `/`,	},
{	"name": `Blog Index`,	"url": `/blog/index`,	},
{	"name": `Neocities`,	"url": `https://neocities.org/site/snacksgg`,	},
{	"name": `Bluesky`,		"url": `https://bsky.app/profile/snacksgg.me`,	},
{	"name": `Tumblr`,		"url": `https://snacksgg.tumblr.com`,	},
{	"name": `Powered by Zonelots!`,		"url": `https://codeberg.org/cdvr/Zonelots`,	},

];



/* ===============
	BLOG POSTS
=============== */

const posts = [
    
            {
	"title": `New Year 2026`,
	"filename": `2025-12-28-new-year-2026`,
	"tags": [`2025`, `new year`, ,`updates`, ],
},
        
            {
	"title": `Working On A Game`,
	"filename": `2025-08-20-working-on-a-game`,
	"tags": [`2025`, `gamedev`, ,`behind the scenes`, ],
},
    
        {
	"title": `Music Spotlight #0 - Longtime Favorites`,
	"filename": `2025-07-30-music-spotlight-0`,
	"tags": [`2025`, `music talk`, ,`music spotlight`, ],
},
    
    {
	"title": `[miniblog] Instrumental Music `,
	"filename": `2025-05-14-instrumental-music`,
	"tags": [`2025`, `miniblog`,`music talk`, ,`music spotlight`, ],
},
        
    {
	"title": `Art Games`,
	"filename": `2025-02-17-easing-back-into-art`,
	"tags": [`2025`, `art talk`, ],
},
    
{
	"title": `Happy New Year!`,
	"filename": `2024-01-02-happy-new-year`,
	"tags": [`2024`, `updates`, `new year`],
},
    
{
	"title": `Test Blog!`,
	"filename": `2023-12-23-test-blog`,
	"tags": [`2023`, `updates`, ],
},
      

      
];



/* =============
	MESSAGES
============= */

const messages = [
    	` <img src="/blog/images/header/klonoa.png" width="60px" style="vertical-align: middle;"> i hired this guy to stare at you `,
    	`<a href="https://www.youtube.com/watch?v=F9nljUH1ECs" target="_blank"><font color="lightblue">story of cowboys</font></a>`,
    	`<img src="/images/pumapost1.png" width="50px">`,
    	` Cruis'n USA! <img src="/blog/images/header/cruisn.png" width="100px">`,
    	`here, have a medkit <img src="/blog/images/header/medkit.png" width="50px">`,
    	`so... <img src="/blog/images/header/starbit.png" width="20px"> <font color="purple">chunks</font> , huh?`,
	`WELCOME TO BONUS STAGE!`,
	`my name is giovanni giorgio, but everybody calls me giorgio`,
	`i'm here to see MF DOOM`,
	`wahoo`,
	`howdy 🤠`,
	`music make you lose control`,
	`using proper rhythm, wiggle your fingers and jam the keys!`,
	`i get eaten by the worms`,
	`hey kid, i'm a computah`,
	`YEAH THAT MAKES SENSE`,
	`stop all the downloadin'`,
	`HUGE burger`,
	`burger, nuggets, nuggets, burger`,
	`yo chuck bust a move man`,
	`beesechurger`,
	`top of the morning like yeehaw`,
	`let the frog be your guide`,
	`y'haw`,
	`gorp`,
	`yabba doo!`,
	`use the boost to get through`,
	`accidentally went to drive.goo`,
	`fancy seeing you here..`,
	`mashed banana mashed banana`,
	`writing is hard`,
	`one man. one lord. one faith. one baptism, two nunchucks`,
	`art is hard`,
	`yerp`,
	`website making is hard`,
	`i'm a little lad who loves berries and cream`,
	`minmaxing the four-way stop`,
	`i'm old!`,
	`he's goin into glove world`,
	`help computah`,
	`help me! i'm in weight paint hell!`,
	`<em>*continues to butter my biscuit*</em>`,
	`dibs on the candy bars`,
	`dibs on the chips`,
	`do you wonder where the crab man sleeps`,
	`people never change, but i have to try`,
	`schemin'`,
	`i chiseled it!`,
	`i can't control my brain`,
	`making your bed every day is a noob trap`,
	`so tired of being so tired`,
	`think you can throw my piece up there?`,
	`i just found 12 bricks`,
	`bweh`,
	`you got any bear claws?`,
	`you got any apple fritters?`,
	`hope you're having a good day :)`,
	`its a good day to do what has to be done by me`,
	`moving like a tortoise full of rigor mortis`,
	`the flip is switched`,
	`are you guys going trick or treating?`,
	`secret stones? demon king?`,
	`demon king? secret stones?`,
	`so very sleepy`,
	`dinner.`,
	`you gotta draaaaaw somethin'!`,
	`gimme a hug, man`,
	`what can you say about carlton? he was carlton`,
	`i feel just like a purple pikmin`,
	`check it out i'm in the house like carpet`,
	`like a fish`,
	`fish gaming`,
	`your goose is cooked`,
	`wall kicks will work`,
	`get the cool shoeshine`,
	`get the fries, you'll need the energy in the coming days`,
	`have you heard of the high elves?`,
	`walk into the wall like you're an NPC`,
	`you're trapped in the new world of street fighter 3`,
	`sorry buddy get in the crystal`,
	`Node graph out of date. Rebuilding...`,
	`the power is yet unknown`,
	`real Yakuza use a gamepad`,
	`I hope nothing evil happens...`,
	`my pizza is shrink!!`,
	`just tryin' to draw just for fun, son 😎`,
	`sorry nothing`,
	`friends are a hamster, a fish, and an owl`,
	`jungle is massive`,
	`i live in a giant bucket`,
	`fish`,
	`Tuesday's coming, did you bring your coat?`,
	`you didn't tell me you were bringing a secret weapon, luigi`,
	`funky music playing in my head`,
	`make a little birdhouse in your soul`,
	`you have uno!`,
	`conga rats`,
	`stop starin' at me with them BIG OL EYES`,
	`i'm feeling fat, and sassy`,
	`oh m-...ahhh...my pockages`,
	`this next one's called freebird 2`,
	`they got this game called Braid, ain't no point to the game`,
	`deserves to be eaten by wolves`,
	`on the internet, no one has to know i'm a.... seaman`,
	`fishbowl to mercury`,
	`i asked my friend joe, i asked my friend jake and they said it was fhqwhgads`,
	`i am a patient boy, i wait i wait i wait i wait`,
	`mmm, delicious, rap snitch knishes`,
	`it's you're lying to me`,
	`keep truck`,
	`when onion rings i answer the phone`,
	`onions! onions! onions!`,
	`oobh i got plany off time`,
	`no squealing, remember that it's free real estate`,
	`if you don't got mojo nixon then your store could use some fixin`,
	`open salami`,
	`all my apes, gone`,
	`cold spaghetti cold spaghetti`,
	`if there is one thing i must do, i must kick BP's ass. this is going to be a very very difficult task.`,
	`wuh`,
	`everybody tells me that it's cool to be a cat`,
	`buh`,
	`guh`,
	`sauce sauce sauce`,
	`yuh`,
	`huh`,
	` 🦍 Inner gorilla is unleashed. Ooh-Ahh-Ahh! (Can't be removed)`,
	`fresh from the juice!`,
	`wandadadadadada wandadadadadada`,
	`ohhhhh banana`,
	`woag`,
	`YOU should back up your files! Now!`,
	`did you know?`,
	`sometimes i dream about cheese`,
	`daft punk is playing at my house`,
	`the playstation can produce mind-boggling effects`,
	`*takes poison damage*`,
	`f r e s h  o a t s`,
	`you hear about video games?`,
	`Way back when I was just a little bitty boy living in a box under the stairs in the corner of the basement of the house half a block down the street from Jerry's Bait shop. You know the place.`,
	`don't breathe this`,
	`!rtv`,
	`i got a message for the poodle in your pocket`,
	`you are not the guy, you're not capable of being the guy`,
	`i wanna be the guy`,
	`woohoo flimby`,
	`play tf2`,
	`play sayonara wild hearts`,
	`i am old and have no reward to offer.`,
	`play gitaroo man`,
	`get funky! be funky! stay funky, yo hustle hustle!`,
	`hey G, would you make me a sandwich?`,
	`play TUNIC`,
	`play rhythm heaven`,
	`drink 5 hour energy`,
	`<b>DRINK</b> 5 hour energy`,
	`it's not a drink, more like a drink`,
	`can i get a bowl of that chili`,
	`joe biden... wake up.`,
	`CONGRATULATIONS! YOU WON!`,
	`i'm at soup`,
	`mmm soup`,
	`my dogs expecting me, i'm ready to go`,
	`oh worm?`,
	`CAR BATTERY!`,
	`probably procrastinating`,
	`let's get in a cab, i'll buy you a kebab`,
	`everything hurts more when i'm tired`,
	`you want soup?`,
	`sorry i'm not home right now, i'm walking into spiderwebs`,
	`aeiou`,
	`honk shoe`,
	`burg me`,
	`all i know is that i don't know`,
	`yeah`,
	`yeah?`,
	`girls rule the day... but us guys.... <font color="lightblue"><a href="https://www.youtube.com/watch?v=kZlZ-ZK3bXQ rel="external" target="_blank">we get the night</a></font>`,


];



/* ======================
	PAGE CONSTRUCTION
====================== */

// get current filepath and the relative paths to the posts folder and the index folder
const path = location.pathname.split("/");
const inPost = path.at(-2) === `posts`;
const pathToPosts = inPost ? `./` : `./posts/`;
const pathToInfo = inPost ? `../` : `./`;

// take a post in posts array and return a formatted link to that post
function formatPostLink(post) {
	return `<li><time>${post.filename.slice(0, 10)}</time>: <a href="${pathToPosts}${post.filename}.html">${post.title}</a></li>`;
}

// convert tag to HTML id/link hash
function formatTagHash(tag) {
	return `--${tag.replaceAll(/\s+/g, `-`)}`;
}

/* ------------------
	HEADER/FOOTER
------------------ */

// write in main-nav and footer content
document.getElementById(`header`).innerHTML = `
<nav id="main-nav"><ul class="flex-list">${navLinks.map(link => `<li><a href="${pathToInfo}${link.filename}.html">${link.name}</a></li>`).join(``)}</ul></nav>
${messagesOn && messages.length > 0
? `<div id="header-message">${messages[Math.floor(Math.random() * messages.length)]}</div>`
: ``}
`;
document.getElementById(`contact-links`).innerHTML = contactLinks.map(link => `<li><a href="${link.url}" rel="external">${link.name}</a></li>`).join(``);

/* ----------
	LISTS
---------- */

// build list of latest X blog posts for the home page
const latestPosts = document.getElementById(`latest-posts`);
if (latestPosts) latestPosts.innerHTML = posts.slice(0, latestPostsCutoff).map(formatPostLink).join(``);



// build list of all blog posts for the main blog page
const allPosts = document.getElementById(`all-posts`);
if (allPosts) allPosts.innerHTML = posts.map(formatPostLink).join(``);

// build tag list and list posts by tag on tags page
const tagsList = document.getElementById(`tag-index`);
if (tagsList) {
	const postsByTag = {};

	// for each tag, make a set of indices of posts with that tag
	posts.forEach((post, i) => post.tags.forEach(tag => {
		postsByTag[tag] ??= new Set();
		postsByTag[tag].add(i);
	}));

	tagsList.innerHTML = Object.entries(postsByTag).map(([tag, postIndices]) => `
	<li id="${formatTagHash(tag)}">
		<details>
			<summary>${tag}</summary>
			<ol class="post-list" reversed>${[...postIndices].map(i => formatPostLink(posts[i])).join(``)}</ol>
		</details>
	</li>
	`).join(``);

	// if URL includes hash with tag name, open its post list
	if (location.hash.length > 0) {
		const selectedTag = document.getElementById(location.hash.slice(1));
		if (selectedTag) selectedTag.querySelector(`details`).open = true;
	}
}

/* --------------
	BLOG POST
-------------- */

if (inPost) {
	// get index of post matching path (cut off file extension so if webhost cuts off extension the script still works)
	const i = posts.findIndex(post => post.filename === path.at(-1).split(`.html`)[0]);

	const postDate = document.getElementById(`post-date`);
	const pathDate = posts[i].filename.substring(0, 10);
	postDate.dateTime = pathDate;
	postDate.innerHTML = new Date(pathDate).toLocaleDateString();

	if (posts[i].tags) document.getElementById(`post-tags`).innerHTML = posts[i].tags.map(tag => `<li><a href="${pathToInfo}tags.html#${formatTagHash(tag)}">${tag}</a></li>`).join(``);

	// link to previous and next posts (if this post is first/latest, link to index instead of previous/next post)
	let postNav = ``;

	postNav += `<li>${i < posts.length - 1
	? `<a href="${pathToPosts}${posts[i + 1].filename}.html" rel="prev">${posts[i + 1].title}</a>`
	: `<a href="${pathToInfo}index.html" rel="index">Back to index</a>`}</li>`;
	postNav += `<li>${i > 0
	? `<a href="${pathToPosts}${posts[i - 1].filename}.html" rel="next">${posts[i - 1].title}</a>`
	: `<a href="${pathToInfo}index.html" rel="index">Back to index</a>`}</li>`;

	document.getElementById(`post-nav`).innerHTML = `<ul>${postNav}</ul>`;
}


/* --------------
	BLOG POST
-------------- */

if (inPost) {
	// get index of post matching path (cut off file extension so if webhost cuts off extension the script still works)
	const i = posts.findIndex(post => post.filename === path.at(-1).split(`.html`)[0]);

	const postDate = document.getElementById(`post-date`);
	const pathDate = posts[i].filename.substring(0, 10);
	postDate.dateTime = pathDate;
	postDate.innerHTML = new Date(pathDate).toLocaleDateString();

	if (posts[i].tags) document.getElementById(`post-tags`).innerHTML = posts[i].tags.map(tag => `<li><a href="${pathToInfo}tags.html#${formatTagHash(tag)}">${tag}</a></li>`).join(``);

	// link to previous and next posts (if this post is first/latest, link to index instead of previous/next post)
	let postNav = ``;

	postNav += `<li>${i < posts.length - 1
	? `<a href="${pathToPosts}${posts[i + 1].filename}.html" rel="prev">${posts[i + 1].title}</a>`
	: `<a href="${pathToInfo}index.html" rel="index">Back to index</a>`}</li>`;
	postNav += `<li>${i > 0
	? `<a href="${pathToPosts}${posts[i - 1].filename}.html" rel="next">${posts[i - 1].title}</a>`
	: `<a href="${pathToInfo}index.html" rel="index">Back to index</a>`}</li>`;

	document.getElementById(`post-nav2`).innerHTML = `<ul>${postNav}</ul>`;
}



    function isRightSideOfViewport(xCoordinate) {
  const threshold = (window.innerWidth / 2)
  return xCoordinate > threshold
}

for (const album of document.querySelectorAll('.album')) {
  album.addEventListener('mouseover', (event) => {
    const albumPosition = album.getBoundingClientRect().left
    const isRightSide = isRightSideOfViewport(albumPosition)

    if (isRightSide)
      album.classList.add('flipped')
    else
      album.classList.remove('flipped')
  }, { passive: true })
}

