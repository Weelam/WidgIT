// e1.tml

const tweets = document.querySelectorAll(".tweet");

const tweetImages = document.querySelectorAll(".tweetContentPicture")

console.log(tweets, tweetImages)

// assign a the class name widgit-widget to whatever element you desire
tweets.forEach(tweet => {
    tweet.classList.add("widgit-widget");
})

tweetImages.forEach(tweetImage => {
    tweetImage.classList.add("widgit-widget");
})

// limitations
