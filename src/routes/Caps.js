import express from "express"

import axios from 'axios'

import { FirbaseDatabase } from '../instances'


const CapsRoutes = express.Router();

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

CapsRoutes.post("/casps/addValue", async (req, res) => {
    const { a, b, c } = req.body

    FirbaseDatabase.ref(`casp/${a}`).set(JSON.stringify({ a, b, c })).then(value => {
        return res.json({ value, success: true })
    }).catch(err => {
        return res.json({ error: err, success: false }, 500)
    })
})

CapsRoutes.get("/casps/getValue", async (req, res) => {
    const { a } = req.query
    FirbaseDatabase.ref(`casp/${a}`).once("value", snapshot => {
        return res.json({ success: true, value: JSON.parse(snapshot.val()) })
    }).catch(err => {
        return res.json({ error: err, success: false }, 500)
    })
})

export { CapsRoutes }

