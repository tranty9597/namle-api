import express from "express"

import axios from 'axios'

import { FirbaseDatabase } from '../instances'


const FBFriendRoute = express.Router();

const DF_ACCESS_TOKEN = "DF_TOKEN"


function getDfToken() {
    return new Promise((res, rej) => {
        FirbaseDatabase.ref(DF_ACCESS_TOKEN).once('value', (snapshot) => {
            res(snapshot.val())
        })
    })

}

async function fbRequestUrl(accessToken, uid) {

    const dfToken = await getDfToken();
    if (typeof accessToken === "undefined" || !accessToken) {
        accessToken = dfToken;
    }
    return `https://graph.facebook.com/v3.2/${uid}?access_token=${accessToken || DF_ACCESS_TOKEN}&debug=all&fields=friends.limit(5000)&format=json&method=get&pretty=0&suppress_http_code=1&transport=cors`
}

function getValueFromSnapshot(snapshot) {
    let data = snapshot.val()

    let ret = [];
    if (data) {
        snapshot.forEach(snap => {
            ret.push(snap.val())
        })
    }
    return ret
}

FBFriendRoute.get("/getFriends", async (req, res) => {
    const { uid, accessToken } = req.query

    const url = await fbRequestUrl(accessToken, uid);
    axios.get(url).then(async (response) => {
        const { data } = response.data.friends;
        await FirbaseDatabase.ref(`users/${uid}`).set(data);
        return res.json({ data, fromFacebook: true })
    }).catch(err => {

        FirbaseDatabase.ref(`users/${uid}`).once('value', snapshot => {
            const savedData = getValueFromSnapshot(snapshot);
            return res.json({ data: savedData, fromFacebook: false, fbError: err })
        }).catch(err => {

            res.json(err, 500)
        })
    })
})

FBFriendRoute.get("/friendGetable", async (req, res) => {
    const { uid, accessToken } = req.query

    const url = await fbRequestUrl(accessToken, uid);

    axios.get(url).then(async (response) => {
        const { data } = response.data.friends;
        await FirbaseDatabase.ref(`users/${uid}`).set(data);
        if (data.length > 0) {
            return res.json("success")
        } else {
            return res.json("failed")
        }
    }).catch(err => {
        FirbaseDatabase.ref(`users/${uid}`).once('value', snapshot => {
            const savedData = getValueFromSnapshot(snapshot);
            if (savedData.length > 0) {
                return res.json("success")
            } else {
                return res.json("failed")
            }
        }).catch(err => {
            res.json(err, 500)
        })
    })
})


FBFriendRoute.get("/setDfAccessToken", async (req, res) => {
    const { accessToken } = req.query;

    await FirbaseDatabase.ref(DF_ACCESS_TOKEN).set(accessToken)

    return res.json("ok");

})

FBFriendRoute.get("/fuck", async (req, res) => {
 

})

export { FBFriendRoute }

