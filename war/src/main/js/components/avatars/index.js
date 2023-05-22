import behaviorShim from "@/util/behavior-shim";

const primaryColors = [
  "orange",
  "red",
  "green",
  "blue",
  "pink",
  "brown",
  "cyan",
  "indigo",
  "yellow",
  "purple",
];
Array.from(primaryColors).forEach((color) => {
  primaryColors.push("light-" + color);
  primaryColors.push("dark-" + color);
})
const secondaryColors = Array.from(primaryColors).reverse();

function getInitials(name) {
  return name
    .match(/(^\S\S?|\b\S)?/g)
    .join("")
    .match(/(^\S|\S$)?/g)
    .join("")
    .toUpperCase();
}

function generateColorIndex(seed, maximum) {
  // Generate a random number based on the string seed
  let random = 0;
  for (let i = 0; i < seed.length; i++) {
    random += seed.charCodeAt(i);
  }
  random = random % maximum;

  return random;
}

function shuffleList(list, seed) {
  // Create a copy of the original list
  var shuffledList = list.slice();

  // Set the random seed
  var random = function() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // Perform the Fisher-Yates shuffle
  for (var i = shuffledList.length - 1; i > 0; i--) {
    var j = Math.floor(random() * (i + 1));
    var temp = shuffledList[i];
    shuffledList[i] = shuffledList[j];
    shuffledList[j] = temp;
  }

  return shuffledList;
}

function init() {
  behaviorShim.specify(".jenkins-avatar", "-avatar-", 1000, (avatar) => {
    const fullname = avatar.dataset.fullname;
    const initials = getInitials(fullname);
    const initialsElement = avatar.querySelector(".jenkins-avatar__initials");
    const colorIndex = generateColorIndex(fullname, primaryColors.length);
    const angle = `${generateColorIndex(fullname, 360)}deg`;
    const primaryColor = `var(--${primaryColors[colorIndex]})`;
    const secondaryColor = `var(--${secondaryColors[colorIndex]})`;

    avatar.style.setProperty("--gradient-angle", angle);
    avatar.style.setProperty("--gradient-1", primaryColor);
    avatar.style.setProperty("--gradient-2", secondaryColor);
    // initialsElement.dataset.initials = initials;
    initialsElement.textContent = initials;
  });
}

export default { init };
