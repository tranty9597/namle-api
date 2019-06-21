import cron from 'cron'

import { FirbaseDatabase } from '../instances'

export const CloseCookie = new cron.CronJob('* * * * *', function () {
    FirbaseDatabase.ref(`casp/data`)
        .once("value", snapshot => {
            snapshot.forEach(function (child) {
                FirbaseDatabase.ref(`casp/data/${child.key}/last-time`)
                    .once("value", smap => {
                        const time = new Date(smap.val()).getTime();
                        const now = new Date().getTime();
                        if (now - time > 3 * 60 * 60 * 1000) {
                            FirbaseDatabase.ref(`casp/data/${child.key}/status`).set(0)
                        }
                    })
            });
        })
}, null, true, 'America/Los_Angeles');