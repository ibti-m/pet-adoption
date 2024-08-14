const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
    secret: 'mysecretkey', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

const loginFilePath = path.join(__dirname, 'data', 'login.txt');
const petInfoFilePath = path.join(__dirname, 'data', 'pet_info.txt');
const userFilePath = path.join(__dirname, 'login.txt');  


const readLoginFile = () => {
    if (!fs.existsSync(loginFilePath)) {
        return {};
    }
    const data = fs.readFileSync(loginFilePath, 'utf8');
    const users = {};
    data.split('\n').forEach(line => {
        if (line) {
            const [username, password] = line.split(':');
            users[username] = password;
        }
    });
    return users;
};

const writeLoginFile = (users) => {
    const data = Object.entries(users).map(([username, password]) => `${username}:${password}`).join('\n');
    fs.writeFileSync(loginFilePath, data, 'utf8');
};

const writePetInfoFile = (petInfo) => {
    fs.appendFileSync(petInfoFilePath, petInfo + '\n', 'utf8');
};

const insertHeaderFooter = (filePath, req, res) => {
    const header = fs.readFileSync(path.join(__dirname, 'views', 'header.html'), 'utf8');
    const footer = fs.readFileSync(path.join(__dirname, 'views', 'footer.html'), 'utf8');
    let content = fs.readFileSync(filePath, 'utf8');

    if (req.session.username) {
        content = content.replace('<!-- USERNAME PLACEHOLDER -->', `Logged in as: ${req.session.username}`);
    } else {
        content = content.replace('<!-- USERNAME PLACEHOLDER -->', 'Not logged in');
    }

    content = content.replace('<!-- HEADER PLACEHOLDER -->', header);
    content = content.replace('<!-- FOOTER PLACEHOLDER -->', footer);

    res.send(content);
};



app.get('/', (req, res) => {
    insertHeaderFooter(path.join(__dirname, 'views', 'question8.html'), req, res);
});

app.get('/find', (req, res) => {
    insertHeaderFooter(path.join(__dirname, 'views', 'find.html'), req, res);
});

app.get('/dogcare', (req, res) => {
    insertHeaderFooter(path.join(__dirname, 'views', 'dogcare.html'), req, res);
});

app.get('/catcare', (req, res) => {
    insertHeaderFooter(path.join(__dirname, 'views', 'catcare.html'), req, res);
});

app.get('/giveaway', (req, res) => {
    if (req.session.user) {
        const filePath = path.join(__dirname, 'views', 'giveaway.html');        
        insertHeaderFooter(filePath, req, res); 
    } else {
        res.redirect('/login');
    }

});


app.get('/contact', (req, res) => {
    insertHeaderFooter(path.join(__dirname, 'views', 'contact.html'), req, res);
});

app.get('/privacy', (req, res) => {
    insertHeaderFooter(path.join(__dirname, 'views', 'privacy.html'), req, res);
});

app.get('/login', (req, res) => {
    insertHeaderFooter(path.join(__dirname, 'views', 'login.html'), req, res);
});

app.get('/create-account', (req, res) => {
    insertHeaderFooter(path.join(__dirname, 'views', 'create-account.html'), req, res);
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.send(`
            <script>
                alert('Logout successful!');
                window.location.href = '/';
            </script>
        `);
    });
});



app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const credentials = fs.readFileSync('login.txt', 'utf-8').split('\n');
    const validCredentials = credentials.some(line => {
        const [fileUsername, filePassword] = line.split(':');
        return fileUsername === username && filePassword === password;
    });

    if (validCredentials) {
        req.session.user = username;
        res.json({ success: true, message: 'Login successful!' });
    } else {
        res.json({ success: false, message: 'Login failed. Please try again.' });
    }
});

app.post('/submit-pet', (req, res) => {
    const { username, catdog, catbreed, dogbreed, age, gender, getAlongWith, fname, lname, email, comment } = req.body;

    const petRecords = fs.readFileSync(petInfoFilePath, 'utf8').split('\n').filter(line => line);
    const nextPetId = petRecords.length + 1;

    const breed = catdog === 'cat' ? catbreed : dogbreed;

    const petInfo = `${nextPetId}:${username}:${catdog}:${breed}:${age}:${gender}:${Array.isArray(getAlongWith) ? getAlongWith.join(',') : getAlongWith}:${fname}:${lname}:${email}:${comment}`;

    writePetInfoFile(petInfo);
    res.send('Pet information submitted successfully!');
});


