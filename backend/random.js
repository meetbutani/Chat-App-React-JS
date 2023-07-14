
const firstNames = ["Aarav", "Diya", "Kabir", "Neha", "Rohan", "Zara", "Arjun", "Lakshmi", "Dev", "Riya", "Karan", "Anaya", "Raj", "Pooja", "Arnav", "Kavya", "Sidharth", "Nisha", "Ved", "Tanvi"];
const lastNames = ["Sharma", "Patel", "Khan", "Singh", "Reddy", "Jain", "Verma", "Chaudhary", "Rai", "Gupta", "Das", "Roy", "Kumar", "Saha", "Bose", "Nair", "Chopra", "Dutta", "Malik", "Sethi"];
const jobPositions = ["Software Engineer", "Product Manager", "Designer", "Marketing Specialist", "Sales Representative", "Accountant", "Teacher", "Nurse", "Lawyer", "Doctor", "Journalist", "Chef", "Architect", "Dentist", "Pharmacist", "Engineer", "Consultant", "Analyst", "Writer", "Artist"];
const bios = [
    "A passionate coder and a lifelong learner. Loves to explore new technologies and solve problems.",
    "A creative writer and a avid reader. Enjoys crafting stories and poems that inspire and entertain.",
    "A fitness enthusiast and a health coach. Helps people achieve their wellness goals and live healthier lives.",
    "A travel blogger and a photographer. Shares his/her adventures and experiences from around the world.",
    "A music producer and a singer. Creates original songs and beats that express his/her emotions and style.",
    "A graphic designer and a illustrator. Designs logos, posters, flyers and more for various clients and projects.",
    "A teacher and a mentor. Teaches math, science, or any subject to students of all ages and levels.",
    "A lawyer and a activist. Fights for justice, human rights, and social change in the courtroom and beyond.",
    "A chef and a foodie. Cooks delicious dishes and experiments with different cuisines and ingredients.",
    "A gamer and a streamer. Plays video games and broadcasts his/her gameplay to an online audience.",
    "A fashion designer and a stylist. Creates trendy outfits and accessories that showcase his/her personality and taste.",
    "A entrepreneur and a innovator. Launches startups and develops products that solve real-world problems.",
    "A artist and a curator. Paints, sculpts, or draws artworks that express his/her vision and message.",
    "A doctor and a researcher. Treats patients and conducts medical studies to improve health outcomes and knowledge.",
    "A engineer and a inventor. Builds machines, devices, or systems that enhance efficiency and functionality.",
    "A comedian and a podcaster. Makes people laugh with his/her jokes and stories on various topics and platforms.",
    "A dancer and a choreographer. Performs and creates dance routines that showcase his/her skills and passion.",
    "A journalist and a author. Reports news and writes books on topics that interest him/her or the public.",
    "A astrologer and a psychic. Reads horoscopes, tarot cards, or palms to reveal insights about the past, present, or future.",
    "A gardener and a florist. Grows plants, flowers, or vegetables and arranges them into beautiful bouquets or baskets."
];

const onlinelist = ["on", "rec", "off"];

const mailDomains = ["@gmail.com", "@example.com", "@yahoo.com", "@marwadiuniversity.ac.in"];

function generatePhone() {
    return Math.floor(Math.random() * 1000000000);
}

function randomDate() {
    // Get the timestamp of the start and end dates
    var startTimestamp = new Date(1980, 0, 1).getTime();
    var endTimestamp = new Date(2020, 11, 31).getTime();

    // Generate a random timestamp between the start and end timestamps
    var randomTimestamp = Math.floor(Math.random() * (endTimestamp - startTimestamp + 1)) + startTimestamp;

    // Create a new date object from the random timestamp
    var randomDate = new Date(randomTimestamp);

    // Return the random date
    return randomDate.toISOString().split("T")[0];
}

function generateUserData() {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    const userData = {
        avatar: "https://i.pravatar.cc/150?img=" + (Math.floor(Math.random() * (50 - 1 + 1)) + 1),
        firstName: firstName,
        lastName: lastName,
        jobPos: jobPositions[Math.floor(Math.random() * jobPositions.length)],
        bio: bios[Math.floor(Math.random() * bios.length)],
        primEmail: (firstName + "." + lastName).toLowerCase() + mailDomains[Math.floor(Math.random() * mailDomains.length)],
        primPhone: generatePhone(),
        bday: randomDate(),
        online: onlinelist[Math.floor(Math.random() * onlinelist.length)],
    };

    if (Math.random() < 0.5) {
        userData.secEmail = (firstName + lastName).toLowerCase() + mailDomains[Math.floor(Math.random() * mailDomains.length)];
    }
    if (Math.random() < 0.5) {
        userData.meeting = "http://go.betacall.com/meet/" + (firstName[0] + "." + lastName).toLowerCase();
    }
    if (Math.random() < 0.5) {
        userData.secPhone = generatePhone();
    }
    if (Math.random() < 0.5) {
        userData.facebook = "https://www.facebook.com/" + (firstName + "_" + lastName).toLowerCase();
    }
    if (Math.random() < 0.5) {
        userData.pinterest = "https://www.pinterest.com/" + (firstName + "_" + lastName).toLowerCase();
    }
    if (Math.random() < 0.5) {
        userData.twitter = "https://www.twitter.com/" + (firstName + "_" + lastName).toLowerCase();
    }
    if (Math.random() < 0.5) {
        userData.linkedin = "https://www.linkedin.com/" + (firstName + "_" + lastName).toLowerCase();
    }
    if (Math.random() < 0.5) {
        userData.google = "https://www.google.com/" + (firstName + "_" + lastName).toLowerCase();
    }

    return userData;
}

const users = [];
for (let i = 0; i < 20; i++) {
    users.push(generateUserData());
}

const fs = require("fs");

const usersJSON = JSON.stringify(users);

fs.writeFile("users.json", usersJSON, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Users data saved to users.txt");
    }
});