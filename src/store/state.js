// 状态管理（状态树）
import {playMode} from 'common/js/config'

const state = {
  singer: {},
  playing: false,
  funllScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence, // 默认播放模式 顺序播放
  currentIndex: -1, // 歌曲index顺序
  disc: {} // 首页推荐歌曲列表详情
}
export default state
