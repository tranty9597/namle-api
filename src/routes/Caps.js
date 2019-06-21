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
        FirbaseDatabase.ref(`casp/data/${a}`).set({
            value: JSON.stringify({ a, b, c }),
            status: 0
        }).then(value => {
            return res.json({ value, success: true })
        }).catch(err => {
            return res.json({ error: err, success: false }, 500)
        })
    }).catch(er => {
        return res.json({ message: "Unauthorized", success: false }, 401)
    })

})

CapsRoutes.get("/casps/close-value", async (req, res) => {
    const { a } = req.query
    const { token } = req.headers
    checkRequestToken(token).then(() => {
        FirbaseDatabase.ref(`casp/data/${a}/status`).set(0, value => {
            return res.json({ value, success: true })
        })
    }).catch(er => {
        return res.json({ message: "Unauthorized", success: false }, 401)
    })
})

CapsRoutes.get("/casps/getValue", async (req, res) => {
    const { a } = req.query
    const { token } = req.headers
    checkRequestToken(token).then(() => {
        FirbaseDatabase.ref(`casp/data/${a}`).once("value", snapshot => {
            const snapshotVal = snapshot.val()
            if (snapshotVal.status === 0) {
                FirbaseDatabase.ref(`casp/data/${a}/status`).set(1)
                FirbaseDatabase.ref(`casp/data/${a}/last-time`).set(new Date().getTime())
                return res.json({ success: true, value: JSON.parse(snapshotVal.value) })
            } else {

                FirbaseDatabase.ref(`casp/${a}/last-time`).once("value", snapshot => {
                    const time = new Date(snapshot.val()).getTime();
                    const now = new Date().getTime();
                    if (now - time > 3 * 60 * 60 * 1000) {
                        FirbaseDatabase.ref(`casp/data/${a}/status`).set(0)
                        return res.json({ success: true, value: JSON.parse(snapshotVal.value) })
                    } else {
                        return res.json({ success: false, message: "This cookie has been using!" })
                    }
                })

            }
        }).catch(err => {
            return res.json({ error: err, success: false }, 500)
        })
    }).catch(er => {
        return res.json({ message: "Unauthorized", success: false }, 401)
    })
})

export { CapsRoutes }