app.post('/find-pet', (req, res) => {
    const { catdog, catbreed, dogbreed, age, gender, getAlongWith } = req.body;
    const breed = catdog === 'cat' ? catbreed : dogbreed;

    const petRecords = fs.readFileSync(petInfoFilePath, 'utf8').split('\n').filter(line => line);
    const matchingPets = petRecords.filter(record => {
        const [id, username, petType, petBreed, petAge, petGender, petGetAlongWith, fname, lname, email, comment] = record.split(':');

        const matchType = catdog && catdog !== 'na' ? petType === catdog : true;
        const matchBreed = breed && breed !== 'na' ? petBreed === breed : true;
        const matchAge = age && age !== 'na' ? petAge === age : true;
        const matchGender = gender && gender !== 'na' ? petGender === gender : true;

        const getAlongWithArray = typeof getAlongWith === 'string' ? getAlongWith.split(',') : [];
        const petGetAlongWithArray = petGetAlongWith ? petGetAlongWith.split(',') : [];
        const matchGetAlongWith = getAlongWithArray.length > 0 ? getAlongWithArray.every(val => petGetAlongWithArray.includes(val)) : true;

        return matchType && matchBreed && matchAge && matchGender && matchGetAlongWith;
    }).map(pet => {
        const [id, username, petType, petBreed, petAge, petGender, petGetAlongWith, fname, lname, email, comment] = pet.split(':');
        return {
            type: petType,
            breed: petBreed,
            age: petAge,
            gender: petGender,
            getAlongWith: petGetAlongWith,
            ownerFirstName: fname,
            ownerLastName: lname,
            ownerEmail: email,
            comment: comment
        };
    });

    const headerContent = fs.readFileSync(path.join(__dirname, 'views', 'header.html'), 'utf8');
    const footerContent = fs.readFileSync(path.join(__dirname, 'views', 'footer.html'), 'utf8');

    let petsContent = '';
    if (matchingPets.length > 0) {
        matchingPets.forEach(pet => {
            petsContent += `
                <li>
                    Type: ${pet.type}. Breed: ${pet.breed}. Age: ${pet.age}. Gender: ${pet.gender},
                    Gets Along With: ${pet.getAlongWith}. Owner: ${pet.ownerFirstName} ${pet.ownerLastName},
                    Email: ${pet.ownerEmail}. Comment: ${pet.comment}
                </li><br>`;
        });
    } else {
        petsContent += '<li>No matching pets found.</li>';
    }

    const template = fs.readFileSync(path.join(__dirname, 'views', 'findPetResults.html'), 'utf8');
    const responseHtml = template
        .replace('@@HEADER@@', headerContent)
        .replace('@@FOOTER@@', footerContent)
        .replace('@@PETS@@', petsContent);

    res.send(responseHtml);
});

app.post('/create-account', (req, res) => {
    const { username, password } = req.body;

    if (!/^[a-zA-Z0-9]+$/.test(username) || password.length < 4 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        res.json({ success: false, message: 'Invalid username or password format.' });
        return;
    }

    const userRecords = fs.existsSync(userFilePath) ? fs.readFileSync(userFilePath, 'utf8').split('\n').filter(line => line) : [];
    const userExists = userRecords.some(record => record.split(':')[0] === username);

    if (userExists) {
        res.json({ success: false, message: 'Username already exists. Please choose a different username.' });
    } else {
        fs.appendFileSync(userFilePath, `${username}:${password}\n`);
        res.json({ success: true, message: 'Account created successfully. You are now ready to log in.' });
    }
});


app.post('/logout', (req, res) => {
    req.session.destroy(); 
    res.json({ success: true, message: 'Logout successful!' });
});

app.get('/session-info', (req, res) => {
    if (req.session.user) {
        res.json({ username: req.session.user });
    } else {
        res.json({ username: null });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});






