const express = require('express');
const userModel = require('../models/userModel');
const contactModel = require('../models/contactModel');

const fs = require('fs');
const path = require('path');
const chatModel = require('../models/chatModel');

const router = express.Router()


router.post('/register', async (req, res) => {
    const data = new userModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        primEmail: req.body.primEmail,
        primPhone: req.body.primPhone,
        userName: req.body.userName,
        password: req.body.password,
    });

    // res.send(data.save());
    data.save()
        .then(savedData => {
            // res.json(savedData);
            res.json({ message: "successful" });
        })
        .catch(error => {
            if (error.name === 'MongoServerError' && error.code === 11000) {
                if (error.keyPattern.primEmail || error.keyPattern.userName) {
                    res.json({ ...error.keyPattern });
                } else {
                    res.status(500).json({ error: 'An internal server error occurred.' });
                }
            } else {
                console.error(error);
                res.status(500).json({ error: 'An internal server error occurred.', errorCode: error.code, errorName: error.name });
            }
        });
});

router.get('/login', async (req, res) => {
    try {
        if (req.session.user) {
            res.send({ loggedIn: true, user: req.session.user })
        }
        else {
            res.send({ loggedIn: false })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.post('/login', async (req, res) => {
    try {
        const data = await userModel.findOne({ "userName": req.body.userName });

        if (data) {
            if (data.password === req.body.password) {
                delete data._doc["password"];
                delete data._doc["__v"];
                req.session.user = { ...data._doc };
                res.send({ loggedIn: true, data: { ...data._doc } })
            }
            else {
                res.send({ password: "Password is incorrect" })
            }
        }
        else {
            res.send({ userName: "Username doesn't exist" })
        }
    }
    catch (error) {
        res.status(500).send({ message: error.message })
    }
});

router.delete('/logout', async (req, res) => {
    try {
        if (req.session) {
            res.clearCookie('userId');
            req.session.destroy(err => {
                if (err) {
                    res.send({ logout: false })
                } else {
                    res.send({ logout: true })
                }
            });
        } else {
            res.end()
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/upload-profile-image', async (req, res) => {
    try {
        const base64Image = req.body.image.replace(/^data:image\/jpeg;base64,/, ''); // Remove data URL prefix
        const imageBuffer = Buffer.from(base64Image, 'base64');
        const filePath = path.resolve(__dirname, '..', 'uploads', 'profile-image', req.session.user._id + '.jpg'); // Specify the directory to save the image

        // Write the image buffer to the local file system
        fs.writeFileSync(filePath, imageBuffer);

        // console.log('Image saved locally:', filePath);

        // Optionally, you can save the file path or perform other operations here

        res.status(200).json({ uploaded: true });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// router.post('/upload-contact-image', async (req, res) => {
//     try {
//         const base64Image = req.body.image.replace(/^data:image\/jpeg;base64,/, '');
//         const imageBuffer = Buffer.from(base64Image, 'base64');
//         const filePath = path.resolve(__dirname, '..', 'uploads', 'contact-image', req.body.fileName + '.jpg');
//         fs.writeFileSync(filePath, imageBuffer);
//         res.status(200).json({ uploaded: true });
//     } catch (error) {
//         console.error('Error uploading image:', error);
//         res.status(500).json({ error: 'Failed to upload image' });
//     }
// });

router.post('/addcontact', async (req, res) => {
    const data = new contactModel({
        owner: req.session.user._id,
        userName: req.body.userName,
    });

    data.save()
        .then(savedData => {
            // res.json(savedData);
            // res.json({ success: true, data: { ...savedData._doc } });
            res.json({ success: true });
        })
        .catch(error => console.error(error));
});

// router.put('/updatecontact', async (req, res) => {
//     try {

//         const unsetData = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value === ''));
//         const updateData = { ...req.body };
//         delete updateData['_id'];
//         // Remove keys from updateData if they exist in unsetData
//         Object.keys(unsetData).forEach((key) => {
//             if (key in updateData) {
//                 delete updateData[key];
//             }
//         });

//         const updatedData = await contactModel.updateOne(
//             { _id: req.body._id },
//             {
//                 $set: updateData,
//                 $unset: unsetData,
//             }
//         );
//         res.json({ data: updatedData })
//     }
//     catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// });

router.get('/contacts', async (req, res) => {
    try {
        const contacts = await contactModel.find({ owner: req.session.user._id }, 'userName');

        const usernames = contacts.map((contact) => contact.userName);

        const userDetails = await userModel.find({ userName: { $in: usernames } }, 'userName avatar online firstName lastName jobPos primPhone').sort({ firstName: 'asc', lastName: 'asc' });

        res.json({ data: userDetails });
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.post('/contact', async (req, res) => {
    try {
        const data = await userModel.findOne({ userName: req.body.userName }, 'secPhone primEmail secEmail bio bday twitter facebook linkedin pinterest google meeting');
        res.json({ data: data })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// router.get('/search', async (req, res) => {
//     try {
//         const regex = new RegExp(req.query.search, 'i'); // Create a case-insensitive regular expression pattern

//         let param = [];
//         if (isNaN(req.query.search))
//             param = [{ firstName: regex }, { lastName: regex }, { primEmail: regex }, { secEmail: regex }, { userName: regex }, { jobPos: regex }];
//         else
//             param = [{ primPhone: regex }, { secPhone: regex }, { primEmail: regex }, { secEmail: regex }, { userName: regex }, { jobPos: regex }];

//         // Search for contacts owned by the current user
//         const contacts = await contactModel.find({ owner: req.session.user._id }, 'userName');

//         const usernames = contacts.map((contact) => contact.userName);

//         // Search for users that match the search query in any of the specified fields (excluding text index)
//         const userDetails = await userModel
//             .find(
//                 {
//                     $and: [
//                         { userName: { $in: usernames } },
//                         { $or: param }
//                     ]
//                 },
//                 'userName avatar firstName lastName primPhone jobPos online'
//             )
//             .sort({ firstName: 'asc', lastName: 'asc' });

//         // Search for users that match the search query using text index (firstName and lastName fields)
//         const textUserDetails = await userModel
//             .find(
//                 {
//                     $text: { $search: req.query.search },
//                     userName: { $in: usernames }
//                 },
//                 'userName avatar firstName lastName primPhone jobPos online'
//             )
//             .sort({ firstName: 'asc', lastName: 'asc' });

//         // Combine the results from both queries
//         const combinedUserDetails = [...userDetails, ...textUserDetails].filter(
//             (value, index, self) => index === self.findIndex((u) => u.userName === value.userName)
//         );

//         res.json({ data: combinedUserDetails, userDetails: userDetails, textUserDetails: textUserDetails });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

router.get('/search', async (req, res) => {
    try {
        const regex = new RegExp(req.query.search, 'i');
        const param = isNaN(req.query.search)
            ? [{ firstName: regex }, { lastName: regex }, { primEmail: regex }, { secEmail: regex }, { userName: regex }, { jobPos: regex }]
            : [{ primPhone: regex }, { secPhone: regex }, { primEmail: regex }, { secEmail: regex }, { userName: regex }, { jobPos: regex }];

        const contacts = await contactModel.find({ owner: req.session.user._id }, 'userName');
        const usernames = contacts.map((contact) => contact.userName);

        const [userDetails, textUserDetails] = await Promise.all([
            userModel.find({
                $and: [
                    { userName: { $in: usernames } },
                    { $or: param }
                ]
            }, 'userName avatar firstName lastName primPhone jobPos online').sort({ firstName: 'asc', lastName: 'asc' }),
            userModel.find({
                $text: { $search: req.query.search },
                userName: { $in: usernames }
            }, 'userName avatar firstName lastName primPhone jobPos online').sort({ firstName: 'asc', lastName: 'asc' })
        ]);

        res.json({ data: [...userDetails, ...textUserDetails] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/sendchat', async (req, res) => {
    const data = new chatModel({
        sender: req.session.user["userName"],
        receiver: req.body.receiver,
        message: req.body.message,
        time: new Date().toISOString(),
    });

    data.save()
        .then(savedData => {
            // res.json(savedData);
            // res.json({ success: true, data: { ...savedData._doc } });
            res.json({ success: true, data: { ...savedData._doc } });
        })
        .catch(error => console.error(error));
});

router.post('/getchat', async (req, res) => {
    try {
        const data = await chatModel.find({
            $or: [
                {
                    $and: [
                        { sender: req.session.user.userName },
                        { receiver: req.body.selected }
                    ]
                },
                {
                    $and: [
                        { sender: req.body.selected },
                        { receiver: req.session.user.userName }
                    ]
                },
            ]
        }).sort({ time: 'asc'});

        res.json({ data: data });
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// router.put('/updateprofile', async (req, res) => {
//     try {
//         const unsetData = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => value === ''));
//         const updateData = { ...req.body };
//         delete updateData['_id'];
//         // Remove keys from updateData if they exist in unsetData
//         Object.keys(unsetData).forEach((key) => {
//             if (key in updateData) {
//                 delete updateData[key];
//             }
//         });

//         const resp = await userModel.updateOne(
//             { _id: req.session.user._id },
//             {
//                 $set: updateData,
//                 $unset: unsetData,
//             }
//         );

//         // console.log("Api called", updateData, unsetData);
//         req.session.user = { ...req.session.user, ...updateData };
//         res.json({ data: resp})
//     }
//     catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// });

// router.post('/addcontactdetails', async (req, res) => {
//     try {
//         const data = await userModel.findOne({ userName: req.body.userName }, 'userName avatar online firstName lastName jobPos primPhone secPhone primEmail secEmail');

//         res.json({ data: data });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// router.get('/user/:username', async (req, res) => {
//     try {
//         const data = await userModel.findOne({ "userName": req.params.username });
//         req.session.userName = data["userName"];
//         res.json(data)
//     }
//     catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// });

// //Update by ID Method
// router.patch('/update/:id', async (req, res) => {
//     try {
//         const id = req.params.id;
//         const updatedData = req.body;
//         const options = { new: true };

//         const result = await userModel.findByIdAndUpdate(
//             id, updatedData, options
//         )

//         res.send(result)
//     }
//     catch (error) {
//         res.status(400).json({ message: error.message })
//     }
// })

// //Delete by ID Method
// router.delete('/delete/:id', async (req, res) => {
//     try {
//         const id = req.params.id;
//         const data = await userModel.findByIdAndDelete(id)
//         res.send(`Document with ${data.name} has been deleted..`)
//     }
//     catch (error) {
//         res.status(400).json({ message: error.message })
//     }
// })

module.exports = router;