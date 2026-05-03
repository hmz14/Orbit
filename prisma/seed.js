const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function listImageBasenames(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|gif|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b));
}

/**
 * Returns a unique caption + comment pair for a post image.
 * `idx` is the zero-based image counter — used to cycle through variants
 * within a category so no two posts ever share identical content.
 */
function captionAndCommentsForPostImage(filename, idx) {
  const n = filename.toLowerCase();

  const pick = (captions, commentPairs) => {
    const i = idx % captions.length;
    return { caption: captions[i], comments: commentPairs[i % commentPairs.length] };
  };

  // ── Named categories ──────────────────────────────────────────────────────

  if (n.includes("alps") || n.includes("alpine") || n.includes("mountainmagic") || n.includes("peacefulpeaks"))
    return pick(
      [
        "Still thinking about this view in the Alps — the air up there hits different.",
        "French Alps, no filter needed. Nature doesn't miss.",
        "Every hike ends with a view worth the blisters.",
        "Alpine silence hits different when you're standing in it.",
        "The gradient on those peaks at sunrise — I'll never get over it.",
      ],
      [
        ["That gradient on the peaks is unreal.", "Adding this to my 'places I need to hike' list."],
        ["The snow line at this hour is perfection.", "I can almost feel the cold through the screen."],
        ["Mountains genuinely heal something in the soul.", "One day I'll make it there."],
        ["Every pixel of this looks painted.", "The scale is insane."],
        ["Peak main character moment right here.", "Screenshotting this for my vision board."],
      ]
    );

  if (n.includes("airnz") || n.includes("a320") || n.includes("aeroplane") || (n.includes("plane") && n.includes("black")))
    return pick(
      [
        "Aviation mode: on. Caught this beauty on the tarmac.",
        "The all-black livery is genuinely one of a kind.",
        "Plane spotting unlocked. Can't stop now.",
        "There's something poetic about a plane ready to take off.",
        "Air New Zealand just understands aesthetic.",
      ],
      [
        ["The all-black livery is so clean.", "Instant save — I'm such a plane nerd."],
        ["Engineering and art in one frame.", "The tail design alone deserves an award."],
        ["Airport vibes hit different at golden hour.", "Logging this as travel inspo."],
        ["This livery should be in a museum.", "Peak aviation photography."],
        ["The contrast against that sky is chef's kiss.", "Booked my next flight just from this pic."],
      ]
    );

  if (n.includes("monaco") || n.includes("monte carlo"))
    return pick(
      [
        "Monte Carlo blues. Nothing beats a coastal city at golden hour.",
        "Monaco from above looks like a concept render.",
        "The yachts, the cliffs, the light — Monaco is unfair.",
        "Came for the views, stayed for the vibes.",
        "Somewhere between a dream and a postcard.",
      ],
      [
        ["This looks like a luxury travel poster.", "The light on the water is perfect."],
        ["The density of this city is wild.", "I need to visit before I'm 30."],
        ["Those terraced buildings are insane.", "The colour palette of this city is unmatched."],
        ["Monaco never gets old as a subject.", "One of those places you have to see in person."],
        ["The architecture and the sea together hit different.", "Saving this for future trip planning."],
      ]
    );

  if (n.includes("cobblestone") || (n.includes("street") && n.includes("dusk")))
    return pick(
      [
        "Cobblestone streets at dusk — peak 'main character' energy.",
        "Old city light at golden hour is its own genre of beautiful.",
        "This lane looks like the opening scene of a film.",
        "The lamp glow on the stones — something about it feels timeless.",
        "Walking streets like this resets the brain entirely.",
      ],
      [
        ["The mood here is immaculate.", "I'd happily get lost in this lane."],
        ["This is giving medieval fairytale.", "The warm tones are everything."],
        ["Straight out of a storybook city.", "Adding this destination to my list."],
        ["The texture of the stone at this light is unreal.", "I feel like I'm there."],
        ["Pure wanderlust fuel.", "The depth of this shot is incredible."],
      ]
    );

  if (n.includes("gyuu") && n.includes("wallpaper"))
    return pick(
      [
        "Gyuu's art has no right to be this good.",
        "Saved as my next wallpaper. The style is immaculate.",
        "Every time I see Gyuu's work I need a minute.",
        "The linework and colour in this piece deserve way more attention.",
        "Wallpaper rotation updated — this one won.",
      ],
      [
        ["The composition on this is chef's kiss.", "This arc lives rent-free in my head."],
        ["Gyuu always delivers.", "The colour palette is so deliberate."],
        ["Screenshot taken immediately.", "This is the wallpaper I didn't know I needed."],
        ["The detail level is insane.", "I keep coming back to look at this."],
        ["Pure art. No notes.", "Gyuu is genuinely one of the best."],
      ]
    );

  if (
    n.includes("manga") ||
    n.includes("anime") ||
    n.includes("jjk") ||
    n.includes("jujutsu") ||
    n.includes("gojo") ||
    n.includes("yuji") ||
    n.includes("itadori") ||
    n.includes("luffy") ||
    n.includes("one piece") ||
    n.includes("joyboy") ||
    n.includes("midoriya") ||
    n.includes("deku") ||
    n.includes("death note") ||
    n.includes("lawliet") ||
    n.includes("kuroka") ||
    n.includes("fushiguro") ||
    n.includes("toji")
  )
    return pick(
      [
        "New wallpaper dropped. Anime brain takes the wheel.",
        "This panel lives rent-free in my head and I'm not complaining.",
        "The art direction in this arc is genuinely unmatched.",
        "Manga panel of the year — I said what I said.",
        "The character design on this is why I can't stop watching.",
        "Posted this without context. People who know, know.",
        "Some panels just deserve to exist on your lock screen.",
        "The composition, the expression, the shading — everything hits.",
      ],
      [
        ["The composition on this is chef's kiss.", "This arc lives rent-free in my head."],
        ["The shading technique here is wild.", "Screenshot and set as wallpaper immediately."],
        ["This character design carries the whole series.", "Love the detail in this panel."],
        ["Peak fiction right here.", "I've reread this chapter three times."],
        ["The eyes alone tell the whole story.", "This is why I love manga."],
        ["No context needed — W post.", "The cultural impact of this series is immeasurable."],
        ["Art that hits on a different level.", "Thanks for reminding me I need to rewatch this."],
        ["The emotion in this frame is incredible.", "I felt this one."],
      ]
    );

  if (n.includes("green nature") || (n.includes("nature") && n.includes("green")))
    return pick(
      [
        "Greenery therapy — the saturation in real life was even better.",
        "Nature does the colour grading better than any preset.",
        "I didn't know I needed a forest photo until this one.",
        "Green is genuinely the most healing colour.",
        "The light filtering through those leaves — I'm going outside.",
      ],
      [
        ["Immediate calm. Thank you for posting.", "I need a trail day like this ASAP."],
        ["This is oxygen for the eyes.", "Saving this for whenever I need to reset."],
        ["The depth and texture here is stunning.", "Forest walks cured my overthinking."],
        ["Nature photography done right.", "This is the aesthetic I want my life to be."],
        ["The greens in this are so rich.", "Printed this and put it on my wall."],
      ]
    );

  if (n.includes("clock tower"))
    return pick(
      [
        "Architecture rabbit hole: this clock tower stopped me mid-walk.",
        "The stonework on this tower is centuries of patience.",
        "Clock towers are the original flex architecture.",
        "Found this while wandering and now I can't stop thinking about it.",
        "The detail carved into this stone deserves its own documentary.",
      ],
      [
        ["The stonework details are wild.", "Straight out of a storybook city."],
        ["The craftsmanship required for this is unreal.", "History in every stone."],
        ["Architecture like this makes me want to study it.", "The symmetry is satisfying."],
        ["Old city energy is unmatched.", "I love how well this has aged."],
        ["The shadows at this time of day are perfect.", "This shot is genuinely timeless."],
      ]
    );

  if (n.includes("wallpaper") || n.includes("desktop") || n.includes("ipad"))
    return pick(
      [
        "Refreshed my wallpaper rotation — clean and minimal.",
        "This wallpaper has been living on my desktop for a week now.",
        "Sometimes a fresh wallpaper is all you need to reset.",
        "Clean desktop energy activated.",
        "Found this gem and immediately set it as my lock screen.",
      ],
      [
        ["Love the balance in this piece.", "Saving for every device I own."],
        ["The minimalism is so satisfying.", "My eyes need this every morning."],
        ["This is the most calming thing I've seen today.", "Clean visuals, clear mind."],
        ["Perfect for dark mode too.", "Downloaded immediately."],
        ["The colour harmony here is chef's kiss.", "Every device getting this wallpaper."],
      ]
    );

  if (n.includes("vecteezy") || n.includes("download free vector"))
    return pick(
      [
        "Found this visual while browsing references — mood on point.",
        "This vector work is so clean it looks hand-painted.",
        "Reference image of the week, no contest.",
        "The palette in this is doing all the heavy lifting.",
        "Digital art done right — the subtlety is what gets me.",
      ],
      [
        ["Perfect inspo for a design project.", "The palette is doing heavy lifting here."],
        ["The negative space in this is so deliberate.", "Saving to my design folder."],
        ["This would look incredible as a print.", "Clean, bold, and effective."],
        ["The colour theory in this is textbook.", "More designers need to see this."],
        ["Mood board staple right here.", "The vector work is incredibly precise."],
      ]
    );

  if (n.includes("rotten apple"))
    return pick(
      [
        "Moody still life — sometimes the imperfect shots hit hardest.",
        "Still life photography is criminally underrated.",
        "The texture on this is why macro photography exists.",
        "Beauty in decay. This shot is everything.",
        "No filter needed when the subject is this interesting.",
      ],
      [
        ["Love the contrast and texture.", "Editorial magazine energy."],
        ["The lighting sets the mood perfectly.", "This would fit in a gallery."],
        ["The colour degradation is genuinely beautiful.", "Dark academia core."],
        ["Still life done with real intention.", "The composition is perfect."],
        ["The shadows in this shot are so deliberate.", "Haunting and beautiful at once."],
      ]
    );

  if (n.includes("حمد") || n.includes("🕊"))
    return pick(
      [
        "Grateful for quiet moments — peace above everything.",
        "Alhamdulillah for every small blessing today.",
        "Sometimes you just need to pause and count what you have.",
        "Gratitude changes everything. Posting this as a reminder.",
        "Peace of mind is the greatest wealth.",
      ],
      [
        ["This really resonated. Thank you for sharing.", "Sending good energy your way."],
        ["This is the reminder I needed today.", "May your blessings multiply."],
        ["Gratitude posts are underrated.", "The simplicity of this hits hard."],
        ["This made me stop and breathe for a second.", "Needed this."],
        ["Pure peace in a post.", "Alhamdulillah."],
      ]
    );

  if (n.includes("🌸") || n.includes("ৎ") || n.includes("⌗"))
    return pick(
      [
        "Soft aesthetic post to balance out my feed.",
        "Cottagecore mode activated. No notes.",
        "The energy of this image is pure serotonin.",
        "Pasting this energy directly into my soul.",
        "Aesthetic overload. I'm obsessed.",
      ],
      [
        ["This is so wholesome.", "The vibes here are immaculate."],
        ["My feed needs more of this.", "Screenshot and set as mood board."],
        ["Cottage vibes and calm energy — love it.", "This is the energy I'm bringing to my week."],
        ["The pink tones in this are so soothing.", "Adding to my comfort images folder."],
        ["Soft girl era activated.", "This makes me want to go for a walk in a garden."],
      ]
    );

  if (n.includes("🌉"))
    return pick(
      [
        "City lights and bridges — my favorite kind of night walk.",
        "There's a specific kind of magic to city lights on water.",
        "Night photography that actually does it justice.",
        "The bridge at this hour is a whole different world.",
        "Urban nights hit different when it's quiet and lit up like this.",
      ],
      [
        ["The glow in this shot is gorgeous.", "Skyline brain activated."],
        ["The reflection on the water seals the deal.", "Night city is a different planet."],
        ["Long exposure done right.", "This is why night photographers exist."],
        ["This is my late-night walk aesthetic.", "The colours are so rich."],
        ["The symmetry between sky and water is unreal.", "This shot required patience — respect."],
      ]
    );

  if (n.includes("untouched"))
    return pick(
      [
        "Sometimes the best frames feel completely untouched.",
        "Raw and unedited — sometimes that's all you need.",
        "The restraint in not over-editing this is what makes it perfect.",
        "There's a quietness in this shot that I keep coming back to.",
        "No preset needed. The scene speaks for itself.",
      ],
      [
        ["Such a pure texture in this shot.", "Saving this to my calm folder."],
        ["The naturalism is so refreshing.", "This is what photography is about."],
        ["Nothing over-processed. Just real.", "Clean visual storytelling."],
        ["The stillness here is incredible.", "Zero noise, maximum impact."],
        ["This is the kind of photo that ages well.", "Timeless composition."],
      ]
    );

  if (n.includes("cat") && n.includes("aesthetic"))
    return pick(
      [
        "Soft vibes and cat energy today.",
        "Cat aesthetics are a whole genre and I'm here for all of it.",
        "This image genuinely calmed me down. Cat magic.",
        "The photogenic power of cats is undefeated.",
        "Cat content will always win on my feed.",
      ],
      [
        ["This is my entire personality in one image.", "Screenshot for my next lock screen."],
        ["The lighting and the subject together are perfect.", "Cats just know how to pose."],
        ["I needed this level of softness today.", "My cat sees this and knows what's up."],
        ["The aesthetic and the cat together? Deadly combo.", "Saving this immediately."],
        ["Cats understand vibes better than people.", "More cat content, always."],
      ]
    );

  if (n.includes("lan1us") || (n.startsWith("@") && !n.includes("whatsapp")))
    return pick(
      [
        "Loved the tone of this shot — had to share.",
        "The framing here is doing so much work quietly.",
        "This kind of photography is what the app was made for.",
        "The grain and the light in this are intentional and it shows.",
        "Grabbed this from the feed and couldn't scroll past it.",
      ],
      [
        ["The crop and lighting work so well.", "Clean reference material."],
        ["The intentionality in this shot is clear.", "The negative space is perfect."],
        ["This is the reference photo I didn't know I needed.", "Composition is flawless."],
        ["The texture and tones here are so deliberate.", "Genuinely impressed."],
        ["The focal point choice here is so good.", "This is proper photography craft."],
      ]
    );

  // ── WhatsApp images — large unique pool so all 20 get distinct captions ──

  if (n.includes("whatsapp")) {
    const whatsappCaptions = [
      "Resurfaced from the camera roll — had to post it.",
      "This one's been sitting in my gallery for too long.",
      "Clearing out old photos and found this gem.",
      "Sent this in a group chat but it deserves a proper post.",
      "The photo quality is different when you're actually present in the moment.",
      "Looked through my camera roll and this one stood out.",
      "From the archives — couldn't keep this one buried.",
      "Old photo, fresh perspective.",
      "This moment deserved better than staying in my gallery.",
      "Throwback to when I actually put the phone away and then pulled it out once.",
      "Not every great photo needs to be posted immediately.",
      "Sometimes the best shots are the unplanned ones.",
      "Late post but worth it.",
      "Camera roll audit in session — this one earned a spot here.",
      "Dug this up and it still slaps.",
      "This photo has been waiting for its moment.",
      "Found this while looking for something else — glad I did.",
      "Posting this before I forget it exists.",
      "The vibes still hold up.",
      "Old one but the feeling is still the same.",
    ];
    const whatsappComments = [
      ["This moment deserved better than staying in my gallery.", "The vibes still hit."],
      ["Camera roll gems are the best finds.", "This one really aged well."],
      ["The spontaneity of unplanned photos is unbeatable.", "Love that you posted this."],
      ["This is giving 'right time right shot'.", "The atmosphere here is perfect."],
      ["Late posts always hit harder somehow.", "The fact that you saved this says a lot."],
      ["Archival quality content.", "The composition here is genuinely great."],
      ["Finding old photos hits different.", "This one was worth posting."],
      ["The natural lighting is doing everything here.", "No filter needed."],
      ["I love when people post their camera roll finds.", "This is a keeper."],
      ["The candid energy of this is everything.", "Unposed photos are the best photos."],
    ];
    const i = idx % whatsappCaptions.length;
    return { caption: whatsappCaptions[i], comments: whatsappComments[i % whatsappComments.length] };
  }

  // ── Fallback for generic/unnamed images (IMG_14xx, _ (xx), etc.) ──────────

  const fallbacks = [
    { caption: "Sharing a frame I've been staring at all week.", comments: ["This hits — thank you for posting it.", "Saving this. The vibe is exactly what I needed."] },
    { caption: "Just thought I'd share this moment.", comments: ["Love the lighting here.", "Great shot!"] },
    { caption: "One for the camera roll.", comments: ["So aesthetic.", "Absolutely stunning."] },
    { caption: "Can't get over how good this looks.", comments: ["Wow, where is this?", "Incredible capture."] },
    { caption: "A little visual diary entry.", comments: ["The composition is perfect.", "Beautiful!"] },
    { caption: "Details that make the whole picture.", comments: ["Obsessed with this.", "Need more posts like this."] },
    { caption: "Recent favorites.", comments: ["This is art.", "So good!"] },
    { caption: "No caption needed, just look.", comments: ["Speechless.", "Fire!"] },
    { caption: "Through my lens today.", comments: ["Love your perspective.", "Amazing eye."] },
    { caption: "Moments like these are why I carry a camera.", comments: ["So peaceful.", "Love it."] },
    { caption: "The light was too good not to capture.", comments: ["The golden hour glow!", "Perfect timing."] },
    { caption: "Perspective shift — sometimes you just look up.", comments: ["Never would have noticed that angle.", "Great eye!"] },
    { caption: "There's something about this frame I can't explain.", comments: ["You don't need to explain it.", "I feel it too."] },
    { caption: "Caught this and had to stop mid-walk.", comments: ["Glad you stopped.", "The spontaneity shows."] },
    { caption: "Colors don't lie.", comments: ["The saturation is so natural.", "This is gorgeous."] },
    { caption: "A frame worth revisiting.", comments: ["Will definitely come back to this.", "Timeless shot."] },
    { caption: "Quiet moments captured loud.", comments: ["The contrast between subject and stillness is perfect.", "Beautiful contradiction."] },
    { caption: "Posted this for the texture alone.", comments: ["The grain is so intentional.", "Texture photography is underrated."] },
    { caption: "This light only exists for about three minutes.", comments: ["You caught the right three minutes.", "Worth setting an alarm for."] },
    { caption: "A scene I keep returning to mentally.", comments: ["Now I understand why.", "This is meditative."] },
    { caption: "Filed under: things I want to remember.", comments: ["Memory banking activated.", "Smart to document this."] },
    { caption: "Small moments, big feelings.", comments: ["This is why photography matters.", "The simplicity is everything."] },
    { caption: "When the frame just finds you.", comments: ["You have a gift for this.", "Composition goals."] },
    { caption: "Left the house for this shot and zero regrets.", comments: ["Worth every step.", "The result speaks for itself."] },
    { caption: "This is my kind of quiet.", comments: ["The stillness here is healing.", "Exactly the content I needed."] },
    { caption: "Took this one for myself but sharing it anyway.", comments: ["Glad you did.", "This deserves an audience."] },
    { caption: "Real life looked better than any filter.", comments: ["That's the best kind.", "The unedited world is stunning."] },
    { caption: "Couldn't walk past this without stopping.", comments: ["I would have done the same.", "Instinct was right."] },
    { caption: "The kind of shot that justifies carrying your phone everywhere.", comments: ["Always keep the camera ready.", "This proves it."] },
    { caption: "Today's highlight: this exact frame.", comments: ["Highlights of the highlight.", "I'd say the same."] },
    { caption: "When the scene is already perfect — just point and shoot.", comments: ["Minimal effort, maximum reward.", "The world did the work here."] },
    { caption: "Something about this one hits different at night.", comments: ["Night mode on life.", "The contrast here is stunning."] },
    { caption: "Posted because I couldn't stop looking at it.", comments: ["Now I can't either.", "That's the test of a good photo."] },
    { caption: "This one came out exactly the way I saw it.", comments: ["That's a rare win.", "Your eye and the camera agreed."] },
    { caption: "The kind of detail most people walk right past.", comments: ["I see it differently now.", "Grateful for this perspective."] },
    { caption: "An ordinary moment that turned into something else.", comments: ["That's the magic of photography.", "Ordinary into extraordinary."] },
    { caption: "Sat with this for a while before posting.", comments: ["Worth the patience.", "I can feel the intention."] },
    { caption: "Every shot has a feeling — this one has several.", comments: ["Layered in the best way.", "Rich visual storytelling."] },
    { caption: "This is what I mean when I say I love this city.", comments: ["Now I get it.", "You've sold me on this place."] },
    { caption: "Sometimes nature outdesigns everyone.", comments: ["Undeniable.", "The original creative director."] },
    { caption: "My camera and I went for a walk. This happened.", comments: ["Best kind of accident.", "Productive walk."] },
    { caption: "This is the kind of visual that resets my whole day.", comments: ["Immediate reset triggered.", "Bookmarking this for rough days."] },
    { caption: "Raw, unplanned, and somehow perfect.", comments: ["Unplanned things are the best things.", "The spontaneity is everything."] },
    { caption: "Shot this and immediately knew it was the one.", comments: ["That gut feeling is always right.", "The confidence in this shot shows."] },
    { caption: "I've been editing and re-editing this. Posting as-is.", comments: ["The original is always best.", "Less is more — this proves it."] },
    { caption: "Not a professional but this felt right.", comments: ["Looks plenty professional to me.", "The eye matters more than the gear."] },
    { caption: "This shot is just vibes, no explanation.", comments: ["No explanation needed.", "Vibes transmitted successfully."] },
    { caption: "The kind of image that makes you feel like you're there.", comments: ["Teleported.", "Sensory detail is incredible here."] },
    { caption: "Felt something looking at this. Sharing so you can too.", comments: ["Felt it.", "The transfer of feeling through photos is real."] },
    { caption: "I don't post often, but when I do — this.", comments: ["Worth waiting for.", "Selective posting is underrated."] },
    { caption: "Kept coming back to this in my gallery. Had to post it.", comments: ["Trust the instinct.", "Glad you finally did."] },
    { caption: "The world outside is underrated sometimes.", comments: ["Going outside unlocked.", "This makes me want to step out."] },
    { caption: "A reminder that the best photos are sometimes accidental.", comments: ["Accidentally perfect.", "Happy accidents > planned shots."] },
    { caption: "This one earns a spot in the favorites album.", comments: ["Without a doubt.", "Top tier material."] },
    { caption: "Sharing a slice of my day in photo form.", comments: ["This is the slice I needed.", "What a way to document a day."] },
    { caption: "I see something different in this every time I look.", comments: ["Layered content.", "That's how you know it's good."] },
    { caption: "The negative space here is doing so much work.", comments: ["Compositional genius.", "Restraint is a skill."] },
    { caption: "Depth you can feel through the screen.", comments: ["You built layers in this shot.", "The sense of space is incredible."] },
    { caption: "Soft light, sharp memory.", comments: ["You'll never forget taking this.", "The light makes this timeless."] },
    { caption: "This photo holds a whole season for me.", comments: ["That's the highest compliment for a photo.", "I can feel the season in it."] },
    { caption: "The longer you look, the more you see.", comments: ["I've been staring.", "Hidden layers everywhere."] },
    { caption: "Posted this for anyone who needed a good visual today.", comments: ["I needed it more than I knew.", "Prescient posting."] },
    { caption: "Went out, came back with this. Win.", comments: ["Venture rewarded.", "Best kind of return."] },
    { caption: "First shot, kept it. Sometimes that's the right call.", comments: ["First instinct is the truest.", "No second-guessing needed."] },
    { caption: "Unfiltered and honest.", comments: ["That's the energy.", "Authenticity in photo form."] },
    { caption: "Still processing this one. Posting it to help me think.", comments: ["Sometimes you need to share to understand.", "Collective thinking is real."] },
    { caption: "Threw this one in my pocket and forgot it. Glad I found it again.", comments: ["Hidden gems in the gallery.", "Good thing you found it."] },
    { caption: "Early light, quiet street, no agenda.", comments: ["That's the perfect morning formula.", "The freedom in this shot is palpable."] },
    { caption: "Shot in passing — didn't realize how good it was until later.", comments: ["Best photos are often the ones you almost deleted.", "Trust the edit process."] },
    { caption: "This is the picture I'll remember this week by.", comments: ["Visual diary done right.", "A photo that marks time."] },
    { caption: "The composition came together on its own.", comments: ["The best kind of serendipity.", "Organic composition wins every time."] },
    { caption: "Something drew me to this corner. Glad I listened.", comments: ["Intuition is the best camera setting.", "The pull was worth it."] },
  ];

  // Use idx to guarantee uniqueness across the entire fallback pool
  return fallbacks[idx % fallbacks.length];
}

