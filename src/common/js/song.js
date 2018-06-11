import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'
import {getMusicVkey} from 'api/singer'

export default class Song {
  // 一个类必须有constructor()方法，如果没有显式定义，一个空的constructor()方法会被默认添加。
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
// eslint-disable-next-line prefer-promise-reject-errors
          reject('no lyric')
        }
      })
    })
  }
}
export async function createSong(musicData) { // 封装 歌曲所需要的数据
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: await getSongURL(musicData.songmid).catch(function (err) {
    console('获取歌曲Vkey失败' + err)
  })
  })
}

function getSongURL(songmid) { // 获取歌曲路径
  // (songmid用于Vkey接口的songmid, strMediaMid用于Vkey接口的filename  *****此参数是歌曲的核心源****** )
  return new Promise((resolve, reject) => {
    /* resolve(getMusicVkey(songmid).then((res) => {
      return `http://dl.stream.qqmusic.qq.com/${res.data.items[0].filename}?guid=2512456516&vkey=${res.data.items[0].vkey}&uin=0&fromtag=66`
    })) */
    resolve(getMusicVkey(songmid).then((res) => {
      if (res.code === ERR_OK) {
        console.log(res)
        /* const svkey = res.data.items
        const songVkey = svkey[0].vkey
        console.log(songmid)
        console.log(songVkey) */
      }
    }))
  })
}

export function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
