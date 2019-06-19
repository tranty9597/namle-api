import express from "express"

import { FirbaseDatabase } from '../instances'

const CapsRoutes = express.Router();

CapsRoutes.post("/casps/set-token", async (req, res) => {
    const { token } = req.body
    FirbaseDatabase.ref(`casp/token`).set(token).then(value => {
        return res.json({ value, success: true })
    }).catch(err => {
        return res.json({ error: err, success: false }, 500)
    })
})


function checkRequestToken(token) {
    return new Promise((res, rej) => {
        FirbaseDatabase.ref(`casp/token`).once("value", snapshot => {
            if (snapshot.val() === token) {
                res()
            } else {
                rej()
            }
        })
    })

}

CapsRoutes.post("/casps/addValue", async (req, res) => {
    const { a, b, c } = req.body
    const { token } = req.headers
    checkRequestToken(token).then(() => {
        FirbaseDatabase.ref(`casp/${a}`).set(JSON.stringify({ a, b, c })).then(value => {
            return res.json({ value, success: true })
        }).catch(err => {
            return res.json({ error: err, success: false }, 500)
        })
    }).catch(er => {
        return res.json({ message: "Unauthorized", success: false }, 401)
    })

})

CapsRoutes.get("/casps/getValue", async (req, res) => {
    const { a } = req.query
    const { token } = req.headers
    checkRequestToken(token).then(() => {
        FirbaseDatabase.ref(`casp/${a}`).once("value", snapshot => {
            return res.json({ success: true, value: JSON.parse(snapshot.val()) })
        }).catch(err => {
            return res.json({ error: err, success: false }, 500)
        })
    }).catch(er => {
        return res.json({ message: "Unauthorized", success: false }, 401)
    })
})

export { CapsRoutes }