async function main() {
  const projectRoot = path.join(__dirname, "..");
  const profilePicDir = path.join(projectRoot, "public", "assets", "profile_pic");
  const postPicDir = path.join(projectRoot, "public", "assets", "post_pic");
  const profilePicFiles = listImageBasenames(profilePicDir);
  const postPicFiles = listImageBasenames(postPicDir);

  // ─── Clean ────────────────────────────────────────────────────────────────
  await prisma.like.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // ─── Users ────────────────────────────────────────────────────────────────
  const userData = [
    { username: "hamza",              name: "Hamza Abu Lola",        email: "hamza@orbit.app",                 password: "password123", role: "ADMIN", profilePicture: "assets/profile_pic/IMG_1488.jpeg",   bio: "Test account for development." },
    { username: "liam_smith",         name: "Liam Smith",            email: "liam.smith@orbit.app",            password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=1",      bio: "Coffee lover and amateur photographer." },
    { username: "noah_johnson",       name: "Noah Johnson",          email: "noah.johnson@orbit.app",          password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=2",      bio: "Building things one line of code at a time." },
    { username: "oliver_williams",    name: "Oliver Williams",       email: "oliver.williams@orbit.app",       password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=3",      bio: "Traveler | Foodie | Dreamer." },
    { username: "elijah_brown",       name: "Elijah Brown",          email: "elijah.brown@orbit.app",          password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=4",      bio: "Living life to the fullest every day." },
    { username: "james_jones",        name: "James Jones",           email: "james.jones@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=5",      bio: "Designer by day, gamer by night." },
    { username: "aiden_garcia",       name: "Aiden Garcia",          email: "aiden.garcia@orbit.app",          password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=6",      bio: "Books, tea, and long walks on the beach." },
    { username: "lucas_miller",       name: "Lucas Miller",          email: "lucas.miller@orbit.app",          password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=7",      bio: "Passionate about technology and innovation." },
    { username: "mason_davis",        name: "Mason Davis",           email: "mason.davis@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=8",      bio: "Fitness enthusiast and healthy living advocate." },
    { username: "ethan_wilson",       name: "Ethan Wilson",          email: "ethan.wilson@orbit.app",          password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=9",      bio: "Music is my therapy." },
    { username: "logan_anderson",     name: "Logan Anderson",        email: "logan.anderson@orbit.app",        password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=10",     bio: "Exploring the world one city at a time." },
    { username: "emma_taylor",        name: "Emma Taylor",           email: "emma.taylor@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=11",     bio: "Software engineer | Open source contributor." },
    { username: "olivia_thomas",      name: "Olivia Thomas",         email: "olivia.thomas@orbit.app",         password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=12",     bio: "Artist and storyteller." },
    { username: "ava_jackson",        name: "Ava Jackson",           email: "ava.jackson@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=13",     bio: "Nature lover and outdoor adventurer." },
    { username: "isabella_white",     name: "Isabella White",        email: "isabella.white@orbit.app",        password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=14",     bio: "Entrepreneur | Startup enthusiast." },
    { username: "sophia_harris",      name: "Sophia Harris",         email: "sophia.harris@orbit.app",         password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=15",     bio: "Cat mom | Plant parent | Coffee addict." },
    { username: "mia_martin",         name: "Mia Martin",            email: "mia.martin@orbit.app",            password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=16",     bio: "Just here to share good vibes." },
    { username: "charlotte_thompson", name: "Charlotte Thompson",    email: "charlotte.thompson@orbit.app",    password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=17",     bio: "Learning something new every single day." },
    { username: "amelia_young",       name: "Amelia Young",          email: "amelia.young@orbit.app",          password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=18",     bio: "Food blogger and recipe creator." },
    { username: "harper_allen",       name: "Harper Allen",          email: "harper.allen@orbit.app",          password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=19",     bio: "Frontend dev who loves clean UI." },
    { username: "evelyn_king",        name: "Evelyn King",           email: "evelyn.king@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=20",     bio: "Making the internet a better place." },
    { username: "benjamin_scott",     name: "Benjamin Scott",        email: "benjamin.scott@orbit.app",        password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=21",     bio: "Bookworm and coffee enthusiast." },
    { username: "alexander_green",    name: "Alexander Green",       email: "alexander.green@orbit.app",       password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=22",     bio: "Full-stack developer and open-source advocate." },
    { username: "henry_baker",        name: "Henry Baker",           email: "henry.baker@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=23",     bio: "Hiking trails and mountain views." },
    { username: "sebastian_adams",    name: "Sebastian Adams",       email: "sebastian.adams@orbit.app",       password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=24",     bio: "Minimalist. Thinker. Builder." },
    { username: "jackson_nelson",     name: "Jackson Nelson",        email: "jackson.nelson@orbit.app",        password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=25",     bio: "Amateur chef and food lover." },
    { username: "amir_hill",          name: "Amir Hill",             email: "amir.hill@orbit.app",             password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=26",     bio: "Passionate about AI and machine learning." },
    { username: "zaid_carter",        name: "Zaid Carter",           email: "zaid.carter@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=27",     bio: "Startup founder. Dreamer." },
    { username: "yusuf_mitchell",     name: "Yusuf Mitchell",        email: "yusuf.mitchell@orbit.app",        password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=28",     bio: "Photography and long drives." },
    { username: "omar_perez",         name: "Omar Perez",            email: "omar.perez@orbit.app",            password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=29",     bio: "Gaming | Music | Code." },
    { username: "khalid_roberts",     name: "Khalid Roberts",        email: "khalid.roberts@orbit.app",        password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=30",     bio: "Spreading positivity one post at a time." },
    { username: "sara_turner",        name: "Sara Turner",           email: "sara.turner@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=31",     bio: "Yoga, meditation, and green tea." },
    { username: "nour_phillips",      name: "Nour Phillips",         email: "nour.phillips@orbit.app",         password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=32",     bio: "Interior design enthusiast." },
    { username: "layla_campbell",     name: "Layla Campbell",        email: "layla.campbell@orbit.app",        password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=33",     bio: "Wanderlust and wandering feet." },
    { username: "fatima_parker",      name: "Fatima Parker",         email: "fatima.parker@orbit.app",         password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=34",     bio: "Science communicator and educator." },
    { username: "hana_evans",         name: "Hana Evans",            email: "hana.evans@orbit.app",            password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=35",     bio: "Illustrator and comic strip creator." },
    { username: "rania_edwards",      name: "Rania Edwards",         email: "rania.edwards@orbit.app",         password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=36",     bio: "Nurse by profession, writer by heart." },
    { username: "dina_collins",       name: "Dina Collins",          email: "dina.collins@orbit.app",          password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=37",     bio: "Chasing sunsets and good coffee." },
    { username: "yasmin_stewart",     name: "Yasmin Stewart",        email: "yasmin.stewart@orbit.app",        password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=38",     bio: "Poet and short-story writer." },
    { username: "tariq_sanchez",      name: "Tariq Sanchez",         email: "tariq.sanchez@orbit.app",         password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=39",     bio: "DevOps engineer who loves automation." },
    { username: "faris_morris",       name: "Faris Morris",          email: "faris.morris@orbit.app",          password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=40",     bio: "Cyclist and outdoor sports fan." },
    { username: "carlos_rogers",      name: "Carlos Rogers",         email: "carlos.rogers@orbit.app",         password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=41",     bio: "Musician and band member." },
    { username: "miguel_reed",        name: "Miguel Reed",           email: "miguel.reed@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=42",     bio: "Architecture student with big dreams." },
    { username: "sofia_cook",         name: "Sofia Cook",            email: "sofia.cook@orbit.app",            password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=43",     bio: "Digital marketer and content creator." },
    { username: "valentina_morgan",   name: "Valentina Morgan",      email: "valentina.morgan@orbit.app",      password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=44",     bio: "Sustainable living advocate." },
    { username: "diego_bell",         name: "Diego Bell",            email: "diego.bell@orbit.app",            password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=45",     bio: "Basketball fan and weekend player." },
    { username: "mateo_murphy",       name: "Mateo Murphy",          email: "mateo.murphy@orbit.app",          password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=46",     bio: "UX designer and usability nerd." },
    { username: "camila_bailey",      name: "Camila Bailey",         email: "camila.bailey@orbit.app",         password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=47",     bio: "Mental health advocate and listener." },
    { username: "lucia_rivera",       name: "Lucia Rivera",          email: "lucia.rivera@orbit.app",          password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=48",     bio: "Language learner — currently on Spanish." },
    { username: "ana_cooper",         name: "Ana Cooper",            email: "ana.cooper@orbit.app",            password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=49",     bio: "Biochemistry PhD student." },
    { username: "chen_wei",           name: "Chen Wei",              email: "chen.wei@orbit.app",              password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=50",     bio: "Data scientist and chess player." },
    { username: "wei_zhang",          name: "Wei Zhang",             email: "wei.zhang@orbit.app",             password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=51",     bio: "Backend engineer. Coffee before code." },
    { username: "mei_liu",            name: "Mei Liu",               email: "mei.liu@orbit.app",               password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=52",     bio: "Graphic designer and typography lover." },
    { username: "jun_wang",           name: "Jun Wang",              email: "jun.wang@orbit.app",              password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=53",     bio: "Competitive programmer." },
    { username: "xiao_chen",          name: "Xiao Chen",             email: "xiao.chen@orbit.app",             password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=54",     bio: "Blockchain and Web3 explorer." },
    { username: "yuki_tanaka",        name: "Yuki Tanaka",           email: "yuki.tanaka@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=55",     bio: "Anime fan and manga reader." },
    { username: "kenji_sato",         name: "Kenji Sato",            email: "kenji.sato@orbit.app",            password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=56",     bio: "Software architect and mentor." },
    { username: "sakura_ito",         name: "Sakura Ito",            email: "sakura.ito@orbit.app",            password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=57",     bio: "Florist and nature enthusiast." },
    { username: "hiro_yamamoto",      name: "Hiro Yamamoto",         email: "hiro.yamamoto@orbit.app",         password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=58",     bio: "Robotics engineer." },
    { username: "rin_kobayashi",      name: "Rin Kobayashi",         email: "rin.kobayashi@orbit.app",         password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=59",     bio: "Calligraphy artist and tea ceremony practitioner." },
    { username: "priya_patel",        name: "Priya Patel",           email: "priya.patel@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=60",     bio: "Fintech product manager." },
    { username: "arjun_kumar",        name: "Arjun Kumar",           email: "arjun.kumar@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=61",     bio: "Startup co-founder. Chai addict." },
    { username: "neha_singh",         name: "Neha Singh",            email: "neha.singh@orbit.app",            password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=62",     bio: "Data analyst and dashboard queen." },
    { username: "rahul_sharma",       name: "Rahul Sharma",          email: "rahul.sharma@orbit.app",          password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=63",     bio: "Mobile developer | Flutter fan." },
    { username: "ananya_gupta",       name: "Ananya Gupta",          email: "ananya.gupta@orbit.app",          password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=64",     bio: "Social entrepreneur and NGO volunteer." },
    { username: "vikram_mehta",       name: "Vikram Mehta",          email: "vikram.mehta@orbit.app",          password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=65",     bio: "Cloud architect and AWS certified." },
    { username: "kavya_reddy",        name: "Kavya Reddy",           email: "kavya.reddy@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=66",     bio: "Cybersecurity analyst." },
    { username: "rohan_verma",        name: "Rohan Verma",           email: "rohan.verma@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=67",     bio: "Game developer and Unity enthusiast." },
    { username: "shreya_nair",        name: "Shreya Nair",           email: "shreya.nair@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=68",     bio: "Journalist and podcast host." },
    { username: "ivan_petrov",        name: "Ivan Petrov",           email: "ivan.petrov@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=69",     bio: "Systems programmer and Rust evangelist." },
    { username: "elena_ivanova",      name: "Elena Ivanova",         email: "elena.ivanova@orbit.app",         password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=70",     bio: "Ballet dancer and choreographer." },
    { username: "dmitri_sokolov",     name: "Dmitri Sokolov",        email: "dmitri.sokolov@orbit.app",        password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=71",     bio: "Mathematician and puzzle enthusiast." },
    { username: "natasha_volkova",    name: "Natasha Volkova",       email: "natasha.volkova@orbit.app",       password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=72",     bio: "Linguist studying five languages." },
    { username: "alexei_morozov",     name: "Alexei Morozov",        email: "alexei.morozov@orbit.app",        password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=73",     bio: "Space enthusiast and astronomy hobbyist." },
    { username: "olga_kuznetsova",    name: "Olga Kuznetsova",       email: "olga.kuznetsova@orbit.app",       password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=74",     bio: "Pediatric nurse and mother of two." },
    { username: "sergei_lebedev",     name: "Sergei Lebedev",        email: "sergei.lebedev@orbit.app",        password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=75",     bio: "Astrophysics researcher." },
    { username: "vera_popova",        name: "Vera Popova",           email: "vera.popova@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=76",     bio: "Vintage fashion collector." },
    { username: "felix_mueller",      name: "Felix Mueller",         email: "felix.mueller@orbit.app",         password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=77",     bio: "Embedded systems engineer." },
    { username: "clara_schneider",    name: "Clara Schneider",       email: "clara.schneider@orbit.app",       password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=78",     bio: "Environmental activist and vegan chef." },
    { username: "max_fischer",        name: "Max Fischer",           email: "max.fischer@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=79",     bio: "Photographer and videographer." },
    { username: "lea_weber",          name: "Lea Weber",             email: "lea.weber@orbit.app",             password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=80",     bio: "UX researcher and accessibility advocate." },
    { username: "jonas_meyer",        name: "Jonas Meyer",           email: "jonas.meyer@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=81",     bio: "Backend dev who loves databases." },
    { username: "nina_hoffmann",      name: "Nina Hoffmann",         email: "nina.hoffmann@orbit.app",         password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=82",     bio: "Actress and theatre director." },
    { username: "leon_wagner",        name: "Leon Wagner",           email: "leon.wagner@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=83",     bio: "Competitive swimmer." },
    { username: "anna_becker",        name: "Anna Becker",           email: "anna.becker@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=84",     bio: "Clinical psychologist and researcher." },
    { username: "tom_harris",         name: "Tom Harris",            email: "tom.harris@orbit.app",            password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=85",     bio: "Crypto trader and DeFi explorer." },
    { username: "grace_clark",        name: "Grace Clark",           email: "grace.clark@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=86",     bio: "Librarian and book club organizer." },
    { username: "jack_lewis",         name: "Jack Lewis",            email: "jack.lewis@orbit.app",            password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=87",     bio: "IoT engineer and maker space regular." },
    { username: "lily_robinson",      name: "Lily Robinson",         email: "lily.robinson@orbit.app",         password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=88",     bio: "Dietitian and wellness coach." },
    { username: "sam_walker",         name: "Sam Walker",            email: "sam.walker@orbit.app",            password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=89",     bio: "DevRel engineer and community builder." },
    { username: "zoe_hall",           name: "Zoe Hall",              email: "zoe.hall@orbit.app",              password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=90",     bio: "Motion graphics designer." },
    { username: "ryan_allen",         name: "Ryan Allen",            email: "ryan.allen@orbit.app",            password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=91",     bio: "Sports journalist and podcaster." },
    { username: "chloe_young",        name: "Chloe Young",           email: "chloe.young@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=92",     bio: "Fashion blogger and stylist." },
    { username: "tyler_king",         name: "Tyler King",            email: "tyler.king@orbit.app",            password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=93",     bio: "Ethical hacker and CTF player." },
    { username: "ava_wright",         name: "Ava Wright",            email: "ava.wright@orbit.app",            password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=94",     bio: "Quantum computing researcher." },
    { username: "ethan_lopez",        name: "Ethan Lopez",           email: "ethan.lopez@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=95",     bio: "Mechanical engineer turned software dev." },
    { username: "maya_hill",          name: "Maya Hill",             email: "maya.hill@orbit.app",             password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=96",     bio: "Marine biologist and ocean conservationist." },
    { username: "dylan_scott",        name: "Dylan Scott",           email: "dylan.scott@orbit.app",           password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=97",     bio: "Indie game dev and pixel artist." },
    { username: "nora_green",         name: "Nora Green",            email: "nora.green@orbit.app",            password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=98",     bio: "Legal tech enthusiast." },
    { username: "jake_adams",         name: "Jake Adams",            email: "jake.adams@orbit.app",            password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=99",     bio: "Urban photographer and street art lover." },
    { username: "ruby_baker",         name: "Ruby Baker",            email: "ruby.baker@orbit.app",            password: "password123", role: "USER",  profilePicture: "https://i.pravatar.cc/150?u=100",    bio: "Biotech startup founder." },
  ];

  const users = [];
  for (let i = 0; i < userData.length; i++) {
    const row = { ...userData[i] };
    if (profilePicFiles.length > 0) {
      row.profilePicture = `assets/profile_pic/${profilePicFiles[i % profilePicFiles.length]}`;
    }
    const user = await prisma.user.create({ data: row });
    users.push(user);
  }
  console.log(`Created ${users.length} users (all with local profile photos, ${profilePicFiles.length} unique files).`);

  // ─── Posts ────────────────────────────────────────────────────────────────
  // 100 unique text-only captions (no repeats)
  const textPostContents = [
    "Just finished a 10km run — feeling unstoppable!",
    "Can we talk about how good this coffee is? Absolutely perfect morning.",
    "Working on a new project and the progress is looking amazing.",
    "Sunsets like this make everything worth it.",
    "Finally read that book everyone's been talking about. 10/10 recommend.",
    "Hot take: tabs are better than spaces. Fight me.",
    "Just cooked a new recipe and it turned out better than expected.",
    "Reminder: it's okay to take breaks and recharge.",
    "The city looks different at 2am. There's something magical about it.",
    "Three things I'm grateful for today: good food, good friends, good music.",
    "Started learning guitar last month — my fingers hurt but I love it.",
    "Nothing beats a lazy Sunday morning with nowhere to be.",
    "Productivity tip: turn off notifications for 2 hours a day. Life-changing.",
    "Just watched the most mind-bending documentary. Still processing it.",
    "Some days you just need to vent to the internet, you know?",
    "My plant grew a new leaf and I've never been more proud of anything.",
    "Road trip planned for next month. Any recommendations for stops?",
    "There's something therapeutic about organizing your entire desk.",
    "Tried a new café today — the vibes were immaculate.",
    "Completed my first open source contribution! Feels surreal.",
    "Overthinking is just creativity without direction.",
    "Finished a side project I've been putting off for months. Relief.",
    "The best investment you can make is in yourself.",
    "Morning routine update: added meditation and it's been a game changer.",
    "Lost track of time coding and suddenly it's midnight.",
    "New haircut! Sometimes small changes make a big difference.",
    "Been journaling for 30 days straight. Highly recommend it.",
    "Sometimes the most productive thing you can do is walk away.",
    "Watched the sunrise today. First time in a long time.",
    "Good news: the bug I've been chasing for days is finally fixed.",
    "Reading more physical books this year — no more doom scrolling.",
    "I think I finally understand recursion.",
    "Cooked for the whole family today. The kitchen smells amazing.",
    "Started a 30-day drawing challenge. Day 1 complete!",
    "The best conversations happen at midnight for some reason.",
    "Cleaned out my wardrobe. Feeling so much lighter.",
    "Took a digital detox this weekend. Would recommend.",
    "Just discovered a new band and I haven't listened to anything else.",
    "Made homemade bread for the first time. It actually worked!",
    "Grateful for the small things today — warm coffee, good light, quiet morning.",
    "Shipped something today that I'm genuinely proud of.",
    "The best way to predict the future is to build it.",
    "Sometimes you just need to start — perfection is the enemy of done.",
    "Weekend plans: absolutely nothing and I am thriving.",
    "Learning to say no is one of the best things I've ever done.",
    "Finally organized my photo library. Three years of memories.",
    "Hot take: sleep is the most underrated productivity hack.",
    "Wrote 1000 words today. Small wins count.",
    "Went for a walk without headphones. Heard actual birds. Recommend.",
    "Debugging at 11pm hits different. Not in a good way.",
    "Couldn't sleep so I started a new project. Classic.",
    "My desk setup finally looks how I imagined it.",
    "The first cup of coffee after a bad night is its own category of good.",
    "Finished a book in one sitting. No regrets.",
    "Sometimes you have to be the most experienced person in the room. That's terrifying.",
    "Put my phone in a drawer for six hours. I survived.",
    "New playlist dropped and my productivity is through the roof.",
    "Two-hour nap accidentally turned into eight hours. Starting over.",
    "Started cooking proper meals instead of ordering out. My wallet says thank you.",
    "Cleaned my inbox. Found emails from three years ago. Yikes.",
    "Tried to learn chess. Got destroyed by a seven-year-old. Back to studying.",
    "The best feeling: running a test suite and everything passes green.",
    "Five minutes of stretching changed my entire morning.",
    "My to-do list now has to-do lists. I think I have a problem.",
    "Walked a new route home and found a completely different neighbourhood.",
    "Finally finished setting up my dotfiles. Only took six months.",
    "Said yes to something terrifying this week. Update incoming.",
    "Coworker brought homemade cookies in. The office is a different place today.",
    "Three drafts in and I still don't know what I'm writing. Progress.",
    "Turned off the TV and read for two hours instead. The bar was low but I cleared it.",
    "Realised today that I've been mispronouncing a word for fifteen years.",
    "Deep cleaned the kitchen. Found things I forgot I owned.",
    "Finally replied to that message from two weeks ago. Only slightly embarrassing.",
    "Planted herbs on the balcony. My cooking era starts now.",
    "First time trying a standing desk. My back is very confused.",
    "Listened to an album all the way through without skipping. Rare energy.",
    "Made peace with my unread bookmark list. It's not happening.",
    "Turned a side project into a full-time obsession. Send help.",
    "The moment you stop chasing and start building is when things shift.",
    "Gym session done. The first five minutes were a lie but the rest was great.",
    "Reorganised my bookshelf by colour. Chaotic? Yes. Beautiful? Also yes.",
    "Took a proper lunch break today instead of eating at my desk. Revolutionary.",
    "Found my old sketchbook. The cringe-to-nostalgia ratio is high.",
    "Reached out to someone I lost touch with. They texted back immediately.",
    "Cooked dinner with no recipe and it worked. I am invincible.",
    "The neighbourhood cat adopted me. Not complaining.",
    "Put a timer on social media apps. Realised I had a problem. Starting to fix it.",
    "Made a vision board for the first time. Felt silly at first. Now I'm obsessed.",
    "Finally admitted I have too many unfinished projects. Step one: pick one.",
    "Joined a local running group. Did not die. Will return.",
    "Cleared my Downloads folder. Found receipts from 2021.",
    "Started writing down three wins every night before bed. Perspective shift.",
    "Took the long way home on purpose today. Worth every extra minute.",
    "Two monitors, one mission, zero distractions.",
    "Meal prepped on Sunday for the first time. My week is different already.",
    "Almost sent an email to the wrong person. My heart is still racing.",
    "Built a small automation for a task I was doing manually every day. Time back.",
    "Stayed curious today. Asked more questions than I answered.",
  ];

  function daysAgo(n) {
    return new Date(Date.now() - n * 86400000);
  }

  const posts = [];
  const maxImagePosts = Math.min(100, postPicFiles.length);
  const postImageFiles = postPicFiles.slice(0, maxImagePosts);
  let imageCursor = 0;
  let textCursor = 0;

  // Safety: track used captions to guarantee no duplicates
  const usedCaptions = new Set();

  function uniqueCaption(base) {
    if (!usedCaptions.has(base)) {
      usedCaptions.add(base);
      return base;
    }
    // Should not happen with our pool sizes, but safety suffix just in case
    let i = 2;
    while (usedCaptions.has(`${base} (${i})`)) i++;
    const result = `${base} (${i})`;
    usedCaptions.add(result);
    return result;
  }

  const postDefs = [];
  for (let i = 0; i < 200; i++) {
    const createdAt = daysAgo(370 - i);
    const authorIndex = (i * 11 + 3) % 100;
    const attachImage = imageCursor < postImageFiles.length && i % 2 === 0;

    if (attachImage) {
      const file = postImageFiles[imageCursor];
      const themed = captionAndCommentsForPostImage(file, imageCursor);
      imageCursor++;
      postDefs.push({
        content: uniqueCaption(themed.caption),
        authorIndex,
        createdAt,
        images: [encodeURI(`assets/post_pic/${file}`).replace(/#/g, "%23")],
        commentPair: themed.comments,
      });
    } else {
      const base = textPostContents[textCursor % textPostContents.length];
      textCursor++;
      postDefs.push({
        content: uniqueCaption(base),
        authorIndex,
        createdAt,
        images: undefined,
        commentPair: null,
      });
    }
  }

  for (const def of postDefs) {
    const data = {
      content: def.content,
      createdAt: def.createdAt,
      updatedAt: def.createdAt,
      authorId: users[def.authorIndex].id,
    };
    if (def.images && def.images.length) data.images = JSON.stringify(def.images);
    const post = await prisma.post.create({ data });
    posts.push(post);
  }
  console.log(
    `Created ${posts.length} posts (${postDefs.filter((d) => d.images).length} with local images, each file used once).`
  );

  // ─── Comments ─────────────────────────────────────────────────────────────
  const genericCommentDefs = [
    { content: "This is so relatable!",                      authorIndex: 1,  postIndex: 0  },
    { content: "Love this so much!",                         authorIndex: 2,  postIndex: 0  },
    { content: "Keep it up!",                                authorIndex: 3,  postIndex: 1  },
    { content: "This made my day.",                          authorIndex: 4,  postIndex: 1  },
    { content: "Agreed 100%!",                               authorIndex: 5,  postIndex: 2  },
    { content: "I needed to hear this today.",               authorIndex: 6,  postIndex: 2  },
    { content: "Same exact feeling!",                        authorIndex: 7,  postIndex: 3  },
    { content: "You're an inspiration!",                     authorIndex: 8,  postIndex: 3  },
    { content: "This is underrated content.",                authorIndex: 9,  postIndex: 4  },
    { content: "Couldn't agree more.",                       authorIndex: 10, postIndex: 4  },
    { content: "Wow, didn't think of it that way.",          authorIndex: 11, postIndex: 5  },
    { content: "Great perspective!",                         authorIndex: 12, postIndex: 5  },
    { content: "This is goals.",                             authorIndex: 13, postIndex: 6  },
    { content: "More of this please!",                       authorIndex: 14, postIndex: 6  },
    { content: "This is the content I'm here for.",          authorIndex: 15, postIndex: 7  },
    { content: "Sending good vibes your way!",               authorIndex: 16, postIndex: 7  },
    { content: "You always post the best stuff.",            authorIndex: 17, postIndex: 8  },
    { content: "Okay but this is exactly me.",               authorIndex: 18, postIndex: 8  },
    { content: "Saved this for later.",                      authorIndex: 19, postIndex: 9  },
    { content: "Real talk!",                                 authorIndex: 20, postIndex: 9  },
    { content: "This hit differently today.",                authorIndex: 21, postIndex: 10 },
    { content: "Appreciate you sharing this.",               authorIndex: 22, postIndex: 10 },
    { content: "We're all in this together!",                authorIndex: 23, postIndex: 11 },
    { content: "Facts only.",                                authorIndex: 24, postIndex: 11 },
    { content: "This deserves way more likes.",              authorIndex: 25, postIndex: 12 },
    { content: "Absolutely love this post.",                 authorIndex: 26, postIndex: 12 },
    { content: "This is pure gold.",                         authorIndex: 27, postIndex: 13 },
    { content: "You just described my life perfectly.",      authorIndex: 28, postIndex: 13 },
    { content: "Sharing this with everyone I know.",         authorIndex: 29, postIndex: 14 },
    { content: "This is so true and I feel seen.",           authorIndex: 30, postIndex: 14 },
    { content: "Thank you for posting this!",                authorIndex: 31, postIndex: 15 },
    { content: "Best post I've seen all week.",              authorIndex: 32, postIndex: 15 },
    { content: "Exactly what I needed today.",               authorIndex: 33, postIndex: 16 },
    { content: "Never thought about it like that before.",   authorIndex: 34, postIndex: 16 },
    { content: "This gives me so much motivation.",          authorIndex: 35, postIndex: 17 },
    { content: "You're doing amazing, seriously.",           authorIndex: 36, postIndex: 17 },
    { content: "I feel this in my soul.",                    authorIndex: 37, postIndex: 18 },
    { content: "Bookmarked. Coming back to this later.",     authorIndex: 38, postIndex: 18 },
    { content: "This community is everything.",              authorIndex: 39, postIndex: 19 },
    { content: "Words to live by honestly.",                 authorIndex: 40, postIndex: 19 },
    { content: "I aspire to have your energy.",              authorIndex: 41, postIndex: 20 },
    { content: "Can relate to this on a spiritual level.",   authorIndex: 42, postIndex: 20 },
    { content: "Thanks for the reminder!",                   authorIndex: 43, postIndex: 21 },
    { content: "This is why I love this platform.",          authorIndex: 44, postIndex: 21 },
    { content: "Short but so impactful.",                    authorIndex: 45, postIndex: 22 },
    { content: "One of the best things I've read today.",    authorIndex: 46, postIndex: 22 },
    { content: "Dropping gems as always!",                   authorIndex: 47, postIndex: 23 },
    { content: "My screen time is all this app now.",        authorIndex: 48, postIndex: 23 },
    { content: "How is this not more popular?",              authorIndex: 49, postIndex: 24 },
    { content: "Screenshotting this for my vision board.",   authorIndex: 50, postIndex: 24 },
    { content: "This is the push I needed.",                 authorIndex: 51, postIndex: 25 },
    { content: "Wholesome content, love it.",                authorIndex: 52, postIndex: 25 },
    { content: "You literally read my mind.",                authorIndex: 53, postIndex: 26 },
    { content: "Commenting so I can find this later.",       authorIndex: 54, postIndex: 26 },
    { content: "Absolutely relatable.",                      authorIndex: 55, postIndex: 27 },
    { content: "Keep doing what you're doing!",              authorIndex: 56, postIndex: 27 },
    { content: "A vibe and a half.",                         authorIndex: 57, postIndex: 28 },
    { content: "Sending love!",                              authorIndex: 58, postIndex: 28 },
    { content: "This is why I follow you.",                  authorIndex: 59, postIndex: 29 },
    { content: "Needed a good laugh, thanks!",               authorIndex: 60, postIndex: 29 },
    { content: "Facts. No notes.",                           authorIndex: 61, postIndex: 30 },
    { content: "Screaming at how accurate this is.",         authorIndex: 62, postIndex: 30 },
    { content: "You just unlocked a memory.",                authorIndex: 63, postIndex: 31 },
    { content: "Okay but why is this so deep?",              authorIndex: 64, postIndex: 31 },
    { content: "The best kind of post.",                     authorIndex: 65, postIndex: 32 },
    { content: "Straight facts.",                            authorIndex: 66, postIndex: 32 },
    { content: "I'm not crying, you're crying.",             authorIndex: 67, postIndex: 33 },
    { content: "Goals. Pure goals.",                         authorIndex: 68, postIndex: 33 },
    { content: "This is everything.",                        authorIndex: 69, postIndex: 34 },
    { content: "Can we be friends?",                         authorIndex: 70, postIndex: 34 },
    { content: "Said what needed to be said.",               authorIndex: 71, postIndex: 35 },
    { content: "This is my new motto.",                      authorIndex: 72, postIndex: 35 },
    { content: "Top tier content.",                          authorIndex: 73, postIndex: 36 },
    { content: "Every time you post it's a win.",            authorIndex: 74, postIndex: 36 },
    { content: "Adding this to my daily reminders.",         authorIndex: 75, postIndex: 37 },
    { content: "Not me tearing up a little.",                authorIndex: 76, postIndex: 37 },
    { content: "Perfectly put.",                             authorIndex: 77, postIndex: 38 },
    { content: "I live for these posts.",                    authorIndex: 78, postIndex: 38 },
    { content: "This is why the internet exists.",           authorIndex: 79, postIndex: 39 },
    { content: "Absolute fire post.",                        authorIndex: 80, postIndex: 39 },
    { content: "Wholesome and needed.",                      authorIndex: 81, postIndex: 40 },
    { content: "Never skip a post from you.",                authorIndex: 82, postIndex: 40 },
    { content: "Words of wisdom right here.",                authorIndex: 83, postIndex: 41 },
    { content: "Taking notes!",                              authorIndex: 84, postIndex: 41 },
    { content: "I feel so understood right now.",            authorIndex: 85, postIndex: 42 },
    { content: "This resonated so much.",                    authorIndex: 86, postIndex: 42 },
    { content: "Shoutout to everyone who needed this.",      authorIndex: 87, postIndex: 43 },
    { content: "My exact thoughts, perfectly worded.",       authorIndex: 88, postIndex: 43 },
    { content: "A+ content as always.",                      authorIndex: 89, postIndex: 44 },
    { content: "You never miss.",                            authorIndex: 90, postIndex: 44 },
    { content: "This brightened my whole day.",              authorIndex: 91, postIndex: 45 },
    { content: "Quality > quantity, and this is quality.",   authorIndex: 92, postIndex: 45 },
    { content: "Real ones know.",                            authorIndex: 93, postIndex: 46 },
    { content: "Following for more content like this.",      authorIndex: 94, postIndex: 46 },
    { content: "The way this just described my week.",       authorIndex: 95, postIndex: 47 },
    { content: "This is art.",                               authorIndex: 96, postIndex: 47 },
    { content: "Officially my new favorite account.",        authorIndex: 97, postIndex: 48 },
    { content: "Long may you post.",                         authorIndex: 98, postIndex: 48 },
    { content: "This is the moment.",                        authorIndex: 99, postIndex: 49 },
    { content: "I needed to see this today, truly.",         authorIndex: 0,  postIndex: 49 },
  ];

  let commentCount = 0;
  for (let pi = 0; pi < postDefs.length; pi++) {
    const def = postDefs[pi];
    if (def.commentPair) {
      for (let j = 0; j < def.commentPair.length; j++) {
        await prisma.comment.create({
          data: {
            content: def.commentPair[j],
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 300)),
            authorId: users[(pi + j * 19 + 1) % 100].id,
            postId: posts[pi].id,
          },
        });
        commentCount++;
      }
    }
  }

  for (const c of genericCommentDefs) {
    const pdef = postDefs[c.postIndex];
    if (pdef.commentPair) continue;
    await prisma.comment.create({
      data: {
        content: c.content,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 300)),
        authorId: users[c.authorIndex].id,
        postId: posts[c.postIndex].id,
      },
    });
    commentCount++;
  }
  console.log(`Created ${commentCount} comments.`);

  // ─── Likes ────────────────────────────────────────────────────────────────
  const likeDefs = [
    { userIndex: 1,  postIndex: 0  }, { userIndex: 2,  postIndex: 0  }, { userIndex: 3,  postIndex: 0  },
    { userIndex: 4,  postIndex: 1  }, { userIndex: 5,  postIndex: 1  }, { userIndex: 6,  postIndex: 1  },
    { userIndex: 7,  postIndex: 2  }, { userIndex: 8,  postIndex: 2  }, { userIndex: 9,  postIndex: 2  },
    { userIndex: 10, postIndex: 3  }, { userIndex: 11, postIndex: 3  }, { userIndex: 12, postIndex: 3  },
    { userIndex: 13, postIndex: 4  }, { userIndex: 14, postIndex: 4  }, { userIndex: 15, postIndex: 4  },
    { userIndex: 16, postIndex: 5  }, { userIndex: 17, postIndex: 5  }, { userIndex: 18, postIndex: 5  },
    { userIndex: 19, postIndex: 6  }, { userIndex: 20, postIndex: 6  }, { userIndex: 21, postIndex: 6  },
    { userIndex: 22, postIndex: 7  }, { userIndex: 23, postIndex: 7  }, { userIndex: 24, postIndex: 7  },
    { userIndex: 25, postIndex: 8  }, { userIndex: 26, postIndex: 8  }, { userIndex: 27, postIndex: 8  },
    { userIndex: 28, postIndex: 9  }, { userIndex: 29, postIndex: 9  }, { userIndex: 30, postIndex: 9  },
    { userIndex: 31, postIndex: 10 }, { userIndex: 32, postIndex: 10 }, { userIndex: 33, postIndex: 10 },
    { userIndex: 34, postIndex: 11 }, { userIndex: 35, postIndex: 11 }, { userIndex: 36, postIndex: 11 },
    { userIndex: 37, postIndex: 12 }, { userIndex: 38, postIndex: 12 }, { userIndex: 39, postIndex: 12 },
    { userIndex: 40, postIndex: 13 }, { userIndex: 41, postIndex: 13 }, { userIndex: 42, postIndex: 13 },
    { userIndex: 43, postIndex: 14 }, { userIndex: 44, postIndex: 14 }, { userIndex: 45, postIndex: 14 },
    { userIndex: 46, postIndex: 15 }, { userIndex: 47, postIndex: 15 }, { userIndex: 48, postIndex: 15 },
    { userIndex: 49, postIndex: 16 }, { userIndex: 50, postIndex: 16 }, { userIndex: 51, postIndex: 16 },
    { userIndex: 52, postIndex: 17 }, { userIndex: 53, postIndex: 17 }, { userIndex: 54, postIndex: 17 },
    { userIndex: 55, postIndex: 18 }, { userIndex: 56, postIndex: 18 }, { userIndex: 57, postIndex: 18 },
    { userIndex: 58, postIndex: 19 }, { userIndex: 59, postIndex: 19 }, { userIndex: 60, postIndex: 19 },
    { userIndex: 61, postIndex: 20 }, { userIndex: 62, postIndex: 20 }, { userIndex: 63, postIndex: 20 },
    { userIndex: 64, postIndex: 21 }, { userIndex: 65, postIndex: 21 }, { userIndex: 66, postIndex: 21 },
    { userIndex: 67, postIndex: 22 }, { userIndex: 68, postIndex: 22 }, { userIndex: 69, postIndex: 22 },
    { userIndex: 70, postIndex: 23 }, { userIndex: 71, postIndex: 23 }, { userIndex: 72, postIndex: 23 },
    { userIndex: 73, postIndex: 24 }, { userIndex: 74, postIndex: 24 }, { userIndex: 75, postIndex: 24 },
    { userIndex: 76, postIndex: 25 }, { userIndex: 77, postIndex: 25 }, { userIndex: 78, postIndex: 25 },
    { userIndex: 79, postIndex: 26 }, { userIndex: 80, postIndex: 26 }, { userIndex: 81, postIndex: 26 },
    { userIndex: 82, postIndex: 27 }, { userIndex: 83, postIndex: 27 }, { userIndex: 84, postIndex: 27 },
    { userIndex: 85, postIndex: 28 }, { userIndex: 86, postIndex: 28 }, { userIndex: 87, postIndex: 28 },
    { userIndex: 88, postIndex: 29 }, { userIndex: 89, postIndex: 29 }, { userIndex: 90, postIndex: 29 },
    { userIndex: 91, postIndex: 30 }, { userIndex: 92, postIndex: 30 }, { userIndex: 93, postIndex: 30 },
    { userIndex: 94, postIndex: 31 }, { userIndex: 95, postIndex: 31 }, { userIndex: 96, postIndex: 31 },
    { userIndex: 97, postIndex: 32 }, { userIndex: 98, postIndex: 32 }, { userIndex: 99, postIndex: 32 },
    { userIndex: 0,  postIndex: 33 }, { userIndex: 1,  postIndex: 33 }, { userIndex: 2,  postIndex: 33 },
    { userIndex: 3,  postIndex: 34 }, { userIndex: 4,  postIndex: 34 }, { userIndex: 5,  postIndex: 34 },
    { userIndex: 6,  postIndex: 35 }, { userIndex: 7,  postIndex: 35 }, { userIndex: 8,  postIndex: 35 },
    { userIndex: 9,  postIndex: 36 }, { userIndex: 10, postIndex: 36 }, { userIndex: 11, postIndex: 36 },
    { userIndex: 12, postIndex: 37 }, { userIndex: 13, postIndex: 37 }, { userIndex: 14, postIndex: 37 },
    { userIndex: 15, postIndex: 38 }, { userIndex: 16, postIndex: 38 }, { userIndex: 17, postIndex: 38 },
    { userIndex: 18, postIndex: 39 }, { userIndex: 19, postIndex: 39 }, { userIndex: 20, postIndex: 39 },
    { userIndex: 21, postIndex: 40 }, { userIndex: 22, postIndex: 40 }, { userIndex: 23, postIndex: 40 },
    { userIndex: 24, postIndex: 41 }, { userIndex: 25, postIndex: 41 }, { userIndex: 26, postIndex: 41 },
    { userIndex: 27, postIndex: 42 }, { userIndex: 28, postIndex: 42 }, { userIndex: 29, postIndex: 42 },
    { userIndex: 30, postIndex: 43 }, { userIndex: 31, postIndex: 43 }, { userIndex: 32, postIndex: 43 },
    { userIndex: 33, postIndex: 44 }, { userIndex: 34, postIndex: 44 }, { userIndex: 35, postIndex: 44 },
    { userIndex: 36, postIndex: 45 }, { userIndex: 37, postIndex: 45 }, { userIndex: 38, postIndex: 45 },
    { userIndex: 39, postIndex: 46 }, { userIndex: 40, postIndex: 46 }, { userIndex: 41, postIndex: 46 },
    { userIndex: 42, postIndex: 47 }, { userIndex: 43, postIndex: 47 }, { userIndex: 44, postIndex: 47 },
    { userIndex: 45, postIndex: 48 }, { userIndex: 46, postIndex: 48 }, { userIndex: 47, postIndex: 48 },
    { userIndex: 48, postIndex: 49 }, { userIndex: 49, postIndex: 49 }, { userIndex: 50, postIndex: 49 },
    { userIndex: 51, postIndex: 50 }, { userIndex: 52, postIndex: 51 }, { userIndex: 53, postIndex: 52 },
    { userIndex: 54, postIndex: 53 }, { userIndex: 55, postIndex: 54 }, { userIndex: 56, postIndex: 55 },
    { userIndex: 57, postIndex: 56 }, { userIndex: 58, postIndex: 57 }, { userIndex: 59, postIndex: 58 },
    { userIndex: 60, postIndex: 59 }, { userIndex: 61, postIndex: 60 }, { userIndex: 62, postIndex: 61 },
    { userIndex: 63, postIndex: 62 }, { userIndex: 64, postIndex: 63 }, { userIndex: 65, postIndex: 64 },
    { userIndex: 66, postIndex: 65 }, { userIndex: 67, postIndex: 66 }, { userIndex: 68, postIndex: 67 },
    { userIndex: 69, postIndex: 68 }, { userIndex: 70, postIndex: 69 }, { userIndex: 71, postIndex: 70 },
    { userIndex: 72, postIndex: 71 }, { userIndex: 73, postIndex: 72 }, { userIndex: 74, postIndex: 73 },
    { userIndex: 75, postIndex: 74 }, { userIndex: 76, postIndex: 75 }, { userIndex: 77, postIndex: 76 },
    { userIndex: 78, postIndex: 77 }, { userIndex: 79, postIndex: 78 }, { userIndex: 80, postIndex: 79 },
    { userIndex: 81, postIndex: 80 }, { userIndex: 82, postIndex: 81 }, { userIndex: 83, postIndex: 82 },
    { userIndex: 84, postIndex: 83 }, { userIndex: 85, postIndex: 84 }, { userIndex: 86, postIndex: 85 },
    { userIndex: 87, postIndex: 86 }, { userIndex: 88, postIndex: 87 }, { userIndex: 89, postIndex: 88 },
    { userIndex: 90, postIndex: 89 }, { userIndex: 91, postIndex: 90 }, { userIndex: 92, postIndex: 91 },
    { userIndex: 93, postIndex: 92 }, { userIndex: 94, postIndex: 93 }, { userIndex: 95, postIndex: 94 },
    { userIndex: 96, postIndex: 95 }, { userIndex: 97, postIndex: 96 }, { userIndex: 98, postIndex: 97 },
    { userIndex: 99, postIndex: 98 }, { userIndex: 0,  postIndex: 99 },
  ];

  for (const def of likeDefs) {
    await prisma.like.create({
      data: {
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 300)),
        userId: users[def.userIndex].id,
        postId: posts[def.postIndex].id,
      },
    });
  }
  console.log(`Created ${likeDefs.length} likes.`);

  // ─── Follows ──────────────────────────────────────────────────────────────
  const followDefs = [
    { followerIndex: 0,  followingIndex: 1  }, { followerIndex: 0,  followingIndex: 2  },
    { followerIndex: 1,  followingIndex: 0  }, { followerIndex: 1,  followingIndex: 3  },
    { followerIndex: 2,  followingIndex: 0  }, { followerIndex: 2,  followingIndex: 4  },
    { followerIndex: 3,  followingIndex: 1  }, { followerIndex: 3,  followingIndex: 5  },
    { followerIndex: 4,  followingIndex: 2  }, { followerIndex: 4,  followingIndex: 6  },
    { followerIndex: 5,  followingIndex: 3  }, { followerIndex: 5,  followingIndex: 7  },
    { followerIndex: 6,  followingIndex: 4  }, { followerIndex: 6,  followingIndex: 8  },
    { followerIndex: 7,  followingIndex: 5  }, { followerIndex: 7,  followingIndex: 9  },
    { followerIndex: 8,  followingIndex: 6  }, { followerIndex: 8,  followingIndex: 10 },
    { followerIndex: 9,  followingIndex: 7  }, { followerIndex: 9,  followingIndex: 11 },
    { followerIndex: 10, followingIndex: 8  }, { followerIndex: 10, followingIndex: 12 },
    { followerIndex: 11, followingIndex: 9  }, { followerIndex: 11, followingIndex: 13 },
    { followerIndex: 12, followingIndex: 10 }, { followerIndex: 12, followingIndex: 14 },
    { followerIndex: 13, followingIndex: 11 }, { followerIndex: 13, followingIndex: 15 },
    { followerIndex: 14, followingIndex: 12 }, { followerIndex: 14, followingIndex: 16 },
    { followerIndex: 15, followingIndex: 13 }, { followerIndex: 15, followingIndex: 17 },
    { followerIndex: 16, followingIndex: 14 }, { followerIndex: 16, followingIndex: 18 },
    { followerIndex: 17, followingIndex: 15 }, { followerIndex: 17, followingIndex: 19 },
    { followerIndex: 18, followingIndex: 16 }, { followerIndex: 18, followingIndex: 20 },
    { followerIndex: 19, followingIndex: 17 }, { followerIndex: 19, followingIndex: 21 },
    { followerIndex: 20, followingIndex: 18 }, { followerIndex: 20, followingIndex: 22 },
    { followerIndex: 21, followingIndex: 19 }, { followerIndex: 21, followingIndex: 23 },
    { followerIndex: 22, followingIndex: 20 }, { followerIndex: 22, followingIndex: 24 },
    { followerIndex: 23, followingIndex: 21 }, { followerIndex: 23, followingIndex: 25 },
    { followerIndex: 24, followingIndex: 22 }, { followerIndex: 24, followingIndex: 26 },
    { followerIndex: 25, followingIndex: 23 }, { followerIndex: 25, followingIndex: 27 },
    { followerIndex: 26, followingIndex: 24 }, { followerIndex: 26, followingIndex: 28 },
    { followerIndex: 27, followingIndex: 25 }, { followerIndex: 27, followingIndex: 29 },
    { followerIndex: 28, followingIndex: 26 }, { followerIndex: 28, followingIndex: 30 },
    { followerIndex: 29, followingIndex: 27 }, { followerIndex: 29, followingIndex: 31 },
    { followerIndex: 30, followingIndex: 28 }, { followerIndex: 30, followingIndex: 32 },
    { followerIndex: 31, followingIndex: 29 }, { followerIndex: 31, followingIndex: 33 },
    { followerIndex: 32, followingIndex: 30 }, { followerIndex: 32, followingIndex: 34 },
    { followerIndex: 33, followingIndex: 31 }, { followerIndex: 33, followingIndex: 35 },
    { followerIndex: 34, followingIndex: 32 }, { followerIndex: 34, followingIndex: 36 },
    { followerIndex: 35, followingIndex: 33 }, { followerIndex: 35, followingIndex: 37 },
    { followerIndex: 36, followingIndex: 34 }, { followerIndex: 36, followingIndex: 38 },
    { followerIndex: 37, followingIndex: 35 }, { followerIndex: 37, followingIndex: 39 },
    { followerIndex: 38, followingIndex: 36 }, { followerIndex: 38, followingIndex: 40 },
    { followerIndex: 39, followingIndex: 37 }, { followerIndex: 39, followingIndex: 41 },
    { followerIndex: 40, followingIndex: 38 }, { followerIndex: 40, followingIndex: 42 },
    { followerIndex: 41, followingIndex: 39 }, { followerIndex: 41, followingIndex: 43 },
    { followerIndex: 42, followingIndex: 40 }, { followerIndex: 42, followingIndex: 44 },
    { followerIndex: 43, followingIndex: 41 }, { followerIndex: 43, followingIndex: 45 },
    { followerIndex: 44, followingIndex: 42 }, { followerIndex: 44, followingIndex: 46 },
    { followerIndex: 45, followingIndex: 43 }, { followerIndex: 45, followingIndex: 47 },
    { followerIndex: 46, followingIndex: 44 }, { followerIndex: 46, followingIndex: 48 },
    { followerIndex: 47, followingIndex: 45 }, { followerIndex: 47, followingIndex: 49 },
    { followerIndex: 48, followingIndex: 46 }, { followerIndex: 48, followingIndex: 50 },
    { followerIndex: 49, followingIndex: 47 }, { followerIndex: 49, followingIndex: 51 },
    { followerIndex: 50, followingIndex: 48 }, { followerIndex: 50, followingIndex: 52 },
    { followerIndex: 51, followingIndex: 49 }, { followerIndex: 51, followingIndex: 53 },
    { followerIndex: 52, followingIndex: 50 }, { followerIndex: 52, followingIndex: 54 },
    { followerIndex: 53, followingIndex: 51 }, { followerIndex: 53, followingIndex: 55 },
    { followerIndex: 54, followingIndex: 52 }, { followerIndex: 54, followingIndex: 56 },
    { followerIndex: 55, followingIndex: 53 }, { followerIndex: 55, followingIndex: 57 },
    { followerIndex: 56, followingIndex: 54 }, { followerIndex: 56, followingIndex: 58 },
    { followerIndex: 57, followingIndex: 55 }, { followerIndex: 57, followingIndex: 59 },
    { followerIndex: 58, followingIndex: 56 }, { followerIndex: 58, followingIndex: 60 },
    { followerIndex: 59, followingIndex: 57 }, { followerIndex: 59, followingIndex: 61 },
    { followerIndex: 60, followingIndex: 58 }, { followerIndex: 60, followingIndex: 62 },
    { followerIndex: 61, followingIndex: 59 }, { followerIndex: 61, followingIndex: 63 },
    { followerIndex: 62, followingIndex: 60 }, { followerIndex: 62, followingIndex: 64 },
    { followerIndex: 63, followingIndex: 61 }, { followerIndex: 63, followingIndex: 65 },
    { followerIndex: 64, followingIndex: 62 }, { followerIndex: 64, followingIndex: 66 },
    { followerIndex: 65, followingIndex: 63 }, { followerIndex: 65, followingIndex: 67 },
    { followerIndex: 66, followingIndex: 64 }, { followerIndex: 66, followingIndex: 68 },
    { followerIndex: 67, followingIndex: 65 }, { followerIndex: 67, followingIndex: 69 },
    { followerIndex: 68, followingIndex: 66 }, { followerIndex: 68, followingIndex: 70 },
    { followerIndex: 69, followingIndex: 67 }, { followerIndex: 69, followingIndex: 71 },
    { followerIndex: 70, followingIndex: 68 }, { followerIndex: 70, followingIndex: 72 },
    { followerIndex: 71, followingIndex: 69 }, { followerIndex: 71, followingIndex: 73 },
    { followerIndex: 72, followingIndex: 70 }, { followerIndex: 72, followingIndex: 74 },
    { followerIndex: 73, followingIndex: 71 }, { followerIndex: 73, followingIndex: 75 },
    { followerIndex: 74, followingIndex: 72 }, { followerIndex: 74, followingIndex: 76 },
    { followerIndex: 75, followingIndex: 73 }, { followerIndex: 75, followingIndex: 77 },
    { followerIndex: 76, followingIndex: 74 }, { followerIndex: 76, followingIndex: 78 },
    { followerIndex: 77, followingIndex: 75 }, { followerIndex: 77, followingIndex: 79 },
    { followerIndex: 78, followingIndex: 76 }, { followerIndex: 78, followingIndex: 80 },
    { followerIndex: 79, followingIndex: 77 }, { followerIndex: 79, followingIndex: 81 },
    { followerIndex: 80, followingIndex: 78 }, { followerIndex: 80, followingIndex: 82 },
    { followerIndex: 81, followingIndex: 79 }, { followerIndex: 81, followingIndex: 83 },
    { followerIndex: 82, followingIndex: 80 }, { followerIndex: 82, followingIndex: 84 },
    { followerIndex: 83, followingIndex: 81 }, { followerIndex: 83, followingIndex: 85 },
    { followerIndex: 84, followingIndex: 82 }, { followerIndex: 84, followingIndex: 86 },
    { followerIndex: 85, followingIndex: 83 }, { followerIndex: 85, followingIndex: 87 },
    { followerIndex: 86, followingIndex: 84 }, { followerIndex: 86, followingIndex: 88 },
    { followerIndex: 87, followingIndex: 85 }, { followerIndex: 87, followingIndex: 89 },
    { followerIndex: 88, followingIndex: 86 }, { followerIndex: 88, followingIndex: 90 },
    { followerIndex: 89, followingIndex: 87 }, { followerIndex: 89, followingIndex: 91 },
    { followerIndex: 90, followingIndex: 88 }, { followerIndex: 90, followingIndex: 92 },
    { followerIndex: 91, followingIndex: 89 }, { followerIndex: 91, followingIndex: 93 },
    { followerIndex: 92, followingIndex: 90 }, { followerIndex: 92, followingIndex: 94 },
    { followerIndex: 93, followingIndex: 91 }, { followerIndex: 93, followingIndex: 95 },
    { followerIndex: 94, followingIndex: 92 }, { followerIndex: 94, followingIndex: 96 },
    { followerIndex: 95, followingIndex: 93 }, { followerIndex: 95, followingIndex: 97 },
    { followerIndex: 96, followingIndex: 94 }, { followerIndex: 96, followingIndex: 98 },
    { followerIndex: 97, followingIndex: 95 }, { followerIndex: 97, followingIndex: 99 },
    { followerIndex: 98, followingIndex: 96 }, { followerIndex: 98, followingIndex: 0  },
    { followerIndex: 99, followingIndex: 97 }, { followerIndex: 99, followingIndex: 1  },
  ];

  for (const def of followDefs) {
    await prisma.follow.create({
      data: {
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 400)),
        followerId: users[def.followerIndex].id,
        followingId: users[def.followingIndex].id,
      },
    });
  }

  // Make the test user (index 0) follow everyone, and everyone follow the test user
  for (let i = 1; i < users.length; i++) {
    await prisma.follow.create({
      data: { followerId: users[0].id, followingId: users[i].id },
    }).catch(() => {});
    await prisma.follow.create({
      data: { followerId: users[i].id, followingId: users[0].id },
    }).catch(() => {});
  }

  console.log(`Created ${followDefs.length} specific follows + test user follows.`);
  console.log("\nDone! Database seeded successfully.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
