import { loggerArr as log } from '@/api/logger'
import Zones from '@/db/models/zones'
import redis from '@/db/redis'
import { zoneToStr } from '@/api/functions'

export async function getZones(req, res) {
  try {
    return res.status(200).json(
      await Zones.find({})
        .populate('core')
        .populate({ path: 'children', options: { retainNullValues: true } })
    )
  } catch (err) {
    log(5, req.user, `방송구간오류: ${err}`)
  }
}

export async function addZone(req, res) {
  try {
    const zone = new Zones({...req.body})
    const r = await zone.save()
    log(3, req.user, `방송구간추가: ${}`)
  } catch (err) {
    log(5, req.user, `방송구간추가오류: ${err}`)
    return res.status(500).json(err)
  }
}